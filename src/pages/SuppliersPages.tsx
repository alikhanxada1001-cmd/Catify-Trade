import React from 'react';
import { useTrade } from '../context/TradeContext';
import { ProductCard } from './HomePage';
import {
  Building2,
  Star,
  ShieldCheck,
  Globe,
  Award,
  ChevronRight,
  FileSpreadsheet,
  ArrowRight,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { Supplier } from '../types';

export const SuppliersPage: React.FC = () => {
  const { suppliers, navigateTo, openRFQModal } = useTrade();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Audited &amp; Certified Global Manufacturers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Verified Supplier Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every manufacturing facility in our network has undergone on-site commercial audits, ISO certification verification, and export track record validation.
          </p>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-base">{supplier.flag}</span>
                    <span className="font-medium text-slate-700">{supplier.city}, {supplier.country}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{supplier.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{supplier.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {supplier.about}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 text-[11px]">
                {supplier.certifications.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                    {c}
                  </span>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">EXPERIENCE</span>
                  <span className="font-bold text-slate-900">{supplier.exportYears} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">RESPONSE</span>
                  <span className="font-bold text-emerald-600">{supplier.responseRate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">STAFF</span>
                  <span className="font-bold text-slate-900">{supplier.staffCount}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('supplier-detail', { id: supplier.id })}
                className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1"
              >
                <span>Full Profile &amp; Products</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openRFQModal(null)}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>RFQ</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SupplierDetailPage: React.FC = () => {
  const { suppliers, selectedSupplierId, products, openRFQModal, navigateTo } = useTrade();

  const supplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
  const supplierProducts = products.filter((p) => p.supplierId === supplier?.id);

  if (!supplier) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-900">Supplier Not Found</h2>
        <button onClick={() => navigateTo('suppliers')} className="mt-4 px-4 py-2 bg-blue-950 text-white rounded-lg text-xs">
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Supplier Profile Card */}
      <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-100">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-xl">{supplier.flag}</span>
              <span>{supplier.city}, {supplier.country}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Manufacturer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{supplier.name}</h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">{supplier.about}</p>
          </div>

          <button
            onClick={() => openRFQModal(null)}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Request Factory Direct Quotation</span>
          </button>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">EXPORT TRACK RECORD</span>
            <span className="text-base font-bold text-slate-900 mt-0.5">{supplier.exportYears} Years Active</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">ANNUAL TRADE REVENUE</span>
            <span className="text-base font-bold text-slate-900 mt-0.5">{supplier.annualRevenue}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">EMPLOYEES &amp; ENGINEERS</span>
            <span className="text-base font-bold text-slate-900 mt-0.5">{supplier.staffCount}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">SUPPLIER RATING</span>
            <span className="text-base font-bold text-amber-600 mt-0.5 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{supplier.rating} / 5.0</span>
            </span>
          </div>
        </div>

        {/* Certifications & Main Lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Audited Certifications</h4>
            <div className="flex flex-wrap gap-1.5">
              {supplier.certifications.map((c) => (
                <span key={c} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Core Product Manufacturing Lines</h4>
            <div className="flex flex-wrap gap-1.5">
              {supplier.mainProducts.map((p) => (
                <span key={p} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Catalog from this Supplier */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Trade Listings from {supplier.name}</h2>
          <p className="text-xs text-slate-500 mt-1">Directly manufactured items available with tiered volume wholesale pricing</p>
        </div>

        {supplierProducts.length === 0 ? (
          <p className="text-xs text-slate-500">No public catalog items currently listed. Please submit an RFQ for custom OEM runs.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supplierProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
