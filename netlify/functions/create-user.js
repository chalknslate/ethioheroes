const { Client } = require("pg");
const { hash } = require("@node-rs/argon2");

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method Not Allowed",
      }),
    };
  }

  // Parse request body
  let data;

  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid JSON",
      }),
    };
  }

  const { username, password } = data;

  // Validate input types
  if (
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Username and password are required",
      }),
    };
  }

  // Validate username
  if (username.length < 3 || username.length > 32) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Username must be between 3 and 32 characters",
      }),
    };
  }

  // Validate password
  if (password.length < 8) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Password must be at least 8 characters",
      }),
    };
  }

  // Hash the password with Argon2id
  let passwordHash;

  try {
    passwordHash = await hash(password);
  } catch (err) {
    console.error("Password hashing failed:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  }

  // Create PostgreSQL client
  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 5432,

    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Connect to database
    await client.connect();

    // Insert user
    await client.query(
      `
        INSERT INTO users (username, password)
        VALUES ($1, $2)
      `,
      [username, passwordHash]
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User created",
      }),
    };
  } catch (err) {
    console.error("Database error:", err);

    // PostgreSQL unique constraint violation
    if (err.code === "23505") {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: "Username already exists",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  } finally {
    // Always close the database connection
    await client.end().catch(() => {});
  }
};

