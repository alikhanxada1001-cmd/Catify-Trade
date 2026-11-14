import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  Supplier,
  Country,
  Currency,
  Order,
  RFQ,
  TradeInquiry,
  Coupon,
  WebsiteSettings,
  CartItem,
  CurrencyCode,
  AdminActivityLog,
} from '../types';
import { TradeStorageService } from '../services/storage';

export type PageRoute =
  | 'home'
  | 'shop'
  | 'categories'
  | 'category-detail'
  | 'product-detail'
  | 'wholesale'
  | 'suppliers'
  | 'supplier-detail'
  | 'import-services'
  | 'export-services'
  | 'request-quote'
  | 'track-order'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'customer-dashboard'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'shipping-policy'
  | 'refund-policy'
  | 'privacy-policy'
  | 'terms'
  | 'admin-dashboard'
  | 'ak-dev-studio';

export interface TradeContextType {
  // Navigation
  currentPage: PageRoute;
  navigateTo: (page: PageRoute, params?: { slug?: string; id?: string }) => void;
  selectedProductSlug: string | null;
  selectedCategorySlug: string | null;
  selectedSupplierId: string | null;
  trackingLookupId: string | null;
  recentPlacedOrder: Order | null;

  // Currency & Location
  activeCurrency: CurrencyCode;
  setActiveCurrency: (code: CurrencyCode) => void;
  activeCountryCode: string;
  setActiveCountryCode: (code: string) => void;
  currentCountry: Country;
  currencies: Currency[];
  countries: Country[];
  formatPrice: (amountUSD: number, customCurrency?: CurrencyCode) => string;
  convertPrice: (amountUSD: number, customCurrency?: CurrencyCode) => number;
  updateCurrencyRate: (code: CurrencyCode, newRate: number) => void;
  updateCountry: (country: Country) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadProductImage: (file: File) => Promise<string>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, options?: { color?: string; size?: string; packaging?: string; isWholesale?: boolean }) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    variant?: { color?: string; size?: string; packaging?: string }
  ) => void;
  removeFromCart: (
    productId: string,
    variant?: { color?: string; size?: string; packaging?: string }
  ) => void;
  clearCart: () => void;
  cartSubtotalUSD: number;
  cartTotalItems: number;
  cartTotalWeightKg: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountUSD: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>) => Order;
  updateOrder: (order: Order) => void;

  // RFQ
  rfqs: RFQ[];
  submitRFQ: (rfqData: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'status'>) => Promise<RFQ>;
  updateRFQ: (rfq: RFQ) => Promise<void>;
  isRFQModalOpen: boolean;
  rfqModalProduct: Product | null;
  openRFQModal: (product?: Product | null) => void;
  closeRFQModal: () => void;

  // Inquiries
  inquiries: TradeInquiry[];
  submitInquiry: (inquiryData: Omit<TradeInquiry, 'id' | 'createdAt' | 'status'>) => TradeInquiry;
  updateInquiry: (inquiry: TradeInquiry) => void;

  // Settings & Logs
  settings: WebsiteSettings;
  updateSettings: (newSettings: WebsiteSettings) => void;
  adminLogs: AdminActivityLog[];
  resetAllData: () => void;

  // Auth & Role Management
  userRole: 'customer' | 'admin';
  setUserRole: (role: 'customer' | 'admin') => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  initializeAdmin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  isAdminSetupRequired: boolean;
  logoutAdmin: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'catify_admin_auth_session';
const API_BASE = 'https://catifytrade-api.catifytrade.workers.dev/api';

export interface ParsedRouteState {
  page: PageRoute;
  productSlug: string | null;
  categorySlug: string | null;
  supplierId: string | null;
}

