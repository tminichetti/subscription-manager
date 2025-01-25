import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: "SubTrack - Gérez vos abonnements simplement",
  description: "SubTrack vous aide à suivre et gérer tous vos abonnements en un seul endroit. Visualisez vos dépenses mensuelles et ne manquez plus jamais un renouvellement.",
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
          <main className="pt-8">
            {children}
          </main>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
