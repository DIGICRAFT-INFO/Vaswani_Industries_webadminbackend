import Link from 'next/link';
import PageBanner from '@/components/PageBanner';
import { FileDown, Flame, Box, BatteryCharging, SunMedium } from 'lucide-react';

export const metadata = {
  title: 'The Company',
  description: 'Learn about Vaswani Industries Limited — a publicly listed integrated steel manufacturing company headquartered in Central India, Chhattisgarh.',
  alternates: { canonical: '/about/the-company' },
};

const ABOUT_SIDEBAR = [
  { label: 'The Company', href: '/about/the-company' },
  { label: 'Our Vision & Mission', href: '/about/the-company#vision' },
  { label: "Chairman's Message", href: '/about/chairmans-message' },
  { label: 'Board of Directors', href: '/about/board-of-directors' },
  { label: 'Our Committees', href: '/about/committees' },
  { label: 'Familiarization Programme', href: '/about/familiarization-programme' },
];

const STATS = [
  { value: '90000', unit: 'MT', label: 'Production and Capacity of Sponge Iron', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  { value: '150000', unit: 'MT', label: 'Production and Capacity of Billets', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: '11.5', unit: 'MW', label: 'Production and Capacity of Power', icon: BatteryCharging, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { value: '66.25', unit: 'MW', label: 'Production and Capacity of Solar', icon: SunMedium, color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

async function getAboutPageData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BACKEND_URL || 'https://new.vaswaniindustries.com';
    const [aboutRes, homeRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/pages/about`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/pages/home`, { cache: 'no-store' }),
    ]);
    const aboutData = aboutRes.status === 'fulfilled' && aboutRes.value.ok ? await aboutRes.value.json() : null;
    const homeData = homeRes.status === 'fulfilled' && homeRes.value.ok ? await homeRes.value.json() : null;
    return { about: aboutData?.success ? aboutData.page : null, stats: homeData?.success ? homeData.page?.sections?.find(s => s.sectionKey === 'stats')?.extra?.stats : null };
  } catch (err) {
    return { about: null, stats: null };
  }
}

