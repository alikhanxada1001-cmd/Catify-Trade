import React, { useState } from 'react';
import { useTrade } from '../context/TradeContext';
import { ProductCard } from './HomePage';
import {
  Layers,
  FileSpreadsheet,
  Calculator,
  ShieldCheck,
  Ship,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Boxes,
  Truck,
} from 'lucide-react';

export const WholesalePage: React.FC = () => {
  const { products, formatPrice, openRFQModal, addToCart, navigateTo } = useTrade();

  const wholesaleProducts = products.filter((p) => p.isWholesaleOnly || p.moq > 1 || (p.wholesaleTiers && p.wholesaleTiers.length > 0));

  // Interactive Bulk Calculator state
  const [selectedProductId, setSelectedProductId] = useState<string>(wholesaleProducts[0]?.id || products[0]?.id || '');
  const [bulkQty, setBulkQty] = useState<number>(100);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Calculate pricing for calculator
  let unitPriceUSD = selectedProduct?.salePriceUSD ?? selectedProduct?.regularPriceUSD ?? 50;
  let savingsPercent = 0;

  if (selectedProduct?.wholesaleTiers) {
    const matchedTier = [...selectedProduct.wholesaleTiers]
      .reverse()
      .find((t) => bulkQty >= t.minQty && (t.maxQty === null || bulkQty <= t.maxQty));
    if (matchedTier) {
      unitPriceUSD = matchedTier.unitPriceUSD;
      savingsPercent = matchedTier.discountPercent;
    } else if (bulkQty >= selectedProduct.moq) {
      unitPriceUSD = selectedProduct.wholesalePriceUSD;
      savingsPercent = 15;
    }
  }

  const regularTotalUSD = (selectedProduct?.regularPriceUSD || unitPriceUSD) * bulkQty;
  const bulkTotalUSD = unitPriceUSD * bulkQty;
  const totalSavingsUSD = Math.max(0, regularTotalUSD - bulkTotalUSD);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Dedicated B2B Trade &amp; Bulk Purchasing Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Wholesale Sourcing with <span className="text-gold-gradient">Tiered Factory Pricing</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Order palletized stock, custom OEM production runs, and Full Container Loads (FCL). Direct supply agreements, certified pre-shipment inspections, and international SWIFT wire terms.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => openRFQModal(null)}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Submit General Wholesale RFQ</span>
            </button>
            <button
              onClick={() => navigateTo('suppliers')}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              Explore Audited Factories
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Bulk Quantity & Discount Simulator */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Interactive Bulk Savings Calculator</h2>
            <p className="text-xs text-slate-500">Estimate tiered purchase price, total savings, and freight capacity in real-time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Select Product */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Commercial Listing</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (MOQ: {p.moq})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Stepper */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Order Volume (Units)
            </label>
            <input
              type="number"
              min="1"
              value={bulkQty}
              onChange={(e) => setBulkQty(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono font-bold"
            />
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[50, 100, 250, 500, 1000].map((qty) => (
              <button
                key={qty}
                onClick={() => setBulkQty(qty)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                  bulkQty === qty
                    ? 'bg-blue-950 text-white border-blue-950'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {qty} pcs
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Negotiated Unit Price</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              {formatPrice(unitPriceUSD)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Standard: {formatPrice(selectedProduct?.regularPriceUSD || 0)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Total Consignment Price</span>
            <span className="text-base sm:text-lg font-bold text-blue-950 tabular-nums">
              {formatPrice(bulkTotalUSD)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{bulkQty} units subtotal</span>
          </div>

          <div>
            <span className="text-slate-500 block">Volume Discount Saved</span>
            <span className="text-base sm:text-lg font-bold text-emerald-600 tabular-nums">
              {formatPrice(totalSavingsUSD)}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5 font-semibold">
              Save ~{savingsPercent}% off retail
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Recommended Logistics</span>
            <span className="text-sm font-bold text-slate-800 block mt-0.5">
              {bulkQty >= 500 ? 'Full Ocean Container (FCL)' : 'Ocean LCL Palletized'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Estimated weight: {((selectedProduct?.weightKg || 1) * bulkQty).toFixed(0)} kg
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            onClick={() => openRFQModal(selectedProduct)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Request Formal Proforma Invoice</span>
          </button>
          <button
            onClick={() => {
              if (selectedProduct) {
                addToCart(selectedProduct, bulkQty, { isWholesale: true });
              }
            }}
            className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
          >
            <span>Add Calculated Batch to Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Wholesale Product Listings */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Wholesale &amp; Bulk Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">Available in volume with tiered minimum orders and export packing options</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wholesaleProducts.map((p) => (
            <ProductCard key={p.id} product={p} isWholesaleCard />
          ))}
        </div>
      </div>
    </div>
  );
};
