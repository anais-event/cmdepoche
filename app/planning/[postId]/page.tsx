'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/back-button';
import { Image, Layers, Film, Clock, RefreshCw, Check, X, Music, Loader2 } from 'lucide-react';
import type { Post, Sound } from '@/lib/supabase';

const FORMATS: { value: Post['format']; label: string; icon: typeof Image }[] = [
  { value: 'photo', label: 'Photo', icon: Image },
  { value: 'carousel', label: 'Carrousel', icon: Layers },
  { value: 'reel', label: 'Reel', icon: Film },
];

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);
  const [caption, setCaption] = useState('');
  const [format, setFormat] = useState<Post['format']>('photo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (data) {
        setPost(data);
        setCaption(data.caption);
        setFormat(data.format);

        // Charge le son tendance si Reel
        if (data.format === 'reel' && data.sound_id) {
          const { data: soundData } = await supabase
            .from('sounds')
            .select('*')
            .eq('id', data.sound_id)
            .single();
          setSound(soundData);
        }
      }
      setLoading(false);
    };
    loadPost();
  }, [postId]);

  const handleSaveCaption = async () => {
    if (!post) return;
    setSaving(true);
    await supabase
      .from('posts')
      .update({ caption })
      .eq('id', post.id);
    setSaving(false);
  };

  const handleFormatChange = async (newFormat: Post['format']) => {
    setFormat(newFormat);
    if (!post) return;
    await supabase
      .from('posts')
      .update({ format: newFormat })
      .eq('id', post.id);

    // Charge un son tendance si passage en Reel
    if (newFormat === 'reel') {
      const { data: sounds } = await supabase
        .from('sounds')
        .select('*')
        .limit(1);
      if (sounds?.[0]) {
        setSound(sounds[0]);
        await supabase.from('posts').update({ sound_id: sounds[0].id }).eq('id', post.id);
      }
    } else {
      setSound(null);
    }
  };

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!post) return;
    await supabase.from('posts').update({ status }).eq('id', post.id);
    router.push('/planning');
  };

  if (loading || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="text-terra animate-spin" />
      </div>
    );
  }

  const scoreDetails = post.score_details as Record<string, number> | null;

  return (
    <div className="flex flex-col min-h-screen py-6">
      <BackButton href="/planning" />

      {/* Visuel principal */}
      <div className="relative rounded-card overflow-hidden bg-border-l mt-4 mb-4" style={{ aspectRatio: '4/5' }}>
        {post.visual_url ? (
          <img src={post.visual_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image size={48} className="text-muted" />
          </div>
        )}

        {/* Score badge */}
        <button
          onClick={() => setShowScoreDetails(!showScoreDetails)}
          className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-pill px-3 py-1.5 flex items-center gap-1.5 shadow-md"
        >
          <span className="text-sm font-bold text-terra">{post.performance_score}</span>
          <span className="text-xs text-sub">/100</span>
        </button>

        {/* Bouton swap photo */}
        <button className="absolute bottom-3 right-3 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <RefreshCw size={18} className="text-sub" />
        </button>
      </div>

      {/* Détails du score */}
      {showScoreDetails && scoreDetails && (
        <div className="card mb-4">
          <h3 className="text-sm font-medium text-text mb-3">Décomposition du score</h3>
          <div className="space-y-2">
            {Object.entries(scoreDetails).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-sub flex-1 capitalize">{key.replace(/_/g, ' ')}</span>
                <div className="w-20 h-1.5 bg-border-l rounded-full overflow-hidden">
                  <div className="h-full bg-terra rounded-full" style={{ width: `${value}%` }} />
                </div>
                <span className="text-xs font-medium text-text w-8 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jour / heure */}
      <div className="flex items-center gap-3 mb-4">
        <Clock size={16} className="text-sub" />
        <span className="text-sm font-medium text-text">{post.day_of_week}</span>
        <span className="text-sm text-sub">{post.scheduled_time}</span>
      </div>

      {/* Sélecteur de format */}
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

      {/* Son tendance (si Reel) */}
      {format === 'reel' && sound && (
        <div className="card mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-input bg-terra-bg flex items-center justify-center">
            <Music size={18} className="text-terra" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text">{sound.title}</p>
            <p className="text-xs text-sub">{sound.artist} — Tendance dans ta niche</p>
          </div>
          {sound.instagram_url && (
            <a
              href={sound.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-terra font-medium"
            >
              Ouvrir ↗
            </a>
          )}
        </div>
      )}

      {/* Légende éditable */}
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

      {/* Hashtags */}
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

      {/* Boutons Refuser / Valider */}
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
