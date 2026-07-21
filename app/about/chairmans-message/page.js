import PageBanner from '@/components/PageBanner';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = { title: "Chairman's Message | Vaswani Industries" };

const ABOUT_SIDEBAR = [
  { label: 'The Company', href: '/about/the-company' },
  { label: 'Our Vision & Mission', href: '/about/the-company#vision' },
  { label: "Chairman's Message", href: '/about/chairmans-message' },
  { label: 'Board of Directors', href: '/about/board-of-directors' },
  { label: 'Our Committees', href: '/about/committees' },
  { label: 'Familiarization Programme', href: '/about/familiarization-programme' },
];

async function getChairmanData() {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || '/api';
    const res = await fetch(`${API}/pages/about`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.page?.sections?.find(s => s.sectionKey === 'chairmans_message') : null;
  } catch { return null; }
}

export default async function ChairmanPage() {
  const section = await getChairmanData();

  const title = section?.title || '"We are a very subtle organization and we like to create examples from our work."';
  const paragraph = section?.paragraph || 'Over the last two decades the company has continuously diversified its product portfolio to include many customized value-added products. The company firmly believes in benchmark product quality, customer centric approach, people focus, ethical business practices and good corporate citizenship.';
  const paragraph2 = section?.paragraph2 || 'With vibrant and dedicated employees forming the core of our Group, we have grown from strength to strength under the dynamic leadership of our promoters and directors.';
  const image = section?.images?.[0]?.url || '/about_chairman_message.jpg';
  const buttons = section?.buttons || [{ text: 'Explore Our Businesses', url: '/products/sponge-iron', style: 'primary' }];

  return (
    <>
      <PageBanner title="ABOUT US" breadcrumbs={[{ label: "CHAIRMAN'S MESSAGE" }]} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar */}
        <div>
          <nav className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {ABOUT_SIDEBAR.map(({ label, href }) => {
              const isActive = href === '/about/chairmans-message';
              return (
                <Link key={label} href={href}
                  className={`flex items-center px-5 py-4 border-b border-gray-50 last:border-b-0 text-sm font-semibold transition-all
                    ${isActive ? 'bg-teal-500 text-white' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50 hover:pl-6'}`}>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Image */}
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img src={image} alt="Chairman" className="w-full h-[450px] object-cover" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <span className="inline-block bg-teal-500 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded">
                CHAIRMAN&apos;S MESSAGE
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                {title}
              </h2>

              <div className="space-y-4 text-base leading-relaxed text-gray-600">
                <p>{paragraph}</p>
                {paragraph2 && <p>{paragraph2}</p>}
              </div>

              {/* Buttons */}
              {buttons.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-4">
                  {buttons.filter(b => b.text).map((btn, i) => (
                    <Link key={i} href={btn.url || '#'}
                      className={`inline-flex items-center gap-2 px-6 py-3 font-bold rounded-full text-sm transition-all ${btn.style === 'outline' ? 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50' : btn.style === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg'}`}>
                      {btn.text} <ChevronRight size={16} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
