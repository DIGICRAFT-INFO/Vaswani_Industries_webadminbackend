'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, PhoneCall, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us', href: '/about/the-company',
    children: [
      { label: 'The Company', href: '/about/the-company' },
      { label: "Chairman's Message", href: '/about/chairmans-message' },
      { label: 'Board of Directors', href: '/about/board-of-directors' },
      { label: 'Committees', href: '/about/committees' },
      { label: 'Familiarization Programme', href: '/about/familiarization-programme' },
    ],
  },
  {
    label: 'Our Products', href: '/products/forging-ingots-and-billets',
    children: [
      { label: 'Forging Ingots & Billets', href: '/products/forging-ingots-and-billets' },
      { label: 'Sponge Iron (DRI)', href: '/products/sponge-iron' },
      { label: 'Power', href: '/products/power' },
    ],
  },
  { label: 'News & Media', href: '/news' },
  {
    label: 'Investors', href: '/investors/financials',
    children: [
      { label: 'Financials', href: '/investors/financials' },
      { label: 'Disclosures', href: '/investors/disclosures' },
      { label: 'Listing Information', href: '/investors/listing-information' },
      { label: 'Policies', href: '/investors/policies' },
      { label: 'SEBI Disclosure', href: '/investors/sebi-disclosure' },
      { label: 'Others', href: '/investors/others' },
    ],
  },
  { label: 'Careers', href: '/careers' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const pathname = usePathname();
  const navRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleMouseEnter = (label) => {
    if (window.innerWidth < 1024) return;
    clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      {/* --- SLIM TOPBAR --- */}
      <div className={`hidden lg:block bg-[#1a2b3b] text-white/90 py-1.5 transition-all duration-300 overflow-hidden ${
        scrolled ? 'h-0 opacity-0 translate-y-[-100%]' : 'h-8 opacity-100 translate-y-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[11px] font-medium tracking-wide">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Mail size={12} className="text-[#14b8a6]" />hrd@vaswaniindustries.com

</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#14b8a6]" /> Raipur, Chhattisgarh</span>
          </div>
          <div className="flex items-center gap-5">
            <span>CIN: L28939CT2003PLC015964</span>
            <span className="flex items-center gap-1.5"><PhoneCall size={12} className="text-[#14b8a6]" /> +91-07713540221</span>
          </div>
        </div>
      </div>

      {/* --- SLIM MAIN NAVBAR --- */}
      <nav ref={navRef} className={`bg-white transition-all duration-500 ${
        scrolled ? 'shadow-md h-14 lg:h-16' : 'border-b border-gray-100 h-16 lg:h-18'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          <Link href="/" className="relative z-[110]">
            <img 
              src="/logo_Vaswani industries_h.png" 
              alt="Logo" 
              className={`transition-all duration-300 object-contain ${scrolled ? 'h-7 lg:h-8' : 'h-8 lg:h-10'}`} 
            />
          </Link>

          {/* Slim Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.label} 
                className="relative" 
                onMouseEnter={() => handleMouseEnter(item.label)} 
                onMouseLeave={handleMouseLeave}
              >
                <Link href={item.href} className={`flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold rounded-full transition-all ${
                  isActive(item.href) ? 'text-[#14b8a6] bg-teal-50/50' : 'text-gray-700 hover:text-[#14b8a6] hover:bg-gray-50'
                }`}>
                  {item.label}
                  {item.children && <ChevronDown size={12} className={`transition-transform ${openMenu === item.label ? 'rotate-180' : ''}`} />}
                </Link>

                <AnimatePresence>
                  {item.children && openMenu === item.label && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                      {item.children.map(child => (
                        <Link key={child.href} href={child.href} className="flex items-center px-4 py-2 text-[13px] text-gray-600 hover:bg-[#14b8a6] hover:text-white font-semibold transition-all mx-1.5 rounded-lg">
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Slim CTA */}
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden lg:flex items-center gap-2 bg-[#1a2b3b] text-white px-5 py-2 rounded-full text-[13px] font-bold hover:bg-[#14b8a6] transition-all">
              <PhoneCall size={14} /> Contact Us
            </Link>
            <button 
              className="lg:hidden relative z-[110] w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200" 
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER (Remains same for UX) --- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-[85%] max-w-xs bg-white z-[100] shadow-2xl lg:hidden flex flex-col">
              <div className="p-6 pt-24 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.label} className="flex flex-col border-b border-gray-50 pb-1">
                      <div className="flex items-center w-full">
                        <Link href={item.href} onClick={() => setMobileOpen(false)} className={`flex-1 py-3 px-2 text-[16px] font-bold ${isActive(item.href) ? 'text-[#14b8a6]' : 'text-[#1a2b3b]'}`}>
                          {item.label}
                        </Link>
                        {item.children && (
                          <button onClick={(e) => { e.preventDefault(); setMobileExpanded(mobileExpanded === item.label ? null : item.label); }} className={`p-3 ml-2 rounded-xl transition-all ${mobileExpanded === item.label ? 'bg-[#14b8a6] text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <ChevronDown size={18} className={`transition-transform duration-300 ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {item.children && mobileExpanded === item.label && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-gray-50 rounded-xl mt-1 mx-1">
                            <div className="p-2 space-y-1 flex flex-col">
                              {item.children.map((child) => (
                                <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} className={`py-3 px-5 text-[14px] font-semibold rounded-lg ${pathname === child.href ? 'text-[#14b8a6] bg-white shadow-sm' : 'text-gray-600'}`}>
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                 <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-3 w-full bg-[#1a2b3b] text-white py-3.5 rounded-xl font-bold">
                    <PhoneCall size={18} /> Contact Us
                 </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
