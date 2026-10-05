import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', weight: ['500', '700'] });
const spaceMono = Space_Mono({ subsets: ['latin'], variable: '--font-space-mono', weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'ResumeMatch - Explainable Resume Optimization Platform',
  description:
    'Turn your resume into a job-matched resume. See skill gaps, evidence scores, and optimize your resume directly inside the app.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
