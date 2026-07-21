'use client';
import { useState, useEffect } from 'react';
import PageBanner from '@/components/PageBanner';
import Link from 'next/link';
import { User, Facebook, Twitter, Linkedin, FileDown } from 'lucide-react';

const ABOUT_SIDEBAR = [
  { label: 'The Company', href: '/about/the-company' },
  { label: 'Our Vision & Mission', href: '/about/the-company#vision' },
  { label: "Chairman's Message", href: '/about/chairmans-message' },
  { label: 'Board of Directors', href: '/about/board-of-directors' },
  { label: 'Our Committees', href: '/about/committees' },
  { label: 'Familiarization Programme', href: '/about/familiarization-programme' },
];

export default function BoardPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        const res = await fetch(`${apiUrl}/board-members`);
        const data = await res.json();
        if (data.success) {
          setMembers(data.members);
        }
      } catch (err) {
        console.error("Board Members Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <>
      <PageBanner title="ABOUT US" breadcrumbs={[{ label: 'BOARD OF DIRECTORS' }]} />
      
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar */}
        <div>
          <nav className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
            {ABOUT_SIDEBAR.map(({ label, href }) => {
              const isActive = href === '/about/board-of-directors';
              return (
                <Link key={label} href={href}
                  className={`flex items-center px-5 py-4 border-b border-gray-50 last:border-b-0 text-sm font-semibold transition-all
                    ${isActive
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50 hover:pl-6'
                    }`}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Download PDF */}
          <a href="/uploads/documents/Vaswani_Industries_Company_Profile.pdf" download className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-5 py-4 transition-colors w-full group mb-6">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 transition-colors">
              <FileDown size={16} />
            </div>
            <div>
              <div className="font-bold text-sm">Download PDF</div>
              <div className="text-xs text-gray-400">1.5 MB</div>
            </div>
          </a>

          {/* Quick Fact */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Quick Fact</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Vaswani Industries Limited is the largest producer of Sponge Iron in Central India.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <span className="inline-block bg-teal-500 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded mb-8">
            BOARD OF DIRECTORS
          </span>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-100 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-gray-50 rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-3xl">
              <User size={48} className="mx-auto mb-4 opacity-30" />
              <p>No board members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <div key={member._id} className="group text-center">
                  {/* Image with Social Overlay */}
                  <div className="relative h-72 overflow-hidden rounded-xl bg-gray-100 mb-4">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <User size={64} />
                      </div>
                    )}
                    
                    {/* Social Icons Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {member.facebook && (
                        <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                          <Facebook size={18} />
                        </a>
                      )}
                      {member.twitter && (
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                          <Twitter size={18} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                          <Linkedin size={18} />
                        </a>
                      )}
                      {/* Show default icons if no social links */}
                      {!member.facebook && !member.twitter && !member.linkedin && (
                        <>
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <Facebook size={18} />
                          </div>
                          <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white">
                            <Twitter size={18} />
                          </div>
                          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white">
                            <Linkedin size={18} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Name & Designation */}
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-wide mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {member.designation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
