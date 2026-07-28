import { useRef, useState, useLayoutEffect, useCallback, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollRowProps {
  children: ReactNode;
  className?: string;
  gap?: number;
}

export function ScrollRow({ children, className = "", gap = 12 }: ScrollRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const left  = el.scrollLeft > 2;
    const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 2;
    setCanLeft(left);
    setCanRight(right);
  }, []);

  // Run after every render so new children are measured
  useLayoutEffect(() => {
    update();
    // Retry after images/fonts might have changed layout
    const t = setTimeout(update, 150);
    const t2 = setTimeout(update, 600);

    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, children]);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? el.clientWidth * 0.65 : -(el.clientWidth * 0.65), behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Arrow controls */}
      <div className="flex items-center justify-end gap-1.5 px-5 mb-2">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          disabled={!canLeft}
          aria-label="Défiler à gauche"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
          style={{
            background:  canLeft ? "oklch(0.18 0.01 65)" : "oklch(0.14 0.006 60 / 0.5)",
            border:      `1px solid ${canLeft ? "oklch(0.74 0.09 80 / 0.45)" : "oklch(0.22 0.007 65 / 0.3)"}`,
            cursor:      canLeft ? "pointer" : "default",
            boxShadow:   canLeft ? "0 0 12px oklch(0.74 0.09 80 / 0.15)" : "none",
            opacity:     canLeft ? 1 : 0.3,
          }}
        >
          <ChevronLeft
            className="w-4 h-4"
            style={{ color: canLeft ? "oklch(0.74 0.09 80)" : "oklch(0.45 0.008 60)" }}
          />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          disabled={!canRight}
          aria-label="Défiler à droite"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
          style={{
            background:  canRight ? "oklch(0.18 0.01 65)" : "oklch(0.14 0.006 60 / 0.5)",
            border:      `1px solid ${canRight ? "oklch(0.74 0.09 80 / 0.45)" : "oklch(0.22 0.007 65 / 0.3)"}`,
            cursor:      canRight ? "pointer" : "default",
            boxShadow:   canRight ? "0 0 12px oklch(0.74 0.09 80 / 0.15)" : "none",
            opacity:     canRight ? 1 : 0.3,
          }}
        >
          <ChevronRight
            className="w-4 h-4"
            style={{ color: canRight ? "oklch(0.74 0.09 80)" : "oklch(0.45 0.008 60)" }}
          />
        </button>
      </div>

      {/* Scrollable row */}
      <div
        ref={ref}
        onScroll={update}
        className={`flex overflow-x-auto no-scrollbar pb-1 ${className}`}
        style={{ gap, paddingLeft: "20px", paddingRight: "20px" }}
      >
        {children}
      </div>
    </div>
  );
}
