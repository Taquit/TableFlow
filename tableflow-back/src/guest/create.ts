import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        const updatedById = body.updatedById ? parseInt(body.updatedById, 10) : null;
        const name = body.name || '';
        const phone = body.phone || null;
        const boletNumber = body.boletNumber !== undefined && body.boletNumber !== null && body.boletNumber !== '' ? parseInt(body.boletNumber, 10) : null;
        const paid = body.paid !== undefined ? Boolean(body.paid) : false;
        const amountPaid = body.amountPaid !== undefined && body.amountPaid !== null && body.amountPaid !== '' ? parseFloat(body.amountPaid) : 0.0;
        const eventId = body.eventId ? parseInt(body.eventId, 10) : null;
        const tableId = body.tableId !== undefined && body.tableId !== null && body.tableId !== '' ? parseInt(body.tableId, 10) : null;
        const isTableManager = body.isTableManager !== undefined ? Boolean(body.isTableManager) : false;

        const query = `
            WITH inserted AS (
                INSERT INTO "Guest" (name, phone, "boletNumber", paid, "amountPaid", "eventId", "tableId", "isTableManager", "updatedById")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            )
            SELECT i.*,
                   CASE WHEN t.id IS NULL THEN NULL
                        ELSE json_build_object('id', t.id, 'number', t.number, 'numSeats', t."numSeats")
                   END AS "table",
                   u.username as "updatedByUsername"
            FROM inserted i
            LEFT JOIN "Table" t ON t.id = i."tableId"
            LEFT JOIN "User" u ON i."updatedById" = u.id;
        `;
        const result = await client.query(query, [name, phone, boletNumber, paid, amountPaid, eventId, tableId, isTableManager, updatedById]);
        
        return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows[0]) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};