'use client';
import { useState, useEffect } from 'react';
import { 
  FileText, Newspaper, Users, MessageSquare, 
  Briefcase, Package, ArrowRight, Sparkles, 
  Clock, Calendar, TrendingUp, Eye, Mail, Bell
} from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

function StatCard({ icon: Icon, label, value, color, sub, href }) {
  return (
    <Link href={href} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300 ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-black text-zinc-900 tracking-tight">{value ?? '0'}</p>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">{label}</p>
          {sub && <p className="text-[10px] text-teal-600 font-bold mt-0.5">{sub}</p>}
        </div>
        <div className="text-zinc-200 group-hover:text-teal-500 transition-colors">
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ docs: 0, news: 0, members: 0, contacts: 0, unread: 0, jobs: 0, products: 0 });
  const [recentNews, setRecentNews] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const fetchStats = async () => {
      try {
        const results = await Promise.allSettled([
          adminApi.get('/documents'),
          adminApi.get('/news?limit=5'),
          adminApi.get('/board-members'),
          adminApi.get('/contacts'),
          adminApi.get('/careers'),
          adminApi.get('/products'),
          adminApi.get('/notifications?limit=5'),
        ]);
        const getData = (idx) => results[idx].status === 'fulfilled' ? results[idx].value.data : null;

        const newsData = getData(1);
        const contactsData = getData(3);
        const notifData = getData(6);

        setStats({
          docs: getData(0)?.count || getData(0)?.documents?.length || 0,
          news: newsData?.total || newsData?.count || newsData?.news?.length || 0,
          members: getData(2)?.members?.length || getData(2)?.count || 0,
          contacts: contactsData?.total || contactsData?.contacts?.length || contactsData?.count || 0,
          unread: contactsData?.unreadCount || 0,
          jobs: getData(4)?.total || getData(4)?.jobs?.length || getData(4)?.count || 0,
          products: getData(5)?.total || getData(5)?.products?.length || getData(5)?.count || 0,
        });

        // Recent items
        setRecentNews((newsData?.news || []).slice(0, 5));
        setRecentContacts((contactsData?.contacts || []).slice(0, 5));
        setRecentNotifications((notifData?.notifications || []).slice(0, 5));
      } catch (err) { console.error(err); }
      setLoading(false);
    };

    fetchStats();
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateString = currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const CARDS = [
    { icon: FileText, label: 'Docs', value: stats.docs, color: 'bg-emerald-500', sub: 'PDF Reports', href: '/admin/documents' },
    { icon: Newspaper, label: 'Media', value: stats.news, color: 'bg-teal-500', sub: 'Latest News', href: '/admin/news' },
    { icon: Users, label: 'Board', value: stats.members, color: 'bg-emerald-600', sub: 'Directors', href: '/admin/board-members' },
    { icon: Package, label: 'Inventory', value: stats.products, color: 'bg-green-500', sub: 'VIL Products', href: '/admin/products' },
    { icon: Briefcase, label: 'Jobs', value: stats.jobs, color: 'bg-cyan-600', sub: 'Hiring', href: '/admin/careers' },
    { icon: MessageSquare, label: 'Inbox', value: stats.contacts, color: 'bg-emerald-400', sub: stats.unread ? `${stats.unread} New` : 'Clean', href: '/admin/contacts' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-100 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-teal-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-600/70">{greeting}</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-1">
            Hi, {user?.name?.split(' ')[0] || 'Admin'} <span className="text-teal-500">.</span>
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Manage your industrial operations seamlessly.</p>
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-4 bg-zinc-50/80 border border-zinc-100 p-4 rounded-2xl">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600">
            <Clock size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-zinc-800 tabular-nums leading-none mb-1">{timeString}</span>
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <Calendar size={12} className="text-zinc-300" />
              {dateString}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(6)].map((_, i) => <div key={i} className="h-24 bg-white border border-zinc-100 rounded-2xl animate-pulse" />) 
                 : CARDS.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent News */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              <div className="w-2 h-5 bg-teal-500 rounded-full" />
              Recent News
            </h2>
            <Link href="/admin/news" className="text-[10px] font-black text-teal-600 uppercase tracking-wider hover:opacity-70 transition-opacity flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
          ) : recentNews.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper size={28} className="mx-auto text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No news articles yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNews.map(item => (
                <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Newspaper size={16} className="text-teal-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-gray-400 font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">{item.category}</span>
                      {item.views > 0 && <span className="text-[10px] text-gray-400 flex items-center gap-1"><Eye size={10} /> {item.views}</span>}
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.isPublished ? 'bg-green-400' : 'bg-gray-300'}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              <div className="w-2 h-5 bg-emerald-500 rounded-full" />
              Recent Messages
            </h2>
            <Link href="/admin/contacts" className="text-[10px] font-black text-teal-600 uppercase tracking-wider hover:opacity-70 transition-opacity flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
          ) : recentContacts.length === 0 ? (
            <div className="text-center py-8">
              <Mail size={28} className="mx-auto text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentContacts.map(item => (
                <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
                    <Mail size={16} className={item.isRead ? 'text-gray-400' : 'text-blue-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${item.isRead ? 'font-medium text-gray-600' : 'font-bold text-gray-900'}`}>{item.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{item.message}</p>
                  </div>
                  <span className="text-[10px] text-gray-300 font-medium flex-shrink-0">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-gray-900 flex items-center gap-2">
            <div className="w-2 h-5 bg-orange-400 rounded-full" />
            Latest Notifications
          </h2>
          <Link href="/admin/notifications" className="text-[10px] font-black text-teal-600 uppercase tracking-wider hover:opacity-70 transition-opacity flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : recentNotifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell size={28} className="mx-auto text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No notifications</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentNotifications.map(n => (
              <div key={n._id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${!n.isRead ? 'bg-teal-50/50 border-teal-100' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  <Bell size={14} className={!n.isRead ? 'text-teal-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs truncate ${!n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>{n.title}</p>
                  <p className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 animate-pulse" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-black text-gray-900 mb-5 flex items-center gap-2">
          <div className="w-2 h-5 bg-purple-500 rounded-full" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Upload PDF', href: '/admin/documents', icon: FileText, color: 'group-hover:bg-emerald-500' },
            { label: 'Add News', href: '/admin/news', icon: Newspaper, color: 'group-hover:bg-teal-500' },
            { label: 'Check Mail', href: '/admin/contacts', icon: MessageSquare, color: 'group-hover:bg-blue-500' },
            { label: 'Post Job', href: '/admin/careers', icon: Briefcase, color: 'group-hover:bg-cyan-600' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center group p-4 rounded-xl hover:bg-gray-50 transition-all">
              <div className={`w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 ${item.color} transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}>
                <item.icon size={22} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[12px] font-bold text-zinc-600 group-hover:text-teal-600 transition-colors">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
