import React, { useState } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  Package,
  Heart,
  FileSpreadsheet,
  MapPin,
  Clock,
  Shield,
  User,
  Building2,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  Truck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const {
    orders,
    rfqs,
    wishlist,
    products,
    formatPrice,
    navigateTo,
    setUserRole,
    isAdminAuthenticated,
    settings,
  } = useTrade();

  const [activeTab, setActiveTab] = useState<'orders' | 'rfqs' | 'wishlist' | 'refund' | 'profile'>('orders');

  // Return & refund form state
  const [refundOrderId, setRefundOrderId] = useState(orders[0]?.orderNumber || '');
  const [refundReason, setRefundReason] = useState('Damaged during ocean container freight');
  const [refundNotes, setRefundNotes] = useState('');
  const [refundSubmitted, setRefundSubmitted] = useState(false);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrderId) return;
    setRefundSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-lg sm:text-xl shadow-xs shrink-0">
            CT
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Verified Importer Account</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white">Importer Business Portal</h1>
            <p className="text-xs text-slate-300 mt-0.5">Commercial ID: IMP-8841 · Active Currency: USD</p>
          </div>
        </div>

        {isAdminAuthenticated ? (
          <div className="w-full md:w-auto flex items-center gap-2">
            <button
              onClick={() => {
                setUserRole('admin');
                navigateTo('admin-dashboard');
              }}
              className="w-full md:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30 rounded-xl text-xs font-bold transition-colors text-center"
            >
              Switch to Admin Management Console →
            </button>
          </div>
        ) : (
          <div className="w-full md:w-auto flex items-center gap-2">
            <button
              onClick={() => navigateTo('shop')}
              className="w-full md:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-colors text-center"
            >
              Browse Trade Catalog →
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px text-xs font-semibold">
        {[
          { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
          { id: 'rfqs', label: `Submitted RFQs (${rfqs.length})`, icon: FileSpreadsheet },
          { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: Heart },
          { id: 'refund', label: 'Returns & Refund Claims', icon: RotateCcw },
          { id: 'profile', label: 'Company Profile & Addresses', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 flex items-center gap-2 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-950 text-blue-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              International Order History
            </h2>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs text-blue-950 hover:underline font-semibold"
            >
              + Place New Trade Order
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No orders placed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm">{order.orderNumber}</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className="text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className="font-semibold text-slate-700">{order.destinationCountry}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-slate-900 text-sm tabular-nums">
                        {formatPrice(order.totalUSD)}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-700">
                        <div className="flex items-start sm:items-center gap-2 min-w-0">
                          <Package className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
                          <span className="font-semibold text-slate-900 line-clamp-2 sm:line-clamp-1">{item.product.title}</span>
                          <span className="text-slate-500 text-[11px] shrink-0">({item.quantity} pcs)</span>
                        </div>
                        <span className="font-mono text-slate-900 font-bold tabular-nums shrink-0 pl-6 sm:pl-0">
                          {formatPrice(item.unitPriceUSD * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Tracking */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Truck className="w-4 h-4 text-blue-900" />
                      <span>Carrier: <strong>{order.carrier}</strong></span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-[11px] text-slate-500">{order.trackingNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('track-order', { id: order.orderNumber })}
                        className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <span>Live Cargo Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: RFQs */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Submitted Quotation Inquiries
            </h2>
            <button
              onClick={() => navigateTo('request-quote')}
              className="text-xs text-blue-950 hover:underline font-semibold"
            >
              + Submit New RFQ
            </button>
          </div>

          <div className="space-y-3">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{rfq.rfqNumber}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="font-semibold text-slate-800">{rfq.productTitle}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      rfq.status === 'quoted'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Status: {rfq.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                  <div>Quantity: <strong className="text-slate-900">{rfq.quantity} units</strong></div>
                  <div>Target Incoterm: <strong className="text-slate-900">{rfq.incoterm}</strong></div>
                  <div>Destination Port: <strong className="text-slate-900">{rfq.destinationPort}</strong></div>
                  <div>Target Price: <strong className="text-slate-900">${rfq.targetPriceUSD}</strong></div>
                </div>

                {rfq.adminQuotedPriceUSD && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                    <span className="font-bold">Trade Officer Proforma Quote: </span>
                    <span className="font-bold text-blue-950 font-mono">${rfq.adminQuotedPriceUSD} / unit</span>
                    {rfq.adminLeadTimeDays && (
                      <span className="ml-2">· Lead Time: {rfq.adminLeadTimeDays} days</span>
                    )}
                    {rfq.adminNotes && <p className="text-[11px] text-amber-800 mt-1">{rfq.adminNotes}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Saved Trade Products
          </h2>
          {wishlistProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No products saved to wishlist yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <img src={p.images[0]} alt="" className="w-full h-36 object-cover rounded-lg" />
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{p.title}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{formatPrice(p.regularPriceUSD)}</span>
                    <button
                      onClick={() => navigateTo('product-detail', { slug: p.slug })}
                      className="px-3 py-1 bg-blue-950 text-white text-[11px] rounded-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Returns & Refunds */}
      {activeTab === 'refund' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-900">Commercial Cargo Claim &amp; Refund Request</h2>
            <p className="text-xs text-slate-500 mt-1">
              Catify Trade provides marine cargo inspection arbitration and credit note refunds for non-conforming goods.
            </p>
          </div>

          {refundSubmitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-xs text-emerald-900">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm">Discrepancy Claim Filed</h3>
              <p>Your claim has been logged under insurance protocol #CLM-2026-441. Our surveyor will inspect the bill of lading.</p>
              <button
                onClick={() => setRefundSubmitted(false)}
                className="mt-2 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                File Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Consignment / Order ID *</label>
                <select
                  value={refundOrderId}
                  onChange={(e) => setRefundOrderId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.orderNumber}>
                      {o.orderNumber} - {o.destinationCountry} ({formatPrice(o.totalUSD)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Claim Reason</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Damaged during ocean container freight">Damaged during ocean container freight</option>
                  <option value="Tolerance / Dimensional variance exceeding spec">Tolerance / Dimensional variance exceeding spec</option>
                  <option value="Missing customs certificate of origin">Missing customs certificate of origin</option>
                  <option value="Port customs demurrage delay">Port customs demurrage delay</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Findings &amp; Container Seal Condition</label>
                <textarea
                  rows={3}
                  value={refundNotes}
                  onChange={(e) => setRefundNotes(e.target.value)}
                  placeholder="Provide survey report details, photos, or surveyor reference..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-lg transition-colors"
              >
                Submit Official Commercial Claim
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-2xl text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">Importer Enterprise Profile</h2>
            <p className="text-slate-500 mt-0.5">Corporate business identification for trade document generation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">ORGANIZATION</span>
              <span className="font-bold text-slate-900 mt-0.5 block">Vance Global Logistics Inc</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">AUTHORIZED REPRESENTATIVE</span>
              <span className="font-bold text-slate-900 mt-0.5 block">Marcus Vance</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">PRIMARY DESK EMAIL</span>
              <span className="font-bold text-slate-900 mt-0.5 block break-all">m.vance@vancetech-industries.com</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">SETTLEMENT CREDIT TIER</span>
              <span className="font-bold text-emerald-700 mt-0.5 block">Tier 1 Approved (Escrow &amp; L/C)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
