import React, { useState, useEffect } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  Ship,
  Plane,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  MapPin,
  Building2,
  Package,
  Phone,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders, trackingLookupId, formatPrice, settings } = useTrade();

  const [inputVal, setInputVal] = useState<string>(trackingLookupId || 'CT-2026-8941');
  const [searchedId, setSearchedId] = useState<string>(trackingLookupId || 'CT-2026-8941');

  useEffect(() => {
    if (trackingLookupId) {
      setInputVal(trackingLookupId);
      setSearchedId(trackingLookupId);
    }
  }, [trackingLookupId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(inputVal.trim());
  };

  const matchedOrder = orders.find(
    (o) =>
      o.id.toLowerCase() === searchedId.toLowerCase() ||
      o.orderNumber.toLowerCase() === searchedId.toLowerCase() ||
      o.trackingNumber.toLowerCase() === searchedId.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Ship className="w-4 h-4" />
            <span>Global Intermodal Cargo Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Track Your International Shipment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter your Catify Trade Order ID (e.g. <strong>CT-2026-8941</strong>) or carrier tracking number to view real-time port clearance, ocean vessel coordinates, or flight status.
          </p>

          <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Order ID: CT-2026-8941"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/80 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Track Cargo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick lookup tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <span>Demo Reference IDs:</span>
            <button
              type="button"
              onClick={() => {
                setInputVal('CT-2026-8941');
                setSearchedId('CT-2026-8941');
              }}
              className="underline hover:text-amber-400 font-mono"
            >
              CT-2026-8941
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setInputVal('CT-2026-7812');
                setSearchedId('CT-2026-7812');
              }}
              className="underline hover:text-amber-400 font-mono"
            >
              CT-2026-7812
            </button>
          </div>
        </div>
      </div>

      {/* Results View */}
      {matchedOrder ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs">
          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>CONSIGNMENT REF:</span>
                <span className="font-mono font-bold text-slate-900">{matchedOrder.orderNumber}</span>
                <span aria-hidden="true">·</span>
                <span>PLACED: {new Date(matchedOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span>Status:</span>
                <span className="capitalize text-blue-900">{matchedOrder.orderStatus.replace('_', ' ')}</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px]">ASSIGNED LOGISTICS CARRIER</span>
                <span className="font-bold text-slate-900">{matchedOrder.carrier}</span>
                <span className="font-mono text-slate-500 block text-[11px]">{matchedOrder.trackingNumber}</span>
              </div>
            </div>
          </div>

          {/* Key Consignment Milestones Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">DESTINATION</span>
              <span className="font-bold text-slate-900">{matchedOrder.destinationCountry}</span>
              <span className="text-slate-500 block text-[10px] truncate">{matchedOrder.shippingAddress.city}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">FREIGHT METHOD</span>
              <span className="font-bold text-slate-900 capitalize">{matchedOrder.shippingMethod.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ESTIMATED DELIVERY</span>
              <span className="font-bold text-blue-950 font-mono">{matchedOrder.estimatedDeliveryDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">COMMERCIAL INVOICE</span>
              <span className="font-bold text-slate-900 font-mono">{matchedOrder.commercialInvoiceNumber}</span>
            </div>
          </div>

          {/* Visual Milestone Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Shipment Movement &amp; Customs Milestones
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {matchedOrder.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Icon Badge */}
                  <div
                    className={`absolute -left-6 sm:-left-8 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white ${
                      event.completed ? 'bg-emerald-600 shadow-xs' : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {event.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{event.label}</h4>
                      <span className="text-[11px] font-mono text-slate-500">{event.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-blue-900 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.location}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Consignment Details */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Consigned Commercial Manifest</h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {matchedOrder.items.map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-white">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <Package className="w-5 h-5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">{item.product.title}</div>
                      <div className="text-[11px] text-slate-500">
                        SKU: {item.product.sku} · Qty: {item.quantity} units · Pack: {item.selectedPackaging || 'Standard'}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 tabular-nums shrink-0 pl-8 sm:pl-0">
                    {formatPrice(item.unitPriceUSD * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expedite / Support Footer */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Need special customs demurrage clearance or port changes for this cargo?</span>
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Catify%20Trade,%20inquiry%20regarding%20consignment%20${matchedOrder.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5"
            >
              <span>Contact WhatsApp Officer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Consignment Not Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We could not locate an active international shipment matching reference &quot;{searchedId}&quot;. Please verify your Proforma Invoice number or contact the Catify Trade desk.
          </p>
        </div>
      )}
    </div>
  );
};
