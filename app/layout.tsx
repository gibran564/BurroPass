import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BurroPass',
  description: 'Sistema digital de boletos universitarios',
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="mx-auto min-h-screen max-w-md p-4">{children}</body>
    </html>
  );
}
