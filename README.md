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