'use client';
import { useState, useEffect } from 'react';
import adminApi from '@/lib/admin-api';
import { Plus, Trash2, Edit2, X, Package, Table, FlaskConical } from 'lucide-react';

const CATEGORIES = ['FORGING INGOTS & BILLETS', 'SPONGE IRON', 'POWER', 'TMT BARS', 'CASTING'];

function SpecificationsEditor({ headers, setHeaders, rows, setRows }) {
  const colCount = headers.length || 2;

  const addHeader = () => setHeaders([...headers, '']);
  const removeHeader = (idx) => {
    const newH = headers.filter((_, i) => i !== idx);
    setHeaders(newH);
    setRows(rows.map(row => row.filter((_, i) => i !== idx)));
  };
  const updateHeader = (idx, val) => { const h = [...headers]; h[idx] = val; setHeaders(h); };

  const addRow = () => setRows([...rows, Array(colCount).fill('')]);
  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));
  const updateCell = (rowIdx, colIdx, val) => {
    const r = [...rows];
    r[rowIdx] = [...r[rowIdx]];
    r[rowIdx][colIdx] = val;
    setRows(r);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Table size={14} /> Specifications Table</h4>
        <button type="button" onClick={addHeader} className="text-xs text-teal-600 hover:text-teal-800 font-medium">+ Add Column</button>
      </div>

      {/* Headers */}
      <div className="flex gap-2 mb-2">
        {headers.map((h, i) => (
          <div key={i} className="flex-1 flex gap-1">
            <input className="input text-xs py-1.5 font-semibold" placeholder={`Header ${i + 1}`} value={h} onChange={e => updateHeader(i, e.target.value)} />
            {headers.length > 1 && <button type="button" onClick={() => removeHeader(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-2 items-center">
            {Array.from({ length: colCount }).map((_, ci) => (
              <input key={ci} className="input text-xs py-1.5 flex-1" placeholder={`Row ${ri + 1}`} value={row[ci] || ''} onChange={e => updateCell(ri, ci, e.target.value)} />
            ))}
            <button type="button" onClick={() => removeRow(ri)} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addRow} className="mt-2 text-xs text-teal-600 hover:text-teal-800 font-medium">+ Add Row</button>
    </div>
  );
}

function ReactionsEditor({ reactions, setReactions, title, setTitle }) {
  const addReaction = () => setReactions([...reactions, { left: '', right: '' }]);
  const removeReaction = (idx) => setReactions(reactions.filter((_, i) => i !== idx));
  const updateReaction = (idx, field, val) => {
    const r = [...reactions];
    r[idx] = { ...r[idx], [field]: val };
    setReactions(r);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2"><FlaskConical size={14} /> Reactions</h4>
      </div>
      <div className="mb-3">
        <input className="input text-xs py-1.5" placeholder="Reactions Title" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {reactions.map((r, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input className="input text-xs py-1.5 flex-1" placeholder="Left side" value={r.left} onChange={e => updateReaction(i, 'left', e.target.value)} />
            <span className="text-teal-500 font-bold text-sm">→</span>
            <input className="input text-xs py-1.5 flex-1" placeholder="Right side" value={r.right} onChange={e => updateReaction(i, 'right', e.target.value)} />
            <button type="button" onClick={() => removeReaction(i)} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addReaction} className="mt-2 text-xs text-teal-600 hover:text-teal-800 font-medium">+ Add Reaction</button>
    </div>
  );
}

function ProductModal({ item, onClose, onSuccess }) {
  const isEdit = !!item?._id;
  const [form, setForm] = useState({
    name: item?.name || '', tagline: item?.tagline || '', description: item?.description || '',
    category: item?.category || 'SPONGE IRON', badge: item?.badge || '', quickFact: item?.quickFact || '',
    order: item?.order || 0, isActive: item?.isActive ?? true,
  });
  const [specHeaders, setSpecHeaders] = useState(item?.specHeaders?.length ? item.specHeaders : ['Billets', 'Blooms']);
  const [specifications, setSpecifications] = useState(item?.specifications?.length ? item.specifications : []);
  const [reactions, setReactions] = useState(item?.reactions?.length ? item.reactions : []);
  const [reactionsTitle, setReactionsTitle] = useState(item?.reactionsTitle || 'BASIC REDUCTION REACTIONS:');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = async () => {
    if (!form.name) { setError('Product name is required'); return; }
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('specHeaders', JSON.stringify(specHeaders.filter(h => h.trim())));
      fd.append('specifications', JSON.stringify(specifications.filter(row => row.some(cell => cell.trim()))));
      fd.append('reactions', JSON.stringify(reactions.filter(r => r.left.trim() || r.right.trim())));
      fd.append('reactionsTitle', reactionsTitle);
      if (isEdit) await adminApi.put(`/products/${item._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await adminApi.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSuccess(); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Save failed'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={20} /></button>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{isEdit ? 'Edit' : 'Add'} Product</h3>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
          {[{ key: 'basic', label: 'Basic Info' }, { key: 'specs', label: 'Specifications' }, { key: 'reactions', label: 'Reactions' }].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{tab.label}</button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl mb-4">{error}</p>}

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label><input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Badge Label</label><input className="input" placeholder="e.g. DIRECT REDUCED IRON (DRI)" value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label><input className="input" value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="input resize-none" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Quick Fact</label><input className="input" value={form.quickFact} onChange={e => setForm(p => ({ ...p, quickFact: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label><input type="number" className="input" value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} /></div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))} className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-teal-500' : 'bg-gray-200'}`}><div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} /></div>
              <span className="text-sm font-medium text-gray-700">{form.isActive ? 'Active' : 'Hidden'}</span>
            </label>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <SpecificationsEditor headers={specHeaders} setHeaders={setSpecHeaders} rows={specifications} setRows={setSpecifications} />
        )}

        {/* Reactions Tab */}
        {activeTab === 'reactions' && (
          <ReactionsEditor reactions={reactions} setReactions={setReactions} title={reactionsTitle} setTitle={setReactionsTitle} />
        )}

        <button onClick={handleSubmit} disabled={loading} className="admin-btn-primary w-full justify-center py-3 disabled:opacity-50 mt-6">{loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</button>
      </div>
    </div>
  );
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, item: null });

  const fetchProducts = async () => { setLoading(true); try { const { data } = await adminApi.get('/products?admin=true'); setProducts(data.products || []); } catch { } setLoading(false); };
  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => { if (!confirm('Delete this product?')) return; try { await adminApi.delete(`/products/${id}`); setProducts(p => p.filter(x => x._id !== id)); } catch { } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold text-gray-900">Products</h1><p className="text-gray-500 text-sm mt-0.5">{products.length} products</p></div>
        <button onClick={() => setModal({ open: true, item: null })} className="admin-btn-primary"><Plus size={16} /> Add Product</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? <p className="col-span-3 text-center py-12 text-gray-400">Loading...</p>
          : products.length === 0 ? (<div className="col-span-3 card p-12 text-center text-gray-400"><Package size={40} className="mx-auto mb-3 opacity-30" />No products yet.</div>)
          : products.map(product => (
            <div key={product._id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3"><div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0"><Package size={18} className="text-teal-500" /></div><span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${product.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.isActive ? 'Active' : 'Hidden'}</span></div>
              <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
              <p className="text-teal-500 text-xs font-semibold mt-0.5">{product.category}</p>
              <p className="text-gray-400 text-xs mt-2 line-clamp-2">{product.description}</p>
              {product.specifications?.length > 0 && <p className="text-xs text-gray-500 mt-1">📊 {product.specifications.length} spec rows</p>}
              <div className="flex gap-2 mt-4">
                <button onClick={() => setModal({ open: true, item: product })} className="admin-btn-outline text-xs py-1.5 px-3 flex-1 justify-center"><Edit2 size={12} /> Edit</button>
                <button onClick={() => handleDelete(product._id)} className="admin-btn-danger text-xs py-1.5 px-3"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
      </div>
      {modal.open && <ProductModal item={modal.item} onClose={() => setModal({ open: false, item: null })} onSuccess={fetchProducts} />}
    </div>
  );
}
