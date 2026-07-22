'use client';
import { useState, useEffect, useCallback } from 'react';
import adminApi from '@/lib/admin-api';
import { useAuth } from '@/lib/AuthContext';
import {
  Save, KeyRound, User, Globe, BarChart2, Plus, Trash2, Users,
  Flame, Box, BatteryCharging, SunMedium, Factory, Zap, Leaf,
  TrendingUp, Award, Building2, Cpu, Droplets, Wind, Star, Shield,
  CheckSquare, Square, ToggleLeft, ToggleRight, ShieldCheck, X,
  Mail, Lock, UserPlus, RefreshCw, Eye, EyeOff,
} from 'lucide-react';

// ── Permission definitions ──────────────────────────────────────
const PERMISSION_LABELS = {
  overview:       { label: 'Overview',        desc: 'Dashboard & stats' },
  pages:          { label: 'Pages',           desc: 'CMS page editor' },
  documents:      { label: 'Documents',       desc: 'PDF uploads & investor docs' },
  news:           { label: 'News & Media',    desc: 'Articles & blog posts' },
  'board-members':{ label: 'Board Members',   desc: 'Directors & committees' },
  careers:        { label: 'Careers',         desc: 'Job listings & applications' },
  'contact-cards':{ label: 'Contact Cards',   desc: 'Office contact info' },
  contacts:       { label: 'Contacts',        desc: 'Inbox & messages' },
  notifications:  { label: 'Notifications',   desc: 'System alerts' },
  settings:       { label: 'System Settings', desc: 'Site config & stats' },
};
const ALL_PERMS = Object.keys(PERMISSION_LABELS);

// ── Icon picker helpers ─────────────────────────────────────────
const ICON_OPTIONS = [
  { name: 'Flame', Icon: Flame }, { name: 'Box', Icon: Box },
  { name: 'BatteryCharging', Icon: BatteryCharging }, { name: 'SunMedium', Icon: SunMedium },
  { name: 'Factory', Icon: Factory }, { name: 'Zap', Icon: Zap },
  { name: 'Leaf', Icon: Leaf }, { name: 'TrendingUp', Icon: TrendingUp },
  { name: 'Award', Icon: Award }, { name: 'Users', Icon: Users },
  { name: 'Building2', Icon: Building2 }, { name: 'Cpu', Icon: Cpu },
  { name: 'Droplets', Icon: Droplets }, { name: 'Wind', Icon: Wind },
  { name: 'Star', Icon: Star }, { name: 'Shield', Icon: Shield },
];
const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map(o => [o.name, o.Icon]));
const DEFAULT_STATS = [
  { icon: 'Flame', value: '90000', unit: 'MT', label: 'Production and Capacity of Sponge Iron' },
  { icon: 'Box', value: '150000', unit: 'MT', label: 'Production and Capacity of Billets' },
  { icon: 'BatteryCharging', value: '11.5', unit: 'MW', label: 'Production and Capacity of Power' },
  { icon: 'SunMedium', value: '66.25', unit: 'MW', label: 'Production and Capacity of Solar' },
];

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
            <button key={name} type="button" onClick={() => { onChange(name); setOpen(false); }} title={name}
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

