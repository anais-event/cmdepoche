'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        router.push('/onboarding');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/onboarding');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col py-12">
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-terra flex items-center justify-center shadow-md">
          <span className="text-white text-xl font-cinzel font-bold">CM</span>
        </div>
        <h1 className="font-cinzel text-2xl font-semibold text-text">
          CM de Poche
        </h1>
        <p className="text-sm text-sub">Ton community manager de poche</p>
      </div>

      <form onSubmit={handleAuth} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe (6 caractères min.)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
          minLength={6}
        />

        {error && <p className="text-sm text-red-500 px-1">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-1 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Chargement...
            </>
          ) : (
            isSignup ? 'Créer mon compte' : 'Se connecter'
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsSignup(!isSignup);
          setError('');
        }}
        className="mt-6 text-sm text-sub active:text-terra transition-colors text-center"
      >
        {isSignup
          ? 'Déjà un compte ? Se connecter'
          : "Pas encore de compte ? S'inscrire"}
      </button>

      <p className="text-[11px] text-muted text-center mt-8 leading-relaxed px-4">
        En continuant, tu acceptes nos conditions d&apos;utilisation et notre
        politique de confidentialité.
      </p>
    </div>
  );
}
