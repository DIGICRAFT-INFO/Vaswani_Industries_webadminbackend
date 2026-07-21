import PageBanner from '@/components/PageBanner';
import InvestorSidebar from '@/components/InvestorSidebar';
import InvestorDocList from '@/components/InvestorDocList';

export const metadata = { title: 'Policies', description: 'Vaswani Industries company policies and governance documents.' };

export default function PoliciesPage() {
  return (
    <>
      <PageBanner title="Investors" breadcrumbs={[{ label: 'Policies' }]} />
      <div className="page-container py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <InvestorSidebar active="policies" />
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Policies</h2>
          <InvestorDocList category="policies" />
        </div>
      </div>
    </>
  );
}
