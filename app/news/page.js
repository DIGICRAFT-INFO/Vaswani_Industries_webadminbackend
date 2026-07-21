'use client';
import { useState, useEffect } from 'react';
import PageBanner from '@/components/PageBanner';
import Link from 'next/link';
import { Calendar, Eye, ChevronRight, Search, Tag, ArrowRight } from 'lucide-react';
import { normalizeFileUrl } from '@/lib/api';

const CATEGORIES = ['All', 'Industrial', 'Factory', 'Business', 'Finance', 'CSR', 'Other'];

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  // --- API DATA FETCHING ---
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [newsRes, pageRes] = await Promise.allSettled([
          fetch(`${apiUrl}/news?limit=100`),
          fetch(`${apiUrl}/pages/news`),
        ]);
        if (newsRes.status === 'fulfilled') { const d = await newsRes.value.json(); if (d.success) setNews(d.news || []); }
        if (pageRes.status === 'fulfilled') { const d = await pageRes.value.json(); if (d.success) setPageData(d.page); }
      } catch (err) { console.error("Fetch Error:", err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  // --- FILTERING LOGIC (CORE BUG FIX) ---
  const filtered = news.filter(item => {
    // 1. Category logic: 'All' par sab dikhega, warna category match honi chahiye
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    // 2. Search logic: Title match hona chahiye
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const introSection = pageData?.sections?.find(s => s.sectionKey === 'intro');

  return (
    <>
      <PageBanner title="News & Media" breadcrumbs={[{ label: 'News & Media' }]} />

      {/* Intro Section from Admin */}
      {introSection && (introSection.paragraph || introSection.images?.length > 0 || introSection.buttons?.length > 0) && (
        <section className="page-container pt-10">
          <div className={`grid grid-cols-1 ${introSection.images?.length > 0 ? 'lg:grid-cols-[1fr_350px]' : ''} gap-8 items-center`}>
            <div>
              {introSection.miniTitle && <span className="inline-block bg-teal-50 text-teal-600 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-teal-100 mb-3">{introSection.miniTitle}</span>}
              {introSection.title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{introSection.title}</h2>}
              {introSection.subtitle && <p className="text-gray-500 mb-3">{introSection.subtitle}</p>}
              {introSection.paragraph && <p className="text-gray-600 leading-relaxed">{introSection.paragraph}</p>}
              {introSection.buttons?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {introSection.buttons.filter(b => b.text).map((btn, i) => (
                    <Link key={i} href={btn.url || '#'} className={`inline-flex items-center gap-2 px-5 py-2.5 font-bold rounded-full text-sm transition-all ${btn.style === 'outline' ? 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50' : btn.style === 'dark' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-teal-500 text-white hover:bg-teal-600'}`}>
                      {btn.text} <ArrowRight size={14} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {introSection.images?.length > 0 && (
              <div className="rounded-2xl overflow-hidden shadow-lg hidden lg:block">
                <img src={introSection.images[0].url} alt={introSection.title || 'News'} className="w-full h-[250px] object-cover" />
              </div>
            )}
          </div>
        </section>
      )}

      <section className="page-container py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          
          {/* --- MAIN CONTENT AREA --- */}
          <div>
            {/* Top Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all
                    ${activeCategory === cat
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-lg">Abhi is category mein koi news nahi hai.</p>
                <button onClick={() => setActiveCategory('All')} className="mt-4 text-teal-500 font-bold">Show All News</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(item => (
                  <Link 
                    key={item._id}
                    href={`/news/${item.slug || item._id}`} 
                    className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image Box */}
                    <div className="relative h-52 overflow-hidden bg-gray-200">
                      <img 
                        src={normalizeFileUrl(item.image) || '/placeholder-news.jpg'} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                        {item.category}
                      </span>
                    </div>

                    {/* Content Box */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-3 font-semibold uppercase">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-teal-500" />{new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><Eye size={12} className="text-teal-500" />{item.views || 0} Views</span>
                      </div>
                      
                      <h2 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {item.title}
                      </h2>
                      
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-5">
                        {item.excerpt || "Full details for this news article available inside..."}
                      </p>

                      <div className="flex items-center text-teal-500 text-xs font-bold gap-2">
                        READ MORE <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* --- SIDEBAR AREA --- */}
          <aside className="space-y-8">
            {/* Search */}
            <div className="relative">
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm" 
              />
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Sidebar Categories with Counts */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-5 text-xs uppercase tracking-widest border-b pb-3">Categories</h3>
              <ul className="space-y-1.5">
                {CATEGORIES.map(cat => {
                  const count = news.filter(n => cat === 'All' ? true : n.category === cat).length;
                  return (
                    <li key={cat}>
                      <button 
                        onClick={() => setActiveCategory(cat)}
                        className={`flex items-center justify-between w-full text-sm py-2 px-3 rounded-xl transition-all
                          ${activeCategory === cat ? 'bg-teal-50 text-teal-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight size={14} className={activeCategory === cat ? 'text-teal-500' : 'text-gray-300'} />
                          {cat}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-lg ${activeCategory === cat ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
