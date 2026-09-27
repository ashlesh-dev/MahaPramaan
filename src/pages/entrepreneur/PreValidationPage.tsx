import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, AlertTriangle, Check, CheckCircle2, ChevronDown, ChevronRight,
  FileCheck2, FileText, Info, RefreshCw, ShieldCheck, UploadCloud, XCircle, ScanSearch, Bot
} from 'lucide-react';


type State = 'submitted' | 'missing' | 'incorrect';
type Requirement = {
  id: string; name: string; approval: string; approvalId: string;
  status: State; file?: string; note: string; fields: string[]; liveUpload?: boolean;
};

const allRequirements: Requirement[] = [
  {
    id: 'land', name: 'Premises / land proof', approval: 'Pollution Consent (CTE/CTO)', approvalId: 'appr-001',
    status: 'submitted', file: 'MIDC_lease_agreement.pdf',
    note: 'Address and plot details appear in the document. Business name matches registration records.',
    fields: ['Business / occupier name', 'Industrial plot number', 'Address']
  },
  {
    id: 'flow', name: 'Manufacturing process flow', approval: 'Pollution Consent (CTE/CTO)', approvalId: 'appr-001',
    status: 'submitted', file: 'process_flow_v2.pdf',
    note: 'Process title found; sequence and daily capacity are present and complete.',
    fields: ['Product / process name', 'Process sequence', 'Daily capacity']
  },
  {
    id: 'water', name: 'Water balance statement', approval: 'Pollution Consent (CTE/CTO)', approvalId: 'appr-001',
    status: 'missing', note: 'No file submitted yet. This is a mandatory document for MPCB Consent to Establish.',
    fields: ['Source and daily intake', 'Process consumption', 'Effluent / reuse']
  },
  {
    id: 'site', name: 'Site plan with drainage', approval: 'Pollution Consent (CTE/CTO)', approvalId: 'appr-001',
    status: 'incorrect', file: 'machinery_schedule_old.pdf',
    note: 'Uploaded file appears to be a machinery schedule, not the requested site plan. Plot number and drainage markings are absent.',
    fields: ['Requested document type: site plan', 'Plot number', 'North direction / scale', 'Drainage and discharge points']
  },
  {
    id: 'layout', name: 'Premises layout', approval: 'FSSAI Food Licence', approvalId: 'appr-004',
    status: 'submitted', file: 'factory_layout.pdf',
    note: 'Layout file is present and complete. Processing area, storage areas and entry/exit points are marked.',
    fields: ['Processing area', 'Storage areas', 'Entry / exit']
  },
  {
    id: 'safety', name: 'Food safety management plan', approval: 'FSSAI Food Licence', approvalId: 'appr-004',
    status: 'missing', note: 'No file submitted yet. Required for FSSAI state licence category.',
    fields: ['Food safety controls', 'Cleaning schedule', 'Responsible person']
  },
  {
    id: 'fire-plan', name: 'Fire safety plan', approval: 'Fire Safety NOC', approvalId: 'appr-002',
    status: 'submitted', file: 'fire_safety_plan_v1.pdf',
    note: 'Fire safety plan uploaded. Exit routes, fire extinguisher positions and alarm points are present.',
    fields: ['Exit routes', 'Fire extinguisher locations', 'Alarm systems']
  },
];

const statusStyle: Record<State, string> = {
  submitted: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  missing: 'bg-rose-50 text-rose-800 border-rose-200',
  incorrect: 'bg-amber-50 text-amber-900 border-amber-200'
};
const statusLabel: Record<State, string> = {
  submitted: 'Valid',
  missing: 'Missing',
  incorrect: 'Incorrect / Incomplete'
};

