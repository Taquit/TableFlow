import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";
import * as bcrypt from "bcryptjs";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({ connectionString: Resource.DATABASE_URL.value, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        
        const result = await client.query('SELECT id, username, password, role FROM "User" WHERE username = $1', [body.username]);
        
        if (result.rows.length === 0) {
            return { statusCode: 401, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, message: "Credenciales inválidas" }) };
        }
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(body.password, user.password);
        
        if (!isMatch) {
            return { statusCode: 401, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, message: "Credenciales inválidas" }) };
        }
        
        // Remove password from user object before returning
        delete user.password;

        const token = `simulated_jwt_token_for_${user.id}`;
        
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, token, user }) };
    } catch (error) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, message: "Error interno" }) };
    } finally {
        await client.end();
    }
};