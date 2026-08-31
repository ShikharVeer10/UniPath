import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'UniPath — Know your odds before you apply',
  description: 'AI-powered university admission predictor for study-abroad students.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background text-foreground">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
