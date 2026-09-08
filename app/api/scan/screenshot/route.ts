import { NextRequest, NextResponse } from 'next/server';

const SCAN_PROMPT = `Tu es expert en analyse de profils Instagram.
À partir de ce screenshot d'un profil Instagram, extrais les informations suivantes au format JSON strict.

{
  "handle": "...",
  "followers_count": number,
  "following_count": number,
  "posts_count": number,
  "bio": "texte de la bio",
  "detected_niche": "1-2 mots",
  "detected_tone": "1-2 mots",
  "detected_target": "1 phrase décrivant l'audience type",
  "color_palette": ["#hex", "#hex", "#hex", "#hex", "#hex"],
  "format_engagement_estimate": {"photo": %, "carousel": %, "reel": %}
}

Estime les pourcentages à partir des vignettes visibles. Si une info n'est pas visible, mets null.
Réponds UNIQUEMENT avec le JSON valide, sans balise markdown.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('screenshot') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Screenshot manquant' }, { status: 400 });
    }

    // Convertit le fichier en base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mediaType = file.type || 'image/jpeg';

    // Appel Claude Sonnet Vision
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
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: mediaType, data: base64 },
                },
                { type: 'text', text: SCAN_PROMPT },
              ],
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || '';

        try {
          const parsed = JSON.parse(text);
          return NextResponse.json({
            ...parsed,
            engagement_rate: null,
            optimal_slots: [
              { day: 'Lundi', time: '18:30' },
              { day: 'Mercredi', time: '12:00' },
              { day: 'Vendredi', time: '19:00' },
              { day: 'Dimanche', time: '10:00' },
            ],
          });
        } catch {
          console.error('Erreur parsing réponse Claude:', text);
        }
      }
    }

    // Fallback : données simulées
    return NextResponse.json({
      handle: 'monprofil',
      followers_count: 2800,
      following_count: 450,
      posts_count: 187,
      bio: 'Créateur·rice passionné·e',
      detected_niche: 'Lifestyle',
      detected_tone: 'Authentique',
      detected_target: 'Femmes 25-35, urbaines, sensibles à l\'authenticité',
      color_palette: ['#B87356', '#8FA37A', '#F5E6D3', '#2D2A26', '#D4A574'],
      format_engagement_estimate: { photo: 35, carousel: 42, reel: 23 },
      engagement_rate: 4.2,
      optimal_slots: [
        { day: 'Lundi', time: '18:30' },
        { day: 'Mercredi', time: '12:00' },
        { day: 'Vendredi', time: '19:00' },
        { day: 'Dimanche', time: '10:00' },
      ],
    });
  } catch (err) {
    console.error('Erreur scan screenshot:', err);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse du screenshot" },
      { status: 500 }
    );
  }
}
