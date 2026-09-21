'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import { Plus, Loader2, Film, Image as ImageIcon, Check } from 'lucide-react';

type ContentStatus = 'available' | 'selected' | 'scheduled' | 'published';

type LibraryItem = {
  name: string;
  url: string;
  isVideo: boolean;
  status: ContentStatus;
};

type Tab = 'all' | 'selected' | 'scheduled' | 'published';

export default function ContenusPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<Tab>('all');

  const loadLibrary = useCallback(async (uid: string) => {
    const { data: files } = await supabase.storage
      .from('visuals')
      .list(uid, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

    const { data: statuses } = await supabase
      .from('content_status')
      .select('file_name, status')
      .eq('user_id', uid);

    const statusMap = new Map<string, ContentStatus>();
    (statuses || []).forEach(s => statusMap.set(s.file_name, s.status as ContentStatus));

    const mapped: LibraryItem[] = (files || [])
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((f) => {
        const { data: { publicUrl } } = supabase.storage.from('visuals').getPublicUrl(`${uid}/${f.name}`);
        return {
          name: f.name,
          url: publicUrl,
          isVideo: /\.(mp4|mov|webm|m4v)$/i.test(f.name),
          status: statusMap.get(f.name) || 'available',
        };
      });
    setItems(mapped);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);
      await loadLibrary(session.user.id);
      setLoading(false);
    };
    init();
  }, [router, loadLibrary]);

  const toggleSelect = async (item: LibraryItem) => {
    if (!userId) return;
    if (item.status === 'scheduled' || item.status === 'published') return;

    const newStatus: ContentStatus = item.status === 'selected' ? 'available' : 'selected';
    setItems(prev => prev.map(i => i.name === item.name ? { ...i, status: newStatus } : i));

    await supabase.from('content_status').upsert({
      user_id: userId,
      file_name: item.name,
      status: newStatus,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,file_name' });
  };

  const addFiles = async (files: FileList | File[]) => {
    if (!userId) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (!arr.length) return;
    setUploading(true);
    try {
      for (const file of arr) {
        const ext = file.name.split('.').pop();
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        await supabase.storage.from('visuals').upload(path, file);
      }
      await loadLibrary(userId);
    } catch (err) {
      console.error('Upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const filtered = items.filter(i => {
    if (tab === 'all') return true;
    if (tab === 'selected') return i.status === 'selected';
    return i.status === tab;
  });

  const [generating, setGenerating] = useState(false);
  const selectedCount = items.filter(i => i.status === 'selected').length;
  const totalCount = items.length;

  const handleGenerateWeek = async () => {
    if (!userId || generating) return;
    setGenerating(true);
    try {
      const selectedUrls = items
        .filter(i => i.status === 'selected')
        .map(i => i.url);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visual_urls: selectedUrls, user_id: userId }),
      });

      if (!res.ok) throw new Error('Erreur génération');
      router.push('/planning');
    } catch (err) {
      console.error('Generate:', err);
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-cinzel text-xl font-semibold text-text">Contenus</h1>
        <span className="text-xs text-muted">{totalCount} disponible{totalCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Upload */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        className={`flex items-center justify-center gap-2 py-4 rounded-card border-2 border-dashed cursor-pointer transition-colors mb-4 ${
          dragging ? 'border-terra bg-terra-bg' : 'border-border active:border-terra'
        }`}
      >
        {uploading ? <Loader2 size={18} className="text-terra animate-spin" /> : <Plus size={18} className={dragging ? 'text-terra' : 'text-muted'} />}
        <span className="text-sm text-text">{uploading ? 'Ajout...' : 'Ajouter'}</span>
        <input type="file" accept="image/*,video/*" multiple onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" />
      </label>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {([
          ['all', 'Tous'] as const,
          ['selected', `Sélectionnés${selectedCount > 0 ? ` (${selectedCount})` : ''}`] as const,
          ['scheduled', 'Programmés'] as const,
          ['published', 'Publiés'] as const,
        ]).map(([value, label]) => (
          <button key={value} onClick={() => setTab(value)} className={`pill text-xs ${tab === value ? 'pill-active' : ''}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1"><Loader2 size={24} className="text-terra animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 py-12">
          <ImageIcon size={28} className="text-muted" />
          <p className="text-sm text-sub">Rien ici.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-6">
            {filtered.map((v) => (
              <button
                key={v.name}
                onClick={() => toggleSelect(v)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  v.status === 'selected' ? 'border-terra' : 'border-transparent'
                }`}
              >
                {v.isVideo ? (
                  <div className="w-full h-full bg-border-l flex items-center justify-center"><Film size={22} className="text-sub" /></div>
                ) : (
                  <img src={v.url} alt="" className="w-full h-full object-cover" />
                )}
                {v.status === 'selected' && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-terra flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                {v.status === 'scheduled' && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5">Programmé</div>
                )}
                {v.status === 'published' && (
                  <div className="absolute bottom-0 inset-x-0 bg-sage/80 text-white text-[9px] text-center py-0.5">Publié</div>
                )}
              </button>
            ))}
          </div>

          {selectedCount > 0 && (
            <div className="mt-auto">
              <button
                onClick={handleGenerateWeek}
                disabled={generating}
                className="btn-primary flex items-center justify-center gap-2"
              >
                {generating ? (
                  <><Loader2 size={18} className="animate-spin" /> Préparation...</>
                ) : (
                  `Préparer la semaine (${selectedCount}) →`
                )}
              </button>
            </div>
          )}
        </>
      )}

      <BottomNav />
    </div>
  );
}
