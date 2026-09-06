import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const id = event.pathParameters?.id;
        if (!id) return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "ID requerido" }) };
        
        const eventRes = await client.query('SELECT * FROM "Event" WHERE id = $1;', [parseInt(id)]);
        if (eventRes.rows.length === 0) return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Evento no encontrado" }) };
        
        const guestsRes = await client.query('SELECT SUM("amountPaid") as "totalCollected" FROM "Guest" WHERE "eventId" = $1;', [parseInt(id)]);
        
        return { 
            statusCode: 200, 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                event: eventRes.rows[0].eventName,
                ticketCost: eventRes.rows[0].ticketCost,
                totalCollected: guestsRes.rows[0].totalCollected || 0
            }) 
        };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno" }) };
    } finally {
        await client.end();
    }
};