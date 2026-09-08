'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/back-button';

const AGE_OPTIONS = ['18-24', '25-34', '35-44', '45-54', '55+'];
const SEX_OPTIONS = ['Femmes', 'Hommes', 'Mixte'];
const SOCIAL_PLATFORMS = ['TikTok', 'LinkedIn', 'YouTube', 'Pinterest'];
const OBJECTIVE_DETAILS = [
  { value: 'visibility' as const, label: 'Visibilité', desc: 'Être vu par plus de monde' },
  { value: 'views' as const, label: 'Faire des vues', desc: 'Générer des impressions' },
  { value: 'community' as const, label: 'Créer une communauté', desc: 'Engager sur la durée' },
  { value: 'sales' as const, label: 'Vendre', desc: 'Vendre un produit / service' },
];

export default function OnboardingRefinePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Cible
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [profession, setProfession] = useState('');
  const [interest, setInterest] = useState('');

  // Autres infos
  const [website, setWebsite] = useState('');
  const [otherSocials, setOtherSocials] = useState<{ platform: string; handle: string }[]>([]);
  const [objectiveDetails, setObjectiveDetails] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('target_details, website, other_socials, objective_details')
        .eq('id', session.user.id)
        .single();
      if (profile) {
        const td = profile.target_details as Record<string, string> | null;
        if (td) {
          setAge(td.age || '');
          setSex(td.sex || '');
          setProfession(td.profession || '');
          setInterest(td.interest || '');
        }
        setWebsite(profile.website || '');
        setOtherSocials((profile.other_socials as { platform: string; handle: string }[]) || []);
        setObjectiveDetails(profile.objective_details || '');
      }
    };
    loadProfile();
  }, []);

  const toggleSocial = (platform: string) => {
    setOtherSocials((prev) => {
      const exists = prev.find((s) => s.platform === platform);
      if (exists) return prev.filter((s) => s.platform !== platform);
      return [...prev, { platform, handle: '' }];
    });
  };

  const updateSocialHandle = (platform: string, handle: string) => {
    setOtherSocials((prev) =>
      prev.map((s) => (s.platform === platform ? { ...s, handle } : s))
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { error } = await supabase
        .from('profiles')
        .update({
          target_details: { age, sex, profession, interest },
          website: website || null,
          other_socials: otherSocials.length > 0 ? otherSocials : null,
          objective_details: objectiveDetails || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;
      router.push('/onboarding/expert');
    } catch (err) {
      console.error('Erreur sauvegarde affinage:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-6">
      <BackButton href="/onboarding/analysis" />

      <h1 className="font-cinzel text-xl font-semibold text-text mt-4 mb-2">Précise ton univers</h1>
      <p className="text-sm text-sub mb-6">Affine les informations pour un diagnostic encore plus précis</p>

      {/* À qui tu parles ? */}
      <div className="card mb-4">
        <h2 className="font-cinzel text-base font-semibold text-text mb-4">À qui tu parles ?</h2>

        <label className="text-sm font-medium text-text mb-2 block">Tranche d&apos;âge</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {AGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setAge(opt)}
              className={`pill text-xs ${age === opt ? 'pill-active' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium text-text mb-2 block">Sexe majoritaire</label>
        <div className="flex gap-2 mb-4">
          {SEX_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setSex(opt)}
              className={`pill text-xs flex-1 ${sex === opt ? 'pill-active' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium text-text mb-2 block">Profession / statut</label>
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="Ex: Étudiantes, entrepreneures..."
          className="input mb-4"
        />

        <label className="text-sm font-medium text-text mb-2 block">Point particulier</label>
        <input
          type="text"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="Centre d'intérêt, contexte de vie..."
          className="input"
        />
      </div>

      {/* Site internet */}
      <div className="card mb-4">
        <label className="text-sm font-medium text-text mb-2 block">Ton site internet</label>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://monsite.com (optionnel)"
          className="input"
        />
      </div>

      {/* Autres réseaux */}
      <div className="card mb-4">
        <label className="text-sm font-medium text-text mb-3 block">Tes autres réseaux</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {SOCIAL_PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => toggleSocial(p)}
              className={`pill text-xs ${otherSocials.find((s) => s.platform === p) ? 'pill-active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
        {otherSocials.map((s) => (
          <input
            key={s.platform}
            type="text"
            value={s.handle}
            onChange={(e) => updateSocialHandle(s.platform, e.target.value)}
            placeholder={`@ton.pseudo ${s.platform}`}
            className="input mb-2"
          />
        ))}
      </div>

      {/* Objectif spécifique */}
      <div className="card mb-8">
        <label className="text-sm font-medium text-text mb-3 block">Ton objectif spécifique</label>
        <div className="space-y-2">
          {OBJECTIVE_DETAILS.map((obj) => (
            <button
              key={obj.value}
              onClick={() => setObjectiveDetails(obj.value)}
              className={`w-full text-left p-3 rounded-input border transition-colors ${
                objectiveDetails === obj.value
                  ? 'border-terra bg-terra-bg'
                  : 'border-border'
              }`}
            >
              <p className="text-sm font-medium text-text">{obj.label}</p>
              <p className="text-xs text-sub">{obj.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Enregistrement...' : 'Continuer →'}
        </button>
      </div>
    </div>
  );
}
