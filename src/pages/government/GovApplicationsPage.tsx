import { motion } from 'framer-motion';
import { FileText, Search, Filter, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { officerApplications } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function GovApplicationsPage() {
  const navigate = useNavigate();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText size={24} className="text-amber-500" />
            Department Applications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and review all applications assigned to your division.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID or Business..."
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-amber-400 w-64"
            />
          </div>
          <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <Filter size={18} />
          </button>
        </div>
      </motion.div>

      <motion.div variants={item} className="surface-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Application ID / Type</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {officerApplications.map(app => (
              <tr 
                key={app.id} 
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/gov/applications/${app.id}`)}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-800 font-mono">{app.applicationNumber}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{app.approvalType}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700 font-medium">{app.businessName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{app.district}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded font-medium">{app.status}</span>
                </td>
                <td className="px-6 py-4">
                  {app.slaStatus === 'breached' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                      <AlertTriangle size={14} /> Breached
                    </span>
                  ) : app.slaStatus === 'at_risk' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500">
                      <Clock size={14} /> At Risk
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <CheckCircle2 size={14} /> On Track
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    app.riskLevel === 'High' ? 'bg-red-50 text-red-700' :
                    app.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {app.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                    onClick={(e) => { e.stopPropagation(); navigate(`/gov/applications/${app.id}`); }}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
