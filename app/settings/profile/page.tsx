'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/back-button';
import BottomNav from '@/components/bottom-nav';
import { Loader2, Save, AtSign } from 'lucide-react';

type Objective = 'grow' | 'engage' | 'time' | 'monetize';

const OBJECTIVES: { value: Objective; label: string; emoji: string }[] = [
  { value: 'grow', label: 'Gagner des abonnés', emoji: '📈' },
  { value: 'engage', label: "Plus d'engagement", emoji: '💬' },
  { value: 'time', label: 'Gagner du temps', emoji: '⏱️' },
  { value: 'monetize', label: 'Monétiser', emoji: '💰' },
];

const TONES = ['Authentique', 'Inspirant', 'Éducatif', 'Humoristique', 'Professionnel', 'Décontracté'];

const FREQUENCIES = ['1-2x/semaine', '3-4x/semaine', '5-7x/semaine', 'Quotidien'];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [instaHandle, setInstaHandle] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandDesc, setBrandDesc] = useState('');
  const [tone, setTone] = useState('');
  const [niches, setNiches] = useState('');
  const [frequency, setFrequency] = useState('');
  const [objective, setObjective] = useState<Objective | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setInstaHandle(data.insta_handle || '');
        setBrandName(data.brand_name || '');
        setBrandDesc(data.brand_desc || '');
        setTone(data.tone || '');
        setNiches(Array.isArray(data.niches) ? data.niches.join(', ') : '');
        setFrequency(data.frequency || '');
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        insta_handle: instaHandle.replace('@', '').trim(),
        brand_name: brandName.trim() || null,
        brand_desc: brandDesc.trim() || null,
        tone: tone || null,
        niches: niches.split(',').map(n => n.trim()).filter(Boolean),
        frequency: frequency || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-terra animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      <BackButton href="/settings" />

      <h1 className="font-cinzel text-xl font-semibold text-text mt-4 mb-6">Mon profil</h1>

      <div className="space-y-5">
        {/* Instagram */}
        <div>
          <label className="text-sm font-medium text-text mb-2 block">Compte Instagram</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <AtSign size={16} />
            </span>
            <input
              type="text"
              value={instaHandle}
              onChange={(e) => setInstaHandle(e.target.value)}
              placeholder="ton.pseudo"
              className="input pl-10"
            />
          </div>
        </div>

        {/* Nom de marque */}
        <div>
          <label className="text-sm font-medium text-text mb-2 block">Nom de marque / projet</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Mon projet créatif"
            className="input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-text mb-2 block">Description</label>
          <textarea
            value={brandDesc}
            onChange={(e) => setBrandDesc(e.target.value)}
            placeholder="Décris ton activité en quelques mots..."
            className="input min-h-[80px] resize-none"
            rows={3}
          />
        </div>

        {/* Niche */}
        <div>
          <label className="text-sm font-medium text-text mb-2 block">Niche(s)</label>
          <input
            type="text"
            value={niches}
            onChange={(e) => setNiches(e.target.value)}
            placeholder="Lifestyle, Mode, Beauté..."
            className="input"
          />
          <p className="text-xs text-muted mt-1">Sépare par des virgules</p>
        </div>

        {/* Ton */}
        <div>
          <label className="text-sm font-medium text-text mb-3 block">Ton de communication</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`pill ${tone === t ? 'pill-active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Fréquence */}
        <div>
          <label className="text-sm font-medium text-text mb-3 block">Fréquence de publication</label>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`pill ${frequency === f ? 'pill-active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Objectif */}
        <div>
          <label className="text-sm font-medium text-text mb-3 block">Objectif principal</label>
          <div className="grid grid-cols-2 gap-2">
            {OBJECTIVES.map((obj) => (
              <button
                key={obj.value}
                onClick={() => setObjective(obj.value)}
                className={`pill text-left ${objective === obj.value ? 'pill-active' : ''}`}
              >
                <span className="mr-2">{obj.emoji}</span>
                {obj.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sauvegarde...
            </>
          ) : saved ? (
            'Sauvegardé ✓'
          ) : (
            <>
              <Save size={18} />
              Enregistrer
            </>
          )}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
