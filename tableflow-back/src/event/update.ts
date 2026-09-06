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
        const query = 'UPDATE "Event" SET "eventName" = COALESCE($1, "eventName"), "ticketCost" = COALESCE($2, "ticketCost"), location = COALESCE($3, location), "updatedAt" = NOW() WHERE id = $4 RETURNING *;';
        const result = await client.query(query, [body.eventName, body.ticketCost, body.location, parseInt(id)]);
        
        if (result.rows.length === 0) return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "No encontrado" }) };
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows[0]) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};