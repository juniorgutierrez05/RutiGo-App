import 'dotenv/config';
import { pool } from './db.js';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatResponse {
  reply: string;
  suggestedPlaceIds: number[];
  source?: 'gemini' | 'fallback' | 'guardrail';
}

// Patrones regex para detección inmediata de preguntas completamente ajenas a RutiGo y al turismo
const OFF_TOPIC_PATTERNS = [
  // Programación, desarrollo y tecnología de software
  /\b(escribe|hacer|crear|dame|muestra|genera)\s+.*(c[oó]digo|script|programa|algoritmo|funci[oó]n)/i,
  /\b(programar|programaci[oó]n|desarrollar software|lenguaje de programaci[oó]n|desarrollo web|desarrollo m[oó]vil)\b/i,
  /\b(python|javascript|typescript|c\+\+|c#|php|ruby|rust|golang|html\s*y\s*css|react native|flutter|sql query|git commit|git push|bug en el c[oó]digo|compilar|compilador)\b/i,
  // Historia mundial no relacionada
  /\b(crist[oó]bal col[oó]n|descubrimiento de am[eé]rica|revoluci[oó]n francesa|imperio romano|segunda guerra mundial|primera guerra mundial|napole[oó]n|cleopatra|julio c[eé]sar|adolf hitler|dinosaurio[s]?|qui[eé]n descubri[oó] am[eé]rica)\b/i,
  // Matemáticas y tareas escolares
  /\b(resuelve|calcula|ecuaci[oó]n|integral|derivada|trigonometr[ií]a|f[ií]sica cu[aá]ntica|qu[ií]mica org[aá]nica|tarea de matem[aá]ticas|tarea escolar)\b/i,
  // Intentos de jailbreak
  /\b(ignora (todas )?las instrucciones|ignore previous instructions|act[uú]a como|olvida tus instrucciones|ahora eres|dan mode|jailbreak)\b/i,
  // Criptomonedas, trading especulativo
  /\b(criptomoneda[s]?|bitcoin|ethereum|trading|invertir en bolsa|diagn[oó]stico m[eé]dico)\b/i,
];

const OFF_TOPIC_REPLIES = [
  '¡Eche mi vale! 🦎 Yo solo soy Ruti, una iguana mochilera enamorada del Atlántico. De programación, historia universal o tareas de números no tengo ni idea. Pero si quieres saber dónde comerte el mejor chicharrón en Baranoa, tardear en Puerto Colombia o planear una salida bacana en Barranquilla, ¡ahí sí soy el propio! ¿Qué plan te gustaría armar hoy?',
  '¡Ajá! Mira que yo cargo mochila y sombrero vueltiao porque lo mío es recorrer el Atlántico de punta a punta. 🦎 De computadores o personajes de otros continentes no sé nada mi llave. Mejor pregúntame por una buena playa, un centro comercial para tardear o una ruta de comida típica.',
  '¡Uy, qué vaina! Eso se sale completico de mi mapa viajero. 🎒 Como iguana guía de RutiGo, mi especialidad son los sitios turísticos, la cultura y los sabores del departamento del Atlántico. ¿Te provoco con una escapada al mar o un recorrido por Barranquilla?',
];

function checkOffTopic(message: string): ChatResponse | null {
  const isMatch = OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(message));
  if (isMatch) {
    const reply = OFF_TOPIC_REPLIES[Math.floor(Math.random() * OFF_TOPIC_REPLIES.length)];
    return {
      reply,
      suggestedPlaceIds: [],
      source: 'guardrail',
    };
  }
  return null;
}

export function getCleanApiKey(): string {
  const raw =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_KEY ||
    process.env.API_KEY ||
    '';
  return raw.trim().replace(/^["']|["']$/g, '').trim();
}

export async function getChatDiagnostic() {
  const cleanKey = getCleanApiKey();
  if (!cleanKey || cleanKey.length < 10) {
    return {
      ok: false,
      hasKey: false,
      reason: 'No hay API key configurada en las variables de entorno de Render (se buscó GEMINI_API_KEY, GOOGLE_API_KEY)',
    };
  }

  const model = 'gemini-1.5-flash';
  const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;

  try {
    const res = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Di únicamente: Ruti conectado' }] }],
      }),
    });

    const data = await res.json();
    return {
      ok: res.ok,
      status: res.status,
      keyPrefix: cleanKey.slice(0, 6) + '...' + cleanKey.slice(-4),
      keyLength: cleanKey.length,
      modelUsed: model,
      geminiResponse: data?.candidates?.[0]?.content?.parts?.[0]?.text || data,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message,
    };
  }
}

