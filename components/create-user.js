const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { fname, lname } = JSON.parse(event.body);

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

    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    await client.query(query, [fname, lname]);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User added successfully!' }),
    };
  } catch (err) {
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
