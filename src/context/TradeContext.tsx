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
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

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
  submitRFQ: (rfqData: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'status'>) => RFQ;
  updateRFQ: (rfq: RFQ) => void;
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
  loginAdmin: (username: string, password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'catify_admin_auth_session';
const ADMIN_USERNAME = 'tardecatify@gmail.com';
const ADMIN_PASSCODE = 'tradeCatify@213';

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
    return parsed?.authenticated === true && parsed?.email === ADMIN_USERNAME;
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
  const [userRole, setUserRoleState] = useState<'customer' | 'admin'>(() =>
    readAdminSession() && initialRoute.page === 'admin-dashboard' ? 'admin' : 'customer'
  );

  // Sync the public catalogue with the Catify-Trade Cloudflare API.
  useEffect(() => {
    let active = true;
    const apiBase = 'https://catifytrade-api.catifytrade.workers.dev/api';
    const loadCatalogue = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${apiBase}/products`),
          fetch(`${apiBase}/categories`),
        ]);
        if (!productsResponse.ok || !categoriesResponse.ok) throw new Error('Catalogue API unavailable');
        const [productsPayload, categoriesPayload] = await Promise.all([productsResponse.json(), categoriesResponse.json()]);
        const remoteProducts = (productsPayload.data || []).map((row: any) => {
          try { return typeof row.data_json === 'string' ? JSON.parse(row.data_json) : row.data_json; } catch { return null; }
        }).filter((product: Product | null): product is Product => Boolean(product && product.id));
        const remoteCategories = (categoriesPayload.data || []).map((row: any) => ({
          id: row.id, name: row.name, slug: row.slug, description: row.description || '',
          image: row.image_url || '', iconName: 'Package', productCount: 0, isTradeSpecialty: false,
        } as Category));
        if (!active) return;
        if (remoteProducts.length) { setProducts(remoteProducts); localStorage.setItem('catify_products', JSON.stringify(remoteProducts)); }
        if (remoteCategories.length) { setCategories(remoteCategories); localStorage.setItem('catify_categories', JSON.stringify(remoteCategories)); }
      } catch (error) { console.warn('Catify-Trade API unavailable; keeping local catalogue.', error); }
    };
    void loadCatalogue();
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

  const loginAdmin = (username: string, password: string): { success: boolean; message: string } => {
    const normalizedUsername = username.trim().toLowerCase();
    if (normalizedUsername !== ADMIN_USERNAME || password !== ADMIN_PASSCODE) {
      return {
        success: false,
        message: 'Invalid username or password. Please verify your administrator credentials.',
      };
    }

    try {
      window.sessionStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ authenticated: true, email: ADMIN_USERNAME })
      );
    } catch {
      // SessionStorage fallback in restricted contexts
    }

    setIsAdminAuthenticated(true);
    setUserRoleState('admin');
    setCurrentPage('admin-dashboard');

    if (typeof window !== 'undefined' && parseUrlRoute(window.location.pathname).page !== 'admin-dashboard') {
      window.history.pushState({}, '', '/admin');
    }

    return { success: true, message: 'Authenticated successfully.' };
  };

  const logoutAdmin = () => {
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // Ignore storage cleanup error
    }
    setIsAdminAuthenticated(false);
    setUserRoleState('customer');
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

  // Product CRUD
  const saveProduct = (product: Product) => {
    TradeStorageService.saveProduct(product);
    setProducts(TradeStorageService.getProducts());
    setAdminLogs(TradeStorageService.getLogs());
  };

  const deleteProduct = (id: string) => {
    TradeStorageService.deleteProduct(id);
    setProducts(TradeStorageService.getProducts());
    setAdminLogs(TradeStorageService.getLogs());
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

  // RFQ Engine
  const submitRFQ = (rfqData: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'status'>): RFQ => {
    const rfqNumber = `RFQ-CAT-${Math.floor(100 + Math.random() * 900)}`;
    const newRFQ: RFQ = {
      ...rfqData,
      id: `rfq-${Date.now()}`,
      rfqNumber,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    TradeStorageService.saveRFQ(newRFQ);
    setRFQs(TradeStorageService.getRFQs());
    setAdminLogs(TradeStorageService.getLogs());
    return newRFQ;
  };

  const updateRFQ = (rfq: RFQ) => {
    TradeStorageService.saveRFQ(rfq);
    setRFQs(TradeStorageService.getRFQs());
    setAdminLogs(TradeStorageService.getLogs());
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
