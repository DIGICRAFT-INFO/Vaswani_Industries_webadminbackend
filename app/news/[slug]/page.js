// news/[slug]/page.js
import dbConnect from '@/lib/db';
import PageBanner from '@/components/PageBanner';
import NewsImageLightbox from '@/components/NewsImageLightbox';
import Link from 'next/link';
import { Calendar, Eye, Tag, ArrowLeft } from 'lucide-react';

// Normalize any stored image/file URL to a relative path served from public/
function normalizeUrl(url) {
  if (!url) return '';
  let rel = url;
  if (url.startsWith('http')) {
    try { rel = new URL(url).pathname; } catch {}
  } else if (url.includes('/uploads/')) {
    rel = url.substring(url.indexOf('/uploads/'));
  } else if (url.includes('/investor/')) {
    rel = url.substring(url.indexOf('/investor/'));
  }
  return rel;
}

// Direct DB query — no internal HTTP fetch needed (avoids SSR fetch issues)
async function getNewsBySlug(slug) {
  try {
    await dbConnect();
    const { News } = require('@/models/index');

    // Decode and normalize the slug
    const decoded = decodeURIComponent(slug);
    const normalized = decoded
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    let item = null;

    // 1. Try as MongoDB ObjectId
    try { item = await News.findById(slug).lean(); } catch {}

    // 2. Exact slug match
    if (!item) item = await News.findOne({ slug: decoded }).lean();

    // 3. Normalized slug match
    if (!item && normalized !== decoded) item = await News.findOne({ slug: normalized }).lean();

    // 4. Prefix match — handles timestamp suffix e.g. "covid-vaccination-drive-2021-1782..."
    if (!item) {
      item = await News.findOne({
        slug: { $regex: `^${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: 'i' }
      }).lean();
    }

    if (!item) return null;

    // Increment views (fire and forget)
    News.findByIdAndUpdate(item._id, { $inc: { views: 1 } }).exec().catch(() => {});

    return item;
  } catch (err) {
    console.error('getNewsBySlug error:', err);
    return null;
  }
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return (
      <>
        <PageBanner title="NEWS & MEDIA" breadcrumbs={[{ label: 'NOT FOUND' }]} />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Article not found</h2>
          <p className="text-gray-400 mb-8">This article may have been removed or the link is incorrect.</p>
          <Link href="/news" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <ArrowLeft size={16} /> Back to News
          </Link>
        </div>
      </>
    );
  }

  const imageUrl = normalizeUrl(news.image);
  const additionalImages = Array.isArray(news.additionalImages)
    ? news.additionalImages.map(normalizeUrl).filter(Boolean)
    : [];
  const pdfUrl = news.attachmentPdf ? normalizeUrl(news.attachmentPdf) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://new.vaswaniindustries.com';

  return (
    <>
      <PageBanner
        title="NEWS & MEDIA"
        breadcrumbs={[
          { href: '/news', label: 'News & Media' },
          { label: news.title.length > 40 ? news.title.substring(0, 40) + '…' : news.title }
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-20">

        {/* Back link */}
        <Link href="/news" className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 text-sm font-semibold mb-8 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to News
        </Link>

        {/* Category badge */}
        <div className="mb-5">
          <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
            {news.category === 'Other' && news.customCategory ? news.customCategory : news.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
          {news.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-teal-500" />
            {new Date(news.publishedAt || news.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} className="text-teal-500" />
            {(news.views || 0).toLocaleString()} Views
          </span>
          <span className="text-gray-300">•</span>
          <span>By <strong className="text-gray-600">{news.author || 'Vaswani Industries'}</strong></span>

          {/* WhatsApp share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${news.title} — ${siteUrl}/news/${news.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Share
          </a>
        </div>

        {/* Featured image */}
        {imageUrl && (
          <div className="mb-10 rounded-3xl overflow-hidden shadow-lg">
            <img
              src={imageUrl}
              alt={news.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-teal max-w-none">
          {news.content ? (
            <div
              className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          ) : (
            <p className="text-gray-600 text-lg">{news.excerpt}</p>
          )}
        </div>

        {/* Additional images gallery */}
        {additionalImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-gray-800 mb-4">More Photos</h2>
            <NewsImageLightbox images={additionalImages} title={news.title} />
          </div>
        )}

        {/* PDF attachment */}
        {pdfUrl && (
          <div className="mt-10 p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm">Attached Document</p>
              <p className="text-xs text-gray-500 truncate">{news.attachmentPdfName || 'Download PDF'}</p>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0"
            >
              Download PDF
            </a>
          </div>
        )}

        {/* Tags */}
        {news.tags?.length > 0 && (
          <div className="flex items-center gap-2 mt-12 pt-8 border-t border-gray-100 flex-wrap">
            <Tag size={14} className="text-gray-400" />
            {news.tags.map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        )}

      </article>
    </>
  );
}
