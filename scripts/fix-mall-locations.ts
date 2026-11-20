import { pool } from '../server/db';

type MallLocationFix = {
  nameMatch: string;
  newName?: string;
  newAddress?: string;
  newDescription?: string;
  latitude: number;
  longitude: number;
};

const CORRECTIONS: MallLocationFix[] = [
  // --- SOLEDAD ---
  {
    nameMatch: 'Centro Comercial Carnaval',
    newAddress: 'Calle 30 (Autopista al Aeropuerto) # 13-65, Soledad',
    newDescription: 'Moderno centro comercial de gran formato sobre la Calle 30 (Autopista al Aeropuerto) en Soledad. Cuenta con salas de cine Royal Films, zona de comidas, supermercado Olímpica y variedad de marcas nacionales.',
    latitude: 10.906200,
    longitude: -74.770800,
  },
  {
    nameMatch: 'Centro Comercial Gran Plaza del Sol',
    newAddress: 'Calle 30 con Carrera 32 # 30-15, Soledad',
    newDescription: 'El complejo comercial más visitado de Soledad sobre la Calle 30. Cuenta con salas de cine Cinemark, almacenes de moda, hipermercado Éxito, amplia plazoleta de comidas y zonas recreativas familiares.',
    latitude: 10.926816,
    longitude: -74.780367,
  },
  {
    nameMatch: 'Centro Comercial Nuestro Atlántico',
    newAddress: 'Avenida Murillo # 13-167, Soledad',
    newDescription: 'Formato outlet metropolitano ubicado sobre la troncal Murillo frente al Portal de Soledad del Transmetro. Cuenta con marcas reconocidas con descuentos, salas de cine y plazoleta gastronómica.',
    latitude: 10.905200,
    longitude: -74.801800,
  },
  {
    nameMatch: 'Portal de Soledad Centro Comercial',
    newAddress: 'Carrera 14A # 63-64 (Calle 63), Soledad',
    latitude: 10.909670,
    longitude: -74.798430,
  },
  {
    nameMatch: 'Centro Comercial Metropolitano Soledad',
    newAddress: 'Carrera 28 # 58-148, Soledad',
    latitude: 10.924310,
    longitude: -74.796750,
  },

  // --- MALAMBO ---
  {
    nameMatch: 'Plaza Malambo Mall Comercial',
    newAddress: 'Calle 13 # 17-95, Malambo',
    latitude: 10.864626,
    longitude: -74.775436,
  },
  {
    nameMatch: 'CC Plaza Malambo Mall',
    newAddress: 'Diagonal 18 # 17-51, Malambo',
    latitude: 10.864129,
    longitude: -74.774826,
  },
  {
    nameMatch: 'Plaza 10',
    newAddress: 'Calle 10 # 12-57, Malambo',
    latitude: 10.860500,
    longitude: -74.772500,
  },

  // --- BARRANQUILLA (SUR Y CENTRO) ---
  {
    nameMatch: 'Centro Comercial Parque Alegra',
    newAddress: 'Calle 30, Carrera 4B # 50, Barranquilla',
    latitude: 10.945130,
    longitude: -74.783030,
  },
  {
    nameMatch: 'Centro Comercial Panorama',
    newAddress: 'Calle 30 con Carrera 8 Esquina, Suroriente, Barranquilla',
    latitude: 10.945390,
    longitude: -74.785140,
  },
  {
    nameMatch: 'Centro Comercial Colombia',
    newAddress: 'Calle 34 # 43-118, Norte Centro Histórico, Barranquilla',
    latitude: 10.982768,
    longitude: -74.778531,
  },
  {
    nameMatch: 'Portal del Prado Centro Comercial',
    newAddress: 'Calle 53 # 46-192, Norte Centro Histórico, Barranquilla',
    latitude: 10.989726,
    longitude: -74.788525,
  },
  {
    nameMatch: 'Centro Comercial Americano',
    newAddress: 'Carrera 38 # 74-61, Suroccidente, Barranquilla',
    latitude: 10.984870,
    longitude: -74.813510,
  },

  // --- BARRANQUILLA (NORTE) ---
  {
    nameMatch: 'Centro Comercial UNICO Outlet',
    newAddress: 'Calle 74 # 38D-113, Betania, Barranquilla',
    latitude: 10.988667,
    longitude: -74.812312,
  },
  {
    nameMatch: 'Centro Comercial Villa Country',
    newAddress: 'Calle 78 # 53-70, Barranquilla',
    latitude: 11.004300,
    longitude: -74.806260,
  },
  {
    nameMatch: 'Centro Comercial Viva Barranquilla',
    newAddress: 'Carrera 51B # 87-50, Riomar, Barranquilla',
    latitude: 11.006900,
    longitude: -74.821400,
  },
  {
    nameMatch: 'Centro Comercial Buenavista (1 y 2)',
    newAddress: 'Calle 98 # 52-115, Riomar, Barranquilla',
    latitude: 11.013300,
    longitude: -74.827500,
  },
  {
    nameMatch: 'Centro Comercial Mallplaza Buenavista',
    newAddress: 'Carrera 55 # 99-51, Riomar, Barranquilla',
    latitude: 11.013500,
    longitude: -74.828500,
  },
  {
    nameMatch: 'Centro Comercial Plaza del Parque',
    newAddress: 'Calle 99 # 53-40, Riomar, Barranquilla',
    latitude: 11.015100,
    longitude: -74.826300,
  },
  {
    nameMatch: 'C.C Blue Gardens',
    newAddress: 'Carrera 53 # 100-50, Riomar, Barranquilla',
    latitude: 11.016130,
    longitude: -74.831300,
  },
  {
    nameMatch: 'Centro Comercial Miramar',
    newAddress: 'Carrera 43 # 99-50, Loma de Miramar, Barranquilla',
    latitude: 11.003430,
    longitude: -74.835280,
  },
  {
    nameMatch: 'Centro Comercial Plaza Norte',
    newAddress: 'Carrera 65 # 86-191, Villa Carolina / Riomar, Barranquilla',
    latitude: 11.017900,
    longitude: -74.814500,
  },
  {
    nameMatch: 'Centro Comercial Gran Boulevard',
    newAddress: 'Calle 106 # 50-67, Villa Santos / Riomar, Barranquilla',
    latitude: 11.014076,
    longitude: -74.836533,
  },
];

