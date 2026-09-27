import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Clock, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { applications, getApproval, getDepartment } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import ApplyForApprovalModal from './ApplyForApprovalModal';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

type StatusFilter = 'all' | 'under_review' | 'query_raised' | 'submitted' | 'approved';

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = applications.filter(app => {
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    const approval = getApproval(app.approvalId);
    const dept = getDepartment(app.departmentId);
    const matchSearch = !search ||
      app.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
      approval?.name.toLowerCase().includes(search.toLowerCase()) ||
      dept?.shortName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCounts = {
    all: applications.length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    query_raised: applications.filter(a => a.status === 'query_raised').length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    approved: applications.filter(a => a.status === 'approved').length,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText size={24} className="text-violet-500" />
            My Applications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage your submitted approval applications.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400 w-56"
            />
          </div>
          <button
            id="new-application-btn"
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#123b6d] text-white rounded-lg text-sm font-semibold hover:bg-[#0f2f58] transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Application
          </button>
        </div>
      </motion.div>

      {/* Status Filter Tabs */}
      <motion.div variants={item} className="flex items-center gap-2 overflow-x-auto pb-1">
        {([
          { key: 'all', label: 'All' },
          { key: 'submitted', label: 'Submitted' },
          { key: 'under_review', label: 'Under Review' },
          { key: 'query_raised', label: 'Query Raised' },
          { key: 'approved', label: 'Approved' },
        ] as { key: StatusFilter; label: string }[]).map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
              statusFilter === f.key
                ? 'bg-[#123b6d] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              statusFilter === f.key ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
            }`}>
              {statusCounts[f.key]}
            </span>
          </button>
        ))}
      </motion.div>

      <motion.div variants={item} className="surface-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-slate-600">No applications found</p>
            <p className="text-sm mt-1">Try a different filter or submit a new application.</p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#123b6d] text-white rounded-lg text-sm font-semibold hover:bg-[#0f2f58] transition-colors"
            >
              <Plus size={16} /> Apply for Approval
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Application ID / Approval</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(app => {
                const approval = getApproval(app.approvalId);
                const dept = getDepartment(app.departmentId);

                return (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800 font-mono">{app.applicationNumber}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{approval?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">{dept?.shortName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{dept?.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">{app.submittedDate}</p>
                      <p className="text-xs text-slate-400 mt-0.5">SLA: {approval?.slaWorkingDays} days</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        app.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        app.status === 'query_raised' ? 'bg-red-50 text-red-700' :
                        app.status === 'under_review' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {app.status === 'approved' ? <CheckCircle2 size={12} /> :
                         app.status === 'query_raised' ? <AlertCircle size={12} /> : <Clock size={12} />}
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                          <div
                            className={`h-full rounded-full ${app.status === 'approved' ? 'bg-emerald-500' : app.status === 'query_raised' ? 'bg-amber-500' : 'bg-blue-500'}`}
                            style={{ width: `${app.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500 w-8">{app.progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </motion.div>

      <AnimatePresence>
        {showApplyModal && (
          <ApplyForApprovalModal
            onClose={() => setShowApplyModal(false)}
            onSubmitted={() => setShowApplyModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
