'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import { Settings, Image, Layers, Film, Clock, Loader2 } from 'lucide-react';
import type { Post } from '@/lib/supabase';

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

export default function PlanningPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      // Cherche la semaine en cours
      const { data: weeks } = await supabase
        .from('weeks')
        .select('id')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (weeks && weeks.length > 0) {
        const { data: weekPosts } = await supabase
          .from('posts')
          .select('*')
          .eq('week_id', weeks[0].id)
          .order('created_at');

        setPosts(weekPosts || []);
      }
      setLoading(false);
    };
    loadPosts();
  }, [router]);

  const allApproved = posts.length > 0 && posts.every((p) => p.status === 'approved');

  const handleScheduleAll = async () => {
    if (!allApproved) return;
    const weekId = posts[0]?.week_id;
    if (!weekId) return;

    await supabase
      .from('weeks')
      .update({ status: 'scheduled' })
      .eq('id', weekId);

    router.push('/success');
  };

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
        <h1 className="font-cinzel text-xl font-semibold text-text">Planning</h1>
        <button
          onClick={() => router.push('/settings')}
          className="touch-target text-sub active:text-terra transition-colors"
        >
          <Settings size={22} />
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-12">
          <div className="w-16 h-16 rounded-full bg-terra-bg flex items-center justify-center">
            <Image size={28} className="text-terra" />
          </div>
          <h2 className="font-cinzel text-lg font-semibold text-text">Aucun post cette semaine</h2>
          <p className="text-sm text-sub text-center max-w-[260px]">
            Importe tes visuels pour générer ta semaine de contenu
          </p>
          <button onClick={() => router.push('/import')} className="btn-primary max-w-[200px]">
            Importer mes visuels
          </button>
        </div>
      ) : (
        <>
          {/* Liste des posts */}
          <div className="space-y-3 mb-6">
            {posts.map((post) => {
              const FormatIcon = FORMAT_ICONS[post.format] || Image;
              return (
                <button
                  key={post.id}
                  onClick={() => router.push(`/planning/${post.id}`)}
                  className="card w-full text-left flex gap-3 active:scale-[0.98] transition-transform"
                >
                  {/* Miniature */}
                  <div className="w-16 h-16 rounded-input bg-border-l flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {post.visual_url ? (
                      <img src={post.visual_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FormatIcon size={20} className="text-muted" />
                    )}
                  </div>

                  {/* Infos */}
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
                        <span className="text-[10px] text-terra font-medium ml-auto">
                          Score {post.performance_score}/100
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-auto">
            <button
              onClick={handleScheduleAll}
              disabled={!allApproved}
              className="btn-primary"
            >
              {allApproved ? 'Programmer tout →' : `${posts.filter((p) => p.status === 'approved').length}/${posts.length} validés`}
            </button>
            {!allApproved && (
              <p className="text-xs text-sub text-center mt-2">
                Valide tous les posts pour pouvoir programmer
              </p>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
