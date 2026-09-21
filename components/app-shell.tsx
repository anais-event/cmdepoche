'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar';

const FULL_WIDTH_ROUTES = ['/login', '/landing', '/onboarding'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Le parcours /app (artefact porté) se rend brut : pas de sidebar, pas de conteneur.
  if (pathname.startsWith('/app')) {
    return <>{children}</>;
  }

  const isFullWidth = FULL_WIDTH_ROUTES.some(r => pathname.startsWith(r));

  if (isFullWidth) {
    return (
      <div className="container-mobile flex min-h-screen flex-col">
        {children}
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="md:ml-56">
        <div className="container-app flex min-h-screen flex-col">
          {children}
        </div>
      </div>
    </>
  );
}
