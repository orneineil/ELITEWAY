import { LucideIcon } from "lucide-react";

interface CategorySectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export function CategorySection({
  id,
  icon: Icon,
  title,
  subtitle,
  description,
  imageUrl,
}: CategorySectionProps) {
  return (
    <section id={id} className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-widest text-primary">
                {subtitle}
              </span>
            </div>
            <h2 className="mb-6">{title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {description}
            </p>
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Réserver maintenant
            </button>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative rounded-lg overflow-hidden aspect-[4/3] border border-border">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
