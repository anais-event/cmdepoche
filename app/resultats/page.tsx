'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import {
  Eye, Heart, UserPlus, MousePointer, Loader2,
  Instagram, RefreshCw,
  MessageCircle, Image, Film, Copy,
  ThumbsUp, ThumbsDown, Info,
} from 'lucide-react';

type IGProfile = {
  username: string;
  name: string;
  biography: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url: string;
};

type IGInsights = {
  period: string;
  impressions: number;
  reach: number;
  profile_views: number;
  website_clicks: number;
  follower_count: number;
};

type IGMediaItem = {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  permalink: string;
  like_count: number;
  comments_count: number;
  timestamp: string;
  insights: Record<string, number>;
};

const FORMAT_ICONS = {
  IMAGE: Image,
  VIDEO: Film,
  CAROUSEL_ALBUM: Copy,
} as const;

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return n.toLocaleString('fr-FR');
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days}j`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} sem.`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<IGProfile | null>(null);
  const [insights, setInsights] = useState<IGInsights | null>(null);
  const [media, setMedia] = useState<IGMediaItem[]>([]);
  const [period, setPeriod] = useState<'day' | 'week' | 'days_28'>('days_28');
  const [isDemo, setIsDemo] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [brain, setBrain] = useState<any>(null);

  const fetchData = useCallback(async (uid: string, selectedPeriod: 'day' | 'week' | 'days_28') => {
    const [profileRes, insightsRes, mediaRes] = await Promise.all([
      fetch(`/api/instagram/profile?user_id=${uid}`),
      fetch(`/api/instagram/insights?user_id=${uid}&period=${selectedPeriod}`),
      fetch(`/api/instagram/media?user_id=${uid}&limit=12`),
    ]);

    if (profileRes.ok) {
      const data = await profileRes.json();
      setProfile(data);
      if (data.demo) setIsDemo(true);
    }

    if (insightsRes.ok) {
      const data = await insightsRes.json();
      setInsights(data.insights);
      if (data.demo) setIsDemo(true);
    }

    if (mediaRes.ok) {
      const data = await mediaRes.json();
      setMedia(data.media || []);
      if (data.demo) setIsDemo(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);

      const { data: b } = await supabase
        .from('brand_brain')
        .select('what_works, what_fails')
        .eq('user_id', session.user.id)
        .single();
      setBrain(b);

      await fetchData(session.user.id, period);
      setLoading(false);
    };
    init();
  }, [router, fetchData, period]);

  const handleRefresh = async () => {
    if (!userId || refreshing) return;
    setRefreshing(true);
    await fetchData(userId, period);
    setRefreshing(false);
  };

  const handlePeriodChange = async (newPeriod: 'day' | 'week' | 'days_28') => {
    setPeriod(newPeriod);
    if (!userId) return;
    setRefreshing(true);
    await fetchData(userId, newPeriod);
    setRefreshing(false);
  };

  const topPosts = [...media]
    .sort((a, b) => (b.like_count + b.comments_count) - (a.like_count + a.comments_count))
    .slice(0, 5);

  const avgEngagement = media.length > 0 && profile
    ? media.reduce((sum, p) => sum + p.like_count + p.comments_count, 0) / media.length / Math.max(profile.followers_count, 1) * 100
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-terra animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-cinzel text-xl font-semibold text-text">Résultats</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="touch-target text-sub active:text-terra transition-colors"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Demo banner */}
      {isDemo && (
        <div className="card mb-4 flex gap-3 items-start bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
          <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            Données de démonstration. Connecte ton Instagram dans les réglages pour voir tes vraies stats.
          </p>
        </div>
      )}

      <LearnedCard brain={brain} />

      {/* Profile Card */}
      {profile && (
        <div className="card mb-4 flex items-center gap-4">
          {profile.profile_picture_url ? (
            <img
              src={profile.profile_picture_url}
              alt={profile.username}
              className="w-14 h-14 rounded-full object-cover border-2 border-terra"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-terra-bg flex items-center justify-center">
              <Instagram size={24} className="text-terra" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">@{profile.username}</p>
            {profile.name && (
              <p className="text-xs text-sub truncate">{profile.name}</p>
            )}
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-sm font-semibold text-text">{formatNumber(profile.followers_count)}</p>
              <p className="text-[10px] text-muted">abonnés</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{formatNumber(profile.media_count)}</p>
              <p className="text-[10px] text-muted">posts</p>
            </div>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="flex gap-2 mb-4">
        {([
          { value: 'day' as const, label: '24h' },
          { value: 'week' as const, label: '7 jours' },
          { value: 'days_28' as const, label: '28 jours' },
        ]).map((p) => (
          <button
            key={p.value}
            onClick={() => handlePeriodChange(p.value)}
            className={`pill flex-1 text-xs ${period === p.value ? 'pill-active' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <KpiCard icon={Eye} label="Impressions" value={insights?.impressions ?? 0} />
        <KpiCard icon={UserPlus} label="Abonnés" value={insights?.follower_count ?? profile?.followers_count ?? 0} />
        <KpiCard icon={MousePointer} label="Visites profil" value={insights?.profile_views ?? 0} />
        <KpiCard icon={Heart} label="Taux engagement" value={avgEngagement} suffix="%" decimals={2} />
      </div>

      {/* Top Posts Ranking */}
      {topPosts.length > 0 && (
        <div className="card mb-4">
          <h2 className="font-cinzel text-base font-semibold text-text mb-3">Meilleurs posts</h2>
          <div className="space-y-3">
            {topPosts.map((post, i) => {
              const FormatIcon = FORMAT_ICONS[post.media_type] || Image;
              const engagement = post.like_count + post.comments_count;
              return (
                <div key={post.id} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-terra text-white' : i === 1 ? 'bg-sage text-white' : 'bg-border-l text-sub'
                  }`}>
                    {i + 1}
                  </span>

                  <div className="w-10 h-10 rounded-lg bg-border-l flex items-center justify-center flex-shrink-0">
                    <FormatIcon size={16} className="text-muted" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text line-clamp-1">
                      {post.caption || 'Sans légende'}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-muted mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Heart size={10} /> {formatNumber(post.like_count)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MessageCircle size={10} /> {formatNumber(post.comments_count)}
                      </span>
                      <span>{timeAgo(post.timestamp)}</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-terra flex-shrink-0">
                    {formatNumber(engagement)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LearnedCard({ brain }: { brain: any }) {
  const works: string[] = [
    ...(brain?.what_works?.formats || []),
    ...(brain?.what_works?.topics || []),
    ...(brain?.what_works?.hooks || []),
  ].filter(Boolean);
  const fails: string[] = [
    ...(brain?.what_fails?.formats || []),
    ...(brain?.what_fails?.topics || []),
  ].filter(Boolean);

  if (works.length === 0 && fails.length === 0) return null;

  return (
    <div className="card mb-4">
      <div className="space-y-3">
        {works.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <ThumbsUp size={12} className="text-sage" />
              <span className="text-[10px] font-bold text-sage uppercase">Marche</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {works.map((w, i) => <span key={i} className="pill text-xs">{w}</span>)}
            </div>
          </div>
        )}
        {fails.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <ThumbsDown size={12} className="text-red-400" />
              <span className="text-[10px] font-bold text-red-400 uppercase">Marche moins</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fails.map((w, i) => <span key={i} className="pill text-xs">{w}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, suffix, decimals }: {
  icon: typeof Eye;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const formatted = suffix === '%'
    ? value.toFixed(decimals ?? 1) + '%'
    : formatNumber(value);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-sub" />
        <span className="text-[11px] text-sub">{label}</span>
      </div>
      <p className="text-xl font-semibold text-text">{formatted}</p>
    </div>
  );
}
