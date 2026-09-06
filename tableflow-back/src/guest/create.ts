import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        const query = 'INSERT INTO "Guest" (name, phone, "boletNumber", paid, "amountPaid", "eventId", "tableId") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;';
        const result = await client.query(query, [body.name, body.phone, body.boletNumber, body.paid || false, body.amountPaid || 0.0, body.eventId, body.tableId]);
        
        return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows[0]) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};