export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'PKR' | 'CNY' | 'JPY' | 'CAD' | 'SAR' | 'AUD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // e.g. USD=1, EUR=0.92, AED=3.67, PKR=278.5
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currencyCode: CurrencyCode;
  phoneCode: string;
  importDutyPercent: number;
  vatPercent: number;
  airShippingPerKgUSD: number;
  seaShippingPerCbmUSD: number;
  isRestricted: boolean;
  continent: string;
}

export interface WholesaleTier {
  minQty: number;
  maxQty: number | null;
  unitPriceUSD: number;
  discountPercent: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  hsCode: string; // Harmonized System Code for customs
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  images: string[];
  countryOfOrigin: string;
  manufacturingDetails: string;
  regularPriceUSD: number;
  salePriceUSD?: number;
  wholesalePriceUSD: number;
  moq: number; // Minimum Order Quantity
  maxOrderQuantity?: number;
  stock: number;
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  status: 'published' | 'draft' | 'archived';
  isFeatured: boolean;
  isWholesaleOnly: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  wholesaleTiers: WholesaleTier[];
  specifications: Record<string, string>;
  shippingAvailability: string[]; // Country codes or ['ALL']
  variations?: {
    colors?: string[];
    sizes?: string[];
    packagingTypes?: string[];
  };
  supplierId: string;
  supplierName: string;
  rating: number;
  reviewsCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  productCount: number;
  isTradeSpecialty: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
  verified: boolean;
  rating: number;
  responseRate: string;
  exportYears: number;
  certifications: string[];
  mainProducts: string[];
  annualRevenue: string;
  staffCount: string;
  about: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedPackaging?: string;
  unitPriceUSD: number;
  isWholesale: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'export_cleared'
  | 'in_transit'
  | 'customs_clearing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'international_card'
  | 'bank_transfer'
  | 'paypal'
  | 'letter_of_credit'
  | 'cash_on_delivery'
  | 'local_wallet_raast';

export type ShippingMethod = 'domestic_courier' | 'air_express' | 'ocean_lcl' | 'ocean_fcl';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  date: string;
  location: string;
  note: string;
  completed: boolean;
}

export interface ShippingAddress {
  fullName: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  taxIdOrVat?: string; // Importer customs requirement
}

export interface Order {
  id: string; // e.g., "CT-2026-8941"
  orderNumber: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  destinationCountry: string;
  items: CartItem[];
  subtotalUSD: number;
  discountUSD: number;
  couponCode?: string;
  shippingCostUSD: number;
  customsTaxUSD: number;
  totalUSD: number;
  paidCurrency: CurrencyCode;
  paidCurrencyTotal: number;
  paidCurrencyRate: number;
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending_verification' | 'authorized';
  orderStatus: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryDate: string;
  commercialInvoiceNumber: string;
  timeline: OrderTimelineEvent[];
  notes?: string;
}

export type Incoterm = 'FOB' | 'CIF' | 'DDP' | 'EXW' | 'CFR' | 'FCA';

export interface RFQ {
  id: string;
  rfqNumber: string;
  createdAt: string;
  productId?: string;
  productTitle: string;
  category: string;
  quantity: number;
  targetPriceUSD: number;
  destinationCountry: string;
  destinationPort: string;
  incoterm: Incoterm;
  requiredCertifications: string[];
  specifications: string;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  buyerPhone: string;
  status: 'pending' | 'quoted' | 'accepted' | 'declined';
  adminQuotedPriceUSD?: number;
  adminLeadTimeDays?: number;
  adminNotes?: string;
}

export interface TradeInquiry {
  id: string;
  createdAt: string;
  serviceType:
    | 'import_customs'
    | 'export_compliance'
    | 'freight_forwarding'
    | 'sourcing_agent'
    | 'bulk_trading'
    | 'general_trade';
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  originCountry: string;
  destinationCountry: string;
  cargoDetails: string;
  estimatedVolume: string;
  preferredIncoterm: string;
  status: 'new' | 'contacted' | 'proposal_sent' | 'closed';
  adminNotes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderUSD: number;
  maxDiscountUSD: number;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
}

export interface BankDetails {
  bankName: string;
  beneficiaryName: string;
  accountNumber: string;
  iban: string;
  swiftBic: string;
  bankBranch: string;
  bankAddress: string;
  instructions: string;
}

export interface WebsiteSettings {
  brandName: string;
  email: string;
  phone: string;
  whatsapp: string;
  domain: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  announcementText: string;
  freeShippingThresholdUSD: number;
  customsInsurancePercent: number;
  bankDetails: BankDetails;
}

export interface CustomerReview {
  id: string;
  productId: string;
  authorName: string;
  authorCountry: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface AdminActivityLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  target: string;
  details: string;
}
