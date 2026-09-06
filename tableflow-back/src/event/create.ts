import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        const date = body.date || new Date().toISOString();
        
        const query = 'INSERT INTO "Event" ("eventName", date, "ticketCost", location, "updatedAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING *;';
        const result = await client.query(query, [body.eventName, date, body.ticketCost || 0, body.location]);
        
        return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows[0]) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};