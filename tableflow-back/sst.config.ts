/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "backend-v2",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // 1. Declaramos el secreto para la conexión de PostgreSQL en Supabase
    const dbUrl = new sst.Secret("DATABASE_URL");

    // (Opcional) Si vas a validar usuarios como en tu otro proyecto, declaras tu secreto JWT:
    const jwtSecret = new sst.Secret("JWT_SECRET");

    // 2. Creamos la API y le damos acceso a los secretos
    const api = new sst.aws.ApiGatewayV2("TableFlowApi", {
      cors: true,
      link: [dbUrl, jwtSecret] // La Lambda ahora podrá leer Resource.DATABASE_URL.value
    });

    // 3. Registramos las rutas de la API

    // Generales
    api.route("GET /health", "src/general/health.handler");
    api.route("GET /", "src/general/index.handler");

    // Auth
    api.route("POST /api/auth/login", "src/auth/login.handler");
    api.route("POST /api/auth/seed", "src/auth/seed.handler");

    // Events
    api.route("GET /api/events", "src/event/get.handler");
    api.route("GET /api/events/{id}/accounting", "src/event/getAccounting.handler");
    api.route("GET /api/events/{id}", "src/event/getById.handler");
    api.route("POST /api/events", "src/event/create.handler");
    api.route("PUT /api/events/{id}", "src/event/update.handler");
    api.route("DELETE /api/events/{id}", "src/event/delete.handler");

    // Guests
    api.route("GET /api/guests", "src/guest/get.handler");
    api.route("GET /api/guests/event/{eventId}", "src/guest/getByEvent.handler");
    api.route("GET /api/guests/table/{tableId}/event/{eventId}", "src/guest/getByTableAndEvent.handler");
    api.route("GET /api/guests/event/{eventId}/name/{name}", "src/guest/getByNameAndEvent.handler");
    api.route("GET /api/guests/{id}", "src/guest/getById.handler");
    api.route("POST /api/guests", "src/guest/create.handler");
    api.route("PUT /api/guests/{id}", "src/guest/update.handler");
    api.route("DELETE /api/guests/{id}", "src/guest/delete.handler");

    // Tables
    api.route("GET /api/tables", "src/table/get.handler");
    api.route("GET /api/tables/event/{eventId}", "src/table/getByEvent.handler");
    api.route("GET /api/tables/{id}", "src/table/getById.handler");
    api.route("POST /api/tables", "src/table/create.handler");
    api.route("PUT /api/tables/{id}", "src/table/update.handler");
    api.route("DELETE /api/tables/{id}", "src/table/delete.handler");

    return {
      apiUrl: api.url
    }
  }
});