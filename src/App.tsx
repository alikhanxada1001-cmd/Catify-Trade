import React, { Suspense, lazy } from 'react';
import { TradeProvider, useTrade } from './context/TradeContext';
import { TopAnnouncementBar } from './components/layout/TopAnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { RFQModal } from './components/rfq/RFQModal';
import { SeoManager } from './components/seo/SeoManager';

// Pages
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const WholesalePage = lazy(() => import('./pages/WholesalePage').then((m) => ({ default: m.WholesalePage })));
const ImportExportPages = lazy(() => import('./pages/ImportExportServicesPages'));
const SupplierPages = lazy(() => import('./pages/SuppliersPages'));
const RequestQuotePage = lazy(() => import('./pages/RequestQuotePage').then((m) => ({ default: m.RequestQuotePage })));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const CustomerDashboardPage = lazy(() => import('./pages/CustomerDashboardPage').then((m) => ({ default: m.CustomerDashboardPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const InformationalPages = lazy(() => import('./pages/InformationalPages'));
const AkDevStudioPage = lazy(() => import('./pages/AkDevStudioPage').then((m) => ({ default: m.AkDevStudioPage })));

const MainLayout: React.FC = () => {
  const { currentPage, isAdminAuthenticated } = useTrade();

  // Keep the admin area completely separate from the public storefront layout.
  // No public header, announcement bar, homepage, cart drawer, or footer is rendered here.
  if (currentPage === 'admin-dashboard') {
    return (
      <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-slate-500" role="status">Loading admin…</div>}>
        {isAdminAuthenticated ? <AdminDashboardPage /> : <AdminLoginPage />}
      </Suspense>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'wholesale':
        return <WholesalePage />;
      case 'import-services':
        return <ImportExportPages.ImportServicesPage />;
      case 'export-services':
        return <ImportExportPages.ExportServicesPage />;
      case 'suppliers':
        return <SupplierPages.SuppliersPage />;
      case 'supplier-detail':
        return <SupplierPages.SupplierDetailPage />;
      case 'request-quote':
        return <RequestQuotePage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'checkout':
      case 'cart':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'customer-dashboard':
        return <CustomerDashboardPage />;
      case 'admin-dashboard':
        return isAdminAuthenticated ? <AdminDashboardPage /> : <AdminLoginPage />;
      case 'about':
        return <InformationalPages.AboutPage />;
      case 'contact':
        return <InformationalPages.ContactPage />;
      case 'faqs':
        return <InformationalPages.FAQsPage />;
      case 'shipping-policy':
        return <InformationalPages.ShippingPolicyPage />;
      case 'refund-policy':
        return <InformationalPages.RefundPolicyPage />;
      case 'privacy-policy':
        return <InformationalPages.TermsPrivacyPage type="privacy" />;
      case 'terms':
        return <InformationalPages.TermsPrivacyPage type="terms" />;
      case 'ak-dev-studio':
        return <AkDevStudioPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      <SeoManager />
      <TopAnnouncementBar />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[45vh] grid place-items-center text-sm text-slate-500" role="status">Loading page…</div>}>
          {renderCurrentPage()}
        </Suspense>
      </main>
      <Footer />

      {/* Global Overlays & Slide-outs */}
      <CartDrawer />
      <RFQModal />
    </div>
  );
};

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected rendering error' };
  }

  componentDidCatch(error: Error) {
    console.error('Catify Trade UI Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
            <h1 className="text-lg font-bold text-slate-900">Unable to load page</h1>
            <p className="text-xs text-slate-600">{this.state.errorMessage}</p>
            <button
              onClick={() => {
                try {
                  Object.keys(localStorage).filter((key) => key.startsWith('catify_')).forEach((key) => localStorage.removeItem(key));
                } catch {}
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-950 text-white text-xs font-semibold rounded-lg hover:bg-blue-900"
            >
              Reset Local Cache &amp; Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <TradeProvider>
        <MainLayout />
      </TradeProvider>
    </AppErrorBoundary>
  );
}
