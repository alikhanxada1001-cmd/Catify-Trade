import React, { useEffect } from 'react';
import { useTrade, PageRoute, buildRoutePath } from '../../context/TradeContext';
import { Category, Product, Supplier, WebsiteSettings } from '../../types';

export interface PageSeoMetadata {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  ogType: 'website' | 'product' | 'article';
  image: string;
  canonicalPath: string;
  jsonLd: Record<string, unknown>;
}

interface SeoInput {
  currentPage: PageRoute;
  selectedProductSlug: string | null;
  selectedCategorySlug: string | null;
  selectedSupplierId: string | null;
  isAdminAuthenticated: boolean;
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  settings: WebsiteSettings;
  origin?: string;
}

const DEFAULT_LOGO_PATH = '/assets/aistudio/Catify_Trade_Circular_Logo_df00bcb5.png';
const AK_STUDIO_LOGO_PATH = '/assets/aistudio/AK_Dev_Studio__Build__Design__Deploy_3191f75b.png';

const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_ROBOTS = 'noindex, nofollow';

function truncateTitle(raw: string, suffix: string, maxLen = 60): string {
  const full = `${raw}${suffix}`;
  if (full.length <= maxLen) return full;
  const budget = Math.max(18, maxLen - suffix.length - 3);
  return `${raw.slice(0, budget).trim()}...${suffix}`;
}

function clampDescription(text: string, minLen = 120, maxLen = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length > maxLen) {
    return `${clean.slice(0, maxLen - 3).trim()}...`;
  }
  if (clean.length < minLen) {
    const pad = ' Explore sample product listings and request a wholesale quotation from Catify Trade.';
    const combined = `${clean}${pad}`;
    return combined.length > maxLen ? `${combined.slice(0, maxLen - 3).trim()}...` : combined;
  }
  return clean;
}

function resolveUrl(pathOrUrl: string, origin = ''): string {
  if (!pathOrUrl) return origin ? `${origin}${DEFAULT_LOGO_PATH}` : DEFAULT_LOGO_PATH;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return origin ? `${origin}${cleanPath}` : cleanPath;
}

