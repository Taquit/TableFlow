import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        const date = body.date || new Date().toISOString();
        const eventName = body.name || body.eventName;
        const numTable = body.numTable ? parseInt(body.numTable, 10) : 0;
        const numGuest = body.numGuest ? parseInt(body.numGuest, 10) : 0;
        const updatedById = body.updatedById ? parseInt(body.updatedById, 10) : null;

        const query = 'INSERT INTO "Event" ("eventName", date, "ticketCost", location, "numTable", "numGuest", "updatedById", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *;';
        const result = await client.query(query, [eventName, date, body.ticketCost || 0, body.location, numTable, numGuest, updatedById]);

        const newEvent = result.rows[0];

        // Generate tables if numTable is provided
        if (numTable > 0) {
            const numSeats = numGuest > 0 ? Math.ceil(numGuest / numTable) : 8;

            for (let i = 1; i <= numTable; i++) {
                await client.query('INSERT INTO "Table" (number, "numSeats", "eventId", "updatedById") VALUES ($1, $2, $3, $4)', [i, numSeats, newEvent.id, updatedById]);
            }
        }
        
        return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newEvent) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};