import { motion } from 'framer-motion';
import { TrendingUp, Shield, FileText, Clock, AlertCircle, RefreshCcw, CalendarDays, ArrowRight, CheckCircle2, Building2, FileCheck2, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { approvals, applications, complianceItems, alerts as alertsData, daysUntil } from '../../data/mockData';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function OverviewPage() {
  const navigate = useNavigate();
  const completedApprovals = approvals.filter(a => a.status === 'completed').length;
  const activeApps = applications.filter(a => a.status !== 'approved' && a.status !== 'rejected').length;
  const complianceHealth = Math.round(
    (complianceItems.filter(c => c.status === 'compliant' || c.status === 'not_applicable').length / complianceItems.length) * 100
  );
  const actionsRequired = complianceItems.filter(c => c.status === 'due_soon' || c.status === 'overdue').length;
  const upcomingDeadlines = complianceItems.filter(c => {
    const d = daysUntil(c.dueDate);
    return d > 0 && d <= 30 && c.status !== 'not_applicable';
  }).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="page-title">Good morning, Aarambh Foods</h1>
        <p className="page-subtitle">Your Maharashtra business approvals, compliance and support in one place.</p>
      </motion.div>

      <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-[#123b6d] text-white shadow-sm">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center p-6 md:p-8">
          <div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-100"><Landmark size={15}/> Maharashtra single-window business support</div>
            <h2 className="text-xl md:text-2xl font-bold mt-2">From business idea to approvals, with a clearer path.</h2>
            <p className="text-sm text-blue-100 mt-2 max-w-2xl">Map industrial approvals, prepare documents before submission, track inspections and renewals, and discover government support for your business.</p>
            <div className="flex flex-wrap gap-2 mt-4 text-xs text-blue-50"><span className="rounded-full bg-white/10 px-3 py-1.5">Approvals & licences</span><span className="rounded-full bg-white/10 px-3 py-1.5">Document readiness</span><span className="rounded-full bg-white/10 px-3 py-1.5">Compliance & renewals</span><span className="rounded-full bg-white/10 px-3 py-1.5">Schemes & support</span></div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-56"><button type="button" onClick={() => navigate('/register')} className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#123b6d] hover:bg-blue-50"><Building2 size={17}/> New Business Registration <ArrowRight size={15}/></button><button type="button" onClick={() => navigate('/prevalidation')} className="flex items-center justify-center gap-2 rounded-lg border border-white/30 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"><FileCheck2 size={17}/> Check document readiness</button></div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card" id="kpi-approval-progress">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Approval Progress</span>
            <TrendingUp size={18} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{Math.round((completedApprovals / approvals.length) * 100)}%</p>
          <p className="text-xs text-slate-500 mt-1">{completedApprovals} of {approvals.length} tracked approvals</p>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(completedApprovals / approvals.length) * 100}%` }} />
          </div>
        </div>

        <div className="kpi-card" id="kpi-compliance-health">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Compliance Health</span>
            <Shield size={18} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{complianceHealth}%</p>
          <p className="text-xs text-slate-500 mt-1">{actionsRequired} actions required</p>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${complianceHealth}%` }} />
          </div>
        </div>

        <div className="kpi-card" id="kpi-active-apps">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Applications</span>
            <FileText size={18} className="text-violet-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{activeApps}</p>
          <p className="text-xs text-slate-500 mt-1">Across {new Set(applications.map(a => a.departmentId)).size} departments</p>
        </div>

        <div className="kpi-card" id="kpi-deadlines">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Upcoming Deadlines</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{upcomingDeadlines}</p>
          <p className="text-xs text-slate-500 mt-1">Within next 30 days</p>
        </div>
      </motion.div>

      {/* Attention Required */}
      <motion.div variants={item}>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Attention required</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Required */}
          <div className="surface-card p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Action Required</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Pollution Consent</h3>
            <p className="text-sm text-slate-500 mb-3">Department query raised. Response required within:</p>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-lg font-bold text-red-600">2 days</span>
            </div>
            <button
              type="button"
              id="resolve-query-btn"
              className="w-full mt-auto py-2.5 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              onClick={() => navigate('/applications/app-001')}
            >
              Resolve Query
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Renewal */}
          <div className="surface-card p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Renewal Coming Up</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Factory Licence</h3>
            <p className="text-sm text-slate-500 mb-3">Renewal due in:</p>
            <div className="flex items-center gap-2 mb-4">
              <RefreshCcw size={16} className="text-amber-500" />
              <span className="text-lg font-bold text-amber-600">18 days</span>
            </div>
            <button
              type="button"
              id="view-renewal-btn"
              className="w-full mt-auto py-2.5 rounded-lg bg-amber-50 text-amber-800 text-sm font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              onClick={() => navigate('/compliance')}
            >
              View Renewal
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Inspection */}
          <div className="surface-card p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Inspection</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Fire Safety Inspection</h3>
            <p className="text-sm text-slate-500 mb-3">Scheduled:</p>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={16} className="text-yellow-500" />
              <span className="text-lg font-bold text-slate-700">30 September 2026</span>
            </div>
            <button
              type="button"
              id="view-schedule-btn"
              className="w-full mt-auto py-2.5 rounded-lg bg-slate-100 text-slate-800 text-sm font-semibold hover:bg-slate-200/80 transition-colors flex items-center justify-center gap-2"
              onClick={() => navigate('/inspections')}
            >
              View Schedule
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Recent activity</h2>
        <div className="surface-card divide-y divide-slate-100 overflow-hidden">
          {alertsData.slice(0, 5).map(alert => (
            <div key={alert.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/alerts')}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                alert.severity === 'critical' ? 'bg-red-500' :
                alert.severity === 'warning' ? 'bg-amber-500' :
                alert.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{alert.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{alert.description}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0">{alert.date}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'View Roadmap', icon: TrendingUp, to: '/roadmap', iconWrap: 'bg-blue-50 text-blue-600' },
            { label: 'Check Documents', icon: FileText, to: '/documents', iconWrap: 'bg-violet-50 text-violet-600' },
            { label: 'Run Validation', icon: CheckCircle2, to: '/prevalidation', iconWrap: 'bg-emerald-50 text-emerald-600' },
            { label: 'Browse Schemes', icon: Shield, to: '/schemes', iconWrap: 'bg-amber-50 text-amber-700' },
          ].map(action => (
            <button
              type="button"
              key={action.label}
              className="surface-card p-4 hover:border-slate-300 transition-colors text-left group"
              onClick={() => navigate(action.to)}
            >
              <span className={`inline-flex w-9 h-9 rounded-lg items-center justify-center mb-3 ${action.iconWrap}`}>
                <action.icon size={18} />
              </span>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{action.label}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
