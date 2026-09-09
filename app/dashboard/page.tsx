'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import {
  Eye, Heart, UserPlus, MousePointer, Loader2,
  Instagram, RefreshCw,
  MessageCircle, Bookmark, Share2, Image, Film, Copy,
  LinkIcon,
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
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<IGProfile | null>(null);
  const [insights, setInsights] = useState<IGInsights | null>(null);
  const [media, setMedia] = useState<IGMediaItem[]>([]);
  const [period, setPeriod] = useState<'day' | 'week' | 'days_28'>('days_28');

  const fetchData = useCallback(async (uid: string, selectedPeriod: 'day' | 'week' | 'days_28') => {
    const [profileRes, insightsRes, mediaRes] = await Promise.all([
      fetch(`/api/instagram/profile?user_id=${uid}`),
      fetch(`/api/instagram/insights?user_id=${uid}&period=${selectedPeriod}`),
      fetch(`/api/instagram/media?user_id=${uid}&limit=12`),
    ]);

    if (profileRes.ok) {
      const data = await profileRes.json();
      if (data.connected) {
        setProfile(data);
        setConnected(true);
      }
    }

    if (insightsRes.ok) {
      const data = await insightsRes.json();
      setInsights(data.insights);
    }

    if (mediaRes.ok) {
      const data = await mediaRes.json();
      setMedia(data.media || []);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);

      // Check if connected first
      const { data: p } = await supabase
        .from('profiles')
        .select('instagram_access_token')
        .eq('id', session.user.id)
        .single();

      if (p?.instagram_access_token) {
        setConnected(true);
        await fetchData(session.user.id, period);
      }

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

  // Sort posts by engagement for ranking
  const topPosts = [...media]
    .sort((a, b) => (b.like_count + b.comments_count) - (a.like_count + a.comments_count))
    .slice(0, 5);

  // Calculate engagement rate
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

  // Not connected state
  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen py-6 pb-24">
        <h1 className="font-cinzel text-xl font-semibold text-text mb-6">Tableau de bord</h1>

        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-terra-bg mx-auto mb-4 flex items-center justify-center">
            <Instagram size={28} className="text-terra" />
          </div>
          <h2 className="font-cinzel text-lg font-semibold text-text mb-2">
            Connecte ton Instagram
          </h2>
          <p className="text-sm text-sub mb-6 max-w-xs mx-auto">
            Synchronise ton compte pour voir tes vraies statistiques, tes meilleurs posts et ton taux d&apos;engagement
          </p>
          <a
            href={`/api/auth/instagram?user_id=${userId}`}
            className="inline-flex items-center gap-2 bg-terra text-white font-semibold px-6 py-3 rounded-pill"
          >
            <Instagram size={18} />
            Connecter Instagram
          </a>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-cinzel text-xl font-semibold text-text">Tableau de bord</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="touch-target text-sub active:text-terra transition-colors"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

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
        <KpiCard
          icon={Eye}
          label="Impressions"
          value={insights?.impressions ?? 0}
        />
        <KpiCard
          icon={UserPlus}
          label="Abonnés"
          value={insights?.follower_count ?? profile?.followers_count ?? 0}
        />
        <KpiCard
          icon={MousePointer}
          label="Visites profil"
          value={insights?.profile_views ?? 0}
        />
        <KpiCard
          icon={Heart}
          label="Taux engagement"
          value={avgEngagement}
          suffix="%"
          decimals={2}
        />
      </div>

      {/* Reach & Website */}
      {insights && (insights.reach > 0 || insights.website_clicks > 0) && (
        <div className="flex gap-3 mb-6">
          {insights.reach > 0 && (
            <div className="card flex-1 flex items-center gap-3">
              <Eye size={16} className="text-sage flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-text">{formatNumber(insights.reach)}</p>
                <p className="text-[10px] text-muted">Portée</p>
              </div>
            </div>
          )}
          {insights.website_clicks > 0 && (
            <div className="card flex-1 flex items-center gap-3">
              <LinkIcon size={16} className="text-terra flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-text">{formatNumber(insights.website_clicks)}</p>
                <p className="text-[10px] text-muted">Clics site</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Posts Ranking */}
      {topPosts.length > 0 && (
        <div className="card mb-4">
          <h2 className="font-cinzel text-base font-semibold text-text mb-3">
            Meilleurs posts
          </h2>
          <div className="space-y-3">
            {topPosts.map((post, i) => {
              const FormatIcon = FORMAT_ICONS[post.media_type] || Image;
              const engagement = post.like_count + post.comments_count;
              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-terra text-white' : i === 1 ? 'bg-sage text-white' : 'bg-border-l text-sub'
                  }`}>
                    {i + 1}
                  </span>

                  {post.media_url || post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url || post.media_url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-border-l flex items-center justify-center flex-shrink-0">
                      <FormatIcon size={16} className="text-muted" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text line-clamp-1 group-hover:text-terra transition-colors">
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
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Posts Grid */}
      {media.length > 0 && (
        <div className="mb-6">
          <h2 className="font-cinzel text-base font-semibold text-text mb-3">
            Posts récents
          </h2>
          <div className="grid grid-cols-3 gap-1.5 rounded-card overflow-hidden">
            {media.slice(0, 9).map((post) => {
              const FormatIcon = FORMAT_ICONS[post.media_type] || Image;
              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square group"
                >
                  {post.media_url || post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url || post.media_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-border-l flex items-center justify-center">
                      <FormatIcon size={20} className="text-muted" />
                    </div>
                  )}

                  {/* Format badge */}
                  {post.media_type !== 'IMAGE' && (
                    <div className="absolute top-1.5 right-1.5">
                      <FormatIcon size={14} className="text-white drop-shadow-md" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <Heart size={12} /> {formatNumber(post.like_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} /> {formatNumber(post.comments_count)}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Post Insights Detail (if insights available) */}
      {media.length > 0 && media.some(m => Object.keys(m.insights).length > 0) && (
        <div className="card mb-6">
          <h2 className="font-cinzel text-base font-semibold text-text mb-3">
            Insights des posts
          </h2>
          <div className="space-y-3">
            {media.filter(m => Object.keys(m.insights).length > 0).slice(0, 5).map((post) => (
              <div key={post.id} className="border-b border-border-l last:border-0 pb-3 last:pb-0">
                <p className="text-xs text-text line-clamp-1 mb-2">
                  {post.caption || 'Sans légende'}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {post.insights.reach != null && (
                    <InsightPill icon={Eye} label="Portée" value={post.insights.reach} />
                  )}
                  {post.insights.impressions != null && (
                    <InsightPill icon={Eye} label="Impr." value={post.insights.impressions} />
                  )}
                  {post.insights.saved != null && (
                    <InsightPill icon={Bookmark} label="Saves" value={post.insights.saved} />
                  )}
                  {post.insights.shares != null && (
                    <InsightPill icon={Share2} label="Partages" value={post.insights.shares} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {media.length === 0 && (
        <div className="card text-center py-8 mb-6">
          <p className="text-sm text-sub mb-2">Chargement des données...</p>
          <p className="text-xs text-muted">Appuie sur rafraîchir pour synchroniser tes posts Instagram</p>
        </div>
      )}

      <BottomNav />
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

function InsightPill({ icon: Icon, label, value }: {
  icon: typeof Eye;
  label: string;
  value: number;
}) {
  return (
    <span className="flex items-center gap-1 text-[10px] text-sub">
      <Icon size={10} className="text-muted" />
      {label}: <span className="font-medium text-text">{formatNumber(value)}</span>
    </span>
  );
}
