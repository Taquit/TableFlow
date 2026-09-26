import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const id = event.pathParameters?.id;
        if (!id) return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "ID requerido" }) };
        
        const body = JSON.parse(event.body || "{}");
        const eventName = body.name || body.eventName;
        const numTable = body.numTable !== undefined && body.numTable !== '' ? parseInt(body.numTable, 10) : null;
        const numGuest = body.numGuest !== undefined && body.numGuest !== '' ? parseInt(body.numGuest, 10) : null;
        const ticketCost = body.ticketCost !== undefined && body.ticketCost !== '' ? parseFloat(body.ticketCost) : null;
        const updatedById = body.updatedById !== undefined && body.updatedById !== null ? parseInt(body.updatedById, 10) : null;

        let eventDate = null;
        if (body.date) {
            eventDate = body.time ? `${body.date}T${body.time}` : body.date;
        }

        const location = body.location !== undefined ? body.location : null;
        const eventNameParam = eventName !== undefined ? eventName : null;

        const query = `
            WITH updated AS (
                UPDATE "Event"
                SET "eventName" = COALESCE($1, "eventName"),
                    "ticketCost" = COALESCE($2, "ticketCost"),
                    location = COALESCE($3, location),
                    "numTable" = COALESCE($4, "numTable"),
                    "numGuest" = COALESCE($5, "numGuest"),
                    "updatedById" = COALESCE($6, "updatedById"),
                    date = COALESCE($7, date),
                    "updatedAt" = NOW()
                WHERE id = $8
                RETURNING *
            )
            SELECT u.*,
                   usr.username as "updatedByUsername"
            FROM updated u
            LEFT JOIN "User" usr ON u."updatedById" = usr.id;
        `;
        const result = await client.query(query, [eventNameParam, ticketCost, location, numTable, numGuest, updatedById, eventDate, parseInt(id)]);
        
        if (result.rows.length === 0) return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "No encontrado" }) };
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows[0]) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};