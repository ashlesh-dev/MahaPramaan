import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronRight, ClipboardCheck, Factory, FileCheck2, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Registration = { name: string; sector: string; location: string; investment: string; employees: string; premises: string; capacity: string; power: string; water: string; stage: string };
const initial: Registration = { name: 'Sahyadri Harvest Foods', sector: 'Food processing — fruit & vegetable dehydration', location: 'Sinnar MIDC, Nashik, Maharashtra', investment: '₹3.2 crore', employees: '42', premises: 'Leased industrial plot · 1,800 sq. m · 1,150 sq. m built-up', capacity: '8 tonnes of fresh produce per day', power: '320 kW', water: '65,000 litres per day', stage: 'New manufacturing unit' };
const journey = [
  { dept: 'Maharashtra Pollution Control Board', name: 'Consent to Establish', tag: 'Environment', detail: 'Required before construction or installation of plant and machinery.', docs: 'Project report · Process flow · Water balance · Site plan' },
  { dept: 'Food Safety and Standards Authority of India', name: 'Food business licence', tag: 'Food safety', detail: 'Licence category depends on turnover, installed capacity and business activity.', docs: 'Premises proof · Layout · Food safety management plan' },
  { dept: 'Directorate of Industrial Safety and Health', name: 'Factory plan approval & licence', tag: 'Factory', detail: 'Applicability depends on worker count, power use and manufacturing process.', docs: 'Building plans · Machinery layout · Occupier details' },
  { dept: 'Maharashtra Fire & Emergency Services', name: 'Fire safety review / NOC', tag: 'Safety', detail: 'Facility plans and fire protection provisions may need review.', docs: 'Building plans · Fire system plan · Access details' },
  { dept: 'Maharashtra Industrial Development Corporation', name: 'Industrial premises & utilities', tag: 'Premises', detail: 'Confirm plot lease conditions, water allocation and power connection.', docs: 'Lease / allotment letter · Load estimate · Water demand' },
];
const fields: { key: keyof Registration; label: string; hint?: string; options?: string[] }[] = [
  { key: 'name', label: 'Business name' }, { key: 'sector', label: 'Industry / sector' }, { key: 'location', label: 'Business location', hint: 'District, industrial area or village' },
  { key: 'investment', label: 'Planned investment' }, { key: 'employees', label: 'Expected employees' }, { key: 'premises', label: 'Land / premises' },
  { key: 'capacity', label: 'Production capacity' }, { key: 'power', label: 'Power requirement' }, { key: 'water', label: 'Water requirement' },
  { key: 'stage', label: 'Business stage', options: ['New manufacturing unit', 'Construction in progress', 'Ready to commence production', 'Existing unit — expansion'] },
];

