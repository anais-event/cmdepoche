'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { runDemoScan, SCAN_STEPS, type DemoScanResult } from '@/lib/demo-scan';

type Phase = 'idle' | 'scanning' | 'done';

export default function DemoScan() {
  const [handle, setHandle] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [result, setResult] = useState<DemoScanResult | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const isValidHandle = (v: string) => /^@?[a-zA-Z0-9._]{1,30}$/.test(v.trim());

  const startScan = useCallback(() => {
    const trimmed = handle.trim();
    if (!trimmed) {
      setError('Entre ton @ Instagram.');
      return;
    }
    if (!isValidHandle(trimmed)) {
      setError('Ce pseudo ne semble pas valide.');
      return;
    }

    setError('');
    setPhase('scanning');
    setVisibleSteps(0);

    const data = runDemoScan(trimmed);
    setResult(data);

    let step = 0;
    const total = SCAN_STEPS.length;
    const interval = setInterval(() => {
      step++;
      setVisibleSteps(step);
      if (step >= total) {
        clearInterval(interval);
        setTimeout(() => setPhase('done'), 300);
      }
    }, 350);
  }, [handle]);

  const reset = useCallback(() => {
    setPhase('idle');
    setVisibleSteps(0);
    setResult(null);
    setHandle('');
    setError('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (phase === 'done' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [phase]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && phase === 'idle') startScan();
  };

  // ─── IDLE: input form ───
  if (phase === 'idle') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base">@</span>
            <input
              ref={inputRef}
              type="text"
              value={handle}
              onChange={(e) => { setHandle(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="toncompte"
              aria-label="Pseudo Instagram"
              className="w-full pl-9 pr-4 py-3.5 rounded-input border border-border bg-card text-text placeholder:text-muted focus:outline-none focus:border-terra transition-colors"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <button
            onClick={startScan}
            className="px-6 py-3.5 rounded-pill bg-terra text-white font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Analyser mon compte
          </button>
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        <p className="text-xs text-muted mt-3 text-center">Gratuit · sans inscription</p>
      </div>
    );
  }

  // ─── SCANNING: step-by-step animation ───
  if (phase === 'scanning') {
    const clean = handle.replace(/^@/, '').trim();
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-card border border-border p-6">
          <p className="text-sm font-semibold text-text mb-4">
            Analyse de <span className="text-terra">@{clean}</span>
          </p>
          <div className="flex flex-col gap-2">
            {SCAN_STEPS.map((step, i) => (
              <div
                key={step}
                className={`flex items-center gap-2.5 text-sm transition-opacity duration-200 ${
                  i < visibleSteps ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="text-sage">✓</span>
                <span className="text-sub">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── DONE: result + CTA ───
  if (!result) return null;

  return (
    <div ref={resultRef} className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-card rounded-card border border-border p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-lg font-cinzel font-bold text-text">@{result.handle}</p>
            <p className="text-sm text-sub">{result.bio}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-text">{result.followers.toLocaleString('fr-FR')}</p>
            <p className="text-xs text-muted">abonnés</p>
          </div>
        </div>

        {/* Palette */}
        <div className="mb-6">
          <p className="text-xs text-sub font-semibold uppercase tracking-wider mb-2">Ton univers</p>
          <div className="flex gap-2">
            {result.palette.map((color) => (
              <div
                key={color}
                className="w-10 h-10 rounded-lg border border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="mb-6">
          <p className="text-xs text-sub font-semibold uppercase tracking-wider mb-2">3 sujets principaux</p>
          <div className="flex gap-2">
            {result.topics.map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-pill bg-bg border border-border text-sm text-text font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Rhythm */}
        <div className="mb-6">
          <p className="text-xs text-sub font-semibold uppercase tracking-wider mb-2">Ton rythme</p>
          <p className="text-base text-text">{result.postingFrequency}</p>
        </div>

        {/* Top content */}
        <div>
          <p className="text-xs text-sub font-semibold uppercase tracking-wider mb-2">Ton contenu le plus visible</p>
          <div className="p-3 rounded-input bg-bg flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-terra-bg flex items-center justify-center text-xs font-bold text-terra flex-shrink-0">
              {result.topContent.format === 'Reel' ? '▶' : '◫'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text truncate">{result.topContent.caption}</p>
              <p className="text-xs text-muted mt-0.5">
                {result.topContent.likes} likes · {result.topContent.comments} commentaires
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Observations */}
      <div className="bg-card rounded-card border border-border p-6 sm:p-8">
        <p className="text-xs text-sub font-semibold uppercase tracking-wider mb-3">Ce que je vois</p>
        <div className="space-y-2">
          {result.observations.map((obs, i) => (
            <p key={i} className="text-sm text-text leading-relaxed">{obs}</p>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="bg-card rounded-card border border-border p-6 sm:p-8">
        <p className="text-sm font-semibold text-text mb-3">
          J&apos;ai repéré {result.opportunities.length} piste{result.opportunities.length > 1 ? 's' : ''} à travailler.
        </p>
        <div className="space-y-3">
          {result.opportunities.map((opp, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-sage text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-sub leading-relaxed">{opp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA post-audit */}
      <div className="bg-card rounded-card border-2 border-terra p-6 sm:p-8 text-center">
        <h3 className="text-2xl font-cinzel font-bold text-text mb-4">Et si je m&apos;occupais du reste ?</h3>
        <ul className="text-sm text-sub space-y-1.5 mb-6 text-left max-w-xs mx-auto">
          <li className="flex items-start gap-2"><span className="text-sage">✓</span>Préparer ta semaine</li>
          <li className="flex items-start gap-2"><span className="text-sage">✓</span>Utiliser tes propres photos et vidéos</li>
          <li className="flex items-start gap-2"><span className="text-sage">✓</span>Créer tes contenus</li>
          <li className="flex items-start gap-2"><span className="text-sage">✓</span>Te proposer quoi publier</li>
          <li className="flex items-start gap-2"><span className="text-sage">✓</span>Suivre ce qui fonctionne</li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-pill bg-terra text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Créer mon compte gratuitement
          </Link>
          <button
            onClick={reset}
            className="px-8 py-3.5 rounded-pill border border-border text-text font-semibold hover:border-terra hover:text-terra transition-colors"
          >
            Recommencer l&apos;analyse
          </button>
        </div>
        <p className="text-xs text-muted mt-4">Pas de carte bancaire.</p>
      </div>
    </div>
  );
}
