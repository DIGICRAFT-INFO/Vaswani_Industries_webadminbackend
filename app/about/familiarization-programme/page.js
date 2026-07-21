'use client';
import { useState, useEffect } from 'react';
import PageBanner from '@/components/PageBanner';
import Link from 'next/link';

const ABOUT_SIDEBAR = [
  { label: 'The Company', href: '/about/the-company' },
  { label: 'Our Vision & Mission', href: '/about/the-company#vision' },
  { label: "Chairman's Message", href: '/about/chairmans-message' },
  { label: 'Board of Directors', href: '/about/board-of-directors' },
  { label: 'Our Committees', href: '/about/committees' },
  { label: 'Familiarization Programme', href: '/about/familiarization-programme' },
];

const DEFAULT_CONTENT = `Regulation 25(7) of the SEBI (LODR) Regulations, 2015 Inter-alia stipulates that the Company shall familiarize the Independent Directors with the Company, their roles, rights, responsibilities in the Company, nature of the industry in which the Company operates, business model of the Company, etc., through various programmes.

The familiarisation programme is structured to assist the Independent Directors to understand the Company and its business so as enable him in effective discharge of his duties.

At the time of the appointment, the Independent Directors are informed about their role and responsibilities and are given an overview of business, operations and business model of the Company including an overview on Power, Sponge Iron and Steel Industry Sector.`;

export default function FamiliarizationPage() {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${API}/pages/about`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.page) setPageData(d.page);
      })
      .catch(() => {});
  }, []);

  // Try to get a "familiarization" section if admin adds one, otherwise use hero/company data
  const heroSection = pageData?.sections?.find(s => s.sectionKey === 'hero');

  return (
    <>
      <PageBanner title="ABOUT US" breadcrumbs={[{ label: 'FAMILIARIZATION PROGRAMME' }]} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar */}
        <div>
          <nav className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {ABOUT_SIDEBAR.map(({ label, href }) => {
              const isActive = href === '/about/familiarization-programme';
              return (
                <Link key={label} href={href}
                  className={`flex items-center px-5 py-4 border-b border-gray-50 last:border-b-0 text-sm font-semibold transition-all
                    ${isActive ? 'bg-teal-500 text-white' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50 hover:pl-6'}`}>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div>
          <span className="inline-block bg-teal-500 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded mb-6">
            FAMILIARIZATION PROGRAMME
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Policy on Familiarisation Programme</h1>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Preamble</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Regulation 25(7) of the SEBI (LODR) Regulations, 2015 Inter-alia stipulates that the Company shall familiarize the Independent Directors with the Company, their roles, rights, responsibilities in the Company, nature of the industry in which the Company operates, business model of the Company, etc., through various programmes.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-3">Purpose and Objective</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              The familiarisation programme is structured to assist the Independent Directors to understand the Company and its business so as enable him in effective discharge of his duties.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-3">Overview of the Familiarisation Process</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At the time of the appointment, the Independent Directors are informed about their role and responsibilities and are given an overview of business, operations and business model of the Company including an overview on Power, Sponge Iron and Steel Industry Sector.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Immediately after appointment Independent Director are also provided with copies of the following documents:
            </p>

            <div className="space-y-3 mb-8 pl-4">
              <p className="text-gray-600"><strong>A)</strong> Annual Reports of the Company of the last three years;</p>
              <p className="text-gray-600"><strong>B)</strong> Criteria of Independence applicable on Independent Directors as per the Regulation 16(b) of the SEBI (LODR) Regulations, 2015 and the Companies Act, 2013</p>
              <p className="text-gray-600"><strong>C)</strong> Copies of code of conduct and Ethics for Board Members, Code for Prevention of Insider Trading and other policies.</p>
              <p className="text-gray-600"><strong>D)</strong> Regular Familiarisation modules — Presentations on the business and performance of the Company are made at the Board Meetings.</p>
              <p className="text-gray-600"><strong>E)</strong> Independent Directors have the freedom to interact with the Company&apos;s management during the Board/Committee meetings or otherwise.</p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">Board Members are provided with following Information:</h2>
            <div className="space-y-3 mb-8 pl-4">
              <p className="text-gray-600"><strong>A)</strong> Each director of the Company has complete access to any information relating to the Company.</p>
              <p className="text-gray-600"><strong>B)</strong> The Board members are provided with internal policies to enable them to familiarize with the Company&apos;s procedures and practices.</p>
              <p className="text-gray-600"><strong>C)</strong> Board Members are promptly updated on any change and new development with regard to relevant regulatory requirement.</p>
              <p className="text-gray-600"><strong>D)</strong> Familiarisation programmes are also proposed to be conducted on need basis during the term of the directors.</p>
              <p className="text-gray-600"><strong>E)</strong> The Board members are also made aware about the compliances applicable on the Company by way of quarterly compliances report.</p>
              <p className="text-gray-600"><strong>F)</strong> Need Based training is provided to the Board Members on various matters.</p>
              <p className="text-gray-600"><strong>G)</strong> The Board members are also encouraged to advise the Company to adopt further programmes for their familiarization.</p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">Disclosure of the Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              This policy shall be uploaded on the Company&apos;s website for public information.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-3">Review of the Program</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              The Board will review this program and make revisions as may be required. During the Financial Year 2021-2022, VIL has organized a programme for the Independent Directors on March 11.03.2022.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Details of Familiarisation Programmes</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 mb-10">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-700">Areas Covered</td>
                    <td className="px-5 py-3 text-gray-600">Overview of Business Activities & Financial Status, Power & Steel Sector Scenario, Role & Responsibilities as per Companies Act, 2013 and SEBI (LODR) Regulations, 2015.</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-5 py-3 font-semibold text-gray-700">Programmes Attended</td>
                    <td className="px-5 py-3 text-gray-600">During the Year only one programme attended by the Independent director</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-700">Hours Spent</td>
                    <td className="px-5 py-3 text-gray-600">Around 2 hours 30 minutes</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-semibold text-gray-700">Purpose</td>
                    <td className="px-5 py-3 text-gray-600">Project Expansion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
