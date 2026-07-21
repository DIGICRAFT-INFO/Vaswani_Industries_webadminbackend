'use client';
import { useState, useEffect } from 'react';
import PageBanner from '@/components/PageBanner';
import InvestorSidebar from '@/components/InvestorSidebar';
import { FileText, Eye, Calendar } from 'lucide-react';
import { normalizeFileUrl } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TABS = [
  { key: 'financials_annual_reports',    label: 'Annual Reports' },
  { key: 'financials_quarterly_results', label: 'Quarterly Results' },
  { key: 'financials_related_party',     label: 'Related Party Disclosure' },
];

// ── Teal card for all document types
function DocCard({ doc }) {
  const pdfUrl = doc.fileUrl && doc.fileUrl !== '#' ? normalizeFileUrl(doc.fileUrl) : undefined;
  const hasFile = !!pdfUrl;
  const year = doc.year || '';
  const quarter = doc.quarter || '';

  return (
    <div className="flex flex-col items-center">
      <a href={pdfUrl}
        target="_blank" rel="noopener noreferrer"
        className={`w-full aspect-[3/4] rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm transition-all
          ${hasFile
            ? 'bg-teal-500 hover:bg-teal-600 cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
            : 'bg-gray-200 cursor-not-allowed'
          }`}>
        {year ? (
          <>
            <span className="text-white/70 text-[9px] font-bold uppercase tracking-widest">
              {quarter || 'PDF'}
            </span>
            <span className="text-white font-extrabold text-xl sm:text-2xl leading-tight">{year}</span>
          </>
        ) : (
          <>
            <FileText size={24} className="text-white/70" />
            <span className="text-white/90 text-[10px] font-bold text-center px-2 leading-tight">PDF</span>
          </>
        )}
      </a>
      <p className="text-[10px] sm:text-xs text-center mt-2 text-gray-500 font-medium px-1 leading-tight line-clamp-2">{doc.title}</p>
      <div className="flex items-center gap-2 mt-1">
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
          className={`flex items-center gap-1 text-[10px] font-bold ${hasFile ? 'text-teal-600 hover:text-teal-700' : 'text-gray-300 cursor-not-allowed'}`}>
          <Eye size={10} /> VIEW
        </a>
        {hasFile && (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(doc.title + ' - ' + (typeof window !== 'undefined' ? window.location.origin : '') + pdfUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 hover:text-green-700"
            title="Share on WhatsApp"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Share
          </a>
        )}
      </div>
    </div>
  );
}

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState('financials_annual_reports');
  const [data, setData]           = useState({});
  const [loading, setLoading]     = useState(true);
  const [pageIntro, setPageIntro] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/pages/investors`)
      .then(r => r.json())
      .then(d => { if (d.success) setPageIntro(d.page?.sections?.find(s => s.sectionKey === 'intro')); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/documents?category=${activeTab}&limit=200`)
      .then(r => r.json())
      .then(d => {
        if (d.documents?.length > 0) {
          setData(prev => ({ ...prev, [activeTab]: d.documents }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  const docs = (data[activeTab] || []).slice().sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    if (yearB !== yearA) return yearB - yearA;
    // Secondary sort by quarter (Q4 > Q3 > Q2 > Q1)
    const qA = parseInt((a.quarter || '').replace(/\D/g, '')) || 0;
    const qB = parseInt((b.quarter || '').replace(/\D/g, '')) || 0;
    return qB - qA;
  });

  return (
    <>
      <PageBanner title="Investors" breadcrumbs={[{ label: 'Financials' }]} />
      <div className="page-container py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <InvestorSidebar active="financials" />
        <div>
          {/* Admin Intro Section */}
          {pageIntro && (pageIntro.paragraph || pageIntro.subtitle) && (
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              {pageIntro.miniTitle && <span className="text-teal-600 text-xs font-bold uppercase tracking-widest">{pageIntro.miniTitle}</span>}
              {pageIntro.title && <h2 className="text-xl font-bold text-gray-900 mt-1">{pageIntro.title}</h2>}
              {pageIntro.subtitle && <p className="text-gray-500 text-sm mt-1">{pageIntro.subtitle}</p>}
              {pageIntro.paragraph && <p className="text-gray-600 text-sm mt-2 leading-relaxed">{pageIntro.paragraph}</p>}
            </div>
          )}
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all
                  ${activeTab === t.key ? 'bg-teal-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5">
              {[...Array(10)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : docs.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl">
              <FileText size={40} className="mx-auto mb-3 opacity-20" />
              <p>No documents uploaded yet.</p>
              <p className="text-xs mt-1">Upload PDFs via the Admin CMS or run the seed endpoint.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5">
              {docs.map(doc => <DocCard key={doc._id} doc={doc} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