export function getPageSeoMetadata({
  currentPage,
  selectedProductSlug,
  selectedCategorySlug,
  selectedSupplierId,
  isAdminAuthenticated,
  products,
  categories,
  suppliers,
  settings,
  origin = '',
}: SeoInput): PageSeoMetadata {
  const brandName = settings.brandName || 'Catify Trade';
  const defaultImage = resolveUrl(DEFAULT_LOGO_PATH, origin);
  const canonicalPath = buildRoutePath(currentPage, {
    slug:
      currentPage === 'product-detail'
        ? selectedProductSlug || undefined
        : currentPage === 'category-detail'
        ? selectedCategorySlug || undefined
        : undefined,
    id: currentPage === 'supplier-detail' ? selectedSupplierId || undefined : undefined,
  });
  const canonicalUrl = resolveUrl(canonicalPath, origin);
  const homeUrl = resolveUrl('/', origin);

  const organizationSchema = {
    '@type': 'Organization',
    name: 'Catify Trade',
    email: settings.email,
    telephone: settings.phone,
    logo: defaultImage,
    url: homeUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone,
      email: settings.email,
      contactType: 'customer service',
      availableLanguage: ['English', 'Urdu'],
    },
  };

  switch (currentPage) {
    case 'home': {
      return {
        title: 'Catify Trade | Wholesale Product Discovery & Sourcing',
        description: clampDescription(
          'Explore sample product listings and request wholesale sourcing, product and shipping quotations from Catify Trade.'
        ),
        keywords:
          'Catify Trade, wholesale product discovery, apparel catalogue, sourcing enquiry, bulk product quotation',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            organizationSchema,
            {
              '@type': 'WebSite',
              name: 'Catify Trade',
              url: homeUrl,
              description:
                'Product discovery and quotation request platform for wholesale and sourcing enquiries.',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${resolveUrl('/shop', origin)}?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            },
          ],
        },
      };
    }

    case 'shop':
    case 'categories':
    case 'category-detail': {
      const activeCategory =
        currentPage === 'category-detail' && selectedCategorySlug
          ? categories.find((c) => c.slug === selectedCategorySlug)
          : undefined;
      const publishedProducts = products.filter((p) => p.status === 'published');
      const title = activeCategory
        ? truncateTitle(activeCategory.name, ' | Catify Trade')
        : currentPage === 'categories'
        ? 'Product Categories | Catify Trade'
        : 'Wholesale Product Catalogue | Catify Trade';
      const description = clampDescription(
        activeCategory
          ? `Explore sample ${activeCategory.name} listings. Confirm supplier availability, final pricing and shipping in a written quotation.`
          : 'Browse sample apparel and accessory listings. Product availability, final pricing and supplier details are confirmed after enquiry.'
      );

      return {
        title,
        description,
        keywords:
          'Catify Trade catalogue, apparel products, wholesale product enquiry, sourcing quotation',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: activeCategory ? resolveUrl(activeCategory.image, origin) : defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              name: activeCategory ? activeCategory.name : 'Catify Trade Global Catalog',
              description,
              url: canonicalUrl,
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: publishedProducts.length,
                itemListElement: publishedProducts.slice(0, 10).map((prod, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  name: prod.title,
                  url: resolveUrl(`/product/${prod.slug}`, origin),
                })),
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
                { '@type': 'ListItem', position: 2, name: 'Shop Catalog', item: canonicalUrl },
              ],
            },
          ],
        },
      };
    }

    case 'product-detail': {
      const product =
        products.find((p) => p.slug === selectedProductSlug) ||
        products.find((p) => p.status === 'published') ||
        products[0];

      if (!product) {
        return {
          title: 'Commercial Export Product Details | Catify Trade',
          description: clampDescription(
            'Explore sample product details, indicative pricing and wholesale enquiry options on Catify Trade.'
          ),
          keywords: 'Catify Trade product, HS code export, bulk wholesale pricing',
          robots: INDEX_ROBOTS,
          ogType: 'product',
          image: defaultImage,
          canonicalPath,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Product Detail | Catify Trade',
            url: canonicalUrl,
          },
        };
      }

      const productImage = resolveUrl(product.images?.[0] || DEFAULT_LOGO_PATH, origin);

      return {
        title: truncateTitle(product.title, ' | Catify Trade'),
        description: clampDescription(
          `${product.shortDescription} SKU: ${product.sku}. Sample listing; supplier, stock, final price and shipping details are confirmed after enquiry.`
        ),
        keywords: `${product.title}, ${product.category}, ${product.sku}, HS ${product.hsCode}, ${product.countryOfOrigin} export, Catify Trade`,
        robots: INDEX_ROBOTS,
        ogType: 'product',
        image: productImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Product',
              name: product.title,
              image: product.images.map((img) => resolveUrl(img, origin)),
              description: product.description || product.shortDescription,
              sku: product.sku,
              mpn: product.hsCode,
              category: product.category,
              countryOfOrigin: {
                '@type': 'Country',
                name: product.countryOfOrigin,
              },
              brand: {
                '@type': 'Brand',
                name: product.supplierName || brandName,
              },

            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
                { '@type': 'ListItem', position: 2, name: 'Shop', item: resolveUrl('/shop', origin) },
                { '@type': 'ListItem', position: 3, name: product.title, item: canonicalUrl },
              ],
            },
          ],
        },
      };
    }

    case 'wholesale': {
      return {
        title: 'Wholesale Product Enquiries | Catify Trade',
        description: clampDescription(
          'Explore sample bulk pricing and send quantity, customization and destination details for a wholesale quotation.'
        ),
        keywords:
          'Catify Trade wholesale enquiry, sample MOQ pricing, bulk product quotation',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              name: 'Catify Trade Wholesale & B2B Procurement Hub',
              description:
                'Sample product listings and indicative tier pricing for wholesale enquiries.',
              url: canonicalUrl,
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
                { '@type': 'ListItem', position: 2, name: 'Wholesale B2B', item: canonicalUrl },
              ],
            },
          ],
        },
      };
    }

    case 'suppliers':
    case 'supplier-detail': {
      const supplier =
        currentPage === 'supplier-detail' && selectedSupplierId
          ? suppliers.find((s) => s.id === selectedSupplierId)
          : undefined;
      const title = supplier
        ? truncateTitle(supplier.name, ' | Supplier Profile')
        : 'Supplier Directory | Catify Trade';
      const description = clampDescription(
        supplier
          ? `${supplier.name} in ${supplier.city}, ${supplier.country}. Certifications: ${supplier.certifications.join(', ')}. ${supplier.about}`
          : 'Supplier profiles are added after identity and business credentials have been checked. No supplier profiles are currently published.'
      );

      return {
        title,
        description,
        keywords: supplier
          ? `${supplier.name}, ${supplier.country} exporter, ${supplier.certifications.join(', ')}, Catify Trade supplier`
          : 'supplier directory, supplier verification, Catify Trade sourcing',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            supplier
              ? {
                  '@type': 'Organization',
                  name: supplier.name,
                  description: supplier.about,
                  url: canonicalUrl,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: supplier.city,
                    addressCountry: supplier.country,
                  },
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: supplier.rating.toFixed(2),
                    bestRating: '5',
                    ratingCount: 25,
                  },
                }
              : {
                  '@type': 'CollectionPage',
                  name: 'Supplier Directory',
                  description,
                  url: canonicalUrl,
                },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
                { '@type': 'ListItem', position: 2, name: 'Suppliers', item: resolveUrl('/suppliers', origin) },
                ...(supplier
                  ? [{ '@type': 'ListItem', position: 3, name: supplier.name, item: canonicalUrl }]
                  : []),
              ],
            },
          ],
        },
      };
    }

    case 'import-services': {
      return {
        title: 'Import Planning & Documentation | Catify Trade',
        description: clampDescription(
          'Share your product and destination details to discuss import documentation requirements and possible logistics options.'
        ),
        keywords:
          'import documentation, customs broker questions, shipping enquiry, Catify Trade',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Import Documentation Information',
          provider: organizationSchema,
          areaServed: 'Worldwide',
          serviceType: 'Import documentation and sourcing enquiry',
          url: canonicalUrl,
        },
      };
    }

    case 'export-services': {
      return {
        title: 'Global Export Sourcing & Compliance | Catify Trade',
        description: clampDescription(
          'Share your origin, destination and product details to discuss possible export documentation and shipping requirements.'
        ),
        keywords:
          'export documentation enquiry, wholesale sourcing, shipping requirements',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'International Export Compliance & Sourcing Desk',
          provider: organizationSchema,
          areaServed: 'Worldwide',
          serviceType: 'Export documentation information',
          url: canonicalUrl,
        },
      };
    }

    case 'request-quote': {
      return {
        title: 'Request Bulk Trade Quotation (RFQ) | Catify Trade',
        description: clampDescription(
          'Submit product, quantity, destination and preferred trade terms. Final supplier availability and quotation details are confirmed after review.'
        ),
        keywords:
          'request trade quotation, B2B RFQ form, wholesale custom pricing, FOB CIF quote, Catify Trade',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Catify Trade B2B Request for Quotation (RFQ)',
          provider: organizationSchema,
          url: canonicalUrl,
        },
      };
    }

    case 'track-order': {
      return {
        title: 'Track International Cargo & Orders | Catify Trade',
        description: clampDescription(
          'Order tracking details are available only after a confirmed order and valid tracking reference have been provided.'
        ),
        keywords: 'track international order, shipment status, customs clearance tracking, Catify Trade tracking',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Catify Trade Shipment & Cargo Tracker',
          url: canonicalUrl,
        },
      };
    }

    case 'about': {
      return {
        title: 'About Catify Trade | Global Trade Platform',
        description: clampDescription(
          'Learn about Catify Trade's product discovery catalogue and quotation request process.'
        ),
        keywords: 'about Catify Trade, product discovery, wholesale sourcing enquiry',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Catify Trade International',
          mainEntity: organizationSchema,
          url: canonicalUrl,
        },
      };
    }

    case 'contact': {
      return {
        title: 'Contact Catify Trade Desk | WhatsApp & Support',
        description: clampDescription(
          'Reach Catify Trade via WhatsApp (+92 324 7615133) or email (tardecatify@gmail.com) for bulk quotations, L/C terms, and shipment support.'
        ),
        keywords: 'contact Catify Trade, tardecatify@gmail.com, +92 324 7615133, import export support desk',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Catify Trade Operations Desk',
          mainEntity: organizationSchema,
          url: canonicalUrl,
        },
      };
    }

    case 'faqs': {
      const faqItems = [
        {
          q: 'What are the Minimum Order Quantities (MOQs) on Catify Trade?',
          a: 'MOQs vary by commodity. Precision CNC and industrial machinery items start as low as 4-5 units, whereas agricultural salts and textile bolts have volume minimums (e.g. 20-50 units) for container freight efficiency. Sample units can also be ordered at standard retail rates.',
        },
        {
          q: 'Which international payment methods are supported?',
          a: 'We accept SWIFT MT103 international bank wire transfers (T/T), Irrevocable Letters of Credit (L/C at sight) for wholesale contracts over $5,000, international credit cards (Visa, MasterCard, American Express), and PayPal Business.',
        },
        {
          q: 'How are customs duties and import taxes calculated?',
          a: 'Duties depend on your destination country and the specific HS Code (Harmonized Tariff Schedule) of the product. Our platform provides estimated landed customs duty calculations at checkout based on current bilateral tariff schedules.',
        },
        {
          q: 'What shipping options do you offer for cross-border cargo?',
          a: 'We provide Priority Air Cargo Express (7-10 business days) via DHL/FedEx for urgent machinery parts and samples, as well as Ocean Freight LCL (Less-than-Container Load) and FCL (Full Container Load 20ft/40ft) via Tier-1 maritime carriers (Maersk, MSC, Hapag-Lloyd).',
        },
        {
          q: 'How does escrow protection safeguard international buyers?',
          a: 'Payments are held securely by Catify Trade until the goods pass pre-shipment quality inspection and the Bill of Lading (B/L) or Air Waybill is formally issued and verified against buyer specifications.',
        },
      ];

      return {
        title: 'Import, Export & Wholesale FAQs | Catify Trade',
        description: clampDescription(
          'Get practical answers about sample catalogue pricing, wholesale enquiries, supplier checks and shipping estimates.'
        ),
        keywords: 'Catify Trade FAQs, sample MOQ, sourcing enquiry, shipping information',
        robots: INDEX_ROBOTS,
        ogType: 'article',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        },
      };
    }

    case 'shipping-policy': {
      return {
        title: 'International Shipping Policy | Catify Trade',
        description: clampDescription(
          'Review shipping options, indicative freight estimates, customs responsibilities and the details to confirm before dispatch.'
        ),
        keywords: 'Catify Trade shipping policy, Incoterms 2020, ocean freight, air express, customs demurrage',
        robots: INDEX_ROBOTS,
        ogType: 'article',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'International Shipping & Logistics Policy',
          url: canonicalUrl,
        },
      };
    }

    case 'refund-policy': {
      return {
        title: 'Commercial Return & Refund Policy | Catify Trade',
        description: clampDescription(
          'Read current order, cancellation and refund information. No online payments or purchases are processed through this website.'
        ),
        keywords: 'Catify Trade refund policy, cargo inspection period, commercial trade protection',
        robots: INDEX_ROBOTS,
        ogType: 'article',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Commercial Return & Refund Policy',
          url: canonicalUrl,
        },
      };
    }

    case 'privacy-policy': {
      return {
        title: 'Global Privacy & GDPR Policy | Catify Trade',
        description: clampDescription(
          'Learn how Catify Trade protects importer identity, shipping manifests, and corporate buyer data under GDPR and cross-border standards.'
        ),
        keywords: 'Catify Trade privacy policy, GDPR compliance, trade data security',
        robots: INDEX_ROBOTS,
        ogType: 'article',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Global Privacy & GDPR Compliance',
          url: canonicalUrl,
        },
      };
    }

    case 'terms': {
      return {
        title: 'Terms of International Sale | Catify Trade',
        description: clampDescription(
          'Review commercial sales terms, RFQ validity, proforma invoice settlements, and buyer/supplier compliance rules for Catify Trade.'
        ),
        keywords: 'Catify Trade terms of sale, commercial trade agreement, proforma invoice terms',
        robots: INDEX_ROBOTS,
        ogType: 'article',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms of International Sale',
          url: canonicalUrl,
        },
      };
    }

    case 'ak-dev-studio': {
      return {
        title: 'AK Dev Studio | Custom Web & E-Commerce Partner',
        description: clampDescription(
          'Custom React, Next.js, PHP & MySQL e-commerce websites, AI chatbots, and web applications by AK Dev Studio. WhatsApp: 03261604808.'
        ),
        keywords:
          'AK Dev Studio, akdevstudiosolutions@gmail.com, 03261604808, React Next.js developer Pakistan, e-commerce website development',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: resolveUrl(AK_STUDIO_LOGO_PATH, origin),
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'AK Dev Studio',
          description:
            'Custom web development, React & Next.js e-commerce platforms, PHP & MySQL apps, and AI chatbot integrations.',
          email: 'akdevstudiosolutions@gmail.com',
          telephone: '+92-326-1604808',
          logo: resolveUrl(AK_STUDIO_LOGO_PATH, origin),
          sameAs: ['https://www.facebook.com/share/p/19mp5NR2tZ/'],
          url: canonicalUrl,
        },
      };
    }

    case 'cart':
    case 'checkout': {
      return {
        title: 'Product Enquiry List | Catify Trade',
        description: clampDescription(
          'Review selected sample products and request a quotation. This website does not process online payments or confirm live stock.'
        ),
        keywords: 'Catify Trade checkout, COD Pakistan, international trade payment',
        robots: NOINDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Secure Checkout | Catify Trade',
          url: canonicalUrl,
        },
      };
    }

    case 'order-success': {
      return {
        title: 'Order Enquiry Status | Catify Trade',
        description: clampDescription(
          'Order status and tracking are available only after a confirmed order has been arranged separately.'
        ),
        keywords: 'Catify Trade order confirmation, commercial invoice',
        robots: NOINDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Order Confirmed | Catify Trade',
          url: canonicalUrl,
        },
      };
    }

    case 'customer-dashboard': {
      return {
        title: 'Buyer Account & Saved Orders | Catify Trade',
        description: clampDescription(
          'Access your international purchase orders, active RFQ quotations, saved wishlist items, and commercial invoices on Catify Trade.'
        ),
        keywords: 'Catify Trade buyer dashboard, order history, RFQ management',
        robots: NOINDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Buyer Dashboard | Catify Trade',
          url: canonicalUrl,
        },
      };
    }

    case 'admin-dashboard': {
      return {
        title: isAdminAuthenticated
          ? 'Admin Operations Console | Catify Trade'
          : 'Secure Admin Login | Catify Trade Operations',
        description: clampDescription(
          'Restricted Catify Trade administrator authentication portal for catalog, order, RFQ, currency, and trade operations management.'
        ),
        keywords: 'Catify Trade admin login, operations console',
        robots: NOINDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Catify Trade Admin Portal',
          url: canonicalUrl,
        },
      };
    }

    default: {
      return {
        title: 'Catify Trade | Global Import & Export Marketplace',
        description: clampDescription(
          'Buy wholesale bulk stock or single retail products in Pakistan & worldwide with Catify Trade. Verified exporters, customs clearance & global delivery.'
        ),
        keywords: 'Catify Trade, global import export marketplace, wholesale B2B',
        robots: INDEX_ROBOTS,
        ogType: 'website',
        image: defaultImage,
        canonicalPath,
        jsonLd: {
          '@context': 'https://schema.org',
          ...organizationSchema,
        },
      };
    }
  }
}

function upsertMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLdScript(data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let script = document.head.querySelector('#catify-seo-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'catify-seo-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export const SeoManager: React.FC = () => {
  const {
    currentPage,
    selectedProductSlug,
    selectedCategorySlug,
    selectedSupplierId,
    isAdminAuthenticated,
    products,
    categories,
    suppliers,
    settings,
  } = useTrade();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const origin = window.location.origin;
    const seo = getPageSeoMetadata({
      currentPage,
      selectedProductSlug,
      selectedCategorySlug,
      selectedSupplierId,
      isAdminAuthenticated,
      products,
      categories,
      suppliers,
      settings,
      origin,
    });

    const canonicalHref = `${origin}${window.location.pathname || seo.canonicalPath}`;

    document.title = seo.title;

    // Standard SEO Meta Tags
    upsertMetaTag('name', 'description', seo.description);
    upsertMetaTag('name', 'keywords', seo.keywords);
    upsertMetaTag('name', 'robots', seo.robots);
    upsertMetaTag('name', 'author', 'Catify Trade International');

    // OpenGraph Tags
    upsertMetaTag('property', 'og:type', seo.ogType);
    upsertMetaTag('property', 'og:site_name', 'Catify Trade');
    upsertMetaTag('property', 'og:title', seo.title);
    upsertMetaTag('property', 'og:description', seo.description);
    upsertMetaTag('property', 'og:url', canonicalHref);
    upsertMetaTag('property', 'og:image', seo.image);
    upsertMetaTag('property', 'og:image:alt', seo.title);

    // Twitter Cards
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', seo.title);
    upsertMetaTag('name', 'twitter:description', seo.description);
    upsertMetaTag('name', 'twitter:image', seo.image);

    // Canonical URL + JSON-LD Schema.org
    upsertCanonicalLink(canonicalHref);
    upsertJsonLdScript(seo.jsonLd);
  }, [
    currentPage,
    selectedProductSlug,
    selectedCategorySlug,
    selectedSupplierId,
    isAdminAuthenticated,
    products,
    categories,
    suppliers,
    settings,
  ]);

  return null;
};
