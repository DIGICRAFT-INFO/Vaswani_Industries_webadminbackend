'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import adminApi from '@/lib/admin-api';
import { Plus, Trash2, Edit2, X, Upload, User, Loader2, RefreshCw } from 'lucide-react';

const TYPES = ['WHOLE TIME DIRECTOR', 'NON-EXECUTIVE DIRECTOR', 'INDEPENDENT DIRECTOR', 'EXECUTIVE DIRECTOR', 'CHAIRMAN', 'ADDITIONAL WOMAN DIRECTOR'];
const COMMITTEE_NAMES = ['Audit Committee', 'Nomination & Remuneration Committee', 'Stakeholders Relationship Committee'];
const COMMITTEE_ROLES = ['CHAIRMAN', 'MEMBER'];

function MemberModal({ item, onClose, onSuccess }) {
  const isEdit = !!item?._id;
  const [form, setForm] = useState({ name: item?.name || '', designation: item?.designation || '', type: item?.type || 'INDEPENDENT DIRECTOR', bio: item?.bio || '', facebook: item?.facebook || '', twitter: item?.twitter || '', linkedin: item?.linkedin || '', order: item?.order || 0, isActive: item?.isActive ?? true });
  const [committees, setCommittees] = useState(item?.committees || []);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(item?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { return () => { if (preview && !preview.startsWith('http')) URL.revokeObjectURL(preview); }; }, [preview]);

  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { if (file.size > 1024 * 1024) return setError('Image must be under 1MB'); setImageFile(file); setPreview(URL.createObjectURL(file)); setError(''); } };

  const handleSubmit = async () => {
    if (!form.name || !form.designation) return setError('Name and Designation are required');
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      fd.append('committees', JSON.stringify(committees));
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEdit) await adminApi.put(`/board-members/${item._id}`, fd, config);
      else await adminApi.post('/board-members', fd, config);
      onSuccess(); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
        <div className="px-8 py-5 border-b flex justify-between items-center"><h3 className="font-bold text-gray-900 text-lg">{isEdit ? 'Edit' : 'Add'} Member</h3><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={18} /></button></div>
        <div className="p-8 overflow-y-auto space-y-5">
          {error && <div className="text-red-500 text-xs bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
          <div className="flex justify-center">
            <div onClick={() => fileInputRef.current.click()} className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all overflow-hidden bg-gray-50 relative group">
              {preview ? (<><img src={preview} alt="Preview" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload size={18} className="text-white" /></div></>) : (<div className="text-center text-gray-400"><User size={24} className="mx-auto" /><p className="text-[10px] mt-1 font-bold">PHOTO</p></div>)}
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
            </div>
          </div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Full Name *</label><input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Designation *</label><input className="input" value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} /></div><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Display Order</label><input type="number" className="input" value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} /></div></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Board Role Type</label><select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Short Bio</label><textarea className="input min-h-[100px] resize-none" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Facebook URL</label><input className="input" placeholder="https://facebook.com/..." value={form.facebook} onChange={e => setForm(p => ({ ...p, facebook: e.target.value }))} /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Twitter URL</label><input className="input" placeholder="https://twitter.com/..." value={form.twitter} onChange={e => setForm(p => ({ ...p, twitter: e.target.value }))} /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">LinkedIn URL</label><input className="input" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} /></div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Committee Memberships</label>
            {committees.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select className="input flex-1 text-xs" value={c.name} onChange={e => setCommittees(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}>
                  <option value="">Select Committee</option>
                  {COMMITTEE_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <select className="input w-28 text-xs" value={c.role} onChange={e => setCommittees(prev => prev.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}>
                  {COMMITTEE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button onClick={() => setCommittees(prev => prev.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            ))}
            <button onClick={() => setCommittees(prev => [...prev, { name: '', role: 'MEMBER' }])} className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-1"><Plus size={14} /> Add Committee</button>
          </div>
        </div>
        <div className="p-8 pt-0"><button onClick={handleSubmit} disabled={loading} className="admin-btn-primary w-full justify-center py-4 text-sm shadow-xl shadow-teal-500/20 disabled:opacity-50">{loading ? <Loader2 size={18} className="animate-spin" /> : isEdit ? 'Update Profile' : 'Add Board Member'}</button></div>
      </div>
    </div>
  );
}

export default function BoardMembersAdminPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, item: null });

  const fetchMembers = useCallback(async () => { setLoading(true); try { const { data } = await adminApi.get('/board-members'); const sorted = (data.members || []).sort((a, b) => a.order - b.order); setMembers(sorted); } catch { } setLoading(false); }, []);
  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleDelete = async (id) => { if (!confirm('Permanently remove this board member?')) return; try { await adminApi.delete(`/board-members/${id}`); setMembers(m => m.filter(x => x._id !== id)); } catch { } };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div><h1 className="text-3xl font-black text-gray-900 tracking-tight">Board of Directors</h1><p className="text-gray-500 font-medium">Manage leadership profiles and display order</p></div>
        <div className="flex gap-2"><button onClick={fetchMembers} className="admin-btn-outline p-3" title="Refresh"><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button><button onClick={() => setModal({ open: true, item: null })} className="admin-btn-primary"><Plus size={18} /> Add Member</button></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? ([...Array(6)].map((_, i) => (<div key={i} className="card p-6 animate-pulse flex items-center gap-4"><div className="w-16 h-16 bg-gray-100 rounded-2xl" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-50 rounded w-1/2" /></div></div>)))
          : members.length === 0 ? (<div className="col-span-full card p-20 text-center flex flex-col items-center"><User size={48} className="text-gray-200 mb-4" /><p className="text-gray-400 font-medium text-lg">No board members added yet.</p></div>)
          : members.map(member => (
            <div key={member._id} className="card p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all border-gray-100/50 group">
              <div className="flex items-start gap-4">
                <div className="relative"><div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex-shrink-0 overflow-hidden">{member.image ? (<img src={member.image} alt={member.name} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-teal-600 font-black text-xl">{member.name?.charAt(0)}</div>)}</div><div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-900 text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg">{member.order}</div></div>
                <div className="flex-1 min-w-0"><h4 className="font-bold text-gray-900 truncate tracking-tight">{member.name}</h4><p className="text-teal-600 text-xs font-black uppercase tracking-wider mt-0.5">{member.designation}</p><div className="inline-block mt-2 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-400">{member.type}</div></div>
              </div>
              <div className="flex gap-2 mt-6 pt-5 border-t border-gray-50">
                <button onClick={() => setModal({ open: true, item: member })} className="flex-1 text-xs font-bold flex items-center justify-center gap-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 py-2.5 rounded-xl transition-all border border-transparent hover:border-teal-100"><Edit2 size={13} /> Edit</button>
                <button onClick={() => handleDelete(member._id)} className="flex-1 text-xs font-bold flex items-center justify-center gap-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 py-2.5 rounded-xl transition-all"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
      </div>
      {modal.open && (<MemberModal item={modal.item} onClose={() => setModal({ open: false, item: null })} onSuccess={fetchMembers} />)}
    </div>
  );
}
