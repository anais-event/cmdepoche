import { NextRequest, NextResponse } from 'next/server';

type PlanItem = {
  day: string;
  time: string;
  format: string;
  visual?: { label?: string; type?: string } | null;
};

type Profile = {
  handle?: string;
  niche?: string;
  tone?: string;
  target?: string;
  bio?: string;
  followers_count?: number | null;
  objective?: string;
  pageType?: string;
  particularite?: string;
  prenom?: string;
};

const buildPrompt = (profile: Profile, plan: PlanItem[]) => {
  const planLines = plan
    .map(
      (p, i) =>
        `${i + 1}. ${p.day} ${p.time} — format imposé : ${p.format}${
          p.visual?.label ? ` — visuel fourni : ${p.visual.label} (${p.visual.type === 'video' ? 'vidéo' : 'photo'})` : ''
        }`
    )
    .join('\n');

  return `Tu es le community manager personnel de ce créateur Instagram. Tu écris À SA PLACE, dans SA voix. Jamais de ton générique ou "corporate IA".

FICHE CRÉATEUR
- Compte : @${profile.handle || 'le compte'}
- Prénom : ${profile.prenom || '—'}
- Activité / niche : ${profile.niche || 'Lifestyle'}
- Angle / particularité : ${profile.particularite || '—'}
- Ton de la marque : ${profile.tone || 'authentique et personnel'}
- Cible : ${profile.target || 'sa communauté'}
- Objectif principal : ${profile.objective || 'créer une communauté engagée'}
- Type de page : ${profile.pageType || '—'}
- Bio : ${profile.bio || '—'}
- Abonnés : ${profile.followers_count ?? '—'}

PLANNING À RÉDIGER (respecte l'ordre, le jour, l'heure et le format imposé de CHAQUE post) :
${planLines}

Pour CHAQUE post, écris un contenu réellement publiable, unique, cohérent avec le visuel fourni et le format imposé :
- "hook" : une accroche courte et percutante (1re ligne qui arrête le scroll), dans le ton du créateur, sans point final.
- "caption" : la légende complète (80–150 mots) qui commence par le hook, développe une idée liée à la niche/angle, et se termine par une question ouverte pour déclencher des commentaires. 2–3 emojis max, placés naturellement. Français. Jamais commencer par "Je" ou "Nous".
- "hashtags" : 4 à 6 hashtags pertinents pour la niche et le sujet du post (sans le #, en minuscules, sans espaces).
- "score" : entier 82–97, estimation de performance.
- "scoreDetails" : { "horaire": 80-98, "legende": 82-98, "hashtags": 80-98, "visuel": 85-98 }.

Adapte le contenu au format : un Reel parle de vidéo/mouvement, un Carrousel annonce plusieurs points à swiper, une Photo capture un instant.

Réponds UNIQUEMENT avec un JSON strict, sans markdown :
{ "posts": [ { "hook": "...", "caption": "...", "hashtags": ["..."], "score": 90, "scoreDetails": { "horaire": 90, "legende": 90, "hashtags": 88, "visuel": 92 } } ] }`;
};

const rnd = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const slug = (s: string) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

function fallback(profile: Profile, plan: PlanItem[]) {
  const niche = (profile.niche || 'Lifestyle').toLowerCase();
  const angle = profile.particularite || niche;
  const bank = [
    {
      hook: `Ce qu'on ne te dit jamais sur le ${niche}`,
      body: `La régularité bat la perfection, toujours. Un petit pas chaque jour crée plus d'impact qu'un grand coup une fois de temps en temps. C'est exactement ce qui fait la différence quand on parle de ${angle}.`,
      q: 'Toi aussi tu galères à rester constant·e ? 👇',
    },
    {
      hook: `3 choses que j'aurais aimé savoir plus tôt ✨`,
      body: `Ton audience veut du vrai, pas du parfait. Un format simple qui donne de la valeur bat un contenu léché mais vide. Et la meilleure heure pour poster, c'est celle où toi tu es vraiment disponible pour répondre.`,
      q: 'Laquelle te parle le plus ?',
    },
    {
      hook: `Les coulisses, la vraie version 🎬`,
      body: `Derrière chaque post, il y a 20% de créativité et 80% d'organisation. On ne montre jamais assez cette partie-là, et pourtant c'est elle qui tient tout sur la durée dans le ${niche}.`,
      q: "C'est quoi ton secret pour rester organisé·e ?",
    },
    {
      hook: `On arrête tout et on respire un instant`,
      body: `Parfois les meilleurs contenus arrivent quand on lâche le contrôle. Pas de script, juste un moment vrai capté au bon moment. C'est souvent ça qui résonne le plus auprès de ${profile.target || 'ta communauté'}.`,
      q: 'Quel est ton moment préféré pour créer ?',
    },
    {
      hook: `Le format qui cartonne en ce moment`,
      body: `Donner de la valeur ET garder les gens sur ton post : c'est tout l'intérêt d'un contenu pensé pour ta niche. Moins de bruit, plus de sens, et une vraie intention derrière chaque publication.`,
      q: 'Tu as déjà testé ? Dis-moi en commentaire 💬',
    },
  ];

  const posts = plan.map((p, i) => {
    const b = bank[i % bank.length];
    const formatHint =
      p.format === 'Reel'
        ? ' (à regarder jusqu\'au bout 🎬)'
        : p.format === 'Carrousel'
        ? ' — swipe pour tout voir →'
        : '';
    return {
      hook: b.hook,
      caption: `${b.hook}${formatHint}\n\n${b.body}\n\n${b.q}`,
      hashtags: [
        slug(niche),
        slug(profile.objective || 'communaute'),
        'createurfrancais',
        'contentcreator',
        slug(p.format),
      ].filter(Boolean),
      score: rnd(84, 96),
      scoreDetails: { horaire: rnd(80, 98), legende: rnd(82, 98), hashtags: rnd(80, 98), visuel: rnd(85, 98) },
    };
  });
  return posts;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const profile: Profile = body.profile || {};
    const plan: PlanItem[] = Array.isArray(body.plan) ? body.plan : [];

    if (!plan.length) {
      return NextResponse.json({ error: 'Aucun post à générer' }, { status: 400 });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 3072,
            messages: [{ role: 'user', content: buildPrompt(profile, plan) }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          let text = (data.content?.[0]?.text || '').trim();
          text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.posts) && parsed.posts.length) {
            return NextResponse.json({ posts: parsed.posts, source: 'ai' });
          }
        } else {
          console.error('Anthropic generate error:', res.status, await res.text());
        }
      } catch (err) {
        console.error('AI generation failed, fallback:', err);
      }
    }

    return NextResponse.json({ posts: fallback(profile, plan), source: 'fallback' });
  } catch (err) {
    console.error('Erreur génération semaine:', err);
    return NextResponse.json({ error: 'Erreur lors de la génération' }, { status: 500 });
  }
}
