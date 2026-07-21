'use client';
import { useState, useEffect } from 'react';
import PageBanner from '@/components/PageBanner';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle, User, Globe } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${apiUrl}/contact-cards`)
      .then(r => r.json())
      .then(d => { if (d.success && d.cards) setCards(d.cards.filter(c => c.isActive)); })
      .catch(() => {});
  }, []);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiUrl}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(data.message || 'Failed to send. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    }
    setLoading(false);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Phone': return <Phone size={18} className="text-teal-500" />;
      case 'Mail': return <Mail size={18} className="text-teal-500" />;
      case 'MapPin': return <MapPin size={18} className="text-teal-500" />;
      default: return <Globe size={18} className="text-teal-500" />;
    }
  };

  return (
    <>
      <PageBanner title="Contact" breadcrumbs={[{ label: 'Contact' }]} />

      <section className="max-w-7xl mx-auto px-4 py-14">
        {/* Contact Cards from Admin */}
        {cards.length > 0 && (
          <div className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">You can reach us at:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map(card => (
                <div key={card._id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-teal-100 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                      {getIcon(card.icon)}
                    </div>
                    <h3 className="font-bold text-gray-900">{card.title}</h3>
                  </div>
                  <div className="space-y-2 pl-[52px]">
                    {card.lines?.map((line, i) => (
                      <p key={i} className="text-sm text-gray-600">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact of Designated Officials */}
        <div className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Contact of designated officials:</h2>
          <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 border border-gray-100 rounded-2xl p-8 sm:p-10 max-w-2xl">
            {/* Header with avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-200/50">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Monali Makhija</h4>
                <p className="text-sm font-medium text-teal-600">Company Secretary & Compliance Officer</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200/80 my-5"></div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-teal-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-sm text-gray-700 leading-relaxed">Bahesar Road, Near Cycle Park, Vill-Sondra Phase-II, Industrial Area, Siltara, Raipur (C.G.) 493221</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                  <Phone size={16} className="text-teal-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                  <a href="tel:07713540221" className="text-sm text-gray-700 hover:text-teal-600 transition-colors">0771 3540221</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                  <Mail size={16} className="text-teal-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:complianceofficer@vaswaniindustries.com" className="text-sm text-teal-600 hover:text-teal-700 hover:underline transition-colors">complianceofficer@vaswaniindustries.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Form */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Send us a message</h2>
            {success ? (
              <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-teal-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We'll respond within 24 business hours.</p>
                <button onClick={() => setSuccess(false)} className="bg-teal-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-600 transition-colors">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={15} className="flex-shrink-0" />{error}
                  </div>
                )}
                <input type="text" required value={form.name} onChange={set('name')} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" placeholder="Full Name" />
                <input type="email" required value={form.email} onChange={set('email')} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" placeholder="Email Address" />
                <input type="tel" value={form.phone} onChange={set('phone')} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" placeholder="Phone Number" />
                <textarea required rows={5} value={form.message} onChange={set('message')} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none" placeholder="Message" />
                <button type="submit" disabled={loading || !form.name || !form.email || !form.message}
                  className="w-full bg-gray-900 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                  <Send size={16} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Map - Real Vaswani Industries Location */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">View Map</h2>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src="https://www.google.com/maps?q=Vaswani+Industries+Limited,+Sondra,+Phase-II,+Bahesar+Road,+Siltara,+Raipur,+Chhattisgarh+493221&output=embed"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vaswani Industries Limited - Siltara, Raipur"
                className="w-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Vaswani Industries Limited, Sondra, Phase-II, Bahesar Road, Siltara, Raipur, CG</p>
          </div>
        </div>
      </section>
    </>
  );
}
