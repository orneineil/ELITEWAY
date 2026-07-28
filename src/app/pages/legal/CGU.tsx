import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

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

export function CGU() {
  return (
    <div className="max-w-2xl mx-auto px-5 pb-28 pt-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Conditions</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", lineHeight: 1.1 }}>
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-muted-foreground text-sm mt-3">
          Dernière mise à jour : 14 juin 2026
        </p>
      </div>

      <Section title="1. Objet">
        <p>
          Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et
          l'utilisation de la plateforme EliteWay, accessible via l'application mobile et le site
          web <strong className="text-foreground">eliteway.fr</strong>, exploitée par EliteWay SAS.
        </p>
        <p>
          Toute utilisation de la plateforme implique l'acceptation pleine et entière des présentes
          CGU. EliteWay SAS se réserve le droit de les modifier à tout moment ; les utilisateurs
          seront informés des modifications substantielles.
        </p>
      </Section>

      <Section title="2. Description du service">
        <p>
          EliteWay est une plateforme de mise en relation entre des utilisateurs et des prestataires
          de services haut de gamme (gastronomie, navigation, bien-être, aviation, œnologie,
          événements). EliteWay agit en qualité d'intermédiaire et ne fournit pas directement
          les prestations référencées.
        </p>
        <p>
          Les événements présentés dans la catégorie "Événements" sont proposés par des entreprises
          partenaires qui souhaitent les mettre en avant. EliteWay n'en est pas l'organisateur.
        </p>
      </Section>

      <Section title="3. Accès et création de compte">
        <p>L'accès à certaines fonctionnalités nécessite la création d'un compte :</p>
        <ul className="list-none space-y-2 mt-2">
          {[
            "Vous devez être âgé d'au moins 18 ans.",
            "Les informations fournies doivent être exactes, complètes et à jour.",
            "Vous êtes responsable de la confidentialité de vos identifiants.",
            "Tout accès depuis votre compte est réputé effectué par vous.",
            "Vous vous engagez à signaler immédiatement toute utilisation non autorisée.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="4. Abonnements Membership">
        <p>
          EliteWay propose des abonnements payants (Prestige, Élite) donnant accès à des
          fonctionnalités et offres exclusives. Ces abonnements sont régis par des Conditions
          Générales de Vente distinctes communiquées lors de la souscription.
        </p>
        <p>
          Les abonnements sont sans engagement de durée minimale, renouvelables automatiquement
          et résiliables à tout moment avec effet à la fin de la période en cours.
        </p>
      </Section>

      <Section title="5. Espace partenaire">
        <p>
          Les établissements partenaires s'engagent à fournir des informations exactes, à jour et
          non trompeuses concernant leurs services. Ils demeurent seuls responsables des prestations
          qu'ils proposent et de leur exécution.
        </p>
        <p>
          EliteWay SAS se réserve le droit de suspendre ou retirer tout partenaire ne respectant
          pas ces engagements ou dont les prestations feraient l'objet de plaintes récurrentes.
        </p>
      </Section>

      <Section title="6. Comportement des utilisateurs">
        <p>Il est interdit d'utiliser la plateforme pour :</p>
        <ul className="list-none space-y-2 mt-2">
          {[
            "Publier des avis frauduleux ou diffamatoires.",
            "Usurper l'identité d'un tiers.",
            "Tenter de contourner les mesures de sécurité de la plateforme.",
            "Extraire des données par scraping ou tout procédé automatisé non autorisé.",
            "Perturber le fonctionnement normal du service.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="7. Responsabilité d'EliteWay">
        <p>
          EliteWay agit en qualité d'intermédiaire et ne peut être tenu responsable des
          dommages résultant de l'inexécution ou de la mauvaise exécution des prestations par
          les partenaires, ni des informations inexactes fournies par ces derniers.
        </p>
        <p>
          EliteWay ne garantit pas la disponibilité permanente du service et se réserve le droit
          d'interrompre temporairement l'accès pour maintenance.
        </p>
      </Section>

      <Section title="8. Propriété intellectuelle">
        <p>
          Tous les droits de propriété intellectuelle sur la plateforme, son contenu, son design
          et sa marque sont la propriété exclusive d'EliteWay SAS (voir{" "}
          <Link to="/mentions-legales" className="text-primary hover:underline">
            Mentions légales
          </Link>).
        </p>
      </Section>

      <Section title="9. Résiliation du compte">
        <p>
          Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil
          ou en contactant{" "}
          <a href="mailto:contact@eliteway.fr" className="text-primary hover:underline">
            contact@eliteway.fr
          </a>.
          La suppression entraîne l'effacement de vos données dans les délais prévus par notre{" "}
          <Link to="/confidentialite" className="text-primary hover:underline">
            Politique de confidentialité
          </Link>.
        </p>
        <p>
          EliteWay SAS se réserve le droit de suspendre ou supprimer un compte en cas de violation
          des présentes CGU, sans préavis ni indemnité.
        </p>
      </Section>

      <Section title="10. Droit applicable et litiges">
        <p>
          Les présentes CGU sont régies par le droit français. En cas de litige, une solution
          amiable sera recherchée en priorité. À défaut, le litige sera soumis aux tribunaux
          compétents du ressort de la Cour d'appel de Paris.
        </p>
        <p>
          Conformément à l'article L. 612-1 du Code de la consommation, en cas de litige de
          consommation non résolu, vous pouvez recourir gratuitement à un médiateur de la
          consommation.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          Pour toute question relative aux présentes CGU, contactez-nous :{" "}
          <a href="mailto:contact@eliteway.fr" className="text-primary hover:underline">
            contact@eliteway.fr
          </a>
        </p>
      </Section>

      <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
        <p className="text-muted-foreground">Documents liés :</p>
        <div className="flex gap-4">
          <Link to="/mentions-legales" className="text-primary hover:underline">
            Mentions légales →
          </Link>
          <Link to="/confidentialite" className="text-primary hover:underline">
            Confidentialité →
          </Link>
        </div>
      </div>
    </div>
  );
}
