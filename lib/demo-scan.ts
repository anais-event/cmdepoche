/**
 * Mock demo scan — will be replaced by real Instagram API calls later.
 * Keep this file as the single source of demo data.
 */

export interface DemoScanResult {
  handle: string;
  displayName: string;
  followers: number;
  following: number;
  postsCount: number;
  bio: string;
  palette: string[];
  topics: string[];
  postingFrequency: string;
  topContent: {
    format: string;
    caption: string;
    likes: number;
    comments: number;
  };
  observations: string[];
  opportunities: string[];
}

const MOCK_PROFILES: Record<string, DemoScanResult> = {
  default: {
    handle: '',
    displayName: '',
    followers: 8420,
    following: 512,
    postsCount: 347,
    bio: 'Artisan · Créations uniques · Fait main en France',
    palette: ['#C4956A', '#8FA37A', '#E8D5C4', '#2D2A26', '#F5EDE6'],
    topics: ['Coulisses', 'Conseils', 'Produits'],
    postingFrequency: '1,7 publication / semaine',
    topContent: {
      format: 'Carrousel',
      caption: 'Les 3 étapes de fabrication de A à Z — vous ne devinerez pas la dernière',
      likes: 342,
      comments: 28,
    },
    observations: [
      'Ton compte parle principalement de créations artisanales.',
      'Tes contenus "coulisses" génèrent 2× plus d\'engagement que les posts produits.',
    ],
    opportunities: [
      'Publier plus régulièrement : passer à 3 posts/semaine pourrait doubler ta visibilité.',
      'Utiliser davantage le format Reel : tes vidéos ont un potentiel inexploité.',
    ],
  },
};

export function runDemoScan(handle: string): DemoScanResult {
  const clean = handle.replace(/^@/, '').trim().toLowerCase();

  const profile = MOCK_PROFILES[clean] ?? MOCK_PROFILES.default;

  return {
    ...profile,
    handle: clean,
    displayName: clean.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export const SCAN_STEPS = [
  'Compte trouvé',
  'Profil analysé',
  'Bio analysée',
  'Contenus analysés',
  'Univers visuel identifié',
  'Thèmes identifiés',
] as const;
