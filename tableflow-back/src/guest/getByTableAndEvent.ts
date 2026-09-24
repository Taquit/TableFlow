import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const tableId = event.pathParameters?.tableId;
        const eventId = event.pathParameters?.eventId;
        if (!tableId || !eventId) return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "tableId y eventId requeridos" }) };
        
        const query = `
            SELECT g.*,
                   u.username as "updatedByUsername"
            FROM "Guest" g
            LEFT JOIN "User" u ON g."updatedById" = u.id
            WHERE g."tableId" = $1 AND g."eventId" = $2
            ORDER BY g.name ASC;
        `;
        const result = await client.query(query, [parseInt(tableId), parseInt(eventId)]);
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno" }) };
    } finally {
        await client.end();
    }
};