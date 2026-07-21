import PageBanner from '@/components/PageBanner';
import InvestorSidebar from '@/components/InvestorSidebar';
import InvestorDocList from '@/components/InvestorDocList';

export const metadata = { title: 'Listing Information', description: 'Vaswani Industries BSE/NSE listing information and company announcements.' };

export default function ListingInfoPage() {
  return (
    <>
      <PageBanner title="Investors" breadcrumbs={[{ label: 'Listing Information' }]} />
      <div className="page-container py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <InvestorSidebar active="listing-information" />
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Listing Information</h2>
          <InvestorDocList category="listing_information" />
        </div>
      </div>
    </>
  );
}
