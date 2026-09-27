import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, X, Send, Bot, User, ExternalLink, Sparkles,
  ChevronRight, RefreshCw, Utensils, Factory, Store, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
  actions?: { label: string; to: string }[];
}

const PREDEFINED_QUESTIONS = [
  'I\'m opening a restaurant — what do I need?',
  'How do I get a GSTIN number?',
  'What licences are needed for a factory?',
  'Which approvals are still pending?',
  'What documents are missing?',
  'Which renewals are due soon?',
  'What schemes may apply to my business?',
];



const RESPONSES: Record<string, { text: string; sources: string[]; actions?: { label: string; to: string }[] }> = {
  "i'm opening a restaurant — what do i need?": {
    text: `Great! For a restaurant in Maharashtra, you'll need these key approvals:\n\n🍽️ **FSSAI Food Licence** (Food Safety & Standards Authority)\n— Required before you start serving food. Apply online at FoSCoS portal.\n— Documents: PAN, GST, premises layout, food safety management plan.\n— SLA: 30 working days · Fee: ₹2,000–₹7,500 depending on turnover.\n\n🏢 **Trade Licence** (Local Municipal Authority)\n— Required to operate any commercial business. Apply at your local Municipal Corporation.\n— Documents: PAN, property documents, NOC from owner.\n— SLA: 7 working days.\n\n🔥 **Fire Safety NOC** (Fire Department)\n— Mandatory if seating capacity > 50 persons or you have LPG cylinder use.\n— Documents: Building layout, fire extinguisher details, exit plan.\n— SLA: 10 working days.\n\n📋 **GST Registration** (if annual turnover > ₹20 Lakh)\n— Required for tax compliance.\n— Documents: PAN, Aadhaar, bank account details, business address proof.\n— SLA: 3 working days. Apply at gst.gov.in\n\n⚡ **MSEB Power Connection**\n— Apply for commercial power connection at your local MSEB office.\n\n💡 **Tip:** Start with FSSAI and Trade Licence simultaneously — they don't depend on each other!`,
    sources: ['FSSAI FoSCoS Portal', 'Municipal Authority Guidelines', 'Maharashtra Fire Services Act'],
    actions: [
      { label: 'View Approval Roadmap', to: '/roadmap' },
      { label: 'Apply for FSSAI Licence', to: '/applications' },
    ]
  },
  'how do i get a gstin number?': {
    text: `Here's a step-by-step guide to getting your GST Registration Number (GSTIN) in Maharashtra:\n\n**Step 1 — Check Eligibility**\nYou need GST registration if:\n• Annual turnover > ₹20 Lakh (₹10 Lakh for special category states)\n• You supply goods/services across state borders\n• You run an e-commerce business\n\n**Step 2 — Gather Required Documents**\n📄 PAN Card of business/proprietor\n📄 Aadhaar Card of authorized signatory\n📄 Proof of business address (electricity bill, rent agreement)\n📄 Bank account statement (cancelled cheque or bank statement)\n📄 Photograph of authorized signatory\n📄 Certificate of Incorporation (for companies)\n\n**Step 3 — Apply Online at gst.gov.in**\n1. Go to gst.gov.in → Services → Registration → New Registration\n2. Fill Part A (Basic info) → Get OTP verified\n3. Fill Part B (Detailed info + upload documents)\n4. Submit and get Application Reference Number (ARN)\n5. GSTIN issued within **3 working days** after verification\n\n**For Maharashtra:** Your GSTIN will start with **27** (Maharashtra state code)\n\n⚠️ Once registered, you must file GST returns monthly/quarterly even if no business was done.`,
    sources: ['GST Portal (gst.gov.in)', 'CGST Act 2017', 'Maharashtra State GST Rules'],
    actions: [
      { label: 'View Documents Vault', to: '/documents' },
    ]
  },
  'what licences are needed for a factory?': {
    text: `For a manufacturing factory in Maharashtra, here are the mandatory licences:\n\n🏭 **Factory Registration** (Directorate of Industrial Safety & Health - DISH)\n— Mandatory under Factories Act 1948 if you have 10+ workers with power or 20+ without.\n— Documents: Site plan, machinery list, building stability certificate.\n— SLA: 20 working days.\n\n☁️ **Pollution Consent (CTE/CTO)** (MPCB)\n— Consent to Establish + Consent to Operate from Maharashtra Pollution Control Board.\n— Mandatory for any manufacturing with environmental impact.\n— SLA: 15 working days.\n\n🔥 **Fire Safety NOC** (Fire Department)\n— Required for all factories.\n— SLA: 10 working days.\n\n📋 **MSME / Udyam Registration** (MSME-DI)\n— Not mandatory but gives access to government schemes and priority benefits.\n— Instant registration online at udyamregistration.gov.in\n\n⚡ **Power Connection (HT/LT)** (MSEB/Mahavitaran)\n— Apply after plot allotment. For heavy manufacturing, you may need HT connection.\n\n💧 **Water Connection** (MIDC / Water Resources Dept)\n— If your factory needs industrial water supply.\n\n🏗️ **MIDC Plot Allotment**\n— If setting up in MIDC area, allotment letter is the first step.\n\n**Critical Path:** MIDC Allotment → Power + Water → Pollution Consent → Factory Registration → Labour Registration`,
    sources: ['Factories Act 1948', 'MPCB Guidelines', 'Maharashtra DISH', 'MIDC'],
    actions: [
      { label: 'View Your Roadmap', to: '/roadmap' },
      { label: 'Apply for Factory Registration', to: '/applications' },
    ]
  },
  'which approvals are still pending?': {
    text: 'Based on your approval roadmap, you have **4 pending approvals**:\n\n1. **Pollution Consent (CTE/CTO)** — Under review at MPCB (65% progress). A department query is pending — machinery specs and water consumption declaration required. Response deadline: 27 Sep 2026.\n2. **Fire Safety NOC** — In progress at Fire Dept (40%). Under technical review.\n3. **Factory Registration** — Not started (DISH). Blocked until Pollution Consent and Fire NOC are completed.\n4. **Water Connection Approval** — In progress at WRD (30%). Under initial verification.\n\n**Parallel opportunities:** Fire Safety NOC and FSSAI Licence can be pursued simultaneously with Pollution Consent.',
    sources: ['Approval Roadmap', 'Application Status Tracker'],
    actions: [
      { label: 'View Full Roadmap', to: '/roadmap' },
      { label: 'Go to Applications', to: '/applications' },
    ]
  },
  'what documents are missing?': {
    text: 'You currently have **2 missing documents** in your vault:\n\n1. **Machinery Details & Specifications** — Required for Pollution Consent (MPCB) application. A department query has been raised specifically for this document. Upload it ASAP as the deadline is 27 Sep 2026.\n\n2. **Water Consumption Declaration** — Required for Pollution Consent (MPCB) and Water Connection (WRD) applications. A formal water balance statement showing daily intake, process consumption, and effluent disposal is needed.\n\nUploading these 2 documents would resolve the active department query and unblock your MPCB application.',
    sources: ['Document Vault', 'Pre-validation Report', 'Application MH-PC-2026-01842'],
    actions: [
      { label: 'Open Document Vault', to: '/documents' },
      { label: 'Validate Documents', to: '/prevalidation' },
    ]
  },
  'which renewals are due soon?': {
    text: 'You have **3 upcoming renewals** requiring attention:\n\n⚠️ **Pollution Consent (CTO)** — Due in 18 days (13 Oct 2026)\nRenewal period: 5 years. Start renewal process now as MPCB site inspection may be required.\n\n⚠️ **Factory Licence (DISH)** — Due in 18 days (13 Oct 2026)\nAnnual renewal. Ensure all employee health records and safety compliance documents are updated.\n\n📅 **Fire Safety NOC** — Due in 64 days (28 Nov 2026)\nAnnual renewal. Fire equipment maintenance certificate will be required.\n\nRecommendation: File for Pollution Consent and Factory Licence renewals this week.',
    sources: ['Compliance Calendar', 'Renewal Tracker'],
    actions: [
      { label: 'View Compliance Calendar', to: '/compliance' },
    ]
  },
  'what schemes may apply to my business?': {
    text: 'Based on your business profile (Food Processing, MSME, Maharashtra, ₹2.4 Cr investment), **3 schemes** have been matched:\n\n1. **Package Scheme of Incentives (PSI) 2024** — 91% match\nBenefit: Up to 40% of fixed capital investment as capital subsidy + stamp duty exemption.\nWho: New manufacturing units in Maharashtra eligible MIDC zones.\nHow to apply: Through Directorate of Industries, Maharashtra.\n\n2. **PMFME Scheme** — 85% match\nBenefit: 35% capital subsidy (max ₹10 Lakh) for food processing expansion.\nWho: Micro food enterprises. Must be MSME registered.\nHow to apply: Through District Nodal Agency (State Dept of Food Processing).\n\n3. **CLCSS (Credit Linked Capital Subsidy)** — 78% match\nBenefit: 15% capital subsidy on plant & machinery (max ₹15 Lakh).\nWho: MSME units upgrading technology.\nHow to apply: Through your bank (SBI, PNB, etc.) linked to MSME portal.\n\n⚠️ Final eligibility must be confirmed with the respective department.',
    sources: ['Business Profile', 'Scheme Matching Engine', 'Maharashtra Directorate of Industries'],
    actions: [
      { label: 'Browse All Schemes', to: '/schemes' },
    ]
  },
};

