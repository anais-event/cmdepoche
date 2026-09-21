import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const CAPTION_PROMPT = (profile: Record<string, unknown>, visualCount: number) => `Tu es un community manager expert pour micro-influenceurs français.
Génère ${Math.min(visualCount, 3)} publications Instagram pour cette semaine.

Profil créateur :
- Ton : ${profile.detected_tone || 'Authentique'}
- Niche : ${profile.detected_niche || 'Lifestyle'}
- Cible : ${profile.detected_target || 'Audience générale'}
- Objectif : ${profile.objective || 'engage'}
- Abonnés : ${profile.followers_count || 0}

Contraintes par légende :
- 80 à 150 mots
- Accroche forte (pas "Je" ou "Nous" en ouverture)
- Question ouverte en clôture pour maximiser les commentaires
- 2-3 emojis max, placés naturellement
- Ton authentique et personnel, pas corporate
- Français

Génère un JSON strict :
{
  "posts": [
    {
      "day": "Lundi",
      "time": "18:30",
      "format": "Photo",
      "caption": "...",
      "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "score": 85
    }
  ]
}

Les formats possibles : "Photo", "Carousel", "Reel".
Varie les formats. Utilise les créneaux optimaux du créateur si disponibles.
Réponds UNIQUEMENT avec le JSON valide.`;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function getUserId(request: NextRequest, body: Record<string, unknown>): Promise<string | null> {
  if (body.user_id && typeof body.user_id === 'string') {
    return body.user_id;
  }

  try {
    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = await getUserId(request, body);

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const supabase = getSupabase();

    const [{ data: profile }, { data: brainData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('brand_brain').select('objective, posting_frequency, content_pillars').eq('user_id', userId).single(),
    ]);

    const p = profile || {
      detected_tone: 'Authentique',
      detected_niche: 'Lifestyle',
      detected_target: 'Audience générale',
      followers_count: 2800,
      optimal_slots: [
        { day: 'Lundi', time: '18:30' },
        { day: 'Mercredi', time: '12:00' },
        { day: 'Vendredi', time: '19:00' },
      ],
    };

    const objective = brainData?.objective || (profile as Record<string, unknown>)?.objective || 'engage';
    const frequency = brainData?.posting_frequency || (profile as Record<string, unknown>)?.posting_frequency || '3/week';
    const nPosts = parseInt(frequency) || 3;

    const visualUrls: string[] = body.visual_urls || [];

    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          messages: [{ role: 'user', content: CAPTION_PROMPT({ ...p, objective }, Math.max(visualUrls.length, nPosts)) }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || '';
        try {
          const result = JSON.parse(text);
          return NextResponse.json({ posts: result.posts, db_ok: false });
        } catch {
          console.error('Erreur parsing réponse Claude:', text);
        }
      }
    }

    // Fallback déterministe
    const slots = (p.optimal_slots as { day: string; time: string }[]) || [
      { day: 'Lundi', time: '18:30' },
      { day: 'Mercredi', time: '12:00' },
      { day: 'Vendredi', time: '19:00' },
      { day: 'Samedi', time: '10:00' },
      { day: 'Dimanche', time: '17:00' },
    ];

    const formats = ['Carousel', 'Photo', 'Reel', 'Carousel', 'Photo'];
    const niche = (p.detected_niche as string) || 'Lifestyle';
    const pillars = brainData?.content_pillars as { name: string }[] | null;

    const captions = [
      `Ce qu'on ne te dit jamais sur le ${niche.toLowerCase()} : la régularité bat la perfection. Chaque jour, un petit pas.\n\nToi aussi tu galères à rester constant·e ? 👇`,
      `3 choses que j'aurais aimé savoir quand j'ai commencé ✨\n\n1. Ton audience veut du vrai, pas du parfait\n2. Un carrousel vaut mieux qu'un long discours\n3. La meilleure heure, c'est celle où TU es disponible\n\nLaquelle te parle le plus ?`,
      `Coulisses 🎬 Voilà à quoi ressemble vraiment une journée de création de contenu.\n\nSpoiler : c'est 20% de créativité et 80% d'organisation.\n\nC'est quoi ton secret pour rester organisé·e ?`,
      `On en parle de cette lumière ? ☀️ Parfois les meilleures choses arrivent quand on arrête de tout contrôler.\n\nQuel est ton moment préféré de la journée pour créer ?`,
      `Le format qui cartonne en ce moment → le carrousel éducatif. Pourquoi ? Parce qu'il donne de la valeur ET garde les gens sur ton post.\n\nTu as déjà testé ? Dis-moi en commentaire 💬`,
    ];

    const posts = slots.slice(0, nPosts).map((slot, i) => ({
      day: slot.day,
      time: slot.time,
      format: formats[i % formats.length],
      caption: captions[i % captions.length],
      hashtags: [
        niche.toLowerCase().replace(/\s/g, ''),
        ...(pillars?.slice(0, 2).map(p => p.name.toLowerCase().replace(/\s/g, '')) || []),
        'contentcreator',
        'createurfrancais',
      ],
      score: 82 + i * 3,
    }));

    return NextResponse.json({ posts, db_ok: false });
  } catch (err) {
    console.error('Erreur génération:', err);
    return NextResponse.json({ error: 'Erreur lors de la génération' }, { status: 500 });
  }
}
