'use client';
import { useState, useEffect } from 'react';
import adminApi from '@/lib/admin-api';
import { useAuth } from '@/lib/AuthContext';
import {
  Save, KeyRound, User, Globe, BarChart2, Plus, Trash2,
  Flame, Box, BatteryCharging, SunMedium,
  Factory, Zap, Leaf, TrendingUp, Award, Users,
  Building2, Cpu, Droplets, Wind, Star, Shield,
} from 'lucide-react';

// All available icons with their names
const ICON_OPTIONS = [
  { name: 'Flame',           Icon: Flame },
  { name: 'Box',             Icon: Box },
  { name: 'BatteryCharging', Icon: BatteryCharging },
  { name: 'SunMedium',       Icon: SunMedium },
  { name: 'Factory',         Icon: Factory },
  { name: 'Zap',             Icon: Zap },
  { name: 'Leaf',            Icon: Leaf },
  { name: 'TrendingUp',      Icon: TrendingUp },
  { name: 'Award',           Icon: Award },
  { name: 'Users',           Icon: Users },
  { name: 'Building2',       Icon: Building2 },
  { name: 'Cpu',             Icon: Cpu },
  { name: 'Droplets',        Icon: Droplets },
  { name: 'Wind',            Icon: Wind },
  { name: 'Star',            Icon: Star },
  { name: 'Shield',          Icon: Shield },
];

