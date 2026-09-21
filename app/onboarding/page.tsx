'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AtSign, Loader2, Upload } from 'lucide-react';

type ScanMode = 'handle' | 'screenshot';

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const [scanMode, setScanMode] = useState<ScanMode>('handle');
  const [handle, setHandle] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);
    };
    init();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canScan =
    (scanMode === 'handle' && handle.trim().length > 0) ||
    (scanMode === 'screenshot' && screenshotFile);

  const runScan = async () => {
    if (!canScan) return;
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
        const res = await fetch('/api/scan/screenshot', { method: 'POST', body: formData });
        if (!res.ok) throw new Error("Erreur lors de l'analyse du screenshot");
        scanResult = await res.json();
      }

      await supabase.from('profiles').upsert({
        id: session.user.id,
        email: session.user.email,
        insta_handle: scanResult.handle || handle.replace('@', ''),
        detected_tone: scanResult.detected_tone,
        detected_niche: scanResult.detected_niche,
        detected_target: scanResult.detected_target,
        niches: scanResult.detected_niche ? [scanResult.detected_niche] : [],
        color_palette: scanResult.color_palette || null,
        optimal_slots: scanResult.optimal_slots || null,
        updated_at: new Date().toISOString(),
      });

      router.push('/onboarding/analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-terra mx-auto mb-4 flex items-center justify-center">
          <span className="text-white font-cinzel font-bold text-sm">CM</span>
        </div>
        <h1 className="font-cinzel text-xl font-semibold text-text">Quel est ton compte ?</h1>
        <p className="text-sm text-sub mt-2 max-w-sm mx-auto">
          Donne-nous ton pseudo Instagram. On analyse ton univers pour construire ta stratégie.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setScanMode('handle')}
          className={`flex-1 pill ${scanMode === 'handle' ? 'pill-active' : ''}`}
        >
          <AtSign size={16} className="mr-2" /> Mon @pseudo
        </button>
        <button
          onClick={() => setScanMode('screenshot')}
          className={`flex-1 pill ${scanMode === 'screenshot' ? 'pill-active' : ''}`}
        >
          <Upload size={16} className="mr-2" /> Screenshot
        </button>
      </div>

      {scanMode === 'handle' ? (
        <div className="mb-6">
          <label className="text-sm font-medium text-text mb-2 block">Ton compte Instagram</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">@</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canScan && runScan()}
              placeholder="ton.pseudo"
              className="input pl-8"
              autoFocus
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
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mb-4 px-1">{error}</p>}

      <div className="mt-auto">
        <button
          onClick={runScan}
          disabled={!canScan || loading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Analyse en cours...</>
          ) : (
            'Analyser mon compte →'
          )}
        </button>
      </div>
    </div>
  );
}
