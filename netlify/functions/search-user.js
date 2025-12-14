const { Client } = require("pg");
const { verify } = require("@node-rs/argon2");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { username, password } = event.queryStringParameters;
  if (!username || !password) {
    return { statusCode: 400, body: "Missing username or password" };
  }

  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query(
      "SELECT password FROM users WHERE username = $1",
      [username]
    );
    await client.end();

    if (res.rows.length === 0) {
      return { statusCode: 401, body: "Invalid credentials" };
    }

    const ok = await verify(res.rows[0].password, password);
    if (!ok) {
      return { statusCode: 401, body: "Invalid credentials" };
    }

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `session=${username}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      },
      body: JSON.stringify({ message: "Authenticated" }),
    };
  } catch (err) {
    await client.end().catch(() => {});
    return { statusCode: 500, body: err.message };
  }
};
