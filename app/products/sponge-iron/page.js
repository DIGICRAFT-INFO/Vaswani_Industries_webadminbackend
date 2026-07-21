import PageBanner from '@/components/PageBanner';
import ProductSidebar from '@/components/ProductSidebar';
import { FileDown } from 'lucide-react';

export const metadata = { title: 'Sponge Iron (DRI) | Vaswani Industries' };

async function getProductData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.BACKEND_URL || 'https://new.vaswaniindustries.com';
    const productRes = await fetch(`${baseUrl}/api/products/sponge-iron`, { cache: 'no-store' });
    if (productRes.ok) {
      const productData = await productRes.json();
      if (productData.success && productData.product) return { product: productData.product, section: null };
    }
    const res = await fetch(`${baseUrl}/api/pages/products`, { cache: 'no-store' });
    if (!res.ok) return { product: null, section: null };
    const data = await res.json();
    return { product: null, section: data.success ? data.page?.sections?.find(s => s.sectionKey === 'sponge_iron') : null };
  } catch { return { product: null, section: null }; }
}

function normalizeImg(url) {
  if (!url) return '';
  if (url.includes('/uploads/')) return url.substring(url.indexOf('/uploads/'));
  return url;
}

export default async function SpongeIronPage() {
  const { product, section } = await getProductData();

  const title = product?.name || section?.title || 'Sponge Iron';
  const miniTitle = product?.tagline || section?.miniTitle || 'Direct Reduced Iron (DRI)';
  const paragraph = product?.description || section?.paragraph || 'Sponge iron is also known as Direct Reduced Iron (DRI), is the product of reducing iron oxide in the form of iron ore into metallic iron, below the melting point of iron and typically in the range of 800–1200 °C. Sponge iron is used in the iron and steel industry as a substitute for scrap in induction and electrical arc furnaces.';
  const image = product?.images?.[0] ? normalizeImg(product.images[0]) : (section?.images?.[0]?.url || '/sponse_iron_manufacturing.webp');
  const quickFact = product?.quickFact || section?.extra?.quickFact || 'Vaswani Industries Limited is the largest producer of Sponge Iron in Central India.';

  // Fallback specifications data
  const defaultSpecHeaders = ['Parameters/Material', 'DR Clo', 'Pellet'];
  const defaultSpecifications = [
    ['Fe(m)', '82(+-) 1', '80 (+-) 1'],
    ['Carbon', '0.15', '0.15'],
    ['Sulfur', '0.035', '0.035'],
    ['Size', '0-20 mm', '3-20 mm'],
    ['-1(mm)', '<20%', '-'],
  ];

  const specifications = product?.specifications?.length ? product.specifications : (section?.specifications || defaultSpecifications);
  const specHeaders = product?.specHeaders?.length ? product.specHeaders : (section?.specHeaders || defaultSpecHeaders);

  // Fallback reactions data
  const defaultReactions = [
    { left: 'C + O2', right: 'CO2' },
    { left: 'CO2 + C', right: '2CO' },
    { left: '3Fe2O3 + CO', right: '2Fe3O4 + CO2' },
    { left: 'Fe3O4 + CO', right: '3FeO + CO2' },
    { left: 'FeO + CO', right: 'Fe + CO2' },
  ];

  const reactions = product?.reactions?.length ? product.reactions : (section?.reactions || defaultReactions);
  const reactionsTitle = product?.reactionsTitle || 'The basic reduction reactions in a coal based DRI process is as follows:-';
  const pdfUrl = product?.pdfCatalogUrl || '';

  return (
    <>
      <PageBanner title="PRODUCTS" breadcrumbs={[{ label: 'SPONGE IRON' }]} />
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <div>
          <ProductSidebar active="sponge-iron" />
          <a href={pdfUrl || "/uploads/documents/Vaswani_Industries_Product_Catalog.pdf"} download className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-5 py-4 transition-colors w-full mt-6 group">
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

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 leading-relaxed mb-8 text-lg">{paragraph}</p>

          {/* Process Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Process</h2>
            <p className="text-gray-600 leading-relaxed">
              Sponge iron making is a process in which iron ore lumps (5mm-18mm size) are tumbled with a &apos;select&apos; grade of coal &amp; dolomite inside an inclined rotary kiln and control combusted in the presence of air for about 12 hours before the products are air cooled, magnetically separated, screened and size wise in finished product bunkers prior to dispatch. The process entails a direct reduction of the iron ore (i.e. removal of oxygen from the ore) in solid state to metalize the ore at a &apos;critical&apos; temperature to make this possible.
            </p>
          </div>

          {/* Manufacturing Process Image */}
          <div className="mb-10">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 max-w-md">
              <img src={image} alt="Sponge Iron Manufacturing Process - TDR Process" className="w-full object-contain" />
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
                    <span className="text-teal-500 font-bold">=</span>
                    <span className="text-gray-700 font-mono text-sm">{r.right}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DRI Specifications Table */}
          {specifications.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">We are manufacturing DRI in following Specifications:</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 max-w-lg">
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
