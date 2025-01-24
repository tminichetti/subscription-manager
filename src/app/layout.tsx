import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: "SubManager - Gestion d'abonnements",
  description: "Gérez facilement tous vos abonnements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body>
          <NavBar />
          <main className="pt-16">
            {children}
          </main>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