export async function handleChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  // 1. Bloqueo determinístico de preguntas fuera de tema (programación, tareas, etc.)
  const directRefusal = checkOffTopic(message);
  if (directRefusal) {
    return directRefusal;
  }

  const apiKey = getCleanApiKey();
  const preferredModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const modelsToTry = Array.from(new Set([preferredModel, 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']));

  // 2. Obtener catálogo turístico real de la base de datos MySQL (Clever Cloud)
  let catalogContext = '';
  let availablePlaces: Array<{ id: number; name: string; municipality: string; category: string; description: string; tag?: string; price_note?: string }> = [];

  try {
    const [rows] = await pool.execute(
      `SELECT p.id, p.name, m.name AS municipality, p.category, p.description, p.tag, p.price_note
       FROM places p
       JOIN municipalities m ON m.id = p.municipality_id
       WHERE p.deleted_at IS NULL
       LIMIT 100`
    );
    availablePlaces = rows as any[];
    catalogContext = availablePlaces
      .map(
        (p) =>
          `- [ID: ${p.id}] ${p.name} (${p.municipality}, Cat: ${p.category}${p.tag ? `, Tag: ${p.tag}` : ''}${p.price_note ? `, Precio: ${p.price_note}` : ''}): ${p.description}`
      )
      .join('\n');
  } catch (err) {
    console.warn('[RutiBot] No se pudo leer el catálogo para el prompt:', err);
  }

  // 3. Si hay clave GEMINI_API_KEY configurada, llamamos a Google Gemini Flash con creatividad y libertad
  if (apiKey && apiKey.length > 10) {
    const systemInstruction = `
Eres "Ruti", la simpática iguana con sombrero vueltiao y mochila viajera de RutiGo, la aplicación y guía turística oficial del departamento del Atlántico, Colombia.
Hablas con un tono costeño alegre, cálido, espontáneo, acogedor y sabroso ("¡Ajá!", "¡Qué vaina tan bacana!", "mi vale", "mi llave", "pégate la rodadita", "sabrosura pura", "dar una vuelta", etc., de forma natural, respetuosa y amena).

=== TU MISIÓN Y LIBERTAD CREATIVA ===
- Tienes total libertad para conversar y sugerir toda clase de planes: planes en pareja o románticos, planes con amigos, planes familiares con niños, salidas nocturnas, centros comerciales para ir de compras o al cine, tardes de café, restaurantes tradicionales, comida callejera, playas, ecoturismo, historia y festivales en el Atlántico.
- Conoces todos los municipios y rincones del departamento: Barranquilla, Puerto Colombia, Soledad (famosa por sus butifarras y la Casa de Bolívar), Malambo (rica en arqueología Mokaná y su laguna), Baranoa (el templo del chicharrón), Usiacurí (artesanías de iraca y murales), Luruaco, Tubará, Juan de Acosta, etc.
- Conoces también los centros comerciales más importantes (CC Buenavista, CC Viva, CC Mallplaza, Gran Plaza del Sol) y restaurantes icónicos (La Cueva, Narcobollo, Cucayo, Caimán del Río).
- Si te piden un plan romántico, una salida para tardear o una ruta de fin de semana, sé ingenioso, entusiasta y recomienda con detalle qué hacer, a qué hora ir y qué plato o bebida probar.

=== LÍMITES BÁSICOS ===
- Solo debes declinar amablemente si te piden explícitamente código de programación, tareas escolares de matemáticas o historia ajena a Colombia y al Caribe. En ese caso diles con picardía costeña que tú eres una iguana viajera y que lo tuyo es el turismo y el buen comer en el Atlántico.

=== CATÁLOGO OFICIAL DE LUGARES EN RUTIGO ===
${catalogContext}

=== INSTRUCCIONES DE FORMATO ===
- Si recomiendas o mencionas un lugar del catálogo oficial anterior, añade al final de tu recomendación la etiqueta [PLACE:id] con su ID numérico (ejemplo: [PLACE:1], [PLACE:12]). Esto genera automáticamente la tarjeta interactiva en la pantalla del usuario.
- Sé dinámico, amigable y conversacional (respuestas de 2 a 3 párrafos cortos).
    `.trim();

    // Convertir historial a formato Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const h of history.slice(-6)) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    for (const currentModel of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.75, // Libertad creativa y variedad conversacional
              maxOutputTokens: 600,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (rawText) {
            // Extraer los IDs de lugares mencionados [PLACE:X]
            const placeIdMatches = rawText.match(/\[PLACE:(\d+)\]/g) || [];
            const suggestedPlaceIds = Array.from(
              new Set(
                placeIdMatches
                  .map((m: string) => Number(m.replace(/\D/g, '')))
                  .filter((id: number) => availablePlaces.some((p) => p.id === id))
              )
            );

            // Limpiar las etiquetas [PLACE:X] del texto visible
            const cleanText = rawText.replace(/\[PLACE:\d+\]/g, '').trim();

            return {
              reply: cleanText,
              suggestedPlaceIds,
              source: 'gemini',
            };
          }
        } else {
          const errText = await geminiRes.text();
          console.warn(`[RutiBot] Modelo ${currentModel} devolvió ${geminiRes.status}: ${errText.slice(0, 160)}`);
        }
      } catch (err) {
        console.warn(`[RutiBot] Error con modelo ${currentModel}:`, err);
      }
    }
  }

  // 4. Fallback contextual dinámico si no hay conexión o falla la API de Gemini
  return generateFallbackResponse(message, availablePlaces);
}

