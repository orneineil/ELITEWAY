import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { establishments } from "../data/establishments";
import { fetchCollectionBySlug, CollectionSummary } from "../data/collections";
import { EstablishmentCard } from "../components/EstablishmentCard";

export function CollectionPage() {
  const { slug } = useParams();
  const [state, setState] = useState<{ collection: CollectionSummary; establishmentIds: string[] } | null | "loading">("loading");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setState("loading");
    fetchCollectionBySlug(slug).then((res) => {
      if (!cancelled) setState(res);
    });
    return () => { cancelled = true; };
  }, [slug]);

  if (state === "loading") {
    return (
      <div className="flex justify-center py-24">
        <Loader className="w-5 h-5 text-primary animate-spin" />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="max-w-sm mx-auto px-5 pt-20 text-center">
        <p className="text-muted-foreground mb-4">Collection introuvable.</p>
        <Link to="/categories" className="text-primary hover:underline">Retour à Discover</Link>
      </div>
    );
  }

  const { collection, establishmentIds } = state;
  const items = establishmentIds
    .map((id) => establishments.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <div className="max-w-lg mx-auto pb-28">

      <div className="relative overflow-hidden" style={{ height: "44svh", minHeight: 280, maxHeight: 380 }}>
        {collection.coverImage && (
          <img src={collection.coverImage} alt={collection.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.08 0.005 60 / 0.35) 0%, transparent 40%, var(--background) 98%)" }} />

        <Link
          to="/categories"
          className="absolute w-9 h-9 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-border/40"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)", left: "20px" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">EliteWay Edit</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", lineHeight: 1.05 }}>
            {collection.title}
          </h1>
        </div>
      </div>

      {collection.intentText && (
        <div className="px-5 pt-5 pb-2">
          <p className="text-[0.95rem] text-foreground/80 leading-relaxed italic" style={{ fontFamily: "var(--font-heading)" }}>
            {collection.intentText}
          </p>
        </div>
      )}

      <div className="px-5 pt-4 flex flex-col gap-5">
        {items.map((e) => (
          <div key={e.id} style={{ aspectRatio: "4 / 3.2" }}>
            <EstablishmentCard establishment={e} showPrice />
          </div>
        ))}
      </div>

    </div>
  );
}
