'use client';
import { useState, useEffect, useCallback } from 'react';
import adminApi from '@/lib/admin-api';
import { Mail, MailOpen, Trash2, Phone, X, MessageSquare, User, Calendar, ExternalLink, Loader2, Inbox, Search, Filter } from 'lucide-react';

function MessageModal({ msg, onClose, onMarkRead }) {
  if (!msg) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-4 py-6">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start">
          <div><span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 ${msg.isRead ? 'bg-gray-100 text-gray-500' : 'bg-teal-500 text-white'}`}>{msg.isRead ? 'Archived Message' : 'New Inquiry'}</span><h3 className="text-xl font-black text-gray-900 leading-tight">{msg.subject || 'Inquiry from Website'}</h3></div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={20} /></button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender</p><p className="text-sm font-bold text-gray-900 flex items-center gap-2"><User size={14} className="text-teal-500" /> {msg.name}</p></div><div className="space-y-1 text-right"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Received</p><p className="text-sm font-medium text-gray-600 flex items-center justify-end gap-2">{new Date(msg.createdAt).toLocaleDateString()} <Calendar size={14} /></p></div></div>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100"><div className="flex flex-col"><span className="text-[10px] font-black text-gray-400 uppercase">Email Address</span><span className="text-sm font-bold text-gray-700">{msg.email}</span></div><a href={`mailto:${msg.email}`} className="p-2 bg-white text-teal-500 rounded-xl shadow-sm hover:bg-teal-500 hover:text-white transition-all"><ExternalLink size={16} /></a></div>
            {msg.phone && (<div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100"><div className="flex flex-col"><span className="text-[10px] font-black text-gray-400 uppercase">Phone Number</span><span className="text-sm font-bold text-gray-700">{msg.phone}</span></div><a href={`tel:${msg.phone}`} className="p-2 bg-white text-teal-500 rounded-xl shadow-sm hover:bg-teal-500 hover:text-white transition-all"><Phone size={16} /></a></div>)}
          </div>
          <div className="bg-teal-50/30 rounded-2xl p-6 border border-teal-100/50"><p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageSquare size={12} /> Message Body</p><p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p></div>
        </div>
        <div className="p-8 border-t border-gray-100 flex gap-3">
          <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Inquiry'}`} className="admin-btn-primary flex-1 justify-center py-4 text-sm font-black tracking-widest uppercase">Send Reply</a>
          {!msg.isRead && (<button onClick={() => { onMarkRead(msg._id); onClose(); }} className="admin-btn-outline px-6 text-xs font-black uppercase tracking-widest border-gray-200">Mark Read</button>)}
        </div>
      </div>
    </div>
  );
}

export default function ContactsAdminPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try { const params = filter === 'unread' ? { isRead: false } : filter === 'read' ? { isRead: true } : {}; const { data } = await adminApi.get('/contacts', { params }); setMessages(data.contacts || []); }
    catch (err) { console.error("Failed to fetch messages"); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (id) => { try { await adminApi.put(`/contacts/${id}/read`); setMessages(m => m.map(x => x._id === id ? { ...x, isRead: true } : x)); } catch { } };
  const handleDelete = async (e, id) => { e.stopPropagation(); if (!confirm('Permanently delete this message?')) return; try { await adminApi.delete(`/contacts/${id}`); setMessages(m => m.filter(x => x._id !== id)); if (selected?._id === id) setSelected(null); } catch { } };
  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div><h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3"><Inbox className="text-teal-500" /> Inquiries</h1><div className="flex items-center gap-3 mt-1"><p className="text-gray-500 font-medium text-sm">Customer outreach records</p>{unreadCount > 0 && (<span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black animate-pulse"><div className="w-1 h-1 bg-red-600 rounded-full" /> {unreadCount} UNREAD</span>)}</div></div>
        <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">{['all', 'unread', 'read'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{f}</button>))}</div>
      </div>
      <div className="space-y-3">
        {loading ? ([...Array(4)].map((_, i) => (<div key={i} className="card p-6 flex items-center gap-4 animate-pulse"><div className="w-12 h-12 bg-gray-100 rounded-full" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-1/4" /><div className="h-3 bg-gray-50 rounded w-1/2" /></div></div>)))
          : messages.length === 0 ? (<div className="card p-24 text-center border-dashed border-2"><div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100"><Mail className="text-gray-200" size={32} /></div><p className="text-gray-400 font-black uppercase tracking-widest text-sm">No {filter} messages found</p></div>)
          : messages.map(msg => (
            <div key={msg._id} onClick={() => { setSelected(msg); if (!msg.isRead) markRead(msg._id); }}
              className={`card group relative p-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer transition-all border-l-4 ${!msg.isRead ? 'border-l-teal-500 bg-teal-50/10 shadow-lg shadow-teal-500/5' : 'border-l-transparent hover:bg-gray-50'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${!msg.isRead ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{msg.isRead ? <MailOpen size={20} /> : <Mail size={20} />}</div>
              <div className="flex-1 min-w-0"><div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4"><span className={`text-sm font-black truncate tracking-tight ${!msg.isRead ? 'text-gray-900' : 'text-gray-500'}`}>{msg.name}</span><span className="text-[11px] font-bold text-gray-400 hidden md:block">•</span><span className="text-[11px] font-bold text-teal-600/70 truncate">{msg.email}</span></div><p className={`text-sm mt-1 truncate max-w-2xl ${!msg.isRead ? 'text-gray-700 font-bold' : 'text-gray-400'}`}>{msg.subject || 'New Web Inquiry'} — <span className="font-normal opacity-70">{msg.message}</span></p></div>
              <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0"><div className="text-right"><p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">{new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p><p className="text-[10px] font-medium text-gray-300">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div><button onClick={(e) => handleDelete(e, msg._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={16} /></button></div>
            </div>
          ))}
      </div>
      {selected && (<MessageModal msg={selected} onClose={() => setSelected(null)} onMarkRead={markRead} />)}
    </div>
  );
}
