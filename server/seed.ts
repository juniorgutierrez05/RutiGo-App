import 'dotenv/config';
import { pool } from './db.js';

interface SeedMunicipality {
  name: string;
  department: string;
  latitude: number;
  longitude: number;
}

interface SeedPlace {
  key: string;
  name: string;
  description: string;
  category: 'cultura' | 'gastronomia' | 'naturaleza' | 'historia';
  municipalityName: string;
  latitude: number;
  longitude: number;
  address?: string;
  schedule?: string;
  estimatedTime?: string;
  tag?: string;
  priceNote?: string;
  images: { url: string; altText: string }[];
}

interface SeedRoute {
  name: string;
  subtitle: string;
  description: string;
  category: 'cultura' | 'gastronomia' | 'naturaleza' | 'historia';
  durationEstimate: string;
  distanceKm: number;
  difficulty: 'facil' | 'moderado' | 'avanzado';
  coverImageUrl: string;
  priceSuggested: string;
  tips: string;
  municipalityNames: string[];
  placeKeys: string[];
  highlights: string[];
}

const municipalitiesData: SeedMunicipality[] = [
  { name: 'Barranquilla', department: 'Atlántico', latitude: 10.9685, longitude: -74.7813 },
  { name: 'Puerto Colombia', department: 'Atlántico', latitude: 10.9882, longitude: -74.9554 },
  { name: 'Usiacurí', department: 'Atlántico', latitude: 10.7431, longitude: -74.9542 },
  { name: 'Tubará', department: 'Atlántico', latitude: 10.8765, longitude: -74.9754 },
  { name: 'Piojó', department: 'Atlántico', latitude: 10.7485, longitude: -75.1098 },
  { name: 'Baranoa', department: 'Atlántico', latitude: 10.7951, longitude: -74.9124 },
  { name: 'Galapa', department: 'Atlántico', latitude: 10.8987, longitude: -74.8876 },
  { name: 'Luruaco', department: 'Atlántico', latitude: 10.6121, longitude: -75.1432 },
  { name: 'Juan de Acosta', department: 'Atlántico', latitude: 10.8286, longitude: -75.0347 },
  { name: 'Sabanalarga', department: 'Atlántico', latitude: 10.6319, longitude: -74.9228 },
  { name: 'Soledad', department: 'Atlántico', latitude: 10.9185, longitude: -74.7645 },
  { name: 'Malambo', department: 'Atlántico', latitude: 10.8589, longitude: -74.7739 },
  { name: 'Polonuevo', department: 'Atlántico', latitude: 10.7789, longitude: -74.8562 },
  { name: 'Santo Tomás', department: 'Atlántico', latitude: 10.7583, longitude: -74.7578 },
  { name: 'Sabanagrande', department: 'Atlántico', latitude: 10.7933, longitude: -74.7572 },
  { name: 'Palmar de Varela', department: 'Atlántico', latitude: 10.7417, longitude: -74.7528 },
  { name: 'Ponedera', department: 'Atlántico', latitude: 10.6375, longitude: -74.7514 },
  { name: 'Campo de la Cruz', department: 'Atlántico', latitude: 10.3789, longitude: -74.8833 },
  { name: 'Candelaria', department: 'Atlántico', latitude: 10.4597, longitude: -74.8794 },
  { name: 'Manatí', department: 'Atlántico', latitude: 10.4489, longitude: -74.9578 },
  { name: 'Repelón', department: 'Atlántico', latitude: 10.4958, longitude: -75.1278 },
  { name: 'Santa Lucía', department: 'Atlántico', latitude: 10.3242, longitude: -74.9589 },
  { name: 'Suan', department: 'Atlántico', latitude: 10.3347, longitude: -74.8814 },
];

