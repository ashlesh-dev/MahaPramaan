import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, AlertTriangle, CheckCircle2, ChevronRight,
  Search, X, Loader2
} from 'lucide-react';

interface Escalation {
  id: string;
  applicationNumber: string;
  businessName: string;
  issue: string;
  currentStage: string;
  slaDays: number;
  elapsedDays: number;
  status: 'open' | 'under_review' | 'resolved';
  escalationLevel: number;
  district: string;
  date: string;
}

const ESCALATIONS: Escalation[] = [
  {
    id: 'esc-001',
    applicationNumber: 'MH-PC-2026-01756',
    businessName: 'GreenTech Chemicals',
    issue: 'Application delayed beyond SLA — no movement at inspection scheduling stage for 8 days',
    currentStage: 'Inspection Scheduling',
    slaDays: 15,
    elapsedDays: 22,
    status: 'open',
    escalationLevel: 1,
    district: 'Pune',
    date: '2026-09-22',
  },
  {
    id: 'esc-002',
    applicationNumber: 'MH-FR-2026-00891',
    businessName: 'Sahyadri Textiles',
    issue: 'Applicant claims documents were submitted but application shows them as missing. Requesting verification.',
    currentStage: 'Document Verification',
    slaDays: 20,
    elapsedDays: 15,
    status: 'under_review',
    escalationLevel: 0,
    district: 'Nagpur',
    date: '2026-09-21',
  },
  {
    id: 'esc-003',
    applicationNumber: 'MH-FS-2026-01101',
    businessName: 'Nashik Spice Works',
    issue: 'Repeated inspection reschedules causing operational delays. Three inspections cancelled without notice.',
    currentStage: 'Inspection',
    slaDays: 10,
    elapsedDays: 18,
    status: 'open',
    escalationLevel: 2,
    district: 'Nashik',
    date: '2026-09-20',
  },
  {
    id: 'esc-004',
    applicationNumber: 'MH-PC-2026-01602',
    businessName: 'Bharat Steel Pvt. Ltd.',
    issue: 'SLA breach auto-detected. Application stuck at technical scrutiny.',
    currentStage: 'Technical Scrutiny',
    slaDays: 15,
    elapsedDays: 19,
    status: 'resolved',
    escalationLevel: 1,
    district: 'Pune',
    date: '2026-09-15',
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function GovGrievancesPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'under_review' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Escalation | null>(null);
  const [response, setResponse] = useState('');
  const [resolving, setResolving] = useState(false);
  const [escalations, setEscalations] = useState(ESCALATIONS);

  const filtered = escalations.filter(e => {
    const matchFilter = filter === 'all' || e.status === filter;
    const matchSearch = !search ||
      e.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.businessName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleResolve = (id: string) => {
    if (!response.trim()) return;
    setResolving(true);
    setTimeout(() => {
      setEscalations(prev => prev.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
      setResolving(false);
      setSelected(null);
      setResponse('');
    }, 1500);
  };

  const handleStartReview = (id: string) => {
    setEscalations(prev => prev.map(e => e.id === id ? { ...e, status: 'under_review' } : e));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <MessageSquare size={24} className="text-rose-500" />
            Escalations & Grievances
          </h1>
          <p className="text-slate-500 text-sm mt-1">SLA-breached applications and applicant escalations requiring officer action.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by application or business..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-red-300 w-64"
          />
        </div>
      </motion.div>

      {/* Status Summary */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', count: escalations.filter(e => e.status === 'open').length, color: 'bg-red-50 text-red-700 border-red-100' },
          { label: 'Under Review', count: escalations.filter(e => e.status === 'under_review').length, color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Resolved', count: escalations.filter(e => e.status === 'resolved').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        ].map(s => (
          <div key={s.label} className={`kpi-card border ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={item} className="flex gap-2">
        {(['all', 'open', 'under_review', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
              filter === f ? 'bg-[#123b6d] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'under_review' ? 'Under Review' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Escalation List */}
      <motion.div variants={item} className="space-y-3">
        {filtered.map(esc => (
          <div
            key={esc.id}
            className={`surface-card p-5 hover:border-slate-300 transition-all cursor-pointer group ${
              esc.status === 'open' ? 'border-l-4 border-l-red-500' :
              esc.status === 'under_review' ? 'border-l-4 border-l-amber-500' :
              'border-l-4 border-l-emerald-500'
            }`}
            onClick={() => setSelected(esc)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  esc.status === 'open' ? 'bg-red-100 text-red-600' :
                  esc.status === 'under_review' ? 'bg-amber-100 text-amber-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {esc.status === 'resolved' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-xs font-bold text-slate-700">{esc.applicationNumber}</p>
                    {esc.escalationLevel > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase">
                        L{esc.escalationLevel} Escalation
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">{esc.businessName}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{esc.issue}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{esc.currentStage}</span>
                    <span className={`text-[10px] font-bold ${esc.elapsedDays > esc.slaDays ? 'text-red-600' : 'text-slate-500'}`}>
                      {esc.elapsedDays}/{esc.slaDays} days
                    </span>
                    <span className="text-[10px] text-slate-400">{esc.district}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  esc.status === 'open' ? 'bg-red-100 text-red-700' :
                  esc.status === 'under_review' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {esc.status === 'under_review' ? 'Under Review' : esc.status.charAt(0).toUpperCase() + esc.status.slice(1)}
                </span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700" />
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-slate-600">No escalations found</p>
          </div>
        )}
      </motion.div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-y-auto"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <p className="font-mono text-xs font-bold text-slate-500">{selected.applicationNumber}</p>
                  <h2 className="font-bold text-slate-900">{selected.businessName}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400"><X size={18} /></button>
              </div>

              <div className="p-5 space-y-5 flex-1">
                {/* Issue */}
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">Escalated Issue</p>
                  <p className="text-sm text-red-900">{selected.issue}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Current Stage', value: selected.currentStage },
                    { label: 'District', value: selected.district },
                    { label: 'SLA (days)', value: `${selected.slaDays} working days` },
                    { label: 'Days Elapsed', value: `${selected.elapsedDays} days` },
                    { label: 'Escalation Level', value: `Level ${selected.escalationLevel}` },
                    { label: 'Filed On', value: selected.date },
                  ].map(f => (
                    <div key={f.label} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{f.label}</p>
                      <p className="text-sm font-semibold text-slate-800">{f.value}</p>
                    </div>
                  ))}
                </div>

                {/* Action */}
                {selected.status !== 'resolved' && (
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-3">Officer Response</p>
                    <textarea
                      rows={4}
                      value={response}
                      onChange={e => setResponse(e.target.value)}
                      placeholder="Describe the action taken or response to the applicant..."
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 resize-none"
                    />
                    <div className="flex gap-3 mt-3">
                      {selected.status === 'open' && (
                        <button
                          onClick={() => { handleStartReview(selected.id); setSelected({ ...selected, status: 'under_review' }); }}
                          className="flex-1 py-2 border-2 border-amber-300 text-amber-700 rounded-xl font-semibold text-sm hover:bg-amber-50 transition-colors"
                        >
                          Start Review
                        </button>
                      )}
                      <button
                        onClick={() => handleResolve(selected.id)}
                        disabled={!response.trim() || resolving}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        {resolving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                )}

                {selected.status === 'resolved' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <p className="text-sm text-emerald-800 font-medium">This escalation has been resolved.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
