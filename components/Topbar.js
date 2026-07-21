'use client';
import { Phone, Mail, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useSettings } from '@/components/WebsiteShell';

export default function Topbar() {
  const settings = useSettings();

  const phone = settings?.phone || '+91 7713540221';
  const email = settings?.email || 'hrd@vaswaniindustries.com';
  const facebook = settings?.facebook || '#';
  const twitter = settings?.twitter || '#';
  const linkedin = settings?.linkedin || '#';

  return (
    <div className="hidden md:block bg-gray-950 text-gray-300 py-2.5">
      <div className="page-container flex items-center justify-between text-xs">
        <div className="flex items-center divide-x divide-gray-700">
          <a href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-1.5 pr-4 hover:text-teal-400 transition-colors">
            <Phone size={12} className="text-teal-400" />
            {phone}
          </a>
          <a href={`mailto:${email}`}
            className="flex items-center gap-1.5 pl-4 hover:text-teal-400 transition-colors">
            <Mail size={12} className="text-teal-400" />
            {email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          {[
            { icon: Facebook, href: facebook, label: 'Facebook' },
            { icon: Twitter, href: twitter, label: 'Twitter' },
            { icon: Linkedin, href: linkedin, label: 'LinkedIn' },
          ].map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              aria-label={label}
              className="w-6 h-6 rounded-full bg-gray-800 hover:bg-teal-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
              <Icon size={11} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
