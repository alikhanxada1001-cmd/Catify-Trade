import React, { useState, useEffect } from 'react';
import { useTrade } from '../../context/TradeContext';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  Ship,
  ShieldCheck,
  Send,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Incoterm } from '../../types';

export const RFQModal: React.FC = () => {
  const {
    isRFQModalOpen,
    closeRFQModal,
    rfqModalProduct,
    submitRFQ,
    countries,
    currentCountry,
    settings,
  } = useTrade();

  const [productTitle, setProductTitle] = useState('');
  const [category, setCategory] = useState('Industrial Machinery & Precision Tools');
  const [quantity, setQuantity] = useState<number>(100);
  const [targetPriceUSD, setTargetPriceUSD] = useState<number>(50);
  const [destinationCountry, setDestinationCountry] = useState(currentCountry.name);
  const [destinationPort, setDestinationPort] = useState('');
  const [incoterm, setIncoterm] = useState<Incoterm>('CIF');
  const [specifications, setSpecifications] = useState('');
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>(['ISO 9001:2015', 'Certificate of Origin']);
  const [buyerName, setBuyerName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [submittedRFQNumber, setSubmittedRFQNumber] = useState<string | null>(null);

  useEffect(() => {
    if (rfqModalProduct) {
      setProductTitle(rfqModalProduct.title);
      setCategory(rfqModalProduct.category);
      setQuantity(rfqModalProduct.moq || 50);
      setTargetPriceUSD(rfqModalProduct.wholesalePriceUSD || 50);
      setSpecifications(`Inquiry regarding SKU: ${rfqModalProduct.sku} (HS Code: ${rfqModalProduct.hsCode}). Seeking volume wholesale quotation.`);
    } else {
      setProductTitle('');
      setQuantity(500);
      setTargetPriceUSD(25);
      setSpecifications('');
    }
    setSubmittedRFQNumber(null);
  }, [rfqModalProduct, isRFQModalOpen]);

  if (!isRFQModalOpen) return null;

  const availableCertifications = [
    'ISO 9001:2015',
    'CE Certified',
    'FDA Registered',
    'GOTS Organic',
    'Halal Certified',
    'Certificate of Origin',
    'Phytosanitary Certificate',
  ];

  const toggleCertification = (cert: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitle || !buyerEmail || !buyerName) return;

    const newRFQ = submitRFQ({
      productId: rfqModalProduct?.id,
      productTitle,
      category,
      quantity: Number(quantity),
      targetPriceUSD: Number(targetPriceUSD),
      destinationCountry,
      destinationPort: destinationPort || 'Major Regional Port',
      incoterm,
      requiredCertifications: selectedCertifications,
      specifications,
      buyerName,
      buyerCompany: buyerCompany || 'Independent Importer',
      buyerEmail,
      buyerPhone,
    });

    setSubmittedRFQNumber(newRFQ.rfqNumber);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 max-h-[92dvh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-blue-950 to-blue-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-amber-400 text-slate-950 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate">Request for Quotation (RFQ)</h3>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate">Direct factory bulk sourcing &amp; customized international freight quotation</p>
            </div>
          </div>
          <button
            onClick={closeRFQModal}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {submittedRFQNumber ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Quotation Request Dispatched!</h4>
                <p className="text-sm font-mono font-semibold text-blue-950 mt-1">Reference: {submittedRFQNumber}</p>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Your RFQ has been routed to our international trade desk and partner factories. Our commercial trade officer will issue your proforma quote within 12–24 business hours to <strong>{buyerEmail}</strong>.
                </p>
              </div>

              {/* Direct WhatsApp Follow-up */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Expedite via Instant WhatsApp Trade Desk</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Need priority customs calculation or factory capacity confirmation today? Message our trade desk with your reference number.
                </p>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Catify%20Trade,%20I%20just%20submitted%20RFQ%20reference%20${submittedRFQNumber}.%20Please%20review.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <span>Chat on WhatsApp: {settings.phone}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={closeRFQModal}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product Title / Commodity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="e.g. Pure Himalayan Pink Rock Salt Coarse"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trade Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    <option value="Industrial Machinery & Precision Tools">Industrial Machinery &amp; Precision Tools</option>
                    <option value="Electronics & Smart IoT Systems">Electronics &amp; Smart IoT Systems</option>
                    <option value="Textiles, Garments & Raw Cotton">Textiles, Garments &amp; Raw Cotton</option>
                    <option value="Specialty Minerals & Commodities">Specialty Minerals &amp; Commodities</option>
                    <option value="Maritime & Logistics Equipment">Maritime &amp; Logistics Equipment</option>
                    <option value="Custom OEM Manufacturing">Custom OEM Manufacturing</option>
                  </select>
                </div>
              </div>

              {/* Quantity, Target Price, Incoterm */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                    <option value="FOB">FOB (Free On Board)</option>
                    <option value="DDP">DDP (Delivered Duty Paid)</option>
                    <option value="EXW">EXW (Ex Works Factory)</option>
                    <option value="CFR">CFR (Cost &amp; Freight)</option>
                  </select>
                </div>
              </div>

              {/* Destination Port & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    Port of Destination / Airport
                  </label>
                  <input
                    type="text"
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    placeholder="e.g. Jebel Ali, Rotterdam, Los Angeles"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* Certifications Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Required Compliance &amp; Certifications
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableCertifications.map((cert) => {
                    const isSelected = selectedCertifications.includes(cert);
                    return (
                      <button
                        type="button"
                        key={cert}
                        onClick={() => toggleCertification(cert)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                          isSelected
                            ? 'bg-blue-950 text-white border-blue-950'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {cert}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Specs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Specifications &amp; Packaging Requirements
                </label>
                <textarea
                  rows={2}
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="Include required tolerances, material grades, packaging (pallets, sacks, crates), or labeling..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              {/* Buyer Contact Details */}
              <div className="pt-2 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-2">Buyer Contact &amp; Consignee Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Company / Importer Name</label>
                    <input
                      type="text"
                      value={buyerCompany}
                      onChange={(e) => setBuyerCompany(e.target.value)}
                      placeholder="e.g. Apex Global Trading LLC"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Corporate Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">WhatsApp / Phone with Country Code</label>
                    <input
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free service · Non-disclosure guaranteed</span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeRFQModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official RFQ</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
