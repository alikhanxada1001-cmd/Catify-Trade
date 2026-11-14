import React, { useState } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Ship,
  Phone,
  Send,
  ArrowRight,
  Globe,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { Incoterm } from '../types';

export const RequestQuotePage: React.FC = () => {
  const { countries, categories, currentCountry, submitRFQ, settings, navigateTo } = useTrade();

  const [productTitle, setProductTitle] = useState('');
  const [category, setCategory] = useState('Jackets & Outerwear');
  const [quantity, setQuantity] = useState<number>(200);
  const [targetPriceUSD, setTargetPriceUSD] = useState<number>(45);
  const [destinationCountry, setDestinationCountry] = useState(currentCountry.name);
  const [destinationPort, setDestinationPort] = useState('');
  const [incoterm, setIncoterm] = useState<Incoterm>('CIF');
  const [specifications, setSpecifications] = useState('');
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([
    'ISO 9001:2015',
    'Certificate of Origin',
  ]);
  const [buyerName, setBuyerName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [submittedRFQNumber, setSubmittedRFQNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCertifications = [
    'ISO 9001:2015',
    'CE Certified',
    'FDA Registered',
    'GOTS Organic',
    'Halal Certified',
    'Kosher Certified',
    'Certificate of Origin',
    'Phytosanitary Certificate',
    'RoHS Compliant',
  ];

  const toggleCertification = (cert: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitle.trim() || !buyerEmail.trim() || !buyerName.trim() || isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const rfq = await submitRFQ({
        productTitle: productTitle.trim(),
        category,
        quantity: Number(quantity),
        targetPriceUSD: Number(targetPriceUSD),
        destinationCountry,
        destinationPort: destinationPort || 'To be confirmed',
        incoterm,
        requiredCertifications: selectedCertifications,
        specifications,
        buyerName: buyerName.trim(),
        buyerCompany: buyerCompany.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerPhone: buyerPhone.trim(),
      });
      setSubmittedRFQNumber(rfq.rfqNumber);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your request. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Commercial B2B Sourcing Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Request an International Trade Quotation (RFQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Share your product requirements, order quantity, destination and preferred Incoterm. Your request is securely recorded so the team can review the details and respond.
          </p>
        </div>
      </div>

      {/* Main RFQ Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
        {submittedRFQNumber ? (
          <div className="py-12 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">RFQ Successfully Logged!</h2>
              <p className="text-sm font-mono font-bold text-blue-950 mt-1">
                Quotation Reference: {submittedRFQNumber}
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Your quotation request has been saved with reference <strong>{submittedRFQNumber}</strong>. Please keep this reference when contacting the team. We have not sent an automated email confirmation.
              </p>
            </div>

            {/* WhatsApp Box */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Expedite via Direct WhatsApp Trade Desk</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Want immediate factory capacity verification or air express rates? Message our officer referencing #{submittedRFQNumber}.
              </p>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Catify%20Trade,%20I%20have%20submitted%20RFQ%20reference%20${submittedRFQNumber}.%20Please%20review.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Chat on WhatsApp: {settings.phone}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSubmittedRFQNumber(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Submit Another RFQ
              </button>
              <button
                onClick={() => navigateTo('shop')}
                className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-lg"
              >
                Return to Product Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitError}</div>}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">1. Product &amp; Volume Parameters</h3>
              <p className="text-xs text-slate-500 mb-4">Specify the goods, desired quantity, and target purchase price</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Commodity / Product Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="e.g. 100% GOTS Combed Cotton Fabric Rolls"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                    <option value="Other / Custom Sourcing">Other / Custom Sourcing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Order Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Price (USD / unit)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={targetPriceUSD}
                    onChange={(e) => setTargetPriceUSD(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incoterms 2020</label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value as Incoterm)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white font-medium"
                  >
                    <option value="CIF">CIF (Cost, Insurance &amp; Freight)</option>
                    <option value="FOB">FOB (Free On Board Port)</option>
                    <option value="DDP">DDP (Delivered Duty Paid)</option>
                    <option value="EXW">EXW (Ex Works Factory)</option>
                    <option value="CFR">CFR (Cost and Freight)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Destination & Port */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-1">2. Logistics &amp; Port of Destination</h3>
              <p className="text-xs text-slate-500 mb-4">Tell us where the consignment will be cleared and discharged</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Country</label>
                  <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Port of Discharge or International Airport
                  </label>
                  <input
                    type="text"
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    placeholder="e.g. Port of Rotterdam / Hamburg / Jebel Ali"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
            </div>

            {/* Certifications & Specs */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-1">3. Compliance &amp; Technical Requirements</h3>
              <p className="text-xs text-slate-500 mb-3">Select the certifications your customs authorities require</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {availableCertifications.map((cert) => {
                  const isSelected = selectedCertifications.includes(cert);
                  return (
                    <button
                      type="button"
                      key={cert}
                      onClick={() => toggleCertification(cert)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-blue-950 text-white border-blue-950 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cert}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Specifications, Custom Labeling or Tolerances
                </label>
                <textarea
                  rows={3}
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="Detail chemical composition, dimensions, packaging (shrink wrap, drums, jumbo bags), or OEM branding..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Buyer Contact */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-1">4. Buyer / Consignee Information</h3>
              <p className="text-xs text-slate-500 mb-4">Official contact details for proforma quotation delivery</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Johnathan Miller"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Importer / Enterprise Name</label>
                  <input
                    type="text"
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    placeholder="e.g. Global Trade Logistics Corp"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="procurement@globalcorp.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp with Country Code</label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted trade submission · Non-disclosure guaranteed</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Formal RFQ Dossier</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
