import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'FirstTap — Voice-First Digital Literacy Companion',
  description:
    'A voice-first digital literacy companion for beginners in India, teaching smartphones, UPI digital payments, and cyber safety in Tamil, Hindi, and English.',
  keywords: [
    'Digital Literacy',
    'Voice-First',
    'Tamil',
    'Hindi',
    'India',
    'UPI Safety',
    'OTP Security',
    'Smartphone Learning',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" style={{ colorScheme: 'light' }} className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-amber-50/30 text-slate-900">
        {children}
      </body>
    </html>
  );
}
