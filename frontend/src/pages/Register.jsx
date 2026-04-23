import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Leaf, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', class:'', school:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const next = (e) => { e.preventDefault(); setStep(2); };
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      <div className="w-full max-w-[360px] fade-in-up relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.30)' }}>
              <Leaf size={18} className="text-eco-400" />
            </div>
            <span className="text-xl font-bold tracking-tight">EcoQuest</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">Create account</h1>
          <p className="text-[14px]" style={{ color: 'var(--text-2)' }}>Join the eco movement</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1,2].map(s => (
              <div key={s} className="h-1 w-12 rounded-full transition-all duration-300"
                style={{ background: s <= step ? 'var(--accent)' : 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border-md)' }}>
          {error && (
            <div className="flex items-center gap-2 text-[13px] text-red-400 px-3 py-2.5 rounded-lg mb-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <AlertCircle size={13} className="shrink-0" /> {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={next} className="space-y-4">
              <div>
                <label className="label block mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                  <input className="input pl-9" placeholder="Arjun Sharma"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="label block mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                  <input className="input pl-9" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="label block mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                  <input className="input pl-9" type="password" placeholder="Min 6 characters"
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
                </div>
              </div>
              <div>
                <label className="label block mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { r: 'student', icon: GraduationCap, label: 'Student' },
                    { r: 'teacher', icon: BookOpen, label: 'Teacher' },
                  ].map(({ r, icon: Icon, label }) => (
                    <button key={r} type="button" onClick={() => setForm({...form, role: r})}
                      className="py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-medium capitalize transition-all"
                      style={form.role === r
                        ? { background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.40)', color: '#4ade80' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-md)', color: 'var(--text-2)' }
                      }>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full btn-primary justify-center mt-1" style={{ padding: '0.65rem' }}>
                <span>Continue</span><ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {form.role === 'student' && (
                <div>
                  <label className="label block mb-1.5">Class / Grade</label>
                  <select className="input" value={form.class} onChange={e => setForm({...form, class: e.target.value})} required>
                    <option value="">Select Class</option>
                    {['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12','College Year 1','College Year 2','College Year 3'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="label block mb-1.5">School / Institution</label>
                <input className="input" placeholder="ABC Public School"
                  value={form.school} onChange={e => setForm({...form, school: e.target.value})} required />
              </div>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-[12px] mt-4" style={{ color: 'var(--text-3)' }}>
            Have an account?{' '}
            <Link to="/login" className="text-white/70 hover:text-white transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
