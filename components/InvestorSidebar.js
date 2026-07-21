import Link from 'next/link';

const links = [
  { label: 'Financials', href: '/investors/financials' },
  { label: 'Disclosures', href: '/investors/disclosures' },
  { label: 'Listing Information', href: '/investors/listing-information' },
  { label: 'Policies', href: '/investors/policies' },
  { label: 'SEBI Disclosure', href: '/investors/sebi-disclosure' },
  { label: 'Others', href: '/investors/others' },
];

export default function InvestorSidebar({ active }) {
  return (
    <aside className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm h-fit">
      {links.map(({ label, href }) => {
        const slug = href.split('/').pop();
        const isActive = active === slug;
        return (
          <Link key={href} href={href}
            className={`block px-5 py-3.5 border-b border-gray-50 text-sm font-semibold transition-colors
              ${isActive ? 'bg-teal-500 text-white' : 'text-gray-700 hover:text-teal-500 hover:bg-teal-50'}`}>
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
