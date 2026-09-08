import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CM de Poche — Ta semaine de posts créée en 3 minutes',
  description: 'Fini les heures à chercher quoi poster. CM de Poche génère ta semaine complète (légendes, hashtags, horaires) adaptée à ta voix et ta niche. Pour micro-influenceurs Instagram & TikTok.',
  keywords: 'community manager, micro-influenceur, Instagram, TikTok, contenu automatique, calendrier éditorial, IA, social media, générateur de posts',
  authors: [{ name: 'CM de Poche' }],
  openGraph: {
    title: 'CM de Poche — Ta semaine de posts créée en 3 minutes',
    description: 'Fini les heures à chercher quoi poster. L\'IA génère ta semaine complète, à ta voix, prête à publier.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'CM de Poche',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CM de Poche — Ta semaine de posts en 3 minutes',
    description: 'Génération IA de contenu pour micro-influenceurs. Instagram & TikTok.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CM de Poche',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Application SaaS pour micro-influenceurs. Génère une semaine complète de contenu Instagram et TikTok en 3 minutes.',
  url: 'https://cmdepoche.com',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'EUR', description: '10 crédits/mois' },
    { '@type': 'Offer', name: 'Pro', price: '29', priceCurrency: 'EUR', billingIncrement: 'P1M', description: '100 crédits/mois, analyse profil' },
    { '@type': 'Offer', name: 'Business', price: '49', priceCurrency: 'EUR', billingIncrement: 'P1M', description: '350 crédits/mois, analyses illimitées' },
  ],
  featureList: ['Génération IA de contenu', 'Calendrier éditorial saisonnier', 'Programmation Instagram/TikTok', 'Analyse de profil Instagram'],
  creator: { '@type': 'Organization', name: 'CM de Poche' },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg font-inter w-screen relative left-1/2 -translate-x-1/2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

      {/* ─── HERO ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-sage font-semibold text-sm tracking-wide mb-6">Pour créateurs & micro-influenceurs</p>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-cinzel font-bold text-text leading-[1.15] mb-6">
          Tu crées du contenu.<br />
          Pas un planning.
        </h1>
        <p className="text-lg text-sub max-w-xl mx-auto mb-10 leading-relaxed">
          Dis-nous qui tu es. En 3 minutes, CM de Poche génère ta semaine de posts — légendes, hashtags, horaires — prête à publier. À ta voix.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="px-8 py-3.5 rounded-pill bg-terra text-white font-semibold hover:opacity-90 transition-opacity">
            Essayer gratuitement
          </Link>
          <a href="#comment" className="px-8 py-3.5 rounded-pill border border-border text-text font-semibold hover:border-terra hover:text-terra transition-colors">
            Voir comment ça marche
          </a>
        </div>
        <p className="text-xs text-muted mt-5">10 crédits offerts · Pas de carte bancaire</p>
      </section>

      {/* ─── LE VRAI PROBLÈME ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-text leading-tight">
            Tu sais que poster régulièrement<br />fait grandir ta communauté.
          </h2>
          <p className="text-lg text-sub mt-4">Le problème, c&apos;est tout le reste.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Le dimanche soir à chercher quoi poster',
              desc: 'Ce n\'est pas l\'inspiration qui manque. C\'est l\'énergie de recommencer chaque semaine.',
            },
            {
              title: 'Des posts soignés, zéro engagement',
              desc: 'Mauvais hashtags, mauvais horaire, mauvais format. Et aucun moyen de savoir lequel.',
            },
            {
              title: '2 heures pour 3 posts',
              desc: 'Trouver l\'idée, écrire la légende, chercher les hashtags, choisir l\'heure… Un rituel épuisant.',
            },
            {
              title: '10 jours sans poster (encore)',
              desc: 'La vie reprend le dessus. L\'algorithme te pénalise. Tu recommences de zéro.',
            },
          ].map((pain) => (
            <div key={pain.title} className="bg-card rounded-card p-6 border border-border">
              <h3 className="font-semibold text-text mb-2">{pain.title}</h3>
              <p className="text-sm text-sub leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LA SOLUTION — MOCK PLANNING ─── */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-sage font-semibold text-sm tracking-wide mb-3">La solution</p>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-text">
            CM de Poche fait le travail.<br />Tu valides.
          </h2>
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
              { day: 'Lundi', time: '18:30', format: 'Photo', caption: 'La rentrée c\'est le moment de…', score: 94 },
              { day: 'Mardi', time: '12:15', format: 'Carrousel', caption: '3 erreurs que tout le monde…', score: 91 },
              { day: 'Jeudi', time: '19:00', format: 'Reel', caption: 'POV : tu découvres que…', score: 96 },
              { day: 'Vendredi', time: '08:30', format: 'Photo', caption: 'Ce weekend je vous prépare…', score: 88 },
              { day: 'Dimanche', time: '17:45', format: 'Carrousel', caption: 'Recap de la semaine…', score: 92 },
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
                <span className={`text-xs font-bold ${post.score >= 90 ? 'text-sage' : 'text-terra'}`}>
                  {post.score}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border-l flex items-center justify-between">
            <span className="text-xs text-muted">Généré en 47 secondes</span>
            <span className="bg-terra text-white text-xs font-semibold px-4 py-2 rounded-pill">
              Programmer tout
            </span>
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section id="comment" className="w-full max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">Comment ça marche</h2>
        </div>
        <div className="flex flex-col gap-8">
          {[
            { n: '01', title: 'Décris-toi', desc: 'Ta niche, ton style, ton objectif. Tu fais ça une seule fois.', note: '2 min' },
            { n: '02', title: 'Importe tes visuels', desc: 'Glisse tes photos, on les associe aux posts automatiquement.', note: '1 min' },
            { n: '03', title: 'Reçois ta semaine', desc: 'Légendes à ta voix, hashtags stratégiques, horaires optimaux, formats variés. Tout est prêt.', note: '47s' },
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

      {/* ─── COMPARAISON ─── */}
      <section className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">
            « J&apos;ai déjà Canva et ChatGPT. »
          </h2>
          <p className="text-sub mt-3">Nous aussi. Aucun des deux ne gère ta semaine.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-card p-6 border border-border">
            <h3 className="font-semibold text-text text-lg mb-2">Canva</h3>
            <p className="text-sm text-sub leading-relaxed mb-4">
              De beaux visuels, mais pas de légendes, pas de stratégie, pas de planning.
            </p>
            <p className="text-xs text-sub/60">Visuels sans direction</p>
          </div>

          <div className="bg-card rounded-card p-6 border border-border">
            <h3 className="font-semibold text-text text-lg mb-2">ChatGPT</h3>
            <p className="text-sm text-sub leading-relaxed mb-4">
              Du texte générique. À toi de prompter, structurer, planifier, programmer.
            </p>
            <p className="text-xs text-sub/60">Texte sans contexte</p>
          </div>

          <div className="bg-card rounded-card p-6 border-2 border-terra relative">
            <div className="absolute -top-2.5 left-5 bg-terra text-white text-[10px] font-bold px-3 py-0.5 rounded-pill">
              Tout-en-un
            </div>
            <h3 className="font-semibold text-terra text-lg mb-2">CM de Poche</h3>
            <p className="text-sm text-sub leading-relaxed mb-4">
              Légendes à ta voix, hashtags, horaires, calendrier saisonnier. Généré et programmé en 3 minutes.
            </p>
            <p className="text-xs text-sage font-semibold">Rien à assembler</p>
          </div>
        </div>
      </section>

      {/* ─── FONCTIONNALITÉS ─── */}
      <section className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-cinzel font-bold text-text">Ce qui est inclus</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Légendes à ta voix', desc: 'L\'IA écrit dans ton ton. Inspirant, éducatif, drôle, authentique — toi, en mieux structuré.' },
            { title: 'Calendrier saisonnier', desc: '40+ événements français intégrés. Saint-Valentin, rentrée, Black Friday — suggérés au bon moment.' },
            { title: 'Hashtags stratégiques', desc: 'Mix automatique : gros, moyens, niche. La bonne combinaison pour maximiser ta portée.' },
            { title: 'Horaires optimaux', desc: 'Publie quand ton audience est active. Créneaux calculés par format et par jour.' },
            { title: 'Analyse de profil', desc: 'Comprends ce qui marche. Engagement, formats, audience. Données réelles.' },
            { title: 'Mobile-first', desc: 'Conçu pour ton téléphone. Crée ta semaine depuis le canapé ou entre deux rendez-vous.' },
          ].map((f) => (
            <div key={f.title} className="bg-card rounded-card p-6 border border-border">
              <h3 className="font-semibold text-text mb-2">{f.title}</h3>
              <p className="text-sm text-sub leading-relaxed">{f.desc}</p>
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
              q: 'C\'est quoi CM de Poche ?',
              a: 'Une app qui génère ta semaine de posts Instagram/TikTok en 3 minutes. Légendes à ta voix, hashtags, horaires, calendrier saisonnier. Tu valides, on programme.',
            },
            {
              q: 'En quoi c\'est différent de ChatGPT ?',
              a: 'ChatGPT donne du texte brut. CM de Poche connaît ta niche, ton ton, la saison, tes meilleurs horaires. Et il programme tout directement — pas de copier-coller.',
            },
            {
              q: 'Les légendes sont vraiment à ma voix ?',
              a: 'Tu choisis ton ton (inspirant, éducatif, drôle, authentique…) et l\'IA s\'adapte. Chaque post est modifiable avant publication.',
            },
            {
              q: 'Je dois connecter mon Instagram ?',
              a: 'Pour la programmation et l\'analyse : oui, via connexion sécurisée. Pour la génération seule : non, tu peux commencer sans.',
            },
            {
              q: 'Mes données sont en sécurité ?',
              a: 'Hébergement Europe, chiffrement TLS + AES-256, isolation par utilisateur. Aucune donnée vendue. Suppression immédiate sur demande. RGPD.',
            },
            {
              q: 'Je peux annuler quand je veux ?',
              a: 'Oui. Zéro engagement, zéro frais cachés. Le plan gratuit reste gratuit pour toujours.',
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
        <p className="text-sub mb-8">3 minutes. Aucune carte bancaire.</p>
        <Link href="/login" className="inline-block px-10 py-4 rounded-pill bg-terra text-white font-semibold text-lg hover:opacity-90 transition-opacity">
          Créer mon premier planning
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
            <a href="mailto:groupe.cogitium@gmail.com" className="hover:text-text transition-colors">Contact</a>
          </div>
          <p className="text-xs text-muted">© 2026 CM de Poche</p>
        </div>
      </footer>
    </div>
  );
}
