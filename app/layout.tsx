import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kinara — Discover Your Galactic Signature',
  description: 'Calculate your Dreamspell Tzolkin Kin and explore your full galactic profile with sound healing frequencies.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* <script defer data-domain="tzolkin.app" src="https://plausible.io/js/script.js"></script> */}
      </head>
      <body className="font-sans bg-parchment text-ink antialiased">{children}</body>
    </html>
  );
}
