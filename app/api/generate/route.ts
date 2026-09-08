import { NextRequest, NextResponse } from 'next/server';
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
      "day_of_week": "Lundi",
      "scheduled_time": "18:30",
      "format": "photo",
      "caption": "...",
      "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "performance_score": 75-95,
      "score_details": {"pertinence": 80, "engagement": 85, "timing": 90, "hashtags": 75}
    }
  ]
}

Les formats possibles : "photo", "carousel", "reel".
Varie les formats. Utilise les créneaux optimaux du créateur si disponibles.
Réponds UNIQUEMENT avec le JSON valide.`;

export async function POST(request: NextRequest) {
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
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const visualUrls: string[] = body.visual_urls || [];
    const visualCount = Math.max(visualUrls.length, 3);

    // Appel Claude Haiku pour les légendes
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
          messages: [{ role: 'user', content: CAPTION_PROMPT(profile, visualCount) }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || '';
        try {
          const result = JSON.parse(text);

          // Crée la semaine + les posts en base
          const weekStart = getNextMonday();
          const { data: week } = await supabase
            .from('weeks')
            .insert({ user_id: user.id, week_start: weekStart, status: 'draft' })
            .select()
            .single();

          if (week) {
            const postsToInsert = result.posts.map((p: Record<string, unknown>, i: number) => ({
              week_id: week.id,
              user_id: user.id,
              day_of_week: p.day_of_week,
              scheduled_time: p.scheduled_time,
              format: p.format,
              caption: p.caption,
              hashtags: p.hashtags,
              visual_url: visualUrls[i] || null,
              performance_score: p.performance_score || 80,
              score_details: p.score_details || null,
              status: 'pending',
            }));

            await supabase.from('posts').insert(postsToInsert);
          }

          return NextResponse.json(result);
        } catch {
          console.error('Erreur parsing réponse Claude:', text);
        }
      }
    }

    // Fallback : génération déterministe
    const slots = (profile.optimal_slots as { day: string; time: string }[]) || [
      { day: 'Lundi', time: '18:30' },
      { day: 'Mercredi', time: '12:00' },
      { day: 'Vendredi', time: '19:00' },
    ];

    const formats: ('photo' | 'carousel' | 'reel')[] = ['carousel', 'photo', 'reel'];
    const niche = profile.detected_niche || 'Lifestyle';

    const posts = slots.slice(0, 3).map((slot, i) => ({
      day_of_week: slot.day,
      scheduled_time: slot.time,
      format: formats[i % 3],
      caption: `✨ Un nouveau contenu ${niche} rien que pour toi ! Découvre ce que j'ai préparé cette semaine.\n\nQu'est-ce qui t'inspire le plus en ce moment ? Dis-moi en commentaire 👇`,
      hashtags: [niche.toLowerCase().replace(/\s/g, ''), 'contentcreator', 'inspiration', 'communaute', 'createurfrancais'],
      performance_score: 82 + i * 3,
      score_details: { pertinence: 80, engagement: 85, timing: 88, hashtags: 78 },
    }));

    // Crée la semaine + posts en base
    const weekStart = getNextMonday();
    const { data: week } = await supabase
      .from('weeks')
      .insert({ user_id: user.id, week_start: weekStart, status: 'draft' })
      .select()
      .single();

    if (week) {
      const postsToInsert = posts.map((p, i) => ({
        week_id: week.id,
        user_id: user.id,
        ...p,
        visual_url: visualUrls[i] || null,
        status: 'pending' as const,
      }));

      await supabase.from('posts').insert(postsToInsert);
    }

    return NextResponse.json({ posts });
  } catch (err) {
    console.error('Erreur génération:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    );
  }
}

function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().split('T')[0];
}
