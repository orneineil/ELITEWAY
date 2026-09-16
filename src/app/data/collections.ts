import { supabase } from "../lib/supabase";

// EliteWay Edit — collections éditoriales, gérées dans Supabase (table
// `collections`/`collection_items`, schema_v2_catalog.sql). Contrairement au
// catalogue d'établissements (encore statique dans establishments.ts), les
// collections vivent uniquement en base : c'est la voix éditoriale d'EliteWay,
// pas un simple filtre calculé côté client.

export interface CollectionSummary {
  id: string;
  slug: string;
  title: string;
  intentText: string | null;
  coverImage: string | null;
}

export async function fetchCollections(): Promise<CollectionSummary[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, title, intent_text, cover_image")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    intentText: c.intent_text,
    coverImage: c.cover_image,
  }));
}

export async function fetchCollectionBySlug(slug: string): Promise<{ collection: CollectionSummary; establishmentIds: string[] } | null> {
  const { data: collection, error } = await supabase
    .from("collections")
    .select("id, slug, title, intent_text, cover_image")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !collection) return null;

  const { data: items } = await supabase
    .from("collection_items")
    .select("establishment_id, sort_order")
    .eq("collection_id", collection.id)
    .order("sort_order", { ascending: true });

  return {
    collection: {
      id: collection.id,
      slug: collection.slug,
      title: collection.title,
      intentText: collection.intent_text,
      coverImage: collection.cover_image,
    },
    establishmentIds: (items ?? []).map((i) => i.establishment_id),
  };
}
