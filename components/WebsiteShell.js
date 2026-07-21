'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect, createContext, useContext } from 'react';
import Topbar from '@/components/Topbar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Settings context so all components can access site settings
const SettingsContext = createContext(null);
export const useSettings = () => useContext(SettingsContext);

export default function WebsiteShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (isAdmin) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => { if (data.success) setSettings(data.settings); })
      .catch(() => {});
  }, [isAdmin]);

  // Admin routes — no Navbar, no Footer, no Topbar
  if (isAdmin) {
    return <>{children}</>;
  }

  // Website routes — full layout with Topbar + Navbar + Footer
  return (
    <SettingsContext.Provider value={settings}>
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SettingsContext.Provider>
  );
}
