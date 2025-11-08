import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import { pdfPreflight } from '@/ai/preflight/pdfPreflight';

try {
  // Run preflight check on server boot to fail fast if Python entrypoint is wrong.
  pdfPreflight();
} catch (e) {
    console.error("PDF PREFLIGHT FAILED. The Python subsystem for PDF generation is not correctly configured.");
    console.error(e);
}


export const metadata: Metadata = {
  title: 'ScopeSheet Pro',
  description: 'Digital scope sheets and roof analysis for inspectors.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
