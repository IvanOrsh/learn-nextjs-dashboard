## Next.js App Router Course - Starter

## 1. Bringing in fonts using variable fonts

1. create a font variable:

```tsx
import { Inter } from 'next/font/google';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
```

Don't call it `inter`, call it `fontSans` instead. This way it can be changed / reused / updated as needed.

2. use the variable in markup:

```jsx
<html lang="en" className={fontSans.variable}>
```

3. update tailwind config using the variable:

```ts
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {

      fontFamily: {
        sans: ['var(--font-sans)'],
      },

      // ...    
    },
  // ...
  },
};
export default config;
```

4. with `clsx`:

```tsx

  return (
    <html lang="en" className={clsx('antialiased', fontSans.variable)}>
      <body>{children}</body>
    </html>
  );
```

## 2. `next.config.js` 

```ts
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

## 3. Pattern: showing active links

1. We are going to use `usePathname` from `next/navigation`. Since `usePathname` is a hook, we'll need to turn our component into a client component by adding React's `"use client"` directive.
2. Then, we are going to assign the path to a variable called `pathname`.
3. We are going to conditionally render the link based on the path using `clsx`.

```tsx
// 1.
'use client';
 
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// 2.
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
 
// ...
 
export default function NavLinks() {
  // 3.
  const pathname = usePathname();
 
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            // 4.
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

## 4. Just in case: `psql`

To connect to a PostgreSQL database using the `psql` command-line client, you'll need the following information:

1. Hostname or IP address: The address where the PostgreSQL server is running.
2. Port: The port on which PostgreSQL is listening. The default is usually 5432.
3. Database name: The name of the database you want to connect to.
4. Username: The username used to authenticate to the database.
5. Password: The password for the specified username.

```bash
psql -h hostname -p port -d database -U username
```

Connect to a Database: As mentioned earlier, you can connect to a database using:

1. List Databases: To list all databases, you can use:

```bash
\l
```

2. Connect to a Specific Database: You can connect to a specific database after starting psql using:

```bash
\c database_name
```

3. List Tables: To list all tables in the current database, use:

```bash
\dt
```

4. Describe Table Structure: To describe the structure of a specific table, use:

```bash
\d table_name
```

5. Execute SQL Queries: You can directly execute SQL queries within psql. For example:

```sql
SELECT * FROM table_name;
```

6. Quit psql: To exit the psql command-line client, you can use:

```bash
\q
```

7. Help: For a list of all available commands and their descriptions, you can use:

```bash
\?
```

8. Search Command History: You can search your command history using:

```bash
\s
```

9. Toggle Expanded Display: To toggle the expanded display, which shows rows vertically, use:

```bash
\x
```

## 5. Totally unrelated: Tagged Template Literals

This is a feature in JavaScript / Typescript called **"tagged template literals"**. This feature allow you to define a function that process a template literal in a special way.

### How Tagged Template Literals Work

When you use a tagged template literal, it invokes a special type of function (called a "tag function") with a specific set of arguments that represent the template literal. The arguments passed to this function include:

1. **Template Strings Array**: An array of literal strings from the template.
2. **Substitution Values**: The values of the expressions interpolated within the template.

#### Step 1: Define the Tag Function

A tag function is defined to handle the template literal. This function receives the template strings and the substitution values.

```ts
function tagFunction(strings: TemplateStringsArray, ...values: any[]): { text: string; values: any[] } {
  const text = strings.reduce((prev, current, i) => prev + '$' + i + current);
  return { text, values };
}
```

#### Step 2: Use the Tag Function with a Template Literal

When you use the tag function with a template literal, it processes the template and the interpolated expressions.

```ts
const name = "world";
const result = tagFunction`Hello, ${name}!`;
// result is { text: "Hello, $0!", values: ["world"] }
```

### How the Arguments Are Passed

When the tag function `tagFunction` is invoked with the template literal `` `Hello, ${name}!` ``, it receives:

1. **strings**: An array of strings: `["Hello, ", "!"]`
2. **values**: An array of substitution values: `["world"]`

The `tagFunction` then processes these arrays to produce the final result.

### Using Tagged Template Literals for SQL Queries

To use this with SQL queries, you can create a tag function that constructs a parameterized query:

1. **Template Strings Array**: Holds the static parts of the SQL query.
2. **Substitution Values**: Holds the dynamic parts of the SQL query (parameters).

Here's the complete example again with explanations:

```ts
import { Client } from 'pg';

// Tag function to handle SQL query construction
function sqlQuery(strings: TemplateStringsArray, ...values: any[]): { text: string, values: any[] } {
  // Combine the strings with placeholders for values
  const text = strings.reduce((prev, current, i) => prev + '$' + i + current);
  return { text, values };
}

// Modified sql function to use tagged template literals
export async function sql<T>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<{ rows: T[]; rowCount: number; command: string; oid: number }> {
  const client = new Client();
  
  await client.connect();
  const query = sqlQuery(strings, ...values);
  const res = await client.query(query.text, query.values);
  await client.end();

  return res;
}

// Usage example
const query = 'some_query_string';
const count = await sql<{ count: string }>`
  SELECT COUNT(*)
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  WHERE
    customers.name ILIKE ${`%${query}%`} OR
    customers.email ILIKE ${`%${query}%`} OR
    invoices.amount::text ILIKE ${`%${query}%`} OR
    invoices.date::text ILIKE ${`%${query}%`} OR
    invoices.status ILIKE ${`%${query}%`}
`;
```

##