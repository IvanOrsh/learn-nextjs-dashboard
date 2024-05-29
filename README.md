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

## 6. Mutating Data

### Create Invoice Example:

1. Create a form to capture the user's input.
2. Create a server action and invoke it from the form.
3. Inside your server action, extract the data from the `formData` object.
4. Validate and prepare the data to be inserted into your database.
5. Insert the data and handle any errors.
6. **Revalidate the cache** and redirect the user back to invoices page. 

```tsx
// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    'use server';
 
    // Logic to mutate data...
  }
 
  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}
```

1. create server action:

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { sql } from './db';

/*
  export type Invoice = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;  
    status: 'pending' | 'paid';
  };
*/

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: Number(formData.get('amount')),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

2. invoke the action using the "action" attribute:

```tsx
// ...
  return (
    <form action={createInvoice}>
    </form>
  );
// ...
```

### Update Invoice Example

1. Create a new dynamic route segment with the invoice `id`. (`/dashboard/invoices/[id]/edit/`)
2. Read the invoice `id` from the page params.
3. Fetch the specific invoice from the database.
4. Pre-populate the form with the invoice data.
5. Update the invoice data in your database.

updateInvoice action:

```ts
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET
      customer_id = ${customerId},
      amount = ${amountInCents},
      status = ${status}
    WHERE
      id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

### Delete Invoice Example

deleAction:

```ts
export async function deleteInvoice(id: string) {
  await sql`
    DELETE FROM invoices
    WHERE
      id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
}
```

## 7. Handling Errors

### Handling Errors with `error.tsx`

Use `error.tsx` (for example, `/dashboard/invoices/error.tsx`) to define a UI boundary for a route segment. It serves as a **catch-all** for unexpected errors and allows you to display a fallback UI to your users.

```tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>

      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // attempt to recover by trying to re-render the invoice route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
```

### Handling 404 errors with the `notFound` function

notFound.tsx:

```tsx
import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
 
export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
```

## 8. Form validation (server-side validation)

1. In our component (form):
   1. `"use client";` directive
   2. import `useFormState` from `react-dom`. This hook:
      1. takes 2 arguments: action, initial state
      2. returns two value `[state, dispatch]` - the form state and a dispatch function
```tsx
// ...
import { useFormState } from 'react-dom';
 
export default function Form({ customers }: { customers: CustomerField[] }) {
  const [state, dispatch] = useFormState(createInvoice, initialState);
 
  return <form action={dispatch}>...</form>;
}
```

2. in our action file:

update schema:

```ts
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
```

update `createInvoice` action to accept two parameters:

```ts
// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
export async function createInvoice(prevState: State, formData: FormData) {
  // ...
}
```

- `formData`
- `prevState` - contains the state passed from the `useFormState` hook. It's a required prop.

change the Zod `parse()` to `safeParse()`:

```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // ...
}
```

`safeParse()` will return an object containing a `success` or `error` field.

```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

Some accessibility considerations:

- `aria-describedby="customer-error"`: This establishes a relationship between the select element and the error message container. It indicates that the container with `id="customer-error"` describes the select element. Screen readers will read this description when the user interacts with the select box to notify them of errors.
- `id="customer-error"`: This id attribute uniquely identifies the HTML element that holds the error message for the select input. This is necessary for aria-describedby to establish the relationship.
- `aria-live="polite"`: The screen reader should politely notify the user when the error inside the div is updated. When the content changes (e.g. when a user corrects an error), the screen reader will announce these changes, but only when the user is idle so as not to interrupt them.

## 9. Auth with `next-auth`

1. Create login route

/login/page.tsx:

```tsx
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
```

2. Set up `next-auth`
   1. Install `next-auth`:  `npm install next-auth@beta`
   2. generate a secret key for you app: `openssl rand -base64 32`
   3. put this key in `.env`: `AUTH_SECRET=secret_key`

3. Add the pages option:

`auth.config.ts`:

```ts
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
};
```
You can use the `pages` option to **specify the route for custom sign-in, sign-out, and error pages**.

4. Protect your routes with Next.js Middleware

Add logic to protect your routes:

auth.config.ts:

```ts
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
```

- `authorized` callback is used to verify if the request is authorized to access a page via Next.js Middleware.
- `providers` option is an array where you list different login options.

Import the `authConfig` object into a **Middleware** file.

middlewares.ts - **BY CONVENTION, IT SHOULD LIVE IN ROOT FOLDER OR `src`**:

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

5. Password hashing

Before storing passwords in your database, you need to hash them.

auth.ts

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
```

6. Adding the Credentials provider

auth.ts:

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({})],
});
```

The Credentials provider allows users to log in with a username and a password.

7. Adding the sign in functionality

You can `authorize` function tto handle authentication logic.

auth.ts:

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
      },
    }),
  ],
});
```

After validating the credentials, create a new `getUser` function that queries the user from the database:

```ts
import type { User } from '@/lib/definitions';
import { sql } from '@/lib/server/db';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            return null;
          }

          const passwordMatch = await Bun.password.verify(
            user.password,
            password,
          );
          if (passwordMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
});
```

8. Update the login form

server actions:

```ts
'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

```

and then update the login form:

```tsx
// ...
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
 
export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
 
  return (
    <form action={dispatch} className="space-y-3">
    {/* ... */}
    </form>
  );
}
```

## 10. Metadata

### 10.1 Intro

- provides additional details about a webpage
- not visible to the users visiting the page
- usually embedded within the page's HTML, usually the `head` element.
- crucial for search engines and other systems that need to understand you webpage's content better.

### 10.2 Types of metadata:

1. Title Metadata: Responsible for the title of a webpage that is displayed on the browser tab. It's crucial for SEO as it helps search engines understand what the webpage is about.

```html
<title>Page Title</title>
```

2. Description Metadata: This metadata provides a brief overview of the webpage content and is often displayed in search engine results.

```html
<meta name="description" content="A brief description of the page content." />
```

3. Keyword Metadata: This metadata includes the keywords related to the webpage content, helping search engines index the page.

```html
<meta name="keywords" content="keyword1, keyword2, keyword3" />
```

4. Open Graph Metadata: This metadata enhances the way a webpage is represented when shared on social media platforms, providing information such as the title, description, and preview image.

```html
<meta property="og:title" content="Title Here" />
<meta property="og:description" content="Description Here" />
<meta property="og:image" content="image_url_here" />
```

5. Favicon Metadata: This metadata links the favicon (a small icon) to the webpage, displayed in the browser's address bar or tab.

```html
<link rel="icon" href="path/to/favicon.ico" />
```

### 10.3 Adding metadata

- Config based: Export a static metadata object or a dynamic `generateMetadata` function ina a `layout` or `page` file
- File-based:
  - `favicon.ico`, etc,: utilized for favicons and icons
  - `opengraph-image.jpg`, `twitter-image.jpg`: employed for social media
  - `robots.txt`: provides instructions for search engine crawling
  - `sitemap.xml`: provides a list of URLs to be indexed by search engines (website structure)