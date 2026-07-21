// news/[slug]/page.js

import PageBanner from '@/components/PageBanner';
import Link from 'next/link';
import { Calendar, Eye, Tag, ArrowLeft } from 'lucide-react';

async function getNews(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BACKEND_URL || 'https://new.vaswaniindustries.com';
    const res = await fetch(`${baseUrl}/api/news/${slug}`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.news;
  } catch (err) { 
    console.error("Fetch Error:", err);
    return null; 
  }
}

// Next.js 14+ mein params ko await karein
export default async function NewsDetailPage({ params }) {
  const { slug } = await params; // YEH FIX HAI
  const news = await getNews(slug);

  if (!news) {
    return (
      <>
        <PageBanner title="NEWS & MEDIA" breadcrumbs={[{ label: 'NOT FOUND' }]} />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-lg mb-6">Article not found.</p>
          <Link href="/news" className="bg-teal-500 text-white px-6 py-2 rounded-xl">← Back to News</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner 
        title="NEWS AND MEDIA" 
        breadcrumbs={[
          { href: '/news', label: 'NEWS AND MEDIA' }, 
          { label: news.title.substring(0, 20) + '...' }
        ]} 
      />
      <article className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/news" className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 text-sm font-semibold mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to News
        </Link>

        <div className="mb-6">
          <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            {news.category === 'Other' && news.customCategory ? news.customCategory : news.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
          {news.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(news.publishedAt || news.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          <span className="flex items-center gap-1.5"><Eye size={14} />{news.views} Views</span>
          <span>By {news.author || 'Vaswani Industries'}</span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(news.title + ' - ' + (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vaswaniindustries.com') + '/news/' + news.slug)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Share
          </a>
        </div>

        {news.image && (
          <div className="mb-10">
             <img src={news.image.includes('/uploads/') ? news.image.substring(news.image.indexOf('/uploads/')) : news.image} alt={news.title} className="w-full h-auto max-h-[500px] object-cover rounded-3xl shadow-lg" />
          </div>
        )}

        {/* FULL CONTENT AREA */}
        <div className="prose prose-teal max-w-none">
           {news.content ? (
              // Agar HTML content hai toh dangerouslySetInnerHTML use karein, 
              // varna simple whitespace-pre-wrap div
              <div 
                className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: news.content }} 
              />
           ) : (
              <p className="text-gray-600 text-lg">{news.excerpt}</p>
           )}
        </div>

        {/* Additional Images Gallery */}
        {news.additionalImages?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4">More Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {news.additionalImages.map((img, i) => {
                const src = img.includes('/uploads/') ? img.substring(img.indexOf('/uploads/')) : img;
                return (
                  <img key={i} src={src} alt={`Photo ${i + 2}`}
                    className="w-full h-48 object-cover rounded-2xl shadow-sm hover:shadow-md transition-shadow" />
                );
              })}
            </div>
          </div>
        )}

        {/* PDF Download */}
        {news.attachmentPdf && (
          <div className="mt-10 p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm">Attached Document</p>
              <p className="text-xs text-gray-500 truncate">{news.attachmentPdfName || 'Download PDF'}</p>
            </div>
            <a href={news.attachmentPdf.includes('/uploads/') ? news.attachmentPdf.substring(news.attachmentPdf.indexOf('/uploads/')) : news.attachmentPdf}
              target="_blank" rel="noopener noreferrer"
              className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0">
              Download PDF
            </a>
          </div>
        )}

        {news.tags?.length > 0 && (
          <div className="flex items-center gap-2 mt-12 pt-8 border-t border-gray-100 flex-wrap">
            <Tag size={14} className="text-gray-400" />
            {news.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </>
  );
}
