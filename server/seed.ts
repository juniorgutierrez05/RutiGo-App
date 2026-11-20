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
  // 4. Soledad (Gastronomía, Historia y Compras)
  {
    key: 'plaza_butifarra_soledad',
    name: 'Plaza Central y Tradición de la Butifarra Soledeña',
    description: 'El corazón de la auténtica butifarra soledeña con denominación de origen y orgullo atlanticense. Disfruta de la butifarra tradicional recién cocida acompañada de bollo de yuca y limón en los puestos más emblemáticos de la plaza histórica.',
    category: 'gastronomia',
    municipalityName: 'Soledad',
    latitude: 10.9168,
    longitude: -74.7635,
    address: 'Plaza Central de Soledad, Cra 19 con Calle 15',
    schedule: 'Todos los días 8:00 AM - 10:00 PM',
    estimatedTime: '1 hora',
    tag: 'Patrimonio Culinario',
    priceNote: 'Porción desde $5.000 COP con bollo y limón',
    images: [
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Tradición gastronómica de la butifarra soledeña' },
    ],
  },
  {
    key: 'casa_museo_bolivar_soledad',
    name: 'Casa Museo Bolivariana de Soledad',
    description: 'Casona colonial del siglo XVIII declarada Monumento Nacional de Colombia donde se hospedó el Libertador Simón Bolívar en octubre de 1830 antes de su viaje a Santa Marta. Conserva muebles de época, cartas, documentos y reliquias de la gesta independentista.',
    category: 'historia',
    municipalityName: 'Soledad',
    latitude: 10.9172,
    longitude: -74.7641,
    address: 'Calle 14 # 19-32, Centro Histórico de Soledad',
    schedule: 'Martes a Domingo 9:00 AM - 5:00 PM',
    estimatedTime: '1.5 horas',
    tag: 'Monumento Nacional',
    priceNote: 'Entrada gratuita',
    images: [
      { url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80', altText: 'Casa Museo Bolivariana colonial en Soledad' },
    ],
  },
  {
    key: 'cc_gran_plaza_sol',
    name: 'Centro Comercial Gran Plaza del Sol',
    description: 'El complejo comercial y de entretenimiento más grande de Soledad. Cuenta con salas de cine Cinemark, almacenes de moda, hipermercado Éxito, amplia plazoleta de comidas y zonas recreativas familiares.',
    category: 'cultura',
    municipalityName: 'Soledad',
    latitude: 10.9325,
    longitude: -74.7812,
    address: 'Calle 30 # 30-19, Soledad',
    schedule: 'Lunes a Domingo 8:00 AM - 10:00 PM',
    estimatedTime: '2 horas',
    tag: 'Centro Comercial',
    priceNote: 'Entrada libre / Parqueadero disponible',
    images: [
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Gran Plaza del Sol en Soledad' },
    ],
  },
  {
    key: 'cc_carnaval_soledad',
    name: 'Centro Comercial Carnaval',
    description: 'Moderno centro comercial sobre la Calle 30 de Soledad frente al Parque Muvdi. Ofrece salas de cine Royal Films, zona de comidas rápidas, supermercado Olímpica y variedad de marcas nacionales.',
    category: 'cultura',
    municipalityName: 'Soledad',
    latitude: 10.9288,
    longitude: -74.7850,
    address: 'Calle 30 frente al Parque Muvdi, Soledad',
    schedule: 'Lunes a Domingo 9:00 AM - 9:00 PM',
    estimatedTime: '2 horas',
    tag: 'Centro Comercial & Ocio',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Carnaval de Soledad' },
    ],
  },
  {
    key: 'iglesia_san_antonio_soledad',
    name: 'Iglesia San Antonio de Padua',
    description: 'Templo colonial del siglo XVIII con una imponente torre campanario y arquitectura barroca colonial caribeña. Es el corazón religioso y punto de encuentro de las festividades patronales y culturales de Soledad.',
    category: 'cultura',
    municipalityName: 'Soledad',
    latitude: 10.9165,
    longitude: -74.7638,
    address: 'Frente a la Plaza Central, Soledad',
    schedule: 'Todos los días 7:00 AM - 7:00 PM',
    estimatedTime: '45 minutos',
    tag: 'Patrimonio Religioso',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1548625361-195fe57876a4?auto=format&fit=crop&w=1200&q=80', altText: 'Iglesia colonial San Antonio de Padua en Soledad' },
    ],
  },

  // 5. Malambo (Arqueología, Ecoturismo y Tradición)
  {
    key: 'parque_mokana_malambo',
    name: 'Parque de la Cultura Mokaná y Centro Arqueológico',
    description: 'Malambo es cuna de una de las civilizaciones alfareras más antiguas de América con más de 3.000 años de historia. El museo y parque conmemoran el legado indígena Mokaná con piezas cerámicas antropomorfas, herramientas ancestrales y exposiciones etnográficas.',
    category: 'historia',
    municipalityName: 'Malambo',
    latitude: 10.8592,
    longitude: -74.7735,
    address: 'Plaza Principal de Malambo, Calle 10 con Carrera 8',
    schedule: 'Lunes a Viernes 8:00 AM - 5:30 PM',
    estimatedTime: '1.5 horas',
    tag: 'Arqueología Indígena',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80', altText: 'Parque de la Cultura Mokaná en Malambo' },
    ],
  },
  {
    key: 'laguna_mesolandia_malambo',
    name: 'Laguna de Mesolandia',
    description: 'Hermoso cuerpo de agua natural conectado al Río Magdalena en Malambo. Es un refugio de aves migratorias, iguanas y flora de manglar de agua dulce, ideal para paseos ecológicos en bote y pesca deportiva artesanal.',
    category: 'naturaleza',
    municipalityName: 'Malambo',
    latitude: 10.8805,
    longitude: -74.7620,
    address: 'Sector Mesolandia, Malambo',
    schedule: 'Todos los días 6:00 AM - 6:00 PM',
    estimatedTime: '2 horas',
    tag: 'Ecoturismo Fluvial',
    priceNote: 'Paseos en canoa comunitaria desde $15.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', altText: 'Laguna de Mesolandia en Malambo' },
    ],
  },
  {
    key: 'corredor_yuca_malambo',
    name: 'Corredor Campesino de la Yuca y el Bollo de Malambo',
    description: 'Parada gastronómica obligatoria sobre la Vía Oriental. Malambo es reconocido por sus fértiles cultivos de yuca y la preparación tradicional de bollos de yuca, bollo limpio, mazamorra y queso costeño campesino recién elaborado.',
    category: 'gastronomia',
    municipalityName: 'Malambo',
    latitude: 10.8560,
    longitude: -74.7770,
    address: 'Vía Oriental km 4, Malambo',
    schedule: 'Todos los días 6:00 AM - 6:00 PM',
    estimatedTime: '45 minutos',
    tag: 'Gastronomía Campesina',
    priceNote: 'Bollos y pasabocas desde $2.500 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', altText: 'Bollos tradicionales de yuca en Malambo' },
    ],
  },

  // 6. Centros Comerciales de Barranquilla (Compras & Entretenimiento)
  {
    key: 'cc_buenavista',
    name: 'Centro Comercial Buenavista (1 y 2)',
    description: 'El complejo comercial más prestigioso del norte de Barranquilla, compuesto por dos etapas conectadas por un puente peatonal climatizado. Cuenta con cines Cinemark, tiendas de diseñador, supermercado Éxito y amplia oferta gastronómica internacional.',
    category: 'cultura',
    municipalityName: 'Barranquilla',
    latitude: 11.0118,
    longitude: -74.8267,
    address: 'Calle 98 # 52-115, Barranquilla',
    schedule: 'Lunes a Domingo 10:00 AM - 9:00 PM',
    estimatedTime: '2 a 3 horas',
    tag: 'Centro Comercial Premium',
    priceNote: 'Entrada libre / Parqueadero cubierto',
    images: [
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Buenavista en Barranquilla' },
    ],
  },
  {
    key: 'cc_viva_barranquilla',
    name: 'Centro Comercial Viva Barranquilla',
    description: 'El centro comercial más grande de la Región Caribe colombiana con más de 400 marcas, salas de Cine Colombia, parque de diversiones infantil Viva Park y su famosa terraza gastronómica al aire libre "Calle 87".',
    category: 'cultura',
    municipalityName: 'Barranquilla',
    latitude: 11.0069,
    longitude: -74.8214,
    address: 'Carrera 51B # 87-50, Barranquilla',
    schedule: 'Lunes a Domingo 9:00 AM - 9:00 PM',
    estimatedTime: '2 a 3 horas',
    tag: 'Centro Comercial & Ocio',
    priceNote: 'Entrada libre / Parqueadero disponible',
    images: [
      { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Viva Barranquilla terraza Calle 87' },
    ],
  },
  {
    key: 'cc_mallplaza_buenavista',
    name: 'Centro Comercial Mallplaza Buenavista',
    description: 'Moderno centro comercial interconectado con el complejo Buenavista. Integra tiendas Falabella, Homecenter, salas Cinemark XD y el exclusivo espacio gastronómico "El Mercado" con vista panorámica de la ciudad.',
    category: 'cultura',
    municipalityName: 'Barranquilla',
    latitude: 11.0135,
    longitude: -74.8285,
    address: 'Carrera 53 # 98-01, Barranquilla',
    schedule: 'Lunes a Domingo 10:00 AM - 9:00 PM',
    estimatedTime: '2 horas',
    tag: 'Centro Comercial Moderno',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Mallplaza Buenavista en Barranquilla' },
    ],
  },

  // 7. Restaurantes Icónicos de Barranquilla
  {
    key: 'restaurante_la_cueva',
    name: 'Restaurante Bar La Cueva',
    description: 'Mítico rincón bohemio y literario declarado Bien de Interés Cultural de la Nación. Fue el punto de tertulia del Grupo de Barranquilla con Gabriel García Márquez, Álvaro Cepeda Samudio y Alejandro Obregón. Ofrece cocina caribeña de autor con música en vivo y museo fotográfico.',
    category: 'gastronomia',
    municipalityName: 'Barranquilla',
    latitude: 10.9892,
    longitude: -74.7955,
    address: 'Carrera 43 # 59-03, Barrio Boston, Barranquilla',
    schedule: 'Martes a Domingo 12:00 PM - 11:00 PM',
    estimatedTime: '2 horas',
    tag: 'Patrimonio Literario & Gastronomía',
    priceNote: 'Platos fuertes desde $38.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', altText: 'Restaurante Bar La Cueva ambiente bohemio' },
    ],
  },
  {
    key: 'restaurante_narcobollo',
    name: 'Restaurante Tradicional Narcobollo',
    description: 'La institución gastronómica de la cocina popular costeña en Barranquilla. Famoso por sus desayunos típicos con carne desmechada, chicharrón crocante, higadilla, butifarras, suero con yuca y la mayor variedad de bollos calientes de maíz, ángel y yuca.',
    category: 'gastronomia',
    municipalityName: 'Barranquilla',
    latitude: 11.0028,
    longitude: -74.8105,
    address: 'Carrera 43 # 84-188, Barranquilla',
    schedule: 'Todos los días 6:00 AM - 10:00 PM',
    estimatedTime: '1 hora',
    tag: 'Cocina Típica Costeña',
    priceNote: 'Desayunos y fritos desde $12.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Desayunos tradicionales costeños en Narcobollo' },
    ],
  },
  {
    key: 'restaurante_cucayo',
    name: 'Restaurante Cucayo',
    description: 'Auténtico tributo a la comida casera del Caribe colombiano servida en calderos con arroz de cucayo crocante, posta cartagenera, sancocho de guandú con carne salada y fritos campesinos en una ambientación alegre y tradicional.',
    category: 'gastronomia',
    municipalityName: 'Barranquilla',
    latitude: 11.0062,
    longitude: -74.8231,
    address: 'Carrera 49C # 76-189, Barranquilla',
    schedule: 'Todos los días 11:30 AM - 9:30 PM',
    estimatedTime: '1.5 horas',
    tag: 'Cocina Criolla Caribeña',
    priceNote: 'Platos en caldero desde $32.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', altText: 'Arroz con cucayo y comida costeña en Cucayo' },
    ],
  },

  // 8. Ecoturismo y Nuevos Atractivos del Atlántico
  {
    key: 'cienaga_mallorquin',
    name: 'Ecoparque Ciénaga de Mallorquín',
    description: 'Impresionante ecoparque con más de 3 kilómetros de pasarelas de madera elevadas sobre el manglar de la ciénaga. Es ideal para avistamiento de aves marinas y migratorias, senderismo ecológico y contemplar los atardeceres frente a la brisa marina.',
    category: 'naturaleza',
    municipalityName: 'Barranquilla',
    latitude: 11.0560,
    longitude: -74.8450,
    address: 'Sector Las Flores / La Playa, Barranquilla',
    schedule: 'Martes a Domingo 6:00 AM - 6:00 PM',
    estimatedTime: '2.5 horas',
    tag: 'Ecoturismo & Manglares',
    priceNote: 'Entrada gratuita con registro previo',
    images: [
      { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', altText: 'Pasarelas del Ecoparque Ciénaga de Mallorquín' },
    ],
  },
  {
    key: 'zoologico_barranquilla',
    name: 'Zoológico de Barranquilla',
    description: 'El único zoológico de la región Caribe colombiana. Alberga más de 500 animales de 140 especies nativas y foráneas, incluyendo el manatí del Caribe, tigres, monos tití cabeciblancos y una hermosa finca interactiva para niños.',
    category: 'naturaleza',
    municipalityName: 'Barranquilla',
    latitude: 11.0040,
    longitude: -74.8015,
    address: 'Calle 77 # 68-40, Barrio Concepción',
    schedule: 'Martes a Domingo 9:00 AM - 5:00 PM',
    estimatedTime: '2 a 3 horas',
    tag: 'Plan Familiar & Fauna',
    priceNote: 'Entrada general $26.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80', altText: 'Fauna y naturaleza en el Zoológico de Barranquilla' },
    ],
  },
  {
    key: 'barrio_el_prado',
    name: 'Barrio Histórico y Arquitectónico El Prado',
    description: 'Declarado Monumento Nacional de Colombia, es una joya urbanística del siglo XX. Sus amplias avenidas arboladas albergan mansiones de estilos republicano, neoclásico, art déco y morisco, incluyendo el icónico Hotel El Prado.',
    category: 'cultura',
    municipalityName: 'Barranquilla',
    latitude: 10.9960,
    longitude: -74.8045,
    address: 'Carrera 54 con Calle 58, Barranquilla',
    schedule: 'Paseo peatonal libre 24 horas',
    estimatedTime: '1.5 horas',
    tag: 'Patrimonio Arquitectónico',
    priceNote: 'Recorrido libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80', altText: 'Mansiones históricas del barrio El Prado' },
    ],
  },
  {
    key: 'catedral_maria_reina',
    name: 'Plaza de la Paz y Catedral Metropolitana María Reina',
    description: 'El corazón cívico y espiritual de Barranquilla. La moderna catedral alberga el monumental Cristo Liberador Latinoamericano de 16 toneladas creado por Rodrigo Arenas Betancourt, frente a la amplia y vibrante Plaza de la Paz.',
    category: 'cultura',
    municipalityName: 'Barranquilla',
    latitude: 10.9870,
    longitude: -74.7925,
    address: 'Calle 53 con Carrera 45, Barranquilla',
    schedule: 'Lunes a Domingo 7:00 AM - 7:00 PM',
    estimatedTime: '1 hora',
    tag: 'Espacio Cívico & Sacro',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1548625361-195fe57876a4?auto=format&fit=crop&w=1200&q=80', altText: 'Catedral María Reina y Plaza de la Paz' },
    ],
  },
  {
    key: 'playas_santa_veronica',
    name: 'Playas y Casetas de Santa Verónica',
    description: 'Playas abiertas con brisa marina constante y olas ideales para el descanso y deportes náuticos. Famosas en todo el Atlántico por sus kioscos de mariscos frescos, pargo rojo frito, arroz con coco y patacones crocantes frente al mar.',
    category: 'naturaleza',
    municipalityName: 'Juan de Acosta',
    latitude: 10.8872,
    longitude: -75.0789,
    address: 'Santa Verónica, Juan de Acosta',
    schedule: 'Todos los días 7:00 AM - 6:00 PM',
    estimatedTime: '4 horas',
    tag: 'Playa & Pescado Frito',
    priceNote: 'Almuerzos típicos desde $28.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', altText: 'Playas y gastronomía en Santa Verónica' },
    ],
  },
  {
    key: 'petroglifos_tubara',
    name: 'Sendero Arqueológico Piedra Pintada y Mirador de Tubará',
    description: 'Sitio sagrado indígena Mokaná con petroglifos milenarios grabados en enormes rocas naturales en medio del bosque seco tropical. El mirador ofrece una panorámica espectacular de las colinas del Atlántico y el Mar Caribe.',
    category: 'historia',
    municipalityName: 'Tubará',
    latitude: 10.8790,
    longitude: -74.9810,
    address: 'Vereda El Morro, Tubará',
    schedule: 'Lunes a Domingo 7:00 AM - 5:00 PM',
    estimatedTime: '3 horas',
    tag: 'Arqueología & Senderismo',
    priceNote: 'Guianza comunitaria sugerida $20.000 COP',
    images: [
      { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', altText: 'Petroglifos indígenas en Piedra Pintada Tubará' },
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
  {
    name: 'Ruta Metropolitana: Sabores e Historia de Soledad y Malambo',
    subtitle: 'Butifarra soledeña, historia bolivariana y cultura Mokaná',
    description: 'Explora la riqueza metropolitana del Atlántico: degusta la auténtica butifarra en la Plaza Central de Soledad, visita la Casa Museo donde descansó Simón Bolívar y descubre la herencia alfarera indígena de 3.000 años en Malambo.',
    category: 'gastronomia',
    durationEstimate: '4 a 5 horas',
    distanceKm: 16.5,
    difficulty: 'facil',
    coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    priceSuggested: '$25.000 - $50.000 COP',
    tips: 'Acompaña las butifarras con limón y bollo de yuca caliente. El museo colonial abre hasta las 5:00 PM.',
    municipalityNames: ['Soledad', 'Malambo'],
    placeKeys: ['plaza_butifarra_soledad', 'casa_museo_bolivar_soledad', 'parque_mokana_malambo'],
    highlights: [
      'Probar la auténtica butifarra soledeña en la Plaza Central de Soledad',
      'Recorrer la histórica Casa Museo Bolivariana del Libertador',
      'Conocer la historia indígena Mokaná y alfarería ancestral en Malambo',
    ],
  },
  {
    name: 'Ruta Urbana, Compras y Vida Moderna de Barranquilla',
    subtitle: 'Centros comerciales, arquitectura de El Prado y alta cocina',
    description: 'Lo mejor del estilo de vida y entretenimiento moderno en Barranquilla. Recorre los centros comerciales Buenavista y Viva, admira las mansiones históricas del barrio El Prado y cena en el legendario restaurante La Cueva.',
    category: 'cultura',
    durationEstimate: '5 a 6 horas',
    distanceKm: 14.0,
    difficulty: 'facil',
    coverImageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    priceSuggested: '$60.000 - $120.000 COP',
    tips: 'Ideal para la tarde y noche. Buenavista y Viva cuentan con parqueaderos cubiertos y aire acondicionado completo.',
    municipalityNames: ['Barranquilla'],
    placeKeys: ['cc_buenavista', 'cc_viva_barranquilla', 'barrio_el_prado', 'restaurante_la_cueva'],
    highlights: [
      'Compras en las mejores marcas en el complejo Buenavista y Viva',
      'Paseo fotográfico por las mansiones republicanas del barrio El Prado',
      'Cena y tertulia caribeña en el mítico Restaurante Bar La Cueva',
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
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0)`,
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

    // 4. Semilla de Reseñas Reales de la Comunidad
    console.log('✍️ Registrando reseñas de muestra para atractivos turísticos...');
    const sampleUsers = [
      { name: 'Valentina Castro', email: 'valentina.castro@rutigo.co', city: 'Barranquilla' },
      { name: 'Andrés Cepeda M.', email: 'andres.cepeda@rutigo.co', city: 'Puerto Colombia' },
      { name: 'Camila Montoya', email: 'camila.montoya@rutigo.co', city: 'Usiacurí' }
    ];

    const userIds: number[] = [];
    for (const u of sampleUsers) {
      await conn.execute(
        `INSERT INTO users (name, email, role, status, home_city, auth_provider)
         VALUES (?, ?, 'tourist', 'active', ?, 'local')
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [u.name, u.email, u.city]
      );
      const [userRow] = await conn.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [u.email]);
      userIds.push((userRow as any[])[0].id);
    }

    const sampleReviews = [
      { placeKey: 'malecon_rio', userIdx: 0, rating: 5, comment: 'La brisa del río Magdalena al atardecer es inigualable. Gran oferta gastronómica en Caimán del Río y muy seguro para caminar en familia.' },
      { placeKey: 'malecon_rio', userIdx: 1, rating: 5, comment: 'Uno de los mejores espacios urbanos de Colombia. La iluminación nocturna y las zonas verdes están impecables.' },
      { placeKey: 'ventana_mundo', userIdx: 1, rating: 5, comment: 'Imponente monumento de colores. Es una parada obligatoria para fotos al entrar a Barranquilla.' },
      { placeKey: 'ventana_mundo', userIdx: 2, rating: 4, comment: 'Muy bonito y representativo de la ciudad. Recomiendo ir al caer la tarde cuando encienden las luces.' },
      { placeKey: 'museo_carnaval', userIdx: 0, rating: 5, comment: 'Mágica experiencia conociendo la historia de nuestras reinas y disfraces tradicionales. Muy didáctico.' },
      { placeKey: 'bocas_ceniza', userIdx: 1, rating: 5, comment: 'Ver el choque del río Magdalena con el mar Caribe en el tajamar es una experiencia sobrecogedora.' },
      { placeKey: 'muelle_puerto', userIdx: 2, rating: 5, comment: 'La reconstrucción del muelle y la nueva plaza gastronómica 1888 quedaron espectaculares.' },
      { placeKey: 'muelle_puerto', userIdx: 0, rating: 5, comment: 'Excelente ambiente colonial costero. La historia de la inmigración en Colombia se respira aquí.' },
      { placeKey: 'casa_julio_florez', userIdx: 0, rating: 5, comment: 'Usiacurí es hermoso. La casa del poeta conserva una atmósfera de paz, historia y poesía única.' },
      { placeKey: 'murales_macro', userIdx: 2, rating: 5, comment: 'Los techos pintados con aves y fauna del Caribe vistos desde el mirador son una obra de arte viva.' },
      { placeKey: 'mirador_cielo', userIdx: 1, rating: 5, comment: 'La vista de 360 grados de todo el Atlántico y el mar es impresionante. Aire puro y tranquilidad.' },
      { placeKey: 'centro_artesanal_iraca', userIdx: 0, rating: 5, comment: 'El trabajo de las tejedoras en palma de iraca es una joya artesanal. Vale totalmente la pena.' },
      { placeKey: 'plaza_tubara', userIdx: 2, rating: 4, comment: 'Pueblo lleno de historia ancestral Mokaná. Los artesanos y la iglesia colonial valen la visita.' },
      { placeKey: 'petroglifos_piedra_pintada', userIdx: 1, rating: 5, comment: 'Caminar por el sendero ecológico y ver los grabados indígenas de miles de años es fascinante.' },
      { placeKey: 'cerro_de_la_vieja', userIdx: 0, rating: 5, comment: 'El punto más alto del departamento. El clima es fresco y la panorámica del mar es inolvidable.' },
      { placeKey: 'parroquia_baranoa', userIdx: 2, rating: 4, comment: 'Hermosa arquitectura colonial en el corazón de Baranoa. Ambiente tranquilo y gente muy hospitalaria.' },
      { placeKey: 'laguna_luruaco', userIdx: 1, rating: 5, comment: 'Paseo en bote relajante y las mejores arepas de huevo tradicionales de la costa Caribe.' },
      { placeKey: 'taller_artesanal_mascaras', userIdx: 0, rating: 5, comment: 'Galapa es cuna del tallado en madera. Ver a los maestros crear las máscaras es un privilegio.' }
    ];

    for (const rev of sampleReviews) {
      const placeId = placeKeyToId.get(rev.placeKey);
      const uid = userIds[rev.userIdx];
      if (placeId && uid) {
        const [existing] = await conn.execute(
          'SELECT id FROM reviews WHERE user_id = ? AND place_id = ? LIMIT 1',
          [uid, placeId]
        );
        if ((existing as any[]).length === 0) {
          await conn.execute(
            'INSERT INTO reviews (user_id, place_id, rating, comment) VALUES (?, ?, ?, ?)',
            [uid, placeId, rev.rating, rev.comment]
          );
        }
      }
    }

    // Sincronizar review_count y average_rating en places con las reseñas reales
    await conn.execute(`
      UPDATE places p
      SET review_count = (SELECT COUNT(*) FROM reviews r WHERE r.place_id = p.id AND r.deleted_at IS NULL),
          average_rating = COALESCE((SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.place_id = p.id AND r.deleted_at IS NULL), 0.0)
    `);

    // Sincronizar review_count y average_rating en routes
    await conn.execute(`
      UPDATE routes r
      SET review_count = (SELECT COUNT(*) FROM reviews rv WHERE rv.route_id = r.id AND rv.deleted_at IS NULL),
          average_rating = COALESCE((SELECT ROUND(AVG(rv.rating), 1) FROM reviews rv WHERE rv.route_id = r.id AND rv.deleted_at IS NULL), 0.0)
    `);

    console.log(`✅ Reseñas registradas y conteos sincronizados al 100%.`);

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
