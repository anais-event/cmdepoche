'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, Image as Images, BarChart3, Settings } from 'lucide-react';

// Navigation cible (R11) : 3 onglets + Réglages en secondaire.
const NAV_ITEMS = [
  { href: '/planning', label: 'Semaine', icon: CalendarDays },
  { href: '/contenus', label: 'Contenus', icon: Images },
  { href: '/resultats', label: 'Résultats', icon: BarChart3 },
  { href: '/settings', label: 'Réglages', icon: Settings, secondary: true },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-card border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom,8px)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`touch-target flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                active ? 'text-terra' : 'text-muted'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
