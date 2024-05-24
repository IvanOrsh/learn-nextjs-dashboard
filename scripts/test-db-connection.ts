import { getClient } from '../src/lib/server/db';

const client = getClient();

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