const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map(o => [o.name, o.Icon]));

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = ICON_MAP[value] || Flame;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white hover:border-teal-400 transition-all">
        <SelectedIcon size={18} className="text-teal-500" />
        <span className="text-xs font-semibold text-gray-600">{value}</span>
        <span className="text-gray-400 text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 grid grid-cols-4 gap-2 w-52">
          {ICON_OPTIONS.map(({ name, Icon }) => (
            <button key={name} type="button"
              onClick={() => { onChange(name); setOpen(false); }}
              title={name}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${value === name ? 'bg-teal-500 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
              <Icon size={18} />
              <span className="text-[8px] font-bold leading-tight text-center">{name.replace(/([A-Z])/g, ' $1').trim()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_STATS = [
  { icon: 'Flame',          value: '90000',  unit: 'MT', label: 'Production and Capacity of Sponge Iron' },
  { icon: 'Box',            value: '150000', unit: 'MT', label: 'Production and Capacity of Billets' },
  { icon: 'BatteryCharging',value: '11.5',   unit: 'MW', label: 'Production and Capacity of Power' },
  { icon: 'SunMedium',      value: '66.25',  unit: 'MW', label: 'Production and Capacity of Solar' },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [siteSettings, setSiteSettings] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (tab === 'site' || tab === 'stats') {
      adminApi.get('/settings').then(({ data }) => {
        setSiteSettings(data.settings);
        if (data.settings?.stats?.length > 0) setStats(data.settings.stats);
        else setStats(DEFAULT_STATS);
      }).catch(() => {});
    }
  }, [tab]);

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: '', text: '' }), 3000); };

  const saveProfile = async () => {
    setSaving(true);
    try { const { data } = await adminApi.put('/auth/profile', profile); updateUser(data.user); showMsg('success', 'Profile updated!'); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const savePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) return showMsg('error', 'Passwords do not match');
    if (passwords.newPassword.length < 6) return showMsg('error', 'Min 6 characters');
    setSaving(true);
    try { await adminApi.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }); showMsg('success', 'Password changed!'); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const saveSiteSettings = async () => {
    setSaving(true);
    try { await adminApi.put('/settings', siteSettings); showMsg('success', 'Site settings saved!'); }
    catch { showMsg('error', 'Failed'); }
    setSaving(false);
  };

  const saveStats = async () => {
    setSaving(true);
    try {
      await adminApi.put('/settings', { stats });
      showMsg('success', 'Stats saved! Refresh the homepage to see changes.');
    } catch { showMsg('error', 'Failed to save stats'); }
    setSaving(false);
  };

  const addStat = () => setStats(s => [...s, { icon: 'Flame', value: '', unit: '', label: '' }]);
  const removeStat = (i) => setStats(s => s.filter((_, idx) => idx !== i));
  const updateStat = (i, field, val) => setStats(s => s.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const moveStat = (i, dir) => {
    const arr = [...stats];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setStats(arr);
  };

  const TABS = [
    { key: 'profile', label: 'Profile',       icon: User },
    { key: 'password', label: 'Password',      icon: KeyRound },
    { key: 'site',    label: 'Site Settings',  icon: Globe },
    { key: 'stats',   label: 'Hero Stats',     icon: BarChart2 },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {msg.text && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="flex gap-2 mb-8 border-b border-gray-100 pb-4 flex-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === key ? 'bg-teal-500 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {tab === 'profile' && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">My Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-extrabold text-2xl">{user?.name?.charAt(0)}</span>
            </div>
            <div><p className="font-bold text-gray-900">{user?.name}</p><p className="text-gray-500 text-sm capitalize">{user?.role} · {user?.email}</p></div>
          </div>
          {[['name', 'Full Name', 'text'], ['email', 'Email Address', 'email']].map(([key, label, type]) => (
            <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input type={type} className="input" value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} /></div>
          ))}
          <button onClick={saveProfile} disabled={saving} className="admin-btn-primary disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save Profile'}</button>
        </div>
      )}

      {/* ── Password Tab ── */}
      {tab === 'password' && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Change Password</h2>
          {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => (
            <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input type="password" className="input" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} /></div>
          ))}
          <button onClick={savePassword} disabled={saving} className="admin-btn-primary disabled:opacity-50"><KeyRound size={16} />{saving ? 'Saving...' : 'Change Password'}</button>
        </div>
      )}

      {/* ── Site Settings Tab ── */}
      {tab === 'site' && siteSettings && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Site Settings</h2>
          {[['phone', 'Phone Number'], ['email', 'Contact Email'], ['address', 'Address'], ['facebook', 'Facebook URL'], ['twitter', 'Twitter URL'], ['linkedin', 'LinkedIn URL']].map(([key, label]) => (
            <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input className="input" value={siteSettings[key] || ''} onChange={e => setSiteSettings(p => ({ ...p, [key]: e.target.value }))} /></div>
          ))}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hero Banner Title</label><textarea className="input resize-none" rows={2} value={siteSettings.heroBannerTitle || ''} onChange={e => setSiteSettings(p => ({ ...p, heroBannerTitle: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">About Section Text</label><textarea className="input resize-none" rows={4} value={siteSettings.aboutText || ''} onChange={e => setSiteSettings(p => ({ ...p, aboutText: e.target.value }))} /></div>
          <button onClick={saveSiteSettings} disabled={saving} className="admin-btn-primary disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      )}

      {/* ── Hero Stats Tab ── */}
      {tab === 'stats' && (
        <div className="space-y-5">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Hero Stats</h2>
                <p className="text-gray-400 text-sm mt-0.5">These appear at the bottom of the homepage hero banner</p>
              </div>
              <button onClick={addStat} className="admin-btn-primary flex items-center gap-2 text-sm py-2 px-4">
                <Plus size={15} /> Add Stat
              </button>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-900 rounded-2xl p-4 mb-6">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 text-center">Preview</p>
              <div className={`grid gap-3 text-center`} style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
                {stats.map((stat, i) => {
                  const Icon = ICON_MAP[stat.icon] || Flame;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                        <Icon size={14} className="text-teal-400" />
                      </div>
                      <div>
                        <span className="text-base font-black text-teal-400">{stat.value || '—'}</span>
                        <span className="text-[9px] font-bold text-gray-400 ml-0.5">{stat.unit}</span>
                      </div>
                      <p className="text-[8px] text-gray-400 font-medium leading-tight px-1">{stat.label || '—'}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stat Cards */}
            <div className="space-y-4">
              {stats.map((stat, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Stat {i + 1}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveStat(i, -1)} disabled={i === 0}
                        className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-500 text-xs font-bold">↑</button>
                      <button onClick={() => moveStat(i, 1)} disabled={i === stats.length - 1}
                        className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-500 text-xs font-bold">↓</button>
                      <button onClick={() => removeStat(i)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors ml-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Icon Picker */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Icon</label>
                      <IconPicker value={stat.icon || 'Flame'} onChange={val => updateStat(i, 'icon', val)} />
                    </div>

                    {/* Value */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Number / Value</label>
                      <input className="input text-sm" placeholder="e.g. 90000" value={stat.value}
                        onChange={e => updateStat(i, 'value', e.target.value)} />
                    </div>

                    {/* Unit */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Unit (e.g. MT, MW, +)</label>
                      <input className="input text-sm" placeholder="MT" value={stat.unit}
                        onChange={e => updateStat(i, 'unit', e.target.value)} />
                    </div>

                    {/* Label */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Label / Description</label>
                      <input className="input text-sm" placeholder="Production and Capacity of..." value={stat.label}
                        onChange={e => updateStat(i, 'label', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stats.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <BarChart2 size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No stats yet. Click "Add Stat" to get started.</p>
              </div>
            )}
          </div>

          <button onClick={saveStats} disabled={saving} className="admin-btn-primary w-full justify-center py-4 text-base disabled:opacity-50">
            <Save size={18} />{saving ? 'Saving...' : 'Save Hero Stats'}
          </button>
        </div>
      )}
    </div>
  );
}
