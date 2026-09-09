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
        
        const query = 'INSERT INTO "Event" ("eventName", date, "ticketCost", location, "updatedAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING *;';
        const result = await client.query(query, [eventName, date, body.ticketCost || 0, body.location]);
        
        const newEvent = result.rows[0];
        
        // Generate tables if numTable is provided
        if (body.numTable) {
            const numTables = parseInt(body.numTable, 10);
            if (numTables > 0) {
                const totalGuests = body.numGuest ? parseInt(body.numGuest, 10) : 0;
                const numSeats = totalGuests > 0 ? Math.ceil(totalGuests / numTables) : 8;
                
                for (let i = 1; i <= numTables; i++) {
                    await client.query('INSERT INTO "Table" (number, "numSeats", "eventId") VALUES ($1, $2, $3)', [i, numSeats, newEvent.id]);
                }
            }
        }
        
        return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newEvent) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};