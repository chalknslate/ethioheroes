const { Client } = require('pg');
const argon2 = require('argon2');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { username, password } = JSON.parse(event.body);

  if (!username || !password) {
    return { statusCode: 400, body: 'Missing username or password' };
  }

  // Hash password with Argon2id
  let hashed;
  try {
    hashed = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456, // 19 MB
      timeCost: 3,
      parallelism: 1,
    });
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to hash password' }),
    };
  }

  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, // rotated + now safe
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    await client.query(query, [username, hashed]);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User added successfully!' }),
    };
  } catch (err) {
    await client.end().catch(() => {});

    if (err.code === '23505') {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Username already exists' }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
