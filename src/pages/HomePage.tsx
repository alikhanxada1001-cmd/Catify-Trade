import React from 'react';
import { useTrade } from '../context/TradeContext';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Globe,
  Ship,
  Plane,
  FileSpreadsheet,
  CheckCircle,
  Truck,
  Building,
  Star,
  ChevronRight,
  Award,
  Layers,
  Heart,
  Eye,
  Plus,
} from 'lucide-react';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    suppliers,
    navigateTo,
    formatPrice,
    addToCart,
    openRFQModal,
    isInWishlist,
    toggleWishlist,
    searchQuery,
    setSearchQuery,
    settings,
  } = useTrade();

  const featuredProducts = products.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 4);
  const wholesaleProducts = products.filter((p) => p.isWholesaleOnly || p.moq > 1).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Campaign Showcase */}
      <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=2000"
            alt="International Ocean Port Logistics"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            {/* Subtle Text Kicker (No Pill Enclosure) */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <span>Global Trade & Sourcing</span>
              <span aria-hidden="true">·</span>
              <span>Wholesale Product Discovery</span>
              <span aria-hidden="true">·</span>
              <span>Global Sourcing</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Discover Products and Coordinate <span className="text-gold-gradient">Wholesale Trade</span> with Confidence
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Catify Trade helps international buyers discover products, compare sourcing options, and coordinate wholesale inquiries, quality checks, and shipping requirements with clear communication.
            </p>

            {/* Quick Search & Category Bar */}
            <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, HS codes, or raw commodities..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Search Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-300 flex-wrap">
              <button
                onClick={() => navigateTo('wholesale')}
                className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Wholesale B2B Bulk Tier</span>
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => openRFQModal(null)}
                className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Submit Custom RFQ</span>
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => navigateTo('track-order')}
                className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
              >
                <Ship className="w-4 h-4 text-amber-400" />
                <span>Track Cargo Status</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trade service highlights — factual service capabilities, not unverified statistics */}
        <div className="border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0"><Layers className="w-5 h-5" /></div>
                <div><div className="text-sm font-bold text-white">Wholesale Sourcing</div><div className="text-[11px] text-slate-400 mt-0.5">Bulk product inquiries</div></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
                <div><div className="text-sm font-bold text-white">Quality Coordination</div><div className="text-[11px] text-slate-400 mt-0.5">Inspection requirements</div></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center shrink-0"><Ship className="w-5 h-5" /></div>
                <div><div className="text-sm font-bold text-white">Shipping Support</div><div className="text-[11px] text-slate-400 mt-0.5">Air and sea freight options</div></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-400/10 text-violet-400 flex items-center justify-center shrink-0"><FileSpreadsheet className="w-5 h-5" /></div>
                <div><div className="text-sm font-bold text-white">Custom Quotations</div><div className="text-[11px] text-slate-400 mt-0.5">Request pricing and details</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Trade Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Key Trade Categories</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Sample apparel and accessory categories available for product enquiries</p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1 group shrink-0 self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('shop')}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold text-white">
                  {cat.productCount}+ Active Trade Listings
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-blue-900">
                  <span>Explore Direct Sourcing</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured International Products (Clean Card Hierarchy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Featured Trade Catalog</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Sample listings for product discovery. Confirm availability, final pricing and shipping before ordering.</p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1 group shrink-0 self-start sm:self-auto"
          >
            <span>View Full Catalog</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Wholesale & B2B Spotlight Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Tiered Volume Discounts · Minimum Order Quantities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Wholesale &amp; Container Bulk Purchasing</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Share your target quantity and destination to request wholesale pricing. Supplier capacity, lead times and final terms are confirmed case by case.
              </p>
            </div>
            <button
              onClick={() => navigateTo('wholesale')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 self-start shrink-0"
            >
              <span>Access Wholesale Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wholesaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} isWholesaleCard />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Import & Export Services Solutions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Sourcing &amp; Trade Support</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            We help buyers organize product requirements and request information about sourcing, quality checks and shipping options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
              <Ship className="w-6 h-6 text-blue-900" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Import Documentation Guidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We can help identify the product information and documents buyers may need to discuss with a licensed customs broker. We do not act as a customs authority or broker.
            </p>
            <button
              onClick={() => navigateTo('import-services')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1"
            >
              <span>Explore Import Guidance</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Plane className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Shipping Options</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Depending on route and volume, courier, air or sea freight may be suitable. Carrier availability, costs and transit estimates require confirmation.
            </p>
            <button
              onClick={() => navigateTo('export-services')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1"
            >
              <span>Explore Shipping Information</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pre-Shipment Quality Audits</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              On-site factory quality control, tolerance verification, packaging drop tests, and laboratory purity testing before bill of lading issuance and escrow payout.
            </p>
            <button
              onClick={() => navigateTo('request-quote')}
              className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1"
            >
              <span>Request Inspection Quote</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Verified International Suppliers Directory Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Supplier Onboarding</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Supplier profiles will appear here after identity and credentials have been checked.</p>
          </div>
          <button
            onClick={() => navigateTo('suppliers')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1 group shrink-0 self-start sm:self-auto"
          >
            <span>Supplier Directory</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {suppliers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <p className="text-sm font-semibold text-slate-800">No verified supplier profiles published yet.</p>
            <p className="mt-1 text-xs text-slate-500">We only publish supplier details after checks are completed.</p>
          </div>
        ) : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.slice(0, 3).map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => navigateTo('supplier-detail', { id: supplier.id })}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>{supplier.flag}</span>
                      <span>{supplier.city}, {supplier.country}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{supplier.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{supplier.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {supplier.about}
                </p>

                {/* Certifications text */}
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-1">
                  {supplier.certifications.map((cert) => (
                    <span key={cert} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{supplier.exportYears} yrs exporting</span>
                <span className="text-blue-900 font-semibold flex items-center gap-1">
                  <span>View Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>}
      </section>

      {/* 7. Why Choose Catify Trade (Adjacency & Quantitative Rigor) */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                International Commerce Standard
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Eliminating Friction in Cross-Border Trade &amp; Sourcing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Importing and exporting between continents involves currency fluctuations, customs regulations, and supplier reliability risks. Catify Trade solves these structural challenges through integrated escrow, verified factory audits, and multi-currency bank wire settlements.
              </p>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Zero-Risk Escrow Protection</h4>
                    <p className="text-slate-500 mt-0.5">Funds are held in secure commercial escrow until you inspect and approve the cargo at the destination port.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Multi-Currency Bank Settlement (SWIFT MT103)</h4>
                    <p className="text-slate-500 mt-0.5">Pay in USD, EUR, GBP, AED, PKR, CNY, or JPY without predatory currency conversion markups.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Dedicated Port Trade Desk Agent</h4>
                    <p className="text-slate-500 mt-0.5">Direct point of contact on WhatsApp (+92 324 7615133) and email (tardecatify@gmail.com) for real-time vessel updates.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => openRFQModal(null)}
                  className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <span>Request Custom Trade Quote</span>
                </button>
                <button
                  onClick={() => navigateTo('about')}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
                >
                  About Our Operations
                </button>
              </div>
            </div>

            {/* Visual Brand Showcase */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/Catify_Trade_Circular_Logo_df00bcb5.png"
                  alt="Catify Trade Official Seal"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-full border border-amber-400/40 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900">Catify Trade International</h3>
                  <p className="text-xs text-slate-500">Global Trade Network &amp; Sourcing Desk</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Incoterms Supported</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">FOB · CIF · DDP · EXW</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Customs Clearance</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">100% Compliant</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Trade Verification</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">ISO &amp; GOTS Audited</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-500">Support Desk</div>
                  <div className="text-sm font-bold text-emerald-600 mt-1">24/7 WhatsApp Response</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Direct Corporate Contact:</strong> Email <a href={`mailto:${settings.email}`} className="underline font-semibold">{settings.email}</a> or message trade officers directly at <span className="font-semibold">{settings.phone}</span>.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Product Card Component
interface ProductCardProps {
  product: Product;
  isWholesaleCard?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isWholesaleCard }) => {
  const { navigateTo, formatPrice, addToCart, openRFQModal, isInWishlist, toggleWishlist, currentCountry } = useTrade();
  const addQty = !isWholesaleCard || currentCountry.code === 'PK' ? 1 : product.moq || 1;

  return (
    <div className="group rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      {/* Product Image */}
      <div
        onClick={() => navigateTo('product-detail', { slug: product.slug })}
        className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-slate-700 hover:text-rose-600 shadow-xs transition-colors"
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Subtle Text Tag (No pill capsule) */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] text-white font-medium">
          Origin: {product.countryOfOrigin}
        </div>
      </div>

      {/* Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="truncate">{product.category}</span>
            <span className="shrink-0 font-medium">MOQ: {product.moq}</span>
          </div>

          <h3
            onClick={() => navigateTo('product-detail', { slug: product.slug })}
            className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors mt-1 line-clamp-2 cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div>
              <div className="text-xs text-slate-500">
                {isWholesaleCard && currentCountry.code !== 'PK' ? 'Wholesale Price' : 'Unit Price (1+ pc)'}
              </div>
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {formatPrice(product.salePriceUSD ?? product.regularPriceUSD)}
              </div>
            </div>

            {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                  Bulk: {formatPrice(product.wholesaleTiers[product.wholesaleTiers.length - 1].unitPriceUSD)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
            <button
              onClick={() => openRFQModal(product)}
              className="w-full py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <FileSpreadsheet className="w-3 h-3 text-slate-600 shrink-0" />
              <span>RFQ</span>
            </button>
            <button
              onClick={() => addToCart(product, addQty, { isWholesale: addQty >= product.moq })}
              className="w-full py-2 px-2 bg-blue-950 hover:bg-blue-900 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <Plus className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{addQty === 1 ? 'Add 1 Pc' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
