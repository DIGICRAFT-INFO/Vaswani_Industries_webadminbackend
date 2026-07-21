'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import VaswaniBot from '@/components/admin/VaswaniBot';
import { Bell, Menu, X } from 'lucide-react';
import Link from 'next/link';
import adminApi from '@/lib/admin-api';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotif, setUnreadNotif] = useState(0);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const isFetching = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) router.replace('/admin/login');
  }, [user, loading, router]);

  // Memoized fetch function
  const fetchCounts = useCallback(async () => {
    if (!user || isFetching.current) return;
    
    isFetching.current = true;
    try {
      const [notifRes, contactRes] = await Promise.allSettled([
        adminApi.get('/notifications/count'),
        adminApi.get('/contacts?limit=1'),
      ]);

      if (notifRes.status === 'fulfilled') {
        setUnreadNotif(notifRes.value.data.count || 0);
      }
      
      if (contactRes.status === 'fulfilled') {
        setUnreadContacts(contactRes.value.data.unreadCount || 0);
      }
    } catch (e) { 
      console.error("Polling error:", e); 
    } finally {
      isFetching.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (mounted && user) {
      fetchCounts();

      const interval = setInterval(() => {
        fetchCounts();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [mounted, user, fetchCounts]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname]);

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalBadge = unreadNotif + unreadContacts;

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans" suppressHydrationWarning>
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 bg-white border-r border-zinc-200">
        <AdminSidebar unreadNotifications={unreadNotif} unreadContacts={unreadContacts} />
      </aside>

      {/* 2. MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-[100] lg:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-zinc-900/20 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`absolute inset-y-0 left-0 w-72 bg-white transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-zinc-100 flex justify-end">
             <button onClick={() => setSidebarOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900"><X size={20}/></button>
          </div>
          <AdminSidebar unreadNotifications={unreadNotif} unreadContacts={unreadContacts} />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* 3. HEADER */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-zinc-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-100 rounded-md transition-all" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="hidden sm:block text-[13px] font-semibold text-zinc-400 uppercase tracking-widest">
              Vaswani <span className="text-zinc-900">Industries</span>
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/admin/notifications" className="relative text-zinc-400 hover:text-teal-600 transition-colors">
              <Bell size={19} strokeWidth={2.5} />
              {totalBadge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalBadge > 9 ? '9+' : totalBadge}
                </span>
              )}
            </Link>

            <div className="h-4 w-[1px] bg-zinc-200" />

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-zinc-900 leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
                {user?.name?.charAt(0) || 'V'}
              </div>
            </div>
          </div>
        </header>

        {/* 4. MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-10 transition-all">
          <div className="max-w-[1400px] mx-auto">
             {children}
          </div>
        </main>
      </div>

      {/* 5. VASWANI BOT */}
      <VaswaniBot />
    </div>
  );
}
