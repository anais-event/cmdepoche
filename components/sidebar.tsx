'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, CalendarDays, BarChart3, Settings } from 'lucide-react';

const HIDDEN_ON = ['/login', '/landing', '/onboarding'];

const NAV_ITEMS = [
  { href: '/import', label: 'Accueil', icon: Home },
  { href: '/planning', label: 'Planning', icon: CalendarDays },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/settings', label: 'Réglages', icon: Settings },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  if (HIDDEN_ON.some(p => pathname.startsWith(p))) return null;

  return (
    <aside className="hidden md:flex flex-col w-56 fixed left-0 top-0 h-screen bg-card border-r border-border py-8 px-4 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-terra flex items-center justify-center shadow-sm">
          <span className="text-white font-cinzel font-bold text-xs">CM</span>
        </div>
        <span className="font-cinzel text-base font-semibold text-text">CM de Poche</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-terra-bg text-terra'
                  : 'text-sub hover:bg-border-l hover:text-text'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <p className="text-[10px] text-muted">CM de Poche v0.1</p>
      </div>
    </aside>
  );
}
