'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single();

      if (profile?.onboarding_completed) {
        router.push('/planning');
      } else {
        router.push('/onboarding');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
      <div className="w-20 h-20 rounded-3xl bg-terra flex items-center justify-center shadow-lg">
        <span className="text-white text-3xl font-cinzel font-bold">CM</span>
      </div>
      <h1 className="text-2xl font-cinzel font-semibold text-text">CM de Poche</h1>
      <p className="text-sm text-sub">Ton community manager de poche</p>
      <div className="mt-4 w-6 h-6 border-2 border-border border-t-terra rounded-full animate-spin" />
    </div>
  );
}
