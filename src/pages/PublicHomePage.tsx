import { ArrowRight, BadgeCheck, Building2, CheckCircle2, ChevronRight, ClipboardCheck, FileCheck2, Landmark, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const base = import.meta.env.BASE_URL;
const capabilities = [
  { icon: ClipboardCheck, title: 'Find Applicable Approvals', description: 'Identify licences, registrations and departmental requirements based on the business profile.' },
  { icon: FileCheck2, title: 'Validate Documents', description: 'Check required documents, identify missing items and detect incorrect/incomplete submissions before applying.' },
  { icon: ShieldCheck, title: 'Track Compliance & Renewals', description: 'Monitor approvals, inspections, deadlines, renewals and compliance requirements.' },
  { icon: Sparkles, title: 'Access Schemes & Support', description: 'Discover relevant government schemes, incentives and support services.' },
];

export default function PublicHomePage() {
  return <main className="min-h-screen bg-[#f7f9fc] text-slate-900 font-sans">
    <div className="h-1 bg-gradient-to-r from-[#123b6d] via-[#f28c00] to-[#15945b]" />
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Maha-Pramaan home">
          <img src={`${base}brand/maha-pramaan-logo.png`} alt="Maha-Pramaan emblem" className="h-14 w-14 rounded-lg object-contain" />
          <span className="leading-none"><span className="block text-xl font-extrabold tracking-tight"><span className="text-[#123b6d]">Maha-</span><span className="text-[#ed8500]">Pramaan</span></span><span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#123b6d]">Validate Before You Submit</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex"><Landmark size={15} className="text-[#123b6d]"/> Government of Maharashtra · SIH Prototype</span>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-[#123b6d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d2f57]">Enter portal <ArrowRight size={16}/></Link>
        </div>
      </div>
    </header>

    <section className="relative isolate overflow-hidden bg-white border-b border-slate-200">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#123b6d]">
            <span className="h-2 w-2 rounded-full bg-[#15945b]"/> 
            Government of Maharashtra Digital Service
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[#123b6d] md:text-5xl lg:text-6xl">
            Multiple Departments.<br/><span className="text-[#ed8500]">One Guided Journey.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Find applicable approvals, prepare required documents, track applications and manage ongoing compliance — all in one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ed8500] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#d87400]">
              Start New Registration <ArrowRight size={17}/>
            </Link>
            <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900">
              Check Required Approvals <ChevronRight size={17}/>
            </a>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <BadgeCheck size={16} className="text-[#15945b]"/> Unified public service platform for industrial readiness
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg lg:ml-auto lg:mr-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl shadow-slate-200/50 md:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#123b6d]"><Building2 size={20}/></span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Guided Registration Path</p>
                  <p className="text-xs text-slate-500">View department-wise requirements</p>
                </div>
              </div>
              <span className="rounded-full bg-[#e8f6ee] px-2.5 py-1 text-[10px] font-semibold text-[#15945b] border border-[#bce3cd]">OFFICIAL</span>
            </div>
            <div className="space-y-0 py-4">
              {[['Enter Business Details', 'Profile · Sector · Investment'], ['Identify Required Approvals', 'State · Central · Local Body'], ['Validate Document Readiness', 'Format · Completeness · Rules']].map(([title, subtitle], index) => 
                <div key={title} className="relative flex gap-3 pb-5 last:pb-0">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-xs font-bold text-[#123b6d]">{index + 1}</div>
                  {index < 2 && <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-blue-100"/>}
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#15945b]"/>
                <p className="text-xs leading-5 text-slate-600"><strong className="text-slate-800">Pre-verification:</strong> System validates document completeness before final application submission.</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] font-medium text-slate-500">A unified digital guidance platform for industrial approvals and compliance</p>
        </div>
      </div>
    </section>

    <section id="services" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#123b6d] md:text-4xl">Platform Services</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">Comprehensive guidance and management for your industrial requirements.</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[#123b6d] mb-5">
              <Icon size={24}/>
            </div>
            <h3 className="font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </section>

    <section id="how-it-works" className="border-t border-slate-200 bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#123b6d]">How the Process Works</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">A structured workflow from initial registration to ongoing compliance.</p>
        </div>
        
        <div className="mt-12 overflow-x-auto pb-6">
          <div className="flex min-w-[800px] items-center justify-between gap-4 px-4">
            {[
              { step: '1', title: 'Business Registration', desc: 'Create your enterprise profile' },
              { step: '2', title: 'Approval Identification', desc: 'System maps required licences' },
              { step: '3', title: 'Document Validation', desc: 'Pre-check submission readiness' },
              { step: '4', title: 'Application Tracking', desc: 'Monitor departmental progress' },
              { step: '5', title: 'Compliance', desc: 'Manage renewals and inspections' },
            ].map((item, index) => (
              <div key={item.step} className="relative flex flex-1 flex-col items-center text-center">
                {index < 4 && <div className="absolute left-[50%] top-6 hidden w-full border-t-2 border-dashed border-slate-300 sm:block" />}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 bg-[#123b6d] text-lg font-bold text-white shadow-sm">
                  {item.step}
                </div>
                <h4 className="mt-4 text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="mt-1 text-xs text-slate-500 max-w-[140px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row md:p-8 shadow-sm">
          <div>
            <p className="text-lg font-bold text-[#123b6d]">Access the Platform Prototype</p>
            <p className="mt-1 text-sm text-slate-600">Enter as an entrepreneur or government officer to view the system capabilities.</p>
          </div>
          <Link to="/login" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#ed8500] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#d87400]">
            Enter Portal <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </section>

    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <span className="font-semibold text-[#123b6d]">Maha-Pramaan <span className="font-normal text-slate-400">· Validate Before You Submit</span></span>
        <span>Smart India Hackathon prototype · Government of Maharashtra</span>
      </div>
    </footer>
  </main>;
}