export const parseUrlRoute = (pathname: string): ParsedRouteState => {
  const normalized = (pathname || '/').replace(/\/+$/, '') || '/';
  const lower = normalized.toLowerCase();

  if (lower === '/' || lower === '') {
    return { page: 'home', productSlug: null, categorySlug: null, supplierId: null };
  }
  if (/\/admin$/i.test(lower)) {
    return { page: 'admin-dashboard', productSlug: null, categorySlug: null, supplierId: null };
  }
  if (lower.startsWith('/product/')) {
    const slug = decodeURIComponent(normalized.slice('/product/'.length));
    return { page: 'product-detail', productSlug: slug || null, categorySlug: null, supplierId: null };
  }
  if (lower.startsWith('/category/')) {
    const slug = decodeURIComponent(normalized.slice('/category/'.length));
    return { page: 'category-detail', productSlug: null, categorySlug: slug || null, supplierId: null };
  }
  if (lower.startsWith('/supplier/')) {
    const id = decodeURIComponent(normalized.slice('/supplier/'.length));
    return { page: 'supplier-detail', productSlug: null, categorySlug: null, supplierId: id || null };
  }

  const staticRouteMap: Record<string, PageRoute> = {
    '/shop': 'shop',
    '/categories': 'categories',
    '/wholesale': 'wholesale',
    '/suppliers': 'suppliers',
    '/import-services': 'import-services',
    '/export-services': 'export-services',
    '/request-quote': 'request-quote',
    '/track-order': 'track-order',
    '/cart': 'cart',
    '/checkout': 'checkout',
    '/order-success': 'order-success',
    '/dashboard': 'customer-dashboard',
    '/about': 'about',
    '/contact': 'contact',
    '/faqs': 'faqs',
    '/shipping-policy': 'shipping-policy',
    '/refund-policy': 'refund-policy',
    '/privacy-policy': 'privacy-policy',
    '/terms': 'terms',
    '/ak-dev-studio': 'ak-dev-studio',
  };

  return {
    page: staticRouteMap[lower] || 'home',
    productSlug: null,
    categorySlug: null,
    supplierId: null,
  };
};

export const buildRoutePath = (
  page: PageRoute,
  params?: { slug?: string; id?: string }
): string => {
  switch (page) {
    case 'home':
      return '/';
    case 'shop':
      return '/shop';
    case 'categories':
      return '/categories';
    case 'category-detail':
      return params?.slug ? `/category/${encodeURIComponent(params.slug)}` : '/shop';
    case 'product-detail':
      return params?.slug ? `/product/${encodeURIComponent(params.slug)}` : '/shop';
    case 'wholesale':
      return '/wholesale';
    case 'suppliers':
      return '/suppliers';
    case 'supplier-detail':
      return params?.id ? `/supplier/${encodeURIComponent(params.id)}` : '/suppliers';
    case 'import-services':
      return '/import-services';
    case 'export-services':
      return '/export-services';
    case 'request-quote':
      return '/request-quote';
    case 'track-order':
      return '/track-order';
    case 'cart':
      return '/cart';
    case 'checkout':
      return '/checkout';
    case 'order-success':
      return '/order-success';
    case 'customer-dashboard':
      return '/dashboard';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'faqs':
      return '/faqs';
    case 'shipping-policy':
      return '/shipping-policy';
    case 'refund-policy':
      return '/refund-policy';
    case 'privacy-policy':
      return '/privacy-policy';
    case 'terms':
      return '/terms';
    case 'admin-dashboard':
      return '/admin';
    case 'ak-dev-studio':
      return '/ak-dev-studio';
    default:
      return '/';
  }
};

const getInitialParsedRoute = (): ParsedRouteState => {
  if (typeof window === 'undefined') {
    return { page: 'home', productSlug: null, categorySlug: null, supplierId: null };
  }
  return parseUrlRoute(window.location.pathname);
};

const readAdminSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.authenticated === true && typeof parsed?.token === 'string';
  } catch {
    return false;
  }
};

