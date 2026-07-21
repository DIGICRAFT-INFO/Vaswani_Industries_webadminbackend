'use client';
import Link from 'next/link';
import { Layout, ChevronRight, Home, Users, Package, Newspaper, TrendingUp, Briefcase, Sparkles } from 'lucide-react';

// Optimized Page Data - Hostinger friendly
const PAGES = [
  { key: 'home',      label: 'Home Page',     icon: Home,       desc: 'Hero banner, about section, products, news slider', color: 'bg-emerald-500' },
  { key: 'about',     label: 'About Us',      icon: Users,      desc: "Chairman's message, company info, vision & mission", color: 'bg-teal-500' },
  { key: 'products',  label: 'Our Products',  icon: Package,    desc: 'Forging, Sponge Iron, Power generation sections', color: 'bg-green-600' },
  { key: 'news',      label: 'News & Media',  icon: Newspaper,  desc: 'Page header, section labels, media alerts', color: 'bg-emerald-400' },
  { key: 'investors', label: 'Investors',     icon: TrendingUp, desc: 'Page banner, intro section content, financial links', color: 'bg-cyan-600' },
  { key: 'careers',   label: 'Careers',       icon: Briefcase,  desc: 'Hero, intro, CTA buttons, active job listings', color: 'bg-teal-600' },
];

export default function PagesListPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
             <Layout size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70">Content Management</span>
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Page Editor</h1>
            <p className="text-zinc-400 text-sm font-medium mt-1">Changes reflect live on Vaswani Industries portal.</p>
          </div>
        </div>
      </div>

      {/* Grid - Hostinger Performance Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {PAGES.map(({ key, label, icon: Icon, desc, color }) => (
          <Link 
            key={key} 
            href={`/admin/pages/${key}`}
            className="group relative bg-white p-7 rounded-[28px] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* Hover Background Accent */}
            <div className="absolute inset-0 bg-emerald-50/0 group-hover:bg-emerald-50/30 transition-colors duration-300" />

            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-zinc-900 group-hover:text-emerald-700 transition-colors">{label}</h3>
                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter">Route: /pages/{key}</p>
              </div>
            </div>

            <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1 relative z-10 line-clamp-2">
              {desc}
            </p>

            <div className="flex items-center justify-between relative z-10">
               <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">Edit Mode</span>
               <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                 <ChevronRight size={16} />
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