export default function RegistrationPage() {
  const [form, setForm] = useState(initial); const [submitted, setSubmitted] = useState(false); const navigate = useNavigate();
  const update = (key: keyof Registration, value: string) => setForm(current => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl space-y-6 pb-10">
    <div className="rounded-2xl bg-[#123b6d] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="relative p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div><div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-blue-100 mb-3"><Factory size={15}/> Entrepreneur onboarding</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{submitted ? 'Your approval journey is mapped' : 'Start with your business'}</h1>
          <p className="text-sm text-blue-100 mt-2 max-w-2xl">One business profile. A clear view of approvals, documents, inspections and support for your Maharashtra industrial unit.</p></div>
        <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm shrink-0"><ShieldCheck size={19} className="text-emerald-300"/><span>Guided · Informed · Trackable</span></div>
      </div>
    </div>

    {!submitted ? <form onSubmit={submit} className="grid lg:grid-cols-[1fr_290px] gap-5">
      <section className="surface-card p-5 md:p-7">
        <div className="flex items-start justify-between mb-6"><div><h2 className="text-lg font-semibold text-slate-900">Business profile</h2><p className="text-sm text-slate-500 mt-1">A realistic food-processing demo is prefilled. Edit any field for your presentation.</p></div><span className="text-xs rounded-full bg-amber-50 text-amber-800 px-3 py-1.5 font-medium">Demo profile</span></div>
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">{fields.map(field => <label key={field.key} className={field.key === 'premises' || field.key === 'location' || field.key === 'sector' ? 'sm:col-span-2' : ''}><span className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</span>{field.options ? <select value={form[field.key]} onChange={e => update(field.key, e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">{field.options.map(option => <option key={option}>{option}</option>)}</select> : <input required value={form[field.key]} onChange={e => update(field.key, e.target.value)} placeholder={field.hint} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm" />}</label>)}</div>
        <div className="mt-7 flex justify-end"><button type="submit" className="btn-primary px-5 py-3">Create my approval journey <ArrowRight size={16}/></button></div>
      </section>
      <aside className="surface-card p-5 h-fit"><p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Your details shape</p><div className="mt-4 space-y-4">{[{icon: ClipboardCheck, title: 'Applicable approvals', sub: 'Matched to your activity & scale'},{icon: FileCheck2, title: 'Document checklist', sub: 'Know what to prepare in advance'},{icon: MapPin, title: 'Local requirements', sub: 'Location-aware department routing'}].map(({icon: Icon,title,sub})=><div key={title} className="flex gap-3"><span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-800 shrink-0"><Icon size={18}/></span><div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="text-xs text-slate-500 mt-0.5">{sub}</p></div></div>)}</div><p className="border-t mt-5 pt-4 text-xs text-slate-500 leading-relaxed">This prototype provides indicative guidance. The relevant department confirms applicability and current requirements.</p></aside>
    </form> : <>
      <div className="surface-card p-5 md:p-6 flex flex-col md:flex-row gap-5 md:items-center justify-between"><div><div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold"><span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"><Check size={15}/></span> Profile captured</div><h2 className="text-xl font-bold text-slate-900 mt-2">{form.name}</h2><p className="text-sm text-slate-500 mt-1">{form.sector} · {form.location}</p></div><div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm"><div><span className="text-slate-500">Investment </span><strong>{form.investment}</strong></div><div><span className="text-slate-500">Jobs </span><strong>{form.employees}</strong></div><div><span className="text-slate-500">Power </span><strong>{form.power}</strong></div><div><span className="text-slate-500">Stage </span><strong>{form.stage}</strong></div></div></div>
      <div className="flex items-end justify-between"><div><div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wider"><Sparkles size={15}/> Based on your business profile</div><h2 className="text-xl font-bold text-slate-900 mt-1">A first view of your approval journey</h2></div><span className="hidden sm:inline-flex rounded-full bg-blue-50 text-blue-900 px-3 py-1.5 text-xs font-medium">5 indicative workstreams</span></div>
      <div className="grid md:grid-cols-2 gap-4">{journey.map((item,index)=><article key={item.name} className="surface-card p-5"><div className="flex justify-between items-start gap-3"><div className="flex gap-3"><span className="w-9 h-9 rounded-xl bg-[#edf3fa] text-[#123b6d] flex items-center justify-center text-sm font-bold shrink-0">0{index+1}</span><div><span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{item.dept}</span><h3 className="font-semibold text-slate-900 mt-0.5">{item.name}</h3></div></div><span className="text-[10px] rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{item.tag}</span></div><p className="text-sm text-slate-600 mt-4">{item.detail}</p><p className="text-xs text-slate-500 border-t border-slate-100 mt-4 pt-3"><strong className="text-slate-700">Prepare:</strong> {item.docs}</p></article>)}</div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">Indicative prototype journey for demonstration. Approval applicability, document lists and sequence must be confirmed by the concerned departments and applicable rules.</div>
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => navigate('/prevalidation')} className="btn-primary px-5 py-3">Try document pre-validation <ChevronRight size={16}/></button><button type="button" onClick={() => setSubmitted(false)} className="px-5 py-3 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700">Edit business profile</button><button type="button" onClick={() => navigate('/roadmap')} className="px-5 py-3 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700">Explore existing roadmap</button></div>
    </>}
  </motion.div>;
}
