'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthSync() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
          document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
        } else {
          document.cookie = 'sb-access-token=; path=/; max-age=0';
          document.cookie = 'sb-refresh-token=; path=/; max-age=0';
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
