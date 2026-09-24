import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const query = `
            SELECT g.*,
                   CASE WHEN t.id IS NULL THEN NULL
                        ELSE json_build_object('id', t.id, 'number', t.number, 'numSeats', t."numSeats")
                   END AS "table",
                   u.username as "updatedByUsername"
            FROM "Guest" g
            LEFT JOIN "Table" t ON t.id = g."tableId"
            LEFT JOIN "User" u ON g."updatedById" = u.id
            ORDER BY g.id DESC;
        `;
        const result = await client.query(query);
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno" }) };
    } finally {
        await client.end();
    }
};