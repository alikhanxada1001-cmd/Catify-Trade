import React from 'react';
import { useTrade } from '../context/TradeContext';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, FileText } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, formatPrice, updateCartQuantity, removeFromCart, navigateTo } = useTrade();
  const total = cart.reduce((sum, item) => sum + item.unitPriceUSD * item.quantity, 0);

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-500"><ShoppingBag className="h-8 w-8" /></div>
        <h1 className="text-2xl font-extrabold text-slate-900">Your enquiry list is empty</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Add products from the catalogue to prepare a wholesale or sourcing enquiry.</p>
        <button onClick={() => navigateTo('shop')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white hover:bg-blue-900">Browse products <ArrowRight className="h-4 w-4" /></button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-6 text-white sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">Wholesale enquiry list</p>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Review your selected products</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">This website currently collects quotation requests; it does not process card payments or confirm live inventory. Final supplier, stock, pricing, shipping and payment terms are confirmed after review.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {cart.map((item) => (
            <article key={item.productId + (item.selectedColor || '') + (item.selectedSize || '')} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <img src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'} alt={item.product.title} className="h-24 w-24 shrink-0 rounded-xl bg-slate-100 object-cover" />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-slate-900">{item.product.title}</h2>
                <p className="mt-1 text-xs text-slate-500">SKU: {item.product.sku} · MOQ: {item.product.moq}</p>
                <p className="mt-1 text-sm font-semibold text-blue-950">{formatPrice(item.unitPriceUSD)} <span className="text-xs font-normal text-slate-500">indicative / unit</span></p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button aria-label="Decrease quantity" onClick={() => updateCartQuantity(item.productId, Math.max(1, item.quantity - 1), { color: item.selectedColor, size: item.selectedSize, packaging: item.selectedPackaging })} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="min-w-8 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => updateCartQuantity(item.productId, item.quantity + 1, { color: item.selectedColor, size: item.selectedSize, packaging: item.selectedPackaging })} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200"><Plus className="h-3.5 w-3.5" /></button>
                  <button onClick={() => removeFromCart(item.productId, { color: item.selectedColor, size: item.selectedSize, packaging: item.selectedPackaging })} className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                </div>
              </div>
              <div className="hidden text-right text-sm font-bold text-slate-900 sm:block">{formatPrice(item.unitPriceUSD * item.quantity)}</div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900">Enquiry summary</h2>
          <div className="mt-4 flex justify-between text-sm text-slate-600"><span>Products</span><span>{cart.length}</span></div>
          <div className="mt-2 flex justify-between text-sm text-slate-600"><span>Total quantity</span><span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="flex justify-between gap-3"><span className="font-semibold text-slate-700">Indicative subtotal</span><span className="text-lg font-extrabold text-slate-950">{formatPrice(total)}</span></div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Not a final offer. Taxes, freight, duties, supplier availability and payment terms are not included.</p>
          </div>
          <button onClick={() => navigateTo('request-quote')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-extrabold text-slate-950 hover:bg-amber-300"><FileText className="h-4 w-4" /> Request a quotation</button>
          <button onClick={() => navigateTo('shop')} className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Continue browsing</button>
        </aside>
      </div>
    </div>
  );
};
