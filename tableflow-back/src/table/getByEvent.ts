import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const eventId = event.pathParameters?.eventId;
        if (!eventId) return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "eventId requerido" }) };
        
        const query = `
            SELECT t.*,
                   COUNT(g.id) as guests_count,
                   (
                       SELECT m.name FROM "Guest" m
                       WHERE m."tableId" = t.id AND m."isTableManager" = true
                       ORDER BY m.id ASC LIMIT 1
                   ) as "managerName",
                   u.username as "updatedByUsername"
            FROM "Table" t
            LEFT JOIN "Guest" g ON t.id = g."tableId"
            LEFT JOIN "User" u ON t."updatedById" = u.id
            WHERE t."eventId" = $1
            GROUP BY t.id, u.username
            ORDER BY t.number ASC;
        `;
        const result = await client.query(query, [parseInt(eventId)]);
        
        const tablesWithCount = result.rows.map(row => {
            const { guests_count, ...tableData } = row;
            return {
                ...tableData,
                _count: { guests: parseInt(guests_count, 10) }
            };
        });
        
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tablesWithCount) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno" }) };
    } finally {
        await client.end();
    }
};