import React, { useState } from 'react';
import { useTrade, PageRoute } from '../../context/TradeContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  FileSpreadsheet,
  PackageCheck,
  ChevronRight,
  Shield,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    cartTotalItems,
    cartSubtotalUSD,
    formatPrice,
    setIsCartDrawerOpen,
    wishlist,
    openRFQModal,
    searchQuery,
    setSearchQuery,
    userRole,
    setUserRole,
    isAdminAuthenticated,
  } = useTrade();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
      setSearchOpen(false);
    }
  };

  const navLinks: { label: string; page: PageRoute }[] = [
    { label: 'Shop Catalog', page: 'shop' },
    { label: 'Wholesale B2B', page: 'wholesale' },
    { label: 'Import & Export', page: 'import-services' },
    { label: 'Supplier Directory', page: 'suppliers' },
    { label: 'Order Tracking Info', page: 'track-order' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar 3-Zone Contract */}
        <div className="flex items-center justify-between gap-2 sm:gap-6 lg:gap-8 h-16 sm:h-20">
          {/* Zone 1: Brand Wordmark with client's supplied logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group whitespace-nowrap shrink-0 focus:outline-none min-w-0"
          >
            <img
              src="/assets/aistudio/Catify_Trade_Circular_Logo_df00bcb5.png"
              alt="Catify Trade International Logo"
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full shadow-xs border border-amber-400/40 group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors font-sans leading-tight">
                CATIFY <span className="text-[#C59B27]">TRADE</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                Global Import &amp; Export
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Clean single-line prose) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                    isActive
                      ? 'text-blue-950 font-semibold border-b-2 border-[#C59B27]'
                      : 'hover:text-blue-900 hover:border-b-2 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (RFQ CTA, Search, Wishlist, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Trigger (Desktop inline expand, Mobile toggles clean bar below) */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search HS code, product, category..."
                    className="w-48 lg:w-64 pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : null}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors ${
                  searchOpen ? 'sm:hidden bg-slate-100 text-blue-950' : ''
                }`}
                title="Search Catalog"
                aria-label="Toggle Search"
              >
                {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigateTo('customer-dashboard')}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
              title="Saved Trade Items"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              title="View Cart & Orders"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-slate-700" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 px-1.5 py-0.2 bg-blue-900 text-white text-[10px] font-bold rounded-full">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-900 tabular-nums">
                {cartSubtotalUSD > 0 ? formatPrice(cartSubtotalUSD) : '$0.00'}
              </span>
            </button>

            {/* Primary Action Button: Request Quote (RFQ) */}
            <button
              onClick={() => openRFQModal(null)}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Request Quote</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Expandable Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="sm:hidden pb-3 pt-1 flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search HS code, product, category..."
              className="flex-1 min-w-0 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900"
              autoFocus
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-950 text-white text-xs font-semibold rounded-lg shrink-0"
            >
              Search
            </button>
          </form>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 px-1 space-y-3 bg-white max-h-[calc(100dvh-5rem)] overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    navigateTo(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                    currentPage === link.page
                      ? 'bg-blue-50 text-blue-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  openRFQModal(null);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-lg text-center flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Submit RFQ</span>
              </button>
              <button
                onClick={() => {
                  navigateTo('customer-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center flex items-center justify-center gap-1.5"
              >
                <PackageCheck className="w-4 h-4" />
                <span>My Orders &amp; Saved</span>
              </button>
            </div>

            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  if (userRole === 'customer') {
                    setUserRole('admin');
                    navigateTo('admin-dashboard');
                  } else {
                    setUserRole('customer');
                    navigateTo('home');
                  }
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 text-xs font-semibold text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-center flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-blue-900" />
                <span>{userRole === 'customer' ? 'Open Admin Management Console' : 'Return to Public Storefront'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
