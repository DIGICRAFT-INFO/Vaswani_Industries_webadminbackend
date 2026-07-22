'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import adminApi from '@/lib/admin-api';
import { Plus, Trash2, Edit2, X, Eye, Image as ImageIcon, Upload, Loader2, RefreshCw, FileText, PlusCircle } from 'lucide-react';

const CATEGORIES = ['Industrial', 'Factory', 'Business', 'Finance', 'CSR', 'Other'];

const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('/uploads/')) return path;
  if (path.includes('/uploads/')) return path.substring(path.indexOf('/uploads/'));
  if (path.startsWith('http')) {
    try { const u = new URL(path); if (u.pathname.startsWith('/uploads/')) return u.pathname; } catch {}
  }
  return path;
};

function NewsModal({ item, onClose, onSuccess }) {
  const isEdit = !!item?._id;
  const [form, setForm] = useState({
    title: item?.title || '',
    excerpt: item?.excerpt || '',
    content: item?.content || '',
    category: item?.category || 'Industrial',
    customCategory: item?.customCategory || '',
    tags: item?.tags?.join(', ') || '',
    isPublished: item?.isPublished ?? true,
  });

  // Featured image
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(getFileUrl(item?.image) || null);
  const featImgRef = useRef(null);

  // Additional images
  const [addlFiles, setAddlFiles] = useState([]);
  const [addlPreviews, setAddlPreviews] = useState([]);
  const [existingAddl, setExistingAddl] = useState(item?.additionalImages?.map(getFileUrl).filter(Boolean) || []);
  const addlImgRef = useRef(null);

  // PDF
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdf, setExistingPdf] = useState(item?.attachmentPdf ? getFileUrl(item.attachmentPdf) : null);
  const [existingPdfName, setExistingPdfName] = useState(item?.attachmentPdfName || '');
  const [removePdf, setRemovePdf] = useState(false);
  const pdfRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
      addlPreviews.forEach(p => p.startsWith('blob:') && URL.revokeObjectURL(p));
    };
  }, []);

  const handleFeatImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('Featured image must be < 5MB');
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddlImages = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (valid.length < files.length) setError('Some images skipped (> 5MB)');
    setAddlFiles(prev => [...prev, ...valid]);
    setAddlPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeNewAddl = (idx) => {
    URL.revokeObjectURL(addlPreviews[idx]);
    setAddlFiles(p => p.filter((_, i) => i !== idx));
    setAddlPreviews(p => p.filter((_, i) => i !== idx));
  };

  const handlePdf = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return setError('PDF must be < 50MB');
    if (!file.name.toLowerCase().endsWith('.pdf')) return setError('Only PDF files allowed');
    setPdfFile(file);
    setRemovePdf(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) return setError('Title and Content are required');
    if (form.category === 'Other' && !form.customCategory.trim()) return setError('Please specify the custom category');
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('excerpt', form.excerpt);
      fd.append('content', form.content);
      fd.append('category', form.category);
      fd.append('customCategory', form.category === 'Other' ? form.customCategory.trim() : '');
      fd.append('isPublished', String(form.isPublished));
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
      if (imageFile) fd.append('image', imageFile);
      addlFiles.forEach(f => fd.append('additionalImages', f));
      // Tell server which existing images were removed
      const originalAddl = item?.additionalImages || [];
      originalAddl.forEach(url => {
        if (!existingAddl.includes(url) && !existingAddl.includes(url.includes('/uploads/') ? url.substring(url.indexOf('/uploads/')) : url)) {
          fd.append('removeAdditionalImage', url);
        }
      });
      if (pdfFile) fd.append('attachmentPdf', pdfFile);
      if (removePdf) fd.append('removePdf', 'true');
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEdit) await adminApi.put(`/news/${item._id}`, fd, cfg);
      else await adminApi.post('/news', fd, cfg);
      onSuccess(); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save article'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 py-6">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-extrabold text-gray-900">{isEdit ? 'Edit' : 'Create'} Article</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2"><X size={16} />{error}</div>}

          {/* Title + Category + Custom Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Article Title *</label>
                <input className="input w-full" placeholder="Main headline..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                <select className="input w-full" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Custom category box — only when "Other" is selected */}
              {form.category === 'Other' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Specify Category *</label>
                  <input
                    className="input w-full border-teal-400 focus:ring-teal-500"
                    placeholder="e.g. Awards, Safety, HR Update..."
                    value={form.customCategory}
                    onChange={e => setForm(p => ({ ...p, customCategory: e.target.value }))}
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Featured Image</label>
              <div onClick={() => featImgRef.current.click()} className="group relative border-2 border-dashed border-gray-200 rounded-2xl h-[132px] flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all overflow-hidden">
                {preview ? (<><img src={preview} alt="Preview" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload className="text-white" size={24} /></div></>) : (<div className="text-center"><ImageIcon className="mx-auto text-gray-300 mb-2" size={28} /><p className="text-xs text-gray-500 font-medium px-4">Click to upload</p></div>)}
                <input type="file" ref={featImgRef} hidden accept="image/*" onChange={handleFeatImage} />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Short Excerpt</label>
            <textarea className="input w-full min-h-[80px]" placeholder="Summary..." value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Content</label>
            <textarea className="input w-full min-h-[200px]" placeholder="Content..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Additional Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {/* Existing saved images */}
              {existingAddl.map((url, i) => (
                <div key={`ex-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setExistingAddl(p => p.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              ))}
              {/* New images to upload */}
              {addlPreviews.map((url, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-teal-300 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeNewAddl(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 transition-opacity"><X size={10} /></button>
                </div>
              ))}
              {/* Add more button */}
              <button onClick={() => addlImgRef.current.click()} className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-all">
                <PlusCircle size={20} />
                <span className="text-[9px] mt-1 font-bold">Add More</span>
              </button>
              <input type="file" ref={addlImgRef} hidden accept="image/*" multiple onChange={handleAddlImages} />
            </div>
            <p className="text-xs text-gray-400">Upload multiple images. Max 5MB each.</p>
          </div>

          {/* PDF Attachment */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">PDF Attachment (optional)</label>
            {existingPdf && !removePdf ? (
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <FileText size={20} className="text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 flex-1 truncate">{existingPdfName || 'Attached PDF'}</span>
                <button onClick={() => { setRemovePdf(true); setPdfFile(null); }} className="text-red-500 hover:text-red-700 p-1"><X size={14} /></button>
              </div>
            ) : pdfFile ? (
              <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
                <FileText size={20} className="text-teal-600 flex-shrink-0" />
                <span className="text-sm text-teal-700 flex-1 truncate">{pdfFile.name}</span>
                <button onClick={() => setPdfFile(null)} className="text-red-500 hover:text-red-700 p-1"><X size={14} /></button>
              </div>
            ) : (
              <button onClick={() => pdfRef.current.click()} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex items-center justify-center gap-2 text-gray-500 hover:border-teal-400 hover:text-teal-600 transition-all text-sm font-medium">
                <FileText size={18} /> Click to attach PDF
              </button>
            )}
            <input type="file" ref={pdfRef} hidden accept=".pdf" onChange={handlePdf} />
          </div>

          {/* Tags + Publish toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Tags (comma separated)</label>
              <input className="input w-full" placeholder="updates, industry" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
              <div onClick={() => setForm(p => ({ ...p, isPublished: !p.isPublished }))} className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${form.isPublished ? 'bg-teal-500 shadow-inner' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-200 ${form.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-bold text-gray-700">{form.isPublished ? 'Live' : 'Draft'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex-shrink-0">
          <button onClick={handleSubmit} disabled={loading} className="admin-btn-primary w-full justify-center py-4 text-base disabled:opacity-50">
            {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : isEdit ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewsAdminPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try { const { data } = await adminApi.get('/news?limit=100'); setNews(data.news || []); }
    catch (err) { console.error('Fetch error', err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await adminApi.delete(`/news/${id}`); setNews(n => n.filter(x => x._id !== id)); }
    catch { alert('Failed to delete article.'); }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div><h1 className="text-3xl font-black text-gray-900 tracking-tight">News & Media</h1><p className="text-gray-500 font-medium">Manage updates and insights</p></div>
        <div className="flex gap-3">
          <button onClick={fetchNews} className="p-3 border rounded-xl hover:bg-gray-50 transition-colors" title="Refresh"><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
          <button onClick={() => { setModalItem(null); setShowModal(true); }} className="admin-btn-primary flex items-center gap-2"><Plus size={18} /> New Article</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Article Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase hidden sm:table-cell">Analytics</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (<tr key={i} className="animate-pulse"><td colSpan={5} className="px-6 py-8"><div className="h-10 bg-gray-100 rounded-xl w-full" /></td></tr>))
              ) : news.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-400"><ImageIcon size={48} className="mx-auto mb-4 opacity-20" /><p>No articles found.</p></td></tr>
              ) : news.map((item) => (
                <tr key={item._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border">
                        {item.image ? <img src={getFileUrl(item.image)} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-3 text-gray-300" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate max-w-[200px]">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                          {item.additionalImages?.length > 0 && <span className="text-[10px] bg-blue-50 text-blue-500 font-bold px-1.5 py-0.5 rounded">+{item.additionalImages.length} img</span>}
                          {item.attachmentPdf && <span className="text-[10px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded">PDF</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
                      {item.category === 'Other' && item.customCategory ? item.customCategory : item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500 font-bold text-xs"><Eye size={14} className="text-teal-500" /> {item.views || 0}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full uppercase ${item.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setModalItem(item); setShowModal(true); }} className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && <NewsModal item={modalItem} onClose={() => setShowModal(false)} onSuccess={fetchNews} />}
    </div>
  );
}
