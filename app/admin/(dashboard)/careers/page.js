'use client';
import { useState, useEffect } from 'react';
import adminApi from '@/lib/admin-api';
import { Plus, Trash2, Edit2, X, Users, Eye } from 'lucide-react';

function CareerModal({ item, onClose, onSuccess }) {
  const isEdit = !!item?._id;
  const [form, setForm] = useState({
    title: item?.title || '', department: item?.department || '',
    location: item?.location || 'Raipur, Chhattisgarh',
    experience: item?.experience || '', qualification: item?.qualification || '',
    description: item?.description || '', salary: item?.salary || '',
    isActive: item?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.experience) return;
    setLoading(true);
    try {
      if (isEdit) await adminApi.put(`/careers/${item._id}`, form);
      else await adminApi.post('/careers', form);
      onSuccess(); onClose();
    } catch { }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={20} /></button>
        <h3 className="text-lg font-bold text-gray-900 mb-6">{isEdit ? 'Edit' : 'Add'} Job Position</h3>
        <div className="space-y-4">
          {[['title', 'Job Title *', 'text'], ['department', 'Department', 'text'], ['location', 'Location', 'text'], ['experience', 'Required Experience *', 'text'], ['qualification', 'Qualification', 'text'], ['salary', 'Salary Range', 'text']].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} className="input" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea className="input resize-none" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-teal-500' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">{form.isActive ? 'Active / Open' : 'Closed'}</span>
          </label>
          <button onClick={handleSubmit} disabled={loading || !form.title || !form.experience} className="admin-btn-primary w-full justify-center py-3 disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update Position' : 'Create Position'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CareersAdminPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, item: null });

  const fetchJobs = async () => {
    setLoading(true);
    try { const { data } = await adminApi.get('/careers'); setJobs(data.jobs || []); } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this position?')) return;
    try { await adminApi.delete(`/careers/${id}`); setJobs(j => j.filter(x => x._id !== id)); } catch { }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Careers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{jobs.length} positions</p>
        </div>
        <button onClick={() => setModal({ open: true, item: null })} className="admin-btn-primary">
          <Plus size={16} /> Add Position
        </button>
      </div>

      <div className="space-y-4">
        {loading ? <p className="text-center py-12 text-gray-400">Loading...</p>
          : jobs.length === 0 ? <div className="card p-12 text-center text-gray-400">No positions added yet.</div>
            : jobs.map(job => (
              <div key={job._id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${job.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {job.isActive ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Experience: {job.experience} {job.department && `• ${job.department}`} {job.location && `• ${job.location}`}</p>
                  <p className="text-teal-600 text-xs font-semibold mt-1 flex items-center gap-1">
                    <Users size={11} />{job.applications?.length || 0} Applications
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModal({ open: true, item: job })} className="admin-btn-outline text-xs py-2 px-3"><Edit2 size={13} /> Edit</button>
                  <button onClick={() => handleDelete(job._id)} className="admin-btn-danger text-xs py-2 px-3"><Trash2 size={13} /> Delete</button>
                </div>
              </div>
            ))}
      </div>

      {modal.open && <CareerModal item={modal.item} onClose={() => setModal({ open: false, item: null })} onSuccess={fetchJobs} />}
    </div>
  );
}
