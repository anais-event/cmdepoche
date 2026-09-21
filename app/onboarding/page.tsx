'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Instagram, Upload, AtSign, Loader2, Monitor, ChevronLeft } from 'lucide-react';

// ÉTAPE 2 du parcours : le choix de la porte d'entrée.
// Deux portes qui convergent vers le MÊME écran de confirmation (R : convergence).
// Porte A = connexion Instagram (recommandée). Porte B = commencer autrement (handle / screenshot).
// L'objectif et la fréquence NE sont PAS demandés ici (R5 : après la confirmation).

type Porte = 'A' | 'B';
type ScanMode = 'handle' | 'screenshot';

export default function OnboardingPortePage() {
  const router = useRouter();
  const [porte, setPorte] = useState<Porte | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Porte B
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

      // On garde la matière du scan côté profil (source existante).
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
      {/* En-tête */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-terra mx-auto mb-4 flex items-center justify-center">
          <span className="text-white font-cinzel font-bold text-sm">CM</span>
        </div>
        <h1 className="font-cinzel text-xl font-semibold text-text">Par où on commence ?</h1>
        <p className="text-sm text-sub mt-2 max-w-sm mx-auto">
          Tu as déjà la matière. CM de Poche va apprendre à te connaître, puis s&apos;occuper de savoir quoi en faire.
        </p>
      </div>

      {/* Invitation desktop (R7) — bénéfice, pas contrainte */}
      <div className="md:hidden card mb-6 flex gap-3 items-start bg-sage-bg/40 border-sage/30">
        <Monitor size={18} className="text-sage flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sub leading-relaxed">
          On a beaucoup de choses à construire ensemble. Pour analyser ton compte, organiser tes contenus et
          préparer ta stratégie, le plus confortable est de continuer sur ordinateur.
        </p>
      </div>

      {/* Choix de la porte */}
      {porte === null && (
        <div className="flex flex-col gap-3">
          {/* Porte A */}
          <a
            href={userId ? `/api/auth/instagram?user_id=${userId}` : undefined}
            className="card text-left flex items-center gap-4 active:scale-[0.99] transition-transform border-terra"
          >
            <div className="w-11 h-11 rounded-full bg-terra flex items-center justify-center flex-shrink-0">
              <Instagram size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-text">Connecter mon Instagram</p>
                <span className="text-[10px] bg-terra-bg text-terra font-semibold px-2 py-0.5 rounded-pill">
                  Recommandé
                </span>
              </div>
              <p className="text-xs text-sub mt-0.5">
                Tes vraies photos, ta bio et tes stats. L&apos;analyse la plus juste.
              </p>
            </div>
          </a>

          {/* Porte B */}
          <button
            onClick={() => setPorte('B')}
            className="card text-left flex items-center gap-4 active:scale-[0.99] transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-border-l flex items-center justify-center flex-shrink-0">
              <Upload size={20} className="text-sub" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">Commencer autrement</p>
              <p className="text-xs text-sub mt-0.5">
                Sans connexion. Donne-nous ton pseudo ou un screenshot de ton profil.
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Porte B — matière du scan */}
      {porte === 'B' && (
        <div className="flex flex-col flex-1">
          <button
            onClick={() => { setPorte(null); setError(''); }}
            className="touch-target text-sub flex items-center gap-1 text-sm font-medium mb-4"
          >
            <ChevronLeft size={20} /> Choix précédent
          </button>

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
      )}
    </div>
  );
}
