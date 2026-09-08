'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/back-button';
import type { Profile } from '@/lib/supabase';

export default function OnboardingAnalysisPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };
    loadProfile();
  }, [router]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-border border-t-terra rounded-full animate-spin" />
      </div>
    );
  }

  const palette = (profile.color_palette as string[]) || ['#B87356', '#8FA37A', '#2D2A26', '#FAF8F5', '#EBE6E0'];
  const formatEng = (profile.format_engagement as { photo: number; carousel: number; reel: number }) || { photo: 35, carousel: 42, reel: 23 };
  const slots = (profile.optimal_slots as { day: string; time: string }[]) || [
    { day: 'Lundi', time: '18:30' },
    { day: 'Mercredi', time: '12:00' },
    { day: 'Vendredi', time: '19:00' },
    { day: 'Dimanche', time: '10:00' },
  ];

  return (
    <div className="flex flex-col min-h-screen py-6">
      <BackButton href="/onboarding" />

      <h1 className="font-cinzel text-xl font-semibold text-text mt-4 mb-2">Analyse de ton univers</h1>
      <p className="text-sm text-sub mb-6">Voici ce qu&apos;on a détecté sur ton compte</p>

      {/* Section : Profil détecté */}
      <div className="card mb-4">
        <h2 className="font-cinzel text-base font-semibold text-text mb-4">Profil détecté</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg rounded-input p-3">
            <p className="text-xs text-sub mb-1">Abonnés</p>
            <p className="text-lg font-semibold text-text">
              {profile.followers_count?.toLocaleString('fr-FR') || '—'}
            </p>
          </div>
          <div className="bg-bg rounded-input p-3">
            <p className="text-xs text-sub mb-1">Niche</p>
            <p className="text-lg font-semibold text-text">{profile.detected_niche || '—'}</p>
          </div>
          <div className="bg-bg rounded-input p-3">
            <p className="text-xs text-sub mb-1">Ton</p>
            <p className="text-lg font-semibold text-text">{profile.detected_tone || '—'}</p>
          </div>
          <div className="bg-bg rounded-input p-3">
            <p className="text-xs text-sub mb-1">Cible</p>
            <p className="text-sm font-medium text-text leading-snug">{profile.detected_target || '—'}</p>
          </div>
        </div>
      </div>

      {/* Section : Palette visuelle */}
      <div className="card mb-4">
        <h2 className="font-cinzel text-base font-semibold text-text mb-3">Palette visuelle</h2>
        <div className="flex gap-2">
          {palette.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full aspect-square rounded-xl border border-border"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-muted uppercase">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section : Engagement par format */}
      <div className="card mb-4">
        <h2 className="font-cinzel text-base font-semibold text-text mb-1">Ce qui marche pour toi</h2>
        <p className="text-xs text-sub mb-4">Part de ton engagement par format</p>
        <div className="space-y-3">
          {[
            { label: 'Carrousel', value: formatEng.carousel, color: 'bg-terra' },
            { label: 'Photo', value: formatEng.photo, color: 'bg-sage' },
            { label: 'Reel', value: formatEng.reel, color: 'bg-text' },
          ].sort((a, b) => b.value - a.value).map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text font-medium">{item.label}</span>
                <span className="text-sub">{item.value}%</span>
              </div>
              <div className="h-2 bg-border-l rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section : Créneaux optimisés */}
      <div className="card mb-8">
        <h2 className="font-cinzel text-base font-semibold text-text mb-3">Créneaux optimisés</h2>
        <div className="flex flex-wrap gap-2">
          {slots.map((slot, i) => (
            <span key={i} className="pill text-xs">
              {slot.day} {slot.time}
            </span>
          ))}
        </div>
      </div>

      {/* Boutons */}
      <div className="mt-auto space-y-3">
        <button
          onClick={() => router.push('/onboarding/expert')}
          className="btn-primary"
        >
          C&apos;est bien moi →
        </button>
        <button
          onClick={() => router.push('/onboarding/refine')}
          className="btn-secondary"
        >
          Je souhaite affiner / modifier →
        </button>
      </div>
    </div>
  );
}
