import PageBanner from '@/components/PageBanner';
import ProductSidebar from '@/components/ProductSidebar';
import { FileDown } from 'lucide-react';

export const metadata = { title: 'Power Generation | Vaswani Industries' };

async function getProductData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BACKEND_URL || 'https://new.vaswaniindustries.com';
    const productRes = await fetch(`${baseUrl}/api/products/power`, { cache: 'no-store' });
    if (productRes.ok) {
      const productData = await productRes.json();
      if (productData.success && productData.product) return { product: productData.product, section: null };
    }
    const res = await fetch(`${baseUrl}/api/pages/products`, { cache: 'no-store' });
    if (!res.ok) return { product: null, section: null };
    const data = await res.json();
    return { product: null, section: data.success ? data.page?.sections?.find(s => s.sectionKey === 'power') : null };
  } catch { return { product: null, section: null }; }
}

function normalizeImg(url) {
  if (!url) return '';
  if (url.includes('/uploads/')) return url.substring(url.indexOf('/uploads/'));
  return url;
}

export default async function PowerPage() {
  const { product, section } = await getProductData();

  const title = product?.name || section?.title || 'Power Generation';
  const miniTitle = product?.tagline || section?.miniTitle || 'Captive Power Generation';
  const paragraph = product?.description || section?.paragraph || 'M/s Vaswani Industries Limited has installed an 11.5 MW capacity power plant in addition to the Sponge Iron and Steel Division.';
  const image = product?.images?.[0] ? normalizeImg(product.images[0]) : section?.images?.[0]?.url;
  const quickFact = product?.quickFact || section?.extra?.quickFact || 'Vaswani Industries operates captive thermal and solar power plants.';
  const specifications = product?.specifications || [];
  const specHeaders = product?.specHeaders || [];
  const reactions = product?.reactions || [];
  const reactionsTitle = product?.reactionsTitle || '';
  const pdfUrl = product?.pdfCatalogUrl || '';

  return (
    <>
      <PageBanner title="PRODUCTS" breadcrumbs={[{ label: 'POWER' }]} />
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <div>
          <ProductSidebar active="power" />
          <a href={pdfUrl || "/uploads/documents/Vaswani_Industries_Product_Catalog.pdf"} download className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-5 py-4 transition-colors w-full mt-6 group">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors"><FileDown size={16} /></div>
            <div><div className="font-bold text-sm">Download PDF</div><div className="text-xs text-gray-400">Company Profile & Catalog</div></div>
          </a>
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Quick Fact</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{quickFact}</p>
          </div>
        </div>

        <div>
          <span className="inline-block bg-teal-500 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded mb-5">
            {miniTitle}
          </span>

          {image ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                <p className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src={image} alt={title} className="w-full h-[300px] object-cover" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
              <p className="text-gray-600 leading-relaxed mb-4 text-lg font-semibold">{paragraph}</p>
            </>
          )}

          {/* Detailed Description */}
          <div className="mb-10">
            <p className="text-gray-600 leading-relaxed">
              We utilize flue gas, and form steam from our 03 Waste heat recovery boilers (WHRB), in the form of renewable energy from 100 TPD sponge iron kilns. We have also installed an AFBC boiler in which a maximum amount of dolochar (By Product of DRI production) is used as fuel. The Electricity Generated in the captive power plant is used by the steel Melting shop (SMS). This process of utilizing waste heat to generate into electricity is extremely beneficial for the environment.
            </p>
          </div>

          {specifications.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  {specHeaders.length > 0 && (
                    <thead><tr className="bg-gray-900 text-white">{specHeaders.map((h, i) => (<th key={i} className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">{h}</th>))}</tr></thead>
                  )}
                  <tbody>
                    {specifications.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {(Array.isArray(row) ? row : [row]).map((cell, j) => (
                          <td key={j} className="px-4 py-3 text-gray-700 border-t border-gray-100">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reactions.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{reactionsTitle}</h2>
              <div className="space-y-3">
                {reactions.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <span className="text-gray-700 font-mono text-sm">{r.left}</span>
                    <span className="text-teal-500 font-bold">→</span>
                    <span className="text-gray-700 font-mono text-sm">{r.right}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product?.images?.length > 1 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <img src={normalizeImg(img)} alt={`${title} ${i + 2}`} className="w-full h-48 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
