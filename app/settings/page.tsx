'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import BackButton from '@/components/back-button';
import { User, RefreshCw, CreditCard, LogOut, ChevronRight, Crown, Instagram, Check, AlertCircle, ChevronDown, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showProGuide, setShowProGuide] = useState(false);

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

      {/* Guide compte Pro Instagram */}
      {!profile?.instagram_access_token && (
        <div className="card mb-6">
          <button
            onClick={() => setShowProGuide(!showProGuide)}
            className="w-full flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-terra-bg">
              <Instagram size={18} className="text-terra" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text">Passer en compte Pro</p>
              <p className="text-xs text-sub">Requis pour connecter Instagram</p>
            </div>
            <ChevronDown size={16} className={`text-muted transition-transform ${showProGuide ? 'rotate-180' : ''}`} />
          </button>

          {showProGuide && (
            <div className="mt-4 space-y-4">
              <p className="text-xs text-sub">
                CM de Poche utilise l&apos;API Instagram qui n&apos;est disponible que pour les comptes <strong className="text-text">Professionnel</strong> ou <strong className="text-text">Créateur</strong>. Voici comment passer en Pro :
              </p>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terra-bg text-terra text-xs font-bold flex items-center justify-center">1</span>
                  <div>
                    <p className="text-sm text-text font-medium">Ouvre Instagram</p>
                    <p className="text-xs text-sub">Va sur ton profil, puis appuie sur le menu &#9776; en haut à droite</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terra-bg text-terra text-xs font-bold flex items-center justify-center">2</span>
                  <div>
                    <p className="text-sm text-text font-medium">Paramètres &gt; Type de compte</p>
                    <p className="text-xs text-sub">Appuie sur &quot;Passer à un compte professionnel&quot;</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terra-bg text-terra text-xs font-bold flex items-center justify-center">3</span>
                  <div>
                    <p className="text-sm text-text font-medium">Choisis &quot;Créateur&quot;</p>
                    <p className="text-xs text-sub">Sélectionne la catégorie qui te correspond (blogueur, artiste, etc.)</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terra-bg text-terra text-xs font-bold flex items-center justify-center">4</span>
                  <div>
                    <p className="text-sm text-text font-medium">Lie une Page Facebook</p>
                    <p className="text-xs text-sub">Crée ou connecte une Page Facebook (obligatoire pour l&apos;API). Tu peux la garder invisible.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terra-bg text-terra text-xs font-bold flex items-center justify-center">5</span>
                  <div>
                    <p className="text-sm text-text font-medium">Reviens ici et connecte</p>
                    <p className="text-xs text-sub">Appuie sur &quot;Connecter&quot; ci-dessus pour lier ton compte</p>
                  </div>
                </div>
              </div>

              <a
                href="https://help.instagram.com/502981923235522"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-terra font-medium mt-2"
              >
                <ExternalLink size={12} />
                Guide officiel Instagram
              </a>

              <div className="bg-card-alt rounded-xl p-3">
                <p className="text-xs text-sub">
                  <strong className="text-text">Pas de panique !</strong> Le passage en Pro est gratuit, instantané, et tu ne perds aucun abonné ni contenu. Tu gagnes même accès aux statistiques Instagram.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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
