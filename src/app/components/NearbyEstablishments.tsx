import { useState } from "react";
import { MapPin, Locate, Loader } from "lucide-react";
import { establishments, cityCoordinates } from "../data/establishments";
import { EstablishmentCard } from "./EstablishmentCard";

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearby(userLat: number, userLng: number, radiusKm = 300) {
  return establishments
    .filter((e) => {
      const coords = cityCoordinates[e.city];
      if (!coords) return false;
      return getDistanceKm(userLat, userLng, coords[0], coords[1]) <= radiusKm;
    })
    .slice(0, 6);
}

function getNearestCityName(userLat: number, userLng: number): string {
  let nearest = "";
  let minDist = Infinity;
  for (const [city, [lat, lng]] of Object.entries(cityCoordinates)) {
    const d = getDistanceKm(userLat, userLng, lat, lng);
    if (d < minDist) { minDist = d; nearest = city; }
  }
  return nearest;
}

type Status = "idle" | "loading" | "success" | "denied" | "error";

export function NearbyEstablishments() {
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<typeof establishments>([]);
  const [cityName, setCityName] = useState("");

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearby = findNearby(latitude, longitude);
        const city = getNearestCityName(latitude, longitude);
        setCityName(city);
        setResults(nearby);
        setStatus("success");
      },
      () => setStatus("denied"),
      { timeout: 8000 }
    );
  };

  return (
    <section className="py-24 bg-card/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Près de vous</p>
          <h2 className="mb-3">Expériences à proximité</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Activez la localisation pour découvrir les expériences disponibles dans votre région.
          </p>

          {status === "idle" && (
            <button
              onClick={handleLocate}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:border-primary/50 hover:text-primary transition-colors text-sm"
            >
              <Locate className="w-4 h-4" />
              Activer la localisation
            </button>
          )}

          {status === "loading" && (
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader className="w-4 h-4 animate-spin" />
              Localisation en cours…
            </div>
          )}

          {status === "denied" && (
            <p className="text-sm text-muted-foreground">
              Localisation refusée. Autorisez l'accès dans les paramètres de votre navigateur.
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-muted-foreground">
              La géolocalisation n'est pas disponible sur cet appareil.
            </p>
          )}
        </div>

        {status === "success" && (
          <>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-10">
              <MapPin className="w-4 h-4 text-primary" />
              {results.length > 0
                ? `${results.length} expérience${results.length > 1 ? "s" : ""} trouvée${results.length > 1 ? "s" : ""} près de ${cityName}`
                : `Aucune expérience trouvée près de ${cityName} dans un rayon de 300 km.`}
            </div>
            {results.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {results.map((e) => (
                  <EstablishmentCard key={e.id} establishment={e} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