function getResponse(text: string) {
  const key = text.trim().toLowerCase();
  return RESPONSES[key] || {
    text: `I understand you're asking about "${text}". Here's what I can tell you based on your Aarambh Foods profile:\n\n• Your business has 12 tracked approvals with 72% overall progress\n• 4 approvals are pending, 3 are in progress\n• 2 documents are missing from your vault\n• 3 renewals are due within the next 90 days\n\nFor specific guidance on "${text}", you can check the Approval Roadmap or use the search feature. If you need department-specific help, contact the MAITRI Helpdesk at 1800-123-4567.`,
    sources: ['Business Profile', 'Application Dashboard'],
    actions: [],
  };
}

const BUSINESS_TYPE_QUESTIONS = [
  { icon: Utensils, label: 'Opening a restaurant', query: "I'm opening a restaurant — what do I need?" },
  { icon: Factory, label: 'Setting up a factory', query: 'What licences are needed for a factory?' },
  { icon: Store, label: 'Starting a shop', query: 'What licences are needed for a shop or retail store?' },
  { icon: Building2, label: 'Getting GSTIN', query: 'How do I get a GSTIN number?' },
];

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: 'Hello! I\'m **Regula**, your Maharashtra regulatory guide. I can help you understand what approvals your business needs, track applications, find government schemes, and guide you through specific processes.\n\nTry asking me something specific — like "I\'m opening a restaurant, what do I need?" or "How do I get a GSTIN?"',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: messages.length, role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const responseData = getResponse(text);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: messages.length + 1,
        role: 'assistant',
        text: responseData.text,
        sources: responseData.sources,
        actions: responseData.actions,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setTyping(false);
    }, 900);
  };

  const handleReset = () => {
    setMessages([{
      id: 0, role: 'assistant',
      text: 'Hello! I\'m **Regula**, your Maharashtra regulatory guide. Ask me anything about approvals, licences, documents, or government schemes.',
    }]);
    setInput('');
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="assistant-bubble">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        id="regula-assistant-btn"
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#123b6d] to-[#1a5ca0] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all relative"
        onClick={() => setOpen(!open)}
        title="Regula — AI Regulatory Assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
            <Sparkles size={9} className="text-amber-900" />
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="assistant-panel"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-[#123b6d] to-[#1a5ca0] text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Regula AI Assistant</p>
                    <p className="text-[10px] text-blue-200">Maharashtra Regulatory Guide</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-blue-200 hover:text-white transition-colors"
                  title="Start new conversation"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Business type quick-start (show only on first message) */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Quick Start — What are you doing?</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {BUSINESS_TYPE_QUESTIONS.map(q => (
                    <button
                      key={q.label}
                      onClick={() => handleSend(q.query)}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                      <q.icon size={14} className="text-slate-400 group-hover:text-blue-500 shrink-0" />
                      <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[340px]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#123b6d] to-[#1a5ca0] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={11} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-[#123b6d] text-white rounded-2xl rounded-br-sm px-3 py-2'
                      : 'bg-slate-100 text-slate-700 rounded-2xl rounded-bl-sm px-3 py-2'
                  }`}>
                    <p
                      className="text-xs leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                    />
                    {msg.sources && (
                      <div className="mt-2 pt-2 border-t border-slate-200/50">
                        <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                          <ExternalLink size={10} /> Sources
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {msg.sources.map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 bg-white/60 rounded text-slate-500">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.actions.map(a => (
                          <button
                            key={a.label}
                            onClick={() => { navigate(a.to); setOpen(false); }}
                            className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 bg-[#123b6d] text-white rounded-lg hover:bg-[#0f2f58] transition-colors"
                          >
                            {a.label} <ChevronRight size={10} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={11} className="text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#123b6d] to-[#1a5ca0] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={11} className="text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-3 py-2">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {PREDEFINED_QUESTIONS.slice(0, 5).map(q => (
                  <button
                    key={q}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-[#123b6d] hover:text-white whitespace-nowrap shrink-0 transition-colors font-medium"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100 bg-white rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 text-xs outline-none text-slate-700 placeholder:text-slate-400 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus:border-blue-300"
                  placeholder="Ask about approvals, licences, schemes..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                />
                <button
                  className="w-8 h-8 rounded-lg bg-[#123b6d] text-white flex items-center justify-center hover:bg-[#0f2f58] transition-colors disabled:opacity-50"
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
