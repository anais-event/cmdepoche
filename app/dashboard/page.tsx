'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import { TrendingUp, TrendingDown, Eye, Heart, UserPlus, MousePointer, Loader2, Lightbulb } from 'lucide-react';

type KPI = {
  label: string;
  value: number;
  delta: number;
  icon: typeof Eye;
};

type PostRank = {
  id: string;
  caption: string;
  engagement_rate: number;
  format: string;
};

type Suggestion = {
  title: string;
  desc: string;
  icon: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [topPosts] = useState<PostRank[]>([]);
  const [suggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      // Charge les analytics
      const { data: analytics } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .order('fetched_at', { ascending: false })
        .limit(10);

      if (analytics && analytics.length > 0) {
        const totalImpressions = analytics.reduce((s, a) => s + (a.impressions || 0), 0);
        const totalEngagement = analytics.reduce((s, a) => s + (a.engagement_count || 0), 0);
        const totalClicks = analytics.reduce((s, a) => s + (a.profile_clicks || 0), 0);

        setKpis([
          { label: 'Impressions', value: totalImpressions, delta: 12, icon: Eye },
          { label: 'Engagement', value: totalEngagement, delta: 8, icon: Heart },
          { label: 'Clics profil', value: totalClicks, delta: -3, icon: MousePointer },
          { label: 'Nouveaux abonnés', value: 24, delta: 15, icon: UserPlus },
        ]);
      } else {
        // Données démo
        setKpis([
          { label: 'Impressions', value: 0, delta: 0, icon: Eye },
          { label: 'Engagement', value: 0, delta: 0, icon: Heart },
          { label: 'Clics profil', value: 0, delta: 0, icon: MousePointer },
          { label: 'Nouveaux abonnés', value: 0, delta: 0, icon: UserPlus },
        ]);
      }

      setLoading(false);
    };
    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-terra animate-spin" />
      </div>
    );
  }

  const hasData = kpis.some((k) => k.value > 0);

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      <h1 className="font-cinzel text-xl font-semibold text-text mb-6">Tableau de bord</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-sub" />
                <span className="text-xs text-sub">{kpi.label}</span>
              </div>
              <p className="text-xl font-semibold text-text">
                {kpi.value.toLocaleString('fr-FR')}
              </p>
              {kpi.delta !== 0 && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${kpi.delta > 0 ? 'text-sage' : 'text-red-400'}`}>
                  {kpi.delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{kpi.delta > 0 ? '+' : ''}{kpi.delta}% vs semaine passée</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!hasData && (
        <div className="card text-center py-8 mb-6">
          <p className="text-sm text-sub mb-2">Pas encore de données</p>
          <p className="text-xs text-muted">Les statistiques apparaîtront après la publication de tes premiers posts</p>
        </div>
      )}

      {/* Classement posts */}
      {topPosts.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-cinzel text-base font-semibold text-text mb-3">Classement des posts</h2>
          <div className="space-y-2">
            {topPosts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-terra text-white' : 'bg-border-l text-sub'
                }`}>
                  {i + 1}
                </span>
                <p className="text-sm text-text flex-1 line-clamp-1">{p.caption}</p>
                <span className="text-xs text-sub">{(p.engagement_rate * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions IA */}
      {suggestions.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-terra" />
            <h2 className="font-cinzel text-base font-semibold text-text">Suggestions</h2>
          </div>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <p className="text-sm font-medium text-text">{s.title}</p>
                  <p className="text-xs text-sub">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={() => router.push('/import')}
          className="btn-primary"
        >
          Préparer la semaine prochaine →
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
