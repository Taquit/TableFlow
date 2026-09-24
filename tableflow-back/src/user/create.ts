import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Resource } from "sst";
import { Client } from "pg";
import * as bcrypt from "bcryptjs";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const client = new Client({
        connectionString: Resource.DATABASE_URL.value,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const body = JSON.parse(event.body || "{}");
        const username = body.username;
        const password = body.password;
        const role = body.role || "ADMIN";

        if (!username || !password) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "username y password son requeridos" })
            };
        }

        const existingUser = await client.query('SELECT id FROM "User" WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return {
                statusCode: 409,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "El nombre de usuario ya esta en uso" })
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await client.query(
            'INSERT INTO "User" (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role;',
            [username, hashedPassword, role]
        );

        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                success: true,
                message: "Administrador creado exitosamente",
                user: result.rows[0]
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Error interno" })
        };
    } finally {
        await client.end();
    }
};
