import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google'
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import SimpleProvider from "@/providers/SupabaseProvider";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Text Behind Image",
  description: "Create text behind image designs",
  icons: {
    icon: "https://img.icons8.com/pastel-glyph/64/00FF00/image--v2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <SimpleProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div>
              {children}
              <Analytics />
              <SpeedInsights />
              <Toaster />
            </div>
          </ThemeProvider>
        </SimpleProvider>
      </body>
    </html>
  );
}
