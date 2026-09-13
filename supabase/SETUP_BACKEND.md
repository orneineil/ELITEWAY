# Mise en place du backend sécurisé ELITEWAY

Ce guide te permet de créer la base de données qui rendra l'application réellement fonctionnelle et sécurisée (comptes, réservations, paiements, espace partenaire, admin). Aucune carte bancaire n'est nécessaire pour les comptes de test.

## Étape 1 — Créer le projet Supabase (base de données + comptes utilisateurs)

1. Va sur https://supabase.com et crée un compte gratuit (avec ton email).
2. Clique "New Project". Choisis un nom (ex: "eliteway"), un mot de passe de base de données (note-le de côté), et une région proche (Europe — Paris ou Frankfurt).
3. Attends 1-2 minutes que le projet soit prêt.
4. Dans le menu de gauche, va dans **SQL Editor** → **New query**.
5. Ouvre le fichier `supabase/schema.sql` (livré avec ce message), colle tout son contenu dans l'éditeur, puis clique **Run**. Cela crée toutes les tables et les règles de sécurité en une fois.
6. Va dans **Project Settings** (icône engrenage) → **API**. Tu y trouveras :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (une longue chaîne de caractères)

   Ces deux informations ne sont **pas secrètes** — elles sont faites pour être utilisées côté application. Envoie-les-moi ici dans le chat.

   ⚠️ Ne m'envoie jamais la **service_role key** ni le mot de passe de la base de données — je n'en ai pas besoin, et elle ne doit jamais quitter Supabase.

## Étape 2 — Créer le compte Stripe (paiement, en mode test)

1. Va sur https://stripe.com et crée un compte gratuit.
2. Reste en **mode Test** (interrupteur en haut à droite du tableau de bord Stripe — il doit être sur "Test mode"). En mode test, aucun vrai paiement n'est débité : on utilise des numéros de carte factices (ex: 4242 4242 4242 4242) pour démontrer le parcours complet à tes partenaires.
3. Dans **Developers → API keys**, copie la **Publishable key** (commence par `pk_test_...`) et envoie-la-moi.
4. La **Secret key** (`sk_test_...`) ne doit jamais être partagée dans le chat — je te donnerai l'endroit exact où la coller directement dans Vercel (variable d'environnement chiffrée) quand on arrivera à cette étape.

## Étape 3 — Me transmettre

Une fois les deux étapes faites, envoie-moi simplement :
- L'URL du projet Supabase + la clé anon public
- La clé publique Stripe (`pk_test_...`)

Je m'occupe de tout le reste : branchement de l'authentification, des réservations, du paiement de test, de l'espace partenaire et de ton tableau de bord admin — avec un vrai contrôle d'accès à chaque étape.

## Pourquoi ces précautions ?

- Les clés "publiques" (anon, publishable) sont conçues pour être visibles dans le code de l'application — ce n'est pas une faille.
- Les clés "secrètes" (service_role, secret Stripe) donnent un accès total et ne doivent **jamais** transiter par le chat ou être écrites dans le code : elles vivent uniquement dans les variables d'environnement sécurisées de Vercel.
- Toutes les données (réservations, messages, commissions) seront protégées par des règles strictes en base (Row Level Security) : un client ne peut voir que ses propres réservations, un partenaire que celles de son établissement, et le tableau de bord admin ne sera accessible qu'après connexion avec un rôle admin.
