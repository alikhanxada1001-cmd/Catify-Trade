import React, { useState, useEffect } from 'react';
import { useTrade } from '../context/TradeContext';
import { ProductCard } from './HomePage';
import {
  ShieldCheck,
  Globe,
  Ship,
  Plane,
  FileSpreadsheet,
  Plus,
  Minus,
  Heart,
  Star,
  CheckCircle,
  Truck,
  Building2,
  Phone,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductSlug,
    formatPrice,
    addToCart,
    openRFQModal,
    currentCountry,
    suppliers,
    navigateTo,
    isInWishlist,
    toggleWishlist,
    settings,
  } = useTrade();

  const product = products.find((p) => p.slug === selectedProductSlug) || products[0];

  const isPakistan = currentCountry.code === 'PK';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState<number>(
    product ? (isPakistan ? 1 : Math.max(1, product.moq)) : 1
  );
  const [selectedPackaging, setSelectedPackaging] = useState<string>(
    product?.variations?.packagingTypes?.[0] || 'Standard Export Packaging'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.variations?.colors?.[0] || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.variations?.sizes?.[0] || ''
  );
  const [activeTab, setActiveTab] = useState<'specs' | 'logistics' | 'compliance' | 'supplier' | 'reviews'>('specs');
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(currentCountry.code === 'PK' ? 1 : Math.max(1, product.moq));
      setSelectedPackaging(product.variations?.packagingTypes?.[0] || 'Standard Export Packaging');
      setSelectedColor(product.variations?.colors?.[0] || '');
      setSelectedSize(product.variations?.sizes?.[0] || '');
      setAddedNotice(false);
    }
  }, [product?.id, currentCountry.code]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-900">Product Not Found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-4 py-2 bg-blue-950 text-white rounded-lg text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Calculate unit price dynamically based on quantity tiers
  let activeUnitPriceUSD = product.salePriceUSD ?? product.regularPriceUSD;
  if (product.wholesaleTiers && product.wholesaleTiers.length > 0) {
    const tier = [...product.wholesaleTiers]
      .reverse()
      .find((t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty));
    if (tier) {
      activeUnitPriceUSD = tier.unitPriceUSD;
    } else if (quantity >= product.moq) {
      activeUnitPriceUSD = product.wholesalePriceUSD;
    }
  }

  const supplier = suppliers.find((s) => s.id === product.supplierId) || suppliers[0];

  // Freight & Customs estimates (Pakistan domestic vs cross-border import)
  const isDomesticPakistanOrder = isPakistan && product.countryOfOrigin === 'Pakistan';
  const estShippingUSD = isDomesticPakistanOrder
    ? 2.5 + (product.weightKg || 1) * quantity * 0.8
    : Math.max(isPakistan ? 8 : 30, (product.weightKg || 1) * quantity * (currentCountry.airShippingPerKgUSD || 14));
  const estCustomsDutyUSD = isDomesticPakistanOrder
    ? 0
    : (activeUnitPriceUSD * quantity * (currentCountry.importDutyPercent || 4)) / 100;

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      packaging: selectedPackaging,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      isWholesale: quantity >= product.moq,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb (Clean typography, no pills) */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <button onClick={() => navigateTo('home')} className="hover:text-slate-900">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button onClick={() => navigateTo('shop')} className="hover:text-slate-900">
          Catalog
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Contiguous Purchase Layout: Sticky Gallery Left, Contiguous Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
            <img
              src={product.images[activeImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200'}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-slate-700 hover:text-rose-600 shadow-md transition-colors"
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Trade Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2 text-xs">
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px]">HS CODE</span>
              <span className="font-mono font-bold text-slate-800">{product.hsCode}</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px]">COUNTRY OF ORIGIN</span>
              <span className="font-bold text-slate-800">{product.countryOfOrigin}</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-400 block text-[10px]">INSPECTION</span>
              <span className="font-bold text-emerald-700">ISO Audited</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title & Metadata */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span className="font-medium text-blue-900">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>SKU: {product.sku}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">{product.stock} units ready</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Pricing Block */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Unit Purchase Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {formatPrice(activeUnitPriceUSD)}
                  </span>
                  {product.salePriceUSD && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      {formatPrice(product.regularPriceUSD)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Minimum Order (MOQ)</span>
                <span className="text-sm font-bold text-blue-950 font-mono">{product.moq} units</span>
              </div>
            </div>

            {/* Wholesale Tier Breakdown Table */}
            {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Wholesale Bulk Volume Tiers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {product.wholesaleTiers.map((tier, idx) => {
                    const isActiveTier =
                      quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty);
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isActiveTier
                            ? 'bg-blue-950 text-white border-blue-950 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">
                          {tier.maxQty ? `${tier.minQty} - ${tier.maxQty} pcs` : `${tier.minQty}+ pcs`}
                        </div>
                        <div className="text-sm font-bold tabular-nums mt-0.5">
                          {formatPrice(tier.unitPriceUSD)}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isActiveTier ? 'text-amber-300' : 'text-emerald-700'}`}>
                          Save {tier.discountPercent}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Variations & Options */}
          <div className="space-y-4 text-xs">
            {product.variations?.packagingTypes && (
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Export Packaging Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variations.packagingTypes.map((pack) => (
                    <button
                      key={pack}
                      type="button"
                      onClick={() => setSelectedPackaging(pack)}
                      className={`px-3 py-2 text-left rounded-lg border transition-colors ${
                        selectedPackaging === pack
                          ? 'border-blue-950 bg-blue-50 text-blue-950 font-bold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {pack}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variations?.colors && (
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">Color / Finish Variant</label>
                <div className="flex flex-wrap gap-2">
                  {product.variations.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors ${
                        selectedColor === color
                          ? 'border-blue-950 bg-blue-950 text-white font-semibold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variations?.sizes && (
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">Specification / Size Option</label>
                <div className="flex flex-wrap gap-2">
                  {product.variations.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'border-blue-950 bg-blue-950 text-white font-semibold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Stepper & Single/Wholesale Quick Switcher */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700">Purchase Mode:</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(1)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                    quantity < product.moq
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  Single Piece (1 Pc)
                </button>
                {product.moq > 1 && (
                  <button
                    type="button"
                    onClick={() => setQuantity(product.moq)}
                    className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                      quantity >= product.moq
                        ? 'bg-blue-950 text-white border-blue-950'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    Wholesale MOQ ({product.moq} Pcs)
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Order Volume</span>
                <span className="text-[11px] text-slate-500">
                  Total weight: {((product.weightKg || 1) * quantity).toFixed(1)} kg
                </span>
              </div>

              <div className="flex items-center gap-3 border border-slate-300 rounded-xl p-1 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-14 text-center font-bold text-slate-900 focus:outline-none tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {quantity < product.moq && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isPakistan
                    ? `Pakistan Single-Item Retail Order (${quantity} pc): Ready to order directly from 1 unit without Wholesale MOQ (${product.moq} pcs).`
                    : `Single / Sample Retail Order (${quantity} pc): Ordered directly at standard unit rate without Wholesale MOQ (${product.moq} units).`}
                </span>
              </div>
            )}
          </div>

          {/* Primary Action Buttons: Add to Cart & RFQ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="py-3 px-4 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add to Cart ({formatPrice(activeUnitPriceUSD * quantity)})</span>
            </button>

            <button
              onClick={() => openRFQModal(product)}
              className="py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Request Custom RFQ</span>
            </button>
          </div>

          {addedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Item added to your trade cart! Review in checkout anytime.</span>
            </div>
          )}

          {/* Direct WhatsApp Trade Desk Support */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-900">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Have technical questions regarding this cargo?</span>
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Catify%20Trade,%20I%20have%20an%20inquiry%20regarding%20SKU%20${product.sku}%20(${product.title})`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0"
            >
              WhatsApp Us
            </a>
          </div>

          {/* Destination Shipping & Customs Preview Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-900 shrink-0" />
                <span>
                  {isDomesticPakistanOrder
                    ? 'Pakistan Domestic Courier (TCS / Leopards) 🇵🇰'
                    : `Estimated Freight to ${currentCountry.name} (${currentCountry.flag})`}
                </span>
              </span>
              <span className="text-slate-500 font-normal">
                {isDomesticPakistanOrder ? '2-4 Days Doorstep COD' : '7-10 Days Air Express'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>
                {isDomesticPakistanOrder ? 'Domestic Courier:' : 'Est. Air Cargo:'}{' '}
                <strong className="text-slate-900 font-semibold">{formatPrice(estShippingUSD)}</strong>
              </div>
              <div>
                {isDomesticPakistanOrder ? 'Local Import Duty:' : 'Est. Import Duty & Tax:'}{' '}
                <strong className="text-slate-900 font-semibold">
                  {isDomesticPakistanOrder ? 'Exempt (0%)' : formatPrice(estCustomsDutyUSD)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specs, Logistics, Compliance, Supplier, Reviews */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px text-xs font-semibold">
          {[
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'logistics', label: 'Logistics & Packaging' },
            { id: 'compliance', label: 'Trade Compliance' },
            { id: 'supplier', label: 'Verified Manufacturer' },
            { id: 'reviews', label: `Importer Reviews (${product.reviewsCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-950 text-blue-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Detailed Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">{key}</span>
                  <span className="text-slate-900 font-semibold sm:text-right">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Logistics */}
        {activeTab === 'logistics' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Packaging, Dimensions &amp; Container Stowage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Unit Weight</span>
                <span className="text-sm font-bold text-slate-900 mt-1">{product.weightKg} kg</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Carton Dimensions</span>
                <span className="text-sm font-bold text-slate-900 mt-1">
                  {product.dimensionsCm.length} × {product.dimensionsCm.width} × {product.dimensionsCm.height} cm
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Customs Classification</span>
                <span className="text-sm font-bold text-slate-900 mt-1">HS Code {product.hsCode}</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed pt-2">
              All consignments are packed with moisture-resistant desiccant packs, fumigated heat-treated ISPM-15 wooden pallets, and heavy-duty shrink wrapping suitable for sea container freight and air express transit.
            </p>
          </div>
        )}

        {/* Tab 3: Compliance */}
        {activeTab === 'compliance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Trade Documents &amp; Regulatory Declarations</h3>
            <p className="text-slate-600 leading-relaxed">
              Every dispatched commercial order includes complete international shipping paperwork required by customs authorities:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Commercial Invoice with HS Code</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Certified Packing List &amp; Weight Slip</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Chamber of Commerce Certificate of Origin</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Bill of Lading (B/L) or Air Waybill (AWB)</span>
              </li>
            </ul>
          </div>
        )}

        {/* Tab 4: Supplier Profile */}
        {activeTab === 'supplier' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-slate-500">Verified Plant &amp; Supplier</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{supplier.name}</h3>
                <p className="text-slate-500 mt-1">{supplier.flag} {supplier.city}, {supplier.country}</p>
              </div>
              <div className="sm:text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] inline-block">
                  Audited &amp; Verified
                </span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">{supplier.about}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Export Experience</span>
                <span className="font-bold text-slate-900">{supplier.exportYears} Years</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Response Rate</span>
                <span className="font-bold text-slate-900">{supplier.responseRate}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Annual Revenue</span>
                <span className="font-bold text-slate-900">{supplier.annualRevenue}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block text-[10px]">Staff Count</span>
                <span className="font-bold text-slate-900">{supplier.staffCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Reviews */}
        {activeTab === 'reviews' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Verified Importer Feedback</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Dieter Schneider · Germany</span>
                  <div className="flex text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-500" /><Star className="w-3.5 h-3.5 fill-amber-500" /><Star className="w-3.5 h-3.5 fill-amber-500" /><Star className="w-3.5 h-3.5 fill-amber-500" /><Star className="w-3.5 h-3.5 fill-amber-500" /></div>
                </div>
                <p className="text-slate-600">Material compliance and dimensional tolerance were on point. Arrived with full customs bill of lading at Hamburg port.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Related Products in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
