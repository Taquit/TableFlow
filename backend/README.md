# TableFlow Backend

El backend de TableFlow (Gestor Fiesta) es una API RESTful construida con Node.js, Express y Prisma, utilizando PostgreSQL como base de datos.

## Tecnologías Principales

- **Node.js** & **Express**: Para el servidor y enrutamiento de la API.
- **Prisma**: ORM moderno para interactuar con la base de datos de manera tipada.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **dotenv**: Manejo de variables de entorno.
- **cors**: Habilitar CORS para permitir solicitudes desde el frontend.

## Estructura de Directorios

```text
backend/
├── prisma/               # Esquema de Prisma y migraciones
│   └── schema.prisma     # Definición de modelos (Event, Table, Guest)
├── src/                  # Código fuente de la aplicación
│   ├── controllers/      # Lógica de negocio (eventController, guestController, tableController)
│   ├── routes/           # Definición de endpoints de la API (eventRout, guestRout, tableRoute)
│   ├── index.js          # Punto de entrada de la aplicación y configuración de Express
│   └── prisma.js         # Instancia global del cliente de Prisma
├── .env                  # Variables de entorno (no versionado)
├── package.json          # Dependencias y scripts
└── Dockerfile            # Instrucciones para contenerizar la aplicación
```

## Esquema de Base de Datos (Prisma)

El modelo de datos se compone de tres entidades principales: `Event` (Evento), `Table` (Mesa) y `Guest` (Invitado).

```mermaid
erDiagram
    Event ||--o{ Table : "tiene"
    Event ||--o{ Guest : "asisten a"
    Table ||--o{ Guest : "sienta a"

    Event {
        Int id PK
        String eventName
        DateTime date
        Int numTable
        Int numGuest
        Float ticketCost
        String location
    }

    Table {
        Int id PK
        Int number
        Int numSeats
        Int eventId FK
    }

    Guest {
        Int id PK
        String name
        String phone
        Boolean paid
        Float amountPaid
        Int eventId FK
        Int tableId FK "nullable"
    }
```

## Endpoints de la API

La ruta base para todos los endpoints de la API es `/api`.

- **Eventos:** `/api/events`
  - Soporta operaciones CRUD para crear, leer, actualizar y eliminar eventos.
- **Invitados:** `/api/guests`
  - Operaciones CRUD para invitados.
  - Endpoints específicos para actualizar el estado de pago, reasignar mesas, o buscar por evento.
- **Mesas:** `/api/tables`
  - Operaciones CRUD para las mesas, vinculadas a eventos específicos.
- **Health Check:** `/health`
  - Endpoint para verificar que el servidor está corriendo y la base de datos está conectada.

## Configuración y Ejecución Local (Sin Docker)

Si no estás usando Docker Compose, sigue estos pasos para ejecutar el backend localmente.

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz de `backend/` basado en la siguiente estructura:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/pparty"
PORT=4000
```

### 2. Instalar Dependencias

Asegúrate de estar en el directorio `backend` e instala las dependencias:

```bash
pnpm install
```

### 3. Configurar la Base de Datos (Prisma)

Ejecuta las migraciones de Prisma para generar las tablas en tu base de datos local y generar el cliente de Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Iniciar el Servidor

Para iniciar el servidor en modo desarrollo (con recarga automática):

```bash
pnpm run dev
```

El servidor estará corriendo en `http://localhost:4000`.