const placesData: SeedPlace[] = [
  // 1. Barranquilla
  {
    key: 'malecon_rio',
    name: 'Gran Malecón del Río',
    description: 'El espacio público y turístico más visitado de Colombia. Bordea el Río Magdalena con 5 kilómetros de gastronomía en Caimán del Río, zonas deportivas y atardeceres frente al agua.',
    category: 'naturaleza',
    municipalityName: 'Barranquilla',
    latitude: 11.0189,
    longitude: -74.7928,
    address: 'Vía 40 con Calle 78, Barranquilla',
    schedule: 'Lunes a Domingo 5:00 AM - 11:00 PM',
    estimatedTime: '2 a 3 horas',
    tag: 'Imperdible',
    priceNote: 'Entrada gratuita',
    images: [
      { url: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80', altText: 'Gran Malecón del Río Magdalena' },
      { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80', altText: 'Caimán del Río área gastronómica' },
    ],
  },
  {
    key: 'ventana_mundo',
    name: 'Monumento Ventana al Mundo',
    description: 'Monumento de 47 metros de altura construido con vidrios de colores de Tecnoglass. Es el símbolo contemporáneo de Barranquilla que narra la historia de progreso y apertura de la ciudad.',
    category: 'cultura',
    municipalityName: 'Barranquilla',
    latitude: 11.03308,
    longitude: -74.831406,
    address: 'Rotonda de la Circunvalar con Vía 40',
    schedule: 'Abierto 24 horas',
    estimatedTime: '45 minutos',
    tag: 'Ícono Urbano',
    priceNote: 'Acceso libre',
    images: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ventanalmundo.jpg/1280px-Ventanalmundo.jpg', altText: 'Monumento Ventana al Mundo iluminado' },
    ],
  },
  {
    key: 'museo_carnaval',
    name: 'Museo del Carnaval de Barranquilla',
    description: 'Espacio cultural interactivo dedicado a la fiesta folclórica más importante de Colombia, declarada Patrimonio Oral e Inmaterial de la Humanidad por la UNESCO. Exhibe los vestidos de las Reinas y la historia de las danzas.',
    category: 'cultura',
    municipalityName: 'Barranquilla',
    latitude: 10.9912,
    longitude: -74.7794,
    address: 'Carrera 54 # 49B-39, Barrio Abajo',
    schedule: 'Martes a Domingo 9:00 AM - 4:30 PM',
    estimatedTime: '1.5 horas',
    tag: 'Patrimonio UNESCO',
    priceNote: '$15.000 COP general',
    images: [
      { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80', altText: 'Trajes tradicionales del Carnaval de Barranquilla' },
    ],
  },
  {
    key: 'bocas_ceniza',
    name: 'Bocas de Ceniza & Tajamar',
    description: 'El impresionante punto geográfico donde las aguas marrones del Río Magdalena se encuentran y desembocan en el Mar Caribe. Paseo tradicional en tren artesanal y senderismo ecológico.',
    category: 'naturaleza',
    municipalityName: 'Barranquilla',
    latitude: 11.0964,
    longitude: -74.8519,
    address: 'Corregimiento Las Flores, Tajamar Occidental',
    schedule: 'Miércoles a Domingo 8:00 AM - 4:00 PM',
    estimatedTime: '3 horas',
    tag: 'Aventura Fluvial',
    priceNote: 'Paseo en trencito ~$20.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', altText: 'Desembocadura Bocas de Ceniza en el Caribe' },
    ],
  },

  // 2. Puerto Colombia
  {
    key: 'muelle_1888',
    name: 'Muelle de Puerto Colombia & Plaza Muelle 1888',
    description: 'Centro gastronómico y patrimonial internacional con arquitectura inspirada en los inmigrantes europeos y árabes que entraron a Colombia por el histórico muelle.',
    category: 'historia',
    municipalityName: 'Puerto Colombia',
    latitude: 10.9882,
    longitude: -74.9554,
    address: 'Plaza Principal frente a la playa, Puerto Colombia',
    schedule: 'Lunes a Domingo 10:00 AM - 11:00 PM',
    estimatedTime: '2 horas',
    tag: 'Patrimonio & Gastronomía',
    priceNote: 'Entrada libre al muelle',
    images: [
      { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', altText: 'Muelle histórico y atardecer en el mar' },
    ],
  },
  {
    key: 'castillo_salgar',
    name: 'Castillo de San Antonio de Salgar',
    description: 'Fortificación colonial construida en 1848 sobre un acantilado frente al mar Caribe. Ofrece miradores espectaculares, brisa marina y restaurante de cocina costeña.',
    category: 'historia',
    municipalityName: 'Puerto Colombia',
    latitude: 11.0211,
    longitude: -74.9283,
    address: 'Corregimiento de Salgar, Vía al Mar',
    schedule: 'Miércoles a Domingo 11:00 AM - 7:00 PM',
    estimatedTime: '1.5 horas',
    tag: 'Fortaleza Colonial',
    priceNote: 'Consumo voluntario en restaurante',
    images: [
      { url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80', altText: 'Castillo de Salgar sobre acantilados' },
    ],
  },
  {
    key: 'playas_pradomar',
    name: 'Playas de Pradomar & Sabanilla',
    description: 'El destino favorito para surfistas, deportes de viento y clubes de playa con gastronomía caribeña frente al mar abierto.',
    category: 'naturaleza',
    municipalityName: 'Puerto Colombia',
    latitude: 10.9986,
    longitude: -74.9689,
    address: 'Corredor costero de Pradomar',
    schedule: 'Abierto todos los días de día',
    estimatedTime: 'Medio día',
    tag: 'Sol y Playa',
    priceNote: 'Alquiler de carpas ~$30.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', altText: 'Oleaje y atardecer en Pradomar' },
    ],
  },

  // 3. Usiacurí
  {
    key: 'murales_usiacuri',
    name: 'Ruta de los Murales & Artesanías de Iraca',
    description: 'Pueblo pintoresco donde más de 80 fachadas y techos exhiben macromurales de aves y flora del bosque seco. Cuna de los maestros tejedores en fibra de palma de iraca.',
    category: 'cultura',
    municipalityName: 'Usiacurí',
    latitude: 10.7431,
    longitude: -74.9542,
    address: 'Calles del centro histórico, Usiacurí',
    schedule: 'Lunes a Domingo 8:00 AM - 6:00 PM',
    estimatedTime: '3 horas',
    tag: 'Pueblo Mágico',
    priceNote: 'Recorrido libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80', altText: 'Murales y arte callejero en Usiacurí' },
    ],
  },
  {
    key: 'casa_julio_florez',
    name: 'Casa Museo Poeta Julio Flórez',
    description: 'Monumento Nacional donde vivió y falleció el ilustre poeta romántico colombiano Julio Flórez. Conserva el mobiliario original, manuscritos y jardines floridos de inicios del siglo XX.',
    category: 'historia',
    municipalityName: 'Usiacurí',
    latitude: 10.7428,
    longitude: -74.9536,
    address: 'Calle 9 # 14-25, Usiacurí',
    schedule: 'Martes a Domingo 9:00 AM - 4:00 PM',
    estimatedTime: '1 hora',
    tag: 'Monumento Nacional',
    priceNote: '$8.000 COP con guía',
    images: [
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', altText: 'Casa patrimonial Julio Flórez' },
    ],
  },
  {
    key: 'reserva_luriza',
    name: 'Reserva Natural Luriza',
    description: 'Área protegida de bosque seco tropical con arroyos de aguas sulfatadas y medicinales. Ideal para senderismo ecológico y avistamiento de aves como el Mico Tití Cabeciblanco.',
    category: 'naturaleza',
    municipalityName: 'Usiacurí',
    latitude: 10.7258,
    longitude: -74.9689,
    address: 'Vereda Luriza, a 4 km del casco urbano',
    schedule: 'Fines de semana con reserva guiada',
    estimatedTime: '3 a 4 horas',
    tag: 'Ecoturismo',
    priceNote: '$25.000 COP con guía local',
    images: [
      { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', altText: 'Senderos en bosque seco tropical' },
    ],
  },

  // 4. Piojó & Tubará
  {
    key: 'mirador_piojo',
    name: 'Mirador Cerro de la Vieja (Piojó)',
    description: 'Ubicado en el punto más alto del departamento del Atlántico (514 metros sobre el nivel del mar). Ofrece un clima fresco, brisa constante y vista panorámica hasta el mar Caribe.',
    category: 'naturaleza',
    municipalityName: 'Piojó',
    latitude: 10.7485,
    longitude: -75.1098,
    address: 'Cerro de la Vieja, Piojó',
    schedule: 'Todos los días 6:00 AM - 6:00 PM',
    estimatedTime: '2 horas',
    tag: 'Cumbre del Atlántico',
    priceNote: 'Acceso gratuito',
    images: [
      { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', altText: 'Vista panorámica de montaña y valles' },
    ],
  },
  {
    key: 'piedra_pintada',
    name: 'Petroglifos de Piedra Pintada (Tubará)',
    description: 'Santuario arqueológico de la etnia Mokaná. Enormes rocas grabadas con figuras geométricas y zoomorfas milenarias en medio de una quebrada natural.',
    category: 'historia',
    municipalityName: 'Tubará',
    latitude: 10.8872,
    longitude: -74.9819,
    address: 'Vereda El Morro, Tubará',
    schedule: 'Visitas diurnas con guía comunitario',
    estimatedTime: '2.5 horas',
    tag: 'Arqueología Indígena',
    priceNote: '$10.000 COP aporte comunitario',
    images: [
      { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', altText: 'Petroglifos y naturaleza en Tubará' },
    ],
  },

  // 5. Luruaco & Baranoa
  {
    key: 'laguna_luruaco',
    name: 'Laguna de Luruaco & Ruta de la Arepa de Huevo',
    description: 'Cuna del Festival de la Arepa de Huevo tradicional. La laguna ofrece paseos en canoa, pesca deportiva y los paradores típicos gastronómicos más famosos del Atlántico.',
    category: 'gastronomia',
    municipalityName: 'Luruaco',
    latitude: 10.6121,
    longitude: -75.1432,
    address: 'Troncal de Occidente, Parador Turístico Luruaco',
    schedule: 'Lunes a Domingo 7:00 AM - 8:00 PM',
    estimatedTime: '2 horas',
    tag: 'Sabor Tradicional',
    priceNote: 'Platos típicos desde $6.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Gastronomía y cocina costeña' },
    ],
  },
  {
    key: 'chicharron_baranoa',
    name: 'Ruta Gastronómica del Chicharrón de Baranoa',
    description: 'Famoso corredor de tradición culinaria reconocido por el crocante chicharrón con bollo limpio y yuca al estilo campesino.',
    category: 'gastronomia',
    municipalityName: 'Baranoa',
    latitude: 10.7951,
    longitude: -74.9124,
    address: 'Vía La Cordialidad, Baranoa',
    schedule: 'Viernes a Domingo 9:00 AM - 7:00 PM',
    estimatedTime: '1.5 horas',
    tag: 'Plato Insignia',
    priceNote: 'Porciones desde $15.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', altText: 'Gastronomía típica del Caribe' },
    ],
  },
];

