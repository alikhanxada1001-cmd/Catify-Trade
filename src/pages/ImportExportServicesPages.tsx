import React, { useState } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  Ship,
  Plane,
  ShieldCheck,
  FileText,
  Building,
  CheckCircle,
  ArrowRight,
  Send,
  Globe,
  Truck,
  Check,
  Phone,
} from 'lucide-react';

export const ImportServicesPage: React.FC = () => {
  const { countries, submitInquiry, settings } = useTrade();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [originCountry, setOriginCountry] = useState('Germany');
  const [destinationCountry, setDestinationCountry] = useState('United States');
  const [cargoDetails, setCargoDetails] = useState('');
  const [estimatedVolume, setEstimatedVolume] = useState('1x 20ft Container');
  const [preferredIncoterm, setPreferredIncoterm] = useState('CIF');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !email.trim() || isSubmitting) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await submitInquiry({ serviceType: 'import_customs', companyName, contactPerson, email, phone, originCountry, destinationCountry, cargoDetails, estimatedVolume, preferredIncoterm });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your inquiry. Please retry.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Ship className="w-4 h-4" />
            <span>Import Planning &amp; Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            International Import &amp; Customs Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Share your route, product classification and cargo details to discuss documentation requirements and possible logistics options. Licensed customs brokers remain responsible for formal declarations and clearance.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Import Logistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-900 w-fit">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Customs Documentation Checklist</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Identify product details and documents to review with a qualified customs broker in the destination country.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700 w-fit">
            <Ship className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Port and Freight Planning</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compare route, shipment size and destination requirements before requesting a freight quotation.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Duty and Tax Research</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Import duties depend on local law and product classification. Confirm current rates with the destination customs authority or a licensed broker.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700 w-fit">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Delivery Options</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Depending on the route, courier, road, air or sea options may be available. Costs and service must be confirmed in writing.
          </p>
        </div>
      </div>

      {/* Interactive Import Service Consultation Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Request Import Information</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Share your cargo details. Any available assistance, costs and timelines will be confirmed after review.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-white border border-emerald-200 text-center space-y-3 shadow-xs">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Import Inquiry Received</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, {contactPerson || companyName}. Your import enquiry has been saved. Any available service, pricing or timelines will be confirmed after review; no automated email has been sent.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20just%20submitted%20an%20import%20inquiry%20for%20${companyName}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Trade Desk: {settings.phone}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              {submitError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{submitError}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Importer Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Global Trading Inc"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="imports@company.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Origin</label>
                  <select
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Country</label>
                  <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Shipment Volume</label>
                  <input
                    type="text"
                    value={estimatedVolume}
                    onChange={(e) => setEstimatedVolume(e.target.value)}
                    placeholder="e.g. 2x 40ft FCL, 15 CBM"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo Description &amp; Specifics</label>
                <textarea
                  rows={3}
                  value={cargoDetails}
                  onChange={(e) => setCargoDetails(e.target.value)}
                  placeholder="Describe goods, estimated weight, value for customs declaration, or known HS codes..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-950 disabled:opacity-60 hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSubmitting ? 'Submitting…' : 'Send Import Enquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const ExportServicesPage: React.FC = () => {
  const { countries, submitInquiry, settings } = useTrade();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [originCountry, setOriginCountry] = useState('Pakistan');
  const [destinationCountry, setDestinationCountry] = useState('Germany');
  const [cargoDetails, setCargoDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !email.trim() || isSubmitting) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await submitInquiry({ serviceType: 'export_compliance', companyName, contactPerson, email, phone, originCountry, destinationCountry, cargoDetails, estimatedVolume: 'To be confirmed', preferredIncoterm: 'To be discussed' });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your inquiry. Please retry.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Plane className="w-4 h-4" />
            <span>Outbound Freight &amp; Trade Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Worldwide Export Compliance &amp; Freight Logistics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tell us your origin, destination and product details to discuss potential export documentation and shipping requirements. Availability is confirmed case by case.
          </p>
        </div>
      </div>

      {/* Export Services Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
          <h3 className="text-base font-bold text-slate-900">Export Document Checklist</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Issuance of compliant Commercial Invoices, Packing Lists, Shipper&apos;s Letter of Instruction (SLI), and Certificates of Origin attested by local Chambers of Commerce.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
          <h3 className="text-base font-bold text-slate-900">Cargo Preparation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Confirm packaging, palletization, marking and cargo handling requirements with the supplier and carrier before dispatch.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
          <h3 className="text-base font-bold text-slate-900">Payment Document Review</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Discuss documentary requirements with your bank and trade finance adviser. Catify Trade does not process letters of credit or payments.
          </p>
        </div>
      </div>

      {/* Export Inquiry Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Initiate Export Freight Inquiry</h2>
            <p className="text-xs sm:text-sm text-slate-500">Share your origin, destination and cargo details. Availability and any documentation support will be confirmed after review.</p>
          </div>

          {submitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-emerald-200 text-center space-y-3 shadow-xs">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Export Inquiry Submitted</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, {contactPerson || companyName}. An export logistics coordinator has been assigned to your shipment and will contact you at <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              {submitError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{submitError}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exporter / Producer Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Indus Manufacturing Ltd"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Representative Name *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Tariq Khan"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exports@company.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo Details &amp; Target Port</label>
                <textarea
                  rows={3}
                  value={cargoDetails}
                  onChange={(e) => setCargoDetails(e.target.value)}
                  placeholder="Specify product types, total weight, preferred port of loading, target vessel departure date..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Submit Export Freight Booking Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
