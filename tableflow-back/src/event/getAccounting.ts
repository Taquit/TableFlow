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
        
        // Get total collected
        const guestsRes = await client.query('SELECT SUM("amountPaid") as "totalCollected" FROM "Guest" WHERE "eventId" = $1;', [parseInt(id)]);
        const totalCollected = parseFloat(guestsRes.rows[0].totalCollected || 0);

        // Get unassigned collected
        const unassignedRes = await client.query('SELECT SUM("amountPaid") as "unassignedCollected" FROM "Guest" WHERE "eventId" = $1 AND "tableId" IS NULL;', [parseInt(id)]);
        const unassignedCollected = parseFloat(unassignedRes.rows[0].unassignedCollected || 0);

        // Get tables data
        const tablesRes = await client.query(`
            SELECT t.id, t.number, 
                   COUNT(g.id) as "guestsCount", 
                   COALESCE(SUM(g."amountPaid"), 0) as "collected"
            FROM "Table" t
            LEFT JOIN "Guest" g ON t.id = g."tableId"
            WHERE t."eventId" = $1
            GROUP BY t.id, t.number
            ORDER BY t.number;
        `, [parseInt(id)]);

        const tablesData = tablesRes.rows.map(row => ({
            id: row.id,
            number: row.number,
            guestsCount: parseInt(row.guestsCount, 10),
            collected: parseFloat(row.collected)
        }));
        
        return { 
            statusCode: 200, 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                event: eventRes.rows[0].eventName,
                ticketCost: eventRes.rows[0].ticketCost,
                totalCollected: totalCollected,
                tablesData: tablesData,
                unassignedCollected: unassignedCollected
            }) 
        };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno" }) };
    } finally {
        await client.end();
    }
};