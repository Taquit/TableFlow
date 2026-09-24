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
        const number = body.number !== undefined && body.number !== null ? parseInt(body.number, 10) : null;
        const numSeats = body.numSeats !== undefined && body.numSeats !== null ? parseInt(body.numSeats, 10) : null;

        const query = `
            WITH updated AS (
                UPDATE "Table"
                SET number = COALESCE($1, number),
                    "numSeats" = COALESCE($2, "numSeats"),
                    "updatedById" = COALESCE($3, "updatedById")
                WHERE id = $4
                RETURNING *
            )
            SELECT u.*,
                   usr.username as "updatedByUsername",
                   (SELECT COUNT(g.id) FROM "Guest" g WHERE g."tableId" = u.id) as guests_count,
                   (
                       SELECT m.name FROM "Guest" m
                       WHERE m."tableId" = u.id AND m."isTableManager" = true
                       ORDER BY m.id ASC LIMIT 1
                   ) as "managerName"
            FROM updated u
            LEFT JOIN "User" usr ON u."updatedById" = usr.id;
        `;
        const result = await client.query(query, [number, numSeats, updatedById, parseInt(id)]);
        
        if (result.rows.length === 0) return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "No encontrado" }) };

        const row = result.rows[0];
        const updatedTable = {
            ...row,
            _count: { guests: parseInt(row.guests_count || 0, 10) }
        };
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedTable) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno", details: error.message }) };
    } finally {
        await client.end();
    }
};