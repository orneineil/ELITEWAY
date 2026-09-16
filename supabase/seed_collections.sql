-- ============================================================================
-- ELITEWAY — collections éditoriales "EliteWay Edit" (4 collections de lancement)
-- À exécuter APRÈS schema_v2_catalog.sql ET seed_establishments.sql.
-- Rejouable sans risque (upsert sur le slug).
-- ============================================================================

insert into public.collections (slug, title, intent_text, cover_image, sort_order)
values ('riviera-edit', 'The Riviera Edit', 'Notre sélection pour découvrir la Côte d''Azur à son meilleur — cinq adresses qui résument tout ce qu''EliteWay recherche.', '/etab-chevre-dor-1.jpg', 0)
on conflict (slug) do update set title = excluded.title, intent_text = excluded.intent_text, cover_image = excluded.cover_image, sort_order = excluded.sort_order;

delete from public.collection_items where collection_id = (select id from public.collections where slug = 'riviera-edit');
insert into public.collection_items (collection_id, establishment_id, sort_order)
select (select id from public.collections where slug = 'riviera-edit'), v.est_id, v.ord
from (values
  ('chevre-dor', 0),
  ('hotel-cap-eden-roc', 1),
  ('fraser-yachts-monaco', 2),
  ('thermes-marins-monaco', 3),
  ('monacair-monaco', 4)
) as v(est_id, ord);

insert into public.collections (slug, title, intent_text, cover_image, sort_order)
values ('after-dark', 'After Dark', 'Quand la Côte d''Azur s''illumine — nos adresses et soirées pour une nuit mémorable.', 'https://images.unsplash.com/photo-1768295984941-60ff9037e294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByb29mdG9wJTIwYmFyJTIwY29ja3RhaWwlMjBQYXJpc3xlbnwxfHx8fDE3ODExMDcyNjR8MA&ixlib=rb-4.1.0&q=80&w=1080', 1)
on conflict (slug) do update set title = excluded.title, intent_text = excluded.intent_text, cover_image = excluded.cover_image, sort_order = excluded.sort_order;

delete from public.collection_items where collection_id = (select id from public.collections where slug = 'after-dark');
insert into public.collection_items (collection_id, establishment_id, sort_order)
select (select id from public.collections where slug = 'after-dark'), v.est_id, v.ord
from (values
  ('rooftop-eclat', 0),
  ('palme-dor', 1),
  ('french-riviera-parties-monaco', 2),
  ('bal-de-la-rose-monaco', 3)
) as v(est_id, ord);

insert into public.collections (slug, title, intent_text, cover_image, sort_order)
values ('private-escapes', 'Private Escapes', 'Pour s''extraire du monde, en toute discrétion — nos échappées les plus privées.', 'https://images.unsplash.com/photo-1518860308377-800f02d5498a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBzcGElMjB3ZWxsbmVzcyUyMHJldHJlYXR8ZW58MXx8fHwxNzgwOTU4ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080', 2)
on conflict (slug) do update set title = excluded.title, intent_text = excluded.intent_text, cover_image = excluded.cover_image, sort_order = excluded.sort_order;

delete from public.collection_items where collection_id = (select id from public.collections where slug = 'private-escapes');
insert into public.collection_items (collection_id, establishment_id, sort_order)
select (select id from public.collections where slug = 'private-escapes'), v.est_id, v.ord
from (values
  ('villa-ephrussi-privatisee', 0),
  ('chateau-messardiere', 1),
  ('spa-guerlain-cheval-blanc', 2),
  ('camper-nicholsons-antibes', 3),
  ('heli-securite-cannes', 4)
) as v(est_id, ord);

insert into public.collections (slug, title, intent_text, cover_image, sort_order)
values ('michelin-and-more', 'Michelin & More', 'Les tables étoilées et confidentielles qui font la réputation gastronomique de la Riviera.', '/etab-louis-xv-1.jpg', 3)
on conflict (slug) do update set title = excluded.title, intent_text = excluded.intent_text, cover_image = excluded.cover_image, sort_order = excluded.sort_order;

delete from public.collection_items where collection_id = (select id from public.collections where slug = 'michelin-and-more');
insert into public.collection_items (collection_id, establishment_id, sort_order)
select (select id from public.collections where slug = 'michelin-and-more'), v.est_id, v.ord
from (values
  ('louis-xv', 0),
  ('mirazur', 1),
  ('chevre-dor', 2),
  ('palme-dor', 3),
  ('chantecler', 4)
) as v(est_id, ord);

