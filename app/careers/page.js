'use client';
import { useState, useEffect } from 'react';
import PageBanner from '@/components/PageBanner';
import { MapPin, Briefcase, Clock, X, ChevronRight, Users, ArrowRight } from 'lucide-react';

const SEED_JOBS = [
  // { _id: '1', title: 'Assistant Manager – Production', experience: '3+ years', department: 'Manufacturing', location: 'Raipur, Chhattisgarh', description: 'Looking for an experienced production manager to oversee DRI operations at our Raipur facility.' },
  // { _id: '2', title: 'Sr. Electrical Engineer', experience: '5+ years', department: 'Engineering', location: 'Raipur, Chhattisgarh', description: 'Manage and maintain electrical systems at the captive power plant.' },
];

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError('Name and email are required'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers/${job._id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.message || 'Submission failed');
    } catch { setError('Network error. Please try again.'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6">
          <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white">
            <X size={20} />
          </button>
          <h3 className="text-white font-bold text-xl">{job.title}</h3>
          <p className="text-teal-100 text-sm mt-1">{job.experience} · {job.location}</p>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h4>
              <p className="text-gray-500 text-sm mb-6">We'll review your application and contact you soon.</p>
              <button onClick={onClose} className="btn-teal">Close</button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>}
              {[['name', 'Full Name *', 'text'], ['email', 'Email Address *', 'email'], ['phone', 'Phone Number', 'tel']].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="input" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Letter</label>
                <textarea rows={4} value={form.coverLetter} onChange={e => setForm(p => ({ ...p, coverLetter: e.target.value }))}
                  className="input resize-none" placeholder="Tell us about yourself..." />
              </div>
              <button onClick={handleSubmit} disabled={loading || !form.name || !form.email}
                className="btn-teal w-full justify-center py-3.5 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Application'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CareersPage() {
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    Promise.allSettled([
      fetch(`${apiUrl}/careers`).then(r => r.json()),
      fetch(`${apiUrl}/pages/careers`).then(r => r.json()),
    ]).then(([jobsRes, pageRes]) => {
      if (jobsRes.status === 'fulfilled' && jobsRes.value.jobs?.length) setJobs(jobsRes.value.jobs);
      if (pageRes.status === 'fulfilled' && pageRes.value.success) setPageData(pageRes.value.page);
    });
  }, []);

  const introSection = pageData?.sections?.find(s => s.sectionKey === 'intro');
  const introTitle = introSection?.title || 'Apply For Work';
  const introSubtitle = introSection?.subtitle || "Manpower Requisition & Job Application. Join one of Central India's leading steel manufacturers.";
  const introImage = introSection?.images?.[0]?.url;
  const introButtons = introSection?.buttons || [];

  return (
    <>
      <PageBanner title="Careers" breadcrumbs={[{ label: 'Careers' }]} />

      {/* Hero - Dynamic from Admin */}
      <section className="py-16 bg-gradient-to-br from-gray-950 via-gray-900 to-teal-900">
        <div className="page-container">
          <div className={`grid grid-cols-1 ${introImage ? 'lg:grid-cols-[1fr_350px]' : ''} gap-10 items-center`}>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{introTitle}</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl">{introSubtitle}</p>
              {introSection?.paragraph && <p className="text-gray-400 mb-6">{introSection.paragraph}</p>}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                <div className="bg-white/10 border border-white/20 rounded-2xl px-8 py-4 text-center">
                  <div className="text-2xl font-black text-teal-400">500+</div>
                  <div className="text-gray-300 text-sm">Employees</div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl px-8 py-4 text-center">
                  <div className="text-2xl font-black text-teal-400">25+</div>
                  <div className="text-gray-300 text-sm">Years Legacy</div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl px-8 py-4 text-center">
                  <div className="text-2xl font-black text-teal-400">{jobs.length}+</div>
                  <div className="text-gray-300 text-sm">Open Positions</div>
                </div>
              </div>
              {introButtons.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {introButtons.filter(b => b.text).map((btn, i) => (
                    <a key={i} href={btn.url || '#'} className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-full text-sm bg-teal-500 text-white hover:bg-teal-600 transition-all">
                      {btn.text} <ArrowRight size={14} />
                    </a>
                  ))}
                </div>
              )}
            </div>
            {introImage && (
              <div className="rounded-2xl overflow-hidden shadow-xl hidden lg:block">
                <img src={introImage} alt="Careers" className="w-full h-[300px] object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center uppercase tracking-widest">Open Positions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {jobs.map(job => (
              <div key={job._id}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                      <Clock size={12} className="text-teal-500" /> {job.experience}
                    </span>
                    {job.department && (
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                        <Briefcase size={12} className="text-teal-500" /> {job.department}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                      <MapPin size={12} className="text-teal-500" /> {job.location || 'Raipur, CG'}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedJob(job)}
                  className="btn-teal flex-shrink-0 text-sm">
                  View & Apply <ChevronRight size={14} />
                </button>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No open positions at the moment.</p>
                <p className="text-sm mt-1">Check back soon for new opportunities!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedJob && <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </>
  );
}
