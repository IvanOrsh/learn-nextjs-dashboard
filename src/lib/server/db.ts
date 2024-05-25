import { Client } from 'pg';

import config from './config';

export function getClient(): Client {
  let sslmode = '';

  if (config.ENV === 'production') {
    sslmode = '?sslmode=require';
  }

  const client = new Client({
    connectionString: config.POSTGRES_URL + sslmode,
  });

  return client;
}

export async function sql<T>(
  sql: string,
  values?: any[],
): Promise<{ rows: T[]; rowCount: number; command: string; oid: number }> {
  const client = getClient();

  await client.connect();
  const res = await client.query(sql, values);

  await client.end();

  return res;
}
