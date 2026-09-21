'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Sparkles } from 'lucide-react';

// ÉTAPE 4 : « Voilà ce que j'ai compris ».
// Lit le brand_brain (source unique) avec repli sur profiles (matière du scan existant).
// L'user vérifie et corrige. Inclut l'analyse de la bio (R9).
// Fusionne l'ancien écran "refine" : on ne demande QUE le non-déductible, ici, en une étape.
// Valider écrit le brand_brain (user_confirmed=true) puis mène à l'objectif (R5).

export default function OnboardingConfirmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);

  // Champs corrigeables
  const [brandName, setBrandName] = useState('');
  const [whatTheySell, setWhatTheySell] = useState('');
  const [audienceWho, setAudienceWho] = useState('');
  const [tone, setTone] = useState('');
  const [pillars, setPillars] = useState('');
  const [bioText, setBioText] = useState('');
  const [bioDiagnostic, setBioDiagnostic] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);

      const [{ data: brain }, { data: profile }] = await Promise.all([
        supabase.from('brand_brain').select('*').eq('user_id', session.user.id).single(),
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
      ]);

      // Le brain prime ; sinon on amorce avec la matière du scan (profiles).
      setBrandName(brain?.brand_name || profile?.brand_name || '');
      setWhatTheySell(brain?.what_they_sell || profile?.brand_desc || '');
      setAudienceWho(brain?.audience?.who || profile?.detected_target || '');
      setTone(brain?.tone_of_voice || profile?.detected_tone || '');
      setPillars(
        Array.isArray(brain?.content_pillars) && brain.content_pillars.length
          ? brain.content_pillars.map((p: { name: string }) => p.name).join(', ')
          : Array.isArray(profile?.niches) ? (profile.niches as string[]).join(', ') : ''
      );
      setBioText(brain?.bio_text || '');
      setBioDiagnostic(brain?.bio_diagnostic || '');
      setPalette(
        (brain?.visual_identity?.colors as string[]) ||
        (profile?.color_palette as string[]) ||
        []
      );

      setLoading(false);
    };
    load();
  }, [router]);

  const handleConfirm = async () => {
    if (!userId) return;
    setSaving(true);

    const pillarList = pillars.split(',').map((s) => s.trim()).filter(Boolean);
    const weight = pillarList.length ? Number((1 / pillarList.length).toFixed(2)) : 0;

    const { error } = await supabase.from('brand_brain').upsert(
      {
        user_id: userId,
        brand_name: brandName.trim() || null,
        what_they_sell: whatTheySell.trim() || null,
        audience: { who: audienceWho.trim() || undefined },
        tone_of_voice: tone.trim() || null,
        content_pillars: pillarList.map((name) => ({ name, weight })),
        bio_text: bioText.trim() || null,
        bio_diagnostic: bioDiagnostic.trim() || null,
        user_confirmed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    setSaving(false);
    if (error) { console.error('confirmBrain:', error); return; }
    router.push('/onboarding/objective');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-terra animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-6">
      <div className="flex items-center gap-2 mt-2 mb-1">
        <Sparkles size={18} className="text-terra" />
        <h1 className="font-cinzel text-xl font-semibold text-text">Voilà ce que j&apos;ai compris</h1>
      </div>
      <p className="text-sm text-sub mb-6">
        Relis, corrige ce qui est faux. C&apos;est la base de tout ce que je vais te proposer.
      </p>

      {/* Palette détectée (lecture) */}
      {palette.length > 0 && (
        <div className="card mb-4">
          <h2 className="font-cinzel text-sm font-semibold text-text mb-3">Ton univers visuel</h2>
          <div className="flex gap-2">
            {palette.slice(0, 6).map((color, i) => (
              <div key={i} className="flex-1 aspect-square rounded-xl border border-border" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      )}

      {/* Compréhension corrigeable */}
      <div className="card mb-4 space-y-4">
        <Field label="Ta marque / ton projet" value={brandName} onChange={setBrandName} placeholder="Le nom que tu portes" />
        <Field label="Ce que tu proposes" value={whatTheySell} onChange={setWhatTheySell} placeholder="Ton offre en une phrase" textarea />
        <Field label="À qui tu parles" value={audienceWho} onChange={setAudienceWho} placeholder="Ta cible principale" />
        <Field label="Ta façon de parler" value={tone} onChange={setTone} placeholder="Le ton qui te ressemble" />
        <Field label="Tes thèmes récurrents" value={pillars} onChange={setPillars} placeholder="Sépare par des virgules" hint="Les sujets sur lesquels tu reviens souvent" />
      </div>

      {/* Bio Instagram (R9) */}
      <div className="card mb-8 space-y-4">
        <h2 className="font-cinzel text-sm font-semibold text-text">Ta bio Instagram</h2>
        <Field label="Texte de ta bio" value={bioText} onChange={setBioText} placeholder="Colle ou corrige ta bio" textarea />
        <Field label="Ce que ta bio dit de toi" value={bioDiagnostic} onChange={setBioDiagnostic} placeholder="Ce qu'on en comprend, ce qui pourrait être plus clair" textarea hint="On s'en sert pour juger la clarté de ton positionnement" />
      </div>

      <div className="mt-auto">
        <button onClick={handleConfirm} disabled={saving} className="btn-primary flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={18} className="animate-spin" /> Enregistrement...</> : "C'est juste, on continue →"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea, hint }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-text mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2} className="input min-h-[64px] resize-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input" />
      )}
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}
