import type { Metadata } from "next";
import { IBM_Plex_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "../src/components/providers/Providers";
import { Navbar } from "../src/components/layout/Navbar";
import { CustomCursor } from "../src/components/ui/CustomCursor";
import { AnimatedBackground } from "../src/components/ui/AnimatedBackground";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
    <html lang="en" suppressHydrationWarning className={`${ibmPlexMono.variable} ${dmSans.variable}`}>
      <body className="bg-bg text-text-primary font-sans antialiased min-h-screen relative selection:bg-accent-cyan/30 selection:text-white">
        <CustomCursor />
        <AnimatedBackground />
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
