import { getClient } from '../src/lib/server/db';

async function main() {
  const client = getClient();
  await client.connect();

  await client.query(`DROP TABLE IF EXISTS users;`);
  await client.query(`DROP TABLE IF EXISTS invoices;`);
  await client.query(`DROP TABLE IF EXISTS customers;`);
  await client.query(`DROP TABLE IF EXISTS revenue;`);

  await client.end();
}

main()
  .then(() => console.log('Drop tables complete'))
  .catch((err) => {
    console.error('Drop tables error:', err);
  });