async function run() {
  console.log('--- Corrigiendo coordenadas GPS y direcciones de Centros Comerciales ---');
  let updated = 0;

  for (const item of CORRECTIONS) {
    const [rows] = await pool.execute<any[]>(
      'SELECT id, name, latitude, longitude, address FROM places WHERE name LIKE ?',
      [`%${item.nameMatch}%`]
    );

    if (rows.length === 0) {
      console.warn(`[NO ENCONTRADO EN BD]: ${item.nameMatch}`);
      continue;
    }

    for (const row of rows) {
      const updates: string[] = ['latitude = ?', 'longitude = ?'];
      const params: any[] = [item.latitude, item.longitude];

      if (item.newAddress) {
        updates.push('address = ?');
        params.push(item.newAddress);
      }
      if (item.newDescription) {
        updates.push('description = ?');
        params.push(item.newDescription);
      }

      params.push(row.id);

      await pool.execute(
        `UPDATE places SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      console.log(
        `[ACTUALIZADO ID ${row.id}]: ${row.name}\n` +
        `  Anterior: ${row.latitude}, ${row.longitude} (${row.address})\n` +
        `  Nuevo:    ${item.latitude}, ${item.longitude} (${item.newAddress || row.address})\n`
      );
      updated++;
    }
  }

  console.log(`\n--- Fin de la corrección: ${updated} lugares corregidos con coordenadas reales ---`);
  await pool.end();
}

run().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