// ── Create User Modal ───────────────────────────────────────────
function CreateUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', permissions: ['overview'] });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePerm = (p) => setForm(f => ({
    ...f,
    permissions: f.permissions.includes(p) ? f.permissions.filter(x => x !== p) : [...f.permissions, p],
  }));
  const selectAll = () => setForm(f => ({ ...f, permissions: [...ALL_PERMS] }));
  const clearAll  = () => setForm(f => ({ ...f, permissions: [] }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return setError('Name, email & password required');
    if (form.password.length < 6) return setError('Password min 6 characters');
    setLoading(true); setError('');
    try {
      await adminApi.post('/auth/register', { name: form.name, email: form.email, password: form.password, role: 'admin', permissions: form.permissions });
      onSuccess(); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create user'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] px-4 py-6">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2"><UserPlus size={18} className="text-teal-500" /> Create Team Member</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-7 overflow-y-auto space-y-5">
          {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
            <input className="input w-full" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address *</label>
            <input className="input w-full" type="email" placeholder="john@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Password *</label>
            <div className="relative">
              <input className="input w-full pr-10" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-700">Module Access</label>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="text-xs text-teal-600 font-bold hover:underline">Select All</button>
                <span className="text-gray-300">|</span>
                <button type="button" onClick={clearAll} className="text-xs text-gray-400 font-bold hover:underline">Clear</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_PERMS.map(p => {
                const checked = form.permissions.includes(p);
                return (
                  <button key={p} type="button" onClick={() => togglePerm(p)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${checked ? 'bg-teal-50 border-teal-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                    {checked ? <CheckSquare size={15} className="text-teal-500 flex-shrink-0" /> : <Square size={15} className="text-gray-300 flex-shrink-0" />}
                    <div>
                      <p className={`text-xs font-bold leading-none ${checked ? 'text-teal-700' : 'text-gray-600'}`}>{PERMISSION_LABELS[p].label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{PERMISSION_LABELS[p].desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="px-7 py-5 border-t border-gray-100 flex-shrink-0">
          <button onClick={handleSubmit} disabled={loading}
            className="admin-btn-primary w-full justify-center py-3.5 disabled:opacity-50">
            {loading ? <><RefreshCw size={16} className="animate-spin" /> Creating...</> : <><UserPlus size={16} /> Create Member</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Permission Editor (inline, per user) ───────────────────────
function PermissionEditor({ userId, currentPerms, onSave, onClose }) {
  const [perms, setPerms] = useState(currentPerms);
  const [saving, setSaving] = useState(false);
  const toggle = (p) => setPerms(ps => ps.includes(p) ? ps.filter(x => x !== p) : [...ps, p]);

  const save = async () => {
    setSaving(true);
    try { await adminApi.patch(`/auth/users/${userId}`, { permissions: perms }); onSave(perms); onClose(); }
    catch { alert('Failed to update permissions'); }
    finally { setSaving(false); }
  };

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Edit Access Permissions</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {ALL_PERMS.map(p => {
          const checked = perms.includes(p);
          return (
            <button key={p} type="button" onClick={() => toggle(p)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${checked ? 'bg-teal-50 border-teal-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
              {checked ? <CheckSquare size={13} className="text-teal-500 flex-shrink-0" /> : <Square size={13} className="text-gray-300 flex-shrink-0" />}
              <span className={`text-[11px] font-bold ${checked ? 'text-teal-700' : 'text-gray-500'}`}>{PERMISSION_LABELS[p].label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="admin-btn-primary py-2 px-4 text-xs flex-1 justify-center">
          {saving ? 'Saving...' : 'Save Permissions'}
        </button>
        <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
      </div>
    </div>
  );
}

// ── Team Tab component ──────────────────────────────────────────
function TeamTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try { const { data } = await adminApi.get('/auth/users'); setUsers(data.users || []); }
    catch { /* superadmin only */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This will immediately revoke all their access.`)) return;
    try { await adminApi.delete(`/auth/users/${id}`); setUsers(u => u.filter(x => x._id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const handleToggleActive = async (id, current) => {
    setTogglingId(id);
    try {
      await adminApi.patch(`/auth/users/${id}`, { isActive: !current });
      setUsers(u => u.map(x => x._id === id ? { ...x, isActive: !current } : x));
    } catch { alert('Failed to update status'); }
    finally { setTogglingId(null); }
  };

  const handlePermsSaved = (id, newPerms) => {
    setUsers(u => u.map(x => x._id === id ? { ...x, permissions: newPerms } : x));
  };

  return (
    <div className="space-y-5">
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onSuccess={fetchUsers} />}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Users size={18} className="text-teal-500" /> Team Members</h2>
            <p className="text-gray-400 text-sm mt-0.5">Manage admin users and their module access</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="admin-btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <UserPlus size={15} /> Add Member
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />)}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><Users size={36} className="mx-auto mb-3 opacity-20" /><p>No team members found.</p></div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u._id} className={`border rounded-2xl p-4 transition-all ${u.isActive ? 'border-gray-100 bg-white' : 'border-red-100 bg-red-50/30'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${u.role === 'superadmin' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                        {u.role === 'superadmin' && <span className="flex items-center gap-1 bg-teal-100 text-teal-700 text-[10px] font-black px-2 py-0.5 rounded-full"><ShieldCheck size={10} /> SUPERADMIN</span>}
                        {!u.isActive && <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">SUSPENDED</span>}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      {u.role !== 'superadmin' && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(u.permissions || []).slice(0, 5).map(p => (
                            <span key={p} className="bg-gray-100 text-gray-500 text-[9px] font-bold px-1.5 py-0.5 rounded">{PERMISSION_LABELS[p]?.label}</span>
                          ))}
                          {(u.permissions || []).length > 5 && <span className="text-[9px] text-gray-400 font-bold">+{u.permissions.length - 5} more</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  {u.role !== 'superadmin' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleToggleActive(u._id, u.isActive)} disabled={togglingId === u._id}
                        title={u.isActive ? 'Suspend access' : 'Restore access'}
                        className={`p-2 rounded-xl transition-all ${u.isActive ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`}>
                        {u.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button onClick={() => setEditingId(editingId === u._id ? null : u._id)}
                        className={`p-2 rounded-xl transition-all text-xs font-bold ${editingId === u._id ? 'bg-teal-500 text-white' : 'text-teal-600 hover:bg-teal-50'}`}
                        title="Edit permissions">
                        <ShieldCheck size={16} />
                      </button>
                      <button onClick={() => handleDelete(u._id, u.name)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all" title="Delete user">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {editingId === u._id && (
                  <PermissionEditor
                    userId={u._id}
                    currentPerms={u.permissions || []}
                    onSave={(p) => handlePermsSaved(u._id, p)}
                    onClose={() => setEditingId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Settings Page ──────────────────────────────────────────
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
    try { await adminApi.put('/settings', { stats }); showMsg('success', 'Stats saved!'); }
    catch { showMsg('error', 'Failed to save stats'); }
    setSaving(false);
  };

  const addStat = () => setStats(s => [...s, { icon: 'Flame', value: '', unit: '', label: '' }]);
  const removeStat = (i) => setStats(s => s.filter((_, idx) => idx !== i));
  const updateStat = (i, field, val) => setStats(s => s.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const moveStat = (i, dir) => {
    const arr = [...stats]; const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; setStats(arr);
  };

  const isSuperAdmin = user?.role === 'superadmin';

  const TABS = [
    { key: 'profile',  label: 'Profile',       icon: User },
    { key: 'password', label: 'Password',       icon: KeyRound },
    { key: 'site',     label: 'Site Settings',  icon: Globe },
    { key: 'stats',    label: 'Hero Stats',     icon: BarChart2 },
    ...(isSuperAdmin ? [{ key: 'team', label: 'Team', icon: Users }] : []),
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
            {key === 'team' && <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === 'profile' && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">My Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-extrabold text-2xl">{user?.name?.charAt(0)}</span>
            </div>
            <div><p className="font-bold text-gray-900">{user?.name}</p><p className="text-gray-500 text-sm capitalize">{user?.role} · {user?.email}</p></div>
          </div>
          {[['name','Full Name','text'],['email','Email Address','email']].map(([key,label,type]) => (
            <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} className="input" value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} /></div>
          ))}
          <button onClick={saveProfile} disabled={saving} className="admin-btn-primary disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save Profile'}</button>
        </div>
      )}

      {/* Password */}
      {tab === 'password' && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Change Password</h2>
          {[['currentPassword','Current Password'],['newPassword','New Password'],['confirmPassword','Confirm New Password']].map(([key,label]) => (
            <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="password" className="input" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} /></div>
          ))}
          <button onClick={savePassword} disabled={saving} className="admin-btn-primary disabled:opacity-50"><KeyRound size={16} />{saving ? 'Saving...' : 'Change Password'}</button>
        </div>
      )}

      {/* Site Settings */}
      {tab === 'site' && siteSettings && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Site Settings</h2>
          {[['phone','Phone Number'],['email','Contact Email'],['address','Address'],['facebook','Facebook URL'],['twitter','Twitter URL'],['linkedin','LinkedIn URL']].map(([key,label]) => (
            <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input className="input" value={siteSettings[key]||''} onChange={e => setSiteSettings(p => ({ ...p, [key]: e.target.value }))} /></div>
          ))}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hero Banner Title</label>
            <textarea className="input resize-none" rows={2} value={siteSettings.heroBannerTitle||''} onChange={e => setSiteSettings(p => ({ ...p, heroBannerTitle: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">About Section Text</label>
            <textarea className="input resize-none" rows={4} value={siteSettings.aboutText||''} onChange={e => setSiteSettings(p => ({ ...p, aboutText: e.target.value }))} /></div>
          <button onClick={saveSiteSettings} disabled={saving} className="admin-btn-primary disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      )}

      {/* Hero Stats */}
      {tab === 'stats' && (
        <div className="space-y-5">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div><h2 className="font-bold text-gray-900 text-lg">Hero Stats</h2>
                <p className="text-gray-400 text-sm mt-0.5">Shown at the bottom of the homepage hero</p></div>
              <button onClick={addStat} className="admin-btn-primary flex items-center gap-2 text-sm py-2 px-4"><Plus size={15} /> Add Stat</button>
            </div>
            {/* Live preview */}
            <div className="bg-gray-900 rounded-2xl p-4 mb-6">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 text-center">Preview</p>
              <div className="grid gap-3 text-center" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
                {stats.map((stat, i) => {
                  const Icon = ICON_MAP[stat.icon] || Flame;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center"><Icon size={14} className="text-teal-400" /></div>
                      <div><span className="text-base font-black text-teal-400">{stat.value||'—'}</span><span className="text-[9px] font-bold text-gray-400 ml-0.5">{stat.unit}</span></div>
                      <p className="text-[8px] text-gray-400 font-medium leading-tight px-1">{stat.label||'—'}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Stat editor cards */}
            <div className="space-y-4">
              {stats.map((stat, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Stat {i+1}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveStat(i,-1)} disabled={i===0} className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-500 text-xs font-bold">↑</button>
                      <button onClick={() => moveStat(i,1)} disabled={i===stats.length-1} className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-500 text-xs font-bold">↓</button>
                      <button onClick={() => removeStat(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors ml-1"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-bold text-gray-500 mb-1.5">Icon</label>
                      <IconPicker value={stat.icon||'Flame'} onChange={val => updateStat(i,'icon',val)} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1.5">Number / Value</label>
                      <input className="input text-sm" placeholder="e.g. 90000" value={stat.value} onChange={e => updateStat(i,'value',e.target.value)} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1.5">Unit (MT, MW, +)</label>
                      <input className="input text-sm" placeholder="MT" value={stat.unit} onChange={e => updateStat(i,'unit',e.target.value)} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1.5">Label / Description</label>
                      <input className="input text-sm" placeholder="Production and Capacity of..." value={stat.label} onChange={e => updateStat(i,'label',e.target.value)} /></div>
                  </div>
                </div>
              ))}
              {stats.length === 0 && (
                <div className="text-center py-10 text-gray-400"><BarChart2 size={36} className="mx-auto mb-3 opacity-20" /><p className="text-sm">No stats. Click "Add Stat".</p></div>
              )}
            </div>
          </div>
          <button onClick={saveStats} disabled={saving} className="admin-btn-primary w-full justify-center py-4 text-base disabled:opacity-50">
            <Save size={18} />{saving ? 'Saving...' : 'Save Hero Stats'}
          </button>
        </div>
      )}

      {/* Team — superadmin only */}
      {tab === 'team' && isSuperAdmin && <TeamTab />}
    </div>
  );
}
