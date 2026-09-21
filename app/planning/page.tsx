'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import { Image, Layers, Film, Clock, Loader2, Send, Compass } from 'lucide-react';
import type { Post } from '@/lib/supabase';
import PublishModal from '@/components/publish-modal';

const FORMAT_ICONS = {
  photo: Image,
  carousel: Layers,
  reel: Film,
};

const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-sage-bg text-sage',
  rejected: 'bg-red-50 text-red-500',
};

const STATUS_LABELS = {
  pending: 'En attente',
  approved: 'Validé',
  rejected: 'Refusé',
};

const ANGLE_BY_OBJECTIVE: Record<string, string> = {
  grow: 'Gagner des abonnés',
  engage: 'Créer de l\'engagement',
  authority: 'Asseoir ton expertise',
  sell: 'Vendre',
  traffic: 'Amener du trafic',
};

const FREQ_LABEL: Record<string, string> = { '2/week': '2 / semaine', '3/week': '3 / semaine', '4/week': '4 / semaine', '5/week': '5 / semaine' };

export default function SemainePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [brain, setBrain] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);

      const [{ data: weeks }, { data: b }] = await Promise.all([
        supabase.from('weeks').select('id').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('brand_brain').select('objective, posting_frequency').eq('user_id', session.user.id).single(),
      ]);
      setBrain(b);

      if (weeks && weeks.length > 0) {
        const { data: weekPosts } = await supabase.from('posts').select('*').eq('week_id', weeks[0].id).order('created_at');
        setPosts(weekPosts || []);
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const allApproved = posts.length > 0 && posts.every((p) => p.status === 'approved');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-terra animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      <h1 className="font-cinzel text-xl font-semibold text-text mb-4">Ma semaine</h1>

      {/* Rappel de stratégie — où je suis, pourquoi ces posts */}
      {brain && (brain.objective || brain.posting_frequency) && (
        <div className="card mb-5 flex items-center gap-3 bg-terra-bg/40 border-terra/20">
          <Compass size={18} className="text-terra flex-shrink-0" />
          <p className="text-xs text-text leading-relaxed">
            {brain.objective && <>Objectif : <span className="font-medium">{ANGLE_BY_OBJECTIVE[brain.objective] || brain.objective}</span>. </>}
            {brain.posting_frequency && <>Rythme : <span className="font-medium">{FREQ_LABEL[brain.posting_frequency] || brain.posting_frequency}</span>.</>}
          </p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-12">
          <div className="w-16 h-16 rounded-full bg-terra-bg flex items-center justify-center">
            <Image size={28} className="text-terra" />
          </div>
          <h2 className="font-cinzel text-lg font-semibold text-text">Pas encore de posts</h2>
          <p className="text-sm text-sub text-center max-w-[280px]">
            On va préparer ta semaine. Tu pourras ajouter tes visuels ensuite.
          </p>
          <button
            onClick={async () => {
              if (!userId) return;
              setGenerating(true);
              try {
                const res = await fetch('/api/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ visual_urls: [], user_id: userId }),
                });
                if (res.ok) window.location.reload();
              } catch (err) {
                console.error('Generate:', err);
              } finally {
                setGenerating(false);
              }
            }}
            disabled={generating}
            className="btn-primary max-w-[280px] flex items-center justify-center gap-2"
          >
            {generating ? (
              <><Loader2 size={18} className="animate-spin" /> Préparation...</>
            ) : (
              'Générer ma semaine →'
            )}
          </button>
          <button onClick={() => router.push('/contenus')} className="text-sm text-sub active:text-terra transition-colors">
            Ou ajoute tes visuels d&apos;abord
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {posts.map((post) => {
              const FormatIcon = FORMAT_ICONS[post.format] || Image;
              return (
                <button
                  key={post.id}
                  onClick={() => router.push(`/planning/${post.id}`)}
                  className="card w-full text-left flex gap-3 active:scale-[0.98] transition-transform"
                >
                  <div className="w-16 h-16 rounded-input bg-border-l flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {post.visual_url ? (
                      <img src={post.visual_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FormatIcon size={20} className="text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text">{post.day_of_week}</span>
                        <span className="text-xs text-sub flex items-center gap-1">
                          <Clock size={10} /> {post.scheduled_time}
                        </span>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-pill ${STATUS_COLORS[post.status]}`}>
                        {STATUS_LABELS[post.status]}
                      </span>
                    </div>
                    <p className="text-xs text-sub line-clamp-2 leading-relaxed">{post.caption}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <FormatIcon size={12} className="text-muted" />
                      <span className="text-[10px] text-muted capitalize">{post.format}</span>
                      {post.performance_score > 0 && (
                        <span className="text-[10px] text-terra font-medium ml-auto">Score {post.performance_score}/100</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto space-y-2">
            <button
              onClick={() => setShowPublish(true)}
              disabled={!allApproved}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {allApproved ? 'Programmer ma semaine' : `${posts.filter((p) => p.status === 'approved').length}/${posts.length} validés`}
            </button>
            {!allApproved && (
              <p className="text-xs text-sub text-center">Valide tous les posts pour pouvoir programmer</p>
            )}
          </div>

          {showPublish && <PublishModal posts={posts} onClose={() => setShowPublish(false)} />}
        </>
      )}

      <BottomNav />
    </div>
  );
}
