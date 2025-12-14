const { Client } = require("pg");
const { hash } = require("@node-rs/argon2");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { username, password } = JSON.parse(event.body);
  if (!username || !password) {
    return { statusCode: 400, body: "Missing username or password" };
  }

  const passwordHash = await hash(password); // Argon2id by default

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
    await client.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, passwordHash]
    );
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User created" }),
    };
  } catch (err) {
    await client.end().catch(() => {});
    return { statusCode: 500, body: err.message };
  }
};
