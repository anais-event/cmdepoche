'use client';

export default function PrivacyPage() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const deletionCode = searchParams?.get('deletion');

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {deletionCode && (
        <div className="bg-sage-bg border border-sage/20 rounded-xl p-4 mb-6">
          <h2 className="font-cinzel text-base font-semibold text-text mb-1">Suppression confirmée</h2>
          <p className="text-sm text-sub">
            Vos données Instagram ont été supprimées. Code de confirmation : <code className="text-xs bg-card-alt px-1.5 py-0.5 rounded">{deletionCode}</code>
          </p>
        </div>
      )}

      <h1 className="font-cinzel text-2xl font-semibold text-text mb-8">Politique de confidentialité</h1>

      <div className="space-y-6 text-sm text-sub leading-relaxed">
        <section>
          <h2 className="font-cinzel text-base font-semibold text-text mb-2">1. Données collectées</h2>
          <p>
            CM de Poche collecte les données suivantes : adresse email, nom d&apos;utilisateur Instagram,
            statistiques publiques de votre profil Instagram (nombre d&apos;abonnés, taux d&apos;engagement),
            et les visuels que vous importez volontairement dans l&apos;application.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-base font-semibold text-text mb-2">2. Utilisation des données</h2>
          <p>
            Vos données sont utilisées exclusivement pour générer votre stratégie de contenu personnalisée,
            planifier vos publications, et afficher vos statistiques. Nous ne vendons ni ne partageons
            vos données avec des tiers.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-base font-semibold text-text mb-2">3. Connexion Instagram</h2>
          <p>
            Lorsque vous connectez votre compte Instagram via Meta, nous accédons à vos informations
            de profil public et vos statistiques d&apos;engagement. Vous pouvez révoquer cet accès à tout
            moment depuis les paramètres de votre compte Instagram ou depuis les réglages de CM de Poche.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-base font-semibold text-text mb-2">4. Stockage et sécurité</h2>
          <p>
            Vos données sont stockées de manière sécurisée sur les serveurs de Supabase (hébergés en Europe).
            Les tokens d&apos;accès Instagram sont chiffrés. Vos visuels sont stockés dans un espace privé
            accessible uniquement par votre compte.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-base font-semibold text-text mb-2">5. Suppression des données</h2>
          <p>
            Vous pouvez demander la suppression complète de vos données à tout moment en nous contactant
            par email. Vos données seront supprimées sous 30 jours.
          </p>
        </section>

        <section>
          <h2 className="font-cinzel text-base font-semibold text-text mb-2">6. Contact</h2>
          <p>
            Pour toute question relative à vos données personnelles, contactez-nous à :{' '}
            <a href="mailto:groupe.cogitium@gmail.com" className="text-terra underline">
              groupe.cogitium@gmail.com
            </a>
          </p>
        </section>

        <p className="text-xs text-muted pt-4">Dernière mise à jour : septembre 2026</p>
      </div>
    </div>
  );
}
