'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import { useSettings } from '@/components/WebsiteShell';

const QUICK_LINKS = [
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about/the-company' },
  { label: 'News & Media', href: '/news' },
];

const INVESTOR_LINKS = [
  { label: 'Financials', href: '/investors/financials' },
  { label: 'Annual Reports', href: '/investors/financials' },
  { label: 'Company Announcements', href: '/investors/listing-information' },
  { label: 'Policies', href: '/investors/policies' },
  { label: "Investor's Contact", href: '/contact' },
];

export default function Footer() {
  const settings = useSettings();
  const year = new Date().getFullYear();

  const phone = settings?.phone || '+91 7713540221';
  const email = settings?.email || 'hrd@vaswaniindustries.com';
  const address = settings?.address || 'Vaswani Industries Limited, Sondra, Phase - II, Bahesar Road, Siltara, Raipur, CG';
  const facebook = settings?.facebook || '#';
  const twitter = settings?.twitter || '#';
  const linkedin = settings?.linkedin || '#';
  const sisterConcern = settings?.sisterConcern || 'Kwality Foundry Industries';
  const sisterConcernUrl = settings?.sisterConcernUrl || 'https://www.kfai.in/';

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand & Contact Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block group">
              <div className="relative">
                <img 
                  src="/logo_Vaswani industries_v.png" 
                  alt="Vaswani Industries Ltd." 
                  className="h-24 lg:h-28 w-auto bg-white rounded-xl p-3 object-contain shadow-lg border border-white/10 transition-transform group-hover:scale-105" 
                />
              </div>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed mb-6 mt-5 max-w-xs">
              Vaswani Group of Industries is one of the reputed group of Chhattisgarh. Our Group has a chain of value-added products which include Induction Furnance, Sponge Iron, Power, Steel Billet,TMT Bars, Forgings & Casting.
            </p>
            
            <div className="space-y-3 text-sm">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors group">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-teal-500/10 transition-colors">
                  <Phone size={13} className="text-teal-400" />
                </div>
                {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors group">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-teal-500/10 transition-colors">
                  <Mail size={13} className="text-teal-400" />
                </div>
                <span>{email}</span>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-teal-400" />
                </div>
                <span className="text-sm">{address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-white/10">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                    <span className="w-1 h-1 bg-teal-500/0 group-hover:bg-teal-500 rounded-full transition-all flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Investor */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-white/10">
              Investor
            </h3>
            <ul className="space-y-2.5">
              {INVESTOR_LINKS.map(l => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                    <span className="w-1 h-1 bg-teal-500/0 group-hover:bg-teal-500 rounded-full transition-all flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sister Concern + Social */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-white/10">
              Our Sister Concern
            </h3>
            <a href={sisterConcernUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 font-semibold transition-colors mb-8">
              {sisterConcern} <ArrowUpRight size={13} />
            </a>

            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: facebook, label: 'Facebook' },
                { icon: Twitter, href: twitter, label: 'Twitter' },
                { icon: Linkedin, href: linkedin, label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={`Vaswani Industries on ${label}`}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-teal-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 border border-white/10 hover:border-teal-500">
                  <Icon size={15} />
                </a>
              ))}
            </div>

            {/* BSE badge */}
            <div className="mt-6 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-300 font-semibold">BSE Listed | CIN: L27106CT1994PLC007401</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {year} | VASWANI GROUP OF INDUSTRIES</span>
          <div className="flex items-center gap-4">
            <Link href="/about/the-company" className="hover:text-teal-400 transition-colors">Terms of use</Link>
            <span className="text-gray-700">·</span>
            <Link href="/investors/policies" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
