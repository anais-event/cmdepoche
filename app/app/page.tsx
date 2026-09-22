'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

import { useState, useEffect } from 'react';

const SCR = { SPLASH: 0, ANALYSIS: 1, FORM: 2, RECOS: 3, VISUALS: 4, PLANNING: 5, DETAIL: 6, VALIDATED: 7 };

const T = { bg: 'var(--cm-bg)', card: 'var(--cm-card)', text: 'var(--cm-text)', sub: 'var(--cm-sub)', muted: 'var(--cm-muted)', border: 'var(--cm-border)', borderL: 'var(--cm-border-l)', terraBg: 'var(--cm-terra-bg)', sageBg: 'var(--cm-sage-bg)' };
const TERRA = '#B87356';
const SAGE = '#8FA37A';
const RED = '#C25E4A';

const img = (seed: string, s = 200) => `https://picsum.photos/seed/${seed}/${s}/${s}`;
const imgR = (seed: string, w = 400, h = 500) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const feedImgs = ['forest', 'beach', 'cafe', 'mountain', 'sunset', 'portrait', 'city', 'flowers', 'lake'];

const fmtCount = (n: any) => {
  if (n == null || isNaN(Number(n))) return null;
  const v = Number(n);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (v >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(v);
};
const dayAbbr: any = { Lundi: 'Lun', Mardi: 'Mar', Mercredi: 'Mer', Jeudi: 'Jeu', Vendredi: 'Ven', Samedi: 'Sam', Dimanche: 'Dim' };
const fmtSlot = (s: any) => `${dayAbbr[s.day] || s.day} ${String(s.time).replace(':', 'h')}`;

const CREDIT_COST: any = { Photo: 1, Carrousel: 2, Reel: 3 };
const FORMAT_NEEDS: any = {
  Photo: { type: 'photo', label: '1 photo', minPhotos: 1, minVideos: 0 },
  Carrousel: { type: 'photo', label: '3+ photos', minPhotos: 3, minVideos: 0 },
  Reel: { type: 'video', label: '1 vidéo', minPhotos: 0, minVideos: 1 },
};

const photoSets: any = {
  google: [
    { id: 'g1', seed: 'golden', label: 'Sunset.jpg', type: 'photo' },
    { id: 'g2', seed: 'hiking', label: 'Rando.jpg', type: 'photo' },
    { id: 'g3', seed: 'latteart', label: 'Cafe.jpg', type: 'photo' },
    { id: 'g4', seed: 'selfie', label: 'Portrait.jpg', type: 'photo' },
    { id: 'g5', seed: 'waves', label: 'Plage.mp4', type: 'video' },
    { id: 'g6', seed: 'skyline', label: 'City.jpg', type: 'photo' },
    { id: 'g7', seed: 'pasta', label: 'Food.jpg', type: 'photo' },
    { id: 'g8', seed: 'timelapse', label: 'Reel_1.mp4', type: 'video' },
    { id: 'g9', seed: 'fern', label: 'Nature.jpg', type: 'photo' },
  ],
  pellicule: [
    { id: 'p1', seed: 'roadtrip', label: 'IMG_4521.jpg', type: 'photo' },
    { id: 'p2', seed: 'camping', label: 'IMG_4522.jpg', type: 'photo' },
    { id: 'p3', seed: 'waterfall', label: 'VID_4523.mp4', type: 'video' },
    { id: 'p4', seed: 'vineyard', label: 'IMG_4524.jpg', type: 'photo' },
    { id: 'p5', seed: 'lavender', label: 'IMG_4525.jpg', type: 'photo' },
    { id: 'p6', seed: 'cottage', label: 'IMG_4526.jpg', type: 'photo' },
  ],
  importer: [
    { id: 'i1', seed: 'product1', label: 'hero_banner.png', type: 'photo' },
    { id: 'i2', seed: 'flatlay', label: 'product_shot.jpg', type: 'photo' },
    { id: 'i3', seed: 'bts', label: 'behind_scenes.mp4', type: 'video' },
    { id: 'i4', seed: 'collab', label: 'collab_draft.jpg', type: 'photo' },
  ],
};

const nicheOptions = [
  { id: 'voyage', label: 'Voyage & Aventure' },
  { id: 'food', label: 'Food & Cuisine' },
  { id: 'mode', label: 'Mode & Beauté' },
  { id: 'sport', label: 'Sport & Bien-être' },
  { id: 'business', label: 'Business & Entrepreneuriat' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'tech', label: 'Tech & Digital' },
  { id: 'art', label: 'Art & Créativité' },
  { id: 'parent', label: 'Parentalité' },
  { id: 'immo', label: 'Immobilier' },
];

const objectifOptions = [
  { id: 'commu', icon: '👥', label: 'Créer une communauté', desc: 'Fédérer une audience engagée autour de tes valeurs' },
  { id: 'vendre', icon: '💰', label: 'Vendre un produit ou service', desc: 'Générer des leads et convertir via ton contenu' },
  { id: 'visibilite', icon: '🔍', label: 'Gagner en visibilité', desc: 'Augmenter ta portée et attirer de nouveaux abonnés' },
];

const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
const genderOptions = ['Femmes', 'Hommes', 'Mixte'];
const profilOptions = ['Employés / salariés', 'Entrepreneurs / indépendants', 'Étudiants', 'Parents au foyer', 'Mixte / tous profils'];
const pageTypeOptions = [
  { id: 'metier', label: 'Mon métier', desc: 'Mon activité professionnelle' },
  { id: 'loisir', label: 'Un loisir / une passion', desc: "Je partage ce que j'aime faire" },
  { id: 'perso', label: 'Ma vie perso / lifestyle', desc: 'Je partage mon quotidien et mes valeurs' },
  { id: 'marque', label: 'Ma marque / mon business', desc: 'Je vends un produit ou un service' },
];

const fmts = ['Photo', 'Carrousel', 'Reel'];

const trendsByNiche: any = {
  voyage: {
    hashtags: [{ tag: '#voyagefrance', vol: '2.1M', trend: '+34%' }, { tag: '#microaventure', vol: '890K', trend: '+67%' }, { tag: '#vanlife', vol: '4.2M', trend: '+12%' }, { tag: '#roadtripeurope', vol: '1.3M', trend: '+45%' }, { tag: '#slowtravel', vol: '620K', trend: '+89%' }],
    audios: [{ name: 'Chill Vibes — Lofi Mix', uses: '340K cette semaine' }, { name: 'Original — bruit de vagues', uses: '890K cette semaine' }, { name: 'Trending — drone reveal', uses: '1.2M cette semaine' }],
    pillars: [{ name: 'Itinéraires & bons plans', pct: 35 }, { name: 'Coulisses du voyage', pct: 25 }, { name: 'Tips & astuces terrain', pct: 20 }, { name: 'Paysages & ambiance', pct: 20 }],
    formatMix: { Photo: 25, Carrousel: 35, Reel: 40 },
  },
  food: {
    hashtags: [{ tag: '#recettefacile', vol: '3.8M', trend: '+28%' }, { tag: '#foodporn', vol: '12M', trend: '+5%' }, { tag: '#cuisinemaison', vol: '1.7M', trend: '+52%' }, { tag: '#batchcooking', vol: '920K', trend: '+41%' }, { tag: '#streetfood', vol: '5.1M', trend: '+18%' }],
    audios: [{ name: 'ASMR cuisine — couteau + plancha', uses: '1.8M cette semaine' }, { name: 'Original — recette en 30s', uses: '2.1M cette semaine' }, { name: 'Trending — taste test reaction', uses: '950K cette semaine' }],
    pillars: [{ name: 'Recettes pas à pas', pct: 40 }, { name: 'Food reviews & tests', pct: 20 }, { name: 'Tips cuisine & organisation', pct: 20 }, { name: 'Behind the scenes', pct: 20 }],
    formatMix: { Photo: 20, Carrousel: 30, Reel: 50 },
  },
  mode: {
    hashtags: [{ tag: '#ootd', vol: '8.5M', trend: '+8%' }, { tag: '#modedurable', vol: '1.2M', trend: '+73%' }, { tag: '#lookdujour', vol: '2.3M', trend: '+22%' }, { tag: '#secondemain', vol: '890K', trend: '+61%' }, { tag: '#styleinspo', vol: '4.7M', trend: '+15%' }],
    audios: [{ name: 'Get Ready With Me — remix', uses: '3.2M cette semaine' }, { name: 'Trending — outfit transition', uses: '2.8M cette semaine' }, { name: 'Original — haul debrief', uses: '1.1M cette semaine' }],
    pillars: [{ name: 'Looks & inspirations', pct: 35 }, { name: 'Hauls & revues', pct: 25 }, { name: 'Tips style & morpho', pct: 20 }, { name: 'Coulisses & lifestyle', pct: 20 }],
    formatMix: { Photo: 30, Carrousel: 25, Reel: 45 },
  },
  default: {
    hashtags: [{ tag: '#contenucreateur', vol: '1.5M', trend: '+38%' }, { tag: '#communaute', vol: '2.1M', trend: '+22%' }, { tag: '#authentic', vol: '3.8M', trend: '+15%' }, { tag: '#growthmindset', vol: '1.9M', trend: '+31%' }, { tag: '#dailyinspo', vol: '4.2M', trend: '+12%' }],
    audios: [{ name: 'Trending — voiceover storytelling', uses: '1.5M cette semaine' }, { name: 'Original — talking head tips', uses: '2.3M cette semaine' }, { name: 'Chill — lo-fi background', uses: '890K cette semaine' }],
    pillars: [{ name: 'Contenu éducatif', pct: 35 }, { name: 'Behind the scenes', pct: 25 }, { name: 'Témoignages & preuves', pct: 20 }, { name: 'Engagement & questions', pct: 20 }],
    formatMix: { Photo: 30, Carrousel: 30, Reel: 40 },
  },
};

function getTrends(niches: any[]) {
  const primary = niches[0] || 'default';
  return trendsByNiche[primary] || trendsByNiche.default;
}

// ── Components ──

function Card({ children, style = {}, animate = false }: any) {
  return <div style={{ background: T.card, borderRadius: 20, padding: 18, border: '1px solid ' + T.border, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', ...(animate ? { animation: 'cmFadeUp 0.35s ease both' } : {}), ...style }}>{children}</div>;
}

function SBar({ label, value }: any) {
  const c = value > 90 ? SAGE : value > 80 ? TERRA : RED;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: T.sub, width: 70, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: T.borderL, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: value + '%', height: '100%', background: c, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: c, width: 32, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

function FeedGrid({ seeds }: any) {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid ' + T.border }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: T.card, borderBottom: '1px solid ' + T.borderL }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,' + TERRA + ',' + SAGE + ')' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>ton_feed</span>
        <span style={{ fontSize: 11, color: T.muted, marginLeft: 'auto' }}>Aperçu</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: T.borderL }}>
        {seeds.slice(0, 9).map((seed: string, i: number) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
            <img src={img(seed, 200)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e: any) => { e.target.style.background = 'linear-gradient(135deg,#D4A088,#B5C5A5)'; e.target.style.minHeight = '100%'; }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({ label, selected, onClick, disabled }: any) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
      border: selected ? '1.5px solid ' + TERRA : '1.5px solid var(--cm-border)',
      background: selected ? T.terraBg : T.card,
      color: selected ? TERRA : T.sub, transition: 'all 0.15s',
    }}>{label}</button>
  );
}

function ProgressDots({ current, total }: any) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 24 : 8, height: 8, borderRadius: 4,
          background: i < current ? SAGE : i === current ? TERRA : 'var(--cm-border)',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  );
}