const routesData: SeedRoute[] = [
  {
    name: 'Ruta de la Brisa y el Mar Caribe',
    subtitle: 'Historia marítima y olas en Puerto Colombia',
    description: 'Un recorrido perfecto para conectar la historia de los inmigrantes en el Muelle 1888, contemplar los acantilados del Castillo de Salgar y disfrutar una tarde de brisa marina en Pradomar.',
    category: 'historia',
    durationEstimate: '4 a 5 horas',
    distanceKm: 18.5,
    difficulty: 'facil',
    coverImageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    priceSuggested: '$50.000 - $90.000 COP',
    tips: 'Lleva ropa fresca, bloqueador solar y llega antes de las 5:00 PM para no perderte el atardecer en el muelle.',
    municipalityNames: ['Puerto Colombia'],
    placeKeys: ['muelle_1888', 'castillo_salgar', 'playas_pradomar'],
    highlights: [
      'Caminar por el renovado Muelle de Puerto Colombia',
      'Fotografía panorámica en el Castillo de Salgar',
      'Atardecer playero con gastronomía del mar en Pradomar',
    ],
  },
  {
    name: 'Ruta del Poeta y la Palma de Iraca',
    subtitle: 'Artesanías, macromurales y naturaleza en Usiacurí',
    description: 'Explora el pesebre del Atlántico, camina entre techos pintados que forman colibríes gigantes, conoce el legado de Julio Flórez y respira aire puro en la reserva Luriza.',
    category: 'cultura',
    durationEstimate: '5 a 6 horas',
    distanceKm: 12.0,
    difficulty: 'facil',
    coverImageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
    priceSuggested: '$40.000 - $75.000 COP',
    tips: 'Lleva calzado cómodo para caminar calles empedradas y efectivo para comprar artesanías directamente a las familias tejedoras.',
    municipalityNames: ['Usiacurí'],
    placeKeys: ['murales_usiacuri', 'casa_julio_florez', 'reserva_luriza'],
    highlights: [
      'Comprar artesanías tejidas a mano en palma de iraca',
      'Visita guiada a la casa museo de Julio Flórez',
      'Senderismo ecológico en la reserva natural Luriza',
    ],
  },
  {
    name: 'Ruta del Río Magdalena y Tradición Caribe',
    subtitle: 'Modernidad y folclor en Barranquilla',
    description: 'Descubre el espíritu vibrante de Barranquilla: el paseo gastronómico frente al río en el Gran Malecón, la riqueza de las máscaras del Carnaval y la imponente Ventana al Mundo.',
    category: 'cultura',
    durationEstimate: '5 horas',
    distanceKm: 24.0,
    difficulty: 'facil',
    coverImageUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80',
    priceSuggested: '$45.000 - $80.000 COP',
    tips: 'Inicia por el Museo del Carnaval en la mañana y deja el Gran Malecón para la tarde cuando baje el sol.',
    municipalityNames: ['Barranquilla'],
    placeKeys: ['museo_carnaval', 'malecon_rio', 'ventana_mundo'],
    highlights: [
      'Ver trajes reales y danzas de la tradición carnavalera',
      'Pasear en el Gran Malecón con brisa del Río Magdalena',
      'Foto nocturna frente a los vidrios de colores de la Ventana al Mundo',
    ],
  },
  {
    name: 'Ruta Gastronómica: Sabores Auténticos',
    subtitle: 'El viaje del chicharrón y la arepa de huevo',
    description: 'El tour culinario imperdible de la cocina tradicional atlanticense. Desde el crocante chicharrón de Baranoa hasta la auténtica arepa de huevo a orillas de la laguna de Luruaco.',
    category: 'gastronomia',
    durationEstimate: '4 horas',
    distanceKm: 38.0,
    difficulty: 'facil',
    coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    priceSuggested: '$35.000 - $60.000 COP',
    tips: 'Ve con buen apetito; no olvides acompañar los platos con suero costeño y jugo de corozo recién hecho.',
    municipalityNames: ['Baranoa', 'Luruaco'],
    placeKeys: ['chicharron_baranoa', 'laguna_luruaco'],
    highlights: [
      'Probar el famoso chicharrón con yuca y bollo en Baranoa',
      'Comer la auténtica arepa de huevo frita al momento en Luruaco',
      'Vista panorámica de la Laguna de Luruaco',
    ],
  },
  {
    name: 'Ruta de las Cumbres y Arqueología Mokaná',
    subtitle: 'Naturaleza y petroglifos sagrados',
    description: 'Asciende al punto más alto del Atlántico en Piojó para disfrutar del mejor mirador natural, y adéntrate en la historia precolombina con los petroglifos indígenas de Piedra Pintada en Tubará.',
    category: 'naturaleza',
    durationEstimate: '6 horas',
    distanceKm: 29.0,
    difficulty: 'moderado',
    coverImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    priceSuggested: '$30.000 - $65.000 COP',
    tips: 'Usa tenis con buen agarre para los senderos y lleva termo de agua para hidratación durante la caminata.',
    municipalityNames: ['Piojó', 'Tubará'],
    placeKeys: ['mirador_piojo', 'piedra_pintada'],
    highlights: [
      'Vista de 360 grados desde el Cerro de la Vieja en Piojó',
      'Contacto con la herencia viva de los indígenas Mokaná',
      'Senderismo entre arroyos y bosques nativos',
    ],
  },
];

