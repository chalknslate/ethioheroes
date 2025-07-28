const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { fname, lname } = event.queryStringParameters;

  if (!fname || !lname) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing fname or lname' }),
    };
  }

  const client = new Client({
    host: 'ep-falling-hall-aeql1z83-pooler.c-2.us-east-2.aws.neon.tech',
    database: 'neondb',
    user: 'neondb_owner',
    password: 'npg_xkhtaL2id6Pv',
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const result = await client.query(query, [fname, lname]);

    await client.end();

    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'User not found or password incorrect' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `session=${fname}; Path=/; HttpOnly; Secure`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'User authenticated successfully' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
