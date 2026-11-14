import React, { useState, useEffect } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileSpreadsheet,
  Globe,
  Settings,
  ShieldAlert,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Truck,
  RotateCcw,
  Tag,
  Building2,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Ship,
  Plane,
  LogOut,
  Menu,
  Images,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { Product, Order, OrderStatus, RFQ, TradeInquiry, Coupon, CurrencyCode, Currency } from '../types';
import { AdminLoginPage } from './AdminLoginPage';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    categories,
    saveProduct,
    deleteProduct,
    uploadProductImage,
    listMediaAssets,
    deleteMediaAsset,
    orders,
    updateOrder,
    rfqs,
    updateRFQ,
    inquiries,
    updateInquiry,
    suppliers,
    countries,
    currencies,
    updateCurrencyRate,
    coupons,
    settings,
    updateSettings,
    adminLogs,
    resetAllData,
    formatPrice,
    navigateTo,
    setUserRole,
    isAdminAuthenticated,
    logoutAdmin,
  } = useTrade();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'media' | 'orders' | 'rfqs' | 'inquiries' | 'currencies' | 'settings' | 'logs'
  >('overview');

  // Product Add / Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productActionError, setProductActionError] = useState('');
  const [isProductSaving, setIsProductSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<Array<{ key: string; size: number; uploaded: string | null; url: string }>>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [mediaNotice, setMediaNotice] = useState('');
  useEffect(() => {
    if (activeTab !== 'media') return;
    let mounted = true;
    setMediaLoading(true);
    setMediaError('');
    listMediaAssets()
      .then((items) => { if (mounted) setMediaItems(items); })
      .catch((error) => { if (mounted) setMediaError(error instanceof Error ? error.message : 'Could not load media.'); })
      .finally(() => { if (mounted) setMediaLoading(false); });
    return () => { mounted = false; };
  }, [activeTab]);


  const [rfqActionError, setRfqActionError] = useState('');

  // Order Update Modal state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // RFQ Quote modal state
  const [editingRFQ, setEditingRFQ] = useState<RFQ | null>(null);
  const [rfqQuotePrice, setRfqQuotePrice] = useState<number>(0);
  const [rfqLeadDays, setRfqLeadDays] = useState<number>(14);
  const [rfqNotes, setRfqNotes] = useState<string>('');

  // Settings form state
  const [settingsBrand, setSettingsBrand] = useState(settings.brandName);
  const [settingsEmail, setSettingsEmail] = useState(settings.email);
  const [settingsPhone, setSettingsPhone] = useState(settings.phone);
  const [settingsDomain, setSettingsDomain] = useState(settings.domain);
  const [settingsHero, setSettingsHero] = useState(settings.heroHeading);
  const [settingsSubhero, setSettingsSubhero] = useState(settings.heroSubheading);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // Financial Computations for Overview
  const totalRevenueUSD = orders.reduce((sum, o) => sum + o.totalUSD, 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const pendingRFQsCount = rfqs.filter((r) => r.status === 'pending').length;

  const handleOpenNewProduct = () => {
    setProductActionError('');
    setEditingProduct({
      id: `prod-custom-${Date.now()}`,
      title: '',
      slug: '',
      sku: `CT-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      hsCode: '8481.80.00',
      category: 'Jackets & Outerwear',
      subcategory: 'Apparel',
      shortDescription: '',
      description: '',
      images: [],
      countryOfOrigin: 'Pakistan',
      manufacturingDetails: 'Certified ISO 9001 Partner Plant',
      regularPriceUSD: 100,
      wholesalePriceUSD: 75,
      moq: 10,
      stock: 100,
      weightKg: 2.5,
      dimensionsCm: { length: 20, width: 20, height: 20 },
      status: 'published',
      isFeatured: false,
      isWholesaleOnly: false,
      isNewArrival: true,
      isBestSeller: false,
      wholesaleTiers: [
        { minQty: 10, maxQty: 49, unitPriceUSD: 85, discountPercent: 15 },
        { minQty: 50, maxQty: null, unitPriceUSD: 75, discountPercent: 25 },
      ],
      specifications: { 'Standard': 'ISO Standard', 'Material': 'Alloy Steel' },
      shippingAvailability: ['ALL'],
      supplierId: suppliers[0]?.id || 'sup-apex-machinery',
      supplierName: suppliers[0]?.name || 'Apex Precision',
      rating: 5.0,
      reviewsCount: 1,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.sku || isProductSaving) return;
    const slug = editingProduct.slug || editingProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const completeProduct: Product = { ...(editingProduct as Product), slug };
    setIsProductSaving(true);
    setProductActionError('');
    try {
      await saveProduct(completeProduct);
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      setProductActionError(error instanceof Error ? error.message : 'Product could not be saved. Please retry.');
    } finally {
      setIsProductSaving(false);
    }
  };

  const handleSaveOrderUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateOrder(editingOrder);
    setEditingOrder(null);
  };

  const handleSaveRFQQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRFQ) return;
    setRfqActionError('');
    try {
      await updateRFQ({
        ...editingRFQ,
        status: 'quoted',
        adminQuotedPriceUSD: Number(rfqQuotePrice),
        adminLeadTimeDays: Number(rfqLeadDays),
        adminNotes: rfqNotes,
      });
      setEditingRFQ(null);
    } catch (error) {
      setRfqActionError(error instanceof Error ? error.message : 'Could not update this quotation. Please retry.');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      brandName: settingsBrand,
      email: settingsEmail,
      phone: settingsPhone,
      whatsapp: settingsPhone,
      domain: settingsDomain,
      heroHeading: settingsHero,
      heroSubheading: settingsSubhero,
    });
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-7 py-5 sm:py-7 space-y-6">
      {/* Compact, mobile-first Admin Title Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open admin navigation"
            aria-expanded={isSidebarOpen}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img
            src="/assets/aistudio/Catify_Trade_Circular_Logo_df00bcb5.png"
            alt="Catify Trade official logo"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-contain bg-white ring-2 ring-amber-400/70 shadow-md shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Central Management Console</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold leading-tight text-white">
              Catify Trade Admin<span className="hidden sm:inline"> Operations</span>
            </h1>
            <p className="hidden sm:block text-xs text-slate-300 mt-1 break-all">Admin: tardecatify@gmail.com · Live Multi-Currency Database</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full">
          <button
            onClick={() => {
              setUserRole('customer');
              navigateTo('home');
            }}
            className="min-h-11 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            ← View Storefront
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset catalog, orders, and RFQs to default test dataset?')) {
                resetAllData();
              }
            }}
            className="min-h-11 px-3 sm:px-4 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs sm:text-sm font-semibold rounded-xl border border-rose-800/50 transition-colors flex items-center justify-center gap-1.5"
            title="Reset to initial data"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Reset Data</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="col-span-2 sm:col-span-1 min-h-11 sm:ml-auto px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            title="Lock Admin Console and Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* ChatGPT-style responsive admin navigation drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close admin navigation"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[min(86vw,320px)] bg-white shadow-2xl border-r border-slate-200 p-4 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-2 pt-2 pb-5 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Catify Trade</p>
                <p className="mt-1 text-base font-extrabold text-slate-900">Admin Menu</p>
              </div>
              <button type="button" onClick={() => setIsSidebarOpen(false)} aria-label="Close menu" className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 pt-4 text-sm font-semibold">
              {[
                { id: 'overview', label: 'Financial Overview', icon: LayoutDashboard },
                { id: 'products', label: `Products (${products.length})`, icon: Package },
                { id: 'media', label: 'Media Library', icon: Images },
                { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
                { id: 'rfqs', label: `RFQs & Quotes (${rfqs.length})`, icon: FileSpreadsheet },
                { id: 'inquiries', label: `Trade Leads (${inquiries.length})`, icon: Truck },
                { id: 'currencies', label: `Currencies & Rates (${currencies.length})`, icon: DollarSign },
                { id: 'settings', label: 'Store Settings & Brand', icon: Settings },
                { id: 'logs', label: `Audit Trail (${adminLogs.length})`, icon: ShieldAlert },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }}
                    className={`px-3.5 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 text-left w-full ${
                      activeTab === tab.id
                        ? 'bg-blue-950 text-white shadow-md shadow-blue-950/15 font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeTab === tab.id ? 'bg-white/10 text-amber-300' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="truncate">{tab.label}</span>
                    {activeTab === tab.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
      <div className="w-full">
      <main className="flex-1 min-w-0 w-full space-y-6">

      {/* TAB 1: Financial Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Commercial Revenue</span>
              <div className="text-2xl font-extrabold text-blue-950 font-mono tabular-nums mt-1">
                {formatPrice(totalRevenueUSD)}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Live calculated from confirmed orders</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Consignments</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                {orders.length} Orders
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">{pendingOrdersCount} in active freight/customs</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pending RFQs</span>
              <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums mt-1">
                {pendingRFQsCount} Requests
              </div>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Awaiting proforma quote issuance</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Catalog Inventory</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                {products.length} Products
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Across {countries.length} destination shipping zones</span>
            </div>
          </div>

          {/* Recent Orders in Admin */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Commercial Consignments</h3>
              <button onClick={() => setActiveTab('orders')} className="text-xs text-blue-950 hover:underline font-semibold">
                Manage All Orders →
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="font-medium text-slate-700">{o.customerName} ({o.destinationCountry})</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-500">{o.items.length} items</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 tabular-nums">{formatPrice(o.totalUSD)}</span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-blue-100 text-blue-900">
                      {o.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Media Library</h2>
              <p className="text-sm text-slate-500">Images stored in Catify-Trade Cloudflare R2 storage.</p>
            </div>
            <button type="button" onClick={async () => {
              setMediaLoading(true); setMediaError(''); setMediaNotice('');
              try { setMediaItems(await listMediaAssets()); }
              catch (error) { setMediaError(error instanceof Error ? error.message : 'Could not load media.'); }
              finally { setMediaLoading(false); }
            }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-sm font-bold text-white">
              <RefreshCw className={`h-4 w-4 ${mediaLoading ? 'animate-spin' : ''}`} /> Refresh Library
            </button>
          </div>
          {mediaError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{mediaError}</p>}
          {mediaNotice && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{mediaNotice}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mediaItems.map((item) => (
              <article key={item.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={item.url} alt={item.key} loading="lazy" className="h-36 w-full bg-slate-100 object-cover" />
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-semibold text-slate-700" title={item.key}>{item.key}</p>
                  <p className="text-[11px] text-slate-400">{(item.size / 1024).toFixed(1)} KB</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={async () => {
                      try { await navigator.clipboard.writeText(item.url); setMediaNotice('Image URL copied.'); }
                      catch { setMediaError('Clipboard access unavailable in this browser.'); }
                    }} className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700">
                      <Copy className="h-3.5 w-3.5" /> Copy URL
                    </button>
                    <button type="button" onClick={async () => {
                      if (!window.confirm('Permanently delete this image from R2? Product listings using it may show a broken image.')) return;
                      try { await deleteMediaAsset(item.key); setMediaItems(current => current.filter(x => x.key !== item.key)); setMediaNotice('Image deleted from storage.'); }
                      catch (error) { setMediaError(error instanceof Error ? error.message : 'Image could not be deleted.'); }
                    }} aria-label="Delete image" className="rounded-lg border border-rose-200 px-2 py-2 text-rose-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!mediaLoading && mediaItems.length === 0 && !mediaError && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Images className="mx-auto mb-3 h-8 w-8 text-slate-400" />
              <p className="font-semibold text-slate-700">No uploaded images found</p>
              <p className="mt-1 text-sm text-slate-500">Upload an image from Products → Add/Edit Product. It will appear here.</p>
            </div>
          )}
          <p className="text-xs text-slate-500">Note: Deleting an image removes the R2 object permanently. Remove it only when no product uses it.</p>
        </section>
      )}

      {/* TAB 2: Products Management (Full CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Product &amp; Commodity Catalog Management
            </h2>
            <button
              onClick={handleOpenNewProduct}
              className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Trade Product</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full min-w-[780px] text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4">HS Code</th>
                  <th className="py-3 px-4">Origin</th>
                  <th className="py-3 px-4 text-right">Retail Price</th>
                  <th className="py-3 px-4 text-right">Wholesale Tier</th>
                  <th className="py-3 px-4 text-right">MOQ</th>
                  <th className="py-3 px-4 text-right">Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{p.sku}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{p.hsCode}</td>
                    <td className="py-3 px-4">{p.countryOfOrigin}</td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {formatPrice(p.salePriceUSD ?? p.regularPriceUSD)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-bold tabular-nums">
                      {formatPrice(p.wholesalePriceUSD)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-950">{p.moq}</td>
                    <td className="py-3 px-4 text-right font-mono">{p.stock}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setProductActionError('');
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-950 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${p.title}"?`)) {
                              void deleteProduct(p.id).catch((error) => setProductActionError(error instanceof Error ? error.message : 'Product could not be deleted.'));
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            International Order &amp; Cargo Fulfillment
          </h2>

          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{o.orderNumber}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="font-semibold text-slate-800">{o.customerName}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-500">{o.destinationCountry}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm tabular-nums">{formatPrice(o.totalUSD)}</span>
                    <button
                      onClick={() => setEditingOrder(o)}
                      className="px-3 py-1 bg-blue-950 text-white rounded-lg font-semibold hover:bg-blue-900"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                  <div>Carrier: <strong className="text-slate-900">{o.carrier}</strong></div>
                  <div>Tracking: <strong className="text-slate-900 font-mono">{o.trackingNumber}</strong></div>
                  <div>Delivery Est: <strong className="text-slate-900 font-mono">{o.estimatedDeliveryDate}</strong></div>
                  <div>Current Status: <strong className="text-blue-950 capitalize">{o.orderStatus.replace('_', ' ')}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RFQs & Quotes Management */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Wholesale RFQs &amp; Proforma Quotations
          </h2>

          <div className="space-y-3">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{rfq.rfqNumber}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="font-bold text-slate-900">{rfq.productTitle}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-600">Buyer: {rfq.buyerName} ({rfq.buyerCompany})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        rfq.status === 'quoted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rfq.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditingRFQ(rfq);
                        setRfqQuotePrice(rfq.adminQuotedPriceUSD || rfq.targetPriceUSD || 50);
                        setRfqLeadDays(rfq.adminLeadTimeDays || 14);
                        setRfqNotes(rfq.adminNotes || '');
                      }}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg"
                    >
                      Issue Quote
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                  <div>Qty: <strong className="text-slate-900">{rfq.quantity} pcs</strong></div>
                  <div>Incoterm: <strong className="text-slate-900">{rfq.incoterm}</strong></div>
                  <div>Dest Port: <strong className="text-slate-900">{rfq.destinationPort}</strong></div>
                  <div>Buyer Target: <strong className="text-slate-900">${rfq.targetPriceUSD}</strong></div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700">
                  <strong>Specifications: </strong> {rfq.specifications || 'Standard export packaging requested.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Trade Leads & Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Import / Export Trade Inquiries
          </h2>
          {rfqActionError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{rfqActionError}</div>}

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">
                    {inq.companyName} ({inq.contactPerson}) · <span className="text-blue-900 capitalize">{inq.serviceType.replace('_', ' ')}</span>
                  </div>
                  <select
                    aria-label={`Update status for inquiry from ${inq.companyName}`}
                    value={inq.status}
                    onChange={(e) => void updateInquiry({ ...inq, status: e.target.value as TradeInquiry['status'] }).catch((error) => setRfqActionError(error instanceof Error ? error.message : 'Inquiry status could not be updated.'))}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase text-slate-700"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal_sent">Proposal sent</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="text-slate-600 break-words">
                  Email: <a href={`mailto:${inq.email}`} className="text-blue-900 underline break-all">{inq.email}</a> · Phone: {inq.phone}
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700">
                  <div>Route: {inq.originCountry} → {inq.destinationCountry} · Est. Volume: {inq.estimatedVolume}</div>
                  <div className="mt-1">Details: {inq.cargoDetails}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Currencies & Rates Editor */}
      {activeTab === 'currencies' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Configurable Exchange Rates &amp; Multi-Currency Settlement
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full min-w-[540px] text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4">Symbol</th>
                  <th className="py-3 px-4">Exchange Rate to 1 USD</th>
                  <th className="py-3 px-4 text-right">Quick Rate Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currencies.map((curr) => (
                  <tr key={curr.code} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{curr.name} ({curr.code})</td>
                    <td className="py-3 px-4 font-mono">{curr.symbol}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-950">{curr.rateToUSD}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={curr.rateToUSD}
                          onBlur={(e) => updateCurrencyRate(curr.code, Number(e.target.value))}
                          className="w-24 px-2 py-1 text-xs border border-slate-300 rounded font-mono text-right"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: Website Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-2xl text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">Brand Identity &amp; Portal Settings</h2>
            <p className="text-slate-500 mt-0.5">Manage official contact information and configurable domain connection</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settingsBrand}
                onChange={(e) => setSettingsBrand(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Trade Desk Email</label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Phone / WhatsApp</label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Configurable Website Domain (For future DNS connection)
              </label>
              <input
                type="text"
                value={settingsDomain}
                onChange={(e) => setSettingsDomain(e.target.value)}
                placeholder="catifytrade.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hero Headline</label>
              <input
                type="text"
                value={settingsHero}
                onChange={(e) => setSettingsHero(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hero Subheading</label>
              <textarea
                rows={2}
                value={settingsSubhero}
                onChange={(e) => setSettingsSubhero(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {settingsSavedNotice && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Settings saved successfully!</span>
                </span>
              )}
              <button
                type="submit"
                className="sm:ml-auto px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-xl transition-colors"
              >
                Save Website Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 8: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Administrative Audit Trail &amp; Activity Log
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100 text-xs">
            {adminLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-blue-950">{log.action}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-slate-700 break-all">{log.target}</span>
                  </div>
                  <p className="text-slate-600 break-words">{log.details}</p>
                </div>
                <div className="sm:text-right text-[11px] text-slate-400 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      </main>
      </div>

      {/* Edit Product Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-4 sm:my-8 max-h-[92dvh] flex flex-col">
            <div className="px-4 py-4 sm:px-6 bg-blue-950 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm">
                {editingProduct.id ? 'Edit Commercial Product' : 'Add New Trade Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
              {productActionError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-rose-700 font-medium">{productActionError}</div>}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    required
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HS Code (Customs) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.hsCode || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hsCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Retail Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.regularPriceUSD || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, regularPriceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wholesale Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.wholesalePriceUSD || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, wholesalePriceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Minimum Order (MOQ)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.moq || 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, moq: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Country</label>
                  <input
                    type="text"
                    value={editingProduct.countryOfOrigin || 'Germany'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, countryOfOrigin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Available</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-700 mb-1">Product Images (R2 storage)</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isImageUploading || isProductSaving}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setProductActionError('');
                    setIsImageUploading(true);
                    try {
                      const imageUrl = await uploadProductImage(file);
                      setEditingProduct((current) => current ? { ...current, images: [...(current.images || []), imageUrl] } : current);
                    } catch (error) {
                      setProductActionError(error instanceof Error ? error.message : 'Image upload failed.');
                    } finally {
                      setIsImageUploading(false);
                      event.target.value = '';
                    }
                  }}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-900 hover:file:bg-blue-100"
                />
                {isImageUploading && <p className="text-xs text-blue-700">Uploading image securely to Cloudflare R2…</p>}
                {!!editingProduct.images?.length && (
                  <div className="flex flex-wrap gap-2">
                    {editingProduct.images.map((image, index) => (
                      <div key={image + index} className="relative">
                        <img src={image} alt={`Product image ${index + 1}`} className="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
                        <button type="button" onClick={() => setEditingProduct({ ...editingProduct, images: (editingProduct.images || []).filter((_, imageIndex) => imageIndex !== index) })} className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 py-0.5 text-white" aria-label="Remove image">×</button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-slate-500">JPG, PNG, WebP or other image formats · Maximum 8 MB per image.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Listing Status</label>
                <select
                  value={editingProduct.status || 'draft'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as Product['status'] })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProductSaving || isImageUploading}
                  className="px-5 py-2 bg-blue-950 text-white font-bold rounded-lg hover:bg-blue-900 disabled:opacity-60"
                >
                  {isProductSaving ? 'Saving…' : 'Save Product Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-4 sm:my-8 max-h-[92dvh] flex flex-col">
            <div className="px-4 py-4 sm:px-6 bg-blue-950 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm truncate">Update Consignment {editingOrder.orderNumber}</h3>
              <button onClick={() => setEditingOrder(null)} className="text-slate-300 hover:text-white shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderUpdate} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consignment Status</label>
                <select
                  value={editingOrder.orderStatus}
                  onChange={(e) => setEditingOrder({ ...editingOrder, orderStatus: e.target.value as OrderStatus })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white capitalize font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing &amp; Inspection</option>
                  <option value="export_cleared">Export Customs Cleared</option>
                  <option value="in_transit">In Transit (Air / Sea)</option>
                  <option value="customs_clearing">Port Customs Clearing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Carrier</label>
                <input
                  type="text"
                  value={editingOrder.carrier}
                  onChange={(e) => setEditingOrder({ ...editingOrder, carrier: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={editingOrder.trackingNumber}
                  onChange={(e) => setEditingOrder({ ...editingOrder, trackingNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-950 text-white font-bold rounded-lg hover:bg-blue-900"
                >
                  Save Consignment Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue RFQ Quote Modal */}
      {editingRFQ && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-4 sm:my-8 max-h-[92dvh] flex flex-col">
            <div className="px-4 py-4 sm:px-6 bg-amber-400 text-slate-950 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm truncate">Issue Proforma Quote for {editingRFQ.rfqNumber}</h3>
              <button onClick={() => setEditingRFQ(null)} className="text-slate-800 hover:text-slate-950 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRFQQuote} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
              {rfqActionError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{rfqActionError}</div>}
              <div className="text-slate-600">
                Buyer: <strong>{editingRFQ.buyerName}</strong> ({editingRFQ.buyerCompany})
                <div>Item: {editingRFQ.productTitle} · Qty: {editingRFQ.quantity}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quoted Unit Price (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={rfqQuotePrice}
                  onChange={(e) => setRfqQuotePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lead Time (Days to Vessel Loading)</label>
                <input
                  type="number"
                  min="1"
                  value={rfqLeadDays}
                  onChange={(e) => setRfqLeadDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Commercial Notes &amp; Incoterms</label>
                <textarea
                  rows={2}
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  placeholder="Includes export packaging, ocean freight to destination port..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRFQ(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg"
                >
                  Issue Formal Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
