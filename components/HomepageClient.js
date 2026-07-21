'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Eye, ArrowRight } from 'lucide-react';
import { normalizeFileUrl } from '@/lib/api';

const FALLBACK = [
  { _id: '1', title: 'Vaswani Industries expands Sponge Iron capacity', category: 'Industrial', slug: '#', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80', createdAt: '2024-01-15', views: 340, excerpt: 'Vaswani Industries Limited announces expansion of its DRI production capacity.' },
  { _id: '2', title: 'CSR Initiative: Education for Community', category: 'CSR', slug: '#', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80', createdAt: '2024-02-10', views: 520, excerpt: 'Vaswani Industries continues its commitment to community development.' },
  { _id: '3', title: 'Solar Energy Integration at Manufacturing Plant', category: 'Industrial', slug: '#', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80', createdAt: '2024-03-05', views: 210, excerpt: 'New solar panels installed at the Raipur facility for green manufacturing.' },
];

export default function HomepageClient({ initialNews = [], newsSection = null }) {
  const news    = initialNews.length > 0 ? initialNews : FALLBACK;
  const [idx, setIdx] = useState(0);
  const visible = Math.min(2, news.length);
  const maxIdx  = Math.max(0, news.length - visible);

  const miniTitle  = newsSection?.miniTitle  || 'Latest Updates';
  const title      = newsSection?.title      || 'News | Media | Events | CSR';
  const subtitle   = newsSection?.subtitle   || "It's always about the society we serve!";
  const readBtn    = newsSection?.buttons?.[0] || { text: 'Read the News', url: '/news' };

  return (
    <section className="py-24 bg-gray-50" id="news">
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-tag">{miniTitle}</span>
            <h2 className="section-heading">{title}</h2>
            <p className="text-gray-500 mt-2 text-base">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
              className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-teal-500 hover:text-teal-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setIdx(i => Math.min(maxIdx, i + 1))} disabled={idx >= maxIdx}
              className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-teal-500 hover:text-teal-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={18} />
            </button>
            <Link href={readBtn.url || '/news'} className="btn-teal text-sm py-2.5 px-5">
              {readBtn.text || 'Read the News'}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.slice(idx, idx + visible).map(item => (
            <Link key={item._id}
              href={item.slug && item.slug !== '#' ? `/news/${item.slug}` : '/news'}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img src={normalizeFileUrl(item.image) || FALLBACK[0].image} alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">{item.category}</span>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-5 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1.5"><Calendar size={12} />{new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><Eye size={12} />{item.views || 0} Views</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">{item.title}</h3>
                {item.excerpt && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{item.excerpt}</p>}
                <span className="inline-flex items-center gap-1.5 text-teal-500 text-sm font-bold group-hover:gap-2.5 transition-all">
                  Read More <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
