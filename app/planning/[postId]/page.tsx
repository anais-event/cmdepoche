'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/back-button';
import { Image, Layers, Film, Clock, RefreshCw, Check, X, Loader2 } from 'lucide-react';
import type { Post } from '@/lib/supabase';

const FORMATS: { value: string; label: string; icon: typeof Image }[] = [
  { value: 'Photo', label: 'Photo', icon: Image },
  { value: 'Carousel', label: 'Carrousel', icon: Layers },
  { value: 'Reel', label: 'Reel', icon: Film },
];

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [caption, setCaption] = useState('');
  const [format, setFormat] = useState('Photo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      const { data } = await supabase
        .from('weekly_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (data) {
        setPost(data as Post);
        setCaption(data.caption || '');
        setFormat(data.format);
      }
      setLoading(false);
    };
    loadPost();
  }, [postId]);

  const handleSaveCaption = async () => {
    if (!post) return;
    setSaving(true);
    await supabase
      .from('weekly_posts')
      .update({ caption })
      .eq('id', post.id);
    setSaving(false);
  };

  const handleFormatChange = async (newFormat: string) => {
    setFormat(newFormat);
    if (!post) return;
    await supabase
      .from('weekly_posts')
      .update({ format: newFormat })
      .eq('id', post.id);
  };

  const handleAction = async (state: 'approved' | 'rejected') => {
    if (!post) return;
    await supabase.from('weekly_posts').update({ state }).eq('id', post.id);
    router.push('/planning');
  };

  if (loading || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-terra animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-6">
      <BackButton href="/planning" />

      <div className="relative rounded-card overflow-hidden bg-border-l mt-4 mb-4" style={{ aspectRatio: '4/5' }}>
        <div className="w-full h-full flex items-center justify-center">
          <Image size={48} className="text-muted" />
        </div>

        <button className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-pill px-3 py-1.5 flex items-center gap-1.5 shadow-md">
          <span className="text-sm font-bold text-terra">{post.score}</span>
          <span className="text-xs text-sub">/100</span>
        </button>

        <button className="absolute bottom-3 right-3 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <RefreshCw size={18} className="text-sub" />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Clock size={16} className="text-sub" />
        <span className="text-sm font-medium text-text">{post.day}</span>
        <span className="text-sm text-sub">{post.time}</span>
      </div>

      <div className="flex gap-2 mb-4">
        {FORMATS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleFormatChange(value)}
            className={`flex-1 pill ${format === value ? 'pill-active' : ''}`}
          >
            <Icon size={14} className="mr-1.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-text mb-2 block">Légende</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={handleSaveCaption}
          rows={5}
          className="input resize-none leading-relaxed"
          style={{ minHeight: 120 }}
        />
        {saving && <p className="text-xs text-sub mt-1">Sauvegarde...</p>}
      </div>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="mb-4">
          <label className="text-sm font-medium text-text mb-2 block">Hashtags</label>
          <div className="flex flex-wrap gap-1.5">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="text-xs text-terra bg-terra-bg px-2 py-1 rounded-pill">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto flex gap-3">
        <button
          onClick={() => handleAction('rejected')}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <X size={18} />
          Refuser
        </button>
        <button
          onClick={() => handleAction('approved')}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Valider
        </button>
      </div>
    </div>
  );
}
