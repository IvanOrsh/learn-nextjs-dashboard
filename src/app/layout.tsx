import clsx from 'clsx';
import type { Metadata } from 'next';

import { fontSans, fontSerif } from './fonts';
import './global.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard build with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx('antialiased', fontSans.variable, fontSerif.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
