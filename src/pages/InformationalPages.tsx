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
            A product discovery and inquiry platform designed to help buyers explore sample listings and discuss wholesale sourcing requirements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">Our Purpose</h2>
          <p>
            <strong>CATIFY TRADE</strong> provides an online catalogue and a simple way for buyers to share product, quantity and destination requirements. The current catalogue is a demonstration catalogue; supplier relationships and live stock are not yet independently verified.
          </p>
          <p>
            We aim to make product discovery and quotation requests straightforward. Final supplier identity, product specifications, stock, shipping costs, payment terms and any required certificates must be confirmed in writing before an order or payment.
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
              <span>Sourcing and wholesale inquiries</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Product and destination requirement review</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Supplier credentials are checked before any claim of verification</span>
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
      a: 'The catalogue shows indicative minimum order quantities for sample listings. The actual MOQ depends on the product, supplier, customization and destination, and is confirmed in the written quotation.',
    },
    {
      q: 'Which international payment methods are supported?',
      a: 'No online payment gateway or escrow service is currently enabled on this website. Do not send money using bank details or payment instructions from an unverified message. Payment terms must be agreed and independently verified before any transaction.',
    },
    {
      q: 'How are customs duties and import taxes calculated?',
      a: 'Import duties and taxes depend on the destination-country regulations, product classification and declared value. This website does not provide live customs calculations; confirm charges with the relevant customs authority or a licensed broker.',
    },
    {
      q: 'What shipping options do you offer for cross-border cargo?',
      a: 'Air freight, courier and sea freight may be options depending on the product, route and shipment size. Carrier availability, transit estimates and costs are not guaranteed and must be confirmed in a written shipping quotation.',
    },
    {
      q: 'How does escrow protection safeguard international buyers?',
      a: 'Catify Trade does not currently provide escrow or hold buyer funds. Buyers should use a payment method with appropriate protections and independently verify the supplier, contract, beneficiary and shipping documents before payment.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Frequently Asked Trade Questions</h1>
        <p className="text-xs sm:text-sm text-slate-500">Practical information about product enquiries, shipping estimates and trade terms</p>
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
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Shipping &amp; Logistics Information</h1>
        <p>Shipping is arranged only after the product, supplier, destination, quantity and delivery terms have been reviewed. The website does not currently issue carrier bookings or live freight quotes automatically.</p>
        <h3 className="text-sm font-bold text-slate-900 pt-2">1. Available shipping methods</h3>
        <p>Depending on the route and shipment size, a quotation may consider courier, air freight, sea freight (LCL) or full-container freight (FCL). Availability must be confirmed for each request.</p>
        <h3 className="text-sm font-bold text-slate-900 pt-2">2. Costs and delivery estimates</h3>
        <p>Freight charges, insurance, handling fees and transit times vary by carrier, route, package dimensions, weight, season and customs processing. Any estimate is indicative until confirmed in writing by the responsible carrier or logistics provider.</p>
        <h3 className="text-sm font-bold text-slate-900 pt-2">3. Customs and import responsibilities</h3>
        <p>Import duties, VAT, permits and clearance requirements are determined by the destination country. Unless a signed agreement expressly states otherwise, buyers should confirm local import requirements and charges with their customs authority or licensed customs broker.</p>
        <h3 className="text-sm font-bold text-slate-900 pt-2">4. Quality checks and documentation</h3>
        <p>Inspection scope, samples, product certificates, packaging standards and export documents must be agreed before an order is placed. No inspection, certification or shipping service should be assumed unless it is explicitly confirmed in writing.</p>
        <h3 className="text-sm font-bold text-slate-900 pt-2">5. Request a shipping estimate</h3>
        <p>Use the quotation form and include the product, quantity, destination city or port, preferred Incoterm and any special handling requirements.</p>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="space-y-5 text-xs text-slate-600 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Order, Cancellation &amp; Refund Information</h1>
        <p>No online payments or completed purchases are currently processed through this website. Product listings and displayed prices are samples for enquiry purposes only.</p>
        <h3 className="text-sm font-bold text-slate-900 pt-2">1. Before placing an order</h3>
        <p>Confirm the supplier identity, product specification, quantity, total price, shipping charges, duties, delivery terms and payment beneficiary independently. Do not pay based only on a website listing or an unverified message.</p>
        <h3 className="text-sm font-bold text-slate-900 pt-2">2. Cancellation and refunds</h3>
        <p>If a future transaction is agreed, its cancellation, inspection, return and refund terms must be written into the signed order or sales contract before payment. This website does not currently provide escrow, insurance or guaranteed refunds.</p>
        <h3 className="text-sm font-bold text-slate-900 pt-2">3. Questions</h3>
        <p>For a product enquiry, use the quotation form or contact details shown on the Contact page.</p>
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
