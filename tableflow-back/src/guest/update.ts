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
        const updatedById = body.updatedById !== undefined && body.updatedById !== null ? parseInt(body.updatedById, 10) : null;
        // Devuelve el invitado actualizado junto con su mesa, para que el front no pierda "guest.table"
        const query = `
            WITH updated AS (
                UPDATE "Guest" SET name = COALESCE($1, name), phone = COALESCE($2, phone), "boletNumber" = COALESCE($3, "boletNumber"), paid = COALESCE($4, paid), "amountPaid" = COALESCE($5, "amountPaid"), "tableId" = COALESCE($6, "tableId"), "isTableManager" = COALESCE($7, "isTableManager"), "updatedById" = COALESCE($8, "updatedById") WHERE id = $9 RETURNING *
            )
            SELECT u.*,
                   CASE WHEN t.id IS NULL THEN NULL
                        ELSE json_build_object('id', t.id, 'number', t.number, 'numSeats', t."numSeats")
                   END AS "table"
            FROM updated u
            LEFT JOIN "Table" t ON t.id = u."tableId";
        `;
        const result = await client.query(query, [body.name, body.phone, body.boletNumber, body.paid, body.amountPaid, body.tableId, body.isTableManager, updatedById, parseInt(id)]);
        
        if (result.rows.length === 0) return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "No encontrado" }) };
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.rows[0]) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};