function generateFallbackResponse(
  message: string,
  places: Array<{ id: number; name: string; municipality: string; category: string; description: string }>
): ChatResponse {
  // Normalizar removiendo tildes y pasando a minúsculas
  const query = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Planes románticos o en pareja
  if (
    query.includes('pareja') ||
    query.includes('romantico') ||
    query.includes('novia') ||
    query.includes('novio') ||
    query.includes('cita') ||
    query.includes('aniversario')
  ) {
    const romanticPlaces = places.filter(
      (p) =>
        p.name.toLowerCase().includes('salgar') ||
        p.name.toLowerCase().includes('muelle 1888') ||
        p.name.toLowerCase().includes('cueva') ||
        p.name.toLowerCase().includes('caiman')
    );
    return {
      reply:
        '¡Uy, qué plan tan especial, mi llave! Para una cita de película te recomiendo el Castillo de Salgar al atardecer: la vista panorámica del Caribe con una copa es insuperable. También pueden caminar por el Muelle 1888 en Puerto Colombia con la brisa marina, o disfrutar de una cena íntima con música en vivo y literatura en el mítico Restaurante Bar La Cueva.',
      suggestedPlaceIds: romanticPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // 2. Soledad y la Butifarra
  if (query.includes('soledad') || query.includes('butifarra')) {
    const soledadPlaces = places.filter((p) => p.municipality === 'Soledad' || p.name.toLowerCase().includes('butifarra'));
    return {
      reply:
        '¡Ajá, compae! En Soledad la tradición vibra en cada esquina. No puedes dejar de probar la auténtica butifarra soledeña con limón y bollo de yuca en la Plaza Central. Además, tienes que visitar la histórica Casa Museo Bolivariana donde reposó el Libertador Simón Bolívar, y para compras o cine, el Centro Comercial Gran Plaza del Sol te queda perfecto.',
      suggestedPlaceIds: soledadPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // 3. Malambo, arqueología Mokaná o laguna de Mesolandia
  if (query.includes('malambo') || query.includes('mokana') || query.includes('mesolandia')) {
    const malamboPlaces = places.filter((p) => p.municipality === 'Malambo' || p.name.toLowerCase().includes('malambo') || p.name.toLowerCase().includes('mokana'));
    return {
      reply:
        '¡Malambo tiene una historia milenaria fascinante! Es una de las cunas de la alfarería indígena más antiguas de América con su legado Mokaná en la Plaza Principal. También puedes relajarte con un paseo ecológico en la Laguna de Mesolandia o deleitarte en el corredor campesino de la yuca y el bollo caliente sobre la Vía Oriental.',
      suggestedPlaceIds: malamboPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // 4. Centros comerciales, compras y cine
  if (
    query.includes('centro comercial') ||
    query.includes('compras') ||
    query.includes('mall') ||
    query.includes('buenavista') ||
    query.includes('viva') ||
    query.includes('tienda') ||
    query.includes('cine')
  ) {
    const mallPlaces = places.filter(
      (p) =>
        p.name.toLowerCase().includes('buenavista') ||
        p.name.toLowerCase().includes('viva') ||
        p.name.toLowerCase().includes('plaza del sol') ||
        p.name.toLowerCase().includes('mallplaza')
    );
    return {
      reply:
        '¡Para compras, cine y entretenimiento en el Atlántico tenemos de todo! En el norte de Barranquilla están el Centro Comercial Buenavista y Mallplaza interconectados, y el imponente Viva Barranquilla con su terraza gastronómica Calle 87. En Soledad, el Centro Comercial Gran Plaza del Sol te ofrece cines y grandes marcas.',
      suggestedPlaceIds: mallPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // 5. Restaurantes específicos
  if (
    query.includes('la cueva') ||
    query.includes('narcobollo') ||
    query.includes('cucayo') ||
    query.includes('caiman del rio')
  ) {
    const restoPlaces = places.filter(
      (p) =>
        p.name.toLowerCase().includes('cueva') ||
        p.name.toLowerCase().includes('narcobollo') ||
        p.name.toLowerCase().includes('cucayo') ||
        p.name.toLowerCase().includes('caiman')
    );
    return {
      reply:
        '¡Para chuparse los dedos! En Barranquilla tienes el mítico Restaurante Bar La Cueva (patrimonio de Gabo y el Grupo de Barranquilla), el templo del desayuno costeño en Narcobollo y los arroces en caldero de Cucayo. Si prefieres variedad frente a la brisa del río, Caimán del Río en el Malecón tiene más de 25 restaurantes increíbles.',
      suggestedPlaceIds: restoPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // 6. Gastronomía general
  if (
    query.includes('comer') ||
    query.includes('comida') ||
    query.includes('chicharron') ||
    query.includes('arepa') ||
    query.includes('hambre') ||
    query.includes('gastronom') ||
    query.includes('restaurante') ||
    query.includes('plato')
  ) {
    const foodPlaces = places.filter(
      (p) =>
        p.category === 'gastronomia' ||
        p.name.toLowerCase().includes('chicharron') ||
        p.name.toLowerCase().includes('luruaco') ||
        p.name.toLowerCase().includes('narcobollo')
    );
    return {
      reply:
        '¡Ajá, mi hermano! En el Atlántico el buen comer no se negocia. Si quieres probar el auténtico chicharrón crocante con bollo limpio, Baranoa es parada obligatoria. Y para la arepa de huevo con sabor tradicional campesino, ¡la parada en Luruaco junto a la laguna es una delicia total! También en Barranquilla el Caimán del Río en el Gran Malecón te ofrece de todo frente a la brisa.',
      suggestedPlaceIds: foodPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // 7. Playas y mar
  if (
    query.includes('playa') ||
    query.includes('mar') ||
    query.includes('atardecer') ||
    query.includes('brisa') ||
    query.includes('salgar') ||
    query.includes('puerto colombia') ||
    query.includes('puerto') ||
    query.includes('muelle') ||
    query.includes('veronica')
  ) {
    const seaPlaces = places.filter(
      (p) =>
        p.municipality === 'Puerto Colombia' ||
        p.name.toLowerCase().includes('veronica') ||
        p.name.toLowerCase().includes('ceniza')
    );
    return {
      reply:
        '¡Uy, qué sabrosura! Para tardear frente al mar Caribe nada le gana al Castillo de Salgar al caer el sol: la vista panorámica es de película. También te recomiendo darte una vuelta por el Muelle 1888 y el Malecón del Mar en Puerto Colombia, o disfrutar de las playas y el pescado frito en Santa Verónica.',
      suggestedPlaceIds: seaPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // 8. Cultura y artesanías
  if (
    query.includes('artesania') ||
    query.includes('usiacuri') ||
    query.includes('cultura') ||
    query.includes('carnaval') ||
    query.includes('mural') ||
    query.includes('museo') ||
    query.includes('galapa') ||
    query.includes('iraca')
  ) {
    const cultPlaces = places.filter(
      (p) =>
        p.municipality === 'Usiacurí' ||
        p.name.toLowerCase().includes('carnaval') ||
        p.name.toLowerCase().includes('prado')
    );
    return {
      reply:
        '¡El Atlántico tiene un legado cultural bellísimo! Tienes que visitar Usiacurí, el "Pesebre del Atlántico": sus techos pintados de aves, la Casa Museo del poeta Julio Flórez y los tejidos en palma de iraca son un tesoro nacional. En Barranquilla tampoco te puedes perder el Museo del Carnaval ni la arquitectura histórica del barrio El Prado.',
      suggestedPlaceIds: cultPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // 9. Planes familiares o niños
  if (
    query.includes('familia') ||
    query.includes('nino') ||
    query.includes('parque') ||
    query.includes('zoologico') ||
    query.includes('fin de semana')
  ) {
    const famPlaces = places.filter(
      (p) =>
        p.name.toLowerCase().includes('zoologico') ||
        p.name.toLowerCase().includes('malecon') ||
        p.name.toLowerCase().includes('ventana')
    );
    return {
      reply:
        '¡Un plan en familia sale perfecto en el Zoológico de Barranquilla conociendo a los animales y la granja! Luego pueden pasar al Gran Malecón del Río para que los niños jueguen con la brisa del agua y cerrar tomándose la foto familiar en la colorida Ventana al Mundo.',
      suggestedPlaceIds: famPlaces.slice(0, 3).map((p) => p.id),
      source: 'fallback',
    };
  }

  // Respuesta turística variada (no el mismo saludo repetitivo)
  const samplePlaces = places.slice(0, 3);
  return {
    reply:
      '¡Qué buen plan armar un paseo por el Atlántico! 🦎🎒 Cuéntame un poco más: ¿te provoca tardear con brisa frente al mar en Puerto Colombia, comerte algo bien rico en Barranquilla o Baranoa, o descubrir los pueblitos culturales como Usiacurí o Soledad? ¡Dime qué tipo de plan buscas y te armo el recorrido de una!',
    suggestedPlaceIds: samplePlaces.map((p) => p.id),
    source: 'fallback',
  };
}
