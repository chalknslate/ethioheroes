const { Client } = require('pg');
const argon2 = require('argon2');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { username, password } = event.queryStringParameters;

  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing username or password" }),
    };
  }

  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 5432,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // fetch only by username
    const result = await client.query(
      "SELECT username, password FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      await client.end();
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid username or password" }),
      };
    }

    const user = result.rows[0];

    // verify hash
    const ok = await argon2.verify(user.password, password);

    await client.end();

    if (!ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid username or password" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `session=${username}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Authenticated!" }),
    };
  } catch (err) {
    try { await client.end(); } catch {}
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
