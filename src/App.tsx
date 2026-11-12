import React from 'react';
import { TradeProvider, useTrade } from './context/TradeContext';
import { TopAnnouncementBar } from './components/layout/TopAnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { RFQModal } from './components/rfq/RFQModal';
import { SeoManager } from './components/seo/SeoManager';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WholesalePage } from './pages/WholesalePage';
import { ImportServicesPage, ExportServicesPage } from './pages/ImportExportServicesPages';
import { SuppliersPage, SupplierDetailPage } from './pages/SuppliersPages';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import {
  AboutPage,
  ContactPage,
  FAQsPage,
  ShippingPolicyPage,
  RefundPolicyPage,
  TermsPrivacyPage,
} from './pages/InformationalPages';
import { AkDevStudioPage } from './pages/AkDevStudioPage';

const MainLayout: React.FC = () => {
  const { currentPage, isAdminAuthenticated } = useTrade();

  if (currentPage === 'admin-dashboard' && !isAdminAuthenticated) {
    return (
      <>
        <SeoManager />
        <AdminLoginPage />
      </>
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
        return <ImportServicesPage />;
      case 'export-services':
        return <ExportServicesPage />;
      case 'suppliers':
        return <SuppliersPage />;
      case 'supplier-detail':
        return <SupplierDetailPage />;
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
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faqs':
        return <FAQsPage />;
      case 'shipping-policy':
        return <ShippingPolicyPage />;
      case 'refund-policy':
        return <RefundPolicyPage />;
      case 'privacy-policy':
        return <TermsPrivacyPage type="privacy" />;
      case 'terms':
        return <TermsPrivacyPage type="terms" />;
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
      <main className="flex-1">{renderCurrentPage()}</main>
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
                  localStorage.clear();
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
