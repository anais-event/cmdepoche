'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import { RefreshCw, LogOut, Crown, Instagram, Check, AlertCircle, ChevronDown, ExternalLink, Loader2, Save } from 'lucide-react';

// Réglages (accès secondaire). Fusionne l'ancienne sous-page "profil".
// Contient : connexion Instagram, ajustement de la fréquence, bases de marque, plan, compte.
// La connexion initiale a lieu dans l'onboarding (porte A) — ici c'est reconnexion/gestion.

const FREQUENCIES = [
  { value: '2/week', label: '2 / semaine' },
  { value: '3/week', label: '3 / semaine' },
  { value: '4/week', label: '4 / semaine' },
  { value: '5/week', label: '5 / semaine' },
];

export default function SettingsPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showProGuide, setShowProGuide] = useState(false);

  // Marque + rythme (corrigeables)
  const [brandName, setBrandName] = useState('');
  const [tone, setTone] = useState('');
  const [frequency, setFrequency] = useState('3/week');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const igStatus = searchParams?.get('instagram');
  const igError = searchParams?.get('error');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);

      const [{ data: p }, { data: brain }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('brand_brain').select('brand_name, tone_of_voice, posting_frequency').eq('user_id', session.user.id).single(),
      ]);
      setProfile(p);
      setBrandName(brain?.brand_name || p?.brand_name || '');
      setTone(brain?.tone_of_voice || p?.detected_tone || '');
      setFrequency(brain?.posting_frequency || p?.posting_frequency || '3/week');
    };
    load();
  }, [router]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setSaved(false);
    await supabase.from('brand_brain').upsert(
      { user_id: userId, brand_name: brandName.trim() || null, tone_of_voice: tone.trim() || null, posting_frequency: frequency, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    await supabase.from('profiles').update({ posting_frequency: frequency }).eq('id', userId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const plan = profile?.plan || 'free';

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      <h1 className="font-cinzel text-xl font-semibold text-text mb-6">Réglages</h1>

      {/* Plan actuel */}
      <div className="card mb-6 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${plan === 'pro' ? 'bg-terra-bg' : 'bg-border-l'}`}>
          <Crown size={18} className={plan === 'pro' ? 'text-terra' : 'text-muted'} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-text">Plan {plan === 'pro' ? 'Pro' : 'Gratuit'}</p>
          <p className="text-xs text-sub">{plan === 'pro' ? 'Pro — 29€/mois' : '10 crédits inclus par mois'}</p>
        </div>
        {plan === 'free' && (
          <a href="/landing#tarifs" className="text-xs text-terra font-medium bg-terra-bg px-3 py-1.5 rounded-pill">
            Passer Pro
          </a>
        )}
      </div>

      {/* Connexion Instagram */}
      <div className="card mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile?.instagram_access_token ? 'bg-sage-bg' : 'bg-border-l'}`}>
            <Instagram size={18} className={profile?.instagram_access_token ? 'text-sage' : 'text-muted'} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text">
              {profile?.instagram_access_token ? 'Instagram connecté' : 'Connecter Instagram'}
            </p>
            <p className="text-xs text-sub">
              {profile?.instagram_access_token ? `@${profile.insta_handle || 'connecté'}` : 'Synchronise tes stats et ton profil'}
            </p>
          </div>
          {profile?.instagram_access_token ? (
            <Check size={18} className="text-sage" />
          ) : (
            <a href={`/api/auth/instagram?user_id=${userId}`} className="text-xs text-white font-medium bg-terra px-3 py-1.5 rounded-pill">
              Connecter
            </a>
          )}
        </div>
        {igStatus === 'connected' && (
          <p className="text-xs text-sage mt-3 flex items-center gap-1"><Check size={12} /> Instagram connecté avec succès !</p>
        )}
        {igError && (
          <p className="text-xs text-red-400 mt-3 flex items-center gap-1">
            <AlertCircle size={12} />
            {igError === 'instagram_denied' ? 'Connexion annulée'
              : igError === 'invalid_state' ? 'Session de connexion expirée, réessaie'
              : igError === 'token_failed' ? 'Échange de jeton Instagram échoué'
              : igError === 'save_failed' ? 'Enregistrement impossible, réessaie'
              : 'Erreur de connexion Instagram'}
          </p>
        )}
      </div>

      {/* Guide compte Pro Instagram */}
      {!profile?.instagram_access_token && (
        <div className="card mb-6">
          <button onClick={() => setShowProGuide(!showProGuide)} className="w-full flex items-center gap-3 text-left">
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
                CM de Poche utilise l&apos;API Instagram qui n&apos;est disponible que pour les comptes <strong className="text-text">Professionnel</strong> ou <strong className="text-text">Créateur</strong>. Aucune Page Facebook requise.
              </p>
              <div className="space-y-3">
                {[
                  ['1', 'Ouvre Instagram', 'Va sur ton profil, puis appuie sur le menu en haut à droite'],
                  ['2', 'Paramètres > Type de compte', 'Appuie sur « Passer à un compte professionnel »'],
                  ['3', 'Choisis « Créateur »', 'Sélectionne la catégorie qui te correspond'],
                  ['4', 'Reviens ici et connecte', 'Appuie sur « Connecter » ci-dessus'],
                ].map(([n, t, d]) => (
                  <div key={n} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terra-bg text-terra text-xs font-bold flex items-center justify-center">{n}</span>
                    <div>
                      <p className="text-sm text-text font-medium">{t}</p>
                      <p className="text-xs text-sub">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="https://help.instagram.com/502981923235522" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-terra font-medium mt-2">
                <ExternalLink size={12} /> Guide officiel Instagram
              </a>
            </div>
          )}
        </div>
      )}

      {/* Ma marque + rythme (ex sous-page profil) */}
      <div className="card mb-6 space-y-4">
        <h2 className="font-cinzel text-sm font-semibold text-text">Ma marque</h2>
        <div>
          <label className="text-sm font-medium text-text mb-1.5 block">Nom de marque / projet</label>
          <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Mon projet" className="input" />
        </div>
        <div>
          <label className="text-sm font-medium text-text mb-1.5 block">Ta façon de parler</label>
          <input type="text" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Le ton qui te ressemble" className="input" />
        </div>
        <div>
          <label className="text-sm font-medium text-text mb-2 block">Fréquence de publication</label>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((f) => (
              <button key={f.value} onClick={() => setFrequency(f.value)} className={`pill text-xs ${frequency === f.value ? 'pill-active' : ''}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Sauvegarde...</> : saved ? 'Sauvegardé ✓' : <><Save size={18} /> Enregistrer</>}
        </button>
      </div>

      {/* Relancer le diagnostic */}
      <button onClick={() => router.push('/onboarding')} className="card w-full flex items-center gap-3 text-left active:scale-[0.98] transition-transform mb-8">
        <RefreshCw size={20} className="text-sub flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-text">Relancer l&apos;analyse</p>
          <p className="text-xs text-sub">Refaire le diagnostic de ton compte</p>
        </div>
      </button>

      <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-sm text-red-400 py-3 active:opacity-70 transition-opacity">
        <LogOut size={16} /> Se déconnecter
      </button>

      <BottomNav />
    </div>
  );
}
