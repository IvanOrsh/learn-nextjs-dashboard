import clsx from 'clsx';

import { fontSans, fontSerif } from './fonts';
import './global.css';

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
