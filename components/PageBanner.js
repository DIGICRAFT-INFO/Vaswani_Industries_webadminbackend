import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PageBanner({ title, breadcrumbs = [], backgroundImage }) {
  return (
    <section
      className="page-banner-bg relative min-h-[220px] md:min-h-[280px] flex items-center justify-center"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      aria-label={`${title} page banner`}>
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-widest uppercase mb-4 drop-shadow-lg">
          {title}
        </h1>
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="text-gray-300 hover:text-teal-400 transition-colors font-medium uppercase tracking-wide text-xs">
              Home
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
                {b.href ? (
                  <Link href={b.href}
                    className="text-gray-300 hover:text-teal-400 transition-colors font-medium uppercase tracking-wide text-xs">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-teal-400 font-semibold uppercase tracking-wide text-xs">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
