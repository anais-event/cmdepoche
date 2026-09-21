'use client';

import { useState } from 'react';
import { X, Send, Clock, Loader2, Check, AlertCircle } from 'lucide-react';
import type { Post } from '@/lib/supabase';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { id: 'facebook', label: 'Facebook', emoji: '📘' },
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  { id: 'x', label: 'X (Twitter)', emoji: '𝕏' },
  { id: 'threads', label: 'Threads', emoji: '🧵' },
];

type PublishResult = {
  postId: string;
  status: 'success' | 'error';
  message?: string;
};

export default function PublishModal({
  posts,
  onClose,
}: {
  posts: Post[];
  onClose: () => void;
}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'scheduled'>('now');
  const [publishing, setPublishing] = useState(false);
  const [results, setResults] = useState<PublishResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) return;
    setPublishing(true);
    setResults([]);

    const approvedPosts = posts.filter((p) => p.status === 'approved');

    for (let i = 0; i < approvedPosts.length; i++) {
      setCurrentIndex(i);
      const post = approvedPosts[i];

      try {
        const body: Record<string, unknown> = {
          postId: post.id,
          platforms: selectedPlatforms,
        };

        if (scheduleMode === 'scheduled') {
          const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(post.day_of_week);
          if (dayIndex >= 0 && post.scheduled_time) {
            const now = new Date();
            const currentDay = now.getDay() === 0 ? 6 : now.getDay() - 1;
            let daysUntil = dayIndex - currentDay;
            if (daysUntil <= 0) daysUntil += 7;

            const schedDate = new Date(now);
            schedDate.setDate(schedDate.getDate() + daysUntil);
            const [hours, minutes] = post.scheduled_time.split(':');
            schedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            body.scheduledDate = schedDate.toISOString();
            body.timezone = 'Europe/Paris';
          }
        }

        const res = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        setResults((prev) => [
          ...prev,
          {
            postId: post.id,
            status: res.ok ? 'success' : 'error',
            message: res.ok ? undefined : data.error,
          },
        ]);
      } catch {
        setResults((prev) => [
          ...prev,
          { postId: post.id, status: 'error', message: 'Erreur réseau' },
        ]);
      }
    }

    setPublishing(false);
  };

  const approvedCount = posts.filter((p) => p.status === 'approved').length;
  const successCount = results.filter((r) => r.status === 'success').length;
  const isDone = results.length > 0 && !publishing;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card w-full max-w-lg rounded-t-2xl p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted active:text-text"
        >
          <X size={20} />
        </button>

        <h2 className="font-cinzel text-lg font-semibold text-text mb-1">
          {isDone ? 'Publication terminée' : 'Publier tes posts'}
        </h2>
        <p className="text-xs text-sub mb-5">
          {isDone
            ? `${successCount}/${results.length} posts publiés`
            : `${approvedCount} post${approvedCount > 1 ? 's' : ''} validé${approvedCount > 1 ? 's' : ''}`}
        </p>

        {isDone ? (
          <div className="space-y-2 mb-6">
            {results.map((r) => {
              const post = posts.find((p) => p.id === r.postId);
              return (
                <div key={r.postId} className="flex items-center gap-3 py-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    r.status === 'success' ? 'bg-sage-bg' : 'bg-red-50'
                  }`}>
                    {r.status === 'success' ? (
                      <Check size={16} className="text-sage" />
                    ) : (
                      <AlertCircle size={16} className="text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text">{post?.day_of_week} — {post?.scheduled_time}</p>
                    {r.message && <p className="text-xs text-red-400">{r.message}</p>}
                  </div>
                </div>
              );
            })}
            <button onClick={onClose} className="btn-primary mt-4">
              Fermer
            </button>
          </div>
        ) : (
          <>
            {/* Plateformes */}
            <div className="mb-5">
              <label className="text-sm font-medium text-text mb-2 block">Plateformes</label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-input text-sm transition-colors ${
                      selectedPlatforms.includes(p.id)
                        ? 'bg-terra-bg text-terra font-medium border border-terra/30'
                        : 'bg-card-alt text-sub border border-transparent'
                    }`}
                  >
                    <span>{p.emoji}</span>
                    <span className="text-xs">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="mb-6">
              <label className="text-sm font-medium text-text mb-2 block">Quand</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setScheduleMode('now')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-input text-sm transition-colors ${
                    scheduleMode === 'now'
                      ? 'bg-terra-bg text-terra font-medium border border-terra/30'
                      : 'bg-card-alt text-sub border border-transparent'
                  }`}
                >
                  <Send size={14} />
                  Maintenant
                </button>
                <button
                  onClick={() => setScheduleMode('scheduled')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-input text-sm transition-colors ${
                    scheduleMode === 'scheduled'
                      ? 'bg-terra-bg text-terra font-medium border border-terra/30'
                      : 'bg-card-alt text-sub border border-transparent'
                  }`}
                >
                  <Clock size={14} />
                  Programmer
                </button>
              </div>
              {scheduleMode === 'scheduled' && (
                <p className="text-xs text-sub mt-2">
                  Chaque post sera programmé au jour/heure défini dans le planning
                </p>
              )}
            </div>

            {/* Publier */}
            <button
              onClick={handlePublish}
              disabled={publishing || selectedPlatforms.length === 0}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {publishing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Publication {currentIndex + 1}/{approvedCount}...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Publier sur {selectedPlatforms.length} plateforme{selectedPlatforms.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
