import { createClient } from '@supabase/supabase-js';

// Le Cerveau de Marque — source unique de vérité.
// Rempli au scan, enrichi à chaque cycle. Tout le moteur lit/réécrit ça.

export type BrandBrain = {
  user_id: string;

  what_they_sell: string | null;
  audience: {
    who?: string;
    age?: string;
    interests?: string[];
    pains?: string[];
    lang?: string;
  };
  price_positioning: string | null;

  brand_name: string | null;
  visual_identity: {
    colors?: string[];
    fonts?: string[];
    aesthetic?: string[];
    mood?: string;
  };
  tone_of_voice: string | null;
  content_pillars: { name: string; weight: number }[];

  bio_text: string | null;
  bio_diagnostic: string | null;

  objective: 'grow' | 'sell' | 'engage' | 'authority' | 'traffic' | null;
  objective_details: string | null;
  target_kpis: { primary?: string; secondary?: string };

  what_works: {
    formats?: string[];
    topics?: string[];
    hooks?: string[];
    hours?: string[];
  };
  what_fails: { formats?: string[]; topics?: string[] };
  best_posting_slots: { day: string; time: string; score: number }[];

  posting_frequency: string;

  scan_evidence: Record<string, unknown>;
  confidence: number;
  brain_version: number;
  user_confirmed: boolean;
  last_scanned_at: string | null;
  updated_at: string;
};

// Ce que le scan/analyse IA produit (avant écriture en base).
export type BrainInsights = Pick<
  BrandBrain,
  | 'what_they_sell'
  | 'audience'
  | 'price_positioning'
  | 'brand_name'
  | 'visual_identity'
  | 'tone_of_voice'
  | 'content_pillars'
  | 'what_works'
  | 'what_fails'
  | 'best_posting_slots'
  | 'confidence'
>;

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getBrain(userId: string): Promise<BrandBrain | null> {
  const { data } = await admin().from('brand_brain').select('*').eq('user_id', userId).single();
  return (data as BrandBrain) || null;
}

// Écrit ce que le scan a compris. Ne touche pas l'objectif (ça vient du user).
export async function writeScanToBrain(userId: string, insights: BrainInsights): Promise<void> {
  await admin()
    .from('brand_brain')
    .upsert(
      {
        user_id: userId,
        ...insights,
        scan_evidence: {},
        last_scanned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
}

// L'user confirme/corrige le scan et pose son objectif → cerveau prêt.
export async function confirmBrain(
  userId: string,
  patch: Partial<BrandBrain>
): Promise<void> {
  await admin()
    .from('brand_brain')
    .update({ ...patch, user_confirmed: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
}
