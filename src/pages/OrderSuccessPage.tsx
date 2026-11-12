import React, { useRef } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  CheckCircle2,
  Printer,
  Ship,
  Phone,
  ArrowRight,
  FileText,
  Building2,
  Calendar,
  Package,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { recentPlacedOrder, orders, formatPrice, navigateTo, settings } = useTrade();

  const order = recentPlacedOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">No recent orders found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-4 py-2 bg-blue-950 text-white rounded-lg text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Hero */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Commercial Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Thank You for Sourcing with Catify Trade
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Your international trade consignment has been registered. Proforma Commercial Invoice has been generated and queued for export packaging.
          </p>
        </div>

        {/* Highlighted Order & Tracking IDs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs max-w-xl mx-auto">
          <div>
            <span className="text-slate-400 block text-[10px]">ORDER ID</span>
            <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">INVOICE REF</span>
            <span className="font-mono font-bold text-slate-900">{order.commercialInvoiceNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">TRACKING ID</span>
            <span className="font-mono font-bold text-blue-900">{order.trackingNumber}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <button
            onClick={() => navigateTo('track-order', { id: order.orderNumber })}
            className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Ship className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Cargo Status</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Commercial Invoice</span>
          </button>

          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Catify%20Trade,%20I%20have%20placed%20order%20${order.orderNumber}.%20Please%20confirm%20export%20timeline.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Notify WhatsApp Desk</span>
          </a>
        </div>
      </div>

      {/* Proforma Commercial Invoice Document View */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 lg:p-12 shadow-sm space-y-8 print:p-0 print:border-none">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/Catify_Trade_Circular_Logo_df00bcb5.png"
              alt="Catify Trade"
              referrerPolicy="no-referrer"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full border border-amber-400/40 bg-white shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">CATIFY TRADE INTERNATIONAL</h2>
              <p className="text-xs text-slate-500">Official Proforma Commercial Invoice</p>
              <p className="text-[11px] text-slate-400 mt-0.5 break-all">Desk Email: {settings.email} · Tel: {settings.phone}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="font-mono font-bold text-slate-900 text-sm">{order.commercialInvoiceNumber}</div>
            <div className="text-slate-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</div>
            <div className="text-emerald-700 font-semibold uppercase mt-0.5">Payment: {order.paymentStatus}</div>
          </div>
        </div>

        {/* Consignee & Dispatch Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              CONSIGNEE &amp; IMPORTER:
            </span>
            <div className="font-bold text-slate-900">{order.shippingAddress.fullName}</div>
            {order.shippingAddress.companyName && (
              <div className="text-slate-700 font-medium">{order.shippingAddress.companyName}</div>
            )}
            <div className="text-slate-600 mt-1">{order.shippingAddress.addressLine1}</div>
            {order.shippingAddress.addressLine2 && <div className="text-slate-600">{order.shippingAddress.addressLine2}</div>}
            <div className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </div>
            <div className="text-slate-900 font-semibold">{order.shippingAddress.country}</div>
            {order.shippingAddress.taxIdOrVat && (
              <div className="text-slate-500 text-[11px] mt-1 font-mono">
                Tax ID / VAT: {order.shippingAddress.taxIdOrVat}
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              LOGISTICS &amp; EXPORT DETAILS:
            </span>
            <div className="space-y-1 text-slate-700">
              <div>Freight Mode: <strong className="text-slate-900 capitalize">{order.shippingMethod.replace(/_/g, ' ')}</strong></div>
              <div>Carrier: <strong className="text-slate-900">{order.carrier}</strong></div>
              <div>Tracking Number: <strong className="text-slate-900 font-mono">{order.trackingNumber}</strong></div>
              <div>Est. Delivery Date: <strong className="text-slate-900 font-mono">{order.estimatedDeliveryDate}</strong></div>
              <div>Settlement Method: <strong className="text-slate-900 uppercase">{order.paymentMethod.replace(/_/g, ' ')}</strong></div>
            </div>
          </div>
        </div>

        {/* Itemized Manifest Table */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            CONSIGNED COMMODITY SCHEDULE
          </span>
          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">HS Code</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{item.product.title}</div>
                      <div className="text-[11px] text-slate-500">
                        SKU: {item.product.sku} · Pack: {item.selectedPackaging || 'Standard'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{item.product.hsCode || '8481.20'}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{formatPrice(item.unitPriceUSD)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {formatPrice(item.unitPriceUSD * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Wire Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4 border-t border-slate-200 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">Bank Wire Remittance Instructions:</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              For SWIFT MT103 wire settlements, please instruct your issuing bank to remit to:
            </p>
            <div className="space-y-0.5 text-[11px] text-slate-700 font-mono">
              <div>Bank: {settings.bankDetails.bankName}</div>
              <div>IBAN: {settings.bankDetails.iban}</div>
              <div>SWIFT: {settings.bankDetails.swiftBic}</div>
              <div>Ref: {order.orderNumber} / {order.commercialInvoiceNumber}</div>
            </div>
          </div>

          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(order.subtotalUSD)}</span>
            </div>
            {order.discountUSD > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Saved:</span>
                <span className="tabular-nums">-{formatPrice(order.discountUSD)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>International Shipping Freight:</span>
              <span className="tabular-nums text-slate-900">{formatPrice(order.shippingCostUSD)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Port Customs &amp; VAT:</span>
              <span className="tabular-nums text-slate-900">{formatPrice(order.customsTaxUSD)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-950">
              <span>Grand Total:</span>
              <span className="text-blue-950 tabular-nums">{formatPrice(order.totalUSD)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
