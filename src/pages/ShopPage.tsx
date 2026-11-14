import React, { useState, useMemo } from 'react';
import { useTrade } from '../context/TradeContext';
import { ProductCard } from './HomePage';
import { Product } from '../types';
import {
  Filter,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Globe,
  Tag,
  Check,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories, searchQuery, setSearchQuery, formatPrice } = useTrade();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tradeMode, setTradeMode] = useState<'all' | 'wholesale' | 'retail'>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'moq-asc'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available unique origins
  const origins = useMemo<string[]>(() => {
    const list = Array.from(new Set(products.map((p: Product) => p.countryOfOrigin))).filter(Boolean) as string[];
    return ['all', ...list];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesHs = p.hsCode?.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSku && !matchesHs && !matchesCategory) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Trade Mode (single-unit 1+ pc orders are enabled across all catalog items)
      if (tradeMode === 'wholesale' && !p.isWholesaleOnly && p.moq <= 1) return false;

      // Origin
      if (selectedOrigin !== 'all' && p.countryOfOrigin !== selectedOrigin) return false;

      // Price
      const price = p.salePriceUSD ?? p.regularPriceUSD;
      if (price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.salePriceUSD ?? a.regularPriceUSD;
      const priceB = b.salePriceUSD ?? b.regularPriceUSD;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'moq-asc') return a.moq - b.moq;
      // Default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, tradeMode, selectedOrigin, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setTradeMode('all');
    setSelectedOrigin('all');
    setMaxPrice(1000);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>International Trade Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Global Sourcing &amp; Products</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Explore sample catalogue listings. Product availability, final pricing and supplier details are confirmed after a quotation request.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filters'}</span>
          </button>
        </div>
      </div>

      {/* Main Content: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop / Collapsible Filter Sidebar */}
        <aside className={`lg:block space-y-6 ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-950" />
                <span>Filters</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Trade Mode Segmented Control */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Trade Mode</label>
              <div className="flex flex-col gap-1 text-xs">
                <button
                  onClick={() => setTradeMode('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    tradeMode === 'all' ? 'bg-blue-950 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>All Modes</span>
                </button>
                <button
                  onClick={() => setTradeMode('wholesale')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    tradeMode === 'wholesale' ? 'bg-blue-950 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Wholesale MOQ Only</span>
                </button>
                <button
                  onClick={() => setTradeMode('retail')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    tradeMode === 'retail' ? 'bg-blue-950 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Single Unit (1+ Pc)</span>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Trade Categories</label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === 'all' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] text-slate-400">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat.name ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-1">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Country of Origin */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Country of Origin</label>
              <div className="space-y-1 text-xs">
                {origins.map((origin) => (
                  <button
                    key={origin}
                    onClick={() => setSelectedOrigin(origin)}
                    className={`w-full text-left px-2.5 py-1 rounded-lg transition-colors flex items-center justify-between ${
                      selectedOrigin === origin ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{origin === 'all' ? 'All Origins' : origin}</span>
                    {selectedOrigin === origin && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Max Unit Price</span>
                <span className="text-blue-950 tabular-nums">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-950"
              />
            </div>
          </div>
        </aside>

        {/* Products Grid & Controls */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Bar Sort & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div className="text-xs text-slate-600">
              Showing <strong className="text-slate-900 font-semibold">{filteredProducts.length}</strong> commercial listings
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 font-medium text-slate-800"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="moq-asc">MOQ: Lowest First</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No Matching Listings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filter parameters or search term. You can also submit an RFQ for any custom sourcing requirement.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
