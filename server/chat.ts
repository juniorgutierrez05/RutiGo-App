import 'dotenv/config';
import { pool } from './db.js';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatResponse {
  reply: string;
  suggestedPlaceIds: number[];
}

export async function handleChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  const preferredModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const modelsToTry = Array.from(new Set([preferredModel, 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro']));

  // 1. Obtener catálogo turístico real de la base de datos MySQL (Clever Cloud)
  let catalogContext = '';
  let availablePlaces: Array<{ id: number; name: string; municipality: string; category: string; description: string }> = [];

  try {
    const [rows] = await pool.execute(
      `SELECT p.id, p.name, m.name AS municipality, p.category, p.description, p.tag, p.price_note
       FROM places p
       JOIN municipalities m ON m.id = p.municipality_id
       WHERE p.deleted_at IS NULL
       LIMIT 30`
    );
    availablePlaces = rows as any[];
    catalogContext = availablePlaces
      .map(
        (p) =>
          `- [ID: ${p.id}] ${p.name} (${p.municipality}, Cat: ${p.category}): ${p.description}`
      )
      .join('\n');
  } catch (err) {
    console.warn('[RutiBot] No se pudo leer el catálogo para el prompt:', err);
  }

  // 2. Si hay clave GEMINI_API_KEY configurada, llamamos a Google Gemini Flash
  if (apiKey && apiKey.trim().length > 10) {
    const systemInstruction = `
Eres "Ruti", la iguana oficial con sombrero vueltiao y mochila viajera de RutiGo, la guía turística del Atlántico, Colombia.
Hablas con tono caribeño, cálido, acogedor, alegre y respetuoso (costeño amable: "¡Hola, mi gente!", "¡Qué vaina tan buena!", "Ajá, cuéntame", "pégate el viaje", etc., sin exagerar ni usar groserías).
Tu misión es recomendar experiencias, comida tradicional, planes de playa, ecoturismo y cultura en el departamento del Atlántico.

Lugares oficiales registrados en RutiGo:
${catalogContext}

Instrucciones de formato:
- Si mencionas uno de los lugares del catálogo anterior, incluye al final de tu recomendación la etiqueta [PLACE:id] con el ID numérico correspondiente (ejemplo: [PLACE:1], [PLACE:13]). Esto le permitirá a la aplicación mostrar la tarjeta interactiva con fotos y mapa al turista.
- Mantén tus respuestas concisas, dinámicas (máximo 2 a 3 párrafos cortos) y muy orientadas a la acción (precios aproximados, horarios, o qué plato probar).
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
              temperature: 0.7,
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

            // Limpiar las etiquetas [PLACE:X] del texto visible para que quede natural
            const cleanText = rawText.replace(/\[PLACE:\d+\]/g, '').trim();

            return {
              reply: cleanText,
              suggestedPlaceIds,
            };
          }
        } else {
          console.warn(`[RutiBot] Modelo ${currentModel} devolvió ${geminiRes.status}, intentando siguiente...`);
        }
      } catch (err) {
        console.warn(`[RutiBot] Error con modelo ${currentModel}:`, err);
      }
    }
  }

  // 3. Fallback inteligente en caso de no tener API Key o fallo de red
  return generateFallbackResponse(message, availablePlaces);
}

function generateFallbackResponse(
  message: string,
  places: Array<{ id: number; name: string; municipality: string; category: string; description: string }>
): ChatResponse {
  const query = message.toLowerCase();

  // Buscar por gastronomía
  if (query.includes('comer') || query.includes('comida') || query.includes('chicharron') || query.includes('arepa') || query.includes('hambre') || query.includes('gastronom')) {
    const foodPlaces = places.filter((p) => p.category === 'gastronomia' || p.name.includes('Chicharrón') || p.name.includes('Luruaco') || p.id === 1);
    return {
      reply: '¡Ajá, mi hermano! En el Atlántico el buen comer no se negocia. Si quieres probar el auténtico chicharrón crocante con bollo limpio, Baranoa es parada obligatoria. Y para la arepa de huevo con sabor tradicional campesino, ¡la parada en Luruaco junto a la laguna es una delicia total! También en Barranquilla el Caimán del Río en el Gran Malecón te ofrece de todo frente a la brisa.',
      suggestedPlaceIds: foodPlaces.slice(0, 3).map((p) => p.id),
    };
  }

  // Buscar por playas / mar / atardecer
  if (query.includes('playa') || query.includes('mar') || query.includes('atardecer') || query.includes('brisa') || query.includes('salgar') || query.includes('puerto')) {
    const seaPlaces = places.filter((p) => p.municipality === 'Puerto Colombia' || p.id === 8 || p.id === 7 || p.id === 4);
    return {
      reply: '¡Uy, qué sabrosura! Para tardear frente al mar Caribe nada le gana al Castillo de Salgar al caer el sol: la vista panorámica es de película. También te recomiendo darte una vuelta por el Muelle 1888 y el Malecón del Mar en Puerto Colombia, o maravillarte con la unión del río y el mar en Bocas de Ceniza.',
      suggestedPlaceIds: seaPlaces.slice(0, 3).map((p) => p.id),
    };
  }

  // Buscar por cultura / artesanías / Usiacurí
  if (query.includes('artesania') || query.includes('usiacuri') || query.includes('cultura') || query.includes('carnaval') || query.includes('mural') || query.includes('museo')) {
    const cultPlaces = places.filter((p) => p.municipality === 'Usiacurí' || p.id === 3 || p.id === 12);
    return {
      reply: '¡El Atlántico tiene un legado cultural bellísimo! Tienes que visitar Usiacurí, el "Pesebre del Atlántico": sus techos pintados de aves, la Casa Museo del poeta Julio Flórez y los tejidos en palma de iraca son un tesoro nacional. En Barranquilla tampoco te puedes perder el Museo del Carnaval para vivir la fiesta todo el año.',
      suggestedPlaceIds: cultPlaces.slice(0, 3).map((p) => p.id),
    };
  }

  // Buscar por planes familiares o niños
  if (query.includes('familia') || query.includes('niño') || query.includes('parque') || query.includes('fin de semana')) {
    const famPlaces = places.filter((p) => p.id === 1 || p.id === 2 || p.id === 7);
    return {
      reply: '¡Un plan en familia sale perfecto en el Gran Malecón del Río! Tienes zonas de juegos para niños, caminatas seguras y mucha brisa. Después pueden pasar a tomarse la foto familiar obligatoria en el monumento de la Ventana al Mundo con todos sus colores.',
      suggestedPlaceIds: famPlaces.slice(0, 3).map((p) => p.id),
    };
  }

  // Respuesta general de bienvenida y orientación
  const generalPlaces = places.slice(0, 2);
  return {
    reply: '¡Hola! Soy Ruti, tu guía del Atlántico. Conozco cada rincón desde Bocas de Ceniza hasta la Laguna de Luruaco. Cuéntame: ¿qué te provoca hacer hoy? ¿Buscas dónde comer rico, escaparte a la playa o descubrir rutas de artesanías?',
    suggestedPlaceIds: generalPlaces.map((p) => p.id),
  };
}
