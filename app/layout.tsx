import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const heading = Bricolage_Grotesque({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniPath — Know your odds before you apply',
  description: 'AI-powered university admission predictor for study-abroad students.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.className} bg-background text-foreground`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
