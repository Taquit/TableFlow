import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        const username = body.username || 'admin';
        const password = body.password || 'admin123'; // Debería hashearse
        
        const result = await client.query('INSERT INTO "User" (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role', [username, password, 'ADMIN']);
        return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: "Usuario semilla creado", user: result.rows[0] }) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error creando semilla", details: error.message }) };
    } finally {
        await client.end();
    }
};