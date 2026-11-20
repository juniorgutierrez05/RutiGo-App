import { pool } from '../server/db';

export const NEW_MALLS = [
  // --- MALAMBO ---
  {
    name: 'Plaza Malambo Mall Comercial',
    description: 'Centro comercial local y punto de encuentro clave en Malambo para compras diarias, servicios bancarios, farmacia y comercio de conveniencia para la comunidad.',
    category: 'cultura',
    municipalityId: 22, // Malambo
    latitude: 10.853263,
    longitude: -74.783600,
    address: 'Calle 13 # 17-95, Malambo',
    schedule: 'Lunes a Sábado 8:00 AM - 8:00 PM · Domingo 9:00 AM - 6:00 PM',
    estimatedTime: '1 hora',
    tag: 'Centro Comercial Local',
    priceNote: 'Entrada libre / Parqueadero disponible',
    images: [
      { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80', altText: 'Plaza Malambo Mall Comercial' },
      { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80', altText: 'Locales comerciales en Malambo' }
    ],
  },
  {
    name: 'CC Plaza Malambo Mall',
    description: 'Centro de servicios y locales comerciales de cercanía en el sector de la Diagonal 18, con variedad de tiendas de artículos personales, telefonía y pagos.',
    category: 'cultura',
    municipalityId: 22, // Malambo
    latitude: 10.864129,
    longitude: -74.774826,
    address: 'Diagonal 18 # 17-51, Malambo',
    schedule: 'Lunes a Domingo 8:00 AM - 8:00 PM',
    estimatedTime: '1 hora',
    tag: 'Locales Comerciales & Servicios',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', altText: 'CC Plaza Malambo Mall Diagonal 18' },
    ],
  },
  {
    name: 'Plaza 10',
    description: 'Galería y pasaje comercial tradicional en el corazón de Malambo enfocado en calzado, confecciones locales, tecnología y compras ágiles.',
    category: 'cultura',
    municipalityId: 22, // Malambo
    latitude: 10.859466,
    longitude: -74.836035,
    address: 'Calle 10 # 12-57, Malambo',
    schedule: 'Lunes a Sábado 7:30 AM - 7:30 PM · Domingo 8:00 AM - 2:00 PM',
    estimatedTime: '45 min - 1 hora',
    tag: 'Galería Comercial & Compras',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=80', altText: 'Plaza 10 galería comercial Malambo' },
    ],
  },

  // --- SOLEDAD ---
  {
    name: 'Centro Comercial Nuestro Atlántico',
    description: 'Innovador formato outlet metropolitano ubicado sobre la troncal Murillo con conexión directa a Transmetro. Cuenta con marcas reconocidas a precios de descuento, salas de cine y plazoleta de comidas.',
    category: 'cultura',
    municipalityId: 10, // Soledad
    latitude: 10.920445,
    longitude: -74.799286,
    address: 'Avenida Murillo # 13-167, Soledad',
    schedule: 'Lunes a Domingo 9:00 AM - 9:00 PM',
    estimatedTime: '2 horas',
    tag: 'Centro Comercial Outlet & Descuentos',
    priceNote: 'Entrada libre / Acceso directo Transmetro',
    images: [
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Nuestro Atlántico Soledad' },
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Plazoleta Nuestro Atlántico' },
    ],
  },
  {
    name: 'Centro Comercial Metropolitano Soledad',
    description: 'Espacio comercial integral en Soledad que reúne hipermercado, servicios bancarios, locales de moda, papelería y plazoleta de comidas para la familia.',
    category: 'cultura',
    municipalityId: 10, // Soledad
    latitude: 10.924313,
    longitude: -74.797107,
    address: 'Carrera 28 # 58-148, Soledad',
    schedule: 'Lunes a Domingo 8:00 AM - 9:00 PM',
    estimatedTime: '1 a 2 horas',
    tag: 'Centro Comercial & Supermercado',
    priceNote: 'Entrada libre / Parqueadero disponible',
    images: [
      { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Metropolitano Soledad' },
    ],
  },
  {
    name: 'Portal de Soledad Centro Comercial',
    description: 'Centro comercial estratégico y práctico para diligencias, pagos, compras cotidianas y entretenimiento rápido con ambiente familiar en Soledad.',
    category: 'cultura',
    municipalityId: 10, // Soledad
    latitude: 10.911404,
    longitude: -74.802068,
    address: 'Carrera 14A # 63-64, Soledad',
    schedule: 'Lunes a Domingo 8:30 AM - 8:30 PM',
    estimatedTime: '1 a 2 horas',
    tag: 'Centro Comercial de Cercanía',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80', altText: 'Portal de Soledad Centro Comercial' },
    ],
  },

  // --- BARRANQUILLA (SUR Y CENTRO) ---
  {
    name: 'Centro Comercial Parque Alegra',
    description: 'Gran complejo comercial y de entretenimiento en el sur de Barranquilla sobre la Calle 30. Cuenta con almacenes por departamento Falabella, cines Cine Colombia, amplia terraza gastronómica y zona infantil.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.945130,
    longitude: -74.783030,
    address: 'Calle 30, Carrera 4B # 50, Barranquilla',
    schedule: 'Lunes a Domingo 9:00 AM - 9:00 PM',
    estimatedTime: '2 a 3 horas',
    tag: 'Centro Comercial Moderno & Cine',
    priceNote: 'Entrada libre / Parqueadero cubierto',
    images: [
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Parque Alegra en Barranquilla' },
      { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80', altText: 'Interior Parque Alegra Calle 30' },
    ],
  },
  {
    name: 'Centro Comercial Panorama',
    description: 'Tradicional centro comercial del suroriente sobre la Calle 30, reconocido por sus tiendas de calzado, vestuario, salas de cine Royal Films y opciones de comida rápida.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.989406,
    longitude: -74.778167,
    address: 'Calle 30 # 8 Esquina, Suroriente, Barranquilla',
    schedule: 'Lunes a Domingo 9:00 AM - 8:30 PM',
    estimatedTime: '1 a 2 horas',
    tag: 'Centro Comercial Tradicional & Cine',
    priceNote: 'Entrada libre / Plazoleta de comidas',
    images: [
      { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Panorama Barranquilla' },
    ],
  },
  {
    name: 'Centro Comercial Colombia',
    description: 'Punto comercial tradicional en pleno Centro Histórico de Barranquilla, especializado en comercio textil, tecnología, calzado y accesorios a precios muy competitivos.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.973351,
    longitude: -74.780792,
    address: 'Calle 34 # 43-118, Norte Centro Histórico, Barranquilla',
    schedule: 'Lunes a Sábado 8:00 AM - 7:00 PM',
    estimatedTime: '1 hora',
    tag: 'Comercio Tradicional & Centro Histórico',
    priceNote: 'Entrada libre / Acceso peatonal céntrico',
    images: [
      { url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Colombia Centro Histórico' },
    ],
  },
  {
    name: 'Portal del Prado Centro Comercial',
    description: 'Uno de los centros comerciales más concurridos y tradicionales de Barranquilla. Cuenta con dos amplios niveles comerciales, salas de cine Royal Films, hipermercado y variada plazoleta gastronómica.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.989556,
    longitude: -74.788740,
    address: 'Calle 53 # 46-192, Norte Centro Histórico, Barranquilla',
    schedule: 'Lunes a Domingo 9:00 AM - 9:00 PM',
    estimatedTime: '2 horas',
    tag: 'Centro Comercial & Restaurantes',
    priceNote: 'Entrada libre / Estación Transmetro Catedral cercana',
    images: [
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', altText: 'Portal del Prado Centro Comercial Barranquilla' },
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Pasillos y cine Portal del Prado' },
    ],
  },
  {
    name: 'Centro Comercial Americano',
    description: 'Punto comercial y de ocio clave en el suroccidente de Barranquilla sobre la Carrera 38. Dispone de supermercado Olímpica, salas de cine Cinemark, locales de moda y plazoleta de comidas.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.984963,
    longitude: -74.827117,
    address: 'Carrera 38 # 74-61, Suroccidente, Barranquilla',
    schedule: 'Lunes a Domingo 9:00 AM - 9:00 PM',
    estimatedTime: '2 horas',
    tag: 'Centro Comercial Familiar & Cine',
    priceNote: 'Entrada libre / Parqueadero cubierto',
    images: [
      { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Americano Barranquilla' },
    ],
  },

  // --- BARRANQUILLA (NORTE) ---
  {
    name: 'Centro Comercial UNICO Outlet',
    description: 'El outlet líder del norte de Barranquilla en el barrio Betania. Ofrece cientos de marcas de ropa, calzado y deportes con descuentos permanentes, cine Royal Films, supermercado y amplia zona de comidas.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.988667,
    longitude: -74.812312,
    address: 'Calle 74 # 38D-113, Betania, Barranquilla',
    schedule: 'Lunes a Domingo 9:00 AM - 9:00 PM',
    estimatedTime: '2 a 3 horas',
    tag: 'Centro Comercial Outlet & Cine',
    priceNote: 'Entrada libre / Gran zona de promociones',
    images: [
      { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial UNICO Outlet Barranquilla' },
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', altText: 'Marcas outlet en UNICO Barranquilla' },
    ],
  },
  {
    name: 'Centro Comercial Villa Country',
    description: 'Exclusivo mall clásico en el corazón del norte tradicional. Destaca por sus boutiques de alta moda, entidades bancarias, cafés ejecutivos y restaurantes de primer nivel.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.973772,
    longitude: -74.820767,
    address: 'Calle 78 # 53-70, Norte Centro Histórico, Barranquilla',
    schedule: 'Lunes a Sábado 9:00 AM - 8:30 PM · Domingo 10:00 AM - 7:00 PM',
    estimatedTime: '1 a 2 horas',
    tag: 'Centro Comercial Clásico & Boutiques',
    priceNote: 'Entrada libre / Parqueadero vigilado',
    images: [
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Villa Country Barranquilla' },
    ],
  },
  {
    name: 'Centro Comercial Plaza del Parque',
    description: 'Elegante centro comercial al aire libre ubicado en el exclusivo sector de Buenavista. Famoso por su arquitectura abierta rodeada de palmeras, restaurantes gourmet, heladerías artesanales y terrazas de cafés.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 11.015223,
    longitude: -74.826494,
    address: 'Calle 99 # 53-40, Riomar, Barranquilla',
    schedule: 'Lunes a Domingo 10:00 AM - 11:00 PM',
    estimatedTime: '2 horas',
    tag: 'Centro Comercial Gastronómico & Aire Libre',
    priceNote: 'Entrada libre / Zona pet-friendly y cafés',
    images: [
      { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', altText: 'Plaza del Parque terrazas y restaurantes' },
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Plaza del Parque Barranquilla' },
    ],
  },
  {
    name: 'C.C Blue Gardens',
    description: 'Moderno complejo comercial, corporativo y hotelero en Riomar. Cuenta con jardines interiores, fuentes de agua, salones de convenciones, hotel Hilton Garden Inn y restaurantes de negocios.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 11.015704,
    longitude: -74.830979,
    address: 'Carrera 53 # 100-50, Riomar, Barranquilla',
    schedule: 'Lunes a Domingo 9:00 AM - 9:00 PM',
    estimatedTime: '1 a 2 horas',
    tag: 'Centro Comercial Moderno & Hotel',
    priceNote: 'Entrada libre / Centro empresarial y hotelero',
    images: [
      { url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', altText: 'C.C Blue Gardens Barranquilla y hotel Hilton' },
    ],
  },
  {
    name: 'Centro Comercial Miramar',
    description: 'Alternativa comercial tranquila y residencial sobre la loma de Miramar. Incluye supermercado Éxito Vecino, tiendas de conveniencia, servicios de salud, farmacia y comidas.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.987745,
    longitude: -74.800001,
    address: 'Carrera 43 # 99-50, Norte Centro Histórico, Barranquilla',
    schedule: 'Lunes a Domingo 8:30 AM - 8:30 PM',
    estimatedTime: '1 hora',
    tag: 'Centro Comercial de Cercanía & Servicios',
    priceNote: 'Entrada libre / Supermercado',
    images: [
      { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Miramar Barranquilla' },
    ],
  },
  {
    name: 'Centro Comercial Plaza Norte',
    description: 'Centro comercial y empresarial en Riomar sobre la Carrera 65. Ofrece locales de tecnología, droguerías, oficinas de asesoría y servicios bancarios rápidos.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 11.005707,
    longitude: -74.795998,
    address: 'Carrera 65 # 86-191, Riomar, Barranquilla',
    schedule: 'Lunes a Sábado 8:00 AM - 8:00 PM',
    estimatedTime: '1 hora',
    tag: 'Centro Comercial & Servicios Empresariales',
    priceNote: 'Entrada libre',
    images: [
      { url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Plaza Norte Barranquilla' },
    ],
  },
  {
    name: 'Centro Comercial Gran Boulevard',
    description: 'Mall integrado con el Hotel Sonesta en el exclusivo sector de Villa Santos. Reúne locales comerciales, gimnasio de primer nivel, gastronomía y servicios ejecutivos.',
    category: 'cultura',
    municipalityId: 2, // Barranquilla
    latitude: 10.965427,
    longitude: -74.835164,
    address: 'Calle 106 # 50-67, Riomar, Barranquilla',
    schedule: 'Lunes a Domingo 9:00 AM - 8:30 PM',
    estimatedTime: '1 a 2 horas',
    tag: 'Centro Comercial & Hotel Villa Santos',
    priceNote: 'Entrada libre / Parqueadero cubierto',
    images: [
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', altText: 'Centro Comercial Gran Boulevard Villa Santos' },
    ],
  },
];

async function main() {
  console.log('--- Iniciando población de Centros Comerciales ---');
  
  // 1. Obtener lugares existentes
  const [existingRows] = await pool.execute<any[]>('SELECT id, name FROM places');
  const existingNames = new Set(
    existingRows.map((r: any) => r.name.toLowerCase().trim())
  );

  console.log(`Lugares actuales en BD: ${existingRows.length}`);

  let insertedCount = 0;
  let skippedCount = 0;

  for (const mall of NEW_MALLS) {
    const normName = mall.name.toLowerCase().trim();
    
    // Verificar si ya existe (coincidencia exacta o parcial relevante)
    const alreadyExists = Array.from(existingNames).some((name) => {
      if (name === normName) return true;
      if (normName.includes('buenavista') && name.includes('buenavista')) return true;
      if (normName.includes('carnaval') && name.includes('carnaval')) return true;
      if (normName.includes('gran plaza') && name.includes('gran plaza')) return true;
      if (normName.includes('viva') && name.includes('viva')) return true;
      if (normName.includes('mallplaza') && name.includes('mallplaza')) return true;
      return false;
    });

    if (alreadyExists) {
      console.log(`[OMITIDO - YA EXISTE]: ${mall.name}`);
      skippedCount++;
      continue;
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Rating aleatorio natural entre 4.5 y 4.9
      const rating = Number((4.5 + Math.random() * 0.4).toFixed(2));
      const reviews = Math.floor(10 + Math.random() * 35);

      const [result] = await conn.execute(
        `INSERT INTO places 
         (name, description, category, municipality_id, latitude, longitude,
          address, schedule, estimated_time, tag, price_note, average_rating, review_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mall.name,
          mall.description,
          mall.category,
          mall.municipalityId,
          mall.latitude,
          mall.longitude,
          mall.address,
          mall.schedule,
          mall.estimatedTime,
          mall.tag,
          mall.priceNote || 'Entrada libre',
          rating,
          reviews,
        ]
      );

      const placeId = (result as any).insertId;

      for (let i = 0; i < mall.images.length; i++) {
        const img = mall.images[i];
        await conn.execute(
          `INSERT INTO place_images (place_id, image_url, alt_text, sort_order)
           VALUES (?, ?, ?, ?)`,
          [placeId, img.url, img.altText || mall.name, i]
        );
      }

      await conn.commit();
      existingNames.add(normName);
      insertedCount++;
      console.log(`[INSERTADO ID ${placeId}]: ${mall.name} (${mall.address})`);
    } catch (err) {
      await conn.rollback();
      console.error(`[ERROR al insertar ${mall.name}]:`, err);
    } finally {
      conn.release();
    }
  }

  console.log(`\n--- Resumen de Población ---`);
  console.log(`Nuevos Centros Comerciales insertados: ${insertedCount}`);
  console.log(`Centros Comerciales omitidos (ya existían): ${skippedCount}`);

  const [totalRows] = await pool.execute<any[]>('SELECT count(*) as total FROM places');
  console.log(`Total de lugares en la BD ahora: ${totalRows[0].total}`);

  await pool.end();
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