export default async function TheCompanyPage() {
  const { about: pageData, stats: dynamicStats } = await getAboutPageData();

  // Extract all sections from API
  const heroSection = pageData?.sections?.find(s => s.sectionKey === 'hero');
  const companySection = pageData?.sections?.find(s => s.sectionKey === 'company');
  const chairmansSection = pageData?.sections?.find(s => s.sectionKey === 'chairmans_message');
  const visionSection = pageData?.sections?.find(s => s.sectionKey === 'vision');
  const missionSection = pageData?.sections?.find(s => s.sectionKey === 'mission');

  // Company section
  const companyMiniTitle = companySection?.miniTitle || 'THE COMPANY';
  const companyTitle = companySection?.title || 'Leading Integrated Steel Manufacturer in Central India';
  const companyParagraph = companySection?.paragraph || 'Vaswani Group of Industries is one of the reputed group of Chhattisgarh. Our Group has a chain of value-added products which include Induction Furnace, Sponge Iron, Power, Steel Billets, TMT Bars, Forgings & Casting. We draw our strength from an old tradition of reliable customer service and quality products.';
  const companyParagraph2 = companySection?.paragraph2 || 'With modern induction furnace operations, energy-efficient manufacturing systems, and solar energy integration, Vaswani Industries supports infrastructure, engineering, and industrial sectors across India.';
  const companyImage = companySection?.images?.[0]?.url;
  const companyButtons = companySection?.buttons || [];

  // Chairman's Message
  const chairmanMiniTitle = chairmansSection?.miniTitle || "Chairman's Message";
  const chairmanTitle = chairmansSection?.title || 'We are a very subtle organization and we like to create examples from our work.';
  const chairmanParagraph = chairmansSection?.paragraph || 'Over the last two decades the company has continuously diversified its product portfolio to include many customized value added products. With vibrant and dedicated employees forming the core of our Group, we have grown from strength to strength under the dynamic leadership of our promoters and directors.';
  const chairmanParagraph2 = chairmansSection?.paragraph2 || '';
  const chairmanImage = chairmansSection?.images?.[0]?.url;
  const chairmanButtons = chairmansSection?.buttons || [];

  // Vision & Mission
  const visionTitle = visionSection?.title || 'Our Vision';
  const visionText = visionSection?.paragraph || 'To be the most trusted, responsible, and sustainable integrated steel manufacturing company in India.';
  const visionImage = visionSection?.images?.[0]?.url;
  const missionTitle = missionSection?.title || 'Our Mission';
  const missionText = missionSection?.paragraph || 'To deliver high-quality steel products through efficient processes, continuous innovation, and a commitment to the well-being of our employees, customers, and communities.';
  const missionImage = missionSection?.images?.[0]?.url;

  // Page Banner
  const bannerTitle = heroSection?.title || 'About Us';
  const bannerImage = heroSection?.images?.[0]?.url;

  return (
    <>
      <PageBanner title={bannerTitle} breadcrumbs={[{ label: 'The Company' }]} backgroundImage={bannerImage} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar */}
        <div>
          <nav className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
            {ABOUT_SIDEBAR.map(({ label, href }) => {
              const isActive = href === '/about/the-company';
              return (
                <Link key={label} href={href}
                  className={`flex items-center px-5 py-4 border-b border-gray-50 last:border-b-0 text-sm font-semibold transition-all
                    ${isActive ? 'bg-teal-500 text-white' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50 hover:pl-6'}`}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <a href="/uploads/documents/Vaswani_Industries_Company_Profile.pdf" download className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-5 py-4 transition-colors w-full group">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors"><FileDown size={16} /></div>
            <div><div className="font-bold text-sm">Download PDF</div><div className="text-xs text-gray-400">1.5 MB</div></div>
          </a>
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Quick Fact</h4>
            <p className="text-sm text-gray-600 leading-relaxed">Vaswani Industries Limited is the largest producer of Sponge Iron in Central India.</p>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* ── THE COMPANY SECTION ── */}
          <span className="inline-block bg-teal-500 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded mb-5">
            {companyMiniTitle}
          </span>

          {companyImage && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
              <img src={companyImage} alt={companyTitle} className="w-full h-[300px] object-cover" />
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{companyTitle}</h2>
          <p className="text-gray-600 leading-relaxed mb-4 text-base sm:text-lg">{companyParagraph}</p>
          {companyParagraph2 && (
            <p className="text-gray-600 leading-relaxed mb-6">{companyParagraph2}</p>
          )}

          {companyButtons.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {companyButtons.filter(b => b.text).map((btn, i) => (
                <Link key={i} href={btn.url || '#'} className={`inline-flex items-center gap-2 px-6 py-3 font-bold rounded-full text-sm transition-all ${btn.style === 'outline' ? 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50' : btn.style === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-teal-500 text-white hover:bg-teal-600'}`}>
                  {btn.text}
                </Link>
              ))}
            </div>
          )}

          {/* ── CHAIRMAN'S MESSAGE ── */}
          <div className="bg-teal-500 rounded-2xl p-8 mb-12">
            {chairmanMiniTitle && (
              <span className="inline-block text-white/80 text-xs font-bold tracking-widest uppercase mb-3">{chairmanMiniTitle}</span>
            )}
            <p className="text-white text-xl sm:text-2xl font-bold leading-relaxed italic">
              &ldquo;{chairmanTitle}&rdquo;
            </p>
          </div>

          {chairmanImage && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
              <img src={chairmanImage} alt="Chairman" className="w-full h-[300px] object-cover" />
            </div>
          )}

          {chairmanParagraph && (
            <p className="text-gray-600 leading-relaxed mb-4">{chairmanParagraph}</p>
          )}
          {chairmanParagraph2 && (
            <p className="text-gray-600 leading-relaxed mb-6">{chairmanParagraph2}</p>
          )}

          {chairmanButtons.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {chairmanButtons.filter(b => b.text).map((btn, i) => (
                <Link key={i} href={btn.url || '#'} className={`inline-flex items-center gap-2 px-6 py-3 font-bold rounded-full text-sm transition-all ${btn.style === 'outline' ? 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50' : btn.style === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-teal-500 text-white hover:bg-teal-600'}`}>
                  {btn.text}
                </Link>
              ))}
            </div>
          )}

          {/* ── VISION & MISSION ── */}
          <div id="vision" className="scroll-mt-24">
            <span className="inline-block bg-teal-500 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded mb-8">
              OUR VISION &amp; MISSION
            </span>

            {/* Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
              {missionImage && (
                <div className="rounded-2xl overflow-hidden">
                  <img src={missionImage} alt="Our Mission" className="w-full h-[280px] object-cover" />
                </div>
              )}
              <div className={!missionImage ? 'md:col-span-2' : ''}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase">{missionTitle}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{missionText}</p>
              </div>
            </div>

            {/* Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
              <div className={!visionImage ? 'md:col-span-2' : ''}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase">{visionTitle}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{visionText}</p>
              </div>
              {visionImage && (
                <div className="rounded-2xl overflow-hidden">
                  <img src={visionImage} alt="Our Vision" className="w-full h-[280px] object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="py-10 bg-[#f0f2f5] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {(dynamicStats || STATS).map((stat, i) => {
              const icons = [Flame, Box, BatteryCharging, SunMedium];
              const colors = ['text-orange-500', 'text-blue-600', 'text-emerald-500', 'text-yellow-500'];
              const bgs = ['bg-orange-50', 'bg-blue-50', 'bg-emerald-50', 'bg-yellow-50'];
              const Icon = icons[i % icons.length];
              const value = stat.value;
              const unit = stat.unit;
              const label = stat.label;
              return (
                <div key={i} className="flex flex-col items-center text-center gap-2 p-4 sm:p-6 bg-white rounded-xl border border-gray-100">
                  <div className={`w-11 h-11 ${bgs[i % bgs.length]} rounded-lg flex items-center justify-center`}><Icon size={22} className={colors[i % colors.length]} strokeWidth={1.8} /></div>
                  <div>
                    <div className="flex items-baseline justify-center gap-1"><span className="text-2xl sm:text-3xl font-black text-gray-900">{value}</span><span className="text-xs sm:text-sm font-bold text-gray-500 uppercase">{unit}</span></div>
                    <p className="text-xs text-gray-500 mt-1">{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
