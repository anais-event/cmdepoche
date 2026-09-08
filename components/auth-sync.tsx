'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthSync() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, _session) => {
        router.refresh();
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
