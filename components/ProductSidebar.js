import Link from 'next/link';
import { ChevronRight, FileDown } from 'lucide-react';

const PRODUCTS = [
  { label: 'Forging Ingots & Billets', slug: 'forging-ingots-and-billets' },
  { label: 'Sponge Iron (DRI)', slug: 'sponge-iron' },
  { label: 'Power', slug: 'power' },
];

export default function ProductSidebar({ active }) {
  return (
    <aside className="space-y-4">
      <nav aria-label="Product navigation">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {PRODUCTS.map(({ label, slug }) => {
            const isActive = active === slug;
            return (
              <Link key={slug} href={`/products/${slug}`}
                className={`flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-b-0 text-sm font-semibold transition-all
                  ${isActive
                    ? 'bg-teal-500 text-white border-l-4 border-l-teal-600 pl-4'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50 hover:pl-6'
                  }`}>
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-70" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <a href="#" aria-label="Download product catalog PDF"
        className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-5 py-4 transition-colors w-full group">
        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors">
          <FileDown size={16} />
        </div>
        <div>
          <div className="font-bold text-sm">Download PDF</div>
          <div className="text-xs text-gray-400">Company Profile & Catalog</div>
        </div>
      </a>
    </aside>
  );
}
