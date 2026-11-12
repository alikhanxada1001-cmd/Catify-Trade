import React, { useState } from 'react';
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
} from 'lucide-react';
import { Product, Order, OrderStatus, RFQ, TradeInquiry, Coupon, CurrencyCode, Currency } from '../types';
import { AdminLoginPage } from './AdminLoginPage';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    saveProduct,
    deleteProduct,
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

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'rfqs' | 'inquiries' | 'currencies' | 'settings' | 'logs'
  >('overview');

  // Product Add / Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

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
    setEditingProduct({
      id: `prod-custom-${Date.now()}`,
      title: '',
      slug: '',
      sku: `CT-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      hsCode: '8481.80.00',
      category: 'Industrial Machinery & Precision Tools',
      subcategory: 'General Trade',
      shortDescription: '',
      description: '',
      images: ['/src/assets/images/trade_industrial_machinery_1794500846265.jpg'],
      countryOfOrigin: 'Germany',
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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.sku) return;

    const slug = editingProduct.slug || editingProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const completeProduct: Product = {
      ...(editingProduct as Product),
      slug,
    };

    saveProduct(completeProduct);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveOrderUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateOrder(editingOrder);
    setEditingOrder(null);
  };

  const handleSaveRFQQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRFQ) return;

    updateRFQ({
      ...editingRFQ,
      status: 'quoted',
      adminQuotedPriceUSD: Number(rfqQuotePrice),
      adminLeadTimeDays: Number(rfqLeadDays),
      adminNotes: rfqNotes,
    });
    setEditingRFQ(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-lg shrink-0">
            CT
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Central Management Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Catify Trade Admin Operations</h1>
            <p className="text-xs text-slate-300 mt-0.5 break-all">Admin: tardecatify@gmail.com · Live Multi-Currency Database</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setUserRole('customer');
              navigateTo('home');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            ← View Storefront
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset catalog, orders, and RFQs to default test dataset?')) {
                resetAllData();
              }
            }}
            className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800/50 transition-colors flex items-center gap-1.5"
            title="Reset to initial data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            title="Lock Admin Console and Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Admin Subnav */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px text-xs font-semibold">
        {[
          { id: 'overview', label: 'Financial Overview', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
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
                              deleteProduct(p.id);
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

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">
                    {inq.companyName} ({inq.contactPerson}) · <span className="text-blue-900 capitalize">{inq.serviceType.replace('_', ' ')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px] uppercase self-start sm:self-auto">
                    Status: {inq.status}
                  </span>
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
                  className="px-5 py-2 bg-blue-950 text-white font-bold rounded-lg hover:bg-blue-900"
                >
                  Save Product Listing
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
