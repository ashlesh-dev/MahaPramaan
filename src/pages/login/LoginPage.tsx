import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { ArrowLeft, ArrowRight, Building2, Landmark, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const handleLogin = (role: 'entrepreneur' | 'officer') => {
    setRole(role);
    navigate(role === 'officer' ? '/gov/overview' : '/overview');
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4 py-10 sm:px-8">
      <Link to="/" className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#123b6d] shadow-sm transition hover:border-[#123b6d] hover:bg-[#f7faff] sm:right-8 sm:top-8">
        <ArrowLeft size={16}/> Back to home
      </Link>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-3xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={`${import.meta.env.BASE_URL}brand/maha-pramaan-logo.png`} alt="Maha-Pramaan emblem" className="h-[76px] w-[76px] rounded-xl object-contain" />
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight"><span className="text-[#123b6d]">Maha-</span><span className="text-[#ed8500]">Pramaan</span></h1>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#123b6d]">Validate Before You Submit</p>
          <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#123b6d] via-[#ed8500] to-[#15945b]" />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(18,59,109,0.08)] sm:p-9">
          <div className="mx-auto mb-7 max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Choose your workspace</h2>
            <p className="mt-2 text-sm text-slate-600">Select a role to explore the Maha-Pramaan prototype.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 p-5 transition hover:border-[#9eb6d1] hover:shadow-md sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3fa] text-[#123b6d]"><Building2 size={22}/></div>
                <div><h3 className="font-semibold text-slate-900">Entrepreneur</h3><p className="mt-1 text-sm text-slate-500">Business approvals, documents and compliance</p></div>
              </div>
              <button id="login-entrepreneur" type="button" onClick={() => handleLogin('entrepreneur')} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#123b6d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0d2f57]">Continue as Entrepreneur <ArrowRight size={16}/></button>
            </article>

            <article className="rounded-xl border border-slate-200 p-5 transition hover:border-[#f1c27a] hover:shadow-md sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff7e9] text-[#bd6800]"><Landmark size={22}/></div>
                <div><h3 className="font-semibold text-slate-900">Government Officer</h3><p className="mt-1 text-sm text-slate-500">Department operations, scrutiny and analytics</p></div>
              </div>
              <button id="login-officer" type="button" onClick={() => handleLogin('officer')} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ed8500] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#cf7100]">Continue as Officer <ArrowRight size={16}/></button>
            </article>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500"><Shield size={14} className="text-[#15945b]"/><span>Demo workspaces · Mock data · No real authentication</span></div>
        </section>
        <p className="mt-5 text-center text-xs text-slate-500">Government of Maharashtra · Smart India Hackathon prototype</p>
      </motion.div>
    </main>
  );
}
