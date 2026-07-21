'use client';
import { useState, useEffect } from 'react';
import adminApi from '@/lib/admin-api';
import { useAuth } from '@/lib/AuthContext';
import { Save, KeyRound, User, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [siteSettings, setSiteSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (tab === 'site') { adminApi.get('/settings').then(({ data }) => setSiteSettings(data.settings)).catch(() => {}); }
  }, [tab]);

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: '', text: '' }), 3000); };

  const saveProfile = async () => {
    setSaving(true);
    try { const { data } = await adminApi.put('/auth/profile', profile); updateUser(data.user); showMsg('success', 'Profile updated successfully!'); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Failed to update profile'); }
    setSaving(false);
  };

  const savePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { showMsg('error', 'New passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { showMsg('error', 'Password must be at least 6 characters'); return; }
    setSaving(true);
    try { await adminApi.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }); showMsg('success', 'Password changed successfully!'); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    catch (err) { showMsg('error', err.response?.data?.message || 'Failed to change password'); }
    setSaving(false);
  };

  const saveSiteSettings = async () => {
    setSaving(true);
    try { await adminApi.put('/settings', siteSettings); showMsg('success', 'Site settings saved!'); }
    catch { showMsg('error', 'Failed to save settings'); }
    setSaving(false);
  };

  const TABS = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'password', label: 'Password', icon: KeyRound },
    { key: 'site', label: 'Site Settings', icon: Globe },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {msg.text && (<div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</div>)}

      <div className="flex gap-2 mb-8 border-b border-gray-100 pb-4">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === key ? 'bg-teal-500 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}><Icon size={15} />{label}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">My Profile</h2>
          <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center"><span className="text-white font-extrabold text-2xl">{user?.name?.charAt(0)}</span></div><div><p className="font-bold text-gray-900">{user?.name}</p><p className="text-gray-500 text-sm capitalize">{user?.role} · {user?.email}</p></div></div>
          {[['name', 'Full Name', 'text'], ['email', 'Email Address', 'email']].map(([key, label, type]) => (<div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input type={type} className="input" value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} /></div>))}
          <button onClick={saveProfile} disabled={saving} className="admin-btn-primary disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save Profile'}</button>
        </div>
      )}

      {tab === 'password' && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Change Password</h2>
          {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => (<div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input type="password" className="input" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} /></div>))}
          <button onClick={savePassword} disabled={saving} className="admin-btn-primary disabled:opacity-50"><KeyRound size={16} />{saving ? 'Saving...' : 'Change Password'}</button>
        </div>
      )}

      {tab === 'site' && siteSettings && (
        <div className="card p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Site Settings</h2>
          {[['phone', 'Phone Number'], ['email', 'Contact Email'], ['address', 'Address'], ['facebook', 'Facebook URL'], ['twitter', 'Twitter URL'], ['linkedin', 'LinkedIn URL']].map(([key, label]) => (<div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input className="input" value={siteSettings[key] || ''} onChange={e => setSiteSettings(p => ({ ...p, [key]: e.target.value }))} /></div>))}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hero Banner Title</label><textarea className="input resize-none" rows={2} value={siteSettings.heroBannerTitle || ''} onChange={e => setSiteSettings(p => ({ ...p, heroBannerTitle: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">About Section Text</label><textarea className="input resize-none" rows={4} value={siteSettings.aboutText || ''} onChange={e => setSiteSettings(p => ({ ...p, aboutText: e.target.value }))} /></div>
          <button onClick={saveSiteSettings} disabled={saving} className="admin-btn-primary disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      )}
    </div>
  );
}
