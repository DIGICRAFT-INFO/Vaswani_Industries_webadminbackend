import PageBanner from '@/components/PageBanner';
import InvestorSidebar from '@/components/InvestorSidebar';
import InvestorDocList from '@/components/InvestorDocList';

export const metadata = { title: 'Others', description: 'Vaswani Industries other important documents including MOA, AOA.' };

export default function OthersPage() {
  return (
    <>
      <PageBanner title="Investors" breadcrumbs={[{ label: 'Others' }]} />
      <div className="page-container py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <InvestorSidebar active="others" />
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Others</h2>
          <InvestorDocList category="others" />
        </div>
      </div>
    </>
  );
}
