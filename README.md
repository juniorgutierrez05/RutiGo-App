# RutiGo - Rutas Turísticas del Atlántico, Colombia 🌴🇨🇴

**RutiGo** es una aplicación móvil para organizar, descubrir y promocionar rutas turísticas en los 23 municipios del Departamento del Atlántico, Colombia, cubriendo las categorías de **Cultura, Gastronomía, Naturaleza e Historia**. Cuenta con mapas interactivos, geolocalización en tiempo real, búsqueda inteligente, cálculo de distancias por fórmula de Haversine y sistema colaborativo de valoraciones y reseñas con fotos.

---

## 🎨 Design System & Estética (React Native)

El diseño sigue estrictamente los tokens del sistema visual de **Google Stitch**:

* **Geometría y Radios:** Esquinas ultrasuaves (`rounded-[20px]`, `rounded-[28px]`, `rounded-[32px]`) y cápsulas completas (`rounded-full`).
* **Sombras Claymorphic:** Sombras cálidas y difusas generadas con dos capas externas y biseles con luz especular interna (`inset 0 3px 6px rgba(255,255,255,0.9)`), simulando volumen táctil 3D.
* **Paleta Caribeña:**
  * **Coral Mango (`#FF7A59` / `#FFB199`):** Identidad principal y categoría *Gastronomía*.
  * **Turquesa Caribe (`#00C2CB` / `#7FF0E0`):** Agua y acento secundario.
  * **Violeta Palma (`#7B61FF` / `#A895FF`):** Artesanías y categoría *Cultura*.
  * **Verde Sabana (`#2ECC71` / `#7BE9A8`):** Senderismo y categoría *Naturaleza*.
  * **Amarillo Sol (`#FFC93C` / `#FFE180`):** Patrimonio y categoría *Historia*.
* **Tipografía:** *Plus Jakarta Sans* para encabezados y números de display; *Manrope* para textos de lectura.

---

## 📱 Experiencia nativa

La entrada de producción es `expo-entry.js` y monta `src/App.native.tsx` directamente. La experiencia actual incluye catálogo de rutas y lugares, búsqueda, filtros por categoría, favoritos locales, perfil, mapa nativo de Google Maps, ubicación del dispositivo y navegación hacia el GPS externo.

No se usa WebView, React DOM, Vite ni Google Maps web.

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio e instalar dependencias

```bash
# Clonar proyecto
git clone https://github.com/tu-usuario/rutigo-atlantico.git
cd rutigo-atlantico

# Instalar paquetes npm
npm install
```

### 2. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto tomando como plantilla `.env.example`:

```env
# URL del backend accesible desde el dispositivo o emulador
EXPO_PUBLIC_API_URL=http://192.168.1.38:3001
```

### 3. Ejecutar la Aplicación

#### React Native con Expo:
```bash
# Arrancar Metro
npm start

# Para correr directamente en emulador Android
npx expo run:android

# Para correr en simulador iOS (macOS)
npx expo run:ios
```

---

## 🗄️ Modelo de datos

La app nativa consume el backend HTTP de `server/` mediante `/src/services/api.ts`:

```typescript
// Colecciones principales:
// users/{userId} -> { name, email, homeCity, avatarUrl, savedRoutes: [], savedPlaces: [] }
// routes/{routeId} -> { name, category, municipalities: [], durationEstimate, distanceKm, difficulty, coverImageUrl, placeIds: [], avgRating, reviewCount }
// places/{placeId} -> { name, description, category, municipality, location: { lat, lng }, schedule, images: [], avgRating, reviewCount }
// reviews/{reviewId} -> { placeId, userId, userName, userAvatar, rating, comment, photoUrl, createdAt }
// notifications/{notifId} -> { userId, type, title, body, read, relatedId, createdAt }
```

---

## 📍 Lugares del Atlántico Incluidos en el Prototipo

* **Usiacurí:** Macromurales en Techos de Aves, Iglesia Santo Domingo de Guzmán, Casa Museo Julio Flórez, Mirador de Cristal y Pozo Sagrado, Centro Artesanal Palma de Iraca.
* **Puerto Colombia:** Muelle Histórico y Plaza de los Inmigrantes, Malecón del Mar, Castillo de Salgar, Playas de Pradomar y Club de Surf.
* **Barranquilla:** Gran Malecón del Río, Mercado Caimán del Río, Bocas de Ceniza y Tajamar Occidental.
* **Baranoa:** Festival del Pastel de Pital de Megua, Ruta del Girasol & Sabana Viva.
* **Galapa:** Talleres tradicionales de máscaras del Carnaval de Barranquilla.
* **Piojó:** Senderos ecológicos del Cerro de la Vieja (Punto más alto del Atlántico).
