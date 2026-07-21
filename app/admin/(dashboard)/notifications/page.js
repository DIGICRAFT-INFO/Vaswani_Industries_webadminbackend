'use client';
import { useState, useEffect, useCallback } from 'react';
import adminApi from '@/lib/admin-api';
import { Bell, Mail, Briefcase, FileText, Edit, User, CheckCheck, Trash2, RefreshCw, ExternalLink, Loader2, Inbox, Square, CheckSquare, MinusSquare } from 'lucide-react';
import Link from 'next/link';

const ICON_MAP = {
  new_contact: { icon: Mail, color: 'bg-blue-50 text-blue-500 border-blue-100' },
  new_application: { icon: Briefcase, color: 'bg-orange-50 text-orange-500 border-orange-100' },
  new_document: { icon: FileText, color: 'bg-teal-50 text-teal-500 border-teal-100' },
  page_updated: { icon: Edit, color: 'bg-purple-50 text-purple-500 border-purple-100' },
  user_created: { icon: User, color: 'bg-green-50 text-green-500 border-green-100' },
  system: { icon: Bell, color: 'bg-gray-50 text-gray-500 border-gray-100' },
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const intervals = { y: 31536000, mo: 2592000, d: 86400, h: 3600, m: 60 };
  for (let key in intervals) {
    const counter = Math.floor(seconds / intervals[key]);
    if (counter > 0) return `${counter}${key} ago`;
  }
  return 'Just now';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isClearing, setIsClearing] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetch_ = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const params = filter === 'unread' ? { unreadOnly: true } : {};
      const { data } = await adminApi.get('/notifications', { params });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch { }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  // Clear selection when filter changes
  useEffect(() => { setSelected([]); }, [filter]);

  const [, setTick] = useState(0);
  useEffect(() => { const timer = setInterval(() => setTick(t => t + 1), 60000); return () => clearInterval(timer); }, []);

  // Toggle single selection
  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Select all / deselect all
  const toggleSelectAll = () => {
    if (selected.length === notifications.length) {
      setSelected([]);
    } else {
      setSelected(notifications.map(n => n._id));
    }
  };

  const markRead = async (id) => {
    try {
      await adminApi.put(`/notifications/${id}/read`);
      setNotifications(n => n.map(x => x._id === id ? { ...x, isRead: true } : x));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch { }
  };

  const markAllRead = async () => {
    try {
      await adminApi.put('/notifications/read-all');
      setNotifications(n => n.map(x => ({ ...x, isRead: true })));
      setUnreadCount(0);
    } catch { }
  };

  const deleteNotification = async (id) => {
    try {
      await adminApi.delete(`/notifications/${id}`);
      const target = notifications.find(x => x._id === id);
      setNotifications(n => n.filter(x => x._id !== id));
      setSelected(prev => prev.filter(x => x !== id));
      if (target && !target.isRead) setUnreadCount(c => Math.max(0, c - 1));
    } catch { }
  };

  // Bulk delete selected
  const deleteSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected notification${selected.length > 1 ? 's' : ''}?`)) return;
    setIsDeleting(true);
    try {
      // Try bulk delete endpoint first
      try {
        await adminApi.post('/notifications/bulk-delete', { ids: selected });
      } catch {
        // Fallback: delete one by one
        await Promise.all(selected.map(id => adminApi.delete(`/notifications/${id}`)));
      }
      const unreadDeleted = notifications.filter(n => selected.includes(n._id) && !n.isRead).length;
      setNotifications(n => n.filter(x => !selected.includes(x._id)));
      setUnreadCount(c => Math.max(0, c - unreadDeleted));
      setSelected([]);
    } catch { }
    setIsDeleting(false);
  };

  const clearRead = async () => {
    if (!confirm('Permanently delete all read notifications?')) return;
    setIsClearing(true);
    try {
      await adminApi.delete('/notifications/clear-all');
      setNotifications(n => n.filter(x => !x.isRead));
      setSelected([]);
    } catch { }
    setIsClearing(false);
  };

  const isAllSelected = notifications.length > 0 && selected.length === notifications.length;
  const isSomeSelected = selected.length > 0 && selected.length < notifications.length;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Updates</h1>
            {unreadCount > 0 && (
              <span className="bg-teal-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-teal-500/20 animate-bounce">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <p className="text-gray-400 font-medium">System activity and user inquiries</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            {['all', 'unread'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden md:block" />
          <button onClick={() => fetch_(true)} className="p-3 text-gray-400 hover:text-teal-500 transition-colors">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          {/* Select All Checkbox */}
          {notifications.length > 0 && (
            <button onClick={toggleSelectAll} className="text-gray-400 hover:text-teal-500 transition-colors" title={isAllSelected ? 'Deselect all' : 'Select all'}>
              {isAllSelected ? <CheckSquare size={18} className="text-teal-500" /> : isSomeSelected ? <MinusSquare size={18} className="text-teal-500" /> : <Square size={18} />}
            </button>
          )}

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider">
                {selected.length} selected
              </span>
              <button onClick={deleteSelected} disabled={isDeleting}
                className="text-[10px] font-black text-red-500 uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity disabled:opacity-50 bg-red-50 px-3 py-1.5 rounded-lg">
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete Selected
              </button>
            </div>
          )}

          {/* Mark all read */}
          {selected.length === 0 && unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[10px] font-black text-teal-600 uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}

          {/* Clear archived */}
          {selected.length === 0 && (
            <button onClick={clearRead} disabled={isClearing}
              className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5 hover:text-red-500 transition-colors disabled:opacity-50">
              {isClearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Clear archived
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-[80px] bg-white border border-gray-100 rounded-3xl animate-pulse flex items-center px-6 gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-50 rounded w-1/3" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="card p-24 text-center border-dashed border-2 flex flex-col items-center rounded-3xl">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Inbox size={32} className="text-gray-200" />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Everything is up to date</p>
            <p className="text-gray-300 text-xs mt-1">New activity will be shown here as it happens.</p>
          </div>
        ) : (
          notifications.map(n => {
            const config = ICON_MAP[n.type] || ICON_MAP.system;
            const Icon = config.icon;
            const isSelected = selected.includes(n._id);
            return (
              <div key={n._id}
                className={`group relative flex items-center gap-4 p-5 rounded-[2rem] border transition-all cursor-pointer ${isSelected ? 'bg-teal-50/50 border-teal-200 ring-1 ring-teal-200' : !n.isRead ? 'bg-white border-teal-500/20 shadow-xl shadow-teal-500/5 ring-1 ring-teal-500/5' : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-200'}`}>

                {/* Unread dot */}
                {!n.isRead && !isSelected && (
                  <div className="absolute left-2 w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                )}

                {/* Checkbox */}
                <button onClick={(e) => { e.stopPropagation(); toggleSelect(n._id); }}
                  className="flex-shrink-0 text-gray-300 hover:text-teal-500 transition-colors">
                  {isSelected ? <CheckSquare size={18} className="text-teal-500" /> : <Square size={18} />}
                </button>

                {/* Icon */}
                <div onClick={() => !n.isRead && markRead(n._id)}
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${config.color}`}>
                  <Icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => !n.isRead && markRead(n._id)}>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-black tracking-tight truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-500'}`}>{n.title}</p>
                    {!n.isRead && (<span className="w-1.5 h-1.5 rounded-full bg-teal-500 md:hidden" />)}
                  </div>
                  <p className={`text-[11px] mt-0.5 line-clamp-1 ${!n.isRead ? 'text-gray-600' : 'text-gray-400'}`}>{n.message}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{timeAgo(n.createdAt)}</span>
                    <span className="text-[10px] font-black text-gray-200 tracking-widest uppercase">• {n.type.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {n.link && (
                    <Link href={n.link} onClick={e => e.stopPropagation()} className="p-3 text-gray-400 hover:text-teal-500 hover:bg-teal-50 rounded-2xl transition-all">
                      <ExternalLink size={16} />
                    </Link>
                  )}
                  <button onClick={e => { e.stopPropagation(); deleteNotification(n._id); }}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
