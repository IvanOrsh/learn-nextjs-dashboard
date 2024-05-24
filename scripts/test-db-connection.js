const { Client } = require('pg');

const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'acme',
  password: 'password',
  port: 5435,
});

client
  .connect()
  .then(() => {
    // Execute the query
    return client.query(
      "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';",
    );
  })
  .then((result) => {
    // Print the result
    console.log('Number of tables:', result.rows[0].count);
  })
  .catch((err) => console.error('Query error', err))
  .finally(() => client.end());
