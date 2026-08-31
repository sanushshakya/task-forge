// app/layout.tsx

import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'A Next.js 14 App Router project with a custom layout.',
  themeColor: '#007bff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    startURL: '/?standalone=true',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional head content can be added here */}
      </head>
      <body>{children}</body>
    </html>
  );
}