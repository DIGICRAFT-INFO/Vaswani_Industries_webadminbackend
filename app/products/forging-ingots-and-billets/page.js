import PageBanner from '@/components/PageBanner';
import ProductSidebar from '@/components/ProductSidebar';
import { FileDown } from 'lucide-react';

export const metadata = { title: 'Forging Ingots & Billets | Vaswani Industries' };

async function getProductData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BACKEND_URL || 'https://new.vaswaniindustries.com';
    // Fetch from Product model (admin-managed data)
    const productRes = await fetch(`${baseUrl}/api/products/forging-ingots-and-billets`, { cache: 'no-store' });
    if (productRes.ok) {
      const productData = await productRes.json();
      if (productData.success && productData.product) return { product: productData.product, section: null };
    }
    // Fallback to PageContent
    const res = await fetch(`${baseUrl}/api/pages/products`, { cache: 'no-store' });
    if (!res.ok) return { product: null, section: null };
    const data = await res.json();
    return { product: null, section: data.success ? data.page?.sections?.find(s => s.sectionKey === 'forging') : null };
  } catch { return { product: null, section: null }; }
}

function normalizeImg(url) {
  if (!url) return '';
  if (url.includes('/uploads/')) return url.substring(url.indexOf('/uploads/'));
  return url;
}

export default async function ForgingPage() {
  const { product, section } = await getProductData();

  const title = product?.name || section?.title || 'Forging Ingots & Billets';
  const miniTitle = product?.tagline || section?.miniTitle || 'Forging Ingots & Billets';
  const paragraph = product?.description || section?.paragraph || 'Presently we are having capacity of producing 6000 MT of Forging Quality, casting one heat of 10 metric tons Material. We had successfully casted En-8, En-9, En-18, En-19, En-24, En-42, En-111, C-25, C-40, C-42, C-45 and 55Cr70.';
  const image = product?.images?.[0] ? normalizeImg(product.images[0]) : section?.images?.[0]?.url;
  const quickFact = product?.quickFact || section?.extra?.quickFact || 'Vaswani Industries Limited is the largest producer of Sponge Iron in Central India.';

  // Fallback specifications data
  const defaultSpecHeaders = ['Sl.NO', 'Size In Inches', 'Type', 'Approx. Wt. per Piece (kg)*', 'Mold Height', 'Hot top height'];
  const defaultSpecifications = [
    ['1', '10*12', 'Square', '1300', '75"', '9"'],
    ['2', '12*14', 'Square', '1700', '75"', '9"'],
    ['3', '14*16', 'Square', '2300', '75"', '9"'],
    ['4', '17*19', 'Fluted', '2600', '75"', '9"'],
    ['5', '19*21', 'Fluted', '3200', '75"', '9"'],
    ['6', '22*24', 'Fluted', '4200', '75"', '9"'],
    ['7', '25*28', 'Fluted', '5200', '75"', '9"'],
    ['8', '28*33', 'Fluted', '6200', '75"', '9"'],
    ['9', '30*33', 'Fluted', '7150', '75"', '9"'],
  ];

  const specifications = product?.specifications?.length ? product.specifications : (section?.specifications || defaultSpecifications);
  const specHeaders = product?.specHeaders?.length ? product.specHeaders : (section?.specHeaders || defaultSpecHeaders);
  const reactions = product?.reactions || [];
  const reactionsTitle = product?.reactionsTitle || 'BASIC REDUCTION REACTIONS:';
  const pdfUrl = product?.pdfCatalogUrl || '';

  // Billets & Blooms size table
  const billetBlooms = [
    ['100*100', '200*200'],
    ['110*110', '200*250'],
    ['125*125', '250*250'],
    ['160*160', '280*300'],
    ['160*200', '280*320'],
    ['150*340', ''],
  ];

  return (
    <>
      <PageBanner title="PRODUCTS" breadcrumbs={[{ label: 'FORGING INGOTS AND BILLETS' }]} />
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <div>
          <ProductSidebar active="forging-ingots-and-billets" />
          <a href={pdfUrl || "/uploads/documents/Vaswani_Industries_Product_Catalog.pdf"} download className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-5 py-4 transition-colors w-full mt-6 group">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors"><FileDown size={16} /></div>
            <div><div className="font-bold text-sm">Download PDF</div><div className="text-xs text-gray-400">Company Profile & Catalog</div></div>
          </a>
          <a href={pdfUrl || "/uploads/documents/Vaswani_Industries_Product_Catalog.pdf"} download className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-5 py-4 transition-colors w-full mt-3 group">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors"><FileDown size={16} /></div>
            <div><div className="font-bold text-sm">Download PDF</div><div className="text-xs text-gray-400">Company Profile & Catalog</div></div>
          </a>
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Quick Fact</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{quickFact}</p>
          </div>
        </div>

        {/* Main Content */}
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
              <p className="text-gray-600 leading-relaxed mb-8">{paragraph}</p>
            </>
          )}

          {/* Specifications Table */}
          {specifications.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Following are the sizes available:-</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  {specHeaders.length > 0 && (
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        {specHeaders.map((h, i) => (
                          <th key={i} className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
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

          {/* MS Billet/Bloom Description */}
          <div className="mb-10">
            <p className="text-gray-600 leading-relaxed">
              We produce <strong>MS Billet/Bloom</strong>, with a wide range of section size from 100 mm x 100 mm to 250 mm x 250 mm and bloom size 280 mm x 320 mm along with BIS marked in products of IS-2830 and IS-2831. Our supplies are customized as per customer requirements. We also deliver different grades of carbon/ spring/ alloy steel products such as EN-8, EN-9, EN-18, EN-19, C-45, Sup 9 and Sup 11.
            </p>
          </div>

          {/* Billets & Blooms Table */}
          <div className="mb-10">
            <div className="overflow-x-auto rounded-xl border border-gray-200 max-w-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Billets</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Blooms</th>
                  </tr>
                </thead>
                <tbody>
                  {billetBlooms.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-gray-700 border-t border-gray-100">{row[0]}</td>
                      <td className="px-4 py-3 text-gray-700 border-t border-gray-100">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reactions */}
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

          {/* Additional Images */}
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
