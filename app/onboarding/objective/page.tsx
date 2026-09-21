'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, TrendingUp, Heart, Award, ShoppingBag, MousePointerClick } from 'lucide-react';

// ÉTAPE 5 : l'objectif. Il pilote toute la stratégie (brand_brain.objective).
// Une seule action : choisir où l'user veut aller. La fréquence vient juste après (R5).

type Objective = 'grow' | 'engage' | 'authority' | 'sell' | 'traffic';

const OBJECTIVES: { value: Objective; label: string; desc: string; icon: typeof TrendingUp }[] = [
  { value: 'grow', label: 'Gagner des abonnés', desc: 'Toucher plus de monde, élargir ta communauté', icon: TrendingUp },
  { value: 'engage', label: 'Plus d\'engagement', desc: 'Créer du lien, faire réagir ceux qui te suivent', icon: Heart },
  { value: 'authority', label: 'Asseoir mon expertise', desc: 'Devenir une référence sur ton sujet', icon: Award },
  { value: 'sell', label: 'Vendre', desc: 'Transformer ton audience en clients', icon: ShoppingBag },
  { value: 'traffic', label: 'Amener du trafic', desc: 'Envoyer vers ton site, ta boutique, ton lien', icon: MousePointerClick },
];

export default function OnboardingObjectivePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [objective, setObjective] = useState<Objective | null>(null);
  const [details, setDetails] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);
      const { data } = await supabase.from('brand_brain').select('objective, objective_details').eq('user_id', session.user.id).single();
      if (data?.objective) setObjective(data.objective as Objective);
      if (data?.objective_details) setDetails(data.objective_details);
    };
    init();
  }, [router]);

  const handleNext = async () => {
    if (!objective || !userId) return;
    setSaving(true);
    const { error } = await supabase.from('brand_brain').upsert(
      { user_id: userId, objective, objective_details: details.trim() || null, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    setSaving(false);
    if (error) { console.error('objective:', error); return; }
    router.push('/onboarding/frequency');
  };

  return (
    <div className="flex flex-col min-h-screen py-6">
      <p className="text-xs text-terra font-semibold uppercase tracking-wider mt-2">Étape suivante</p>
      <h1 className="font-cinzel text-xl font-semibold text-text mt-1 mb-1">Ton objectif</h1>
      <p className="text-sm text-sub mb-6">Où veux-tu aller ? Toute la stratégie s&apos;aligne dessus.</p>

      <div className="flex flex-col gap-2 mb-4">
        {OBJECTIVES.map(({ value, label, desc, icon: Icon }) => {
          const active = objective === value;
          return (
            <button
              key={value}
              onClick={() => setObjective(value)}
              className={`card text-left flex items-center gap-3 transition-colors ${active ? 'border-terra bg-terra-bg' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-terra' : 'bg-border-l'}`}>
                <Icon size={18} className={active ? 'text-white' : 'text-sub'} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{label}</p>
                <p className="text-xs text-sub">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {objective && (
        <div className="mb-4">
          <label className="text-sm font-medium text-text mb-1.5 block">Une précision ? (optionnel)</label>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Ex : atteindre 5 000 abonnés, lancer ma formation..."
            className="input"
          />
        </div>
      )}

      <div className="mt-auto">
        <button onClick={handleNext} disabled={!objective || saving} className="btn-primary flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> ...</> : 'Continuer →'}
        </button>
      </div>
    </div>
  );
}
