# TableFlow (Gestor Fiesta)

¡Bienvenido a **TableFlow**, también conocido como **Gestor Fiesta**!

TableFlow es una aplicación web integral diseñada para simplificar y optimizar la gestión de eventos, específicamente enfocada en la distribución de mesas, listas de invitados y el control contable de los pagos.

## Características Principales

*   **Gestión de Eventos:** Crea y administra múltiples eventos desde una plataforma centralizada.
*   **Distribución de Mesas:** Organiza de manera visual la asignación de invitados a mesas específicas, asegurando un control claro sobre la capacidad y los asientos disponibles.
*   **Control de Invitados:** Mantén una lista detallada de asistentes, incluyendo su nombre, número de teléfono y estado de pago.
*   **Gestión Financiera (Contabilidad):** Monitorea en tiempo real los ingresos del evento. Controla quién ha pagado su entrada, cuánto ha pagado y cuál es el monto restante o excedente.
*   **Exportación a Excel:** Genera reportes detallados en formato Excel con la información del evento, invitados y contabilidad, ideales para imprimir o respaldar.

## Arquitectura del Proyecto

El proyecto está dividido en dos partes principales, comunicadas a través de una API REST:

1.  **[Frontend (Cliente)](./frontend/README.md):** Desarrollado con React y Vite. Interfaz de usuario dinámica y responsiva.
2.  **[Backend (Servidor)](./backend/README.md):** Desarrollado con Node.js, Express y Prisma ORM. Encargado de la lógica de negocio y la persistencia de datos en una base de datos PostgreSQL.

### Diagrama de Arquitectura

```mermaid
graph TD;
    Client[Cliente/Navegador] -->|HTTP Requests| Frontend[Frontend React/Vite];
    Frontend -->|API Calls (JSON)| Backend[Backend Express];
    Backend -->|Prisma ORM| DB[(Base de Datos PostgreSQL)];
```

## Requisitos Previos

Para ejecutar este proyecto de forma local, necesitarás tener instalado:

*   [Docker](https://www.docker.com/) y Docker Compose (Recomendado para una configuración rápida).
*   [Node.js](https://nodejs.org/) (versión 18+ recomendada) si deseas ejecutarlo sin Docker.
*   [pnpm](https://pnpm.io/) (El gestor de paquetes utilizado en el proyecto).

## Configuración y Ejecución (Quickstart con Docker)

La forma más rápida y sencilla de levantar el proyecto completo (Frontend, Backend y Base de Datos) es utilizando Docker Compose.

1.  Clona el repositorio.
2.  Abre una terminal en la raíz del proyecto (`TableFlow`).
3.  Ejecuta el siguiente comando:

    ```bash
    docker-compose up --build
    ```

Este comando levantará tres contenedores:
*   **Base de datos (pparty-db):** PostgreSQL expuesto en el puerto `5432`.
*   **Backend:** API escuchando en `http://localhost:4000`.
*   **Frontend:** Aplicación web accesible en `http://localhost:3000`.

*Nota: Docker Compose configurará automáticamente las variables de entorno necesarias para que el backend se conecte a la base de datos de Docker.*

## Ejecución Local (Sin Docker)

Si prefieres ejecutar el proyecto localmente sin Docker, sigue las instrucciones detalladas en los respectivos README de cada directorio:

*   [Instrucciones del Backend](./backend/README.md)
*   [Instrucciones del Frontend](./frontend/README.md)

## Estructura de Directorios

```text
TableFlow/
├── backend/            # Código fuente del servidor (Node.js, Express, Prisma)
├── frontend/           # Código fuente de la interfaz de usuario (React, Vite)
├── docker-compose.yml  # Configuración de Docker para orquestación de servicios
└── README.md           # Este archivo
```