export const TradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State (reads clean URL route on initial load)
  const [initialRoute] = useState<ParsedRouteState>(() => getInitialParsedRoute());
  const [currentPage, setCurrentPage] = useState<PageRoute>(initialRoute.page);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(initialRoute.productSlug);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(initialRoute.categorySlug);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(initialRoute.supplierId);
  const [trackingLookupId, setTrackingLookupId] = useState<string | null>(null);
  const [recentPlacedOrder, setRecentPlacedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data States
  const [products, setProducts] = useState<Product[]>(() => TradeStorageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => TradeStorageService.getCategories());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => TradeStorageService.getSuppliers());
  const [countries, setCountries] = useState<Country[]>(() => TradeStorageService.getCountries());
  const [currencies, setCurrencies] = useState<Currency[]>(() => TradeStorageService.getCurrencies());
  const [orders, setOrders] = useState<Order[]>(() => TradeStorageService.getOrders());
  const [rfqs, setRFQs] = useState<RFQ[]>(() => TradeStorageService.getRFQs());
  const [inquiries, setInquiries] = useState<TradeInquiry[]>(() => TradeStorageService.getInquiries());
  const [coupons, setCoupons] = useState<Coupon[]>(() => TradeStorageService.getCoupons());
  const [settings, setSettings] = useState<WebsiteSettings>(() => TradeStorageService.getSettings());
  const [adminLogs, setAdminLogs] = useState<AdminActivityLog[]>(() => TradeStorageService.getLogs());

  // Localization States
  const [activeCurrency, setActiveCurrencyState] = useState<CurrencyCode>(() => TradeStorageService.getActiveCurrency());
  const [activeCountryCode, setActiveCountryCodeState] = useState<string>(() => TradeStorageService.getActiveCountry());

  // Interactive UI
  const [cart, setCart] = useState<CartItem[]>(() => TradeStorageService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => TradeStorageService.getWishlist());
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState<boolean>(false);
  const [rfqModalProduct, setRfqModalProduct] = useState<Product | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => readAdminSession());
  const [isAdminSetupRequired, setIsAdminSetupRequired] = useState(false);
  const [userRole, setUserRoleState] = useState<'customer' | 'admin'>(() =>
    readAdminSession() && initialRoute.page === 'admin-dashboard' ? 'admin' : 'customer'
  );

  // Load public catalogue and first-run admin setup state from the API.
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [productsResponse, categoriesResponse, setupResponse] = await Promise.all([
          fetch(`${API_BASE}/products`, { signal: AbortSignal.timeout(12000) }),
          fetch(`${API_BASE}/categories`, { signal: AbortSignal.timeout(12000) }),
          fetch(`${API_BASE}/auth/status`, { signal: AbortSignal.timeout(12000) }),
        ]);
        if (!productsResponse.ok || !categoriesResponse.ok || !setupResponse.ok) throw new Error('Catalogue service unavailable');
        const [productsPayload, categoriesPayload, setupPayload] = await Promise.all([
          productsResponse.json(), categoriesResponse.json(), setupResponse.json(),
        ]);
        if (!active) return;
        const remoteProducts = (productsPayload.data || []).map((row: any) => {
          try { return typeof row.data_json === 'string' ? JSON.parse(row.data_json) : row.data_json || row; } catch { return row; }
        }).filter((product: Product) => Boolean(product && product.id));
        const remoteCategories = (categoriesPayload.data || []).map((row: any) => ({
          ...row, id: row.id, name: row.name, slug: row.slug, description: row.description || '',
          image: row.image || row.image_url || '', iconName: row.iconName || 'Package',
          productCount: (productsPayload.data || []).filter((productRow: any) => {
            try { const product = typeof productRow.data_json === 'string' ? JSON.parse(productRow.data_json) : productRow; return product.category === row.name; } catch { return false; }
          }).length,
          isTradeSpecialty: Boolean(row.isTradeSpecialty),
        } as Category));
        if (remoteProducts.length) {
          setProducts(remoteProducts);
          try { localStorage.setItem('catify_products', JSON.stringify(remoteProducts)); } catch (storageError) { console.warn('Catalogue cache could not be updated.', storageError); }
        }
        if (remoteCategories.length) {
          setCategories(remoteCategories);
          try { localStorage.setItem('catify_categories', JSON.stringify(remoteCategories)); } catch (storageError) { console.warn('Category cache could not be updated.', storageError); }
        }
        setIsAdminSetupRequired(!setupPayload.initialized);
      } catch (error) {
        if (active) console.warn('Catify-Trade API unavailable; local catalogue remains active.', error);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  // Sync browser back/forward URL changes across all routes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const parsed = parseUrlRoute(window.location.pathname);
      setCurrentPage(parsed.page);
      setSelectedProductSlug(parsed.productSlug);
      setSelectedCategorySlug(parsed.categorySlug);
      setSelectedSupplierId(parsed.supplierId);
      if (parsed.page !== 'admin-dashboard') {
        setUserRoleState('customer');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setUserRole = (role: 'customer' | 'admin') => {
    if (role === 'admin' && !isAdminAuthenticated) {
      setUserRoleState('customer');
      return;
    }
    setUserRoleState(role);
  };

  const initializeAdmin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE}/bootstrap`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        signal: AbortSignal.timeout(15000),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) return { success: false, message: payload.error || 'Administrator setup failed. Please try again.' };
      setIsAdminSetupRequired(false);
      return loginAdmin(email, password);
    } catch {
      return { success: false, message: 'Cannot reach the security service. Check your internet connection and retry.' };
    }
  };

  const loginAdmin = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username.trim().toLowerCase(), password }),
        signal: AbortSignal.timeout(15000),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) return { success: false, message: payload.error || 'Sign-in failed. Please verify your details.' };
      try {
        window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ authenticated: true, email: payload.user?.email, token: payload.token, expiresAt: payload.expiresAt }));
      } catch {
        return { success: false, message: 'Your browser blocked secure session storage. Enable site storage and try again.' };
      }
      setIsAdminAuthenticated(true);
      setUserRoleState('admin');
      setCurrentPage('admin-dashboard');
      const productsResponse = await fetch(`${API_BASE}/admin/products`, { headers: { Authorization: `Bearer ${payload.token}` }, signal: AbortSignal.timeout(12000) });
      if (productsResponse.ok) {
        const productsPayload = await productsResponse.json();
        const remoteProducts = (productsPayload.data || []).map((row: any) => {
          try { return typeof row.data_json === 'string' ? JSON.parse(row.data_json) : row.data_json || row; } catch { return row; }
        }).filter((product: Product) => Boolean(product && product.id));
        setProducts(remoteProducts);
      }
      const rfqsResponse = await fetch(`${API_BASE}/admin/rfqs`, { headers: { Authorization: `Bearer ${payload.token}` }, signal: AbortSignal.timeout(12000) });
      if (rfqsResponse.ok) {
        const rfqsPayload = await rfqsResponse.json();
        const remoteRFQs = (rfqsPayload.data || []).map((row: any) => {
          try { return typeof row.data_json === 'string' ? JSON.parse(row.data_json) : row.data_json || row; } catch { return row; }
        }).filter((item: RFQ) => Boolean(item && item.id));
        setRFQs(remoteRFQs);
      }
      if (typeof window !== 'undefined' && parseUrlRoute(window.location.pathname).page !== 'admin-dashboard') window.history.pushState({}, '', '/admin');
      return { success: true, message: 'Signed in successfully.' };
    } catch {
      return { success: false, message: 'Cannot reach the security service. Check your internet connection and retry.' };
    }
  };

  const logoutAdmin = async () => {
    try {
      const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
      const session = raw ? JSON.parse(raw) : null;
      if (session?.token) await fetch(`${API_BASE}/logout`, { method: 'POST', headers: { Authorization: `Bearer ${session.token}` }, signal: AbortSignal.timeout(8000) });
    } catch {
      // Local sign-out still completes if the API is unavailable.
    }
    try { window.sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch { /* Ignore storage cleanup failures. */ }
    setIsAdminAuthenticated(false);
    setUserRoleState('customer');
    setCurrentPage('home');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/');
  };

  const setActiveCurrency = (code: CurrencyCode) => {
    setActiveCurrencyState(code);
    TradeStorageService.setActiveCurrency(code);
  };

  const setActiveCountryCode = (code: string) => {
    setActiveCountryCodeState(code);
    TradeStorageService.setActiveCountry(code);
    // Also auto-switch currency if country has default
    const matched = countries.find((c) => c.code === code);
    if (matched) {
      setActiveCurrency(matched.currencyCode);
    }
  };

  const currentCountry: Country =
    countries.find((c) => c.code === activeCountryCode) ||
    countries[0] || {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      currencyCode: 'USD',
      phoneCode: '+1',
      importDutyPercent: 3.5,
      vatPercent: 6.5,
      airShippingPerKgUSD: 14.5,
      seaShippingPerCbmUSD: 160,
      isRestricted: false,
      continent: 'North America',
    };

  // Currency Converter Helpers
  const convertPrice = (amountUSD: number, customCurrency?: CurrencyCode): number => {
    const targetCode = customCurrency || activeCurrency;
    const curr = currencies.find((c) => c.code === targetCode);
    const rate = curr ? curr.rateToUSD : 1.0;
    return amountUSD * rate;
  };

  const formatPrice = (amountUSD: number, customCurrency?: CurrencyCode): string => {
    const targetCode = customCurrency || activeCurrency;
    const curr = currencies.find((c) => c.code === targetCode);
    const rate = curr ? curr.rateToUSD : 1.0;
    const symbol = curr ? curr.symbol : '$';
    const converted = amountUSD * rate;

    // Formatting based on magnitude
    if (targetCode === 'PKR' || targetCode === 'JPY') {
      return `${symbol} ${Math.round(converted).toLocaleString()}`;
    }
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const updateCurrencyRate = (code: CurrencyCode, newRate: number) => {
    const updated = currencies.map((c) => (c.code === code ? { ...c, rateToUSD: newRate } : c));
    setCurrencies(updated);
    const target = updated.find((c) => c.code === code);
    if (target) {
      TradeStorageService.saveCurrency(target);
    }
  };

  const updateCountry = (country: Country) => {
    const updated = countries.map((c) => (c.code === country.code ? country : c));
    setCountries(updated);
    TradeStorageService.saveCountry(country);
  };

  // Navigation Helper
  const navigateTo = (page: PageRoute, params?: { slug?: string; id?: string }) => {
    const nextSlug =
      page === 'product-detail'
        ? params?.slug ?? selectedProductSlug ?? undefined
        : page === 'category-detail'
        ? params?.slug ?? selectedCategorySlug ?? undefined
        : params?.slug;
    const nextId =
      page === 'supplier-detail' ? params?.id ?? selectedSupplierId ?? undefined : params?.id;

    setCurrentPage(page);
    if (page === 'product-detail' && nextSlug) {
      setSelectedProductSlug(nextSlug);
    }
    if (page === 'category-detail' && nextSlug) {
      setSelectedCategorySlug(nextSlug);
    }
    if (page === 'supplier-detail' && nextId) {
      setSelectedSupplierId(nextId);
    }
    if (page === 'track-order' && params?.id) {
      setTrackingLookupId(params.id);
    }

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const targetPath = buildRoutePath(page, { slug: nextSlug, id: nextId });
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  };

  // Product CRUD — authoritative writes go to Cloudflare D1.
  const getAdminToken = (): string => {
    try {
      const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw)?.token || '' : '';
    } catch { return ''; }
  };

  const saveProduct = async (product: Product): Promise<void> => {
    const token = getAdminToken();
    if (!token) throw new Error('Your admin session has expired. Please sign in again.');
    const categoryId = categories.find((category) => category.name === product.category)?.id || null;
    const response = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...product, category_id: categoryId, supplier_id: null,
        price_usd: product.salePriceUSD ?? product.regularPriceUSD,
        stock_quantity: product.stock, image_key: null,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Product could not be saved.');
    const refresh = await fetch(`${API_BASE}/admin/products`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(12000) });
    if (!refresh.ok) throw new Error('Product saved, but the catalogue refresh failed. Reload the admin panel.');
    const result = await refresh.json();
    const updated = (result.data || []).map((row: any) => {
      try { return typeof row.data_json === 'string' ? JSON.parse(row.data_json) : row.data_json || row; } catch { return row; }
    }).filter((item: Product) => Boolean(item && item.id));
    setProducts(updated);
    try { localStorage.setItem('catify_products', JSON.stringify(updated)); } catch { /* API remains source of truth. */ }
    setAdminLogs(TradeStorageService.getLogs());
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    const token = getAdminToken();
    if (!token) throw new Error('Your admin session has expired. Please sign in again.');
    if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
    if (file.size > 8 * 1024 * 1024) throw new Error('Image must be 8 MB or smaller.');
    const form = new FormData();
    form.append('file', file);
    const response = await fetch(`${API_BASE}/assets`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form,
      signal: AbortSignal.timeout(30000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.key) throw new Error(payload.error || 'Image upload failed. Please retry.');
    return `https://catifytrade-api.catifytrade.workers.dev${payload.url}`;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const token = getAdminToken();
    if (!token) throw new Error('Your admin session has expired. Please sign in again.');
    const response = await fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(12000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Product could not be deleted.');
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  // Cart Management
  const addToCart = (
    product: Product,
    quantity: number,
    options?: { color?: string; size?: string; packaging?: string; isWholesale?: boolean }
  ) => {
    let calculatedUnitPrice = product.salePriceUSD ?? product.regularPriceUSD;

    // Check wholesale tier pricing if quantity reaches MOQ or wholesale is active
    if (product.wholesaleTiers && product.wholesaleTiers.length > 0) {
      // Find matching tier
      const matchingTier = [...product.wholesaleTiers]
        .reverse()
        .find((t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty));

      if (matchingTier) {
        calculatedUnitPrice = matchingTier.unitPriceUSD;
      } else if (quantity >= product.moq) {
        calculatedUnitPrice = product.wholesalePriceUSD;
      }
    }

    const isWholesale = options?.isWholesale || quantity >= product.moq;

    const normalizedOptions = {
      color: options?.color,
      size: options?.size,
      packaging: options?.packaging || product.variations?.packagingTypes?.[0],
    };

    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedColor === normalizedOptions.color &&
        item.selectedSize === normalizedOptions.size &&
        item.selectedPackaging === normalizedOptions.packaging
    );

    let updatedCart: CartItem[];
    if (existingIndex >= 0) {
      const updatedItem = {
        ...cart[existingIndex],
        quantity: cart[existingIndex].quantity + quantity,
      };

      // Recalculate price for new quantity
      if (product.wholesaleTiers) {
        const matchingTier = [...product.wholesaleTiers]
          .reverse()
          .find((t) => updatedItem.quantity >= t.minQty && (t.maxQty === null || updatedItem.quantity <= t.maxQty));
        if (matchingTier) {
          updatedItem.unitPriceUSD = matchingTier.unitPriceUSD;
        }
      }

      updatedCart = [...cart];
      updatedCart[existingIndex] = updatedItem;
    } else {
      const newItem: CartItem = {
        productId: product.id,
        product,
        quantity,
        selectedColor: normalizedOptions.color,
        selectedSize: normalizedOptions.size,
        selectedPackaging: normalizedOptions.packaging,
        unitPriceUSD: calculatedUnitPrice,
        isWholesale,
      };
      updatedCart = [newItem, ...cart];
    }

    setCart(updatedCart);
    TradeStorageService.saveCart(updatedCart);
    setIsCartDrawerOpen(true);
  };

  const matchesCartVariant = (
    item: CartItem,
    productId: string,
    variant?: { color?: string; size?: string; packaging?: string }
  ) => {
    if (item.productId !== productId) return false;
    if (!variant) return true;
    return (
      item.selectedColor === variant.color &&
      item.selectedSize === variant.size &&
      item.selectedPackaging === variant.packaging
    );
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    variant?: { color?: string; size?: string; packaging?: string }
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    const updated = cart.map((item) => {
      if (matchesCartVariant(item, productId, variant)) {
        let price = item.product.salePriceUSD ?? item.product.regularPriceUSD;
        if (item.product.wholesaleTiers) {
          const matchingTier = [...item.product.wholesaleTiers]
            .reverse()
            .find((t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty));
          if (matchingTier) {
            price = matchingTier.unitPriceUSD;
          } else if (quantity >= item.product.moq) {
            price = item.product.wholesalePriceUSD;
          }
        }
        return {
          ...item,
          quantity,
          unitPriceUSD: price,
          isWholesale: quantity >= item.product.moq,
        };
      }
      return item;
    });

    setCart(updated);
    TradeStorageService.saveCart(updated);
  };

  const removeFromCart = (
    productId: string,
    variant?: { color?: string; size?: string; packaging?: string }
  ) => {
    const updated = cart.filter((item) => !matchesCartVariant(item, productId, variant));
    setCart(updated);
    TradeStorageService.saveCart(updated);
  };

  const clearCart = () => {
    setCart([]);
    TradeStorageService.saveCart([]);
  };

  const cartSubtotalUSD = cart.reduce((sum, item) => sum + item.unitPriceUSD * item.quantity, 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalWeightKg = cart.reduce((sum, item) => sum + (item.product.weightKg || 1) * item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    const updated = exists ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];
    setWishlist(updated);
    TradeStorageService.saveWishlist(updated);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon Engine
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired trade promo coupon code.' };
    }

    if (cartSubtotalUSD < found.minOrderUSD) {
      return {
        success: false,
        message: `This coupon requires a minimum trade order value of ${formatPrice(found.minOrderUSD)}.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied: ${found.discountPercent}% discount saved!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const discountUSD = appliedCoupon
    ? Math.min((cartSubtotalUSD * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscountUSD)
    : 0;

  // Order Management
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline'>): Order => {
    const orderNumber = `CT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'pending',
          label: 'Trade Order Submitted & Proforma Invoice Generated',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          location: 'Catify Trade Order Processing Desk',
          note: `Payment mode: ${orderData.paymentMethod.toUpperCase()}`,
          completed: true,
        },
        {
          status: 'processing',
          label: 'Pre-Shipment Inspection & Export Packing',
          date: 'Scheduled within 48 Hours',
          location: 'Origin Regional Export Warehouse',
          note: 'Allocated to verified logistics carrier',
          completed: false,
        },
        {
          status: 'export_cleared',
          label: 'Customs Clearance & Bill of Lading Filing',
          date: 'Pending Inspection',
          location: 'Port of Departure',
          note: 'HS Code classification and export declarations',
          completed: false,
        },
        {
          status: 'in_transit',
          label: 'International Freight Dispatch',
          date: 'Pending Clearance',
          location:
            orderData.shippingMethod === 'domestic_courier'
              ? 'Pakistan Domestic Express Courier Hub (TCS / Leopards)'
              : orderData.shippingMethod === 'air_express'
              ? 'Air Cargo Terminal'
              : 'Sea Container Terminal',
          note: `Assigned carrier: ${orderData.carrier || 'DHL Global Express'}`,
          completed: false,
        },
        {
          status: 'delivered',
          label: 'Customs Cleared & Final Delivery',
          date: orderData.estimatedDeliveryDate,
          location: `${orderData.shippingAddress.city}, ${orderData.shippingAddress.country}`,
          note: 'Final consignee signature receipt',
          completed: false,
        },
      ],
    };

    TradeStorageService.createOrder(newOrder);
    setOrders(TradeStorageService.getOrders());
    setAdminLogs(TradeStorageService.getLogs());
    setRecentPlacedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    return newOrder;
  };

  const updateOrder = (order: Order) => {
    TradeStorageService.updateOrder(order);
    setOrders(TradeStorageService.getOrders());
    setAdminLogs(TradeStorageService.getLogs());
  };

  // RFQs are persisted in Cloudflare D1 so requests are available to the admin team.
  const submitRFQ = async (rfqData: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'status'>): Promise<RFQ> => {
    const response = await fetch(`${API_BASE}/rfqs`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rfqData), signal: AbortSignal.timeout(15000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.data) throw new Error(payload.error || 'Your quotation request could not be submitted. Please retry.');
    const newRFQ = payload.data as RFQ;
    setRFQs((current) => [newRFQ, ...current.filter((item) => item.id !== newRFQ.id)]);
    try { localStorage.setItem('catify_rfqs', JSON.stringify([newRFQ, ...TradeStorageService.getRFQs()])); } catch { /* D1 is the source of truth. */ }
    return newRFQ;
  };

  const updateRFQ = async (rfq: RFQ): Promise<void> => {
    const token = getAdminToken();
    if (!token) throw new Error('Your admin session has expired. Please sign in again.');
    const response = await fetch(`${API_BASE}/admin/rfqs/${encodeURIComponent(rfq.id)}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(rfq), signal: AbortSignal.timeout(12000),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'RFQ update failed.');
    setRFQs((current) => current.map((item) => item.id === rfq.id ? rfq : item));
  };

  const openRFQModal = (product?: Product | null) => {
    setRfqModalProduct(product || null);
    setIsRFQModalOpen(true);
  };

  const closeRFQModal = () => {
    setIsRFQModalOpen(false);
    setRfqModalProduct(null);
  };

  // Inquiries Engine
  const submitInquiry = (inquiryData: Omit<TradeInquiry, 'id' | 'createdAt' | 'status'>): TradeInquiry => {
    const newInquiry: TradeInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    TradeStorageService.saveInquiry(newInquiry);
    setInquiries(TradeStorageService.getInquiries());
    setAdminLogs(TradeStorageService.getLogs());
    return newInquiry;
  };

  const updateInquiry = (inquiry: TradeInquiry) => {
    TradeStorageService.saveInquiry(inquiry);
    setInquiries(TradeStorageService.getInquiries());
    setAdminLogs(TradeStorageService.getLogs());
  };

  // Settings
  const updateSettings = (newSettings: WebsiteSettings) => {
    TradeStorageService.saveSettings(newSettings);
    setSettings(newSettings);
    setAdminLogs(TradeStorageService.getLogs());
  };

  const resetAllData = () => {
    TradeStorageService.resetToDefault();
    setProducts(TradeStorageService.getProducts());
    setCategories(TradeStorageService.getCategories());
    setSuppliers(TradeStorageService.getSuppliers());
    setCountries(TradeStorageService.getCountries());
    setCurrencies(TradeStorageService.getCurrencies());
    setOrders(TradeStorageService.getOrders());
    setRFQs(TradeStorageService.getRFQs());
    setInquiries(TradeStorageService.getInquiries());
    setCoupons(TradeStorageService.getCoupons());
    setSettings(TradeStorageService.getSettings());
    setAdminLogs(TradeStorageService.getLogs());
    setCart([]);
    setWishlist([]);
    setAppliedCoupon(null);
  };

  return (
    <TradeContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedProductSlug,
        selectedCategorySlug,
        selectedSupplierId,
        trackingLookupId,
        recentPlacedOrder,

        activeCurrency,
        setActiveCurrency,
        activeCountryCode,
        setActiveCountryCode,
        currentCountry,
        currencies,
        countries,
        formatPrice,
        convertPrice,
        updateCurrencyRate,
        updateCountry,

        products,
        categories,
        suppliers,
        saveProduct,
        deleteProduct,
        uploadProductImage,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotalUSD,
        cartTotalItems,
        cartTotalWeightKg,
        isCartDrawerOpen,
        setIsCartDrawerOpen,

        wishlist,
        toggleWishlist,
        isInWishlist,

        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountUSD,

        orders,
        createOrder,
        updateOrder,

        rfqs,
        submitRFQ,
        updateRFQ,
        isRFQModalOpen,
        rfqModalProduct,
        openRFQModal,
        closeRFQModal,

        inquiries,
        submitInquiry,
        updateInquiry,

        settings,
        updateSettings,
        adminLogs,
        resetAllData,

        userRole,
        setUserRole,
        isAdminAuthenticated,
        loginAdmin,
        initializeAdmin,
        isAdminSetupRequired,
        logoutAdmin,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = (): TradeContextType => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
};
