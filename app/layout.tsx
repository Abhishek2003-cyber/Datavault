import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, Jost } from "next/font/google";
import "./globals.css";
import { Providers } from "../src/components/providers/Providers";
import { Navbar } from "../src/components/layout/Navbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "DataVault | Confidential AI Dataset Marketplace",
  description: "A private AI dataset marketplace built on Story Protocol CDR threshold encryption system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmMono.variable} ${jost.variable}`}>
      <body className="bg-ivory-100 text-ink-900 font-sans antialiased min-h-screen relative selection:bg-copper-300 selection:text-ink-900">
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
