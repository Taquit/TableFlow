import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        // Nota: Deberías usar bcrypt y JWT aquí en el futuro.
        const result = await client.query('SELECT id, username, role FROM "User" WHERE username = $1 AND password = $2', [body.username, body.password]);
        
        if (result.rows.length === 0) {
            return { statusCode: 401, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Credenciales inválidas" }) };
        }
        
        // Simulación de token (reemplazar con jsonwebtoken real)
        const user = result.rows[0];
        const token = `simulated_jwt_token_for_${user.id}`;
        
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, user }) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "Error interno" }) };
    } finally {
        await client.end();
    }
};