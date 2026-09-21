'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CalendarCheck, Image, Layers, Film } from 'lucide-react';
import type { Post } from '@/lib/supabase';

const FORMAT_ICONS: Record<string, typeof Image> = { Photo: Image, Carousel: Layers, Reel: Film };

export default function SuccessPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('weekly_posts')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('state', 'approved')
        .order('created_at', { ascending: false });
      setPosts((data as Post[]) || []);
    };
    loadPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="text-center mb-8 pt-8">
        <div className="w-20 h-20 rounded-full bg-sage-bg mx-auto mb-4 flex items-center justify-center">
          <CalendarCheck size={36} className="text-sage" />
        </div>
        <h1 className="font-cinzel text-2xl font-semibold text-text mb-2">C&apos;est programmé !</h1>
        <p className="text-sm text-sub">Tes posts seront publiés automatiquement aux heures prévues</p>
      </div>

      <div className="space-y-2 mb-8">
        {posts.map((post) => {
          const FormatIcon = FORMAT_ICONS[post.format] || Image;
          return (
            <div key={post.id} className="card flex items-center gap-3">
              <FormatIcon size={18} className="text-sub flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-text">{post.day}</span>
                <span className="text-xs text-sub ml-2">{post.time}</span>
              </div>
              <span className="text-xs text-sage font-medium">{post.format}</span>
              <span className="text-[10px] bg-sage-bg text-sage px-2 py-0.5 rounded-pill font-medium">
                Programmé
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto space-y-3">
        <button onClick={() => router.push('/planning')} className="btn-secondary">
          Modifier
        </button>
        <button onClick={() => router.push('/resultats')} className="btn-primary">
          Voir mes résultats
        </button>
        <button onClick={() => router.push('/settings')} className="text-sm text-sub text-center w-full py-2">
          Réglages
        </button>
      </div>
    </div>
  );
}
