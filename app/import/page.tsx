'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/back-button';
import BottomNav from '@/components/bottom-nav';
import { ImagePlus, X, Loader2, Film, Image } from 'lucide-react';

type VisualFile = {
  file: File;
  preview: string;
  isVideo: boolean;
};

export default function ImportPage() {
  const router = useRouter();
  const [visuals, setVisuals] = useState<VisualFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUserId(session.user.id);
    };
    getUser();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const removeVisual = (index: number) => {
    setVisuals((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    const newVisuals = arr.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isVideo: file.type.startsWith('video/'),
    }));
    setVisuals((prev) => [...prev, ...newVisuals]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const videoCount = visuals.filter((v) => v.isVideo).length;
  const photoCount = visuals.length - videoCount;

  const handleGenerate = async () => {
    if (visuals.length < 3 || !userId) return;
    setLoading(true);

    try {
      // Upload vers Supabase Storage
      const uploadedUrls: string[] = [];
      for (const v of visuals) {
        const ext = v.file.name.split('.').pop();
        const path = `visuals/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('visuals').upload(path, v.file);
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('visuals').getPublicUrl(path);
        uploadedUrls.push(publicUrl);
      }

      sessionStorage.setItem('uploaded_visuals', JSON.stringify(uploadedUrls));
      router.push('/planning');
    } catch (err) {
      console.error('Erreur upload:', err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-6 pb-24">
      <BackButton href="/planning" />

      <h1 className="font-cinzel text-xl font-semibold text-text mt-4 mb-1">Import des visuels</h1>
      <p className="text-sm text-sub mb-6">Choisis les visuels pour ta semaine de contenu</p>

      {/* Zone d'import — drag & drop sur desktop, tap sur mobile */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 py-12 rounded-card border-2 border-dashed cursor-pointer transition-colors mb-4 ${
          dragging ? 'border-terra bg-terra-bg' : 'border-border active:border-terra'
        }`}
      >
        <ImagePlus size={36} className={dragging ? 'text-terra' : 'text-muted'} />
        <span className="text-sm font-medium text-text">
          {dragging ? 'Dépose tes visuels ici' : 'Choisir mes visuels'}
        </span>
        <span className="text-xs text-muted hidden md:block">Glisse-dépose tes fichiers ou clique pour parcourir</span>
        <span className="text-xs text-muted md:hidden">Photos et vidéos depuis ta pellicule</span>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>

      {/* Grille des visuels sélectionnés */}
      {visuals.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 mb-6">
          {visuals.map((v, i) => (
            <div key={i} className="relative aspect-square rounded-input overflow-hidden border border-border">
              {v.isVideo ? (
                <div className="w-full h-full bg-border-l flex items-center justify-center">
                  <Film size={24} className="text-sub" />
                </div>
              ) : (
                <img src={v.preview} alt="" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => removeVisual(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-text/70 flex items-center justify-center"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Compteur */}
      {visuals.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-sub mb-6">
          <div className="flex items-center gap-1">
            <Image size={14} />
            <span>{photoCount} photo{photoCount !== 1 ? 's' : ''}</span>
          </div>
          {videoCount > 0 && (
            <div className="flex items-center gap-1">
              <Film size={14} />
              <span>{videoCount} vidéo{videoCount !== 1 ? 's' : ''}</span>
            </div>
          )}
          <span className="text-muted">— {visuals.length} visuels sélectionnés</span>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={handleGenerate}
          disabled={visuals.length < 3 || loading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Génération en cours...
            </>
          ) : (
            `Générer ma semaine ✨`
          )}
        </button>
        {visuals.length > 0 && visuals.length < 3 && (
          <p className="text-xs text-sub text-center mt-2">
            Minimum 3 visuels pour générer ta semaine
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
