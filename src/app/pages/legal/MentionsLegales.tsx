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

export function MentionsLegales() {
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
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Informations légales</p>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", lineHeight: 1.1 }}>
          Mentions légales
        </h1>
        <p className="text-muted-foreground text-sm mt-3">
          Dernière mise à jour : 14 juin 2026
        </p>
      </div>

      <Section title="1. Éditeur du site">
        <p>
          La plateforme <strong className="text-foreground">EliteWay</strong> est éditée par la société
          EliteWay SAS, société par actions simplifiée au capital de 50 000 €, immatriculée au
          Registre du Commerce et des Sociétés de Paris sous le numéro <strong className="text-foreground">RCS Paris B 123 456 789</strong>.
        </p>
        <p>
          <strong className="text-foreground">Siège social :</strong> 24 avenue des Champs-Élysées, 75008 Paris, France
        </p>
        <p>
          <strong className="text-foreground">Numéro de TVA intracommunautaire :</strong> FR 12 123456789
        </p>
        <p>
          <strong className="text-foreground">Email :</strong>{" "}
          <a href="mailto:contact@eliteway.fr" className="text-primary hover:underline">
            contact@eliteway.fr
          </a>
        </p>
        <p>
          <strong className="text-foreground">Téléphone :</strong> +33 (0)1 XX XX XX XX
        </p>
        <p>
          <strong className="text-foreground">Directeur de la publication :</strong> [Nom du Directeur]
        </p>
      </Section>

      <Section title="2. Hébergement">
        <p>
          Le site EliteWay est hébergé par la société Cloudflare, Inc., dont le siège social est
          situé au 101 Townsend St, San Francisco, CA 94107, États-Unis.
        </p>
        <p>
          <strong className="text-foreground">Site web :</strong>{" "}
          <span className="text-foreground">www.cloudflare.com</span>
        </p>
      </Section>

      <Section title="3. Propriété intellectuelle">
        <p>
          L'ensemble du contenu de la plateforme EliteWay — textes, images, illustrations, logos,
          icônes, sons, logiciels, bases de données, etc. — est la propriété exclusive d'EliteWay SAS
          ou de ses partenaires, et est protégé par les lois françaises et internationales relatives
          à la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication, adaptation ou exploitation
          de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est
          interdite sans autorisation écrite préalable d'EliteWay SAS.
        </p>
        <p>
          Le non-respect de cette interdiction constitue une contrefaçon pouvant engager la
          responsabilité civile et pénale du contrefacteur.
        </p>
      </Section>

      <Section title="4. Contenu partenaires et établissements">
        <p>
          EliteWay est une plateforme de mise en relation. Les descriptions, photographies et
          informations relatives aux établissements et prestataires partenaires sont fournies par
          ces derniers sous leur propre responsabilité.
        </p>
        <p>
          EliteWay SAS ne peut être tenu responsable des éventuelles inexactitudes dans les
          informations communiquées par les partenaires et décline toute responsabilité quant
          aux prestations effectivement fournies par ces tiers.
        </p>
      </Section>

      <Section title="5. Limitation de responsabilité">
        <p>
          EliteWay SAS s'engage à mettre en œuvre tous les moyens nécessaires pour assurer un
          accès continu et de qualité à sa plateforme. Cependant, la société ne peut garantir
          l'absence d'interruption ou d'erreur dans le fonctionnement du site.
        </p>
        <p>
          EliteWay SAS ne saurait être tenu responsable des dommages directs ou indirects
          résultant de l'utilisation ou de l'impossibilité d'utiliser la plateforme, ni des
          dommages liés à l'accès frauduleux par un tiers aux données de l'utilisateur.
        </p>
      </Section>

      <Section title="6. Liens hypertextes">
        <p>
          La plateforme EliteWay peut contenir des liens vers des sites tiers. Ces liens sont
          fournis à titre informatif uniquement. EliteWay SAS n'exerce aucun contrôle sur le contenu
          de ces sites et décline toute responsabilité quant aux informations qui y sont publiées.
        </p>
      </Section>

      <Section title="7. Droit applicable et juridiction compétente">
        <p>
          Les présentes mentions légales sont régies par le droit français. En cas de litige,
          les tribunaux compétents seront ceux du ressort de la Cour d'appel de Paris, sauf
          disposition légale contraire.
        </p>
      </Section>

      <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
        <p className="text-muted-foreground">Documents liés :</p>
        <div className="flex gap-4">
          <Link to="/confidentialite" className="text-primary hover:underline">
            Politique de confidentialité →
          </Link>
          <Link to="/cgu" className="text-primary hover:underline">
            CGU →
          </Link>
        </div>
      </div>
    </div>
  );
}
