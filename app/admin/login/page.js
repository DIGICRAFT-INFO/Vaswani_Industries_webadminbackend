'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Eye, EyeOff, AlertCircle, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  
  // State Management
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  // Auth Protection: Redirect if already logged in
  useEffect(() => {
    setMounted(true);
    if (user) router.replace('/admin');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation Depth
    if (!form.email.includes('@')) {
      setError('Please enter a valid corporate email address.');
      return;
    }
    if (form.password.length < 1) {
      setError('Password field cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
    } catch (err) {
      // Depth Analysis: Handling specific error types
      const msg = err.response?.data?.message || 'Authentication failed. Please check your network or credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] px-4 py-12 relative overflow-hidden selection:bg-teal-500/30">
      
      {/* Dynamic Background: MNC Layering */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-zinc-800/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="relative inline-block">
             <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-[1.25rem] flex items-center justify-center mx-auto mb-2 shadow-2xl transition-transform hover:scale-105 duration-300">
               <span className="text-teal-500 font-bold text-3xl italic">V</span>
             </div>
             {/* Status Indicator */}
             <div className="absolute bottom-2 right-0 w-4 h-4 bg-teal-500 border-4 border-[#09090b] rounded-full shadow-sm"></div>
          </div>
          <h1 className="text-zinc-100 font-bold text-2xl tracking-tight leading-tight">Vaswani Portal</h1>
          <p className="text-zinc-500 text-sm font-medium">Authorized Personnel Access Only</p>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl rounded-[2rem] p-7 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Security Badge */}
          <div className="flex items-center gap-2 bg-zinc-800/40 border border-zinc-700/30 rounded-full px-3 py-1 mb-8 w-fit mx-auto transition-opacity hover:opacity-80">
            <ShieldCheck size={12} className="text-teal-500" />
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.1em]">256-bit Encryption Active</span>
          </div>

          {/* Error Message with Depth */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 text-red-400 text-[13px] rounded-2xl px-4 py-3.5 mb-6 animate-in slide-in-from-top-4 duration-300">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 opacity-80" />
              <p className="leading-relaxed font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input Group */}
            <div className="group space-y-2">
              <label htmlFor="email" className="block text-zinc-400 text-xs font-semibold ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input
                  id="email" type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="name@vaswani.com"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-[15px] focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Password Input Group */}
            <div className="group space-y-2">
              <label htmlFor="password" className="block text-zinc-400 text-xs font-semibold ml-1 uppercase tracking-wider">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input
                  id="password" type={showPw ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 rounded-2xl pl-12 pr-12 py-4 text-[15px] focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all placeholder:text-zinc-700"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors focus:outline-none"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button with Advanced Loading */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative overflow-hidden group bg-teal-600 hover:bg-teal-500 text-[#09090b] py-4 rounded-2xl font-bold text-[15px] tracking-wide transition-all duration-300 disabled:opacity-70 disabled:cursor-wait shadow-[0_10px_25px_-5px_rgba(20,184,166,0.3)] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-[#09090b]/30 border-t-[#09090b] rounded-full animate-spin" />
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Session</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Footer Depth */}
        <div className="text-center space-y-4">
          <p className="text-zinc-600 text-[11px] font-medium leading-relaxed uppercase tracking-widest">
            © 2026 Vaswani Industries Ltd <br /> 
            Global Infrastructure Unit
          </p>
          <div className="h-[1px] w-12 bg-zinc-800 mx-auto" />
          <div className="flex justify-center gap-6">
            <span className="text-zinc-700 text-[10px] uppercase font-bold hover:text-zinc-500 cursor-help transition-colors">Privacy Policy</span>
            <span className="text-zinc-700 text-[10px] uppercase font-bold hover:text-zinc-500 cursor-help transition-colors">System Status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
