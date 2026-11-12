import React, { useState } from 'react';
import { useTrade } from '../../context/TradeContext';
import { Globe, Phone, Mail, ChevronDown, ShieldCheck, User, LayoutDashboard } from 'lucide-react';
import { CurrencyCode } from '../../types';

export const TopAnnouncementBar: React.FC = () => {
  const {
    settings,
    currencies,
    countries,
    activeCurrency,
    setActiveCurrency,
    activeCountryCode,
    setActiveCountryCode,
    userRole,
    setUserRole,
    isAdminAuthenticated,
    navigateTo,
  } = useTrade();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const selectedCountry = countries.find((c) => c.code === activeCountryCode) || countries[0];
  const selectedCurrency = currencies.find((c) => c.code === activeCurrency) || currencies[0];

  return (
    <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Global Announcement & WhatsApp */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Globe className="w-3.5 h-3.5" />
            <span>Global B2B &amp; Retail Import-Export Hub</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors text-slate-300"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trade Desk: {settings.phone}</span>
          </a>
          <span className="hidden sm:inline text-slate-600">·</span>
          <a
            href={`mailto:${settings.email}`}
            className="hidden lg:flex items-center gap-1 hover:text-white transition-colors text-slate-400"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings.email}</span>
          </a>
        </div>

        {/* Right: Country, Currency, and Admin / Customer Portal Mode */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 relative">
          {/* Country Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCountryOpen(!isCountryOpen);
                setIsCurrencyOpen(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Select Destination Country for Shipping & Duty"
            >
              <span className="text-sm">{selectedCountry?.flag}</span>
              <span className="font-medium max-w-[120px] truncate">{selectedCountry?.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCountryOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-1 w-56 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Ship-To Country
                </div>
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setActiveCountryCode(c.code);
                      setIsCountryOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-slate-800 ${
                      c.code === activeCountryCode ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                    <span className="text-slate-500 text-[10px]">{c.currencyCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCurrencyOpen(!isCurrencyOpen);
                setIsCountryOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Select Display Currency"
            >
              <span className="font-semibold text-amber-400">{selectedCurrency?.code}</span>
              <span className="text-slate-400">({selectedCurrency?.symbol})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Settlement Currency
                </div>
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setActiveCurrency(curr.code as CurrencyCode);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-slate-800 ${
                      curr.code === activeCurrency ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span className="font-medium">
                      {curr.code} ({curr.symbol})
                    </span>
                    <span className="text-slate-500 text-[10px]">{curr.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Authenticated Admin Quick Switcher (hidden from unauthenticated shoppers) */}
          {isAdminAuthenticated && (
            <div className="hidden sm:flex items-center pl-2 border-l border-slate-700">
              {userRole === 'customer' ? (
                <button
                  onClick={() => {
                    setUserRole('admin');
                    navigateTo('admin-dashboard');
                  }}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-0.5 rounded border border-amber-500/30 hover:border-amber-400 transition-colors"
                  title="Open Centralized Admin Management Console"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserRole('customer');
                    navigateTo('home');
                  }}
                  className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium px-2 py-0.5 rounded border border-sky-500/30 hover:border-sky-400 transition-colors"
                  title="Return to Public Storefront"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Storefront View</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
