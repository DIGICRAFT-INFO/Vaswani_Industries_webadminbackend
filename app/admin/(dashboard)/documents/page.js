'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import adminApi from '@/lib/admin-api';
import {
  Upload, Trash2, ExternalLink, Search, Plus, FileText,
  X, Eye, FolderOpen, RefreshCw, Download,
  AlertCircle, Info, CheckCircle
} from 'lucide-react';

const CATEGORIES = [
  { value: 'financials_annual_reports',      label: 'Financials – Annual Reports',             group: 'Financials' },
  { value: 'financials_quarterly_results',   label: 'Financials – Quarterly Results',            group: 'Financials' },
  { value: 'financials_related_party',       label: 'Financials – Related Party Disclosure',    group: 'Financials' },
  { value: 'disclosures_annual_return',      label: 'Disclosures – Annual Return',              group: 'Disclosures' },
  { value: 'disclosures_secretarial',        label: 'Disclosures – Secretarial Compliance',     group: 'Disclosures' },
  { value: 'disclosures_corporate_governance','label': 'Disclosures – Corporate Governance',    group: 'Disclosures' },
  { value: 'disclosures_general_meetings',   label: 'Disclosures – General Meetings',           group: 'Disclosures' },
  { value: 'disclosures_newspaper',          label: 'Disclosures – Newspaper Publications',     group: 'Disclosures' },
  { value: 'disclosures_others',             label: 'Disclosures – Other Disclosures',          group: 'Disclosures' },
  { value: 'disclosures_share_capital',      label: 'Disclosures – Share Capital Audit',        group: 'Disclosures' },
  { value: 'disclosures_shareholding',       label: 'Disclosures – Shareholding Pattern',       group: 'Disclosures' },
  { value: 'listing_information',            label: 'Listing Information',                      group: 'Listing' },
  { value: 'policies',                       label: 'Policies',                                 group: 'Others' },
  { value: 'sebi_disclosure',                label: 'SEBI Disclosure',                          group: 'Others' },
  { value: 'others',                         label: 'Others',                                   group: 'Others' },
];

