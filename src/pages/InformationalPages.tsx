import React, { useState } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Send,
  CheckCircle,
  HelpCircle,
  Ship,
  Plane,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, navigateTo } = useTrade();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Company Profile &amp; Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            About Catify Trade International
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Bridging international borders through verified industrial manufacturing, transparent wholesale trade terms, and friction-free cross-border customs logistics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">Our International Footprint</h2>
          <p>
            Founded to address the structural fragmentation in global cross-border wholesale procurement, <strong>CATIFY TRADE</strong> operates an integrated marketplace connecting certified manufacturing plants in Europe, Asia, and the Middle East with commercial importers across 160+ countries.
          </p>
          <p>
            Unlike traditional trading agents with opaque markups and unverified claims, we provide transparent multi-tiered pricing, escrow payment protection, direct SWIFT MT103 wire settlements, and full-spectrum customs clearance documentation.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="px-5 py-2.5 bg-blue-950 text-white text-xs font-bold rounded-xl hover:bg-blue-900"
            >
              Explore Commercial Catalog
            </button>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/Catify_Trade_Circular_Logo_df00bcb5.png"
              alt="Catify Trade Emblem"
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-contain rounded-full border border-amber-400/40"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">Catify Trade Operations</h3>
              <p className="text-xs text-slate-500">Contact: {settings.email}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Direct factory-to-port logistics management (FOB, CIF, DDP, EXW)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Multi-currency settlement support in USD, EUR, GBP, AED, PKR, CNY, JPY</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Audited partner mills and ISO 9001 certified precision manufacturers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { settings } = useTrade();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || message.trim().length < 10 || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('https://catifytrade-api.catifytrade.workers.dev/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactPerson: name.trim(), email: email.trim(), companyName: '',
          cargoDetails: [subject.trim(), message.trim()].filter(Boolean).join(' — '),
          serviceType: 'general_trade', phone: '', originCountry: '',
          destinationCountry: '', estimatedVolume: '', preferredIncoterm: '',
        }),
        signal: AbortSignal.timeout(15000),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Your message could not be submitted. Please retry.');
      setSent(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact Catify Trade Desk</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Send a message about products, wholesale sourcing or shipping requirements. For a direct conversation, use the WhatsApp or email links below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 w-fit">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Instant WhatsApp &amp; Phone</h3>
            <p className="text-xs text-slate-500">WhatsApp contact</p>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 block mt-1"
            >
              {settings.phone} (Click to Chat)
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900 w-fit">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Email Contact</h3>
            <p className="text-xs text-slate-500">For product and business inquiries</p>
            <a
              href={`mailto:${settings.email}`}
              className="text-xs font-bold text-blue-900 hover:underline block mt-1"
            >
              {settings.email}
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 w-fit">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Website</h3>
            <p className="text-xs text-slate-500">Current website address</p>
            <span className="text-xs font-mono font-bold text-slate-800 block mt-1 break-all">
              {settings.domain}
            </span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you, {name}. Your message has been saved with our inquiry records. No automated email reply has been sent.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {submitError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-rose-700">{submitError}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. elena@company.de"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject / Cargo Reference</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Ocean freight quotation to Port of Hamburg"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what product or service you need, estimated quantity and destination..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-950 disabled:opacity-60 hover:bg-blue-900 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSubmitting ? 'Sending…' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FAQsPage: React.FC = () => {
  const faqs = [
    {
      q: 'What are the Minimum Order Quantities (MOQs) on Catify Trade?',
      a: 'MOQs vary by commodity. Precision CNC and industrial machinery items start as low as 4-5 units, whereas agricultural salts and textile bolts have volume minimums (e.g. 20-50 units) for container freight efficiency. Sample units can also be ordered at standard retail rates.',
    },
    {
      q: 'Which international payment methods are supported?',
      a: 'We accept SWIFT MT103 international bank wire transfers (T/T), Irrevocable Letters of Credit (L/C at sight) for wholesale contracts over $5,000, international credit cards (Visa, MasterCard, American Express), and PayPal Business.',
    },
    {
      q: 'How are customs duties and import taxes calculated?',
      a: 'Duties depend on your destination country and the specific HS Code (Harmonized Tariff Schedule) of the product. Our platform provides estimated landed customs duty calculations at checkout based on current bilateral tariff schedules.',
    },
    {
      q: 'What shipping options do you offer for cross-border cargo?',
      a: 'We provide Priority Air Cargo Express (7-10 business days) via DHL/FedEx for urgent machinery parts and samples, as well as Ocean Freight LCL (Less-than-Container Load) and FCL (Full Container Load 20ft/40ft) via Tier-1 maritime carriers (Maersk, MSC, Hapag-Lloyd).',
    },
    {
      q: 'How does escrow protection safeguard international buyers?',
      a: 'Payments are held securely by Catify Trade until the goods pass pre-shipment quality inspection and the Bill of Lading (B/L) or Air Waybill is formally issued and verified against buyer specifications.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Frequently Asked Trade Questions</h1>
        <p className="text-xs sm:text-sm text-slate-500">Key guidelines regarding Incoterms, customs clearance, and wholesale purchasing</p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <h3 className="text-sm font-bold text-slate-900">{f.q}</h3>
            <p className="text-slate-600 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="space-y-5 text-xs text-slate-600 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">International Shipping &amp; Logistics Policy</h1>
        <p>
          Catify Trade coordinates international commercial freight in strict accordance with Incoterms 2020 rules published by the International Chamber of Commerce (ICC).
        </p>

        <h3 className="text-sm font-bold text-slate-900 pt-2">1. Maritime Freight (Ocean LCL / FCL)</h3>
        <p>
          Ocean consignments are routed through major international container terminals (e.g., Jebel Ali, Hamburg, Rotterdam, Los Angeles, Port Qasim). Cargo is packed on fumigated ISPM-15 wooden pallets with certified container stowage manifests. Typical transit times range from 18 to 32 days depending on oceanic routing.
        </p>

        <h3 className="text-sm font-bold text-slate-900 pt-2">2. Air Cargo Express Freight</h3>
        <p>
          Express shipments under 500kg are dispatched via commercial air freight carriers (DHL Global Forwarding, FedEx International). Transit time is typically 7 to 10 business days excluding unforeseen destination customs holds.
        </p>

        <h3 className="text-sm font-bold text-slate-900 pt-2">3. Import Customs &amp; Demurrage</h3>
        <p>
          Unless Delivered Duty Paid (DDP) is explicitly contracted, the consignee is responsible for destination customs clearance, local port wharfage, and customs duty payments upon arrival.
        </p>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="space-y-5 text-xs text-slate-600 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Commercial Return &amp; Refund Policy</h1>
        <p>
          International trade contracts are protected by our pre-shipment quality verification guarantee and marine cargo insurance protocols.
        </p>

        <h3 className="text-sm font-bold text-slate-900 pt-2">1. Inspection Period upon Port Discharge</h3>
        <p>
          Consignees have seven (7) business days from destination customs clearance to inspect the cargo and report any dimensional variance, structural damage, or non-conformance exceeding technical specifications.
        </p>

        <h3 className="text-sm font-bold text-slate-900 pt-2">2. Non-Conforming Cargo Resolution</h3>
        <p>
          In the event of verified transit damage or specification discrepancy confirmed by an independent surveyor, Catify Trade issues a direct replacement consignment or a financial credit note / wire refund to the buyer&apos;s originating account.
        </p>
      </div>
    </div>
  );
};

export const TermsPrivacyPage: React.FC<{ type: 'terms' | 'privacy' }> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="space-y-5 text-xs text-slate-600 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {type === 'terms' ? 'Terms of International Sale' : 'Global Privacy & GDPR Compliance'}
        </h1>
        <p>
          {type === 'terms'
            ? 'These terms govern all commercial transactions, requests for quotation, and proforma orders executed through the Catify Trade international trading platform.'
            : 'Catify Trade is committed to safeguarding corporate identity and consignee data in compliance with international privacy standards including GDPR and cross-border trade transmission laws.'}
        </p>
        <p>
          For legal inquiries, contact our compliance desk at <strong>tardecatify@gmail.com</strong> or WhatsApp <strong>+92 324 7615133</strong>.
        </p>
      </div>
    </div>
  );
};
