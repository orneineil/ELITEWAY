import { Link } from "react-router";
import { ArrowLeft, Shield } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2
        className="mb-4 pb-2 border-b border-border/50"
        style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function DataTable({ rows }: { rows: { finalite: string; base: string; duree: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/50 mt-3">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <th className="text-left px-4 py-3 text-foreground font-medium">Finalité</th>
            <th className="text-left px-4 py-3 text-foreground font-medium">Base légale</th>
            <th className="text-left px-4 py-3 text-foreground font-medium">Durée de conservation</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/40 last:border-0">
              <td className="px-4 py-3">{row.finalite}</td>
              <td className="px-4 py-3">{row.base}</td>
              <td className="px-4 py-3">{row.duree}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PolitiqueConfidentialite() {
  return (
    <div className="max-w-2xl mx-auto px-5 pb-28 pt-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Protection des données</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", lineHeight: 1.1 }}>
          Politique de confidentialité
        </h1>
        <p className="text-muted-foreground text-sm mt-3">
          Dernière mise à jour : 14 juin 2026
        </p>
      </div>

      {/* RGPD badge */}
      <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/15 rounded-2xl mb-10">
        <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium mb-1">Conformité RGPD</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            EliteWay SAS traite vos données personnelles dans le respect du Règlement Général sur
            la Protection des Données (RGPD — Règlement UE 2016/679) et de la loi Informatique et
            Libertés n° 78-17 du 6 janvier 1978 modifiée.
          </p>
        </div>
      </div>

      <Section title="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données personnelles collectées via la plateforme
          EliteWay est :
        </p>
        <div className="bg-card border border-border/50 rounded-xl p-4 space-y-1">
          <p><strong className="text-foreground">EliteWay SAS</strong></p>
          <p>24 avenue des Champs-Élysées, 75008 Paris, France</p>
          <p>RCS Paris B 123 456 789</p>
          <p>
            Email DPO :{" "}
            <a href="mailto:dpo@eliteway.fr" className="text-primary hover:underline">
              dpo@eliteway.fr
            </a>
          </p>
        </div>
      </Section>

      <Section title="2. Données collectées">
        <p>Nous collectons les catégories de données suivantes :</p>
        <ul className="list-none space-y-2 mt-2">
          {[
            ["Données d'identification", "Prénom, nom, adresse email, mot de passe (hashé)"],
            ["Données de navigation", "Pages visitées, durée de session, adresse IP anonymisée"],
            ["Données de préférences", "Favoris, catégories consultées, historique de recherche"],
            ["Données de réservation", "Établissements réservés, dates, nombre de personnes"],
            ["Données d'abonnement", "Niveau de membership, historique de facturation"],
          ].map(([type, detail]) => (
            <li key={type} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>
                <strong className="text-foreground">{type} : </strong>
                {detail}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Nous ne collectons jamais de données sensibles (origines ethniques, opinions politiques,
          données de santé, données biométriques).
        </p>
      </Section>

      <Section title="3. Finalités et bases légales des traitements">
        <p>Vos données sont traitées pour les finalités suivantes :</p>
        <DataTable
          rows={[
            {
              finalite: "Création et gestion du compte client",
              base: "Exécution du contrat",
              duree: "3 ans après la dernière connexion",
            },
            {
              finalite: "Gestion des réservations",
              base: "Exécution du contrat",
              duree: "5 ans (obligations comptables)",
            },
            {
              finalite: "Gestion des abonnements Membership",
              base: "Exécution du contrat",
              duree: "5 ans après fin du contrat",
            },
            {
              finalite: "Personnalisation de l'expérience (favoris, recommandations)",
              base: "Intérêt légitime",
              duree: "Durée de vie du compte",
            },
            {
              finalite: "Envoi de newsletters et offres exclusives",
              base: "Consentement",
              duree: "Jusqu'au retrait du consentement",
            },
            {
              finalite: "Analyses statistiques et amélioration du service",
              base: "Intérêt légitime",
              duree: "13 mois (données anonymisées)",
            },
            {
              finalite: "Prévention de la fraude et sécurité",
              base: "Obligation légale / Intérêt légitime",
              duree: "1 an",
            },
          ]}
        />
      </Section>

      <Section title="4. Partage des données">
        <p>
          EliteWay ne vend ni ne loue vos données personnelles à des tiers. Vos données peuvent
          être partagées uniquement dans les cas suivants :
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            "Avec les établissements partenaires, dans le cadre strict de l'exécution d'une réservation que vous avez effectuée.",
            "Avec nos sous-traitants techniques (hébergement, paiement, emails transactionnels), soumis à des obligations de confidentialité strictes.",
            "Sur réquisition judiciaire ou administrative dûment motivée.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="5. Transferts hors Union Européenne">
        <p>
          Certains de nos prestataires techniques (hébergement, CDN) peuvent être établis hors
          de l'Union Européenne. Dans ce cas, le transfert est encadré par des garanties appropriées :
          clauses contractuelles types de la Commission Européenne ou décision d'adéquation.
        </p>
      </Section>

      <Section title="6. Sécurité des données">
        <p>
          EliteWay met en œuvre des mesures techniques et organisationnelles appropriées pour
          protéger vos données contre toute perte, destruction accidentelle, altération ou accès
          non autorisé :
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            "Chiffrement des données en transit (TLS/HTTPS) et au repos",
            "Hachage irréversible des mots de passe (bcrypt)",
            "Accès aux données limité aux personnes habilitées, soumises à confidentialité",
            "Journalisation des accès et détection d'anomalies",
            "Sauvegardes régulières et tests de restauration",
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="7. Vos droits">
        <p>
          Conformément au RGPD, vous disposez des droits suivants concernant vos données
          personnelles. Pour les exercer, contactez notre DPO à{" "}
          <a href="mailto:dpo@eliteway.fr" className="text-primary hover:underline">
            dpo@eliteway.fr
          </a>{" "}
          en joignant une copie d'un justificatif d'identité.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {[
            { droit: "Droit d'accès", desc: "Obtenir une copie de vos données" },
            { droit: "Droit de rectification", desc: "Corriger des données inexactes" },
            { droit: "Droit à l'effacement", desc: "Supprimer vos données (\"droit à l'oubli\")" },
            { droit: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré" },
            { droit: "Droit d'opposition", desc: "Vous opposer à certains traitements" },
            { droit: "Droit à la limitation", desc: "Limiter temporairement un traitement" },
            { droit: "Retrait du consentement", desc: "À tout moment pour les traitements basés sur votre consentement" },
            { droit: "Directives post-mortem", desc: "Définir le sort de vos données après votre décès" },
          ].map(({ droit, desc }) => (
            <div key={droit} className="bg-card border border-border/50 rounded-xl p-3.5">
              <p className="text-foreground text-xs font-medium mb-0.5">{droit}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4">
          En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la{" "}
          <strong className="text-foreground">CNIL</strong> (Commission Nationale de l'Informatique
          et des Libertés) — <span className="text-foreground">www.cnil.fr</span>.
        </p>
      </Section>

      <Section title="8. Cookies et traceurs">
        <p>
          EliteWay utilise des cookies fonctionnels indispensables au fonctionnement de la plateforme
          (gestion de session, préférences) et, avec votre consentement, des cookies analytiques
          anonymisés pour améliorer nos services.
        </p>
        <p>
          Vous pouvez paramétrer ou refuser les cookies non essentiels via notre bandeau de
          consentement lors de votre première visite, ou à tout moment via les paramètres de
          votre navigateur.
        </p>
      </Section>

      <Section title="9. Modifications de la présente politique">
        <p>
          EliteWay SAS se réserve le droit de modifier la présente politique de confidentialité à
          tout moment. En cas de modification substantielle, vous en serez informé par email ou
          par une notification sur la plateforme. La date de dernière mise à jour figure en haut
          du présent document.
        </p>
      </Section>

      <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
        <p className="text-muted-foreground">Documents liés :</p>
        <div className="flex gap-4">
          <Link to="/mentions-legales" className="text-primary hover:underline">
            Mentions légales →
          </Link>
          <Link to="/cgu" className="text-primary hover:underline">
            CGU →
          </Link>
        </div>
      </div>
    </div>
  );
}
