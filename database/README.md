# Persistencia de RutiGo

Esta carpeta contiene la primera versión del modelo relacional para llevar RutiGo de prototipo a producción.

## Recomendación de infraestructura

Para este alcance, MySQL 8 en Clever Cloud es una opción válida y económica. La arquitectura recomendada es:

```text
Aplicación web/móvil -> API backend -> MySQL en Clever Cloud
                                      -> almacenamiento de imágenes
```

La aplicación no debe conectarse directamente a MySQL. El backend debe encargarse de autenticación, autorización, validación, CRUD, paginación, subida de imágenes y consultas. Las credenciales de MySQL deben existir únicamente como variables de entorno del backend.

Para imágenes, conviene usar un almacenamiento de objetos como Cloudinary, Amazon S3 o Cloudflare R2. En MySQL se guardan solamente las URL, el texto alternativo y el orden de cada imagen.

## Por qué MySQL

- El dominio tiene relaciones claras: rutas contienen lugares, usuarios guardan rutas/lugares y las reseñas pertenecen a un usuario y a un destino.
- Las restricciones y claves foráneas ayudan a evitar datos huérfanos.
- El CRUD administrativo, filtros por municipio/categoría y reportes son consultas naturales en SQL.
- Clever Cloud puede alojar MySQL, pero la API debería desplegarse como una aplicación separada.

Firebase/Firestore también sería viable si se prioriza la velocidad de desarrollo y la integración con la autenticación. Para el CRUD y la administración descritos, el modelo SQL deja más explícitas las reglas y facilita crecer hacia reportes y auditoría.

## Contenido

- `erd.mmd`: diagrama entidad-relación en Mermaid.
- `schema.sql`: crea la base de datos, tablas, índices, restricciones y municipios iniciales.
- `002_add_apple_auth.sql`: migración para bases ya creadas; agrega Apple como proveedor de autenticación.
- `deploy.sh`: ejecuta `schema.sql` contra una instancia MySQL usando variables de entorno.

## Despliegue

1. Crear un addon MySQL 8 en Clever Cloud.
2. Clever Cloud suele exponer `MYSQL_ADDON_HOST`, `MYSQL_ADDON_PORT`, `MYSQL_ADDON_DB`, `MYSQL_ADDON_USER` y `MYSQL_ADDON_PASSWORD`. El script las acepta directamente; también admite los nombres genéricos `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER` y `MYSQL_PASSWORD`.
3. Ejecutar `./database/deploy.sh` desde un entorno que tenga instalado el cliente `mysql`, o ejecutar el contenido de `schema.sql` desde la consola SQL del proveedor.
4. Crear el primer administrador mediante un comando seguro del backend. No se deja ninguna contraseña en este repositorio.

El script no contiene credenciales y aborta si falta alguna variable requerida.

## Decisiones importantes

- `users.status` permite bloquear y desbloquear cuentas sin borrar su historial.
- `users.role` soporta únicamente `tourist` y `admin` por ahora.
- Lugares y rutas usan eliminación lógica con `deleted_at`, para conservar reseñas, favoritos y auditoría.
- Las imágenes se separan en tablas propias para permitir varias imágenes y reordenarlas.
- Las calificaciones agregadas se mantienen como caché en lugares y rutas; el backend debe recalcularlas dentro de una transacción al crear, editar o eliminar reseñas.
- `admin_audit_log` registra acciones administrativas sensibles, incluyendo bloqueo de usuarios y cambios de contenido.

## Próximo paso técnico

Crear una API REST o GraphQL, por ejemplo con Node.js/TypeScript y Express o NestJS, que implemente primero:

`POST /auth/register`, `POST /auth/login`, `GET /places`, `GET /routes`, `POST /reviews`, `POST/DELETE /favorites` y los endpoints protegidos de `/admin/places`, `/admin/routes` y `/admin/users`.

## API implementada

Públicos: `GET /api/health`, `GET /api/health/database`, `GET /api/municipalities`, `GET /api/places`, `GET /api/routes`, `GET /api/reviews`.

Autenticación: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`, `POST /api/auth/apple` y `GET /api/me`. Apple queda preparado, pero no es necesario configurarlo para usar Google.

Turista autenticado: `POST /api/favorites`, `DELETE /api/favorites/:type/:id` y `POST /api/reviews`.

Administrador: `GET /api/admin/users`, `PATCH /api/admin/users/:id/block`, `PATCH /api/admin/users/:id/unblock`, y CRUD de `/api/admin/places` y `/api/admin/routes`. Estas rutas requieren `Authorization: Bearer <JWT>` y un usuario con `role = admin`.

## Crear el primer administrador

No se crea una contraseña en `schema.sql`. Ejecuta una sola vez, usando variables temporales que no se guardan en el repositorio:

```bash
ADMIN_NAME="Administrador RutiGo" ADMIN_EMAIL="admin@tu-dominio.com" ADMIN_PASSWORD="una-clave-larga-y-unica" npm run admin:create
```

La contraseña debe tener al menos 12 caracteres. El comando falla si ya existe un administrador.
