'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import BackButton from '@/components/back-button';
import { User, RefreshCw, CreditCard, LogOut, ChevronRight, Crown } from 'lucide-react';
import type { Profile, Subscription } from '@/lib/supabase';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [subscription, setSubscription] = useState<Partial<Subscription> | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(p);

      const { data: s } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      setSubscription(s);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const plan = subscription?.plan || 'free';

  const menuItems = [
    {
      icon: User,
      label: 'Mon profil Instagram',
      desc: profile?.instagram_handle ? `@${profile.instagram_handle}` : 'Non configuré',
      action: () => router.push('/settings/profile'),
    },
    {
      icon: RefreshCw,
      label: 'Relancer le diagnostic',
      desc: 'Mettre à jour ton analyse et SWOT',
      action: () => router.push('/onboarding/analysis'),
    },
    {
      icon: CreditCard,
      label: 'Mon abonnement',
      desc: plan === 'pro' ? 'Pro — 19€/mois' : 'Gratuit',
      action: async () => {
        if (plan === 'pro') {
          const res = await fetch('/api/stripe/portal', { method: 'POST' });
          const data = await res.json();
          if (data.url) window.location.href = data.url;
        } else {
          const res = await fetch('/api/stripe/checkout', { method: 'POST' });
          const data = await res.json();
          if (data.url) window.location.href = data.url;
        }
      },
    },
  ];

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      <BackButton href="/planning" />

      <h1 className="font-cinzel text-xl font-semibold text-text mt-4 mb-6">Réglages</h1>

      {/* Plan actuel */}
      <div className="card mb-6 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          plan === 'pro' ? 'bg-terra-bg' : 'bg-border-l'
        }`}>
          <Crown size={18} className={plan === 'pro' ? 'text-terra' : 'text-muted'} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-text">
            Plan {plan === 'pro' ? 'Pro' : 'Gratuit'}
          </p>
          <p className="text-xs text-sub">
            {plan === 'pro' ? 'Génération illimitée' : '1 génération incluse'}
          </p>
        </div>
        {plan === 'free' && (
          <button
            onClick={menuItems[2].action}
            className="text-xs text-terra font-medium bg-terra-bg px-3 py-1.5 rounded-pill"
          >
            Passer Pro
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="space-y-2 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="card w-full flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            >
              <Icon size={20} className="text-sub flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{item.label}</p>
                <p className="text-xs text-sub">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </button>
          );
        })}
      </div>

      {/* Déconnexion */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 text-sm text-red-400 py-3 active:opacity-70 transition-opacity"
      >
        <LogOut size={16} />
        Se déconnecter
      </button>

      <BottomNav />
    </div>
  );
}
