'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import BackButton from '@/components/back-button';
import { User, RefreshCw, CreditCard, LogOut, ChevronRight, Crown, Instagram, Check, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const igStatus = searchParams?.get('instagram');
  const igError = searchParams?.get('error');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);

      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(p);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const plan = profile?.plan || 'free';

  const menuItems = [
    {
      icon: User,
      label: 'Mon profil Instagram',
      desc: profile?.insta_handle ? `@${profile.insta_handle}` : 'Non configuré',
      action: () => router.push('/settings/profile'),
    },
    {
      icon: RefreshCw,
      label: 'Relancer le diagnostic',
      desc: 'Mettre à jour ton analyse et SWOT',
      action: () => router.push('/onboarding'),
    },
    {
      icon: CreditCard,
      label: 'Mon abonnement',
      desc: plan === 'pro' ? 'Pro — 19€/mois' : plan === 'business' ? 'Business — 49€/mois' : 'Gratuit',
      action: () => router.push('/landing#pricing'),
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

      {/* Connexion Instagram */}
      <div className="card mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            profile?.instagram_access_token ? 'bg-sage-bg' : 'bg-border-l'
          }`}>
            <Instagram size={18} className={profile?.instagram_access_token ? 'text-sage' : 'text-muted'} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text">
              {profile?.instagram_access_token ? 'Instagram connecté' : 'Connecter Instagram'}
            </p>
            <p className="text-xs text-sub">
              {profile?.instagram_access_token
                ? `@${profile.insta_handle || 'connecté'}`
                : 'Synchronise tes stats et ton profil'}
            </p>
          </div>
          {profile?.instagram_access_token ? (
            <Check size={18} className="text-sage" />
          ) : (
            <a
              href={`/api/auth/instagram?user_id=${userId}`}
              className="text-xs text-white font-medium bg-terra px-3 py-1.5 rounded-pill"
            >
              Connecter
            </a>
          )}
        </div>
        {igStatus === 'connected' && (
          <p className="text-xs text-sage mt-3 flex items-center gap-1">
            <Check size={12} /> Instagram connecté avec succès !
          </p>
        )}
        {igError && (
          <p className="text-xs text-red-400 mt-3 flex items-center gap-1">
            <AlertCircle size={12} />
            {igError === 'no_page' ? 'Aucune Page Facebook liée trouvée'
              : igError === 'no_instagram' ? 'Aucun compte Instagram Pro/Business lié à ta Page'
              : igError === 'instagram_denied' ? 'Connexion annulée'
              : 'Erreur de connexion Instagram'}
          </p>
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
