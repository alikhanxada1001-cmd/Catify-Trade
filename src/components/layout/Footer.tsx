import React from 'react';
import { useTrade, PageRoute } from '../../context/TradeContext';
import {
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Send,
  CheckCircle2,
  Lock,
  FileText,
  CreditCard,
  Building2,
  Anchor,
  Plane,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, navigateTo } = useTrade();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Pre-Footer Value Props */}
      <div className="border-b border-slate-900 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-900/50 text-amber-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-0.5">Product Discovery</h4>
                <p className="text-slate-400">Explore sample product listings and send wholesale enquiries.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-900/50 text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-0.5">Supplier Checks</h4>
                <p className="text-slate-400">Supplier profiles are listed only after identity and business details have been checked.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-900/50 text-amber-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-0.5">Payment Safety</h4>
                <p className="text-slate-400">No online payment gateway or escrow is currently connected. Verify payment details independently.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-900/50 text-amber-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-0.5">Customs Compliance</h4>
                <p className="text-slate-400">Confirm customs and document requirements with the relevant authority or a licensed broker.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Catify_Trade_Circular_Logo_df00bcb5.png"
                alt="Catify Trade Brand Logo"
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-contain rounded-full border border-amber-400/40 bg-white"
              />
              <div>
                <span className="text-lg font-bold text-white tracking-tight">CATIFY TRADE</span>
                <p className="text-xs text-amber-400/90 font-medium">Wholesale Product Discovery &amp; Sourcing Enquiries</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Browse sample catalogue listings and submit product, quantity and destination details for a quotation. Supplier availability and final terms are confirmed after review.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors underline decoration-slate-700">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: <span className="font-medium text-emerald-400">{settings.phone}</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Product Enquiry Support</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-4 max-w-md">
              <p className="text-xs font-semibold text-slate-200 mb-1.5">Have a product or sourcing question?</p>
              <a href={`mailto:${settings.email}?subject=Catify%20Trade%20Enquiry`} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400">
                <Mail className="h-3.5 w-3.5" /> Email the team
              </a>
            </div>
          </div>

          {/* Column 2: Trade Marketplace */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Trade Portals</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-amber-400 transition-colors">
                  All Product Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wholesale')} className="hover:text-amber-400 transition-colors">
                  Wholesale B2B Hub
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('request-quote')} className="hover:text-amber-400 transition-colors">
                  Request a Quote (RFQ)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('suppliers')} className="hover:text-amber-400 transition-colors">
                  Supplier Directory
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('track-order')} className="hover:text-amber-400 transition-colors">
                  Order Tracking Information
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('customer-dashboard')} className="hover:text-amber-400 transition-colors">
                  Importer Account Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Logistics & Customs */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Logistics &amp; Customs</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('import-services')} className="hover:text-amber-400 transition-colors">
                  Import Documentation Guidance
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('export-services')} className="hover:text-amber-400 transition-colors">
                  Export Enquiry
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping-policy')} className="hover:text-amber-400 transition-colors">
                  Sea Freight Information
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping-policy')} className="hover:text-amber-400 transition-colors">
                  Air Freight Information
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping-policy')} className="hover:text-amber-400 transition-colors">
                  Incoterms 2020 Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faqs')} className="hover:text-amber-400 transition-colors">
                  Trade FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal &amp; Policy</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-amber-400 transition-colors">
                  About Catify Trade
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-amber-400 transition-colors">
                  Contact Trade Officers
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping-policy')} className="hover:text-amber-400 transition-colors">
                  International Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('refund-policy')} className="hover:text-amber-400 transition-colors">
                  Refund &amp; Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy-policy')} className="hover:text-amber-400 transition-colors">
                  Privacy Policy (GDPR)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-amber-400 transition-colors">
                  Terms of International Sale
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Accepted Payment & Settlement Methods Strip */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="font-semibold text-slate-400">Settlement Gateways:</span>
            <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">SWIFT Bank Wire / T/T</span>
            <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">Letter of Credit (L/C)</span>
            <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">Visa / Mastercard / Amex</span>
            <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">PayPal International</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Configurable Domain: <strong className="text-slate-400">{settings.domain}</strong></span>
          </div>
        </div>

        {/* Copyright & Developer Credit */}
        <div className="mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.brandName}. All Rights Reserved. International Import, Export &amp; Wholesale Marketplace.</p>
          <button
            type="button"
            onClick={() => navigateTo('ak-dev-studio')}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-300 font-medium transition-colors cursor-pointer group"
          >
            <img
              src="/assets/aistudio/AK_Dev_Studio__Build__Design__Deploy_3191f75b.png"
              alt="AK Dev Studio Logo"
              className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-400/50 group-hover:ring-sky-300 transition-all"
            />
            <span>Created by</span>
            <span className="font-bold text-sky-400 group-hover:text-sky-300 group-hover:underline underline-offset-4">
              AK Dev Studio
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};
