'use client';
import { useState, useEffect } from 'react';
import adminApi from '@/lib/admin-api';
import { Plus, Trash2, Edit2, X, MapPin, Phone, Mail, Globe, Building, Save } from 'lucide-react';

const ICON_OPTIONS = ['MapPin', 'Phone', 'Mail', 'Globe', 'Building'];

function CardModal({ item, onClose, onSuccess }) {
  const isEdit = !!item?._id;
  const [form, setForm] = useState({
    title: item?.title || '',
    icon: item?.icon || 'MapPin',
    lines: item?.lines?.join('\n') || '',
    order: item?.order || 0,
    isActive: item?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.title) { setError('Title is required'); return; }
    setLoading(true); setError('');
    try {
      const payload = {
        ...form,
        lines: form.lines.split('\n').map(l => l.trim()).filter(Boolean),
      };
      if (isEdit) await adminApi.put(`/contact-cards/${item._id}`, payload);
      else await adminApi.post('/contact-cards', payload);
      onSuccess(); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Save failed'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={20} /></button>
        <h3 className="text-lg font-bold text-gray-900 mb-6">{isEdit ? 'Edit' : 'Add'} Contact Card</h3>
        {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. HEAD OFFICE" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <select className="input" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
              {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Lines (one per line)</label>
            <textarea className="input resize-none" rows={4} value={form.lines} onChange={e => setForm(p => ({ ...p, lines: e.target.value }))} placeholder="Line 1&#10;Line 2&#10;Line 3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input type="number" className="input" value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-teal-500' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">{form.isActive ? 'Active' : 'Hidden'}</span>
          </label>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
            <Save size={16} /> {loading ? 'Saving...' : isEdit ? 'Update Card' : 'Create Card'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactCardsAdminPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, item: null });

  const fetchCards = async () => {
    setLoading(true);
    try { const { data } = await adminApi.get('/contact-cards/admin'); setCards(data.cards || []); } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchCards(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this card?')) return;
    try { await adminApi.delete(`/contact-cards/${id}`); setCards(c => c.filter(x => x._id !== id)); } catch { }
  };

  const getIcon = (name) => {
    const icons = { MapPin, Phone, Mail, Globe, Building };
    const Icon = icons[name] || MapPin;
    return <Icon size={20} className="text-teal-500" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Info Cards</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage the contact info section above the contact form</p>
        </div>
        <button onClick={() => setModal({ open: true, item: null })} className="btn-primary">
          <Plus size={16} /> Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? <p className="col-span-3 text-center py-12 text-gray-400">Loading...</p>
          : cards.length === 0 ? (
            <div className="col-span-3 card p-12 text-center text-gray-400">
              <MapPin size={40} className="mx-auto mb-3 opacity-30" />
              No contact cards yet. Add your first card.
            </div>
          ) : cards.map(card => (
            <div key={card._id} className="card p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {getIcon(card.icon)}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0
                  ${card.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {card.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{card.title}</h3>
              <div className="text-gray-500 text-xs space-y-0.5">
                {card.lines?.map((line, i) => <p key={i}>{line}</p>)}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setModal({ open: true, item: card })}
                  className="btn-outline text-xs py-1.5 px-3 flex-1 justify-center"><Edit2 size={12} /> Edit</button>
                <button onClick={() => handleDelete(card._id)}
                  className="text-xs py-1.5 px-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
      </div>

      {modal.open && <CardModal item={modal.item} onClose={() => setModal({ open: false, item: null })} onSuccess={fetchCards} />}
    </div>
  );
}
