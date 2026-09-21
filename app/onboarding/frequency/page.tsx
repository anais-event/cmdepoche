'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

// ÉTAPE 6 : la fréquence (R5). On fixe le rythme AVANT de construire quoi que ce soit.
// 3/semaine est présélectionné, mais l'user choisit librement.

const OPTIONS = [
  { value: '2/week', n: 2, label: '2 par semaine', desc: 'Léger, régulier, tenable' },
  { value: '3/week', n: 3, label: '3 par semaine', desc: 'Le bon rythme pour progresser' },
  { value: '4/week', n: 4, label: '4 par semaine', desc: 'Soutenu, pour accélérer' },
  { value: '5/week', n: 5, label: '5 par semaine', desc: 'Intensif, presque tous les jours' },
];

export default function OnboardingFrequencyPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState('3/week');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);
      const { data } = await supabase.from('brand_brain').select('posting_frequency').eq('user_id', session.user.id).single();
      if (data?.posting_frequency) setFrequency(data.posting_frequency);
    };
    init();
  }, [router]);

  const handleNext = async () => {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase.from('brand_brain').upsert(
      { user_id: userId, posting_frequency: frequency, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    // Miroir sur profiles pour compatibilité.
    await supabase.from('profiles').update({ posting_frequency: frequency }).eq('id', userId);
    setSaving(false);
    if (error) { console.error('frequency:', error); return; }
    router.push('/onboarding/strategy');
  };

  return (
    <div className="flex flex-col min-h-screen py-6">
      <p className="text-xs text-terra font-semibold uppercase tracking-wider mt-2">Ton rythme</p>
      <h1 className="font-cinzel text-xl font-semibold text-text mt-1 mb-1">Combien de contenus par semaine ?</h1>
      <p className="text-sm text-sub mb-6">On construit ta semaine autour de ce rythme. Tu pourras l&apos;ajuster plus tard.</p>

      <div className="flex flex-col gap-2 mb-4">
        {OPTIONS.map((opt) => {
          const active = frequency === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFrequency(opt.value)}
              className={`card text-left flex items-center gap-4 transition-colors ${active ? 'border-terra bg-terra-bg' : ''}`}
            >
              <span className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${active ? 'bg-terra text-white' : 'bg-border-l text-sub'}`}>
                {opt.n}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{opt.label}</p>
                <p className="text-xs text-sub">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <button onClick={handleNext} disabled={saving} className="btn-primary flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> ...</> : 'Voir ma stratégie →'}
        </button>
      </div>
    </div>
  );
}
