import PageBanner from '@/components/PageBanner';
import Link from 'next/link';
import { FileText, Download, ArrowLeft, Calendar, Eye } from 'lucide-react';

async function getDocument(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.document;
  } catch { return null; }
}

export default async function DocumentPage({ params }) {
  const doc = await getDocument(params.slug);

  if (!doc) {
    return (
      <>
        <PageBanner title="INVESTORS" breadcrumbs={[{ label: 'DOCUMENT NOT FOUND' }]} />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-lg mb-6">Document not found.</p>
          <Link href="/investors/financials" className="btn-teal">← Back to Investors</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner title="INVESTORS" breadcrumbs={[{ href: '/investors/financials', label: 'INVESTORS' }, { label: doc.title.substring(0, 30) }]} />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/investors/financials" className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 text-sm font-semibold mb-8">
          <ArrowLeft size={14} /> Back to Investors
        </Link>

        <div className="card p-10 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText size={36} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{doc.title}</h1>
          {doc.description && <p className="text-gray-500 mb-6">{doc.description}</p>}

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8">
            {doc.year && <span className="bg-gray-50 px-3 py-1 rounded-lg font-medium text-gray-600">Year: {doc.year}</span>}
            {doc.quarter && <span className="bg-gray-50 px-3 py-1 rounded-lg font-medium text-gray-600">{doc.quarter}</span>}
            <span className="flex items-center gap-1"><Eye size={13} />{doc.downloadCount} downloads</span>
            {doc.fileSize && <span className="flex items-center gap-1">{(doc.fileSize / 1024).toFixed(0)} KB</span>}
          </div>

          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-teal inline-flex text-base px-10 py-4">
            <Download size={18} /> Download PDF
          </a>

          <p className="text-xs text-gray-400 mt-4">{doc.fileName}</p>
        </div>
      </div>
    </>
  );
}
