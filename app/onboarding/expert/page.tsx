'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/back-button';
import { Loader2, TrendingUp, TrendingDown, Target, Lightbulb, Palette, AlertTriangle, Star, Zap } from 'lucide-react';
import type { ExpertAdvice } from '@/lib/supabase';

const LOADING_STEPS = [
  'Analyse de ton positionnement...',
  'Étude de ta niche...',
  'Évaluation de ta colorimétrie...',
  'Rédaction des recommandations...',
  'Finalisation du diagnostic...',
];

export default function OnboardingExpertPage() {
  const router = useRouter();
  const [advice, setAdvice] = useState<ExpertAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateAdvice = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      // Vérifie si un diagnostic existe déjà
      const { data: profile } = await supabase
        .from('profiles')
        .select('expert_advice')
        .eq('id', session.user.id)
        .single();

      if (profile?.expert_advice) {
        setAdvice(profile.expert_advice as ExpertAdvice);
        setLoading(false);
        return;
      }

      // Animation de chargement
      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
      }, 2000);

      try {
        const res = await fetch('/api/generate/expert-advice', { method: 'POST' });
        if (!res.ok) throw new Error('Erreur lors de la génération du diagnostic');
        const data = await res.json();
        setAdvice(data);

        await supabase
          .from('profiles')
          .update({ expert_advice: data, updated_at: new Date().toISOString() })
          .eq('id', session.user.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inattendue');
      } finally {
        clearInterval(stepInterval);
        setLoading(false);
      }
    };
    generateAdvice();
  }, [router]);

  const handleFinish = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from('profiles')
      .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
      .eq('id', session.user.id);

    router.push('/import');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 py-12">
        <div className="w-16 h-16 rounded-full bg-terra-bg flex items-center justify-center">
          <Loader2 size={28} className="text-terra animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="font-cinzel text-lg font-semibold text-text mb-2">L&apos;expert analyse ton compte</h2>
          <p className="text-sm text-sub animate-pulse">{LOADING_STEPS[loadingStep]}</p>
        </div>
        <div className="w-48 h-1.5 bg-border-l rounded-full overflow-hidden">
          <div
            className="h-full bg-terra rounded-full transition-all duration-1000"
            style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 py-12">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-secondary">
          Réessayer
        </button>
      </div>
    );
  }

  if (!advice) return null;

  return (
    <div className="flex flex-col min-h-screen py-6">
      <BackButton href="/onboarding/analysis" />

      <div className="text-center mt-4 mb-6">
        <h1 className="font-cinzel text-xl font-semibold text-text">L&apos;avis de l&apos;expert</h1>
        <p className="text-sm text-sub mt-1">Ton diagnostic stratégique personnalisé</p>
      </div>

      {/* SWOT */}
      <div className="card mb-4">
        <h2 className="font-cinzel text-base font-semibold text-text mb-4">SWOT de ta présence Instagram</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Forces */}
          <div className="bg-sage-bg rounded-input p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp size={14} className="text-sage" />
              <span className="text-xs font-semibold text-sage uppercase">Forces</span>
            </div>
            <ul className="space-y-1.5">
              {advice.swot.forces.map((f, i) => (
                <li key={i} className="text-xs text-text leading-relaxed">{f}</li>
              ))}
            </ul>
          </div>

          {/* Faiblesses */}
          <div className="bg-red-50 rounded-input p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingDown size={14} className="text-red-400" />
              <span className="text-xs font-semibold text-red-400 uppercase">Faiblesses</span>
            </div>
            <ul className="space-y-1.5">
              {advice.swot.faiblesses.map((f, i) => (
                <li key={i} className="text-xs text-text leading-relaxed">{f}</li>
              ))}
            </ul>
          </div>

          {/* Opportunités */}
          <div className="bg-blue-50 rounded-input p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={14} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase">Opportunités</span>
            </div>
            <ul className="space-y-1.5">
              {advice.swot.opportunites.map((f, i) => (
                <li key={i} className="text-xs text-text leading-relaxed">{f}</li>
              ))}
            </ul>
          </div>

          {/* Menaces */}
          <div className="bg-amber-50 rounded-input p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={14} className="text-amber-500" />
              <span className="text-xs font-semibold text-amber-500 uppercase">Menaces</span>
            </div>
            <ul className="space-y-1.5">
              {advice.swot.menaces.map((f, i) => (
                <li key={i} className="text-xs text-text leading-relaxed">{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Cohérence Objectif × Niche */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={18} className="text-terra" />
          <h2 className="font-cinzel text-base font-semibold text-text">Objectif × Niche</h2>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
              <path
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#F3EFEA" strokeWidth="3"
              />
              <path
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#B87356" strokeWidth="3"
                strokeDasharray={`${advice.coherence_objectif_niche.score}, 100`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text">
              {advice.coherence_objectif_niche.score}
            </span>
          </div>
          <p className="text-sm text-text leading-relaxed flex-1">
            {advice.coherence_objectif_niche.diagnostic}
          </p>
        </div>
        <div className="bg-terra-bg rounded-input p-3">
          <p className="text-xs text-terra font-medium">
            💡 {advice.coherence_objectif_niche.recommandation}
          </p>
        </div>
      </div>

      {/* Cohérence Colorimétrie × Niche */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette size={18} className="text-terra" />
          <h2 className="font-cinzel text-base font-semibold text-text">Colorimétrie × Niche</h2>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
              <path
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#F3EFEA" strokeWidth="3"
              />
              <path
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#8FA37A" strokeWidth="3"
                strokeDasharray={`${advice.coherence_colorimetrie_niche.score}, 100`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text">
              {advice.coherence_colorimetrie_niche.score}
            </span>
          </div>
          <p className="text-sm text-text leading-relaxed flex-1">
            {advice.coherence_colorimetrie_niche.diagnostic}
          </p>
        </div>
        <div className="bg-sage-bg rounded-input p-3">
          <p className="text-xs text-sage font-medium">
            🎨 {advice.coherence_colorimetrie_niche.recommandation}
          </p>
        </div>
      </div>

      {/* Recommandations prioritaires */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="text-terra" />
          <h2 className="font-cinzel text-base font-semibold text-text">3 priorités pour cette semaine</h2>
        </div>
        <div className="space-y-3">
          {advice.recommandations_prioritaires.map((rec, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-terra-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap size={14} className="text-terra" />
              </div>
              <div>
                <p className="text-sm font-medium text-text">{rec.titre}</p>
                <p className="text-xs text-sub mt-0.5 leading-relaxed">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <button onClick={handleFinish} className="btn-primary">
          Commencer à créer →
        </button>
      </div>
    </div>
  );
}
