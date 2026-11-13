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
  CustomerReview,
  AdminActivityLog,
  CartItem,
  CurrencyCode,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SUPPLIERS,
  INITIAL_COUNTRIES,
  INITIAL_CURRENCIES,
  INITIAL_ORDERS,
  INITIAL_RFQS,
  INITIAL_INQUIRIES,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS,
  INITIAL_ADMIN_LOGS,
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'catify_products',
  CATEGORIES: 'catify_categories',
  SUPPLIERS: 'catify_suppliers',
  COUNTRIES: 'catify_countries',
  CURRENCIES: 'catify_currencies',
  ORDERS: 'catify_orders',
  RFQS: 'catify_rfqs',
  INQUIRIES: 'catify_inquiries',
  COUPONS: 'catify_coupons',
  SETTINGS: 'catify_settings',
  REVIEWS: 'catify_reviews',
  LOGS: 'catify_admin_logs',
  CART: 'catify_cart',
  WISHLIST: 'catify_wishlist',
  ACTIVE_CURRENCY: 'catify_active_currency',
  ACTIVE_COUNTRY: 'catify_active_country',
  CURRENT_USER: 'catify_current_user',
  CATALOG_VERSION: 'catify_catalog_version',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return fallback;
    }
    const item = localStorage.getItem(key);
    if (!item || item === 'null' || item === 'undefined') return fallback;
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) return fallback;
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed as T;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export class TradeStorageService {
  // PRODUCTS
  static getProducts(): Product[] {
    // Replace the previous sample catalogue once so existing browser sessions see the new demo products.
    if (safeGet<string>(STORAGE_KEYS.CATALOG_VERSION, '') !== 'apparel-demo-v1') {
      safeSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      safeSet(STORAGE_KEYS.CATALOG_VERSION, 'apparel-demo-v1');
      return INITIAL_PRODUCTS;
    }
    return safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  static saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
      this.logAction('PRODUCT_UPDATED', product.sku, `Updated product "${product.title}"`);
    } else {
      products.unshift(product);
      this.logAction('PRODUCT_CREATED', product.sku, `Created new product "${product.title}"`);
    }
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    safeSet(STORAGE_KEYS.PRODUCTS, products);
    this.logAction('PRODUCT_DELETED', id, `Deleted product ID ${id}`);
  }

  // CATEGORIES
  static getCategories(): Category[] {
    if (safeGet<string>(STORAGE_KEYS.CATALOG_VERSION, '') !== 'apparel-demo-v1') {
      safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return safeGet<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
  }

  // SUPPLIERS
  static getSuppliers(): Supplier[] {
    return safeGet<Supplier[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  }

  static saveSupplier(supplier: Supplier): void {
    const suppliers = this.getSuppliers();
    const index = suppliers.findIndex((s) => s.id === supplier.id);
    if (index >= 0) {
      suppliers[index] = supplier;
    } else {
      suppliers.push(supplier);
    }
    safeSet(STORAGE_KEYS.SUPPLIERS, suppliers);
  }

  // COUNTRIES & CURRENCIES
  static getCountries(): Country[] {
    return safeGet<Country[]>(STORAGE_KEYS.COUNTRIES, INITIAL_COUNTRIES);
  }

  static saveCountry(country: Country): void {
    const countries = this.getCountries();
    const index = countries.findIndex((c) => c.code === country.code);
    if (index >= 0) {
      countries[index] = country;
    } else {
      countries.push(country);
    }
    safeSet(STORAGE_KEYS.COUNTRIES, countries);
  }

  static getCurrencies(): Currency[] {
    return safeGet<Currency[]>(STORAGE_KEYS.CURRENCIES, INITIAL_CURRENCIES);
  }

  static saveCurrency(currency: Currency): void {
    const currencies = this.getCurrencies();
    const index = currencies.findIndex((c) => c.code === currency.code);
    if (index >= 0) {
      currencies[index] = currency;
    } else {
      currencies.push(currency);
    }
    safeSet(STORAGE_KEYS.CURRENCIES, currencies);
    this.logAction('CURRENCY_UPDATED', currency.code, `Updated rate for ${currency.name} to ${currency.rateToUSD}`);
  }

  static getActiveCurrency(): CurrencyCode {
    return safeGet<CurrencyCode>(STORAGE_KEYS.ACTIVE_CURRENCY, 'USD');
  }

  static setActiveCurrency(code: CurrencyCode): void {
    safeSet(STORAGE_KEYS.ACTIVE_CURRENCY, code);
  }

  static getActiveCountry(): string {
    return safeGet<string>(STORAGE_KEYS.ACTIVE_COUNTRY, 'US');
  }

  static setActiveCountry(countryCode: string): void {
    safeSet(STORAGE_KEYS.ACTIVE_COUNTRY, countryCode);
  }

  // ORDERS
  static getOrders(): Order[] {
    return safeGet<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  static getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id || o.orderNumber === id);
  }

  static createOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    safeSet(STORAGE_KEYS.ORDERS, orders);
    this.logAction('ORDER_PLACED', order.id, `Order placed by ${order.customerName} for total ${order.totalUSD} USD`);
  }

  static updateOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
      safeSet(STORAGE_KEYS.ORDERS, orders);
      this.logAction('ORDER_UPDATED', order.id, `Updated status to ${order.orderStatus}`);
    }
  }

  // RFQS
  static getRFQs(): RFQ[] {
    return safeGet<RFQ[]>(STORAGE_KEYS.RFQS, INITIAL_RFQS);
  }

  static saveRFQ(rfq: RFQ): void {
    const rfqs = this.getRFQs();
    const index = rfqs.findIndex((r) => r.id === rfq.id);
    if (index >= 0) {
      rfqs[index] = rfq;
      this.logAction('RFQ_UPDATED', rfq.rfqNumber, `Updated RFQ quote status: ${rfq.status}`);
    } else {
      rfqs.unshift(rfq);
      this.logAction('RFQ_SUBMITTED', rfq.rfqNumber, `New RFQ from ${rfq.buyerName} for ${rfq.productTitle}`);
    }
    safeSet(STORAGE_KEYS.RFQS, rfqs);
  }

  // INQUIRIES
  static getInquiries(): TradeInquiry[] {
    return safeGet<TradeInquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
  }

  static saveInquiry(inquiry: TradeInquiry): void {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex((i) => i.id === inquiry.id);
    if (index >= 0) {
      inquiries[index] = inquiry;
    } else {
      inquiries.unshift(inquiry);
      this.logAction('INQUIRY_RECEIVED', inquiry.id, `New trade inquiry from ${inquiry.companyName}`);
    }
    safeSet(STORAGE_KEYS.INQUIRIES, inquiries);
  }

  // COUPONS
  static getCoupons(): Coupon[] {
    return safeGet<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  static saveCoupon(coupon: Coupon): void {
    const coupons = this.getCoupons();
    const index = coupons.findIndex((c) => c.id === coupon.id);
    if (index >= 0) {
      coupons[index] = coupon;
    } else {
      coupons.push(coupon);
    }
    safeSet(STORAGE_KEYS.COUPONS, coupons);
  }

  // SETTINGS
  static getSettings(): WebsiteSettings {
    const stored = safeGet<Partial<WebsiteSettings>>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    if (!stored || typeof stored !== 'object') return INITIAL_SETTINGS;
    return {
      ...INITIAL_SETTINGS,
      ...stored,
      bankDetails: {
        ...INITIAL_SETTINGS.bankDetails,
        ...(stored.bankDetails && typeof stored.bankDetails === 'object' ? stored.bankDetails : {}),
      },
    };
  }

  static saveSettings(settings: WebsiteSettings): void {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
    this.logAction('SETTINGS_UPDATED', 'WEBSITE', 'Updated store and brand contact configuration');
  }

  // REVIEWS
  static getReviews(): CustomerReview[] {
    return safeGet<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static addReview(review: CustomerReview): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    safeSet(STORAGE_KEYS.REVIEWS, reviews);
  }

  // ADMIN LOGS
  static getLogs(): AdminActivityLog[] {
    return safeGet<AdminActivityLog[]>(STORAGE_KEYS.LOGS, INITIAL_ADMIN_LOGS);
  }

  static logAction(action: string, target: string, details: string): void {
    const logs = this.getLogs();
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminEmail: 'tardecatify@gmail.com',
      action,
      target,
      details,
    };
    logs.unshift(newLog);
    // Keep last 100 logs
    safeSet(STORAGE_KEYS.LOGS, logs.slice(0, 100));
  }

  // CART
  static getCart(): CartItem[] {
    return safeGet<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  static saveCart(cart: CartItem[]): void {
    safeSet(STORAGE_KEYS.CART, cart);
  }

  // WISHLIST
  static getWishlist(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.WISHLIST, []);
  }

  static saveWishlist(ids: string[]): void {
    safeSet(STORAGE_KEYS.WISHLIST, ids);
  }

  // RESET
  static resetToDefault(): void {
    safeSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    safeSet(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    safeSet(STORAGE_KEYS.COUNTRIES, INITIAL_COUNTRIES);
    safeSet(STORAGE_KEYS.CURRENCIES, INITIAL_CURRENCIES);
    safeSet(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    safeSet(STORAGE_KEYS.RFQS, INITIAL_RFQS);
    safeSet(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    safeSet(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    safeSet(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    safeSet(STORAGE_KEYS.LOGS, INITIAL_ADMIN_LOGS);
    safeSet(STORAGE_KEYS.CART, []);
    safeSet(STORAGE_KEYS.WISHLIST, []);
  }
}
