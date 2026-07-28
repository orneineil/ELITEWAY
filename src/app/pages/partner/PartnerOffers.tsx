import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Plus, Edit2, Eye, EyeOff, Trash2, Star, Clock, Tag, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { usePartnerAuth } from "../../contexts/PartnerAuthContext";
import { establishments } from "../../data/establishments";

type Offer = {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  active: boolean;
  featured: boolean;
  bookings: number;
  image: string;
};

const MOCK_OFFERS: Offer[] = [
  {
    id: "o1",
    title: "Formule Déjeuner Prestige",
    description: "Menu 3 plats avec verre de bienvenue et café gourmand. Disponible du mardi au vendredi.",
    price: "22€/pers.",
    category: "Menu",
    active: true,
    featured: true,
    bookings: 14,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: "o2",
    title: "Soirée Romantique",
    description: "Table en terrasse avec vue mer, champagne d'accueil et dessert signature offerts.",
    price: "85€/couple",
    category: "Expérience",
    active: true,
    featured: false,
    bookings: 7,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: "o3",
    title: "Offre Membres EliteWay -15%",
    description: "Remise exclusive de 15% sur l'ensemble de la carte pour les membres Prestige et Élite.",
    price: "-15% membres",
    category: "Réduction",
    active: false,
    featured: false,
    bookings: 22,
    image: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
];

export function PartnerOffers() {
  const { partner, isAuthenticated } = usePartnerAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [showForm, setShowForm] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: "", description: "", price: "", category: "Menu" });

  if (!isAuthenticated) {
    navigate("/partner/login");
    return null;
  }

  const establishment = establishments.find(e => e.id === partner?.establishmentId);

  const toggleActive = (id: string) => {
    setOffers(offers.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };
  const toggleFeatured = (id: string) => {
    setOffers(offers.map(o => o.id === id ? { ...o, featured: !o.featured } : o));
  };
  const deleteOffer = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };
  const addOffer = () => {
    if (!newOffer.title || !newOffer.price) return;
    const o: Offer = {
      id: `o${Date.now()}`,
      ...newOffer,
      active: true,
      featured: false,
      bookings: 0,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    };
    setOffers([...offers, o]);
    setNewOffer({ title: "", description: "", price: "", category: "Menu" });
    setShowForm(false);
  };

  const OFFER_CATEGORIES = ["Menu", "Expérience", "Réduction", "Événement", "Pack", "Autre"];

  return (
    <div className="min-h-screen bg-background max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <Link to="/partner/dashboard" className="w-9 h-9 rounded-xl bg-card border border-border/60 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem" }}>Gestion des offres</h1>
            {establishment && <p className="text-xs text-muted-foreground">{establishment.name}</p>}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/85 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Offres actives",    value: offers.filter(o => o.active).length },
            { label: "Offres en vedette", value: offers.filter(o => o.featured).length },
            { label: "Réservations tot.", value: offers.reduce((s, o) => s + o.bookings, 0) },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border/50 rounded-xl p-3 text-center">
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }} className="text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-5">
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }} className="mb-4">Nouvelle offre</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5">Titre *</label>
                <input value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
                  placeholder="Ex : Formule déjeuner, Offre spéciale…"
                  className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm mb-1.5">Description</label>
                <textarea value={newOffer.description} onChange={e => setNewOffer({ ...newOffer, description: e.target.value })}
                  rows={3} placeholder="Décrivez votre offre en détail…"
                  className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1.5">Prix *</label>
                  <input value={newOffer.price} onChange={e => setNewOffer({ ...newOffer, price: e.target.value })}
                    placeholder="Ex : 35€/pers."
                    className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm mb-1.5">Catégorie</label>
                  <select value={newOffer.category} onChange={e => setNewOffer({ ...newOffer, category: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    {OFFER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addOffer} disabled={!newOffer.title || !newOffer.price}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm disabled:opacity-40 hover:bg-primary/85 transition-colors">
                  Créer l'offre
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-3 border border-border/60 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Offers list */}
        <div className="space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${offer.active ? "border-border/60" : "border-border/30 opacity-60"}`}>
              <div className="flex">
                {/* Image */}
                <div className="w-20 shrink-0">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" style={{ minHeight: "80px" }} />
                </div>
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.95rem" }} className="leading-tight">{offer.title}</p>
                      {offer.featured && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full flex items-center gap-1">
                          <Star className="w-2.5 h-2.5" /> Vedette
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{offer.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-primary">{offer.price}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Tag className="w-3 h-3" />{offer.category}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{offer.bookings} rés.
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions bar */}
              <div className="border-t border-border/40 px-4 py-2.5 flex items-center justify-between">
                {/* Active toggle */}
                <button onClick={() => toggleActive(offer.id)} className={`flex items-center gap-1.5 text-xs transition-colors ${offer.active ? "text-emerald-400" : "text-muted-foreground"}`}>
                  {offer.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {offer.active ? "Active" : "Inactive"}
                </button>

                <div className="flex items-center gap-1">
                  <button onClick={() => toggleFeatured(offer.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${offer.featured ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`} title="Mettre en vedette">
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Modifier">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => toggleActive(offer.id)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Visibilité">
                    {offer.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => deleteOffer(offer.id)} className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors" title="Supprimer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to dashboard */}
        <Link to="/partner/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-6 justify-center">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
