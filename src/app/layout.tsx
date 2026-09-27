import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
