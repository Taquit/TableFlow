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
                   COUNT(g.id) as guests_count
            FROM "Table" t
            LEFT JOIN "Guest" g ON t.id = g."tableId"
            WHERE t."eventId" = $1
            GROUP BY t.id
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