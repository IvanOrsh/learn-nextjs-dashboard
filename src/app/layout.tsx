import clsx from 'clsx';

import { fontSans } from './fonts';
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx('antialiased', fontSans.variable)}>
      <body>{children}</body>
    </html>
  );
}
