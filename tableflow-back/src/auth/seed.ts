import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";
import * as bcrypt from "bcryptjs";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        const username = body.username;
        const rawPassword = body.password;
        
        if (!username || !rawPassword) {
            return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "username y password son requeridos" }) };
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);
        
        const result = await client.query('INSERT INTO "User" (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role', [username, hashedPassword, 'ADMIN']);
        return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: "Usuario semilla creado", user: result.rows[0] }) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error creando semilla", details: error.message }) };
    } finally {
        await client.end();
    }
};