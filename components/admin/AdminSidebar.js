
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Next.js Image component for optimization
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
// Root se image import kar rahe hain
import logo from '../../public/logo_Vaswani industries_h.png'; 

import {
  LayoutDashboard, FileText, Newspaper, Users, Briefcase,
  MessageSquare, Package, Settings, LogOut, Layout, Bell, Menu, X,
  User, ShieldCheck, ChevronUp, ExternalLink, MapPin
} from 'lucide-react';

const NAV = [
  { label: 'Overview',       href: '/admin',               icon: LayoutDashboard, permission: 'overview' },
  { label: 'Pages',          href: '/admin/pages',          icon: Layout,          permission: 'pages' },
  { label: 'Documents',      href: '/admin/documents',      icon: FileText,        permission: 'documents' },
  { label: 'News & Media',   href: '/admin/news',           icon: Newspaper,       permission: 'news' },
  { label: 'Board Members',  href: '/admin/board-members',  icon: Users,           permission: 'board-members' },
  { label: 'Careers',        href: '/admin/careers',        icon: Briefcase,       permission: 'careers' },
  { label: 'Contact Cards',  href: '/admin/contact-cards',  icon: MapPin,          permission: 'contact-cards' },
  { label: 'Contacts',       href: '/admin/contacts',       icon: MessageSquare,   permission: 'contacts' },
  { label: 'Notifications',  href: '/admin/notifications',  icon: Bell,            permission: 'notifications' },
  { label: 'System Settings',href: '/admin/settings',       icon: Settings,        permission: 'settings' },
];

export default function AdminSidebar({ unreadNotifications = 0, unreadContacts = 0 }) {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  useEffect(() => setIsOpen(false), [pathname]);

  const getBadge = (href) => {
    if (href === '/admin/notifications' && unreadNotifications > 0) return unreadNotifications;
    if (href === '/admin/contacts' && unreadContacts > 0) return unreadContacts;
    return null;
  };

  // Filter nav items by permission
  const visibleNav = NAV.filter(item => hasPermission(item.permission));

  return (
    <>
      {/* --- MOBILE HEADER --- */}
      <header className="lg:hidden h-16 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/50 flex items-center justify-between px-5 fixed top-0 left-0 right-0 z-[100]">
        <Link href="/admin" className="flex items-center">
          <Image 
            src={logo} 
            alt="Vaswani Logo" 
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          {isOpen ? <X size={22} className="text-teal-400" /> : <Menu size={22} />}
        </button>
      </header>

      {/* --- OVERLAY --- */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] lg:hidden animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 h-screen w-72 lg:w-64 bg-[#09090b] border-r border-zinc-800/40 flex flex-col z-[120] transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* LOGO SECTION */}
        <div className="hidden lg:flex px-6 h-24 bg-white items-center">
          <Link href="/admin" className="flex flex-col">
            <Image 
              src={logo} 
              alt="Vaswani Logo" 
              className="h-10 w-auto object-contain brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              priority
            />
            <p className="text-teal-500/80 text-[9px] font-bold tracking-[0.3em] mt-2 ml-1 uppercase">Admin Console</p>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 pt-20 lg:pt-2 pb-6 space-y-1 overflow-y-auto scrollbar-hide">
          <div className="px-3 mb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-t border-zinc-800/50 pt-4">Main Menu</div>
          {visibleNav.map(({ label, href, icon: Icon, permission }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            const badge = getBadge(href);
            
            return (
              <Link 
                key={href} 
                href={href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200
                  ${active ? 'bg-teal-500/10 text-teal-400 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.1)]' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'}`}
              >
                {active && <div className="absolute left-[-16px] w-1 h-5 bg-teal-500 rounded-r-full shadow-[4px_0_10px_rgba(20,184,166,0.5)]" />}
                <Icon size={18} className={`${active ? 'text-teal-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black animate-pulse
                    ${active ? 'bg-teal-500 text-[#09090b]' : 'bg-red-500 text-white'}`}>
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE SECTION */}
        <div className="p-4 relative" ref={profileRef}>
          {showProfileMenu && (
            <div className="absolute bottom-[90px] left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 animate-in slide-in-from-bottom-2 duration-200">
              <Link href="/admin/settings" className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                <User size={14} /> View Profile
              </Link>
              <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors border-b border-zinc-800 mb-1 pb-3">
                <ExternalLink size={14} /> Visit Website
              </Link>
              <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold">
                <LogOut size={14} /> Sign Out System
              </button>
            </div>
          )}

          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full group bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/50 rounded-2xl p-3 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700 group-hover:border-teal-500/50 transition-colors">
                <span className="text-teal-400 font-black text-sm uppercase">{user?.name?.charAt(0)}</span>
                <div className="absolute bottom-[-2px] right-[-2px] w-3.5 h-3.5 bg-green-500 border-2 border-[#09090b] rounded-full" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-zinc-100 text-xs font-black truncate uppercase tracking-tighter leading-none mb-1">{user?.name}</p>
                <div className="flex items-center gap-1">
                   <ShieldCheck size={10} className="text-teal-500" />
                   <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">{user?.role || 'Administrator'}</p>
                </div>
              </div>
              <ChevronUp size={14} className={`text-zinc-600 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
