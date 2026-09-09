import type { Metadata, Viewport } from 'next';
import AuthSync from '@/components/auth-sync';
import AppShell from '@/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'CM de Poche — Ton community manager de poche',
  description: 'Crée, planifie et publie ton contenu Instagram automatiquement. Pour les micro-influenceurs qui veulent poster mieux, sans y passer des heures.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthSync />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
