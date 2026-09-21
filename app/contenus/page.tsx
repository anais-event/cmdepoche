'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/bottom-nav';
import { ImagePlus, X, Loader2, Film, Image as ImageIcon, CalendarClock, CheckCircle2 } from 'lucide-react';

// Onglet CONTENUS (R2) — la bibliothèque personnelle, brique centrale.
// Ce n'est PAS un écran d'import temporaire : tes photos et vidéos y vivent en permanence.
// « Tes photos et vidéos sont notre matière première. CM de Poche s'occupe de savoir quoi en faire. »

type LibraryItem = {
  name: string;
  url: string;
  isVideo: boolean;
};

type Tab = 'available' | 'scheduled' | 'published';

export default function ContenusPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<Tab>('available');

  const loadLibrary = useCallback(async (uid: string) => {
    const { data } = await supabase.storage.from('visuals').list(uid, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    const mapped: LibraryItem[] = (data || [])
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((f) => {
        const { data: { publicUrl } } = supabase.storage.from('visuals').getPublicUrl(`${uid}/${f.name}`);
        return { name: f.name, url: publicUrl, isVideo: /\.(mp4|mov|webm|m4v)$/i.test(f.name) };
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

  const addFiles = async (files: FileList | File[]) => {
    if (!userId) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (!arr.length) return;
    setUploading(true);
    try {
      for (const file of arr) {
        const ext = file.name.split('.').pop();
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('visuals').upload(path, file);
        if (error) throw error;
      }
      await loadLibrary(userId);
    } catch (err) {
      console.error('Upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeItem = async (name: string) => {
    if (!userId) return;
    await supabase.storage.from('visuals').remove([`${userId}/${name}`]);
    setItems((prev) => prev.filter((i) => i.name !== name));
  };

  const photoCount = items.filter((i) => !i.isVideo).length;
  const videoCount = items.length - photoCount;

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      <h1 className="font-cinzel text-xl font-semibold text-text mb-1">Contenus</h1>
      <p className="text-sm text-sub mb-5 max-w-md">
        Tes photos et vidéos sont notre matière première. Dépose-les ici une fois — CM de Poche s&apos;occupe de savoir quoi en faire.
      </p>

      {/* Zone d'ajout — toujours disponible */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        className={`flex flex-col items-center justify-center gap-2 py-8 rounded-card border-2 border-dashed cursor-pointer transition-colors mb-5 ${
          dragging ? 'border-terra bg-terra-bg' : 'border-border active:border-terra'
        }`}
      >
        {uploading ? <Loader2 size={28} className="text-terra animate-spin" /> : <ImagePlus size={28} className={dragging ? 'text-terra' : 'text-muted'} />}
        <span className="text-sm font-medium text-text">{uploading ? 'Ajout en cours...' : 'Ajouter des photos ou vidéos'}</span>
        <span className="text-xs text-muted hidden md:block">Glisse-dépose ou clique pour parcourir</span>
        <input type="file" accept="image/*,video/*" multiple onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" />
      </label>

      {/* Filtres de statut */}
      <div className="flex gap-2 mb-4">
        {([
          { value: 'available' as const, label: 'Disponibles' },
          { value: 'scheduled' as const, label: 'Programmés' },
          { value: 'published' as const, label: 'Publiés' },
        ]).map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)} className={`pill flex-1 text-xs ${tab === t.value ? 'pill-active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1"><Loader2 size={24} className="text-terra animate-spin" /></div>
      ) : tab === 'available' ? (
        items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-terra-bg flex items-center justify-center">
              <ImageIcon size={24} className="text-terra" />
            </div>
            <p className="text-sm text-sub max-w-[240px]">Ta bibliothèque est vide. Dépose tes premiers visuels pour qu&apos;on ait de la matière.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 text-xs text-sub mb-3">
              <span className="flex items-center gap-1"><ImageIcon size={13} /> {photoCount} photo{photoCount !== 1 ? 's' : ''}</span>
              {videoCount > 0 && <span className="flex items-center gap-1"><Film size={13} /> {videoCount} vidéo{videoCount !== 1 ? 's' : ''}</span>}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 mb-6">
              {items.map((v) => (
                <div key={v.name} className="relative aspect-square rounded-input overflow-hidden border border-border group">
                  {v.isVideo ? (
                    <div className="w-full h-full bg-border-l flex items-center justify-center"><Film size={24} className="text-sub" /></div>
                  ) : (
                    <img src={v.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <button onClick={() => removeItem(v.name)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-text/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <button onClick={() => router.push('/planning')} className="btn-primary">
                Préparer ma semaine avec ces contenus →
              </button>
            </div>
          </>
        )
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12 text-center">
          {tab === 'scheduled' ? <CalendarClock size={28} className="text-muted" /> : <CheckCircle2 size={28} className="text-muted" />}
          <p className="text-sm text-sub max-w-[260px]">
            {tab === 'scheduled'
              ? 'Les contenus que tu programmes depuis l\'onglet Semaine apparaîtront ici.'
              : 'Une fois publiés, tes contenus se rangent ici avec leurs performances.'}
          </p>
          <button onClick={() => router.push('/planning')} className="text-xs text-terra font-medium">Aller à ma semaine →</button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