const AI_INSIGHTS: Record<string, string> = {
  'appr-001': 'For Pollution Consent, ensure the site plan clearly shows drainage outfall points and effluent treatment plant location. MPCB officers specifically check for daily water consumption figures and waste disposal method.',
  'appr-002': 'For Fire Safety NOC, the fire plan must include evacuation routes with arrows, assembly point location, and fire extinguisher ratings. The building layout must show distances to nearest fire station access road.',
  'appr-004': 'For FSSAI Licence, the food safety management plan must name a Food Safety Supervisor with FOSTAC certification. The cleaning schedule must specify frequency (daily/weekly) for each zone.',
};

export default function PreValidationPage() {
  const [requirements, setRequirements] = useState<Requirement[]>(allRequirements);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const approvalOptions = useMemo(() => {
    const seen = new Set<string>();
    return allRequirements.filter(r => { const ok = !seen.has(r.approvalId); seen.add(r.approvalId); return ok; });
  }, []);

  const filtered = useMemo(() =>
    selectedApprovalId === 'all' ? requirements : requirements.filter(r => r.approvalId === selectedApprovalId),
    [selectedApprovalId, requirements]
  );

  const upload = (id: string, file?: File) => {
    if (!file) return;
    setRequirements(list => list.map(item =>
      item.id === id ? {
        ...item, status: 'submitted', file: file.name, liveUpload: true,
        note: `File "${file.name}" received. This prototype does not inspect file contents — ensure the uploaded document matches the required type before final submission.`
      } : item
    ));
    setChecked(false);
  };

  const runCheck = () => {
    setBusy(true);
    setChecked(false);
    window.setTimeout(() => { setBusy(false); setChecked(true); }, 900);
  };

  const count = (status: State) => requirements.filter(r => r.status === status).length;
  const readinessScore = Math.round((count('submitted') / requirements.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl space-y-5 pb-10">

      {/* Header Banner */}
      <div className="rounded-2xl bg-[#123b6d] text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-100">
            <ScanSearch size={16} /> Document Content Validation
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">Validate uploaded documents before submission.</h1>
          <p className="text-sm text-blue-100 mt-2 max-w-2xl">
            This tool checks whether uploaded documents contain the correct fields and information required by each approval.
            It does not verify legal authenticity — only completeness and document type.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={runCheck}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#123b6d] px-5 py-3 text-sm font-semibold hover:bg-blue-50 disabled:opacity-70 shrink-0"
        >
          {busy ? <RefreshCw size={17} className="animate-spin" /> : <FileCheck2 size={17} />}
          {busy ? 'Validating documents…' : checked ? 'Re-validate' : 'Run Validation'}
        </button>
      </div>

      {/* Distinction callout */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
        <Info size={18} className="mt-0.5 shrink-0 text-blue-700" />
        <div>
          <p><strong>What this page does:</strong> Validates whether your <em>uploaded documents</em> contain all required fields and are the correct document type.</p>
          <p className="mt-1 text-blue-800">
            <strong>Readiness Check</strong> (do you have all documents?) is integrated into the
            <strong className="text-[#123b6d]"> Apply for Approval</strong> flow on the Roadmap and Applications pages.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid sm:grid-cols-4 gap-3">
        <div className="surface-card p-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <CheckCircle2 size={19} />
          </span>
          <div>
            <p className="text-xl font-bold text-slate-900">{count('submitted')}</p>
            <p className="text-xs text-slate-500">Valid</p>
          </div>
        </div>
        <div className="surface-card p-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
            <XCircle size={19} />
          </span>
          <div>
            <p className="text-xl font-bold text-slate-900">{count('missing')}</p>
            <p className="text-xs text-slate-500">Missing</p>
          </div>
        </div>
        <div className="surface-card p-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
            <AlertTriangle size={19} />
          </span>
          <div>
            <p className="text-xl font-bold text-slate-900">{count('incorrect')}</p>
            <p className="text-xs text-slate-500">Incorrect</p>
          </div>
        </div>
        <div className="surface-card p-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
            <ShieldCheck size={19} />
          </span>
          <div>
            <p className="text-xl font-bold text-slate-900">{readinessScore}%</p>
            <p className="text-xs text-slate-500">Validity Score</p>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="surface-card p-4 md:p-5 border-l-4 border-l-[#123b6d]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={19} className="text-[#123b6d]" />
              <h2 className="font-semibold text-slate-900">Validation Complete</h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {count('submitted')} of {requirements.length} documents passed validation. {count('missing')} are missing
              and {count('incorrect')} appear to have incorrect content. Review flagged items below before submitting your application.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Checklist */}
      <section className="surface-card overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Document Validation Checklist</h2>
            <p className="text-xs text-slate-500 mt-1">Food processing unit · Nashik MIDC · Aarambh Foods Pvt. Ltd.</p>
          </div>
          <div className="relative">
            <span className="sr-only">Filter by approval</span>
            <select
              value={selectedApprovalId}
              onChange={e => setSelectedApprovalId(e.target.value)}
              className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Approvals</option>
              {approvalOptions.map(r => (
                <option key={r.approvalId} value={r.approvalId}>{r.approval}</option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-2.5 pointer-events-none text-slate-500" />
          </div>
        </div>

        {/* AI Insight Banner (per approval) */}
        {selectedApprovalId !== 'all' && AI_INSIGHTS[selectedApprovalId] && (
          <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl bg-violet-50 border border-violet-200 p-4">
            <Bot size={18} className="text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-violet-800 uppercase tracking-wider mb-1">AI Validation Hint</p>
              <p className="text-sm text-violet-700">{AI_INSIGHTS[selectedApprovalId]}</p>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {filtered.map(item => (
            <article key={item.id} className="p-5 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.status === 'submitted' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'missing' ? 'bg-slate-100 text-slate-400' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    <FileText size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">{item.approval}</p>
                    <h3 className="font-semibold text-slate-900 mt-0.5">{item.name}</h3>
                    <p className="text-sm text-slate-600 mt-1 font-mono text-xs">{item.file ?? 'No file uploaded'}</p>
                    <p className={`text-xs mt-2 ${
                      item.status === 'submitted' ? 'text-emerald-700' :
                      item.status === 'incorrect' ? 'text-amber-800' : 'text-rose-700'
                    }`}>
                      {item.note}
                    </p>

                    {/* Field check badges (shown after running validation) */}
                    {checked && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.liveUpload ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2 py-1 text-[11px]">
                            <Info size={12} /> File received · contents not inspected (prototype)
                          </span>
                        ) : (
                          item.fields.map((field, idx) => {
                            const isIssue = (item.status === 'missing') || (item.status === 'incorrect' && idx === 0);
                            return (
                              <span key={field} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] ${
                                isIssue ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}>
                                {isIssue ? <AlertCircle size={12} /> : <Check size={12} />}
                                {field} — {isIssue ? 'needs review' : 'present'}
                              </span>
                            );
                          })
                        )}
                      </div>
                    )}

                    {/* Expand for what's expected */}
                    {!checked && (
                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedId === item.id ? 'Hide' : 'What fields are checked?'}
                        <ChevronRight size={13} className={`transition-transform ${expandedId === item.id ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                    <AnimatePresence>
                      {expandedId === item.id && !checked && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2"
                        >
                          <div className="flex flex-wrap gap-2">
                            {item.fields.map(f => (
                              <span key={f} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                                <FileText size={11} /> {f}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:pt-1 shrink-0">
                  <span className={`text-[11px] font-semibold border rounded-full px-2.5 py-1 ${statusStyle[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                  <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                    <UploadCloud size={15} />
                    {item.file ? 'Replace' : 'Upload'}
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="sr-only"
                      onChange={e => upload(item.id, e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-slate-500">
        Prototype demonstration — document content validation is simulated. Confirm requirements with the relevant department before submitting.
      </p>
    </motion.div>
  );
}
