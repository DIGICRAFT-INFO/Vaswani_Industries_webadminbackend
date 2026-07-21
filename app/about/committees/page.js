'use client';
import { useState, useEffect } from 'react';
import PageBanner from '@/components/PageBanner';
import Link from 'next/link';
import { User } from 'lucide-react';

const ABOUT_SIDEBAR = [
  { label: 'The Company', href: '/about/the-company' },
  { label: 'Our Vision & Mission', href: '/about/the-company#vision' },
  { label: "Chairman's Message", href: '/about/chairmans-message' },
  { label: 'Board of Directors', href: '/about/board-of-directors' },
  { label: 'Our Committees', href: '/about/committees' },
  { label: 'Familiarization Programme', href: '/about/familiarization-programme' },
];

export default function CommitteesPage() {
  const [committees, setCommittees] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommittees() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || '/api';
        const res = await fetch(`${API}/board-members/committees`);
        const data = await res.json();
        if (data.success) setCommittees(data.data || {});
      } catch (err) {
        console.error('Failed to fetch committees');
      }
      setLoading(false);
    }
    fetchCommittees();
  }, []);

  const committeeNames = Object.keys(committees);

  return (
    <>
      <PageBanner title="ABOUT US" breadcrumbs={[{ label: 'BOARD COMMITTEES' }]} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar */}
        <div>
          <nav className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
            {ABOUT_SIDEBAR.map(({ label, href }) => {
              const isActive = href === '/about/committees';
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
            OUR COMMITTEES
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Board Committees</h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed mb-12">
            Strategic oversight and strong corporate governance through specialized Board Committees.
          </p>

          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-gray-100 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-gray-50 rounded w-2/3 mb-6" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-48 bg-gray-100 rounded-2xl" />
                    <div className="h-48 bg-gray-100 rounded-2xl" />
                    <div className="h-48 bg-gray-100 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : committeeNames.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <User size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 font-medium">No committees configured yet.</p>
              <p className="text-gray-400 text-sm mt-1">Add committee memberships to board members from the admin panel.</p>
            </div>
          ) : (
            committeeNames.map((name) => (
              <div key={name} className="mb-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{name}</h2>
                <div className="w-14 h-1 bg-teal-500 rounded-full mt-2 mb-8" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {committees[name].map((member, idx) => (
                    <div key={idx} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <User size={48} className="text-gray-300" />
                          </div>
                        )}
                        {/* Role Badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide text-white uppercase ${member.committeeRole === 'CHAIRMAN' ? 'bg-teal-500' : 'bg-gray-800'}`}>
                          {member.committeeRole}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-5 text-center">
                        <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase">{member.name}</h3>
                        <p className="text-teal-500 text-[10px] font-semibold tracking-[1.5px] uppercase">{member.designation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
