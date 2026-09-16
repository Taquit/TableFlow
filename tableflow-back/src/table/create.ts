import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        if (!body.number || !body.eventId) return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "number y eventId requeridos" }) };

        const updatedById = body.updatedById ? parseInt(body.updatedById, 10) : null;
        const query = 'INSERT INTO "Table" (number, "numSeats", "eventId", "updatedById") VALUES ($1, $2, $3, $4) RETURNING *;';
        const result = await client.query(query, [body.number, body.numSeats || 8, body.eventId, updatedById]);
        
        return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows[0]) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};