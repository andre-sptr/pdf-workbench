import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  indexNumber?: string;
  featured?: boolean;
  specTag?: string;
}

export default function ToolCard({
  icon: Icon,
  title,
  description,
  href,
  indexNumber,
  featured = false,
  specTag,
}: ToolCardProps) {
  return (
    <Link
      to={href}
      className={`group hm-sheet p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:border-cobalt focus-visible:border-cobalt hover:-translate-y-0.5 min-h-[168px] ${
        featured ? 'sm:col-span-2 border-foreground/25' : ''
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {indexNumber && <span>{indexNumber}</span>}
            {specTag && (
              <>
                <span aria-hidden="true">/</span>
                <span className={featured ? 'text-cobalt font-medium' : ''}>{specTag}</span>
              </>
            )}
          </div>

          <div className="w-10 h-10 rounded-xl border border-border bg-secondary/75 text-foreground group-hover:bg-[#2B3AE8] group-hover:text-white group-hover:border-[#2B3AE8] transition-colors flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        <h3
          className={`font-semibold text-foreground group-hover:text-cobalt transition-colors mt-4 ${
            featured ? 'text-xl' : 'text-base sm:text-lg'
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
          {description}
        </p>
      </div>

      <div className="pt-3 mt-5 border-t border-border/75 flex items-center justify-between text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
        <span>Buka meja kerja</span>
        <span>{featured ? 'Alur utama' : 'Siap pakai'}</span>
      </div>
    </Link>
  );
}
