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
} from '../types';

export const INITIAL_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rateToUSD: 3.67 },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rateToUSD: 278.5 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rateToUSD: 7.24 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUSD: 154.2 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateToUSD: 1.38 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rateToUSD: 3.75 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToUSD: 1.52 },
];

export const INITIAL_COUNTRIES: Country[] = [
  {
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
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currencyCode: 'EUR',
    phoneCode: '+49',
    importDutyPercent: 4.2,
    vatPercent: 19.0,
    airShippingPerKgUSD: 16.0,
    seaShippingPerCbmUSD: 175,
    isRestricted: false,
    continent: 'Europe',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    phoneCode: '+44',
    importDutyPercent: 4.0,
    vatPercent: 20.0,
    airShippingPerKgUSD: 15.5,
    seaShippingPerCbmUSD: 170,
    isRestricted: false,
    continent: 'Europe',
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currencyCode: 'AED',
    phoneCode: '+971',
    importDutyPercent: 5.0,
    vatPercent: 5.0,
    airShippingPerKgUSD: 9.5,
    seaShippingPerCbmUSD: 110,
    isRestricted: false,
    continent: 'Middle East',
  },
  {
    code: 'PK',
    name: 'Pakistan',
    flag: '🇵🇰',
    currencyCode: 'PKR',
    phoneCode: '+92',
    importDutyPercent: 8.0,
    vatPercent: 18.0,
    airShippingPerKgUSD: 6.0,
    seaShippingPerCbmUSD: 85,
    isRestricted: false,
    continent: 'Asia',
  },
  {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    currencyCode: 'CNY',
    phoneCode: '+86',
    importDutyPercent: 6.0,
    vatPercent: 13.0,
    airShippingPerKgUSD: 11.0,
    seaShippingPerCbmUSD: 120,
    isRestricted: false,
    continent: 'Asia',
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    phoneCode: '+81',
    importDutyPercent: 3.8,
    vatPercent: 10.0,
    airShippingPerKgUSD: 16.5,
    seaShippingPerCbmUSD: 180,
    isRestricted: false,
    continent: 'Asia',
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    phoneCode: '+1',
    importDutyPercent: 4.5,
    vatPercent: 13.0,
    airShippingPerKgUSD: 15.0,
    seaShippingPerCbmUSD: 165,
    isRestricted: false,
    continent: 'North America',
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currencyCode: 'SAR',
    phoneCode: '+966',
    importDutyPercent: 5.5,
    vatPercent: 15.0,
    airShippingPerKgUSD: 10.5,
    seaShippingPerCbmUSD: 125,
    isRestricted: false,
    continent: 'Middle East',
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    phoneCode: '+61',
    importDutyPercent: 5.0,
    vatPercent: 10.0,
    airShippingPerKgUSD: 18.0,
    seaShippingPerCbmUSD: 195,
    isRestricted: false,
    continent: 'Oceania',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-jackets', name: 'Jackets & Outerwear', slug: 'jackets-outerwear', description: 'Casual, winter and outdoor jackets for everyday wear and wholesale orders.', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900', iconName: 'Shirt', productCount: 2, isTradeSpecialty: false },
  { id: 'cat-gloves', name: 'Gloves', slug: 'gloves', description: 'Warm, work and everyday gloves in multiple sizes and materials.', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900', iconName: 'Hand', productCount: 1, isTradeSpecialty: false },
  { id: 'cat-footwear', name: 'Shoes & Footwear', slug: 'shoes-footwear', description: 'Comfortable casual sneakers and versatile footwear.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900', iconName: 'Footprints', productCount: 2, isTradeSpecialty: false },
  { id: 'cat-accessories', name: 'Caps & Accessories', slug: 'caps-accessories', description: 'Everyday caps and useful fashion accessories.', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900', iconName: 'ShoppingBag', productCount: 1, isTradeSpecialty: false },
];

export const INITIAL_SUPPLIERS: Supplier[] = [];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'demo-jacket-001', title: 'Classic Urban Bomber Jacket', slug: 'classic-urban-bomber-jacket', sku: 'CT-JKT-001', hsCode: '6201.93',
    category: 'Jackets & Outerwear', subcategory: 'Casual Jackets', shortDescription: 'Lightweight everyday bomber jacket with a clean modern fit.',
    description: 'Demo catalogue listing for a versatile bomber jacket. Soft inner lining, ribbed cuffs and hem, front zip closure and practical side pockets. Available in multiple colours and sizes.',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200'], countryOfOrigin: 'Pakistan', manufacturingDetails: 'Sample product listing — supplier details to be confirmed.',
    regularPriceUSD: 39, salePriceUSD: 32, wholesalePriceUSD: 24, moq: 5, maxOrderQuantity: 500, stock: 120, weightKg: 0.75,
    dimensionsCm: { length: 35, width: 28, height: 5 }, status: 'published', isFeatured: true, isWholesaleOnly: false, isNewArrival: true, isBestSeller: false,
    wholesaleTiers: [{ minQty: 5, maxQty: 24, unitPriceUSD: 27, discountPercent: 15 }, { minQty: 25, maxQty: null, unitPriceUSD: 24, discountPercent: 25 }],
    specifications: { Material: 'Polyester blend', Closure: 'Front zipper', Fit: 'Regular', Season: 'All season' }, shippingAvailability: ['ALL'],
    variations: { colors: ['Black', 'Olive', 'Navy'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    supplierId: 'sup-indus-textiles', supplierName: 'Indus Valley Heritage Mills (sample listing)', rating: 4.7, reviewsCount: 12
  },
  {
    id: 'demo-jacket-002', title: 'Water-Resistant Outdoor Jacket', slug: 'water-resistant-outdoor-jacket', sku: 'CT-JKT-002', hsCode: '6201.40',
    category: 'Jackets & Outerwear', subcategory: 'Outdoor Jackets', shortDescription: 'Practical lightweight shell jacket for travel and outdoor use.',
    description: 'Demo product with a water-resistant outer shell, adjustable hood, zip pockets and comfortable lining. Ideal for casual outdoor wear.',
    images: ['https://images.unsplash.com/photo-1544923246-77307dd654cb?w=1200'], countryOfOrigin: 'Pakistan', manufacturingDetails: 'Sample product listing — specifications subject to supplier confirmation.',
    regularPriceUSD: 54, salePriceUSD: 47, wholesalePriceUSD: 36, moq: 5, maxOrderQuantity: 400, stock: 85, weightKg: 0.9,
    dimensionsCm: { length: 38, width: 30, height: 6 }, status: 'published', isFeatured: true, isWholesaleOnly: false, isNewArrival: true, isBestSeller: false,
    wholesaleTiers: [{ minQty: 5, maxQty: 24, unitPriceUSD: 40, discountPercent: 15 }, { minQty: 25, maxQty: null, unitPriceUSD: 36, discountPercent: 25 }],
    specifications: { Material: 'Polyester shell', Feature: 'Water-resistant finish', Hood: 'Adjustable', Pockets: 'Two zip pockets' }, shippingAvailability: ['ALL'],
    variations: { colors: ['Black', 'Grey', 'Blue'], sizes: ['S', 'M', 'L', 'XL'] },
    supplierId: 'sup-indus-textiles', supplierName: 'Indus Valley Heritage Mills (sample listing)', rating: 4.6, reviewsCount: 8
  },
  {
    id: 'demo-gloves-001', title: 'Everyday Knit Winter Gloves', slug: 'everyday-knit-winter-gloves', sku: 'CT-GLV-001', hsCode: '6116.93',
    category: 'Gloves', subcategory: 'Winter Gloves', shortDescription: 'Soft stretch-knit gloves for comfortable everyday warmth.',
    description: 'Demo catalogue listing for soft knitted gloves with a flexible fit and warm feel. Suitable for daily commuting and winter use.',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200'], countryOfOrigin: 'Pakistan', manufacturingDetails: 'Sample product listing — supplier details to be confirmed.',
    regularPriceUSD: 12, salePriceUSD: 9, wholesalePriceUSD: 6.5, moq: 10, maxOrderQuantity: 2000, stock: 600, weightKg: 0.12,
    dimensionsCm: { length: 22, width: 12, height: 2 }, status: 'published', isFeatured: true, isWholesaleOnly: false, isNewArrival: false, isBestSeller: true,
    wholesaleTiers: [{ minQty: 10, maxQty: 49, unitPriceUSD: 7.5, discountPercent: 15 }, { minQty: 50, maxQty: null, unitPriceUSD: 6.5, discountPercent: 25 }],
    specifications: { Material: 'Acrylic knit', Style: 'Unisex', Season: 'Winter' }, shippingAvailability: ['ALL'],
    variations: { colors: ['Black', 'Grey', 'Cream'], sizes: ['One Size'] },
    supplierId: 'sup-indus-textiles', supplierName: 'Indus Valley Heritage Mills (sample listing)', rating: 4.8, reviewsCount: 19
  },
  {
    id: 'demo-shoes-001', title: 'Everyday Running Sneakers', slug: 'everyday-running-sneakers', sku: 'CT-SHO-001', hsCode: '6404.11',
    category: 'Shoes & Footwear', subcategory: 'Sneakers', shortDescription: 'Lightweight casual sneakers with cushioned soles.',
    description: 'Demo listing for versatile everyday sneakers featuring a breathable upper, padded collar and flexible rubber outsole. Great for casual wear and light activity.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200'], countryOfOrigin: 'Pakistan', manufacturingDetails: 'Sample product listing — supplier details to be confirmed.',
    regularPriceUSD: 49, salePriceUSD: 42, wholesalePriceUSD: 31, moq: 5, maxOrderQuantity: 500, stock: 160, weightKg: 0.8,
    dimensionsCm: { length: 32, width: 20, height: 12 }, status: 'published', isFeatured: true, isWholesaleOnly: false, isNewArrival: true, isBestSeller: true,
    wholesaleTiers: [{ minQty: 5, maxQty: 24, unitPriceUSD: 36, discountPercent: 15 }, { minQty: 25, maxQty: null, unitPriceUSD: 31, discountPercent: 25 }],
    specifications: { Upper: 'Breathable textile', Sole: 'Rubber', Use: 'Casual / light running' }, shippingAvailability: ['ALL'],
    variations: { colors: ['White/Red', 'Black', 'Grey'], sizes: ['39', '40', '41', '42', '43', '44', '45'] },
    supplierId: 'sup-indus-textiles', supplierName: 'Indus Valley Heritage Mills (sample listing)', rating: 4.7, reviewsCount: 27
  },
  {
    id: 'demo-shoes-002', title: 'Minimal Classic White Sneakers', slug: 'minimal-classic-white-sneakers', sku: 'CT-SHO-002', hsCode: '6404.19',
    category: 'Shoes & Footwear', subcategory: 'Casual Shoes', shortDescription: 'Clean low-top sneakers for daily casual outfits.',
    description: 'Demo listing featuring a simple low-top silhouette, lace-up fastening and durable outsole. Neutral styling for everyday use.',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200'], countryOfOrigin: 'Pakistan', manufacturingDetails: 'Sample product listing — supplier details to be confirmed.',
    regularPriceUSD: 44, salePriceUSD: 38, wholesalePriceUSD: 28, moq: 5, maxOrderQuantity: 500, stock: 95, weightKg: 0.78,
    dimensionsCm: { length: 32, width: 20, height: 12 }, status: 'published', isFeatured: false, isWholesaleOnly: false, isNewArrival: true, isBestSeller: false,
    wholesaleTiers: [{ minQty: 5, maxQty: 24, unitPriceUSD: 33, discountPercent: 15 }, { minQty: 25, maxQty: null, unitPriceUSD: 28, discountPercent: 25 }],
    specifications: { Upper: 'Synthetic leather', Closure: 'Laces', Sole: 'Rubber' }, shippingAvailability: ['ALL'],
    variations: { colors: ['White', 'Off White'], sizes: ['39', '40', '41', '42', '43', '44'] },
    supplierId: 'sup-indus-textiles', supplierName: 'Indus Valley Heritage Mills (sample listing)', rating: 4.5, reviewsCount: 6
  },
  {
    id: 'demo-cap-001', title: 'Adjustable Everyday Baseball Cap', slug: 'adjustable-everyday-baseball-cap', sku: 'CT-CAP-001', hsCode: '6505.00',
    category: 'Caps & Accessories', subcategory: 'Caps', shortDescription: 'Classic six-panel cap with an adjustable rear strap.',
    description: 'Demo catalogue listing for a lightweight everyday baseball cap with curved brim, stitched eyelets and an adjustable closure.',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200'], countryOfOrigin: 'Pakistan', manufacturingDetails: 'Sample product listing — supplier details to be confirmed.',
    regularPriceUSD: 16, salePriceUSD: 13, wholesalePriceUSD: 8, moq: 10, maxOrderQuantity: 1500, stock: 420, weightKg: 0.11,
    dimensionsCm: { length: 22, width: 20, height: 12 }, status: 'published', isFeatured: true, isWholesaleOnly: false, isNewArrival: false, isBestSeller: true,
    wholesaleTiers: [{ minQty: 10, maxQty: 49, unitPriceUSD: 10, discountPercent: 15 }, { minQty: 50, maxQty: null, unitPriceUSD: 8, discountPercent: 25 }],
    specifications: { Material: 'Cotton twill', Panels: 'Six panel', Closure: 'Adjustable strap' }, shippingAvailability: ['ALL'],
    variations: { colors: ['Black', 'Navy', 'Beige', 'White'], sizes: ['Adjustable'] },
    supplierId: 'sup-indus-textiles', supplierName: 'Indus Valley Heritage Mills (sample listing)', rating: 4.8, reviewsCount: 14
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_RFQS: RFQ[] = [];

export const INITIAL_INQUIRIES: TradeInquiry[] = [];

export const INITIAL_COUPONS: Coupon[] = [];

export const INITIAL_SETTINGS: WebsiteSettings = {
  brandName: 'CATIFY TRADE',
  email: 'tardecatify@gmail.com',
  phone: '+92 324 7615133',
  whatsapp: '+92 324 7615133',
  domain: 'catify-trade-alikhanxada1001-2695.vercel.app',
  tagline: 'Product Discovery & Wholesale Inquiry Platform',
  heroHeading: 'Explore Products and Request Wholesale Quotes',
  heroSubheading: 'Browse sample catalogue listings and send product, quantity and destination requirements for a quotation.',
  announcementText: 'Sample catalogue listings · Supplier availability and final pricing confirmed after inquiry',
  freeShippingThresholdUSD: 0,
  customsInsurancePercent: 0,
  bankDetails: { bankName: '', beneficiaryName: '', accountNumber: '', iban: '', swiftBic: '', bankBranch: '', bankAddress: '', instructions: '' }
};

export const INITIAL_REVIEWS: CustomerReview[] = [];

export const INITIAL_ADMIN_LOGS: AdminActivityLog[] = [];
