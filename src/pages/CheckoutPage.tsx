import React, { useState } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Lock,
  ArrowRight,
  Truck,
  Ship,
  Plane,
  Tag,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { PaymentMethod, ShippingMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotalUSD,
    cartTotalWeightKg,
    formatPrice,
    convertPrice,
    activeCurrency,
    currentCountry,
    countries,
    discountUSD,
    appliedCoupon,
    createOrder,
    navigateTo,
    settings,
  } = useTrade();

  // Multi-step state: 1: Address & Consignee, 2: Shipping, 3: Payment & Place Order
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address & Consignee Info
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState(currentCountry.name);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxIdOrVat, setTaxIdOrVat] = useState('');

  // Shipping Method (auto-select domestic courier if shopping from Pakistan)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(
    currentCountry.code === 'PK' ? 'domestic_courier' : 'air_express'
  );

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    currentCountry.code === 'PK' ? 'cash_on_delivery' : 'bank_transfer'
  );

  // Card fields (if card selected)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const [copiedIban, setCopiedIban] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Trade Order Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please add products from our catalog or wholesale hub to proceed with checkout.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-blue-950 text-white text-xs font-semibold rounded-lg hover:bg-blue-900"
        >
          Explore Products
        </button>
      </div>
    );
  }

  // Calculate Shipping Cost & Customs Duty based on chosen country and method
  const matchedCountry = countries.find((c) => c.name === country) || currentCountry;
  const isPakistanCheckout = matchedCountry.code === 'PK';
  const importedSubtotalRatio =
    cartSubtotalUSD > 0
      ? cart
          .filter((item) => item.product.countryOfOrigin !== matchedCountry.name)
          .reduce((sum, item) => sum + item.unitPriceUSD * item.quantity, 0) / cartSubtotalUSD
      : 0;

  const domesticCostUSD = 2.5 + cartTotalWeightKg * 0.8;
  const airCostUSD = Math.max(
    isPakistanCheckout ? 10 : 35,
    cartTotalWeightKg * (matchedCountry.airShippingPerKgUSD || 14)
  );
  // Ocean freight estimate (based on weight/volume ratio)
  const oceanCostUSD = Math.max(
    120,
    Math.ceil(cartTotalWeightKg / 150) * (matchedCountry.seaShippingPerCbmUSD || 150)
  );

  const effectiveShippingMethod: ShippingMethod =
    shippingMethod === 'domestic_courier' && !isPakistanCheckout ? 'air_express' : shippingMethod;

  const actualShippingCostUSD =
    effectiveShippingMethod === 'domestic_courier'
      ? domesticCostUSD
      : effectiveShippingMethod === 'air_express'
      ? airCostUSD
      : oceanCostUSD;

  const customsTaxUSD =
    (Math.max(0, cartSubtotalUSD - discountUSD) * importedSubtotalRatio * (matchedCountry.importDutyPercent || 4)) / 100;
  const grandTotalUSD = cartSubtotalUSD - discountUSD + actualShippingCostUSD + customsTaxUSD;

  const handleCopyIban = () => {
    navigator.clipboard.writeText(settings.bankDetails.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 3000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedPostalCode = postalCode.trim() || (isPakistanCheckout ? '00000' : '');
    if (!fullName || !email || !addressLine1 || !city || !resolvedPostalCode) {
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    const paidCurrencyTotal = convertPrice(grandTotalUSD, activeCurrency);

    // Determine carrier based on freight method
    const carrier =
      effectiveShippingMethod === 'domestic_courier'
        ? 'TCS / Leopards Express Domestic Courier (Pakistan)'
        : effectiveShippingMethod === 'air_express'
        ? 'DHL Global Forwarding Express Air'
        : 'Maersk Ocean Container Logistics (LCL/FCL)';

    const trackingNumber =
      effectiveShippingMethod === 'domestic_courier'
        ? `TCS-PK-${Math.floor(10000000 + Math.random() * 90000000)}`
        : effectiveShippingMethod === 'air_express'
        ? `DHL-AIR-${Math.floor(100000000 + Math.random() * 900000000)}`
        : `MSK-OCN-${Math.floor(100000 + Math.random() * 900000)}`;

    const deliveryDays =
      effectiveShippingMethod === 'domestic_courier' ? 3 : effectiveShippingMethod === 'air_express' ? 8 : 26;
    const estDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newOrder = createOrder({
      customerId: `cust-${Date.now()}`,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone || '+1-000-000-0000',
      customerCompany: companyName,
      destinationCountry: country,
      items: cart,
      subtotalUSD: cartSubtotalUSD,
      discountUSD,
      couponCode: appliedCoupon?.code,
      shippingCostUSD: actualShippingCostUSD,
      customsTaxUSD,
      totalUSD: grandTotalUSD,
      paidCurrency: activeCurrency,
      paidCurrencyTotal,
      paidCurrencyRate: convertPrice(1, activeCurrency),
      shippingMethod: effectiveShippingMethod,
      shippingAddress: {
        fullName,
        companyName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode: resolvedPostalCode,
        country,
        phone,
        taxIdOrVat,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'international_card' ? 'paid' : 'pending_verification',
      orderStatus: 'pending',
      trackingNumber,
      carrier,
      estimatedDeliveryDate: estDate,
      commercialInvoiceNumber: `INV-CAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: `Order placed via Catify Trade (${effectiveShippingMethod === 'domestic_courier' ? 'Pakistan Domestic Retail/Single Order' : 'International Trade'}). Destination: ${city}, ${country}.`,
    });

    setIsSubmitting(false);
    navigateTo('order-success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">International Trade Checkout</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete consignee documentation, select ocean/air shipping tier, and authorize commercial payment.
        </p>
      </div>

      {/* Checkout Progress Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
        <button
          onClick={() => setStep(1)}
          className={`p-3 rounded-xl border text-center transition-all ${
            step === 1
              ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          1. Consignee &amp; Customs Address
        </button>
        <button
          onClick={() => {
            if (fullName && email && addressLine1) setStep(2);
          }}
          className={`p-3 rounded-xl border text-center transition-all ${
            step === 2
              ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          2. Freight &amp; Delivery Method
        </button>
        <button
          onClick={() => {
            if (fullName && email && addressLine1) setStep(3);
          }}
          className={`p-3 rounded-xl border text-center transition-all ${
            step === 3
              ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          3. Settlement &amp; Proforma Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900">Consignee &amp; International Delivery Address</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Johnathan Vance"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Importer Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Vance Trading Corp"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@company.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Mobile with Country Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address Line 1 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street, warehouse number, gate suite"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, unit, building, floor"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Port <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. California"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Postal Code / ZIP {isPakistanCheckout ? '(Optional)' : <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={!isPakistanCheckout}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder={isPakistanCheckout ? 'e.g. 54000 / 75500' : 'e.g. 94158'}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Country</label>
                  <select
                    value={country}
                    onChange={(e) => {
                      const nextCountry = e.target.value;
                      setCountry(nextCountry);
                      if (nextCountry === 'Pakistan') {
                        setShippingMethod('domestic_courier');
                        setPaymentMethod('cash_on_delivery');
                      } else if (shippingMethod === 'domestic_courier') {
                        setShippingMethod('air_express');
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Importer Tax ID / NTN / VAT (Optional)
                  </label>
                  <input
                    type="text"
                    value={taxIdOrVat}
                    onChange={(e) => setTaxIdOrVat(e.target.value)}
                    placeholder="Optional for 1-pc individual orders"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const hasPostal = isPakistanCheckout || Boolean(postalCode.trim());
                  if (fullName && email && addressLine1 && city && hasPostal) {
                    setStep(2);
                  }
                }}
                className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Shipping Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900">Select International Freight Mode</h2>

              <div className="space-y-3">
                {/* Pakistan Domestic Express Courier */}
                {isPakistanCheckout && (
                  <div
                    onClick={() => setShippingMethod('domestic_courier')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 ${
                      effectiveShippingMethod === 'domestic_courier'
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Pakistan Nationwide Courier (TCS / Leopards / Trax) 🇵🇰
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            Best for 1-Pc Orders
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Direct doorstep delivery across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan &amp; all cities with Cash on Delivery (COD) support.
                        </p>
                        <span className="text-xs font-medium text-slate-700 block mt-2">
                          Delivery Time: <strong>2 – 4 Business Days</strong>
                        </span>
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0 pl-11 sm:pl-0">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatPrice(domesticCostUSD)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Air Express */}
                <div
                  onClick={() => setShippingMethod('air_express')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 ${
                    effectiveShippingMethod === 'air_express'
                      ? 'border-blue-950 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-100 text-blue-950 shrink-0">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Air Express Freight (Priority Door-to-Door)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Fastest</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Dispatched via DHL Global Cargo or FedEx International. Full tracking with customs clearance at destination airport.
                      </p>
                      <span className="text-xs font-medium text-slate-700 block mt-2">
                        Transit: <strong>7 – 10 Business Days</strong>
                      </span>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0 pl-11 sm:pl-0">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatPrice(airCostUSD)}
                    </span>
                  </div>
                </div>

                {/* Ocean LCL / FCL */}
                <div
                  onClick={() => setShippingMethod('ocean_lcl')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 ${
                    shippingMethod === 'ocean_lcl'
                      ? 'border-blue-950 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                      <Ship className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Ocean Container Cargo (LCL Consolidated)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Most Economical for Bulk</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Direct vessel slot on Maersk / MSC container ships. Palletized and fumigated under ISPM-15 export regulations.
                      </p>
                      <span className="text-xs font-medium text-slate-700 block mt-2">
                        Transit: <strong>22 – 28 Days Port-to-Port</strong>
                      </span>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0 pl-11 sm:pl-0">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatPrice(oceanCostUSD)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Authorization */}
          {step === 3 && (
            <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Select Commercial Payment Gateway</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Supported international settlement methods according to cross-border trade guidelines
                </p>
              </div>

              {/* Payment Method Tabs */}
              <div className={`grid grid-cols-2 ${isPakistanCheckout ? 'sm:grid-cols-3' : 'sm:grid-cols-4'} gap-2 text-xs font-semibold`}>
                {isPakistanCheckout && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Truck className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                      <span>Cash on Delivery (COD)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('local_wallet_raast')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'local_wallet_raast'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      <span>JazzCash / EasyPaisa / Raast</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-950 bg-blue-50 text-blue-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-blue-900" />
                  <span>{isPakistanCheckout ? 'Bank / IBAN Transfer' : 'SWIFT Wire (T/T)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('international_card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'international_card'
                      ? 'border-blue-950 bg-blue-50 text-blue-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                  <span>Debit / Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-950 bg-blue-50 text-blue-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('letter_of_credit')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'letter_of_credit'
                      ? 'border-blue-950 bg-blue-50 text-blue-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  <span>Letter of Credit</span>
                </button>
              </div>

              {/* COD Info (Pakistan) */}
              {paymentMethod === 'cash_on_delivery' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-950 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Cash on Delivery (COD — All Cities Across Pakistan)</span>
                  </div>
                  <p className="text-emerald-900">
                    Pay in cash directly to the TCS / Leopards courier rider when your parcel arrives at your doorstep. Our team will confirm single-piece dispatch via WhatsApp ({settings.phone}).
                  </p>
                </div>
              )}

              {/* JazzCash / EasyPaisa / Raast Info (Pakistan) */}
              {paymentMethod === 'local_wallet_raast' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-800 leading-relaxed">
                  <div className="font-bold text-slate-900">JazzCash / EasyPaisa / Raast Instant PKR Payment</div>
                  <div>Mobile / Raast ID: <strong className="font-mono text-blue-950">{settings.phone}</strong></div>
                  <div>Account Title: <strong>{settings.bankDetails.beneficiaryName}</strong></div>
                  <p className="text-[11px] text-slate-500">
                    Send your payment screenshot along with your Order ID to WhatsApp ({settings.phone}) for same-day courier dispatch.
                  </p>
                </div>
              )}

              {/* Bank Transfer Details View */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 font-bold text-slate-900">
                    <span>Beneficiary Wire Details (Standard Chartered / Habib Bank)</span>
                    <button
                      type="button"
                      onClick={handleCopyIban}
                      className="text-blue-950 hover:underline flex items-center gap-1 text-[11px] shrink-0"
                    >
                      {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIban ? 'IBAN Copied!' : 'Copy IBAN'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 text-slate-700 break-words">
                    <div>Beneficiary: <strong className="text-slate-900">{settings.bankDetails.beneficiaryName}</strong></div>
                    <div>Bank: <strong className="text-slate-900">{settings.bankDetails.bankName}</strong></div>
                    <div>Account No: <strong className="text-slate-900 font-mono break-all">{settings.bankDetails.accountNumber}</strong></div>
                    <div>IBAN: <strong className="text-slate-900 font-mono break-all">{settings.bankDetails.iban}</strong></div>
                    <div>SWIFT / BIC: <strong className="text-slate-900 font-mono">{settings.bankDetails.swiftBic}</strong></div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-200">
                    {settings.bankDetails.instructions}
                  </p>
                </div>
              )}

              {/* Credit Card Input */}
              {paymentMethod === 'international_card' && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. Johnathan Vance"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Notice */}
              {paymentMethod === 'paypal' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  Upon clicking Confirm Order, you will authorize payment via PayPal Business Commercial Checkout with buyer trade protection.
                </div>
              )}

              {/* L/C Notice */}
              {paymentMethod === 'letter_of_credit' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  Orders over $5,000 are eligible for an Irrevocable At Sight Letter of Credit (L/C). Our trade finance desk will email SWIFT MT700 transmission details after order submission.
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    Confirm &amp; Place Order ({formatPrice(grandTotalUSD)})
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-slate-500">{cart.length} line items</span>
            </h3>

            {/* Items list */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 text-xs divide-y divide-slate-100">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex gap-3 items-start">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h5 className="font-semibold text-slate-900 line-clamp-2 leading-snug">{item.product.title}</h5>
                    <div className="text-[11px] text-slate-500">
                      Qty: {item.quantity} · {formatPrice(item.unitPriceUSD)} each
                    </div>
                    {(item.selectedPackaging || item.selectedColor || item.selectedSize) && (
                      <div className="text-[10px] text-slate-500 flex flex-wrap gap-x-2">
                        {item.selectedPackaging && <span>Pack: {item.selectedPackaging}</span>}
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-slate-900 tabular-nums shrink-0">
                    {formatPrice(item.unitPriceUSD * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(cartSubtotalUSD)}</span>
              </div>

              {discountUSD > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon ({appliedCoupon?.code}):</span>
                  <span className="tabular-nums">-{formatPrice(discountUSD)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>
                  Shipping (
                  {effectiveShippingMethod === 'domestic_courier'
                    ? 'Pakistan Courier'
                    : effectiveShippingMethod === 'air_express'
                    ? 'Air Express'
                    : 'Ocean Cargo'}
                  ):
                </span>
                <span className="tabular-nums text-slate-900">{formatPrice(actualShippingCostUSD)}</span>
              </div>

              <div className="flex justify-between">
                <span>{importedSubtotalRatio === 0 && isPakistanCheckout ? 'Local Tax / Duty (Domestic):' : 'Customs Duty & Import VAT:'}</span>
                <span className="tabular-nums text-slate-900">
                  {customsTaxUSD === 0 ? 'Exempt (0%)' : formatPrice(customsTaxUSD)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-950">
                <span>Grand Total:</span>
                <span className="text-blue-950 tabular-nums">{formatPrice(grandTotalUSD)}</span>
              </div>

              <div className="text-[11px] text-slate-400 text-right">
                Settlement in <strong>{activeCurrency}</strong> ({formatPrice(grandTotalUSD)})
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>International Trade Escrow &amp; Pre-Shipment Inspection Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
