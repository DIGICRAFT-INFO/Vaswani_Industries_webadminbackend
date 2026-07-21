import PageBanner from '@/components/PageBanner';
import InvestorSidebar from '@/components/InvestorSidebar';
import InvestorDocList from '@/components/InvestorDocList';

export const metadata = { title: 'SEBI Disclosure', description: 'Vaswani Industries SEBI LODR disclosure documents.' };

export default function SebiPage() {
  return (
    <>
      <PageBanner title="Investors" breadcrumbs={[{ label: 'SEBI Disclosure' }]} />
      <div className="page-container py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <InvestorSidebar active="sebi-disclosure" />
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">SEBI Disclosure</h2>
          <InvestorDocList category="sebi_disclosure" />
        </div>
      </div>
    </>
  );
}
