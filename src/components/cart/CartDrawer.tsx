import React, { useState } from 'react';
import { useTrade } from '../../context/TradeContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  ExternalLink,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotalUSD,
    cartTotalItems,
    cartTotalWeightKg,
    formatPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountUSD,
    currentCountry,
    navigateTo,
  } = useTrade();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    if (result.success) {
      setCouponFeedback({ type: 'success', message: result.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  const isPakistan = currentCountry.code === 'PK';
  const importedRatio =
    cartSubtotalUSD > 0
      ? cart
          .filter((item) => item.product.countryOfOrigin !== currentCountry.name)
          .reduce((sum, item) => sum + item.unitPriceUSD * item.quantity, 0) / cartSubtotalUSD
      : 0;
  const allDomesticPK = isPakistan && cart.length > 0 && importedRatio === 0;

  const estimatedAirShippingUSD = allDomesticPK
    ? 2.5 + cartTotalWeightKg * 0.8
    : Math.max(isPakistan ? 8 : 25, cartTotalWeightKg * (currentCountry.airShippingPerKgUSD || 12));
  const discountedSubtotalUSD = Math.max(0, cartSubtotalUSD - discountUSD);
  const estimatedCustomsDutyUSD =
    (discountedSubtotalUSD * importedRatio * (currentCountry.importDutyPercent || 4)) / 100;
  const estimatedGrandTotalUSD = discountedSubtotalUSD + estimatedAirShippingUSD + estimatedCustomsDutyUSD;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Trade Order Cart">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 w-full sm:w-auto max-w-full flex justify-end sm:pl-10">
        <div className="w-full sm:w-[460px] max-w-full h-[100dvh] max-h-[100dvh] bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingBag className="w-5 h-5 text-blue-900 shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">Trade Order Cart</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-semibold shrink-0 tabular-nums">
                {cartTotalItems} items
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Destination Notice */}
          <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between gap-2 text-xs text-amber-900 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="shrink-0">{currentCountry.flag}</span>
              <span className="truncate">
                Shipping to <strong>{currentCountry.name}</strong>
              </span>
            </div>
            <span className="text-amber-800 font-semibold shrink-0 tabular-nums">
              Duty ~{currentCountry.importDutyPercent}%
            </span>
          </div>

          {/* Scrollable Cart Items + Order Summary Breakdown */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Your Trade Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our international wholesale and retail catalog to request samples, bulk stock, or machinery.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-950 text-white rounded-lg text-xs font-semibold hover:bg-blue-900"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => {
                    const variant = {
                      color: item.selectedColor,
                      size: item.selectedSize,
                      packaging: item.selectedPackaging,
                    };
                    const lineWeightKg = (item.product.weightKg || 1) * item.quantity;

                    return (
                      <div
                        key={`${item.productId}-${item.selectedColor || ''}-${item.selectedSize || ''}-${item.selectedPackaging || ''}`}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3"
                      >
                        {/* Top Product Identity Row */}
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCartDrawerOpen(false);
                              navigateTo('product-detail', { slug: item.product.slug });
                            }}
                            className="shrink-0 focus:outline-none"
                            title="View full product details"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200 bg-slate-50"
                            />
                          </button>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsCartDrawerOpen(false);
                                  navigateTo('product-detail', { slug: item.product.slug });
                                }}
                                className="text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-900 transition-colors line-clamp-2 leading-snug"
                              >
                                {item.product.title}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.productId, variant)}
                                className="text-slate-400 hover:text-rose-600 transition-colors p-1 shrink-0"
                                title="Remove item"
                                aria-label={`Remove ${item.product.title}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Origin, SKU & HS Code */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                              <span className="font-mono">SKU: {item.product.sku}</span>
                              <span aria-hidden="true">·</span>
                              <span>HS: {item.product.hsCode}</span>
                              <span aria-hidden="true">·</span>
                              <span>Origin: {item.product.countryOfOrigin}</span>
                            </div>

                            {/* Variant & Packaging Details */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
                              <span
                                className={`px-2 py-0.5 rounded font-semibold ${
                                  item.isWholesale
                                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {item.isWholesale
                                  ? 'Wholesale Tier'
                                  : item.quantity === 1
                                  ? 'Single Unit (1 Pc)'
                                  : 'Retail Order'}
                              </span>
                              {item.selectedColor && (
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  Color: <strong className="text-slate-900">{item.selectedColor}</strong>
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  Size: <strong className="text-slate-900">{item.selectedSize}</strong>
                                </span>
                              )}
                              {item.selectedPackaging && (
                                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/70">
                                  Pack: <strong>{item.selectedPackaging}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Stepper, Weight & Line Price Breakdown */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.productId, item.quantity - 1, variant)}
                                className="p-1.5 text-slate-600 hover:bg-white rounded transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 font-bold text-slate-900 tabular-nums">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.productId, item.quantity + 1, variant)}
                                className="p-1.5 text-slate-600 hover:bg-white rounded transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[11px] text-slate-500 tabular-nums">
                              {lineWeightKg.toFixed(1)} kg
                            </span>
                          </div>

                          <div className="text-right ml-auto">
                            <div className="font-bold text-sm text-slate-900 tabular-nums">
                              {formatPrice(item.unitPriceUSD * item.quantity)}
                            </div>
                            <div className="text-[11px] text-slate-500 tabular-nums">
                              {formatPrice(item.unitPriceUSD)} / unit · MOQ {item.product.moq}
                            </div>
                          </div>
                        </div>

                        {/* Quick link back to full product detail */}
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="text-slate-500 truncate max-w-[65%]">
                            {item.product.shortDescription}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCartDrawerOpen(false);
                              navigateTo('product-detail', { slug: item.product.slug });
                            }}
                            className="inline-flex items-center gap-1 text-blue-900 hover:underline font-semibold shrink-0"
                          >
                            <span>Full Specs</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Engine & Landed Estimate inside scroll container so mobile screens never clip items */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            Promo <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Promo / Trade Coupon"
                          className="flex-1 min-w-0 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg uppercase placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-900"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {couponFeedback && (
                      <p
                        className={`mt-1.5 text-[11px] ${
                          couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {couponFeedback.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex justify-between gap-2">
                      <span>Cart Subtotal:</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(cartSubtotalUSD)}</span>
                    </div>

                    {discountUSD > 0 && (
                      <div className="flex justify-between gap-2 text-emerald-700 font-medium">
                        <span>Discount:</span>
                        <span className="tabular-nums">-{formatPrice(discountUSD)}</span>
                      </div>
                    )}

                    <div className="flex justify-between gap-2">
                      <span>
                        {allDomesticPK
                          ? `Pakistan Courier (${cartTotalWeightKg.toFixed(1)} kg):`
                          : `Est. Air Freight (${cartTotalWeightKg.toFixed(1)} kg):`}
                      </span>
                      <span className="tabular-nums text-slate-800">{formatPrice(estimatedAirShippingUSD)}</span>
                    </div>

                    <div className="flex justify-between gap-2">
                      <span>
                        {allDomesticPK
                          ? 'Domestic Duty (Pakistan):'
                          : `Est. Customs & VAT (${currentCountry.code}):`}
                      </span>
                      <span className="tabular-nums text-slate-800">
                        {allDomesticPK ? 'Exempt (0%)' : formatPrice(estimatedCustomsDutyUSD)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sticky Bottom Checkout CTA */}
          {cart.length > 0 && (
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-t border-slate-200 bg-white space-y-2.5 shrink-0">
              <div className="flex justify-between items-baseline text-sm font-bold text-slate-950">
                <span>Estimated Landed Total:</span>
                <span className="text-base text-blue-950 tabular-nums">{formatPrice(estimatedGrandTotalUSD)}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('checkout');
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Global Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Commercial Escrow Protected</span>
                </span>
                <button type="button" onClick={clearCart} className="text-slate-500 hover:text-rose-600 transition-colors font-medium">
                  Clear cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
