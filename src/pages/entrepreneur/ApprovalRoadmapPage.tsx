import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, GitBranch, ChevronRight, CheckCircle2, Clock, AlertCircle, Loader2, Lock, Plus, PlayCircle } from 'lucide-react';
import { approvals, getDepartment, getApplicationByApprovalId } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import type { ApprovalStatus } from '../../data/types';
import ApplyForApprovalModal from './ApplyForApprovalModal';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

type FilterType = 'all' | 'required' | 'in_progress' | 'completed' | 'blocked' | 'renewal';

const statusConfig: Record<ApprovalStatus, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  completed: { label: 'Completed', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Loader2 },
  under_review: { label: 'Under Review', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: Clock },
  not_started: { label: 'Not Started', color: 'text-slate-500', bgColor: 'bg-slate-50', icon: Clock },
  blocked: { label: 'Blocked', color: 'text-red-600', bgColor: 'bg-red-50', icon: Lock },
  renewal_due: { label: 'Renewal Due', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: AlertCircle },
};

// Compute graph layers (BFS topological sort)
function computeLayers() {
  const layers: string[][] = [];
  const placed = new Set<string>();

  // Layer 0: no dependencies
  const layer0 = approvals.filter(a => a.dependencies.length === 0).map(a => a.id);
  layers.push(layer0);
  layer0.forEach(id => placed.add(id));

  while (placed.size < approvals.length) {
    const nextLayer: string[] = [];
    approvals.forEach(a => {
      if (!placed.has(a.id) && a.dependencies.every(dep => placed.has(dep))) {
        nextLayer.push(a.id);
      }
    });
    if (nextLayer.length === 0) break; // prevent infinite loop
    layers.push(nextLayer);
    nextLayer.forEach(id => placed.add(id));
  }

  return layers;
}

export default function ApprovalRoadmapPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [applyApprovalId, setApplyApprovalId] = useState<string | null>(null);
  const navigate = useNavigate();
  const layers = computeLayers();

  const filteredApprovals = approvals.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'required') return a.status !== 'completed';
    if (filter === 'in_progress') return a.status === 'in_progress' || a.status === 'under_review';
    if (filter === 'completed') return a.status === 'completed';
    if (filter === 'blocked') return a.status === 'blocked' || a.status === 'not_started';
    if (filter === 'renewal') return a.renewalPeriodMonths !== undefined;
    return true;
  });

  const filteredIds = new Set(filteredApprovals.map(a => a.id));

  const getNodeClass = (status: ApprovalStatus) => {
    const map: Record<ApprovalStatus, string> = {
      completed: 'completed',
      in_progress: 'in-progress',
      under_review: 'under-review',
      not_started: 'not-started',
      blocked: 'blocked',
      renewal_due: 'under-review',
    };
    return map[status];
  };

  const handleNodeClick = useCallback((id: string) => {
    const app = getApplicationByApprovalId(id);
    if (app) {
      navigate(`/applications/${app.id}`);
    } else {
      setSelectedNode(selectedNode === id ? null : id);
    }
  }, [navigate, selectedNode]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <GitBranch size={24} className="text-blue-500" />
            Your Regulatory Roadmap
          </h1>
          <p className="text-slate-500 text-sm mt-1">Approvals identified from your business profile. Click any pending item to apply.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setApplyApprovalId('__select__')}
            className="flex items-center gap-2 px-4 py-2 bg-[#123b6d] text-white rounded-lg text-sm font-semibold hover:bg-[#0f2f58] transition-colors shrink-0"
          >
            <Plus size={16} /> Apply for Approval
          </button>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={14} className="text-slate-400 shrink-0" />
          {(['all', 'required', 'in_progress', 'completed', 'blocked', 'renewal'] as FilterType[]).map(f => (
            <button
              type="button"
              key={f}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === f ? 'bg-navy-800 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        </div>
      </motion.div>

      {/* Dependency Graph (Visual) */}
      <motion.div variants={item} className="surface-card p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-slate-700 mb-6">Dependency Flow</h3>
        <div className="flex flex-col items-center gap-4 min-w-[600px]">
          {layers.map((layer, li) => (
            <div key={li}>
              {/* Connector from previous layer */}
              {li > 0 && (
                <div className="flex justify-center mb-4">
                  <div className="w-0.5 h-6 bg-slate-300" />
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                {layer.filter(id => filteredIds.has(id)).map(id => {
                  const appr = approvals.find(a => a.id === id)!;
                  const dept = getDepartment(appr.departmentId);
                  const cfg = statusConfig[appr.status];
                  const isSelected = selectedNode === id;

                  return (
                    <motion.div
                      key={id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`graph-node ${getNodeClass(appr.status)} ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                      onClick={() => handleNodeClick(id)}
                    >
                      <p className="text-sm font-semibold text-slate-800">{appr.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{dept?.shortName}</p>
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <cfg.icon size={12} className={cfg.color} />
                        <span className={`text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      {appr.progress > 0 && appr.progress < 100 && (
                        <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${appr.progress}%` }} />
                        </div>
                      )}
                      {appr.dependencies.length > 0 && (
                        <p className="text-[9px] text-slate-400 mt-1.5">
                          Depends on: {appr.dependencies.map(d => approvals.find(a => a.id === d)?.name).join(', ')}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Parallel indicator */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <GitBranch size={14} className="text-blue-400" />
            <span>
              <strong className="text-slate-700">3 approvals</strong> can proceed in parallel:
              Pollution Consent, Fire Safety NOC, and FSSAI Food Licence
            </span>
          </div>
        </div>
      </motion.div>

      {/* Approval List */}
      <motion.div variants={item}>
        <h3 className="text-base font-semibold text-slate-800 mb-4">All Approvals ({filteredApprovals.length})</h3>
        <div className="space-y-3">
          {filteredApprovals.map(appr => {
            const dept = getDepartment(appr.departmentId);
            const cfg = statusConfig[appr.status];
            const app = getApplicationByApprovalId(appr.id);
            const canApply = appr.status === 'not_started';

            return (
              <motion.div
                key={appr.id}
                variants={item}
                className="surface-card p-4 hover:border-slate-300 transition-colors cursor-pointer group"
                onClick={() => handleNodeClick(appr.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${cfg.bgColor} flex items-center justify-center shrink-0`}>
                      <cfg.icon size={18} className={cfg.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{appr.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{dept?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {canApply && (
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setApplyApprovalId(appr.id); }}
                        className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#123b6d] border border-[#123b6d]/30 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <PlayCircle size={14} /> Apply Now
                      </button>
                    )}
                    <div className="text-right hidden md:block">
                      <span className={`status-badge ${
                        appr.status === 'completed' ? 'status-completed' :
                        appr.status === 'in_progress' || appr.status === 'under_review' ? 'status-in-progress' :
                        appr.status === 'blocked' ? 'status-blocked' : 'status-not-started'
                      }`}>
                        {cfg.label}
                      </span>
                      {app && (
                        <p className="text-[10px] text-slate-400 mt-1">{app.applicationNumber}</p>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="w-16 hidden md:block">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>{appr.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${
                          appr.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} style={{ width: `${appr.progress}%` }} />
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyApprovalId && (
          <ApplyForApprovalModal
            preSelectedApprovalId={applyApprovalId === '__select__' ? undefined : applyApprovalId}
            onClose={() => setApplyApprovalId(null)}
            onSubmitted={() => setApplyApprovalId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
