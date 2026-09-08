import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const EXPERT_PROMPT = (data: Record<string, unknown>) => `Tu es un consultant senior en marketing digital, spécialisé dans les micro-influenceurs français.
Génère un diagnostic stratégique pour ce créateur. C'est la première fois qu'il reçoit un vrai diagnostic personnalisé — ce moment doit être un "waouh".

Données :
- Pseudo : ${data.handle}
- Abonnés : ${data.followers}
- Niche détectée : ${data.niche}
- Cible : ${JSON.stringify(data.target_details)}
- Site : ${data.website || 'Non renseigné'}
- Autres réseaux : ${JSON.stringify(data.other_socials || [])}
- Objectif : ${data.objective} → ${data.objective_details || 'Non précisé'}
- Ton détecté : ${data.tone}
- Palette visuelle actuelle : ${JSON.stringify(data.palette)}
- Part d'engagement par format : ${JSON.stringify(data.format_engagement)}

Génère un JSON strict :
{
  "swot": {
    "forces": ["...", "...", "..."],
    "faiblesses": ["...", "...", "..."],
    "opportunites": ["...", "...", "..."],
    "menaces": ["...", "...", "..."]
  },
  "coherence_objectif_niche": {
    "score": 0-100,
    "diagnostic": "1-2 phrases concrètes",
    "recommandation": "action précise"
  },
  "coherence_colorimetrie_niche": {
    "score": 0-100,
    "diagnostic": "...",
    "recommandation": "..."
  },
  "recommandations_prioritaires": [
    {"titre": "...", "description": "...", "actionnable_semaine": true},
    {"titre": "...", "description": "...", "actionnable_semaine": true},
    {"titre": "...", "description": "...", "actionnable_semaine": true}
  ]
}

Ton : bienveillant, expert, jamais culpabilisant. Concret et actionnable.
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

    // Si diagnostic déjà en cache
    if (profile.expert_advice) {
      return NextResponse.json(profile.expert_advice);
    }

    const promptData = {
      handle: profile.instagram_handle,
      followers: profile.followers_count,
      niche: profile.detected_niche,
      target_details: profile.target_details || profile.detected_target,
      website: profile.website,
      other_socials: profile.other_socials,
      objective: profile.objective,
      objective_details: profile.objective_details,
      tone: profile.detected_tone,
      palette: profile.color_palette,
      format_engagement: profile.format_engagement,
    };

    // Appel Claude Sonnet
    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          messages: [{ role: 'user', content: EXPERT_PROMPT(promptData) }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || '';
        try {
          const advice = JSON.parse(text);

          // Cache en base
          await supabase
            .from('profiles')
            .update({ expert_advice: advice, updated_at: new Date().toISOString() })
            .eq('id', user.id);

          return NextResponse.json(advice);
        } catch {
          console.error('Erreur parsing réponse expert:', text);
        }
      }
    }

    // Fallback : diagnostic simulé
    const fallbackAdvice = {
      swot: {
        forces: [
          'Identité visuelle cohérente et reconnaissable',
          'Engagement régulier de ta communauté existante',
          'Positionnement authentique dans ta niche',
        ],
        faiblesses: [
          'Fréquence de publication irrégulière',
          'Légendes trop courtes, peu d\'appels à l\'action',
          'Pas assez de diversité dans les formats (peu de Reels)',
        ],
        opportunites: [
          'Les Reels génèrent 3x plus de reach dans ta niche',
          'Collaborations avec des créateurs complémentaires',
          'Contenu éducatif très demandé dans ton domaine',
        ],
        menaces: [
          'Concurrence croissante sur ta niche',
          'Changements d\'algorithme favorisant la vidéo',
          'Risque de lassitude si contenu trop répétitif',
        ],
      },
      coherence_objectif_niche: {
        score: 72,
        diagnostic: 'Ton objectif est cohérent avec ta niche, mais ta stratégie de contenu pourrait mieux servir cet objectif.',
        recommandation: 'Ajoute un appel à l\'action clair dans chaque légende et varie tes formats pour toucher une audience plus large.',
      },
      coherence_colorimetrie_niche: {
        score: 85,
        diagnostic: 'Ta palette visuelle est en harmonie avec ton positionnement. Les tons chauds renforcent l\'authenticité.',
        recommandation: 'Maintiens cette cohérence et crée 2-3 templates de stories avec ces couleurs pour renforcer ta marque.',
      },
      recommandations_prioritaires: [
        {
          titre: 'Publie 1 Reel cette semaine',
          description: 'Les Reels obtiennent 2-3x plus de portée. Filme un contenu simple de 15 secondes sur ton quotidien.',
          actionnable_semaine: true,
        },
        {
          titre: 'Ajoute une question dans tes 3 prochaines légendes',
          description: 'Une question ouverte en fin de légende augmente les commentaires de 40% en moyenne.',
          actionnable_semaine: true,
        },
        {
          titre: 'Teste le carrousel éducatif',
          description: 'Partage 5 conseils rapides liés à ta niche. Ce format génère les meilleurs taux de sauvegarde.',
          actionnable_semaine: true,
        },
      ],
    };

    // Cache le fallback aussi
    await supabase
      .from('profiles')
      .update({ expert_advice: fallbackAdvice, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    return NextResponse.json(fallbackAdvice);
  } catch (err) {
    console.error('Erreur génération expert:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du diagnostic' },
      { status: 500 }
    );
  }
}
