'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Compass, Layers, CalendarClock, Clock } from 'lucide-react';

// ÉTAPE 7 : la stratégie de la semaine. Rien d'aléatoire — tout est justifié par le
// brain (objectif, thèmes, voix) et la fréquence choisie (R6 : dates clés incluses).
// C'est la dernière étape de l'onboarding : valider prépare la 1re semaine.

const ANGLE_BY_OBJECTIVE: Record<string, string> = {
  grow: 'On mise sur des contenus partageables et des accroches qui donnent envie de te suivre.',
  engage: 'On privilégie les formats qui font réagir : questions, coulisses, prises de position.',
  authority: 'On met en avant ton expertise : conseils concrets, démonstrations, avant/après.',
  sell: 'On alterne valeur et offre : on installe la confiance avant de proposer.',
  traffic: 'Chaque contenu pousse vers ton lien, avec un appel à l\'action clair.',
};

// Marronnier générique FR (R6) — dates clés à venir, couche d'anticipation.
const KEY_DATES: { date: string; label: string }[] = [
  { date: '2026-10-31', label: 'Halloween' },
  { date: '2026-11-11', label: 'Journée du célibataire (11.11)' },
  { date: '2026-11-27', label: 'Black Friday' },
  { date: '2026-12-25', label: 'Noël' },
  { date: '2026-12-31', label: 'Nouvel An' },
  { date: '2027-02-14', label: 'Saint-Valentin' },
];

const FREQ_N: Record<string, number> = { '2/week': 2, '3/week': 3, '4/week': 4, '5/week': 5 };

function weeksUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.round(diff / (7 * 86400000));
}

export default function OnboardingStrategyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [brain, setBrain] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);
      const { data } = await supabase.from('brand_brain').select('*').eq('user_id', session.user.id).single();
      setBrain(data);
      setLoading(false);
    };
    load();
  }, [router]);

  const handleStart = async () => {
    if (!userId) return;
    setSaving(true);
    await supabase.from('profiles').update({ onboarding_completed: true, updated_at: new Date().toISOString() }).eq('id', userId);
    setSaving(false);
    router.push('/planning');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-terra animate-spin" />
      </div>
    );
  }

  const objective = brain?.objective || 'grow';
  const freq = brain?.posting_frequency || '3/week';
  const nPosts = FREQ_N[freq] || 3;
  const pillars: { name: string }[] = Array.isArray(brain?.content_pillars) ? brain.content_pillars : [];
  const slots: { day: string; time: string }[] = Array.isArray(brain?.best_posting_slots) && brain.best_posting_slots.length
    ? brain.best_posting_slots
    : [
        { day: 'Lundi', time: '18:30' },
        { day: 'Mercredi', time: '12:00' },
        { day: 'Vendredi', time: '19:00' },
        { day: 'Samedi', time: '10:00' },
        { day: 'Dimanche', time: '17:00' },
      ];
  const upcoming = KEY_DATES.map((d) => ({ ...d, w: weeksUntil(d.date) })).filter((d) => d.w >= 0 && d.w <= 8).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen py-6">
      <div className="flex items-center gap-2 mt-2 mb-1">
        <Compass size={18} className="text-terra" />
        <h1 className="font-cinzel text-xl font-semibold text-text">Ta stratégie de la semaine</h1>
      </div>
      <p className="text-sm text-sub mb-6">
        {nPosts} contenus, pensés pour ton objectif. Voici le plan avant qu&apos;on prépare tes posts.
      </p>

      {/* Angle */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Compass size={16} className="text-terra" />
          <h2 className="font-cinzel text-sm font-semibold text-text">L&apos;angle</h2>
        </div>
        <p className="text-sm text-text leading-relaxed">{ANGLE_BY_OBJECTIVE[objective]}</p>
      </div>

      {/* Piliers activés */}
      {pillars.length > 0 && (
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-terra" />
            <h2 className="font-cinzel text-sm font-semibold text-text">Tes thèmes cette semaine</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {pillars.map((p, i) => (
              <span key={i} className="pill text-xs">{p.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Dates clés à venir (R6) */}
      {upcoming.length > 0 && (
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock size={16} className="text-terra" />
            <h2 className="font-cinzel text-sm font-semibold text-text">À anticiper</h2>
          </div>
          <div className="space-y-2">
            {upcoming.map((d) => (
              <div key={d.label} className="flex items-center justify-between text-sm">
                <span className="text-text">{d.label}</span>
                <span className="text-xs text-sub">{d.w === 0 ? 'cette semaine' : `dans ${d.w} sem.`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Créneaux */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-terra" />
          <h2 className="font-cinzel text-sm font-semibold text-text">Tes créneaux</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {slots.slice(0, nPosts).map((s, i) => (
            <span key={i} className="pill text-xs">{s.day} {s.time}</span>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <button onClick={handleStart} disabled={saving} className="btn-primary flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> ...</> : 'Préparer ma semaine →'}
        </button>
      </div>
    </div>
  );
}