async function seed() {
  console.log('🚀 Iniciando semilla de datos turísticos de RutiGo...');
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Municipios
    console.log('📍 Sincronizando municipios del Atlántico...');
    const municipalityMap = new Map<string, number>();

    for (const m of municipalitiesData) {
      await conn.execute(
        `INSERT INTO municipalities (name, department, latitude, longitude)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           latitude = VALUES(latitude),
           longitude = VALUES(longitude)`,
        [m.name, m.department, m.latitude, m.longitude]
      );

      const [rows] = await conn.execute(
        'SELECT id FROM municipalities WHERE name = ? LIMIT 1',
        [m.name]
      );
      const list = rows as { id: number }[];
      if (list.length > 0) {
        municipalityMap.set(m.name, list[0].id);
      }
    }
    console.log(`✅ ${municipalityMap.size} municipios asegurados en la base de datos.`);

    // 2. Lugares turísticos
    console.log('🏛️ Insertando lugares turísticos...');
    const placeKeyToId = new Map<string, number>();

    for (const p of placesData) {
      const municipalityId = municipalityMap.get(p.municipalityName);
      if (!municipalityId) {
        console.warn(`⚠️ Municipio no encontrado para el lugar: ${p.name}`);
        continue;
      }

      // Buscar si ya existe por nombre
      const [existing] = await conn.execute(
        'SELECT id FROM places WHERE name = ? LIMIT 1',
        [p.name]
      );
      const existingList = existing as { id: number }[];

      let placeId: number;
      if (existingList.length > 0) {
        placeId = existingList[0].id;
        await conn.execute(
          `UPDATE places
           SET description = ?, category = ?, municipality_id = ?,
               latitude = ?, longitude = ?, address = ?, schedule = ?,
               estimated_time = ?, tag = ?, price_note = ?
           WHERE id = ?`,
          [
            p.description,
            p.category,
            municipalityId,
            p.latitude,
            p.longitude,
            p.address || null,
            p.schedule || null,
            p.estimatedTime || null,
            p.tag || null,
            p.priceNote || null,
            placeId,
          ]
        );
      } else {
        const [inserted] = await conn.execute(
          `INSERT INTO places
           (name, description, category, municipality_id, latitude, longitude,
            address, schedule, estimated_time, tag, price_note, average_rating, review_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.8, 12)`,
          [
            p.name,
            p.description,
            p.category,
            municipalityId,
            p.latitude,
            p.longitude,
            p.address || null,
            p.schedule || null,
            p.estimatedTime || null,
            p.tag || null,
            p.priceNote || null,
          ]
        );
        placeId = (inserted as { insertId: number }).insertId;
      }

      placeKeyToId.set(p.key, placeId);

      // Actualizar imágenes del lugar
      await conn.execute('DELETE FROM place_images WHERE place_id = ?', [placeId]);
      for (const [index, img] of p.images.entries()) {
        await conn.execute(
          'INSERT INTO place_images (place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
          [placeId, img.url, img.altText, index]
        );
      }
    }
    console.log(`✅ ${placeKeyToId.size} lugares turísticos registrados.`);

    // 3. Rutas turísticas
    console.log('🗺️ Configurando rutas temáticas...');
    for (const r of routesData) {
      const [existingRoute] = await conn.execute(
        'SELECT id FROM routes WHERE name = ? LIMIT 1',
        [r.name]
      );
      const routeList = existingRoute as { id: number }[];

      let routeId: number;
      if (routeList.length > 0) {
        routeId = routeList[0].id;
        await conn.execute(
          `UPDATE routes
           SET subtitle = ?, description = ?, category = ?, duration_estimate = ?,
               distance_km = ?, difficulty = ?, cover_image_url = ?, price_suggested = ?,
               tips = ?
           WHERE id = ?`,
          [
            r.subtitle,
            r.description,
            r.category,
            r.durationEstimate,
            r.distanceKm,
            r.difficulty,
            r.coverImageUrl,
            r.priceSuggested,
            r.tips,
            routeId,
          ]
        );
      } else {
        const [insertedRoute] = await conn.execute(
          `INSERT INTO routes
           (name, subtitle, description, category, duration_estimate, distance_km,
            difficulty, cover_image_url, price_suggested, tips, average_rating, review_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.9, 18)`,
          [
            r.name,
            r.subtitle,
            r.description,
            r.category,
            r.durationEstimate,
            r.distanceKm,
            r.difficulty,
            r.coverImageUrl,
            r.priceSuggested,
            r.tips,
          ]
        );
        routeId = (insertedRoute as { insertId: number }).insertId;
      }

      // Paradas de la ruta (route_places)
      await conn.execute('DELETE FROM route_places WHERE route_id = ?', [routeId]);
      for (const [stopOrder, placeKey] of r.placeKeys.entries()) {
        const placeId = placeKeyToId.get(placeKey);
        if (placeId) {
          await conn.execute(
            'INSERT INTO route_places (route_id, place_id, stop_order) VALUES (?, ?, ?)',
            [routeId, placeId, stopOrder + 1]
          );
        }
      }

      // Municipios de la ruta (route_municipalities)
      await conn.execute('DELETE FROM route_municipalities WHERE route_id = ?', [routeId]);
      for (const munName of r.municipalityNames) {
        const munId = municipalityMap.get(munName);
        if (munId) {
          await conn.execute(
            'INSERT INTO route_municipalities (route_id, municipality_id) VALUES (?, ?)',
            [routeId, munId]
          );
        }
      }

      // Puntos destacados (route_highlights)
      await conn.execute('DELETE FROM route_highlights WHERE route_id = ?', [routeId]);
      for (const [index, hl] of r.highlights.entries()) {
        await conn.execute(
          'INSERT INTO route_highlights (route_id, highlight, sort_order) VALUES (?, ?, ?)',
          [routeId, hl, index]
        );
      }
    }
    console.log(`✅ ${routesData.length} rutas temáticas creadas.`);

    await conn.commit();
    console.log('\n✨ ¡Semilla completada con éxito! La base de datos tiene todo el catálogo turístico cargado.');
  } catch (error) {
    await conn.rollback();
    console.error('❌ Error durante la ejecución de la semilla:', error);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
