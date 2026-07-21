'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import adminApi from '@/lib/admin-api';
import {
  Save, Plus, Trash2, Image as ImageIcon, X, ChevronLeft,
  ChevronRight, GripVertical, ExternalLink, Eye, EyeOff,
  Upload, AlertCircle, CheckCircle, RefreshCw, Monitor,
  Type, Layout, Link2, ArrowLeft, Info, Sparkles
} from 'lucide-react';

const PAGE_LABELS = {
  home: 'Home Page', about: 'About Us', products: 'Our Products',
  news: 'News & Media', investors: 'Investors', careers: 'Careers',
};
const PAGE_PREVIEW = {
  home: '/', about: '/about/the-company', products: '/products/sponge-iron',
  news: '/news', investors: '/investors/financials', careers: '/careers',
};

// ── Toast notification (Hostinger optimized CSS)
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
    : type === 'error' ? 'bg-red-50 border-red-200 text-red-600'
    : 'bg-zinc-50 border-zinc-200 text-zinc-600';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 border px-5 py-4 rounded-2xl shadow-xl max-w-sm ${colors} animate-in fade-in slide-in-from-bottom-5`}>
      <Icon size={18} className="flex-shrink-0" />
      <p className="text-[13px] font-bold">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity"><X size={14} /></button>
    </div>
  );
}

// ── Button editor row
function ButtonEditor({ btn, idx, onChange, onDelete }) {
  return (
    <div className="flex items-start gap-3 p-5 bg-zinc-50 rounded-2xl border border-zinc-200 group">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        <div>
          <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Button Text</label>
          <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                 value={btn.text} onChange={e => onChange(idx, 'text', e.target.value)} placeholder="e.g. Learn More" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">URL / Link</label>
          <input className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                 value={btn.url} onChange={e => onChange(idx, 'url', e.target.value)} placeholder="/page or https://..." />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Style</label>
          <select className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                  value={btn.style} onChange={e => onChange(idx, 'style', e.target.value)}>
            <option value="primary">Primary (Emerald)</option>
            <option value="outline">Outline</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2.5 cursor-pointer group/chk">
            <input type="checkbox" checked={btn.openNewTab}
              onChange={e => onChange(idx, 'openNewTab', e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500" />
            <span className="text-[12px] font-bold text-zinc-600 group-hover/chk:text-zinc-900 transition-colors">Open in new tab</span>
          </label>
        </div>
      </div>
      <button onClick={() => onDelete(idx)} className="p-2.5 mt-6 bg-white border border-zinc-200 rounded-xl text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// ── Image manager for a section
function ImageManager({ images, onAddImages, onDeleteImage, onReorder }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(null);

  const handleDrop = e => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length) onAddImages(files);
  };

  const handleDragStart = (e, idx) => { setDragging(idx); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver  = (e, idx) => {
    e.preventDefault();
    if (dragging !== null && dragging !== idx) {
      const reordered = [...images];
      const [moved] = reordered.splice(dragging, 1);
      reordered.splice(idx, 0, moved);
      onReorder(reordered.map(img => img.url));
      setDragging(idx);
    }
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((img, idx) => (
            <div key={img.url || idx} draggable
              onDragStart={e => handleDragStart(e, idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDragEnd={() => setDragging(null)}
              className="relative group rounded-[20px] overflow-hidden aspect-video bg-zinc-100 border border-zinc-200 cursor-move hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
              <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                <a href={img.url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40 hover:scale-110 transition-all">
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => onDeleteImage(img.url)}
                  className="w-8 h-8 flex items-center justify-center bg-red-500/80 rounded-full text-white hover:bg-red-600 hover:scale-110 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="absolute top-2 left-2 w-6 h-6 bg-zinc-900/40 backdrop-blur-md rounded-md flex items-center justify-center shadow-sm">
                <GripVertical size={12} className="text-white" />
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-zinc-900/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white shadow-sm">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-zinc-200 hover:border-emerald-400 rounded-[24px] p-8 text-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-emerald-50/30 group">
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
          onChange={e => onAddImages(Array.from(e.target.files))} />
        <div className="w-12 h-12 bg-white border border-zinc-100 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:text-emerald-500 transition-all">
           <Upload size={20} className="text-zinc-400 group-hover:text-emerald-500" />
        </div>
        <p className="text-[13px] text-zinc-900 font-bold">Click or drop images here</p>
        <p className="text-[11px] text-zinc-400 font-medium mt-1">
          {images.length === 0
            ? 'Add 1 for static image, multiple for carousel'
            : `${images.length} image${images.length > 1 ? 's uploaded' : ''}`
          }
        </p>
        {images.length > 1 && (
          <span className="inline-block mt-3 bg-emerald-100 text-emerald-700 border border-emerald-200/50 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Auto-Carousel Enabled
          </span>
        )}
      </div>
    </div>
  );
}

// ── Section editor card
function SectionEditor({ section, pageKey, onSaved, toast }) {
  const [form, setForm] = useState({
    miniTitle: section.miniTitle || '', title: section.title || '',
    subtitle: section.subtitle || '', paragraph: section.paragraph || '',
    paragraph2: section.paragraph2 || '', isActive: section.isActive !== false,
    extra: section.extra || {},
  });
  const [buttons, setButtons] = useState(section.buttons || []);
  const [images, setImages] = useState(section.images || []);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [newFiles, setNewFiles] = useState([]);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleAddImages = useCallback(files => {
    setNewFiles(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setImages(prev => [...prev, { url: e.target.result, alt: f.name, _local: true }]);
      reader.readAsDataURL(f);
    });
  }, []);

  const handleDeleteImage = useCallback(url => { setImages(prev => prev.filter(img => img.url !== url)); }, []);
  const handleReorder = useCallback(urls => { setImages(prev => urls.map(url => prev.find(img => img.url === url)).filter(Boolean)); }, []);
  const handleButtonChange = (idx, key, value) => { setButtons(prev => prev.map((b, i) => i === idx ? { ...b, [key]: value } : b)); };
  const handleButtonDelete = idx => setButtons(prev => prev.filter((_, i) => i !== idx));
  const handleButtonAdd = () => setButtons(prev => [...prev, { text: '', url: '#', style: 'primary', openNewTab: false }]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k === 'extra') fd.append(k, JSON.stringify(v)); else fd.append(k, v); });
      fd.append('buttons', JSON.stringify(buttons));
      newFiles.forEach(f => fd.append('images', f));
      const removedOriginals = (section.images || []).filter(si => !images.some(img => img.url === si.url)).map(si => si.url);
      if (removedOriginals.length) fd.append('deleteImages', JSON.stringify(removedOriginals));
      const savedImages = images.filter(img => !img._local).map(img => img.url);
      if (savedImages.length) fd.append('imageOrder', JSON.stringify(savedImages));

      const { data } = await adminApi.put(`/pages/${pageKey}/section/${section.sectionKey}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) { toast('Section updated on live server.', 'success'); setNewFiles([]); if (data.section?.images) setImages(data.section.images); onSaved(data.section); }
    } catch (err) { toast(err.response?.data?.message || 'Save failed. Please try again.', 'error'); }
    setSaving(false);
  };

  return (
    <div className="bg-white border border-zinc-100 shadow-sm rounded-[28px] overflow-hidden mb-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between px-8 py-5 bg-zinc-50/50 cursor-pointer hover:bg-zinc-50 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center shadow-sm"><Layout size={18} className="text-zinc-400" /></div>
          <div>
            <h3 className="font-black text-zinc-900 text-[15px]">{section.sectionLabel || section.sectionKey}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Key: {section.sectionKey}</span>
              {images.length > 0 && (<><span className="w-1 h-1 bg-zinc-300 rounded-full" /><span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">{images.length} Images</span></>)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={e => { e.stopPropagation(); setForm(p => ({ ...p, isActive: !p.isActive })); }}
            className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors border ${form.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-100 text-zinc-400 border-zinc-200'}`}>
            {form.isActive ? 'Live' : 'Hidden'}
          </button>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expanded ? 'bg-zinc-200 text-zinc-900' : 'bg-white border border-zinc-200 text-zinc-400'}`}>
            <ChevronRight size={18} className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out ${expanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-8 space-y-8 border-t border-zinc-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Type size={12} /> Mini Title / Tag</label>
              <input className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={form.miniTitle} onChange={set('miniTitle')} placeholder="e.g. About Us" /></div>
            <div><label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Type size={12} /> Subtitle</label>
              <input className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={form.subtitle} onChange={set('subtitle')} placeholder="Supporting headline" /></div>
          </div>
          <div><label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Type size={12} /> Main Title <span className="text-red-400">*</span></label>
            <input className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-[16px] text-zinc-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={form.title} onChange={set('title')} placeholder="Main section heading" /></div>
          <div><label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Type size={12} /> Paragraph</label>
            <textarea className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[120px]" value={form.paragraph} onChange={set('paragraph')} placeholder="Main body text..." /></div>
          {(section.sectionKey === 'company' || section.sectionKey === 'hero' || section.sectionKey === 'chairmans_message') && (
            <div><label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Type size={12} /> Second Paragraph</label>
              <textarea className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[100px]" value={form.paragraph2} onChange={set('paragraph2')} placeholder="Additional text..." /></div>
          )}
          {section.sectionKey === 'stats' && (
            <div className="bg-zinc-50/50 p-6 rounded-[24px] border border-zinc-100">
              <label className="text-[12px] font-black text-zinc-800 uppercase tracking-widest flex items-center gap-2 mb-4">📊 Stats (Value / Unit / Label)</label>
              <div className="space-y-3">
                {(form.extra?.stats || []).map((stat, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input className="w-24 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-[13px] font-bold" placeholder="Value" value={stat.value || ''} onChange={e => { const s = [...(form.extra?.stats || [])]; s[i] = { ...s[i], value: e.target.value }; setForm(p => ({ ...p, extra: { ...p.extra, stats: s } })); }} />
                    <input className="w-16 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-[13px]" placeholder="Unit" value={stat.unit || ''} onChange={e => { const s = [...(form.extra?.stats || [])]; s[i] = { ...s[i], unit: e.target.value }; setForm(p => ({ ...p, extra: { ...p.extra, stats: s } })); }} />
                    <input className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-[13px]" placeholder="Label" value={stat.label || ''} onChange={e => { const s = [...(form.extra?.stats || [])]; s[i] = { ...s[i], label: e.target.value }; setForm(p => ({ ...p, extra: { ...p.extra, stats: s } })); }} />
                    <button onClick={() => { const s = (form.extra?.stats || []).filter((_, j) => j !== i); setForm(p => ({ ...p, extra: { ...p.extra, stats: s } })); }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => { const s = [...(form.extra?.stats || []), { value: '', unit: '', label: '' }]; setForm(p => ({ ...p, extra: { ...p.extra, stats: s } })); }} className="mt-3 text-xs text-emerald-600 hover:text-emerald-800 font-bold">+ Add Stat</button>
            </div>
          )}
          <div className="bg-zinc-50/50 p-6 rounded-[24px] border border-zinc-100">
            <label className="text-[12px] font-black text-zinc-800 uppercase tracking-widest flex items-center gap-2 mb-4"><ImageIcon size={16} className="text-emerald-500" /> Media & Images</label>
            <ImageManager images={images} onAddImages={handleAddImages} onDeleteImage={handleDeleteImage} onReorder={handleReorder} />
          </div>
          <div className="bg-zinc-50/50 p-6 rounded-[24px] border border-zinc-100">
            <div className="flex items-center justify-between mb-5">
              <label className="text-[12px] font-black text-zinc-800 uppercase tracking-widest flex items-center gap-2"><Link2 size={16} className="text-emerald-500" /> Call to Action (Buttons)</label>
              <button onClick={handleButtonAdd} className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-4 py-2 rounded-full transition-all"><Plus size={14} /> Add Button</button>
            </div>
            {buttons.length === 0 ? (<div className="border border-dashed border-zinc-200 rounded-2xl py-8 text-center bg-white"><p className="text-[13px] text-zinc-400 font-medium">No buttons configured for this section.</p></div>)
              : (<div className="space-y-4">{buttons.map((btn, idx) => (<ButtonEditor key={idx} btn={btn} idx={idx} onChange={handleButtonChange} onDelete={handleButtonDelete} />))}</div>)}
          </div>
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-zinc-100">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5"><Info size={14} className="text-emerald-500" /> Saved changes are immediate</p>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-zinc-900 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-[13px] font-bold transition-all disabled:opacity-50 shadow-md hover:shadow-xl hover:-translate-y-0.5">
              {saving ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving Data...</>) : (<><Save size={16} /> Publish Section</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE EDITOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function PageEditorPage() {
  const { pageKey } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast_] = useState(null);

  const showToast = useCallback((message, type = 'success') => { setToast_({ message, type, id: Date.now() }); }, []);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try { const { data } = await adminApi.get(`/pages/${pageKey}`); setPage(data.page); }
    catch (err) { showToast('Failed to load page data.', 'error'); }
    setLoading(false);
  }, [pageKey, showToast]);

  useEffect(() => { fetchPage(); }, [fetchPage]);

  const handleSectionSaved = (updatedSection) => {
    setPage(prev => ({ ...prev, sections: prev.sections.map(s => s.sectionKey === updatedSection.sectionKey ? { ...s, ...updatedSection } : s) }));
  };

  const pageLabel = PAGE_LABELS[pageKey] || pageKey;
  const previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vaswaniindustries.com'}${PAGE_PREVIEW[pageKey] || '/'}`;
  const sortedSections = page?.sections ? [...page.sections].sort((a, b) => (a.order||0) - (b.order||0)) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-6">
        <div className="flex items-start gap-4">
          <Link href="/admin/pages" className="mt-1 w-10 h-10 bg-zinc-50 hover:bg-emerald-50 text-zinc-400 hover:text-emerald-600 rounded-xl flex items-center justify-center transition-all border border-zinc-100 hover:border-emerald-100">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1"><Sparkles size={14} className="text-emerald-500" /><span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/70">CMS Editor</span></div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{pageLabel}</h1>
            <p className="text-zinc-400 text-sm font-medium mt-1">Managing {sortedSections.length} visible section{sortedSections.length !== 1 ? 's' : ''} on this page.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchPage} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reload</button>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[12px] font-bold text-emerald-700 hover:bg-emerald-100 transition-all shadow-sm"><Monitor size={14} /> Live Preview</a>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 rounded-[24px] p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/20"><Info size={20} className="text-white" /></div>
        <div><h4 className="text-[13px] font-black text-zinc-900 mb-0.5">Real-time Deployment</h4><p className="text-[12px] text-zinc-600 font-medium leading-relaxed">Every section you publish here is immediately sent to the server. If a section has multiple images, the system automatically builds an optimized carousel.</p></div>
      </div>

      <div className="space-y-6">
        {loading ? ([...Array(3)].map((_, i) => (<div key={i} className="h-24 bg-white border border-zinc-100 rounded-[28px] animate-pulse" />)))
          : sortedSections.length === 0 ? (<div className="bg-white border border-dashed border-zinc-200 rounded-[32px] p-16 text-center"><div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Layout size={24} className="text-zinc-300" /></div><h3 className="text-zinc-900 font-black text-lg mb-1">No Sections Configured</h3><p className="text-zinc-500 text-sm">This page currently has no editable components in the database.</p></div>)
          : sortedSections.map(section => (<SectionEditor key={section.sectionKey} section={section} pageKey={pageKey} onSaved={handleSectionSaved} toast={showToast} />))}
      </div>

      {toast && (<Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast_(null)} />)}
    </div>
  );
}
