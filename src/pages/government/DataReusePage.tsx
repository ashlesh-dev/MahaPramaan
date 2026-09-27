import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, CheckCircle2, Building2, MapPin, Search, ChevronRight, ShieldCheck } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const APPLICANTS = [
  {
    id: 'biz-001',
    name: 'Aarambh Foods Pvt. Ltd.',
    cin: 'U15400MH2024PTC123456',
    pan: 'AABCA1234F',
    location: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    landType: 'Industrial / MIDC',
    type: 'Private Limited Company',
    verifiedScore: 85,
    lastVerified: '2026-09-15'
  },
  {
    id: 'biz-002',
    name: 'GreenTech Chemicals',
    cin: 'U24100MH2025PTC654321',
    pan: 'BBDCA5678G',
    location: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    landType: 'Industrial / SEZ',
    type: 'Private Limited Company',
    verifiedScore: 92,
    lastVerified: '2026-09-21'
  },
  {
    id: 'biz-003',
    name: 'Sahyadri Textiles',
    cin: 'U17100MH2023PTC987654',
    pan: 'CCDCA9012H',
    location: 'Nagpur',
    district: 'Nagpur',
    state: 'Maharashtra',
    landType: 'Private Land',
    type: 'Partnership Firm',
    verifiedScore: 78,
    lastVerified: '2026-08-30'
  }
];

export default function DataReusePage() {
  const [selectedApplicant, setSelectedApplicant] = useState<typeof APPLICANTS[0] | null>(null);
  const [search, setSearch] = useState('');

  const filtered = APPLICANTS.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.cin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      <motion.div variants={item} className="text-center mb-8">
        <h1 className="page-title flex items-center justify-center gap-2 mb-2">
          <Database size={24} className="text-blue-500" />
          Intelligent Data Pre-fill
        </h1>
        <p className="text-slate-500 text-sm">Demonstrating reuse of verified data across departmental forms.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedApplicant ? (
          <motion.div 
            key="selector"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="surface-card p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Select Applicant Profile</h2>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by business name or CIN..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="space-y-3">
                {filtered.map(app => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApplicant(app)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{app.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">CIN: {app.cin} · {app.district}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck size={10} /> {app.verifiedScore}% Verified
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Last sync: {app.lastVerified}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-600" />
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm font-medium">No applicants found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedApplicant(null)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200"
              >
                <ChevronRight className="rotate-180" size={16} /> Back to Search
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <CheckCircle2 size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Verified Data Sourced for {selectedApplicant.name}</p>
                <p className="text-xs text-blue-800 leading-relaxed max-w-2xl">
                  This form has been automatically populated using data verified during previous applications. Fields marked with a green checkmark are locked and sourced from the central trusted repository.
                </p>
              </div>
            </div>

            <div className="surface-card shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 p-5 bg-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-800">New Application Form</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Application for Consent to Operate (CTO)</p>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Auto-filled: {selectedApplicant.verifiedScore}%
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Section 1 */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <Building2 size={16} className="text-slate-400" /> Enterprise Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="relative">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">Enterprise Name</label>
                        <input type="text" value={selectedApplicant.name} readOnly className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none" />
                        <CheckCircle2 size={14} className="absolute right-3 top-[26px] text-emerald-500" />
                      </div>
                      <div className="relative">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">Constitution of Business</label>
                        <input type="text" value={selectedApplicant.type} readOnly className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none" />
                        <CheckCircle2 size={14} className="absolute right-3 top-[26px] text-emerald-500" />
                      </div>
                      <div className="relative">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">CIN Number</label>
                        <input type="text" value={selectedApplicant.cin} readOnly className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono focus:outline-none" />
                        <CheckCircle2 size={14} className="absolute right-3 top-[26px] text-emerald-500" />
                      </div>
                      <div className="relative">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">PAN Number</label>
                        <input type="text" value={selectedApplicant.pan} readOnly className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono focus:outline-none" />
                        <CheckCircle2 size={14} className="absolute right-3 top-[26px] text-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" /> Location Details
                    </h3>
                    <div className="grid grid-cols-1 gap-5">
                      <div className="relative">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">Registered Address</label>
                        <input type="text" value={`${selectedApplicant.location}, ${selectedApplicant.district}, ${selectedApplicant.state}`} readOnly className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none" />
                        <CheckCircle2 size={14} className="absolute right-3 top-[26px] text-emerald-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="relative">
                          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Land Type</label>
                          <input type="text" value={selectedApplicant.landType} readOnly className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none" />
                          <CheckCircle2 size={14} className="absolute right-3 top-[26px] text-emerald-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Survey / Plot No. (Manual Entry)</label>
                          <input type="text" placeholder="Enter plot number" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setSelectedApplicant(null)} className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                    Cancel
                  </button>
                  <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                    Generate Form
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
