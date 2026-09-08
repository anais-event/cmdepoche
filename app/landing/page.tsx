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
  description: 'Application SaaS pour micro-influenceurs. Génère une semaine complète de contenu Instagram et TikTok en 3 minutes grâce à l\'IA.',
  url: 'https://cmdepoche.com',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'EUR', description: '10 crédits/mois' },
    { '@type': 'Offer', name: 'Pro', price: '29', priceCurrency: 'EUR', billingIncrement: 'P1M', description: '100 crédits/mois, analyse profil' },
    { '@type': 'Offer', name: 'Business', price: '49', priceCurrency: 'EUR', billingIncrement: 'P1M', description: '350 crédits/mois, analyses illimitées' },
  ],
  featureList: ['Génération IA de contenu', 'Calendrier éditorial saisonnier', 'Programmation Instagram/TikTok', 'Analyse de profil Instagram'],
  creator: { '@type': 'Organization', name: 'CM de Poche', email: 'groupe.cogitium@gmail.com' },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-600 to-pink-500 flex items-center justify-center text-xl">
            ✦
          </div>
          <span className="text-xl font-bold font-cinzel">CM de Poche</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#problem" className="text-sm text-gray-600 hover:text-terracotta-600 transition-colors hidden sm:block">
            Le problème
          </a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-terracotta-600 transition-colors hidden sm:block">
            Tarifs
          </a>
          <a href="#faq" className="text-sm text-gray-600 hover:text-terracotta-600 transition-colors hidden sm:block">
            FAQ
          </a>
          <Link href="/login" className="px-5 py-2.5 rounded-full bg-terracotta-600 text-white text-sm font-semibold hover:bg-terracotta-700 transition-colors">
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero — Résultat + Temps */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block bg-sauge-600/10 text-sauge-700 text-xs font-bold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
          Pour créateurs et micro-influenceurs
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-cinzel leading-[1.1] mb-6">
          Ta semaine de posts<br />
          <span className="text-terracotta-600">créée en 3 minutes.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Décris ta niche. CM de Poche génère ta semaine complète — légendes, hashtags, formats, horaires — adaptée à ta voix et à la saison. Prête à publier.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="px-8 py-4 rounded-2xl bg-terracotta-600 text-white font-bold text-lg hover:bg-terracotta-700 transition-all hover:scale-[1.02] shadow-lg shadow-terracotta-600/20">
            Essayer gratuitement →
          </Link>
          <a href="#how" className="px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-terracotta-600 hover:text-terracotta-600 transition-colors">
            Comment ça marche
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-5">10 crédits offerts • Pas de carte bancaire • 3 minutes</p>
      </section>

      {/* Social proof bar */}
      <section className="w-full max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 text-center">
            <div className="text-3xl font-bold text-terracotta-600">3 min</div>
            <div className="text-sm text-gray-500 mt-1">pour une semaine complète</div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 text-center">
            <div className="text-3xl font-bold text-sauge-600">100%</div>
            <div className="text-sm text-gray-500 mt-1">adapté à ta voix et ta niche</div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 text-center">
            <div className="text-3xl font-bold text-terracotta-600">0</div>
            <div className="text-sm text-gray-500 mt-1">panne d&apos;inspiration</div>
          </div>
        </div>
      </section>

      {/* Le vrai problème */}
      <section id="problem" className="w-full max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Le vrai problème</div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel leading-tight">
            Tu sais que poster régulièrement<br />= croissance.
          </h2>
          <p className="text-xl text-gray-600 mt-4">Le faire chaque semaine t&apos;épuise.</p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              icon: '😩',
              title: 'Le « je poste quoi aujourd\'hui ? »',
              desc: 'Chaque semaine, tu dois réinventer tes posts. Ce n\'est pas la compétence qui manque — c\'est l\'énergie créative à répétition.',
            },
            {
              icon: '👻',
              title: 'Des posts jolis, zéro engagement',
              desc: 'Sans les bons hashtags, les bons horaires et les bons formats, tes posts passent inaperçus. Et tu ne sais pas pourquoi.',
            },
            {
              icon: '⏰',
              title: '2h par semaine dans le vide',
              desc: 'Trouver l\'idée, écrire la légende, chercher les hashtags, choisir l\'heure… Un rituel qui draine ton énergie pour un résultat incertain.',
            },
            {
              icon: '📉',
              title: 'Des semaines sans poster',
              desc: 'La vie reprend le dessus, tu postes une fois, puis plus rien pendant 10 jours. L\'algorithme te pénalise. Tu recommences de zéro.',
            },
          ].map((pain) => (
            <div key={pain.title} className="flex gap-4 bg-white rounded-2xl p-5 border-2 border-gray-200">
              <span className="text-2xl flex-shrink-0">{pain.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{pain.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{pain.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* La solution — Mock visuel */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-sauge-600 uppercase tracking-widest mb-3">La solution</div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel">
            CM de Poche fait le travail.<br />
            <span className="text-terracotta-600">Tu valides.</span>
          </h2>
        </div>

        {/* Mock planning card */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 sm:p-8 max-w-lg mx-auto shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-xs text-terracotta-600 font-bold uppercase tracking-widest">Ta semaine</div>
              <div className="text-lg font-bold font-cinzel mt-1">Semaine du 25 août</div>
            </div>
            <div className="bg-sauge-600/10 text-sauge-700 text-xs font-bold px-3 py-1 rounded-full">5 posts</div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { day: 'Lundi', time: '18:30', format: 'Photo', score: 94, caption: 'La rentrée c\'est le moment de...' },
              { day: 'Mardi', time: '12:15', format: 'Carousel', score: 91, caption: '3 erreurs que tout le monde...' },
              { day: 'Jeudi', time: '19:00', format: 'Reel', score: 96, caption: 'POV : tu découvres que...' },
              { day: 'Vendredi', time: '08:30', format: 'Photo', score: 88, caption: 'Ce weekend je vous prépare...' },
              { day: 'Dimanche', time: '17:45', format: 'Carousel', score: 92, caption: 'Recap de la semaine...' },
            ].map((post) => (
              <div key={post.day} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta-600/20 to-sauge-600/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {post.format === 'Reel' ? '▶' : post.format === 'Carousel' ? '◫' : '◻'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{post.day}</span>
                    <span className="text-[10px] text-gray-400">{post.time}</span>
                    <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500">{post.format}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{post.caption}</p>
                </div>
                <div className={`text-xs font-bold ${post.score > 90 ? 'text-green-600' : 'text-terracotta-600'}`}>
                  {post.score}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Généré par IA en 47s</span>
            <div className="bg-terracotta-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
              Programmer tout →
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how" className="w-full max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-terracotta-600 uppercase tracking-widest mb-3">4 étapes</div>
          <h2 className="text-3xl font-bold font-cinzel">Ta semaine en autopilot</h2>
        </div>
        <div className="flex flex-col gap-6">
          {[
            { step: '1', title: 'Décris-toi', desc: 'Ta marque, ta niche, ton ton de voix. Tu fais ça une seule fois.', time: '2 min' },
            { step: '2', title: 'Importe tes visuels', desc: 'Glisse tes photos. On les associe aux posts automatiquement.', time: '1 min' },
            { step: '3', title: 'L\'IA génère ta semaine', desc: 'Légendes percutantes, hashtags stratégiques, horaires optimaux, formats variés. Adapté à la saison et aux événements.', time: '47s' },
            { step: '4', title: 'Valide et programme', desc: 'Tu approuves, tu modifies si tu veux, tu programmes. CM de Poche publie au bon moment.', time: '1 min' },
          ].map((s) => (
            <div key={s.step} className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                {s.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <span className="text-[10px] bg-sauge-600/10 text-sauge-700 px-2 py-0.5 rounded-full font-bold">{s.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparaison */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">La vraie question</div>
          <h2 className="text-3xl font-bold font-cinzel">
            « J&apos;ai déjà Canva et ChatGPT. »
          </h2>
          <p className="text-gray-600 mt-3">Nous aussi. Le problème : aucun des deux ne gère ta semaine.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Canva */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="text-2xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2">Canva</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Du design, sans stratégie. De beaux visuels qui ne mènent nulle part. Et toujours la question : « J&apos;écris quoi en légende ? »
            </p>
            <div className="mt-4 text-xs text-red-500 font-semibold">✕ Pas de légendes, pas d&apos;horaires, pas de hashtags</div>
          </div>

          {/* ChatGPT */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="font-bold text-lg mb-2">ChatGPT</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Du texte générique, sans planning ni saisonnalité. À toi de prompter, de structurer ta semaine, de trouver les hashtags.
            </p>
            <div className="mt-4 text-xs text-red-500 font-semibold">✕ Pas de planning, pas de programmation, pas adapté</div>
          </div>

          {/* CM de Poche */}
          <div className="bg-white rounded-2xl p-6 border-2 border-terracotta-600 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
              La solution
            </div>
            <div className="text-2xl mb-3">✦</div>
            <h3 className="font-bold text-lg mb-2 text-terracotta-600">CM de Poche</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ta semaine complète — légendes à ta voix, hashtags stratégiques, horaires optimaux, calendrier saisonnier — générée et programmée en 3 minutes.
            </p>
            <div className="mt-4 text-xs text-sauge-600 font-semibold">✓ Tout inclus. Rien à assembler.</div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="features" className="w-full max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-sauge-600 uppercase tracking-widest mb-3">Fonctionnalités</div>
          <h2 className="text-3xl font-bold font-cinzel">Tout ce qui te manquait.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: '✨', title: 'Légendes IA', desc: 'Écrites dans ton ton de voix, avec des CTA qui engagent. Jamais génériques.' },
            { icon: '📅', title: 'Calendrier saisonnier', desc: 'Maronnier français intégré. Saint-Valentin, Rentrée, Black Friday — tout est suggéré au bon moment.' },
            { icon: '#️⃣', title: 'Hashtags stratégiques', desc: 'Mix automatique : 2 gros + 2 moyens + 2 niche. Maximise la portée sans effort.' },
            { icon: '⏰', title: 'Horaires optimaux', desc: 'Publie quand ton audience est active. Créneaux calculés par format et par jour.' },
            { icon: '📊', title: 'Analyse de profil', desc: 'Comprends ce qui marche. Engagement, meilleurs formats, audience. Données réelles Instagram.' },
            { icon: '📱', title: 'Mobile-first', desc: 'Conçu pour ton téléphone. Crée ta semaine depuis le canapé, le tram ou entre deux rendez-vous.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-terracotta-600/30 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-terracotta-600 uppercase tracking-widest mb-3">Ils l&apos;utilisent</div>
          <h2 className="text-3xl font-bold font-cinzel">Des créateurs comme toi.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              quote: 'Avant je passais 2h le dimanche à préparer ma semaine. Maintenant c\'est fait en 3 minutes et les légendes sont meilleures que les miennes.',
              name: 'Léa M.',
              role: 'Créatrice lifestyle',
              stars: 5,
            },
            {
              quote: 'Le calendrier saisonnier c\'est le game changer. Je ne rate plus jamais un événement et mes posts sont toujours d\'actualité.',
              name: 'Thomas R.',
              role: 'Coach fitness',
              stars: 5,
            },
            {
              quote: 'J\'ai enfin de la régularité. 3 posts par semaine, tous les weeks, sans effort. Mon engagement a doublé en 2 mois.',
              name: 'Sarah K.',
              role: 'Foodie & recettes',
              stars: 5,
            },
          ].map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="text-amber-400 text-sm mb-3">{'★'.repeat(t.stars)}</div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-terracotta-600/30 to-sauge-600/30 flex items-center justify-center text-xs font-bold text-gray-600">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-terracotta-600 uppercase tracking-widest mb-3">Tarifs</div>
          <h2 className="text-3xl font-bold font-cinzel">Commence gratuitement.</h2>
          <p className="text-gray-600 mt-3">Upgrade quand tu sens la différence.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Gratuit',
              price: '0€',
              period: '/mois',
              badge: null,
              highlight: false,
              features: ['10 crédits/mois', '~5 posts', 'Légendes + hashtags IA', 'Watermark CM de Poche', 'Support communauté'],
              cta: 'Commencer gratuitement',
            },
            {
              name: 'Pro',
              price: '29€',
              period: '/mois',
              badge: '⭐ Populaire',
              highlight: true,
              features: ['100 crédits/mois', '~40-50 publications', 'Sans watermark', '1 analyse de profil/mois', 'Calendrier éditorial', 'Support email'],
              cta: 'Passer à Pro',
            },
            {
              name: 'Business',
              price: '49€',
              period: '/mois',
              badge: null,
              highlight: false,
              features: ['350 crédits/mois', '~100+ publications', 'Analyses illimitées', 'Maronnier auto-adapté', 'Support prioritaire', 'API access'],
              cta: 'Choisir Business',
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-6 border-2 ${
                plan.highlight ? 'border-terracotta-600 shadow-xl scale-[1.02]' : 'border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta-600 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-lg font-bold font-cinzel mb-1">{plan.name}</h3>
              <div className="mb-5">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="flex flex-col gap-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-sauge-600 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`block text-center py-3.5 rounded-2xl font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-terracotta-600 text-white hover:bg-terracotta-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">Pas d&apos;engagement. Annule à tout moment. Pas de carte pour le plan gratuit.</p>
      </section>

      {/* FAQ */}
      <section id="faq" className="w-full max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-cinzel">Questions fréquentes</h2>
        </div>
        <div className="flex flex-col gap-3">
          {[
            {
              q: 'C\'est quoi CM de Poche ?',
              a: 'CM de Poche génère ta semaine de posts Instagram/TikTok en 3 minutes grâce à l\'IA. Légendes à ta voix, hashtags stratégiques, formats optimaux, horaires calculés, calendrier saisonnier. Tu valides, on programme.',
            },
            {
              q: 'En quoi c\'est différent de ChatGPT ?',
              a: 'ChatGPT te donne du texte brut sans contexte. CM de Poche connaît ta niche, ton ton, la saison, les événements à venir, tes meilleurs horaires. Et surtout : il programme tout directement. Pas de copier-coller.',
            },
            {
              q: 'Les légendes sont-elles vraiment à ma voix ?',
              a: 'Oui. Tu choisis ton ton (inspirant, éducatif, humoristique, authentique…) et l\'IA s\'y adapte. Aucune légende ne part sans ta validation — tu peux modifier chaque post avant de programmer.',
            },
            {
              q: 'C\'est quoi le calendrier saisonnier ?',
              a: 'Un maronnier éditorial français complet : 40+ événements par an (Nouvel An, Saint-Valentin, Fête des Mères, Rentrée, Black Friday, Noël…). L\'IA les intègre automatiquement dans tes posts au bon moment.',
            },
            {
              q: 'Je dois connecter mon Instagram ?',
              a: 'Pour la programmation et l\'analyse : oui, via connexion sécurisée (Instagram Graph API). Pour la génération de contenu seule : non, tu peux commencer sans connecter ton compte.',
            },
            {
              q: 'Mes données sont-elles en sécurité ?',
              a: 'Oui. Hébergement Europe (Supabase, Paris), chiffrement TLS + AES-256, isolation par utilisateur (Row Level Security). Aucune donnée vendue à des tiers. Suppression immédiate sur demande. RGPD compliant.',
            },
            {
              q: 'Je peux annuler quand je veux ?',
              a: 'Oui. Zéro engagement, zéro frais cachés. Tu gardes l\'accès jusqu\'à la fin de ta période. Le plan gratuit est gratuit pour toujours.',
            },
          ].map((faq) => (
            <details key={faq.q} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden group">
              <summary className="p-5 cursor-pointer font-semibold text-gray-900 hover:text-terracotta-600 transition-colors list-none flex justify-between items-center">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-sm">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold font-cinzel mb-4">
          Prêt à poster sans y penser ?
        </h2>
        <p className="text-gray-600 mb-8 text-lg">3 minutes. Aucune carte bancaire.</p>
        <Link href="/login" className="inline-block px-10 py-4 rounded-2xl bg-terracotta-600 text-white font-bold text-lg hover:bg-terracotta-700 transition-all hover:scale-[1.02] shadow-lg shadow-terracotta-600/20">
          Créer mon premier planning →
        </Link>
      </section>

      {/* Data & Privacy — Meta compliance */}
      <section id="data" className="w-full max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold font-cinzel text-center mb-6 text-gray-700">Données & Confidentialité</h2>
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4 text-sm text-gray-600">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Utilisation des données Instagram</h3>
            <p className="leading-relaxed">
              CM de Poche utilise l&apos;Instagram Graph API avec les permissions <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">instagram_manage_insights</code> et <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">instagram_content_publish</code> pour analyser les performances de votre profil et publier du contenu en votre nom, uniquement avec votre autorisation explicite. Un compte Instagram Professionnel ou Créateur est requis.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Données collectées</h3>
            <ul className="space-y-1">
              <li>• <strong>Profil :</strong> Nom, email, handle Instagram, préférences de contenu</li>
              <li>• <strong>Insights :</strong> Taux d&apos;engagement, données d&apos;audience (âge, localisation), horaires d&apos;activité</li>
              <li>• <strong>Contenu :</strong> Photos uploadées, légendes générées, hashtags, planning de publication</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Stockage & Sécurité</h3>
            <p className="leading-relaxed">
              Hébergement Europe (EU-West, Paris) via Supabase (PostgreSQL). Chiffrement TLS en transit, AES-256 au repos. Row Level Security (RLS) : chaque utilisateur n&apos;accède qu&apos;à ses propres données. Nous ne vendons jamais vos données.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Suppression & RGPD</h3>
            <p className="leading-relaxed">
              Supprimez votre compte et toutes vos données à tout moment. Export de données disponible sur demande. Si vous révoquez l&apos;accès Instagram, nous supprimons automatiquement les données associées sous 24 heures.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-10 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-terracotta-600 to-pink-500 flex items-center justify-center text-sm">
              ✦
            </div>
            <span className="font-bold font-cinzel">CM de Poche</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#data" className="hover:text-terracotta-600 transition-colors">Confidentialité</a>
            <a href="#faq" className="hover:text-terracotta-600 transition-colors">FAQ</a>
            <a href="mailto:groupe.cogitium@gmail.com" className="hover:text-terracotta-600 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-400">© 2026 CM de Poche. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
