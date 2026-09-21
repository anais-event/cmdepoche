import Link from 'next/link';
import type { Metadata } from 'next';
import DemoScan from '@/components/demo-scan';

export const metadata: Metadata = {
  title: 'CM de Poche | Ton assistant pour créer du contenu Instagram',
  description: 'CM de Poche crée, planifie et programme tes contenus Instagram à partir de tes propres photos et vidéos. Pour créateurs, indépendants et petites activités qui veulent poster régulièrement sans y passer des heures.',
  keywords: 'community manager Instagram, création de contenu Instagram, gestion des réseaux sociaux, outil Instagram, planification Instagram, assistant Instagram',
  authors: [{ name: 'CM de Poche' }],
  openGraph: {
    title: 'CM de Poche | Ton assistant pour créer du contenu Instagram',
    description: 'Analyse ton compte, crée tes contenus et planifie ta semaine Instagram. À partir de tes propres photos et vidéos.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'CM de Poche',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CM de Poche | Assistant création de contenu Instagram',
    description: 'Analyse, création de contenu et planification Instagram pour créateurs et indépendants.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CM de Poche',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Assistant de création de contenu et de gestion de compte Instagram. Analyse de profil, création de posts, planification hebdomadaire et suivi des performances.',
  url: 'https://cmdepoche.com',
  offers: [
    { '@type': 'Offer', name: 'Gratuit', price: '0', priceCurrency: 'EUR', description: '10 crédits/mois' },
    { '@type': 'Offer', name: 'Pro', price: '29', priceCurrency: 'EUR', billingIncrement: 'P1M', description: '100 crédits/mois, analyse profil' },
    { '@type': 'Offer', name: 'Business', price: '49', priceCurrency: 'EUR', billingIncrement: 'P1M', description: '350 crédits/mois, analyses illimitées' },
  ],
  featureList: [
    'Analyse de compte Instagram',
    'Création de contenu à partir de photos et vidéos',
    'Planification hebdomadaire',
    'Programmation des publications',
    'Suivi des performances',
  ],
  creator: { '@type': 'Organization', name: 'CM de Poche' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qu\'est-ce que CM de Poche ?',
      acceptedAnswer: { '@type': 'Answer', text: 'CM de Poche est un assistant qui analyse ton compte Instagram, crée tes contenus à partir de tes propres photos et vidéos, et planifie ta semaine de publications.' },
    },
    {
      '@type': 'Question',
      name: 'À qui s\'adresse CM de Poche ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Aux créateurs, indépendants, artisans et petites activités qui veulent poster régulièrement sur Instagram sans y consacrer des heures chaque semaine.' },
    },
    {
      '@type': 'Question',
      name: 'CM de Poche peut-il créer mes contenus Instagram ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui. Tu fournis tes photos et vidéos, CM de Poche écrit les légendes à ta voix, choisit les hashtags et programme les publications aux meilleurs horaires.' },
    },
    {
      '@type': 'Question',
      name: 'Est-ce que je dois fournir mes propres photos et vidéos ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui. CM de Poche utilise tes visuels pour créer des contenus authentiques qui te ressemblent. Pas de banque d\'images générique.' },
    },
    {
      '@type': 'Question',
      name: 'CM de Poche peut-il programmer mes publications ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui. Une fois tes contenus validés, CM de Poche les programme aux horaires où ton audience est la plus active.' },
    },
    {
      '@type': 'Question',
      name: 'Est-ce que CM de Poche analyse les performances de mon compte ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui. CM de Poche suit l\'engagement, identifie les formats et sujets qui fonctionnent, et adapte ses recommandations au fil du temps.' },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg font-inter w-screen relative left-1/2 -translate-x-1/2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ─── NAV ─── */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-terra flex items-center justify-center">
            <span className="text-white text-sm font-cinzel font-bold">CM</span>
          </div>
          <span className="text-lg font-bold font-cinzel text-text">CM de Poche</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#comment" className="text-sm text-sub hover:text-text transition-colors hidden sm:block">Comment ça marche</a>
          <a href="#tarifs" className="text-sm text-sub hover:text-text transition-colors hidden sm:block">Tarifs</a>
          <a href="#faq" className="text-sm text-sub hover:text-text transition-colors hidden sm:block">FAQ</a>
          <Link href="/login" className="px-5 py-2 rounded-pill bg-terra text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Commencer
          </Link>
        </div>
      </nav>

      {/* ─── HERO + MINI-SCAN ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-terra font-semibold text-sm tracking-wide mb-4 font-cinzel">CM DE POCHE</p>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-cinzel font-bold text-text leading-[1.15] mb-3">
          Ton compte Instagram<br />pourrait faire mieux.
        </h1>
        <p className="text-xl sm:text-2xl font-cinzel text-sub mb-6">
          Voyons déjà ce qu&apos;il raconte.
        </p>
        <p className="text-base text-sub max-w-lg mx-auto mb-8">
          Entre ton @Instagram. CM de Poche analyse ton compte et te montre ce qu&apos;il repère.
        </p>
        <DemoScan />
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section id="comment" className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">Comment ça marche</h2>
        </div>
        <div className="flex flex-col gap-8">
          {[
            { n: '01', title: 'Analyse ton compte', desc: 'CM de Poche regarde ton profil, tes contenus, ton rythme. Il comprend ce que tu fais.', note: 'Automatique' },
            { n: '02', title: 'Importe tes visuels', desc: 'Glisse tes photos et vidéos. CM de Poche les associe aux posts qu\'il prépare.', note: '1 min' },
            { n: '03', title: 'Reçois ta semaine', desc: 'Légendes à ta voix, hashtags, horaires, formats. Tout est prêt.', note: '3 min' },
            { n: '04', title: 'Valide et programme', desc: 'Modifie si tu veux, puis programme. CM de Poche publie au bon moment.', note: '1 min' },
          ].map((step) => (
            <div key={step.n} className="flex gap-5 items-start">
              <span className="text-3xl font-cinzel font-bold text-border flex-shrink-0 w-12">{step.n}</span>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-text text-lg">{step.title}</h3>
                  <span className="text-[11px] bg-sage-bg text-sage font-semibold px-2 py-0.5 rounded-pill">{step.note}</span>
                </div>
                <p className="text-sm text-sub mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CRÉATION DE CONTENU ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">
            Tes contenus, créés à partir de tes visuels
          </h2>
          <p className="text-sub mt-3 max-w-xl mx-auto">
            Tu fournis tes photos et vidéos. CM de Poche écrit les légendes, choisit les hashtags et prépare chaque post.
          </p>
        </div>

        <div className="bg-card rounded-card border border-border p-6 sm:p-8 max-w-md mx-auto shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-xs text-terra font-semibold uppercase tracking-wider">Ta semaine</p>
              <p className="text-lg font-cinzel font-bold text-text mt-0.5">Semaine du 8 sept.</p>
            </div>
            <span className="bg-sage-bg text-sage text-xs font-semibold px-3 py-1 rounded-pill">5 posts</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { day: 'Lundi', time: '18:30', format: 'Photo', caption: 'La rentrée c\'est le moment de…' },
              { day: 'Mardi', time: '12:15', format: 'Carrousel', caption: '3 erreurs que tout le monde…' },
              { day: 'Jeudi', time: '19:00', format: 'Reel', caption: 'POV : tu découvres que…' },
              { day: 'Vendredi', time: '08:30', format: 'Photo', caption: 'Ce weekend je vous prépare…' },
              { day: 'Dimanche', time: '17:45', format: 'Carrousel', caption: 'Recap de la semaine…' },
            ].map((post) => (
              <div key={post.day} className="flex items-center gap-3 p-3 rounded-input bg-bg">
                <div className="w-9 h-9 rounded-lg bg-terra-bg flex items-center justify-center text-xs font-bold text-terra flex-shrink-0">
                  {post.format === 'Reel' ? '▶' : '◫'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text">{post.day}</span>
                    <span className="text-[11px] text-muted">{post.time}</span>
                    <span className="text-[10px] bg-border-l text-sub px-1.5 py-0.5 rounded">{post.format}</span>
                  </div>
                  <p className="text-xs text-muted truncate">{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border-l flex items-center justify-between">
            <span className="text-xs text-muted">Prêt à publier</span>
            <span className="bg-terra text-white text-xs font-semibold px-4 py-2 rounded-pill">
              Programmer tout
            </span>
          </div>
        </div>
      </section>

      {/* ─── PLANNING INSTAGRAM ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">
            Un planning qui tient la semaine
          </h2>
          <p className="text-sub mt-3 max-w-xl mx-auto">
            CM de Poche choisit les jours, les horaires et les formats. Tu n&apos;as pas besoin de réfléchir à quand poster.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Horaires calculés', desc: 'Chaque post est programmé quand ton audience est la plus active.' },
            { title: 'Formats variés', desc: 'Photos, carrousels, Reels — un mix pensé pour l\'algorithme.' },
            { title: 'Calendrier saisonnier', desc: '40+ événements français intégrés. Les occasions sont suggérées au bon moment.' },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-card p-6 border border-border">
              <h3 className="font-semibold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-sub leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ANALYSE ET APPRENTISSAGE ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">
            Il apprend ce qui marche pour toi
          </h2>
          <p className="text-sub mt-3 max-w-xl mx-auto">
            CM de Poche suit tes performances, identifie ce qui fonctionne et ajuste ses recommandations.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Engagement suivi', desc: 'Likes, commentaires, partages — tout est mesuré post par post.' },
            { title: 'Sujets qui marchent', desc: 'CM de Poche repère les thèmes qui intéressent ton audience.' },
            { title: 'Formats gagnants', desc: 'Photo, carrousel ou Reel ? Les données te le disent.' },
            { title: 'Progression visible', desc: 'Semaine après semaine, tu vois ce qui avance.' },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-card p-6 border border-border">
              <h3 className="font-semibold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-sub leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── POUR QUI ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">Pour qui ?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Créateurs de contenu', desc: 'Tu produis déjà du contenu mais tu perds du temps à organiser ta semaine.' },
            { title: 'Indépendants', desc: 'Instagram est un canal d\'acquisition, pas ton métier. CM de Poche s\'en occupe.' },
            { title: 'Artisans et commerçants', desc: 'Tu as de belles choses à montrer mais pas le temps de poster régulièrement.' },
            { title: 'Petites activités', desc: 'Pas de budget pour un CM. CM de Poche fait le travail pour une fraction du prix.' },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-card p-6 border border-border">
              <h3 className="font-semibold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-sub leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TARIFS ─── */}
      <section id="tarifs" className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">Tarifs</h2>
          <p className="text-sub mt-3">Commence gratuitement. Upgrade quand tu sens la différence.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Gratuit',
              price: '0€',
              highlight: false,
              features: ['10 crédits / mois', '~5 posts', 'Légendes + hashtags', 'Support communauté'],
              cta: 'Commencer',
            },
            {
              name: 'Pro',
              price: '29€',
              highlight: true,
              features: ['100 crédits / mois', '~50 posts', 'Analyse de profil', 'Calendrier éditorial', 'Sans watermark', 'Support email'],
              cta: 'Passer à Pro',
            },
            {
              name: 'Business',
              price: '49€',
              highlight: false,
              features: ['350 crédits / mois', '~100+ posts', 'Analyses illimitées', 'Maronnier auto-adapté', 'Support prioritaire', 'Accès API'],
              cta: 'Choisir Business',
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`bg-card rounded-card p-6 ${
                plan.highlight ? 'border-2 border-terra relative' : 'border border-border'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-terra text-white text-[10px] font-bold px-3 py-0.5 rounded-pill">
                  Populaire
                </div>
              )}
              <h3 className="font-cinzel font-bold text-text text-lg">{plan.name}</h3>
              <div className="mt-2 mb-5">
                <span className="text-3xl font-bold text-text">{plan.price}</span>
                <span className="text-sub text-sm"> / mois</span>
              </div>
              <ul className="flex flex-col gap-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-sub flex items-start gap-2">
                    <span className="text-sage">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`block text-center py-3 rounded-pill font-semibold text-sm transition-opacity ${
                  plan.highlight
                    ? 'bg-terra text-white hover:opacity-90'
                    : 'bg-bg text-text hover:opacity-80'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted mt-6">Sans engagement · Annule quand tu veux · Pas de carte pour le gratuit</p>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">Questions fréquentes</h2>
        </div>
        <div className="flex flex-col gap-3">
          {[
            {
              q: 'Qu\'est-ce que CM de Poche ?',
              a: 'Un assistant qui analyse ton compte Instagram, crée tes contenus à partir de tes propres photos et vidéos, et planifie ta semaine de publications.',
            },
            {
              q: 'À qui s\'adresse CM de Poche ?',
              a: 'Aux créateurs, indépendants, artisans et petites activités qui veulent poster régulièrement sur Instagram sans y consacrer des heures.',
            },
            {
              q: 'CM de Poche peut-il créer mes contenus Instagram ?',
              a: 'Oui. Tu fournis tes photos et vidéos, CM de Poche écrit les légendes à ta voix, choisit les hashtags et programme les publications aux meilleurs horaires.',
            },
            {
              q: 'Est-ce que je dois fournir mes propres photos et vidéos ?',
              a: 'Oui. CM de Poche utilise tes visuels pour créer des contenus authentiques qui te ressemblent. Pas de banque d\'images générique.',
            },
            {
              q: 'CM de Poche peut-il programmer mes publications ?',
              a: 'Oui. Une fois tes contenus validés, CM de Poche les programme aux horaires où ton audience est la plus active.',
            },
            {
              q: 'Est-ce que CM de Poche analyse les performances de mon compte ?',
              a: 'Oui. CM de Poche suit l\'engagement, identifie les formats et sujets qui fonctionnent, et adapte ses recommandations au fil du temps.',
            },
            {
              q: 'En quoi c\'est différent de ChatGPT ?',
              a: 'ChatGPT donne du texte brut. CM de Poche connaît ta niche, ton ton, la saison, tes meilleurs horaires. Et il programme tout directement.',
            },
            {
              q: 'Mes données sont en sécurité ?',
              a: 'Hébergement Europe, chiffrement TLS + AES-256, isolation par utilisateur. Aucune donnée vendue. Suppression sur demande. RGPD.',
            },
          ].map((faq) => (
            <details key={faq.q} className="bg-card rounded-card border border-border overflow-hidden group">
              <summary className="p-5 cursor-pointer font-semibold text-text hover:text-terra transition-colors list-none flex justify-between items-center">
                {faq.q}
                <span className="text-muted group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-sub leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-text mb-4">
          Prêt à poster sans y penser ?
        </h2>
        <p className="text-sub mb-8">Pas de carte bancaire.</p>
        <Link href="/login" className="inline-block px-10 py-4 rounded-pill bg-terra text-white font-semibold text-lg hover:opacity-90 transition-opacity">
          Créer mon compte gratuitement
        </Link>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-10 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-terra flex items-center justify-center">
              <span className="text-white text-[10px] font-cinzel font-bold">CM</span>
            </div>
            <span className="font-cinzel font-bold text-text text-sm">CM de Poche</span>
          </div>
          <div className="flex gap-6 text-sm text-sub">
            <a href="#faq" className="hover:text-text transition-colors">FAQ</a>
            <Link href="/privacy" className="hover:text-text transition-colors">Confidentialité</Link>
            <a href="mailto:groupe.cogitium@gmail.com" className="hover:text-text transition-colors">Contact</a>
          </div>
          <p className="text-xs text-muted">© 2026 CM de Poche</p>
        </div>
      </footer>
    </div>
  );
}