const SHORT_LABEL = (v) => { const c = CATEGORIES.find(x => x.value === v); if (!c) return v; return c.label.includes('–') ? c.label.split('–')[1].trim() : c.label; };
const YEARS = ['', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
const QUARTERS = ['', 'Q1', 'Q2', 'Q3', 'Q4'];

function UploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ title: '', category: 'financials_annual_reports', year: '', quarter: '', description: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!file) return setError('Please select a PDF file.');
    if (!form.title) return setError('Title is required.');
    setLoading(true); setError(''); setProgress(0);
    try {
      const fd = new FormData(); fd.append('pdf', file);
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      await adminApi.post('/documents', fd, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / (e.total || 1))) });
      onSuccess(); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Upload failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-5 border-b flex justify-between items-center bg-gray-50/50"><h3 className="font-bold text-xl text-gray-800">New PDF Upload</h3><button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button></div>
        <div className="p-8 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 border border-red-100 text-sm"><AlertCircle size={16}/>{error}</div>}
          <div><label className="text-xs font-bold text-gray-500 uppercase ml-1">Document Title *</label><input className="input mt-1" value={form.title} onChange={set('title')} placeholder="e.g. Q4 Financial Statement" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-gray-500 uppercase ml-1">Category</label><select className="input mt-1" value={form.category} onChange={set('category')}>{CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
            <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-bold text-gray-500 uppercase ml-1">Year</label><select className="input mt-1" value={form.year} onChange={set('year')}>{YEARS.map(y => <option key={y} value={y}>{y || 'Select'}</option>)}</select></div><div><label className="text-xs font-bold text-gray-500 uppercase ml-1">Quarter</label><select className="input mt-1" value={form.quarter} onChange={set('quarter')}>{QUARTERS.map(q => <option key={q} value={q}>{q || 'N/A'}</option>)}</select></div></div>
          </div>
          <div onClick={() => fileRef.current.click()} className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${file ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-400'}`}>
            <input type="file" ref={fileRef} className="hidden" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
            <FileText size={40} className={`mx-auto mb-2 ${file ? 'text-teal-500' : 'text-gray-300'}`} />
            {file ? <p className="text-sm font-bold text-teal-700">{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</p> : <p className="text-sm text-gray-500 font-medium">Click to select or drag & drop PDF</p>}
          </div>
          {loading && <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-teal-500 h-full transition-all" style={{width: `${progress}%`}} /></div>}
        </div>
        <div className="p-6 bg-gray-50 border-t flex gap-3"><button onClick={handleSubmit} disabled={loading} className="admin-btn-primary flex-1 py-3 justify-center shadow-lg shadow-teal-100">{loading ? <RefreshCw className="animate-spin" size={18}/> : 'Start Upload'}</button><button onClick={onClose} className="admin-btn-outline px-6">Cancel</button></div>
      </div>
    </div>
  );
}

function EditModal({ doc, onClose, onSuccess }) {
  const [form, setForm] = useState({ title: doc.title, category: doc.category, year: doc.year || '', quarter: doc.quarter || '', description: doc.description || '', isActive: doc.isActive });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    try { await adminApi.put(`/documents/${doc._id}`, form); onSuccess(); onClose(); }
    catch { alert('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-7 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Document Meta</h3>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-gray-400 uppercase">Title</label><input className="input mt-1" value={form.title} onChange={set('title')} /></div>
          <div><label className="text-xs font-bold text-gray-400 uppercase">Category</label><select className="input mt-1" value={form.category} onChange={set('category')}>{CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4"><select className="input" value={form.year} onChange={set('year')}>{YEARS.map(y => <option key={y} value={y}>{y || 'Year'}</option>)}</select><select className="input" value={form.quarter} onChange={set('quarter')}>{QUARTERS.map(q => <option key={q} value={q}>{q || 'Quarter'}</option>)}</select></div>
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer"><div onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))} className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-teal-500' : 'bg-gray-300'}`}><div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} /></div><span className="text-sm font-bold text-gray-700">{form.isActive ? 'Visible on Website' : 'Hidden'}</span></label>
        </div>
        <div className="flex gap-3 mt-8"><button onClick={handleSave} disabled={loading} className="admin-btn-primary flex-1 justify-center py-3">{loading ? <RefreshCw className="animate-spin" size={16}/> : 'Update Now'}</button><button onClick={onClose} className="admin-btn-outline flex-1 justify-center">Close</button></div>
      </div>
    </div>
  );
}

export default function DocumentsAdminPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [view, setView] = useState('table');
  const [folders, setFolders] = useState({});
  const [foldersLoading, setFoldersLoading] = useState(false);

  const fetchDocs = useCallback(async () => { setLoading(true); try { const { data } = await adminApi.get('/documents', { params: { search, category: filterCat } }); setDocs(data.documents || []); } catch { setDocs([]); } finally { setLoading(false); } }, [search, filterCat]);
  const fetchFolders = useCallback(async () => { setFoldersLoading(true); try { const { data } = await adminApi.get('/documents/folders'); setFolders(data.folders || {}); } catch { setFolders({}); } finally { setFoldersLoading(false); } }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);
  useEffect(() => { if (view === 'folders') fetchFolders(); }, [view, fetchFolders]);

  const handleDelete = async (id) => { if (!confirm('Are you sure? This will delete the physical file too.')) return; try { await adminApi.delete(`/documents/${id}`); fetchDocs(); if (view === 'folders') fetchFolders(); } catch { alert('Delete failed'); } };

  return (
    <div className="min-h-screen pb-20">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div><h1 className="text-3xl font-black text-gray-900 tracking-tight">Media Assets</h1><p className="text-gray-400 text-sm font-medium">Manage PDFs and server folder structure</p></div>
        <div className="flex gap-3">
          <div className="bg-gray-100 p-1 rounded-2xl flex"><button onClick={() => setView('table')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${view === 'table' ? 'bg-white shadow-md text-teal-600' : 'text-gray-500'}`}>Table</button><button onClick={() => setView('folders')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${view === 'folders' ? 'bg-white shadow-md text-teal-600' : 'text-gray-500'}`}>Folders</button></div>
          <button onClick={() => setShowUpload(true)} className="admin-btn-primary rounded-2xl px-6"><Plus size={18}/> <span className="hidden sm:inline">Upload New PDF</span></button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"><div className="card p-5 border-l-4 border-l-teal-500"><p className="text-gray-400 text-xs font-bold uppercase">Total Files</p><p className="text-2xl font-black text-gray-800">{docs.length}</p></div><div className="card p-5 border-l-4 border-l-blue-500"><p className="text-gray-400 text-xs font-bold uppercase">Active</p><p className="text-2xl font-black text-gray-800">{docs.filter(d => d.isActive).length}</p></div></div>

      {view === 'table' ? (
        <div className="card overflow-hidden border-none shadow-xl">
          <div className="p-4 bg-gray-50/50 border-b flex gap-4"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input className="input pl-10 bg-white border-none shadow-inner" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} /></div><select className="input w-48 bg-white border-none shadow-inner" value={filterCat} onChange={e => setFilterCat(e.target.value)}><option value="">All Categories</option>{CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50"><th className="px-6 py-4">Document</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Year</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">
            {loading ? ([1,2,3].map(n => <tr key={n} className="animate-pulse"><td colSpan={5} className="h-16 bg-gray-50/50"></td></tr>))
              : docs.map(doc => (<tr key={doc._id} className="hover:bg-teal-50/30 transition-colors group"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:scale-110 transition-transform"><FileText size={20}/></div><div><p className="font-bold text-gray-800 text-sm">{doc.title}</p><p className="text-[10px] text-gray-400 font-mono">{doc.fileName}</p></div></div></td><td className="px-6 py-4"><span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{SHORT_LABEL(doc.category)}</span></td><td className="px-6 py-4 text-sm font-bold text-gray-500">{doc.year || 'N/A'}</td><td className="px-6 py-4"><span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${doc.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{doc.isActive ? 'Public' : 'Private'}</span></td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><a href={doc.fileUrl} target="_blank" className="p-2 hover:bg-white rounded-xl shadow-sm text-blue-500"><ExternalLink size={16}/></a><button onClick={() => setEditDoc(doc)} className="p-2 hover:bg-white rounded-xl shadow-sm text-teal-600"><Eye size={16}/></button><button onClick={() => handleDelete(doc._id)} className="p-2 hover:bg-white rounded-xl shadow-sm text-red-500"><Trash2 size={16}/></button></div></td></tr>))}
          </tbody></table></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foldersLoading ? (<div className="col-span-3 text-center py-20 text-gray-400"><RefreshCw className="animate-spin mx-auto mb-2"/> Scanning Folders...</div>)
            : CATEGORIES.map(cat => (<div key={cat.value} className="card group hover:border-teal-400 transition-all cursor-default overflow-hidden"><div className="p-4 bg-gray-50 flex items-center justify-between border-b"><div className="flex items-center gap-3"><FolderOpen className="text-teal-500" size={20}/><p className="font-bold text-gray-700 text-sm">{SHORT_LABEL(cat.value)}</p></div><span className="bg-teal-100 text-teal-700 text-[10px] font-black px-2 py-1 rounded-full">{folders[cat.value]?.length || 0}</span></div><div className="p-2 max-h-48 overflow-y-auto space-y-1 bg-white">{folders[cat.value]?.map(f => (<div key={f.filename} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg text-[11px] font-medium text-gray-500 group/item"><span className="truncate flex-1 pr-4">{f.filename}</span><div className="flex gap-2 opacity-0 group-hover/item:opacity-100"><a href={f.url} target="_blank"><ExternalLink size={12}/></a><a href={f.url} download><Download size={12}/></a></div></div>))}</div></div>))}
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={fetchDocs} />}
      {editDoc && <EditModal doc={editDoc} onClose={() => setEditDoc(null)} onSuccess={fetchDocs} />}
    </div>
  );
}
