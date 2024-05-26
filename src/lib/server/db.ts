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

function sqlQuery(
  strings: TemplateStringsArray,
  ...values: any[]
): { text: string; values: any[] } {
  const text = strings.reduce((prev, current, i) => prev + '$' + i + current);
  return { text, values };
}

export async function sql<T>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<{ rows: T[]; rowCount: number; command: string; oid: number }> {
  const client = getClient();

  await client.connect();
  const query = sqlQuery(strings, ...values);
  const res = await client.query(query.text, query.values);
  await client.end();

  return res;
}
