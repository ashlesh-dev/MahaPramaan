import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, AlertTriangle, FileText, MessageSquare,
  Download, Building2, MapPin, User, Send, Loader2, ShieldAlert,
  Eye, History, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { officerApplications } from '../../data/mockData';

interface OfficerNote {
  id: string;
  text: string;
  officer: string;
  date: string;
  type: 'note' | 'query' | 'decision';
}

const MOCK_NOTES: OfficerNote[] = [
  {
    id: 'n1',
    text: 'Application received and initial document check completed. 4 of 6 required documents are present.',
    officer: 'Dr. R. S. Patil',
    date: '2026-09-19',
    type: 'note',
  },
  {
    id: 'n2',
    text: 'Technical scrutiny initiated. Process flow document looks good. Awaiting machinery specifications and water consumption declaration from applicant.',
    officer: 'Shri. M. K. Joshi',
    date: '2026-09-21',
    type: 'note',
  },
  {
    id: 'n3',
    text: 'Query raised to applicant: Please provide (1) Machinery specifications with make/model and installed capacity, (2) Water balance statement showing daily intake, process use, effluent and reuse quantities.',
    officer: 'Dr. R. S. Patil',
    date: '2026-09-24',
    type: 'query',
  },
];

const RISK_INDICATORS = [
  { label: 'Identity verified', status: 'pass', detail: 'PAN and business identity match records' },
  { label: 'Business details consistent', status: 'pass', detail: 'All business info matches across documents' },
  { label: 'Required documents present', status: 'pass', detail: '4 of 6 required documents submitted' },
  { label: 'Machinery details recently modified', status: 'warning', detail: 'Document updated on 2026-09-22 — verify authenticity' },
];

const SUBMITTED_DOCS = [
  { name: 'PAN Card', status: 'verified', size: '245 KB' },
  { name: 'GST Certificate', status: 'verified', size: '312 KB' },
  { name: 'Land Document / Allotment Letter', status: 'verified', size: '3.4 MB' },
  { name: 'Detailed Project Report', status: 'verified', size: '8.7 MB' },
  { name: 'Machinery Details & Specifications', status: 'missing', size: '' },
  { name: 'Water Consumption Declaration', status: 'missing', size: '' },
];

