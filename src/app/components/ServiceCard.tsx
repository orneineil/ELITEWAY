import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export function ServiceCard({ title, description, imageUrl, category }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-2">
          {category}
        </div>
        <h3 className="mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all">
          <span>Découvrir</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
