# RutiGo - Rutas Turísticas del Atlántico, Colombia 🌴🇨🇴

**RutiGo** es una aplicación móvil para organizar, descubrir y promocionar rutas turísticas en los 23 municipios del Departamento del Atlántico, Colombia, cubriendo las categorías de **Cultura, Gastronomía, Naturaleza e Historia**. Cuenta con mapas interactivos, geolocalización en tiempo real, búsqueda inteligente, cálculo de distancias por fórmula de Haversine y sistema colaborativo de valoraciones y reseñas con fotos.

---

## 🎨 Design System & Estética (Soft 3D / Claymorphism)

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

## 📱 Pantallas Implementadas

1. **Splash Screen:** Mascota 3D Iguana con sombrero vueltiao y mochila viajera, sol 3D volumétrico, y barra de carga caribeña.
2. **Onboarding (3 pasos):** Carrusel interactivo con ilustraciones 3D, badges de categorías, indicadores y botón de inicio.
3. **Autenticación (Login & Registro):** Formularios táctiles con validación, selector de municipios y botón de Google Sign-In.
4. **Inicio (Home):** Barra de estado departamental, buscador flotante, 4 categorías culturales, Hero Card de la ruta de la semana, carrusel de lugares cercanos y tip de la mascota.
5. **Explorar por Categoría:** Vista segmentada por Cultura, Gastronomía, Naturaleza e Historia, con filtros de municipios.
6. **Búsqueda & Historial:** Barra de búsqueda en vivo con etiquetas populares y gestión de búsquedas recientes.
7. **Resultados de Búsqueda:** Filtros por Todos, Rutas y Lugares con conteo dinámico y distancias.
8. **Detalle de Ruta:** Banner full-bleed, estadísticas (duración, km, dificultad, costo), puntos destacados, tips de viaje e itinerario secuencial interactivo.
9. **Detalle de Lugar:** Galería deslizable de fotografías, información práctica (dirección, horarios, tarifas), cálculo de distancia GPS en tiempo real y reseñas.
10. **Mapa Interactivo:** Mapa vectorizado del Departamento del Atlántico con pines 3D por categoría, beacon de ubicación GPS del usuario y tarjetas flotantes.
11. **Rutas Más Cercanas:** Ordenamiento automático de rutas según la proximidad geográfica del usuario.
12. **Comunidad & Reseñas:** Listado de valoraciones ciudadanas con fotos, fecha y opciones para editar/eliminar reseñas propias.
13. **Modal Calificar:** Selector interactivo de 1 a 5 estrellas, comentario y adjunto de fotografías.
14. **Perfil del Usuario:** Estadísticas de rutas recorridas, lugares favoritos y accesos directos.
15. **Favoritos (Guardados):** Pestañas separadas de Rutas y Lugares con persistencia.
16. **Configuración:** Preferencias de municipio base, notificaciones y caché offline.
17. **Notificaciones:** Centro de avisos de nuevas rutas, atardeceres y valoraciones.
18. **Recomendaciones Inteligentes:** Planes curados para fines de semana, atardeceres y aventura ecológica.

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
# ==========================================
# FIREBASE CONFIGURATION
# ==========================================
VITE_FIREBASE_API_KEY=AIzaSyTuClaveDeApiFirebase
VITE_FIREBASE_AUTH_DOMAIN=rutigo-atlantico.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rutigo-atlantico
VITE_FIREBASE_STORAGE_BUCKET=rutigo-atlantico.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# ==========================================
# GOOGLE MAPS PLATFORM
# ==========================================
VITE_GOOGLE_MAPS_API_KEY=AIzaSyTuClaveDeGoogleMaps
```

### 3. Ejecutar la Aplicación

#### Modo Web / Prototipo (Vite):
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

#### Modo React Native con Expo:
Para ejecutar en dispositivos móviles Android o iOS mediante **Expo Go**:
```bash
# Iniciar servidor de desarrollo de Expo
npx expo start

# Para correr directamente en emulador Android
npx expo run:android

# Para correr en simulador iOS (macOS)
npx expo run:ios
```

---

## 🗄️ Modelo de Datos Firestore

El servicio `/src/services/firebase.ts` incluye las funciones preparadas para conectar a **Cloud Firestore**:

```typescript
// Colecciones principales:
// users/{userId} -> { name, email, homeCity, avatarUrl, savedRoutes: [], savedPlaces: [] }
// routes/{routeId} -> { name, category, municipalities: [], durationEstimate, distanceKm, difficulty, coverImageUrl, placeIds: [], avgRating, reviewCount }
// places/{placeId} -> { name, description, category, municipality, location: { lat, lng }, schedule, images: [], avgRating, reviewCount }
// reviews/{reviewId} -> { placeId, userId, userName, userAvatar, rating, comment, photoUrl, createdAt }
// notifications/{notifId} -> { userId, type, title, body, read, relatedId, createdAt }
```

### Reglas de Seguridad Sugeridas (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /places/{placeId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /routes/{routeId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📍 Lugares del Atlántico Incluidos en el Prototipo

* **Usiacurí:** Macromurales en Techos de Aves, Iglesia Santo Domingo de Guzmán, Casa Museo Julio Flórez, Mirador de Cristal y Pozo Sagrado, Centro Artesanal Palma de Iraca.
* **Puerto Colombia:** Muelle Histórico y Plaza de los Inmigrantes, Malecón del Mar, Castillo de Salgar, Playas de Pradomar y Club de Surf.
* **Barranquilla:** Gran Malecón del Río, Mercado Caimán del Río, Bocas de Ceniza y Tajamar Occidental.
* **Baranoa:** Festival del Pastel de Pital de Megua, Ruta del Girasol & Sabana Viva.
* **Galapa:** Talleres tradicionales de máscaras del Carnaval de Barranquilla.
* **Piojó:** Senderos ecológicos del Cerro de la Vieja (Punto más alto del Atlántico).
