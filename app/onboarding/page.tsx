'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Upload, AtSign, Loader2 } from 'lucide-react';

type ScanMode = 'handle' | 'screenshot';
type Objective = 'grow' | 'engage' | 'time' | 'monetize';

const OBJECTIVES: { value: Objective; label: string; emoji: string }[] = [
  { value: 'grow', label: 'Gagner des abonnés', emoji: '📈' },
  { value: 'engage', label: "Plus d'engagement", emoji: '💬' },
  { value: 'time', label: 'Gagner du temps', emoji: '⏱️' },
  { value: 'monetize', label: 'Monétiser', emoji: '💰' },
];

export default function OnboardingPage1() {
  const router = useRouter();
  const [scanMode, setScanMode] = useState<ScanMode>('handle');
  const [handle, setHandle] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [objective, setObjective] = useState<Objective | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canSubmit = objective && (
    (scanMode === 'handle' && handle.trim().length > 0) ||
    (scanMode === 'screenshot' && screenshotFile)
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      let scanResult;

      if (scanMode === 'handle') {
        const res = await fetch('/api/scan/handle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle: handle.replace('@', '') }),
        });
        if (!res.ok) throw new Error('Erreur lors du scan du profil');
        scanResult = await res.json();
      } else {
        const formData = new FormData();
        formData.append('screenshot', screenshotFile!);
        const res = await fetch('/api/scan/screenshot', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error("Erreur lors de l'analyse du screenshot");
        scanResult = await res.json();
      }

      // Sauvegarde en base
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          instagram_handle: scanResult.handle || handle.replace('@', ''),
          followers_count: scanResult.followers_count,
          detected_niche: scanResult.detected_niche,
          detected_tone: scanResult.detected_tone,
          detected_target: scanResult.detected_target,
          color_palette: scanResult.color_palette,
          format_engagement: scanResult.format_engagement_estimate || scanResult.format_engagement,
          engagement_rate: scanResult.engagement_rate,
          optimal_slots: scanResult.optimal_slots,
          objective,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) throw upsertError;

      // Stocke le résultat du scan pour Page 2
      sessionStorage.setItem('scan_result', JSON.stringify(scanResult));
      router.push('/onboarding/analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-terra mx-auto mb-4 flex items-center justify-center">
          <span className="text-white font-cinzel font-bold text-sm">CM</span>
        </div>
        <h1 className="font-cinzel text-xl font-semibold text-text">Bienvenue sur CM de Poche</h1>
        <p className="text-sm text-sub mt-2">Analysons ton compte Instagram pour créer ta stratégie personnalisée</p>
      </div>

      {/* Choix du mode de scan */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setScanMode('handle')}
          className={`flex-1 pill ${scanMode === 'handle' ? 'pill-active' : ''}`}
        >
          <AtSign size={16} className="mr-2" />
          Mon @pseudo
        </button>
        <button
          onClick={() => setScanMode('screenshot')}
          className={`flex-1 pill ${scanMode === 'screenshot' ? 'pill-active' : ''}`}
        >
          <Upload size={16} className="mr-2" />
          Screenshot
        </button>
      </div>

      {/* Zone de saisie selon le mode */}
      {scanMode === 'handle' ? (
        <div className="mb-6">
          <label className="text-sm font-medium text-text mb-2 block">Ton compte Instagram</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">@</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="ton.pseudo"
              className="input pl-8"
            />
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <label className="text-sm font-medium text-text mb-2 block">Screenshot de ton profil</label>
          {screenshotPreview ? (
            <div className="relative rounded-card border border-border overflow-hidden">
              <img src={screenshotPreview} alt="Screenshot" className="w-full object-cover max-h-48" />
              <button
                onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                className="absolute top-2 right-2 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-md text-sub"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-3 py-10 rounded-card border-2 border-dashed border-border cursor-pointer active:border-terra transition-colors">
              <Upload size={32} className="text-muted" />
              <span className="text-sm text-sub">Appuie pour ajouter un screenshot</span>
              <span className="text-xs text-muted">PNG, JPG — max 10 Mo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* Objectif principal */}
      <div className="mb-8">
        <label className="text-sm font-medium text-text mb-3 block">Ton objectif principal</label>
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

      {/* Erreur */}
      {error && <p className="text-sm text-red-500 mb-4 px-1">{error}</p>}

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyse en cours...
            </>
          ) : (
            'Analyser mon feed →'
          )}
        </button>
      </div>
    </div>
  );
}
