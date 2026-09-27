import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, UploadCloud,
  FileText, Loader2, Send, Building2, Clock, Info, Lock
} from 'lucide-react';
import { approvals, getApproval, getDepartment, getDocument } from '../../data/mockData';
import type { Approval } from '../../data/types';

interface Props {
  preSelectedApprovalId?: string;
  onClose: () => void;
  onSubmitted: (approvalId: string) => void;
}

const STEPS = ['Select Approval', 'Readiness Check', 'Review & Submit'];

export default function ApplyForApprovalModal({ preSelectedApprovalId, onClose, onSubmitted }: Props) {
  const [step, setStep] = useState(preSelectedApprovalId ? 1 : 0);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string>(preSelectedApprovalId || '');
  const [uploadedExtra, setUploadedExtra] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState('');

  const selectedApproval: Approval | undefined = useMemo(
    () => (selectedApprovalId ? getApproval(selectedApprovalId) : undefined),
    [selectedApprovalId]
  );

  const dept = selectedApproval ? getDepartment(selectedApproval.departmentId) : undefined;

  // Check which docs are available, missing, or need upload
  const docStatuses = useMemo(() => {
    if (!selectedApproval) return [];
    return selectedApproval.requiredDocumentIds.map(docId => {
      const doc = getDocument(docId);
      const isVerified = doc?.status === 'verified';
      const isUploaded = doc?.status === 'uploaded' || !!uploadedExtra[docId];
      return {
        docId,
        doc,
        status: isVerified ? 'verified' : isUploaded ? 'uploaded' : 'missing',
      };
    });
  }, [selectedApproval, uploadedExtra]);

  const allDocsReady = docStatuses.every(d => d.status !== 'missing');
  const missingCount = docStatuses.filter(d => d.status === 'missing').length;
  const verifiedCount = docStatuses.filter(d => d.status === 'verified').length;

  const availableApprovals = approvals.filter(a =>
    a.status === 'not_started' || a.status === 'blocked'
  );

  const handleUpload = (docId: string, file?: File) => {
    if (!file) return;
    setUploadedExtra(prev => ({ ...prev, [docId]: file.name }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1800);
  };

  const handleFinalClose = () => {
    if (submitted && selectedApprovalId) {
      onSubmitted(selectedApprovalId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={handleFinalClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Apply for Approval / Licence</h2>
            <p className="text-xs text-slate-500 mt-0.5">Maharashtra Single Window — MahaPramaan</p>
          </div>
          <button onClick={handleFinalClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step Indicators */}
        {!submitted && (
          <div className="px-6 py-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                    i === step ? 'bg-[#123b6d] text-white' :
                    i < step ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {i < step ? <CheckCircle2 size={12} /> : <span>{i + 1}</span>}
                    {s}
                  </div>
                  {i < STEPS.length - 1 && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* ── Step 0: Select Approval ── */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-sm text-slate-600 mb-4">Select the approval or licence you want to apply for. Only pending/blocked approvals are shown.</p>
                {availableApprovals.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-400" />
                    <p className="font-medium">All applicable approvals are already applied for.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableApprovals.map(appr => {
                      const d = getDepartment(appr.departmentId);
                      const isBlocked = appr.status === 'blocked';
                      const isSelected = selectedApprovalId === appr.id;
                      return (
                        <button
                          key={appr.id}
                          type="button"
                          disabled={isBlocked}
                          onClick={() => setSelectedApprovalId(appr.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                            isSelected ? 'border-[#123b6d] bg-blue-50' :
                            isBlocked ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' :
                            'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-[#123b6d] text-white' : isBlocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isBlocked ? <Lock size={16} /> : <FileText size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-800">{appr.name}</p>
                              {isBlocked && (
                                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">Blocked by deps</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{d?.name}</p>
                            <p className="text-xs text-slate-400 mt-1">SLA: {appr.slaWorkingDays} working days · {appr.category}</p>
                          </div>
                          {isSelected && <CheckCircle2 size={18} className="text-[#123b6d] shrink-0 mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 1: Readiness Check ── */}
            {step === 1 && selectedApproval && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 mb-5">
                  <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Document Readiness Check</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Before submitting your application for <strong>{selectedApproval.name}</strong>, verify that you have all required documents.
                      Upload any missing ones below. Documents already in your verified vault are auto-attached.
                    </p>
                  </div>
                </div>

                {/* Summary chips */}
                <div className="flex gap-3 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700">
                    <CheckCircle2 size={14} /> {verifiedCount} Verified
                  </div>
                  {missingCount > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
                      <AlertCircle size={14} /> {missingCount} Missing
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {docStatuses.map(({ docId, doc, status }) => (
                    <div key={docId} className={`p-4 rounded-xl border-2 flex items-start gap-3 ${
                      status === 'verified' ? 'border-emerald-200 bg-emerald-50' :
                      status === 'uploaded' ? 'border-blue-200 bg-blue-50' :
                      'border-dashed border-rose-300 bg-rose-50'
                    }`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        status === 'verified' ? 'bg-emerald-100 text-emerald-600' :
                        status === 'uploaded' ? 'bg-blue-100 text-blue-600' :
                        'bg-rose-100 text-rose-600'
                      }`}>
                        {status === 'verified' ? <CheckCircle2 size={18} /> :
                         status === 'uploaded' ? <Clock size={18} /> :
                         <AlertCircle size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-800">{doc?.name || docId}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            status === 'verified' ? 'bg-emerald-200 text-emerald-800' :
                            status === 'uploaded' ? 'bg-blue-200 text-blue-800' :
                            'bg-rose-200 text-rose-800'
                          }`}>
                            {status === 'verified' ? 'In Vault ✓' : status === 'uploaded' ? 'Uploaded' : 'Missing'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{doc?.type} document</p>
                        {status === 'verified' && (
                          <p className="text-[11px] text-emerald-700 mt-1">Verified on {doc?.verifiedDate} — will be auto-attached</p>
                        )}
                        {status === 'uploaded' && (
                          <p className="text-[11px] text-blue-700 mt-1">
                            {uploadedExtra[docId] || doc?.uploadedDate ? (uploadedExtra[docId] || 'File uploaded') : ''} — pending verification
                          </p>
                        )}
                        {status === 'missing' && (
                          <label className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-rose-700 border border-rose-300 px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 cursor-pointer transition-colors">
                            <UploadCloud size={14} /> Upload Document
                            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only"
                              onChange={e => handleUpload(docId, e.target.files?.[0])} />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {!allDocsReady && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <strong>You can still proceed</strong> with missing documents, but your application may be returned with a query. Upload documents for a smoother process.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 2: Review & Submit ── */}
            {step === 2 && !submitted && selectedApproval && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-5">
                  {/* Summary */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 size={18} className="text-[#123b6d] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Approval Requested</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedApproval.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{dept?.name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">SLA</p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedApproval.slaWorkingDays} days</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Docs attached</p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">
                          {docStatuses.filter(d => d.status !== 'missing').length}/{docStatuses.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Category</p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedApproval.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Document list */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Documents to be submitted</p>
                    <div className="space-y-2">
                      {docStatuses.map(({ docId, doc, status }) => (
                        <div key={docId} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                            status === 'missing' ? 'bg-slate-100 text-slate-400' :
                            status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {status === 'missing' ? '–' : <CheckCircle2 size={14} />}
                          </div>
                          <span className={`text-sm flex-1 ${status === 'missing' ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                            {doc?.name || docId}
                          </span>
                          <span className={`text-[10px] font-semibold ${
                            status === 'verified' ? 'text-emerald-600' : status === 'uploaded' ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {status === 'verified' ? 'Vault ✓' : status === 'uploaded' ? 'Uploaded' : 'Not attached'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 resize-none"
                      placeholder="Any specific details for the reviewing officer..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> This is a prototype demonstration. In production, this would submit your application to the respective department portal via the Maharashtra Single Window system.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Submitted ── */}
            {submitted && (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  Your application for <strong>{selectedApproval?.name}</strong> has been submitted. You'll receive a reference number shortly and can track progress in Applications.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg font-mono text-sm text-slate-700">
                  <span className="text-slate-400">Ref:</span>
                  MH-{selectedApproval?.category?.slice(0, 2).toUpperCase() || 'AP'}-2026-0{Math.floor(Math.random() * 9000 + 1000)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50 rounded-b-2xl">
            <button
              type="button"
              onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft size={18} />
              {step === 0 ? 'Cancel' : 'Back'}
            </button>

            {step < 2 ? (
              <button
                type="button"
                disabled={step === 0 && !selectedApprovalId}
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#123b6d] text-white rounded-lg text-sm font-semibold hover:bg-[#0f2f58] transition-colors disabled:opacity-50"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-70"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        )}
        {submitted && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-center bg-slate-50 rounded-b-2xl">
            <button
              type="button"
              onClick={handleFinalClose}
              className="px-6 py-2.5 bg-[#123b6d] text-white rounded-lg text-sm font-semibold hover:bg-[#0f2f58] transition-colors"
            >
              Go to Applications
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