function CreditBadge({ cost }: any) {
  const colors: any = { 1: SAGE, 2: TERRA, 3: RED };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: colors[cost] || TERRA, background: (colors[cost] || TERRA) + '18', padding: '3px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>
      {cost} credit{cost > 1 ? 's' : ''}
    </span>
  );
}

function FormatBadge({ format, small }: any) {
  const icons: any = { Photo: '📷', Carrousel: '📑', Reel: '🎬' };
  const s = small ? 10 : 11;
  return (
    <span style={{ fontSize: s, fontWeight: 600, color: TERRA, background: T.terraBg, padding: small ? '2px 6px' : '3px 10px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {icons[format]} {format}
    </span>
  );
}

function MediaTypeBadge({ type }: any) {
  return (
    <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 9, fontWeight: 700, color: '#fff', background: type === 'video' ? 'rgba(194,94,74,0.85)' : 'rgba(143,163,122,0.85)', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>{type === 'video' ? 'Vidéo' : 'Photo'}</span>
  );
}

const appS: any = { maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: T.bg, color: T.text, fontFamily: "'Inter',-apple-system,system-ui,sans-serif", position: 'relative' };
const cin: any = { fontFamily: "'Cinzel',serif" };
const lblS: any = { fontSize: 11, color: T.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, display: 'block', marginBottom: 8 };
const inpS: any = { width: '100%', padding: '14px 16px', background: T.card, border: '1px solid var(--cm-border)', borderRadius: 16, color: 'var(--cm-text)', fontSize: 16, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
function btnS(on: boolean, color = TERRA): any { return { width: '100%', padding: '16px', borderRadius: 100, border: 'none', background: on ? color : 'var(--cm-border)', color: on ? '#fff' : 'var(--cm-muted)', fontSize: 16, fontWeight: 600, cursor: on ? 'pointer' : 'default', letterSpacing: 0.3, transition: 'all 0.2s' }; }

function App() {
  const [scr, setScr] = useState<number>(SCR.SPLASH);
  const [fade, setFade] = useState(true);
  const [handle, setHandle] = useState('');
  const [screenshot, setScreenshot] = useState<any>(null);
  const [azing, setAzing] = useState(false);
  const [aStep, setAStep] = useState(0);
  const [aDone, setADone] = useState(false);
  const [trendScan, setTrendScan] = useState(false);
  const [trendDone, setTrendDone] = useState(false);
  const [trendStep, setTrendStep] = useState(0);
  const [scanData, setScanData] = useState<any>(null);

  const [formDA, setFormDA] = useState<any>({ prenom: '', nom: '', niches: [], particularite: '', objectifs: [], ages: [], gender: '', profil: '', pageType: '', tonMarque: '', autresReseaux: '', siteWeb: '' });
  const updateDA = (k: string, v: any) => setFormDA((prev: any) => ({ ...prev, [k]: v }));
  const toggleArr = (k: string, v: any) => setFormDA((prev: any) => ({ ...prev, [k]: prev[k].includes(v) ? prev[k].filter((x: any) => x !== v) : [...prev[k], v] }));

  const [pSrc, setPSrc] = useState('google');
  const [selPhotos, setSelPhotos] = useState<any[]>([]);
  const [postCount, setPostCount] = useState(3);
  const [gen, setGen] = useState(false);
  const [genP, setGenP] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [pStates, setPStates] = useState<any[]>([]);
  const [dIdx, setDIdx] = useState(0);
  const [showSc, setShowSc] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [rejectChoices, setRejectChoices] = useState<any[]>([]);

  const go = (s: number) => { setFade(false); setTimeout(() => { setScr(s); setFade(true); window.scrollTo(0, 0); }, 180); };
  useEffect(() => { if (scr === SCR.SPLASH) setTimeout(() => go(SCR.ANALYSIS), 2200); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const curPhotos = photoSets[pSrc] || [];
  const selC = selPhotos.length;
  const appC = pStates.filter((s) => s === 'approved').length;

  const selMedia = selPhotos.map((id) => {
    for (const src of Object.values(photoSets) as any[]) { const f = src.find((x: any) => x.id === id); if (f) return f; }
    return null;
  }).filter(Boolean);
  const photoCount = selMedia.filter((m: any) => m.type === 'photo').length;
  const videoCount = selMedia.filter((m: any) => m.type === 'video').length;

  const canPhoto = photoCount >= 1;
  const canCarrousel = photoCount >= 3;
  const canReel = videoCount >= 1;

  const startAnalysis = () => {
    setAzing(true); setAStep(0);

    // Lance le scan réel en parallèle de l'animation
    const scanReq = (async () => {
      try {
        let res: Response;
        if (screenshot && !handle) {
          const blob = await (await fetch(screenshot)).blob();
          const fd = new FormData();
          fd.append('screenshot', blob, 'profile.jpg');
          res = await fetch('/api/scan/screenshot', { method: 'POST', body: fd });
        } else {
          res = await fetch('/api/scan/handle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ handle: handle.replace('@', '').trim() }),
          });
        }
        if (!res.ok) throw new Error('scan_failed');
        const data = await res.json();
        setScanData(data);
        return true;
      } catch {
        setScanData(null);
        return false;
      }
    })();

    let s = 0;
    const iv = setInterval(() => {
      s++; setAStep(s);
      if (s >= 5) {
        clearInterval(iv);
        // N'affiche le résultat qu'une fois le scan terminé
        scanReq.finally(() => setTimeout(() => { setAzing(false); setADone(true); }, 400));
      }
    }, 800);
  };

  const startTrendScan = () => {
    setTrendScan(true); setTrendStep(0); setTrendDone(false); let s = 0;
    const iv = setInterval(() => { s++; setTrendStep(s); if (s >= 4) { clearInterval(iv); setTimeout(() => { setTrendScan(false); setTrendDone(true); }, 500); } }, 900);
  };

  // Construit le planning (créneaux + format + visuel) — la logique format/média
  // reste locale car elle dépend des visuels sélectionnés dans l'artefact.
  const buildPlan = () => {
    const photos = selMedia.filter((m: any) => m.type === 'photo');
    const videos = selMedia.filter((m: any) => m.type === 'video');

    const slots3 = [
      { day: 'Lundi', time: '18:30' },
      { day: 'Mercredi', time: '12:15' },
      { day: 'Vendredi', time: '19:00' },
    ];
    const slots5 = [
      { day: 'Lundi', time: '18:30' },
      { day: 'Mardi', time: '07:45' },
      { day: 'Mercredi', time: '12:15' },
      { day: 'Vendredi', time: '19:00' },
      { day: 'Samedi', time: '10:00' },
    ];
    const slots = postCount === 5 ? slots5 : slots3;

    let usedVideos = 0;
    let usedPhotos = 0;
    return slots.map((slot, i) => {
      let format, mediaItem;
      if (usedVideos < videos.length && (i === 0 || i === slots.length - 1 || (postCount === 5 && i === 3))) {
        format = 'Reel';
        mediaItem = videos[usedVideos];
        usedVideos++;
      } else if (usedPhotos + 3 <= photos.length && i === Math.floor(slots.length / 2)) {
        format = 'Carrousel';
        mediaItem = photos[usedPhotos];
        usedPhotos++;
      } else {
        format = 'Photo';
        mediaItem = photos[usedPhotos % Math.max(photos.length, 1)];
        usedPhotos++;
      }
      return { ...slot, format, media: mediaItem, credits: CREDIT_COST[format] };
    });
  };

  // Assemble le planning local + le contenu réel (accroche + légende + hashtags)
  // généré par l'IA à partir des données du scan et de la DA.
  const assemblePosts = (plan: any[], aiPosts: any[]) => {
    const norm = (h: string) => (h.startsWith('#') ? h : '#' + h.replace(/^#+/, ''));
    return plan.map((slot, i) => {
      const ai = aiPosts[i] || {};
      const sd = ai.scoreDetails || {};
      return {
        ...slot,
        caption: ai.caption || '',
        hook: ai.hook || '',
        hashtags: Array.isArray(ai.hashtags) ? ai.hashtags.map(norm) : [],
        score: ai.score || 85 + Math.floor(Math.random() * 13),
        scoreDetails: {
          horaire: sd.horaire ?? 80 + Math.floor(Math.random() * 18),
          legende: sd.legende ?? 82 + Math.floor(Math.random() * 16),
          hashtags: sd.hashtags ?? 80 + Math.floor(Math.random() * 18),
          visuel: sd.visuel ?? 85 + Math.floor(Math.random() * 13),
        },
      };
    });
  };

  const genProfile = () => {
    const d = scanData || {};
    const objLabel = objectifOptions.filter((o) => formDA.objectifs.includes(o.id)).map((o) => o.label).join(', ');
    const nicheLabel = formDA.niches.map((id: string) => nicheOptions.find((n) => n.id === id)?.label).filter(Boolean).join(', ');
    const targetParts = [formDA.ages.join('/'), formDA.gender, formDA.profil].filter(Boolean).join(' · ');
    return {
      handle: handle.replace('@', '').trim() || d.handle,
      prenom: formDA.prenom,
      niche: nicheLabel || d.detected_niche,
      particularite: formDA.particularite,
      tone: formDA.tonMarque || d.detected_tone,
      target: targetParts || d.detected_target,
      objective: objLabel,
      pageType: pageTypeOptions.find((pt) => pt.id === formDA.pageType)?.label,
      bio: d.bio,
      followers_count: d.followers_count ?? null,
    };
  };

  const startGen = () => {
    setGen(true); setGenP(0);
    const plan = buildPlan();

    const genReq = (async () => {
      try {
        const planPayload = plan.map((p: any) => ({
          day: p.day, time: p.time, format: p.format,
          visual: p.media ? { label: p.media.label, type: p.media.type } : null,
        }));
        const res = await fetch('/api/generate/week', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: genProfile(), plan: planPayload }),
        });
        if (!res.ok) throw new Error('gen_failed');
        const data = await res.json();
        return assemblePosts(plan, data.posts || []);
      } catch {
        return assemblePosts(plan, []);
      }
    })();

    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 8;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        genReq.then((result) => {
          setPosts(result);
          setPStates(new Array(result.length).fill(null));
          setTimeout(() => { setGen(false); go(SCR.PLANNING); }, 400);
        });
      }
      setGenP(Math.min(p, 100));
    }, 350);
  };

  const regenPost = async (idx: number, changes: any[]) => {
    const old = posts[idx];
    const newPost = { ...old };
    if (changes.includes('photo')) {
      const available = selMedia.filter((m: any) => m.id !== old.media?.id);
      if (available.length) newPost.media = available[Math.floor(Math.random() * available.length)];
    }
    if (changes.includes('format')) {
      const mType = newPost.media?.type || 'photo';
      if (mType === 'video' && newPost.format !== 'Reel') { newPost.format = 'Reel'; newPost.credits = 3; }
      else if (mType === 'photo' && newPost.format === 'Photo' && photoCount >= 3) { newPost.format = 'Carrousel'; newPost.credits = 2; }
      else if (mType === 'photo' && newPost.format === 'Carrousel') { newPost.format = 'Photo'; newPost.credits = 1; }
    }

    // Régénération du texte par la vraie IA (légende et/ou CTA)
    const wantsText = changes.includes('legende') || changes.includes('cta');
    if (wantsText) {
      const norm = (h: string) => (h.startsWith('#') ? h : '#' + h.replace(/^#+/, ''));
      try {
        const res = await fetch('/api/generate/week', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: genProfile(),
            plan: [{ day: newPost.day, time: newPost.time, format: newPost.format, visual: newPost.media ? { label: newPost.media.label, type: newPost.media.type } : null }],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const ai = (data.posts || [])[0];
          if (ai) {
            newPost.caption = ai.caption || newPost.caption;
            newPost.hook = ai.hook || newPost.hook;
            if (Array.isArray(ai.hashtags) && ai.hashtags.length) newPost.hashtags = ai.hashtags.map(norm);
          }
        }
      } catch { /* garde la légende actuelle si l'IA échoue */ }
    }

    newPost.score = 85 + Math.floor(Math.random() * 13);
    newPost.scoreDetails = { horaire: 80 + Math.floor(Math.random() * 18), legende: 82 + Math.floor(Math.random() * 16), hashtags: 80 + Math.floor(Math.random() * 18), visuel: 85 + Math.floor(Math.random() * 13) };
    const n = [...posts]; n[idx] = newPost; setPosts(n);
    const ns = [...pStates]; ns[idx] = null; setPStates(ns);
    setShowReject(false); setRejectChoices([]);
  };

  const totalCredits = posts.reduce((s, p) => s + p.credits, 0);
  const formValid = formDA.prenom && formDA.niches.length > 0 && formDA.objectifs.length > 0 && formDA.ages.length > 0 && formDA.gender && formDA.pageType;
  const trends = getTrends(formDA.niches);

  const fs: any = { opacity: fade ? 1 : 0, transition: 'opacity 0.18s ease', minHeight: '100vh' };

  // ─── SPLASH ─────
  if (scr === SCR.SPLASH) return (
    <div style={appS}>
      <div style={{ ...fs, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 14 }}>
        <div style={{ width: 76, height: 76, borderRadius: 22, background: 'linear-gradient(135deg,' + TERRA + ',' + SAGE + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#fff' }}>{'✦'}</div>
        <div style={{ ...cin, fontSize: 30, fontWeight: 700, letterSpacing: 1, color: T.text }}>CM de Poche</div>
        <div style={{ fontSize: 14, color: T.sub }}>Ton contenu. Ton style. Autopilot.</div>
        <div style={{ marginTop: 20, width: 28, height: 28, border: '2px solid var(--cm-border)', borderTopColor: TERRA, borderRadius: '50%', animation: 'cmSpin 0.8s linear infinite' }} />
      </div>
    </div>
  );

  // ─── 1. ACCUEIL + ANALYSE ─────
  if (scr === SCR.ANALYSIS) {
    const steps = ['Scan de @' + (handle || 'ton_compte') + '…', 'Détection de ta palette visuelle…', 'Analyse de ton ton éditorial…', 'Calcul de tes créneaux optimaux…', "Génération de l'aperçu…"];
    const d = scanData || {};
    const pal = (Array.isArray(d.color_palette) && d.color_palette.length) ? d.color_palette : ['#B87356', '#D4A088', '#8FA37A', '#B5C5A5', '#E8DDD0'];
    const detected = [
      { label: 'Abonnés', value: fmtCount(d.followers_count) || '3.2K' },
      { label: "Taux d'engagement", value: d.engagement_rate != null ? d.engagement_rate + '%' : '5.8%' },
      { label: 'Fréquence actuelle', value: '2.1 posts/sem' },
      { label: 'Ton détecté', value: d.detected_tone || 'Inspirant, personnel' },
      { label: 'Niche', value: d.detected_niche || 'Voyage & Nature' },
    ];
    return (
      <div style={appS}><div style={{ ...fs, padding: '56px 24px 24px' }}>
        <ProgressDots current={0} total={7} />
        {!azing && !aDone && (<div>
          <h1 style={{ ...cin, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: T.text }}>Bienvenue sur CM de Poche</h1>
          <p style={{ color: T.sub, fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>Donne-moi ton pseudo Instagram ou envoie un screenshot de ta page.</p>

          <div style={{ fontSize: 13, color: T.sub, fontWeight: 500, marginBottom: 8 }}>Ton compte Instagram</div>
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: T.muted, fontSize: 16 }}>@</span>
            <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="ton_compte" style={{ ...inpS, paddingLeft: 36 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--cm-border)' }} />
            <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'var(--cm-border)' }} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, color: T.sub, fontWeight: 500, marginBottom: 8 }}>Screenshot de ta page Instagram</div>
            {screenshot ? (
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '2px solid ' + TERRA }}>
                <img src={screenshot} alt="Screenshot" style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
                <button onClick={() => setScreenshot(null)} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'✕'}</button>
                <div style={{ position: 'absolute', bottom: 8, left: 8, background: TERRA, color: '#fff', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>Screenshot importé ✓</div>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '28px 16px', borderRadius: 16, border: '2px dashed var(--cm-border)', cursor: 'pointer', background: T.card, transition: 'border-color 0.2s' }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: T.terraBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{'📱'}</div>
                <span style={{ fontSize: 14, fontWeight: 500, color: T.sub }}>Importer un screenshot</span>
                <span style={{ fontSize: 12, color: T.muted }}>JPG, PNG — depuis ta pellicule</span>
                <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev: any) => setScreenshot(ev.target.result); r.readAsDataURL(f); } }} />
              </label>
            )}
          </div>

          <button onClick={() => startAnalysis()} style={btnS(handle.length > 0 || !!screenshot)}>{'Analyser mon univers →'}</button>
        </div>)}
        {azing && (<div>
          <h1 style={{ ...cin, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: T.text }}>Analyse en cours</h1>
          <p style={{ color: T.sub, fontSize: 14, margin: '0 0 28px' }}>Je scanne ton feed et je détecte tout.</p>
          <div style={{ marginTop: 16 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, opacity: aStep >= i ? 1 : 0.25, transition: 'opacity 0.4s' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: aStep > i ? SAGE : aStep === i ? TERRA : 'var(--cm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0, transition: 'background 0.3s' }}>{aStep > i ? '✓' : (i + 1)}</div>
                <span style={{ fontSize: 14, color: aStep >= i ? T.text : T.muted }}>{s}</span>
              </div>
            ))}
          </div>
        </div>)}
        {aDone && (<div>
          <h1 style={{ ...cin, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: T.text }}>Ton univers</h1>
          <p style={{ color: T.sub, fontSize: 14, margin: '0 0 20px' }}>Voilà ce que j'ai détecté sur @{handle || 'ton_compte'}.</p>
          <Card style={{ marginBottom: 14 }} animate>
            <div style={lblS}>Profil détecté</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {detected.map((d, i) => (<div key={d.label} style={{ width: '50%', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--cm-border-l)' : 'none' }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>{d.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{d.value}</div>
              </div>))}
            </div>
          </Card>
          <Card style={{ marginBottom: 14 }} animate>
            <div style={lblS}>Palette visuelle</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>{pal.map((c: string, i: number) => (<div key={i} style={{ flex: 1, height: 42, borderRadius: 12, background: c }} />))}</div>
            <p style={{ fontSize: 12, color: T.sub, margin: 0 }}>Tons chauds, terreux, accents verts.</p>
          </Card>
          <Card style={{ marginBottom: 14 }} animate>
            <div style={lblS}>Formats qui marchent</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              {(() => { const fe = d.format_engagement_estimate; return [
                { f: 'Carrousel', p: (fe?.carousel != null ? fe.carousel : 42) + '%', c: TERRA },
                { f: 'Photo', p: (fe?.photo != null ? fe.photo : 35) + '%', c: SAGE },
                { f: 'Reel', p: (fe?.reel != null ? fe.reel : 23) + '%', c: '#D4A088' },
              ]; })().map((x) => (
                <div key={x.f} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: x.c }}>{x.p}</div>
                  <div style={{ fontSize: 12, color: T.sub }}>{x.f}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(Array.isArray(d.optimal_slots) && d.optimal_slots.length ? d.optimal_slots.map(fmtSlot) : ['Lun 18h-19h', 'Mer 12h-13h', 'Ven 19h-20h', 'Dim 10h-11h']).map((t: string) => (
                <span key={t} style={{ background: T.terraBg, color: TERRA, padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </Card>
          <div style={{ marginBottom: 14 }}>
            <div style={lblS}>Ton feed actuel</div>
            <FeedGrid seeds={feedImgs} />
          </div>
          <button onClick={() => go(SCR.FORM)} style={btnS(true)}>{"C'est bien moi, on continue →"}</button>
        </div>)}
      </div></div>
    );
  }

  // ─── 2. FORMULAIRE DA ─────
  if (scr === SCR.FORM) return (
    <div style={appS}><div style={{ ...fs, padding: '56px 24px 24px' }}>
      <ProgressDots current={1} total={7} />
      <button onClick={() => go(SCR.ANALYSIS)} style={{ background: 'none', border: 'none', color: T.sub, fontSize: 14, cursor: 'pointer', marginBottom: 16, padding: 0 }}>{'← Retour'}</button>
      <h1 style={{ ...cin, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: T.text }}>Ta direction artistique</h1>
      <p style={{ color: T.sub, fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>Plus je te connais, meilleur sera le contenu.</p>

      <Card style={{ marginBottom: 16 }}>
        <div style={lblS}>Ton identité</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: T.sub, marginBottom: 6 }}>Prénom *</div>
            <input value={formDA.prenom} onChange={(e) => updateDA('prenom', e.target.value)} placeholder="Marie" style={inpS} /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: T.sub, marginBottom: 6 }}>Nom</div>
            <input value={formDA.nom} onChange={(e) => updateDA('nom', e.target.value)} placeholder="Dupont" style={inpS} /></div>
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={lblS}>Ta niche (1 à 3 max)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {nicheOptions.map((n) => (<Chip key={n.id} label={n.label} selected={formDA.niches.includes(n.id)}
            disabled={!formDA.niches.includes(n.id) && formDA.niches.length >= 3}
            onClick={() => toggleArr('niches', n.id)} />))}
        </div>
        <div style={{ fontSize: 12, color: T.sub, marginBottom: 6 }}>Ta particularité / ton angle</div>
        <input value={formDA.particularite} onChange={(e) => updateDA('particularite', e.target.value)} placeholder="Ex : sportifs, amoureux de la nature, investisseurs débutants…" style={inpS} />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={lblS}>Tes objectifs</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {objectifOptions.map((o) => { const sel = formDA.objectifs.includes(o.id); return (
            <div key={o.id} onClick={() => toggleArr('objectifs', o.id)} style={{ border: sel ? '1.5px solid ' + TERRA : '1.5px solid var(--cm-border)', background: sel ? T.terraBg : T.card, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: sel ? TERRA + '18' : T.borderL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{o.icon}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: sel ? TERRA : T.text }}>{o.label}</div>
                <div style={{ fontSize: 12, color: T.sub }}>{o.desc}</div></div>
              {sel && <div style={{ color: TERRA, fontSize: 16 }}>{'✓'}</div>}
            </div>
          ); })}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={lblS}>Ta cible</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 8 }}>Tranches d'age</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{ageRanges.map((a) => (<Chip key={a} label={a} selected={formDA.ages.includes(a)} onClick={() => toggleArr('ages', a)} />))}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 8 }}>Genre principal</div>
          <div style={{ display: 'flex', gap: 8 }}>{genderOptions.map((g) => (<Chip key={g} label={g} selected={formDA.gender === g} onClick={() => updateDA('gender', g)} />))}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 8 }}>Profil type</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{profilOptions.map((p) => (<Chip key={p} label={p} selected={formDA.profil === p} onClick={() => updateDA('profil', p)} />))}</div>
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={lblS}>Ton univers en ligne</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 6 }}>Ton de ta marque / ta communication</div>
          <input value={formDA.tonMarque} onChange={(e) => updateDA('tonMarque', e.target.value)} placeholder="Ex : inspirant, décalé, expert, chaleureux…" style={inpS} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 6 }}>Tes autres réseaux sociaux</div>
          <input value={formDA.autresReseaux} onChange={(e) => updateDA('autresReseaux', e.target.value)} placeholder="Ex : TikTok, YouTube, LinkedIn…" style={inpS} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: T.sub, marginBottom: 6 }}>Ton site web</div>
          <input value={formDA.siteWeb} onChange={(e) => updateDA('siteWeb', e.target.value)} placeholder="https://www.monsite.fr" style={inpS} />
        </div>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <div style={lblS}>Ta page Instagram, c'est…</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pageTypeOptions.map((pt) => { const sel = formDA.pageType === pt.id; return (
            <div key={pt.id} onClick={() => updateDA('pageType', pt.id)} style={{ border: sel ? '1.5px solid ' + TERRA : '1.5px solid var(--cm-border)', background: sel ? T.terraBg : T.card, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: sel ? TERRA : T.text }}>{pt.label}</div>
              <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{pt.desc}</div>
            </div>
          ); })}
        </div>
      </Card>

      <button onClick={() => { startTrendScan(); go(SCR.RECOS); }} style={btnS(!!formValid)}>{'Voir les recommandations →'}</button>
    </div></div>
  );

  // ─── 3. RECOS + TENDANCES IA ─────
  if (scr === SCR.RECOS) {
    const trendSteps = ['Scan des tendances ' + nicheOptions.find((n) => n.id === formDA.niches[0])?.label + '…', 'Analyse des hashtags viraux…', 'Détection des audios trending…', 'Calcul du mix format optimal…'];
    const prioColors: any = { haute: RED, moyenne: TERRA, basse: SAGE };

    const getRecos = () => {
      const r: any[] = [];
      if (formDA.objectifs.includes('commu')) r.push({ icon: '💬', title: 'Interactions en priorité', desc: "Questions ouvertes, sondages story, réponse à chaque commentaire. L'algo récompense les conversations.", priority: 'haute' });
      if (formDA.objectifs.includes('vendre')) r.push({ icon: '🎯', title: '70% valeur / 30% vente', desc: 'Chaque post commercial doit offrir avant de demander. Les carrousels éducatifs convertissent le mieux.', priority: 'haute' });
      if (formDA.objectifs.includes('visibilite')) r.push({ icon: '📈', title: 'Reels = portée maximale', desc: "Les Reels génèrent 2 à 3x plus de portée. Mais il te faut de la vidéo — pas de Reel à partir d'une photo.", priority: 'haute' });
      if (formDA.pageType === 'metier') r.push({ icon: '🏆', title: 'Positionnement expert', desc: "Montre les coulisses, partage tes apprentissages. L'authenticité pro crée la confiance.", priority: 'moyenne' });
      if (formDA.pageType === 'marque') r.push({ icon: '🛍️', title: 'Social proof + behind the scenes', desc: 'Témoignages clients + processus de création = preuve sociale qui convertit.', priority: 'haute' });
      r.push({ icon: '📅', title: 'Régularité > quantité', desc: postCount === 5 ? '5 posts/sem = ambitieux. Mieux vaut 3 constants que 5 irréguliers.' : '3 posts/sem = bon rythme de départ. Tenable sur la durée.', priority: 'moyenne' });
      return r;
    };

    return (
      <div style={appS}><div style={{ ...fs, padding: '56px 24px 24px' }}>
        <ProgressDots current={2} total={7} />
        <button onClick={() => go(SCR.FORM)} style={{ background: 'none', border: 'none', color: T.sub, fontSize: 14, cursor: 'pointer', marginBottom: 16, padding: 0 }}>{'← Retour'}</button>

        {trendScan && (<div>
          <h1 style={{ ...cin, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: T.text }}>Analyse des tendances</h1>
          <p style={{ color: T.sub, fontSize: 14, margin: '0 0 24px' }}>L'IA fouille les tendances de ta niche en temps réel…</p>
          <Card style={{ background: T.terraBg, border: '1px solid rgba(184,115,86,0.2)', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 20, height: 20, border: '2px solid var(--cm-border)', borderTopColor: TERRA, borderRadius: '50%', animation: 'cmSpin 0.8s linear infinite' }} />
              <span style={{ fontSize: 13, color: TERRA, fontWeight: 600 }}>IA en cours d'analyse…</span>
            </div>
          </Card>
          {trendSteps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, opacity: trendStep >= i ? 1 : 0.25, transition: 'opacity 0.4s' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: trendStep > i ? SAGE : trendStep === i ? TERRA : 'var(--cm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{trendStep > i ? '✓' : (i + 1)}</div>
              <span style={{ fontSize: 14, color: trendStep >= i ? T.text : T.muted }}>{s}</span>
            </div>
          ))}
        </div>)}

        {trendDone && (<div>
          <h1 style={{ ...cin, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: T.text }}>L'avis de l'expert</h1>
          <p style={{ color: T.sub, fontSize: 14, margin: '0 0 16px', lineHeight: 1.5 }}>
            Tendances détectées + recommandations pour <strong style={{ color: T.text }}>{formDA.prenom}</strong>.
          </p>

          <Card style={{ marginBottom: 14 }} animate>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={lblS}>Hashtags trending dans ta niche</div>
              <span style={{ fontSize: 10, color: SAGE, fontWeight: 600, background: SAGE + '18', padding: '3px 8px', borderRadius: 100 }}>LIVE</span>
            </div>
            {trends.hashtags.map((h: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < trends.hashtags.length - 1 ? '1px solid var(--cm-border-l)' : 'none' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text, flex: 1 }}>{h.tag}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{h.vol} posts</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: SAGE }}>{h.trend}</span>
              </div>
            ))}
          </Card>

          <Card style={{ marginBottom: 14 }} animate>
            <div style={lblS}>Audios tendance pour tes Reels</div>
            {trends.audios.map((a: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < trends.audios.length - 1 ? '1px solid var(--cm-border-l)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,' + TERRA + ',' + SAGE + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, flexShrink: 0 }}>{'♪'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{a.uses}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ marginBottom: 14 }} animate>
            <div style={lblS}>Mix format optimal pour ta niche</div>
            <div style={{ display: 'flex', gap: 4, height: 32, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: trends.formatMix.Photo + '%', background: SAGE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{trends.formatMix.Photo}%</div>
              <div style={{ width: trends.formatMix.Carrousel + '%', background: TERRA, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{trends.formatMix.Carrousel}%</div>
              <div style={{ width: trends.formatMix.Reel + '%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{trends.formatMix.Reel}%</div>
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              {[{ l: 'Photo', c: SAGE }, { l: 'Carrousel', c: TERRA }, { l: 'Reel', c: RED }].map((x) => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: x.c }} />
                  <span style={{ fontSize: 12, color: T.sub }}>{x.l}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ marginBottom: 14 }} animate>
            <div style={lblS}>Piliers de contenu recommandés</div>
            {trends.pillars.map((p: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: T.text, flex: 1, fontWeight: 500 }}>{p.name}</span>
                <div style={{ width: 100, height: 6, background: T.borderL, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: p.pct + '%', height: '100%', background: i === 0 ? TERRA : i === 1 ? SAGE : '#D4A088', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.sub, width: 32, textAlign: 'right' }}>{p.pct}%</span>
              </div>
            ))}
          </Card>

          <Card style={{ marginBottom: 14, background: T.terraBg, border: '1px solid rgba(184,115,86,0.2)' }} animate>
            <div style={lblS}>Système de crédits</div>
            <p style={{ fontSize: 12, color: T.sub, margin: '0 0 12px' }}>Chaque format consomme un nombre différent de crédits selon le travail IA nécessaire.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {fmts.map((f) => (
                <div key={f} style={{ flex: 1, textAlign: 'center', padding: '10px 0', background: T.card, borderRadius: 12, border: '1px solid var(--cm-border)' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{f === 'Photo' ? '📷' : f === 'Carrousel' ? '📑' : '🎬'}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{f}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>{FORMAT_NEEDS[f].label}</div>
                  <CreditBadge cost={CREDIT_COST[f]} />
                </div>
              ))}
            </div>
          </Card>

          <div style={{ marginBottom: 14 }}>
            <div style={lblS}>Recommandations personnalisées</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {getRecos().map((r, i) => (
                <Card key={i} style={{ padding: 16 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 14, background: T.borderL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{r.title}</div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: prioColors[r.priority], background: prioColors[r.priority] + '18', padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase' }}>{r.priority}</span>
                      </div>
                      <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.6 }}>{r.desc}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card style={{ marginBottom: 24 }}>
            <div style={lblS}>Rythme de publication</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[3, 5].map((n) => (
                <button key={n} onClick={() => setPostCount(n)} style={{
                  flex: 1, padding: '14px', borderRadius: 16, cursor: 'pointer', transition: 'all 0.15s',
                  border: postCount === n ? '1.5px solid ' + TERRA : '1.5px solid var(--cm-border)',
                  background: postCount === n ? T.terraBg : T.card, color: postCount === n ? TERRA : T.sub, fontSize: 15, fontWeight: 600,
                }}>{n} posts / sem</button>
              ))}
            </div>
          </Card>

          <button onClick={() => go(SCR.VISUALS)} style={btnS(true)}>{'Choisir mes visuels →'}</button>
        </div>)}
      </div></div>
    );
  }

  // ─── 4. VISUELS ─────
  if (scr === SCR.VISUALS) {
    const canGenerate = selC >= postCount;
    return (
      <div style={appS}><div style={{ ...fs, padding: '56px 24px 24px' }}>
        <ProgressDots current={3} total={7} />
        <button onClick={() => { setTrendDone(true); setTrendScan(false); go(SCR.RECOS); }} style={{ background: 'none', border: 'none', color: T.sub, fontSize: 14, cursor: 'pointer', marginBottom: 16, padding: 0 }}>{'← Retour'}</button>
        <h1 style={{ ...cin, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: T.text }}>Tes visuels</h1>
        <p style={{ color: T.sub, fontSize: 14, margin: '0 0 12px' }}>Sélectionne tes fichiers. Les formats dépendront de ce que tu fournis.</p>

        <Card style={{ marginBottom: 16, padding: 14 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ l: 'Photos', v: photoCount, icon: '📷', need: 'Photo, Carrousel' }, { l: 'Vidéos', v: videoCount, icon: '🎬', need: 'Reel' }].map((x) => (
              <div key={x.l} style={{ flex: 1, textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 20 }}>{x.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{x.v}</div>
                <div style={{ fontSize: 12, color: T.sub }}>{x.l} select.</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>→ {x.need}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--cm-border-l)', marginTop: 10, paddingTop: 10 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: canPhoto ? SAGE : T.muted, fontWeight: 600 }}>{canPhoto ? '✓' : '✗'} Photo</span>
              <span style={{ fontSize: 11, color: canCarrousel ? SAGE : T.muted, fontWeight: 600 }}>{canCarrousel ? '✓' : '✗'} Carrousel (3+ photos)</span>
              <span style={{ fontSize: 11, color: canReel ? SAGE : T.muted, fontWeight: 600 }}>{canReel ? '✓' : '✗'} Reel (vidéo requise)</span>
            </div>
            {!canReel && selC > 0 && <p style={{ fontSize: 11, color: RED, margin: '6px 0 0', fontWeight: 500 }}>Ajoute au moins 1 vidéo pour débloquer les Reels</p>}
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[{ k: 'google', l: 'Google Photos' }, { k: 'pellicule', l: 'Pellicule' }, { k: 'importer', l: 'Importer' }].map((s) => (
            <button key={s.k} onClick={() => { setPSrc(s.k); setSelPhotos([]); }} style={{ flex: 1, padding: '11px 6px', borderRadius: 100, border: pSrc === s.k ? '1.5px solid ' + TERRA : '1.5px solid var(--cm-border)', background: pSrc === s.k ? T.terraBg : T.card, color: pSrc === s.k ? TERRA : T.sub, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{s.l}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
          {curPhotos.map((p: any) => {
            const sel = selPhotos.includes(p.id);
            return (
              <div key={p.id} onClick={() => setSelPhotos((prev) => prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id])} style={{ position: 'relative', aspectRatio: '1', cursor: 'pointer', borderRadius: 12, overflow: 'hidden', border: sel ? '2.5px solid ' + TERRA : '2.5px solid transparent' }}>
                <img src={img(p.seed)} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e: any) => { e.target.style.background = 'linear-gradient(135deg,#D4A088,#B5C5A5)'; }} />
                <MediaTypeBadge type={p.type} />
                {p.type === 'video' && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>{'▶'}</div>}
                <span style={{ position: 'absolute', bottom: 4, right: 4, fontSize: 8, color: '#fff', background: 'rgba(0,0,0,0.35)', padding: '2px 6px', borderRadius: 4 }}>{p.label}</span>
                {sel && <div style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: TERRA, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>{'✓'}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ color: T.sub, fontSize: 13 }}>{photoCount} photo{photoCount > 1 ? 's' : ''} · {videoCount} vidéo{videoCount > 1 ? 's' : ''}</span>
          {canGenerate && <span style={{ color: SAGE, fontSize: 13, fontWeight: 600 }}>{'✓'} Prêt</span>}
        </div>

        {!gen ? (
          <button onClick={startGen} disabled={!canGenerate} style={btnS(canGenerate)}>{'Générer ma semaine ✨'}</button>
        ) : (
          <div>
            <div style={{ width: '100%', height: 6, background: T.borderL, borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', width: genP + '%', background: 'linear-gradient(90deg,' + TERRA + ',' + SAGE + ')', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
            <p style={{ textAlign: 'center', color: T.sub, fontSize: 14 }}>
              {genP < 20 ? 'Analyse des fichiers…' : genP < 40 ? 'Attribution des formats…' : genP < 60 ? 'Rédaction des légendes IA…' : genP < 80 ? 'Optimisation hashtags…' : 'Calage sur tes créneaux ✨'}
            </p>
          </div>
        )}
      </div></div>
    );
  }

  // ─── 5. PLANNING ─────
  if (scr === SCR.PLANNING) return (
    <div style={appS}><div style={{ ...fs, padding: '56px 24px 24px' }}>
      <ProgressDots current={4} total={7} />
      <button onClick={() => { setGen(false); setGenP(0); go(SCR.VISUALS); }} style={{ background: 'none', border: 'none', color: T.sub, fontSize: 14, cursor: 'pointer', marginBottom: 16, padding: 0 }}>{'← Retour'}</button>
      <h1 style={{ ...cin, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: T.text }}>Ta semaine</h1>

      <Card style={{ marginBottom: 16, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{totalCredits} crédits utilisés</div>
          <div style={{ fontSize: 11, color: T.muted }}>sur 10 crédits disponibles (gratuit)</div>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--cm-border-l)', borderTopColor: totalCredits <= 10 ? SAGE : RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: totalCredits <= 10 ? SAGE : RED }}>{totalCredits}</span>
        </div>
      </Card>

      <p style={{ color: T.sub, fontSize: 14, margin: '0 0 16px' }}>Valide, modifie ou refuse chaque post.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {posts.map((post, i) => {
          const st = pStates[i];
          return (
            <Card key={i} style={{ cursor: 'pointer', opacity: st === 'rejected' ? 0.5 : 1, border: st === 'approved' ? '1.5px solid ' + SAGE : st === 'rejected' ? '1.5px solid ' + RED : '1px solid var(--cm-border)', padding: 14 }}>
              <div onClick={() => { setDIdx(i); setShowSc(false); setEditing(false); setShowReject(false); setRejectChoices([]); go(SCR.DETAIL); }} style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 82, height: 82, borderRadius: 16, overflow: 'hidden', flexShrink: 0, position: 'relative', background: T.borderL }}>
                  <img src={post.media ? img(post.media.seed) : img('fallback')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', bottom: 4, right: 6, fontSize: 9, color: '#fff', background: 'rgba(0,0,0,0.35)', padding: '2px 8px', borderRadius: 4 }}>{post.format}</span>
                  {post.media?.type === 'video' && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9 }}>{'▶'}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{post.day}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <CreditBadge cost={post.credits} />
                      <span style={{ fontSize: 12, color: T.sub, background: T.borderL, padding: '3px 10px', borderRadius: 100 }}>{post.time}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.caption}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                    <FormatBadge format={post.format} small />
                    <div style={{ width: 40, height: 4, background: T.borderL, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: post.score + '%', height: '100%', background: post.score > 90 ? SAGE : TERRA, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, color: post.score > 90 ? SAGE : TERRA, fontWeight: 600 }}>{post.score}%</span>
                    {st === 'approved' && <span style={{ marginLeft: 'auto', fontSize: 11, color: SAGE, fontWeight: 600 }}>{'✓'}</span>}
                    {st === 'rejected' && <span style={{ marginLeft: 'auto', fontSize: 11, color: RED, fontWeight: 600 }}>{'✗'}</span>}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {appC === posts.length ? (
        <button onClick={() => go(SCR.VALIDATED)} style={{ ...btnS(true, SAGE), marginTop: 24 }}>{'Programmer tout →'}</button>
      ) : (
        <p style={{ textAlign: 'center', color: T.muted, fontSize: 13, marginTop: 18 }}>{appC}/{posts.length} validés — Tape un post pour le détail</p>
      )}
    </div></div>
  );

  // ─── DETAIL ─────
  if (scr === SCR.DETAIL) {
    const post = posts[dIdx]; const st = pStates[dIdx];
    const mediaType = post.media?.type || 'photo';
    const canSwitch = (f: string) => {
      if (f === 'Reel') return mediaType === 'video';
      if (f === 'Carrousel') return mediaType === 'photo' && photoCount >= 3;
      return mediaType === 'photo';
    };

    return (
      <div style={appS}><div style={fs}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', background: T.borderL, overflow: 'hidden' }}>
          <img src={post.media ? imgR(post.media.seed) : imgR('fallback')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,var(--cm-bg) 3%,transparent 40%)' }} />
          <button onClick={() => go(SCR.PLANNING)} style={{ position: 'absolute', top: 48, left: 16, width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,0.88)', border: '1px solid var(--cm-border)', color: '#2D2A26', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>{'←'}</button>
          <div style={{ position: 'absolute', top: 48, right: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <CreditBadge cost={post.credits} />
            <button onClick={(e) => { e.stopPropagation(); setShowSc(!showSc); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.88)', borderRadius: 100, padding: '8px 16px', border: '1px solid var(--cm-border)', color: '#2D2A26', cursor: 'pointer', fontSize: 13, fontWeight: 600, backdropFilter: 'blur(8px)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: post.score > 90 ? SAGE : TERRA }} />{post.score}%
            </button>
          </div>
        </div>

        <div style={{ padding: '0 24px 32px', marginTop: -16, position: 'relative' }}>
          {showSc && (
            <Card style={{ marginBottom: 16 }}>
              <div style={lblS}>Score de performance estimé</div>
              <SBar label="Horaire" value={post.scoreDetails.horaire} />
              <SBar label="Légende" value={post.scoreDetails.legende} />
              <SBar label="Hashtags" value={post.scoreDetails.hashtags} />
              <SBar label="Visuel" value={post.scoreDetails.visuel} />
            </Card>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ ...cin, fontSize: 20, fontWeight: 700, color: T.text }}>{post.day}</span>
            <span style={{ fontSize: 14, color: TERRA, fontWeight: 500 }}>à {post.time}</span>
            <span style={{ marginLeft: 'auto' }}><FormatBadge format={post.format} /></span>
          </div>

          <Card style={{ marginBottom: 14, padding: 14 }}>
            <div style={lblS}>Format</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {fmts.map((f) => {
                const ok = canSwitch(f);
                return (
                  <button key={f} onClick={() => { if (ok) setPosts((prev) => { const n = [...prev]; n[dIdx] = { ...n[dIdx], format: f, credits: CREDIT_COST[f] }; return n; }); }}
                    style={{ flex: 1, padding: '9px', borderRadius: 100, cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.35,
                      border: post.format === f ? '1.5px solid ' + TERRA : '1.5px solid var(--cm-border)',
                      background: post.format === f ? T.terraBg : T.card, color: post.format === f ? TERRA : T.sub, fontSize: 13, fontWeight: 500 }}>
                    {f}
                  </button>
                );
              })}
            </div>
            {mediaType === 'photo' && <p style={{ fontSize: 11, color: T.muted, margin: 0 }}>📷 Fichier source = photo — Reel non disponible</p>}
            {mediaType === 'video' && <p style={{ fontSize: 11, color: T.muted, margin: 0 }}>🎬 Fichier source = vidéo — idéal pour un Reel</p>}
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={lblS}>Légende</div>
              <button onClick={() => { if (!editing) setEditVal(post.caption); setEditing(!editing); }} style={{ background: 'none', border: 'none', color: TERRA, fontSize: 12, cursor: 'pointer', fontWeight: 600, marginTop: -8 }}>{editing ? 'Annuler' : '✏️ Modifier'}</button>
            </div>
            {editing ? (<div>
              <textarea value={editVal} onChange={(e) => setEditVal(e.target.value)} rows={4} style={{ ...inpS, fontSize: 14, resize: 'none', marginBottom: 10 }} />
              <button onClick={() => { setPosts((prev) => { const n = [...prev]; n[dIdx] = { ...n[dIdx], caption: editVal }; return n; }); setEditing(false); }} style={{ padding: '10px 22px', borderRadius: 100, border: 'none', background: TERRA, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Enregistrer</button>
            </div>) : (
              <p style={{ fontSize: 14, lineHeight: 1.6, color: T.text, margin: 0 }}>{post.caption}</p>
            )}
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <div style={lblS}>Hashtags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {post.hashtags.map((h: string, j: number) => (<span key={j} style={{ background: T.sageBg, color: SAGE, padding: '5px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500 }}>{h}</span>))}
            </div>
          </Card>

          <Card style={{ marginBottom: 24 }}>
            <div style={lblS}>Pourquoi cet horaire ?</div>
            <p style={{ fontSize: 13, color: T.sub, margin: 0, lineHeight: 1.6 }}>Ton audience est la plus active entre 18h et 19h30 le {post.day.toLowerCase()}. Créneau optimisé selon l'analyse de ton feed.</p>
          </Card>

          {showReject ? (
            <Card style={{ marginBottom: 14, border: '1.5px solid ' + RED + '44' }}>
              <div style={lblS}>Qu'est-ce qu'on change ?</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {[{ k: 'photo', l: '📷 Photo' }, { k: 'legende', l: '✍️ Légende' }, { k: 'cta', l: '💬 CTA' }, { k: 'format', l: '🔄 Format' }].map((c) => {
                  const sel = rejectChoices.includes(c.k);
                  return <button key={c.k} onClick={() => setRejectChoices((prev) => prev.includes(c.k) ? prev.filter((x) => x !== c.k) : [...prev, c.k])} style={{
                    padding: '9px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    border: sel ? '1.5px solid ' + RED : '1.5px solid var(--cm-border)',
                    background: sel ? RED + '14' : T.card, color: sel ? RED : T.sub,
                  }}>{c.l}</button>;
                })}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setShowReject(false); setRejectChoices([]); }} style={{ flex: 1, padding: '12px', borderRadius: 100, border: '1px solid var(--cm-border)', background: T.card, color: T.sub, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
                <button onClick={() => regenPost(dIdx, rejectChoices)} disabled={rejectChoices.length === 0} style={{ flex: 2, padding: '12px', borderRadius: 100, border: 'none', background: rejectChoices.length > 0 ? RED : 'var(--cm-border)', color: rejectChoices.length > 0 ? '#fff' : 'var(--cm-muted)', fontSize: 13, fontWeight: 600, cursor: rejectChoices.length > 0 ? 'pointer' : 'default' }}>Régénérer ✨</button>
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setShowReject(true); setRejectChoices([]); }} style={{ flex: 1, padding: '16px', borderRadius: 100, border: '1.5px solid var(--cm-border)', background: T.card, color: T.sub, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Refuser</button>
              <button onClick={() => { const n = [...pStates]; n[dIdx] = 'approved'; setPStates(n); go(SCR.PLANNING); }} style={{ flex: 2, padding: '16px', borderRadius: 100, border: 'none', background: st === 'approved' ? SAGE : TERRA, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{st === 'approved' ? '✓ Validé' : 'Valider ✨'}</button>
            </div>
          )}
        </div>
      </div></div>
    );
  }

  // ─── 7. VALIDATION ─────
  if (scr === SCR.VALIDATED) return (
    <div style={appS}><div style={{ ...fs, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px', textAlign: 'center' }}>
      <ProgressDots current={6} total={7} />
      <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,' + SAGE + ',#6B8A5E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 24 }}>{'🚀'}</div>
      <h1 style={{ ...cin, fontSize: 28, fontWeight: 700, margin: '0 0 8px', color: T.text }}>C'est programmé !</h1>
      <p style={{ color: T.sub, fontSize: 15, margin: '0 0 12px', maxWidth: 300, lineHeight: 1.6 }}>Tes {posts.length} publications partiront aux meilleurs créneaux.</p>

      <Card style={{ marginBottom: 24, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: T.sub }}>Crédits utilisés</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: SAGE }}>{totalCredits} / 10</span>
        </div>
      </Card>

      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {posts.map((post, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: SAGE, flexShrink: 0 }} />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{post.day}</span>
              <span style={{ fontSize: 13, color: T.sub, marginLeft: 8 }}>{post.time}</span>
            </div>
            <FormatBadge format={post.format} small />
            <CreditBadge cost={post.credits} />
          </Card>
        ))}
      </div>
      <button onClick={() => { setPStates(new Array(postCount).fill(null)); setSelPhotos([]); setGen(false); setGenP(0); go(SCR.VISUALS); }} style={{ ...btnS(true), maxWidth: 340 }}>{'Préparer la semaine prochaine →'}</button>
    </div></div>
  );

  return null;
}

const CM_STYLE = `
.cmapp-scope {
  --cm-bg: #FAF8F5; --cm-card: #FFFFFF; --cm-text: #2D2A26; --cm-sub: #8C857D;
  --cm-muted: #B5AFA8; --cm-border: #EBE6E0; --cm-border-l: #F3EFEA;
  --cm-terra-bg: rgba(184,115,86,0.08); --cm-sage-bg: rgba(143,163,122,0.1);
}
@media (prefers-color-scheme: dark) {
  .cmapp-scope:not([data-theme="light"]) {
    --cm-bg: #1A1816; --cm-card: #252220; --cm-text: #E8E4DF; --cm-sub: #9E978F;
    --cm-muted: #6B655E; --cm-border: #3A3532; --cm-border-l: #2E2A27;
    --cm-terra-bg: rgba(184,115,86,0.15); --cm-sage-bg: rgba(143,163,122,0.15);
  }
}
.cmapp-scope input:focus, .cmapp-scope textarea:focus { border-color: #B87356 !important; }
@keyframes cmSpin { to { transform: rotate(360deg); } }
@keyframes cmFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes cmPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
`;

export default function AppPage() {
  return (
    <div className="cmapp-scope">
      <style dangerouslySetInnerHTML={{ __html: CM_STYLE }} />
      <App />
    </div>
  );
}
