# Documentación de Rutas (Endpoints) - API de TableFlow

A continuación se detallan todas las rutas disponibles en el backend del proyecto, organizadas por módulo. También se indica si requieren autenticación o permisos de administrador.

## 🛠️ Rutas Generales y de Sistema

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Verifica el estado del servidor y la conexión a la base de datos (Health check). |
| `GET` | `/` | Devuelve un mensaje de bienvenida de la API y un listado básico con los módulos disponibles. |

---

## 🔐 Autenticación (`/api/auth`)
Rutas relacionadas con el acceso y la creación del usuario inicial.

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Permite iniciar sesión en el sistema y obtener un token de autenticación. |
| `POST` | `/api/auth/seed` | Crea un usuario administrador por defecto en la base de datos (generalmente para configuración inicial). |

---

## 📅 Eventos (`/api/events`)
Rutas para la gestión de eventos.

| Método | Ruta | Descripción | Middleware (Permisos) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events/` | Obtiene una lista de todos los eventos. | Ninguno |
| `GET` | `/api/events/:id/accounting` | Obtiene la contabilidad o balance financiero asociado a un evento específico. | Ninguno |
| `GET` | `/api/events/:id` | Obtiene los detalles de un evento específico buscándolo por su ID. | Ninguno |
| `POST` | `/api/events/` | Crea un nuevo evento. | 🔒 `verifyToken`, `isAdmin` |
| `PUT` | `/api/events/:id` | Actualiza los datos de un evento existente. | 🔒 `verifyToken`, `isAdmin` |
| `DELETE` | `/api/events/:id` | Elimina un evento específico por su ID. | 🔒 `verifyToken`, `isAdmin` |

---

## 👥 Invitados (`/api/guests`)
Rutas para gestionar los invitados de los eventos.

| Método | Ruta | Descripción | Middleware (Permisos) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/guests/` | Obtiene una lista de todos los invitados (de forma global). | Ninguno |
| `GET` | `/api/guests/event/:eventId` | Obtiene una lista de todos los invitados que pertenecen a un evento específico (`eventId`). | Ninguno |
| `GET` | `/api/guests/table/:tableId/event/:eventId` | Obtiene los invitados asignados a una mesa específica (`tableId`) dentro de un evento (`eventId`). | Ninguno |
| `GET` | `/api/guests/event/:eventId/name/:name` | Busca un invitado por su nombre en un evento específico. | Ninguno |
| `GET` | `/api/guests/:id` | Obtiene los detalles de un invitado específico buscándolo por su ID. | Ninguno |
| `POST` | `/api/guests/` | Crea un nuevo invitado. | 🔒 `verifyToken`, `isAdmin` |
| `PUT` | `/api/guests/:id` | Actualiza la información de un invitado existente. | 🔒 `verifyToken`, `isAdmin` |
| `DELETE` | `/api/guests/:id` | Elimina a un invitado del sistema mediante su ID. | 🔒 `verifyToken`, `isAdmin` |

---

## 🪑 Mesas (`/api/tables`)
Rutas para gestionar las mesas de los eventos.

| Método | Ruta | Descripción | Middleware (Permisos) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tables/` | Obtiene una lista de todas las mesas. | Ninguno |
| `GET` | `/api/tables/event/:eventId` | Obtiene una lista de todas las mesas asociadas a un evento específico (`eventId`). | Ninguno |
| `GET` | `/api/tables/:id` | Obtiene los detalles de una mesa específica por su ID. | Ninguno |
| `POST` | `/api/tables/` | Crea una nueva mesa. | 🔒 `verifyToken`, `isAdmin` |
| `PUT` | `/api/tables/:id` | Modifica o actualiza la configuración de una mesa existente. | 🔒 `verifyToken`, `isAdmin` |
| `DELETE` | `/api/tables/:id` | Elimina una mesa mediante su ID. | 🔒 `verifyToken`, `isAdmin` |

---

> [!NOTE]
> Las rutas que contienen 🔒 requieren que la petición incluya un token de acceso válido (`verifyToken`) y que el usuario que realiza la petición tenga el rol de administrador (`isAdmin`).