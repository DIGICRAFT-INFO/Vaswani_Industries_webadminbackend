import { ArrowRight, Flame, Box, BatteryCharging, SunMedium, Quote } from 'lucide-react';
import Link from 'next/link';
import DynamicHero from '@/components/DynamicHero';
import HomepageClient from '@/components/HomepageClient';

export const metadata = {
  title: 'Vaswani Industries Ltd. | Integrated Steel Manufacturer India',
  description: 'Vaswani Industries Limited — Leading integrated steel manufacturer in Central India. Sponge iron, billets, forgings, captive power & solar energy. BSE Listed.',
  alternates: { canonical: '/' },
};

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

async function getHomePage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BACKEND_URL || 'https://new.vaswaniindustries.com';
    const [pageRes, newsRes, productsPageRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/pages/home`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/news?limit=4`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/pages/products`, { cache: 'no-store' }),
    ]);
    return {
      page: pageRes.status === 'fulfilled' && pageRes.value.ok ? (await pageRes.value.json()).page : null,
      news: newsRes.status === 'fulfilled' && newsRes.value.ok ? (await newsRes.value.json()).news : [],
      productsPage: productsPageRes.status === 'fulfilled' && productsPageRes.value.ok ? (await productsPageRes.value.json()).page : null,
    };
  } catch { return { page: null, news: [], productsPage: null }; }
}

function getSection(page, key) {
  return page?.sections?.find(s => s.sectionKey === key && s.isActive !== false) || null;
}

const STATS = [
  { value: '25+', unit: '', label: 'Years of Excellence', icon: Flame, color: 'text-teal-500', bg: 'bg-teal-50' },
  { value: '500+', unit: '', label: 'Workforce', icon: Box, color: 'text-teal-500', bg: 'bg-teal-50' },
  { value: '6000', unit: 'MT', label: 'Forging Capacity', icon: BatteryCharging, color: 'text-teal-500', bg: 'bg-teal-50' },
  { value: 'BSE', unit: '', label: 'Listed Company', icon: SunMedium, color: 'text-teal-500', bg: 'bg-teal-50' },
];

export default async function HomePage() {
  const { page, news, productsPage } = await getHomePage();

  const heroSection     = getSection(page, 'hero');
  const aboutSection    = getSection(page, 'about');
  const productsSection = getSection(page, 'products');
  const newsSection     = getSection(page, 'news');
  const statsSection    = getSection(page, 'stats');

  // Get product descriptions from admin CMS (products page sections)
  const forgingData = productsPage?.sections?.find(s => s.sectionKey === 'forging') || null;
  const spongeData = productsPage?.sections?.find(s => s.sectionKey === 'sponge_iron') || null;
  const powerData = productsPage?.sections?.find(s => s.sectionKey === 'power') || null;

  const hero = heroSection || {
    miniTitle: 'Industrial Strength · Sustainable Energy',
    title: 'Manufacturing the building blocks of the world.',
    paragraph: 'A chain of value-added products which include Induction Furnance, Sponge Iron, Power, Steel Billet,  Forgings & Casting.',
    buttons: [
      { text: 'Explore Our Businesses', url: '/products/sponge-iron', style: 'primary' },
      { text: 'Investor Relations', url: '/investors/financials', style: 'outline' },
    ],
    images: [],
  };

  return (
    <>
      {/* ── HERO ── */}
      <DynamicHero section={hero} stats={statsSection?.extra?.stats} />

      {/* ── ABOUT SECTION ── */}
      <section className="py-16 md:py-24 bg-white" id="about">
        <div className="page-container">
          <div className="grid items-center grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative group">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={aboutSection?.images?.[0]?.url || "/about_us_homepage.png"} 
                  alt="Vaswani Industries Manufacturing"
                  className="w-full h-[350px] sm:h-[450px] lg:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute w-32 h-32 rounded-full -top-6 -left-6 bg-teal-500/10 blur-2xl -z-10" />
            </div>

            {/* Content */}
            <div className="space-y-5 sm:space-y-6">
              <span className="inline-block bg-teal-50 text-teal-600 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-teal-100">
                {aboutSection?.miniTitle || 'VASWANI INDUSTRIES LIMITED'}
              </span>
              {aboutSection?.subtitle && (
                <p className="text-teal-600 font-semibold text-sm">{aboutSection.subtitle}</p>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                {aboutSection?.title || "We're More than a Industrial Company"}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-zinc-500">
                {aboutSection?.paragraph || "Vaswani Group of Industries, one of the most reputed group of Chhattisgarh has been able to grow and create a mark in Central India's largest manufacturing unit. Over the last two decades the company has continuously diversified its product portfolio to include many customized value added products. The company firmly believes in benchmark product quality, customer centric approach, people focus, ethical business practices and good corporate citizenship."}
              </p>
              <p className="text-base leading-relaxed text-zinc-500">
                {aboutSection?.paragraph2 || "With vibrant and dedicated employees forming the core of our Group, we have grown from strength to strength under the dynamic leadership of our promoters and directors. Our combined experience has propelled our Group into the league of formidable steel players in Chhattisgarh."}
              </p>
              <div className="pt-3 flex flex-wrap gap-3">
                {aboutSection?.buttons?.length > 0 ? (
                  aboutSection.buttons.filter(b => b.text).map((btn, i) => (
                    <Link key={i} href={btn.url || '#'} className={`inline-flex items-center gap-3 px-7 py-3.5 font-bold rounded-full shadow-lg transition-all group text-sm sm:text-base ${btn.style === 'outline' ? 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50' : btn.style === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-teal-500 text-white hover:bg-teal-600'}`}>
                      {btn.text} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))
                ) : (
                  <Link href="/about/the-company" className="inline-flex items-center gap-3 px-7 py-3.5 font-bold text-white bg-teal-500 rounded-full shadow-lg hover:bg-teal-600 transition-all group text-sm sm:text-base">
                    Discover More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE / CEO SECTION (from admin "quote" section) ── */}
      {(() => {
        const quoteSection = getSection(page, 'quote');
        const quoteTitle = quoteSection?.title || "This is not about creating a giant. It's about creating the sustainability of steel industry.";
        const quoteSubtitle = quoteSection?.subtitle || '— Vaswani Industries';
        const quoteParagraph = quoteSection?.paragraph || '';
        const quoteImage = quoteSection?.images?.[0]?.url;
        return (
          <section className="py-16 md:py-24 bg-[#f8fafb]">
            <div className="page-container">
              <div className={`grid grid-cols-1 ${quoteImage ? 'lg:grid-cols-2' : ''} gap-10 lg:gap-16 items-center`}>
                {/* Quote Content */}
                <div className="space-y-6">
                  {quoteSection?.miniTitle && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                      {quoteSection.miniTitle}
                    </span>
                  )}
                  <div className="relative bg-gray-900 rounded-3xl p-8 sm:p-12 overflow-hidden">
                    <Quote size={80} className="absolute top-6 right-6 text-white/5" />
                    <div className="relative z-10">
                      <div className="text-4xl text-teal-400 font-serif mb-4">"</div>
                      <blockquote className="text-white text-lg sm:text-xl font-medium leading-relaxed italic mb-6">
                        {quoteTitle}
                      </blockquote>
                      {quoteSubtitle && (
                        <p className="text-gray-400 text-sm font-semibold">{quoteSubtitle}</p>
                      )}
                      {quoteParagraph && (
                        <p className="text-gray-400 text-sm mt-4 leading-relaxed">{quoteParagraph}</p>
                      )}
                    </div>
                  </div>
                  {/* Buttons from admin */}
                  {quoteSection?.buttons?.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {quoteSection.buttons.filter(b => b.text).map((btn, i) => (
                        <Link key={i} href={btn.url || '#'} className={`inline-flex items-center gap-2 px-6 py-3 font-bold rounded-full transition-all text-sm ${btn.style === 'outline' ? 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50' : btn.style === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-teal-500 text-white hover:bg-teal-600'}`}>
                          {btn.text} <ArrowRight size={16} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image from admin (right side) */}
                {quoteImage && (
                  <div className="rounded-3xl overflow-hidden shadow-xl">
                    <img src={quoteImage} alt="Quote" className="w-full h-[400px] object-cover" />
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── PRODUCTS SECTION ── */}
      <section className="py-16 md:py-24 bg-white" id="products">
        <div className="page-container">
          <div className="mb-12 sm:mb-16 text-center">
            <span className="inline-block bg-[#e0fcf9] text-[#2dd4bf] text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-sm border border-[#ccfbf1] mb-4">
              {productsSection?.miniTitle || 'WHAT WE OFFER'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 uppercase">
              {productsSection?.title || 'Our Products'}
            </h2>
            {productsSection?.subtitle && (
              <p className="text-teal-600 font-semibold mt-2 text-sm sm:text-base">{productsSection.subtitle}</p>
            )}
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              {productsSection?.paragraph || 'Our leadership assures that we are providing the best quality products possible for our devoted customers.'}
            </p>
          </div>

          {/* Layout: If admin uploaded image → 2-col (cards left, image right), else full-width cards */}
          {productsSection?.images?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                {[
                  { slug: 'forging-ingots-and-billets', title: forgingData?.miniTitle || 'FORGING INGOTS & BILLETS', image: forgingData?.images?.[0]?.url || '/Billets-Production_External.JPG', desc: forgingData?.paragraph || 'We have wide range of section size from 100 mm x 100 mm to 250 mm x 250 mm and bloom size 280 mm x 320 mm along with BIS marked in products of IS-2830 and IS-2831.' },
                  { slug: 'sponge-iron', title: spongeData?.miniTitle || 'SPONGE IRON', image: spongeData?.images?.[0]?.url || '/Sponge_Iron-2.JPG', desc: spongeData?.paragraph || 'Sponge iron is also known as Direct Reduced Iron (DRI), is the product of reducing iron oxide in the form of iron ore into metallic iron.' },
                  { slug: 'power', title: powerData?.miniTitle || 'POWER', image: powerData?.images?.[0]?.url || '/img-POWER.webp', desc: powerData?.paragraph || 'We have installed a 11.5 MW capacity power plant in addition to the Sponge Iron and Steel Division.' },
                ].map((prod) => (
                  <Link key={prod.slug} href={`/products/${prod.slug}`} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-teal-200 transition-all group">
                    <img src={prod.image} alt={prod.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-teal-600 transition-colors">{prod.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prod.desc}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-teal-500 flex-shrink-0" />
                  </Link>
                ))}
              </div>
              <div className="rounded-3xl overflow-hidden shadow-xl hidden lg:block">
                <img src={productsSection.images[0].url} alt="Products" className="w-full h-[450px] object-cover" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {[
                { slug: 'forging-ingots-and-billets', title: forgingData?.miniTitle || 'FORGING INGOTS & BILLETS', image: forgingData?.images?.[0]?.url || '/Billets-Production_External.JPG', desc: forgingData?.paragraph || 'We have wide range of section size from 100 mm x 100 mm to 250 mm x 250 mm and bloom size 280 mm x 320 mm along with BIS marked in products of IS-2830 and IS-2831. Our supplies are customized as per customer requirements.' },
                { slug: 'sponge-iron', title: spongeData?.miniTitle || 'SPONGE IRON', image: spongeData?.images?.[0]?.url || '/Sponge_Iron-2.JPG', desc: spongeData?.paragraph || 'Sponge iron is also known as Direct Reduced Iron (DRI), is the product of reducing iron oxide in the form of iron ore into metallic iron, below the melting point of iron and typically in the range of 800–1200 °C. Used as a substitute for scrap in induction and electrical arc furnaces.' },
                { slug: 'power', title: powerData?.miniTitle || 'POWER', image: powerData?.images?.[0]?.url || '/img-POWER.webp', desc: powerData?.paragraph || 'We have installed a 11.5 MW capacity power plant in addition to the Sponge Iron and Steel Division. We utilize flue gas, and form steam from 100 TPD sponge iron kilns and 03 Waste heat recovery boilers (WHRB), in the form of renewable energy.' },
              ].map((prod) => (
                <div key={prod.slug} className="flex flex-col bg-white rounded-2xl sm:rounded-[25px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <div className="p-3 sm:p-4 pb-0">
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-xl sm:rounded-[20px]">
                      <img src={prod.image} alt={prod.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5 sm:p-8">
                    <h3 className="mb-3 text-lg sm:text-xl font-bold text-gray-900">{prod.title}</h3>
                    <p className="flex-1 mb-6 sm:mb-8 text-sm text-gray-500 leading-relaxed line-clamp-4">{prod.desc}</p>
                    <Link href={`/products/${prod.slug}`} className="inline-flex items-center gap-3 bg-[#52c8b8] text-white pl-5 pr-2 py-2 rounded-full text-sm font-bold hover:bg-[#45b5a6] transition-all w-fit">
                      Know More
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#52c8b8]">
                        <ArrowRight size={16} />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products section buttons from admin */}
          {productsSection?.buttons?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              {productsSection.buttons.filter(b => b.text).map((btn, i) => (
                <Link key={i} href={btn.url || '#'} className={`inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-full transition-all text-sm ${btn.style === 'outline' ? 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50' : btn.style === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg'}`}>
                  {btn.text} <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWS ── */}
      <HomepageClient initialNews={news} newsSection={newsSection} />
    </>
  );
}