export default function GovApplicationDetailPage() {
  const navigate = useNavigate();
  const app = officerApplications[0]; // Demo with Aarambh Foods
  const [decision, setDecision] = useState<'approve' | 'query' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'note' | 'query'>('note');
  const [notes, setNotes] = useState<OfficerNote[]>(MOCK_NOTES);
  const [queryText, setQueryText] = useState('');
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'risk' | 'notes'>('overview');

  const handleDecision = (type: 'approve' | 'query' | 'reject') => {
    if (type === 'query') { setShowQueryModal(true); return; }
    if (type === 'reject') { setShowRejectModal(true); return; }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setDecision(type);
    }, 1800);
  };

  const submitQuery = () => {
    if (!queryText.trim()) return;
    setNotes(prev => [...prev, {
      id: `n${Date.now()}`,
      text: queryText,
      officer: 'Current Officer',
      date: new Date().toISOString().split('T')[0],
      type: 'query',
    }]);
    setShowQueryModal(false);
    setQueryText('');
    setDecision('query');
    setProcessed(true);
  };

  const submitRejection = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setDecision('reject');
      setShowRejectModal(false);
    }, 1500);
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [...prev, {
      id: `n${Date.now()}`,
      text: newNote,
      officer: 'Current Officer',
      date: new Date().toISOString().split('T')[0],
      type: noteType,
    }]);
    setNewNote('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/gov/applications')} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="page-title flex items-center gap-2">
            <ShieldAlert size={22} className="text-amber-500" />
            Application Review — {app.applicationNumber}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{app.approvalType} · {app.businessName} · {app.district}</p>
        </div>
        {!processed && (
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            app.slaStatus === 'breached' ? 'bg-red-100 text-red-700' :
            app.slaStatus === 'at_risk' ? 'bg-amber-100 text-amber-700' :
            'bg-emerald-100 text-emerald-700'
          }`}>
            SLA: {app.slaStatus === 'breached' ? 'Breached' : app.slaStatus === 'at_risk' ? 'At Risk' : 'On Track'}
          </span>
        )}
        {processed && (
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
            decision === 'approve' ? 'bg-emerald-100 text-emerald-700' :
            decision === 'query' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            <CheckCircle2 size={12} />
            {decision === 'approve' ? 'Approved' : decision === 'query' ? 'Query Raised' : 'Rejected'}
          </span>
        )}
      </div>

      {/* Risk Badge Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Risk Level', value: app.riskLevel, color: app.riskLevel === 'High' ? 'text-red-700 bg-red-50' : app.riskLevel === 'Medium' ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50' },
          { label: 'Days Elapsed', value: `${app.daysElapsed} days`, color: 'text-slate-700 bg-slate-50' },
          { label: 'Status', value: app.status, color: 'text-blue-700 bg-blue-50' },
          { label: 'District', value: app.district, color: 'text-slate-700 bg-slate-50' },
        ].map(kpi => (
          <div key={kpi.label} className={`rounded-xl p-4 ${kpi.color} border border-black/5`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">{kpi.label}</p>
            <p className="text-base font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {([
          { key: 'overview', label: 'Overview', icon: Eye },
          { key: 'documents', label: 'Documents', icon: FileText },
          { key: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
          { key: 'notes', label: `Officer Notes (${notes.length})`, icon: MessageSquare },
        ] as { key: typeof activeTab; label: string; icon: React.ElementType }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#123b6d] text-[#123b6d]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="surface-card p-5">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Building2 size={17} className="text-slate-500" /> Business Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      { label: 'Business Name', value: app.businessName },
                      { label: 'Application ID', value: app.applicationNumber },
                      { label: 'Approval Type', value: app.approvalType },
                      { label: 'Submitted', value: app.submittedDate },
                      { label: 'Days Elapsed', value: `${app.daysElapsed} working days` },
                      { label: 'District', value: app.district },
                    ].map(f => (
                      <div key={f.label}>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">{f.label}</p>
                        <p className="font-semibold text-slate-800">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card p-5">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <History size={17} className="text-slate-500" /> Processing Timeline
                  </h3>
                  <div className="ml-2 space-y-4">
                    {[
                      { date: '2026-09-18', title: 'Application Submitted', desc: 'Application received with 4 documents', done: true },
                      { date: '2026-09-19', title: 'Document Check Completed', desc: 'Initial validation passed — 2 docs missing', done: true },
                      { date: '2026-09-21', title: 'Technical Scrutiny Started', desc: 'Assigned to Dr. R. S. Patil for review', done: true },
                      { date: '2026-09-24', title: 'Query Raised to Applicant', desc: 'Machinery specs and water statement requested', done: true, isQuery: true },
                      { date: '2026-09-28', title: 'Site Inspection Pending', desc: 'Awaiting applicant response to query', done: false },
                    ].map((ev, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full mt-1 ${ev.done ? ev.isQuery ? 'bg-amber-500' : 'bg-emerald-500' : 'bg-slate-200 border-2 border-slate-300'}`} />
                          {i < 4 && <div className="w-0.5 h-8 bg-slate-200 mt-1" />}
                        </div>
                        <div className="-mt-0.5">
                          <p className="text-xs text-slate-400 font-medium">{ev.date}</p>
                          <p className={`text-sm font-semibold ${ev.done ? 'text-slate-800' : 'text-slate-400'}`}>{ev.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{ev.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Submitted Documents ({SUBMITTED_DOCS.filter(d => d.status !== 'missing').length}/{SUBMITTED_DOCS.length})</h3>
                  <p className="text-xs text-slate-500 mt-1">Documents submitted with the application. Missing items shown in red.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {SUBMITTED_DOCS.map(doc => (
                    <div key={doc.name} className={`flex items-center justify-between p-4 ${doc.status === 'missing' ? 'bg-red-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${doc.status === 'missing' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-600'}`}>
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${doc.status === 'missing' ? 'text-red-700' : 'text-slate-800'}`}>{doc.name}</p>
                          {doc.size && <p className="text-xs text-slate-400">{doc.size}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === 'missing' ? (
                          <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Missing</span>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                              <Download size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Risk Tab */}
            {activeTab === 'risk' && (
              <motion.div key="risk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card overflow-hidden">
                <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">System Risk Assessment</span>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={20} className="text-amber-500" />
                      <span className="text-xl font-bold text-amber-700">Medium Risk</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recommendation</span>
                    <span className="text-sm font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200">Manual Review Required</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {RISK_INDICATORS.map((ind, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                      ind.status === 'pass' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
                    }`}>
                      {ind.status === 'pass'
                        ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        : <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />}
                      <div>
                        <p className={`text-sm font-semibold ${ind.status === 'pass' ? 'text-emerald-800' : 'text-amber-800'}`}>{ind.label}</p>
                        <p className={`text-xs mt-0.5 ${ind.status === 'pass' ? 'text-emerald-600' : 'text-amber-700'}`}>{ind.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="surface-card divide-y divide-slate-100 overflow-hidden">
                  {notes.map(note => (
                    <div key={note.id} className={`p-4 ${note.type === 'query' ? 'bg-amber-50' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          note.type === 'query' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {note.type === 'query' ? <AlertTriangle size={14} /> : <User size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-xs font-semibold text-slate-700">{note.officer}</p>
                            <div className="flex items-center gap-2">
                              {note.type === 'query' && (
                                <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full uppercase">Query</span>
                              )}
                              <span className="text-[10px] text-slate-400">{note.date}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700">{note.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add note */}
                <div className="surface-card p-5">
                  <h3 className="font-semibold text-slate-800 mb-3">Add Officer Note</h3>
                  <div className="flex gap-2 mb-3">
                    {(['note', 'query'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setNoteType(t)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                          noteType === t ? 'bg-[#123b6d] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t === 'note' ? 'Internal Note' : 'Query to Applicant'}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder={noteType === 'query' ? 'Write query to send to applicant...' : 'Add internal processing note...'}
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 resize-none"
                  />
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="mt-2 flex items-center gap-2 px-4 py-2 bg-[#123b6d] text-white rounded-lg text-sm font-semibold hover:bg-[#0f2f58] transition-colors disabled:opacity-50"
                  >
                    <Send size={14} /> Add Note
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Decision */}
        <div className="space-y-6">
          {/* Decision Panel */}
          <div className="surface-card p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldAlert size={17} className="text-amber-500" /> Officer Decision
            </h3>

            {processed ? (
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                decision === 'approve' ? 'bg-emerald-50 border-emerald-200' :
                decision === 'query' ? 'bg-amber-50 border-amber-200' :
                'bg-red-50 border-red-200'
              }`}>
                <CheckCircle2 size={20} className={
                  decision === 'approve' ? 'text-emerald-600' :
                  decision === 'query' ? 'text-amber-600' : 'text-red-600'
                } />
                <div>
                  <p className={`font-semibold text-sm ${
                    decision === 'approve' ? 'text-emerald-800' :
                    decision === 'query' ? 'text-amber-800' : 'text-red-800'
                  }`}>
                    {decision === 'approve' ? 'Application Approved' :
                     decision === 'query' ? 'Query Raised to Applicant' : 'Application Rejected'}
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    {decision === 'approve' ? 'Approval letter will be generated and sent to the applicant.' :
                     decision === 'query' ? 'Applicant has been notified. Awaiting response.' :
                     'Rejection letter with reasons has been sent to the applicant.'}
                  </p>
                  <button onClick={() => { setProcessed(false); setDecision(null); }} className="text-xs underline mt-2 opacity-70 hover:opacity-100">Undo</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleDecision('approve')}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 text-sm"
                >
                  {processing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Approve Application
                </button>
                <button
                  onClick={() => handleDecision('query')}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-60 text-sm"
                >
                  <MessageSquare size={16} /> Raise Query
                </button>
                <button
                  onClick={() => handleDecision('reject')}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60 text-sm"
                >
                  <X size={16} /> Reject Application
                </button>
              </div>
            )}
          </div>

          {/* Applicant Info */}
          <div className="surface-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Applicant</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Building2 size={18} className="text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{app.businessName}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} /> {app.district}, Maharashtra
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Application No.</span>
                <span className="font-mono text-xs font-bold text-slate-700">{app.applicationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Submitted</span>
                <span className="text-xs font-medium text-slate-700">{app.submittedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Days Elapsed</span>
                <span className={`text-xs font-bold ${app.daysElapsed > 15 ? 'text-red-600' : 'text-slate-700'}`}>{app.daysElapsed} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Query Modal */}
      <AnimatePresence>
        {showQueryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowQueryModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="font-bold text-slate-900 mb-1">Raise Query to Applicant</h2>
              <p className="text-sm text-slate-500 mb-4">The applicant will be notified and asked to respond within 3 working days.</p>
              <textarea
                rows={5}
                value={queryText}
                onChange={e => setQueryText(e.target.value)}
                placeholder="Describe what information or documents are needed..."
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowQueryModal(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">Cancel</button>
                <button onClick={submitQuery} disabled={!queryText.trim()} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                  <Send size={15} /> Send Query
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="font-bold text-slate-900 mb-1">Reject Application</h2>
              <p className="text-sm text-slate-500 mb-4">Provide a reason for rejection. This will be communicated to the applicant.</p>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="State the reason(s) for rejection clearly..."
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-red-400 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowRejectModal(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">Cancel</button>
                <button onClick={submitRejection} disabled={!rejectionReason.trim() || processing} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                  {processing ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
                  Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
