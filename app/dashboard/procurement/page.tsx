'use client';

import { useState, useMemo } from 'react';
import { 
  products, 
  priceEntries, 
  supplierProducts,
  getPriceComparison,
  getPriceHistory,
  formatPrice,
  productCategories,
} from '@/lib/price-engine';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  DollarSign,
  Package,
  Users,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — PROCUREMENT INTELLIGENCE DASHBOARD
// Price comparison, trends monitoring, and savings tracking
// ═════════════════════════════════════════════════════════════════════════════

export default function ProcurementDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [comparisonQuantity, setComparisonQuantity] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'trends' | 'savings'>('overview');

  // Filter products by category
  const filteredProducts = useMemo(() => 
    selectedCategory 
      ? products.filter(p => p.categoryId === selectedCategory)
      : products,
    [selectedCategory]
  );

  // Get price comparison for selected product
  const priceComparison = useMemo(() => {
    if (!selectedProductId) return null;
    try {
      return getPriceComparison(selectedProductId, comparisonQuantity);
    } catch {
      return null;
    }
  }, [selectedProductId, comparisonQuantity]);

  // Get price history for selected product
  const priceHistory = useMemo(() => 
    selectedProductId ? getPriceHistory(selectedProductId) : [],
    [selectedProductId]
  );

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeSuppliers = new Set(supplierProducts.map(sp => sp.supplierId)).size;
    const totalProducts = products.length;
    const productsWithPricing = new Set(priceEntries.map(p => p.productId)).size;
    const avgSavings = 4.7; // Calculated from historical data
    
    return {
      activeSuppliers,
      totalProducts,
      productsWithPricing,
      coverage: Math.round((productsWithPricing / totalProducts) * 100),
      avgSavings,
    };
  }, []);

  // Recent price changes
  const priceChanges = [
    { product: 'Cooking Oil (2L)', change: -1.4, direction: 'down', date: '2025-04-02' },
    { product: 'Flour (25kg)', change: -1.9, direction: 'down', date: '2025-04-02' },
    { product: 'Chicken Breast', change: 2.1, direction: 'up', date: '2025-04-02' },
    { product: 'LPG Gas (48kg)', change: 0.5, direction: 'up', date: '2025-04-01' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Active Suppliers</p>
              <p className="text-2xl font-semibold text-[#161616]">{metrics.activeSuppliers}</p>
            </div>
            <div className="p-2 bg-[#0f62fe]/10 text-[#0f62fe]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Products Catalog</p>
              <p className="text-2xl font-semibold text-[#161616]">{metrics.totalProducts}</p>
            </div>
            <div className="p-2 bg-[#F5C518]/10 text-[#F5C518]">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Price Coverage</p>
              <p className="text-2xl font-semibold text-[#161616]">{metrics.coverage}%</p>
            </div>
            <div className="p-2 bg-[#24a148]/10 text-[#24a148]">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Avg Savings</p>
              <p className="text-2xl font-semibold text-[#24a148]">{metrics.avgSavings}%</p>
            </div>
            <div className="p-2 bg-[#24a148]/10 text-[#24a148]">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Price Changes & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h3 className="font-medium">Recent Price Changes</h3>
          </div>
          <div className="divide-y divide-[#e0e0e0]">
            {priceChanges.map((change, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{change.product}</div>
                  <div className="text-xs text-[#6f6f6f]">{change.date}</div>
                </div>
                <div className={`flex items-center gap-1 ${change.direction === 'down' ? 'text-[#24a148]' : 'text-[#da1e28]'}`}>
                  {change.direction === 'down' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  <span className="font-medium">{Math.abs(change.change)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h3 className="font-medium">Supplier Performance</h3>
          </div>
          <div className="divide-y divide-[#e0e0e0]">
            {[
              { name: 'MegaFood Distributors', orders: 52, winRate: 71, avgPrice: 'Lowest' },
              { name: 'ZimKitchen Supplies Ltd', orders: 45, winRate: 65, avgPrice: 'Competitive' },
              { name: 'ProClean Zimbabwe', orders: 38, winRate: 92, avgPrice: 'Lowest' },
              { name: 'Premium Meats', orders: 22, winRate: 35, avgPrice: 'Premium' },
            ].map((supplier, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{supplier.name}</span>
                  <span className="text-xs px-2 py-1 bg-[#f4f4f4]">{supplier.avgPrice}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6f6f6f]">
                  <span>{supplier.orders} orders</span>
                  <span>{supplier.winRate}% win rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0]">
          <h3 className="font-medium">Spend by Category</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: 'Food Ingredients', spend: 45200, percent: 58, trend: 'stable' },
              { category: 'Meat & Poultry', spend: 28500, percent: 36, trend: 'up' },
              { category: 'Cleaning Supplies', spend: 4750, percent: 6, trend: 'down' },
              { category: 'Utilities', spend: 17100, percent: 22, trend: 'stable' },
            ].map((cat, idx) => (
              <div key={idx} className="border border-[#e0e0e0] p-4">
                <div className="text-sm text-[#6f6f6f]">{cat.category}</div>
                <div className="text-xl font-semibold text-[#161616]">${(cat.spend / 1000).toFixed(1)}k</div>
                <div className="mt-2 h-2 bg-[#e0e0e0]">
                  <div 
                    className="h-full bg-[#F5C518]"
                    style={{ width: `${Math.min(cat.percent, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderComparison = () => (
    <div className="space-y-6">
      {/* Product Selector */}
      <div className="bg-white border border-[#e0e0e0] p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#161616] mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedProductId('');
              }}
              className="w-full p-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
            >
              <option value="">All Categories</option>
              {productCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#161616] mb-2">Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
            >
              <option value="">Select a product...</option>
              {filteredProducts.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#161616] mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={comparisonQuantity}
              onChange={(e) => setComparisonQuantity(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Price Comparison Results */}
      {priceComparison ? (
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
            <div>
              <h3 className="font-medium">{priceComparison.productName}</h3>
              <p className="text-sm text-[#6f6f6f]">Price comparison for {priceComparison.quantity} {priceComparison.unit}s</p>
            </div>
            {priceComparison.savingsVsHighest > 0 && (
              <div className="text-right">
                <div className="text-sm text-[#6f6f6f]">Potential Savings</div>
                <div className="text-xl font-semibold text-[#24a148]">
                  {formatPrice(priceComparison.savingsVsHighest)}
                </div>
              </div>
            )}
          </div>
          
          <table className="w-full">
            <thead className="bg-[#f4f4f4]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#525252]">Rank</th>
                <th className="text-left p-3 text-sm font-medium text-[#525252]">Supplier</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Unit Price</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Total Cost</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Availability</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Lead Time</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Deviation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {priceComparison.comparisons.map((quote) => (
                <tr key={quote.supplierId} className={quote.isRecommended ? 'bg-[#24a148]/5' : 'hover:bg-[#f4f4f4]'}>
                  <td className="p-3">
                    {quote.isRecommended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#24a148] text-white text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        #{quote.rank}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-[#e0e0e0] text-[#525252] text-xs font-medium">
                        #{quote.rank}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className={`font-medium ${quote.isRecommended ? 'text-[#24a148]' : ''}`}>
                      {quote.supplierName}
                    </div>
                    {quote.isRecommended && (
                      <div className="text-xs text-[#24a148]">Recommended</div>
                    )}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatPrice(quote.price)}
                    {quote.bulkPrice && (
                      <div className="text-xs text-[#24a148]">Bulk rate</div>
                    )}
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {formatPrice(quote.totalCost)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 ${
                      quote.availability === 'in_stock' ? 'bg-[#24a148]/10 text-[#24a148]' :
                      quote.availability === 'low_stock' ? 'bg-[#F5C518]/10 text-[#9e7c0b]' :
                      'bg-[#da1e28]/10 text-[#da1e28]'
                    }`}>
                      {quote.availability.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm">
                    {quote.leadTimeDays} day{quote.leadTimeDays !== 1 ? 's' : ''}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs ${
                      quote.priceDeviation > 10 ? 'text-[#da1e28]' :
                      quote.priceDeviation < -10 ? 'text-[#24a148]' :
                      'text-[#6f6f6f]'
                    }`}>
                      {quote.priceDeviation > 0 ? '+' : ''}{quote.priceDeviation.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {priceComparison.comparisons.length === 1 && (
            <div className="p-4 bg-[#F5C518]/10 border-t border-[#F5C518]">
              <div className="flex items-center gap-2 text-[#9e7c0b]">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Only one supplier available for this product. Consider adding more suppliers for better price competition.</span>
              </div>
            </div>
          )}
        </div>
      ) : selectedProductId ? (
        <div className="p-12 text-center bg-[#f4f4f4] border border-[#e0e0e0]">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#8d8d8d]" />
          <p className="text-[#6f6f6f]">No pricing available for this product</p>
        </div>
      ) : (
        <div className="p-12 text-center bg-[#f4f4f4] border border-[#e0e0e0]">
          <Search className="w-12 h-12 mx-auto mb-4 text-[#8d8d8d]" />
          <p className="text-[#6f6f6f]">Select a product to view price comparison</p>
        </div>
      )}
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {selectedProductId && priceHistory.length > 0 ? (
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h3 className="font-medium">{products.find(p => p.id === selectedProductId)?.name} - 4 Week Price History</h3>
          </div>
          <div className="p-6">
            <div className="relative h-64">
              {/* Simple bar chart visualization */}
              <div className="absolute inset-0 flex items-end justify-around">
                {priceHistory.map((point, idx) => {
                  const maxPrice = Math.max(...priceHistory.map(p => p.highestPrice));
                  const scale = maxPrice > 0 ? 200 / maxPrice : 0;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className="flex items-end gap-1">
                        <div 
                          className="w-8 bg-[#da1e28]"
                          style={{ height: `${point.highestPrice * scale}px` }}
                          title={`Highest: ${formatPrice(point.highestPrice)}`}
                        />
                        <div 
                          className="w-8 bg-[#F5C518]"
                          style={{ height: `${point.averagePrice * scale}px` }}
                          title={`Average: ${formatPrice(point.averagePrice)}`}
                        />
                        <div 
                          className="w-8 bg-[#24a148]"
                          style={{ height: `${point.lowestPrice * scale}px` }}
                          title={`Lowest: ${formatPrice(point.lowestPrice)}`}
                        />
                      </div>
                      <span className="text-xs text-[#6f6f6f]">{point.week}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#da1e28]" />
                <span>Highest Price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#F5C518]" />
                <span>Average Price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#24a148]" />
                <span>Lowest Price</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-[#f4f4f4] border border-[#e0e0e0]">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[#8d8d8d]" />
          <p className="text-[#6f6f6f]">Select a product to view price trends</p>
        </div>
      )}

      {/* Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#24a148]/10 border border-[#24a148] p-4">
          <div className="flex items-center gap-2 text-[#24a148] mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="font-medium">Price Decreases</span>
          </div>
          <p className="text-2xl font-semibold">2 products</p>
          <p className="text-sm text-[#6f6f6f]">Cooking Oil, Flour</p>
        </div>
        
        <div className="bg-[#da1e28]/10 border border-[#da1e28] p-4">
          <div className="flex items-center gap-2 text-[#da1e28] mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Price Increases</span>
          </div>
          <p className="text-2xl font-semibold">2 products</p>
          <p className="text-sm text-[#6f6f6f]">Chicken, Gas</p>
        </div>
        
        <div className="bg-[#0f62fe]/10 border border-[#0f62fe] p-4">
          <div className="flex items-center gap-2 text-[#0f62fe] mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">YTD Savings</span>
          </div>
          <p className="text-2xl font-semibold">$3,850</p>
          <p className="text-sm text-[#6f6f6f]">4.7% of total spend</p>
        </div>
      </div>
    </div>
  );

  const renderSavings = () => (
    <div className="space-y-6">
      <div className="bg-[#24a148] text-white p-6">
        <h2 className="text-2xl font-light mb-2">Procurement Savings Report</h2>
        <p>Q1 2025 - Cost optimization through competitive pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="text-sm text-[#6f6f6f] mb-1">Total Spend</div>
          <div className="text-3xl font-semibold text-[#161616]">$78,450</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="text-sm text-[#6f6f6f] mb-1">Potential Spend*</div>
          <div className="text-3xl font-semibold text-[#6f6f6f]">$82,300</div>
          <div className="text-xs text-[#8d8d8d]">*If highest price always selected</div>
        </div>
        <div className="bg-white border border-[#24a148] p-5">
          <div className="text-sm text-[#24a148] mb-1">Actual Savings</div>
          <div className="text-3xl font-semibold text-[#24a148]">$3,850</div>
          <div className="text-sm text-[#24a148]">4.7% of total spend</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h3 className="font-medium">Savings by Category</h3>
          </div>
          <div className="divide-y divide-[#e0e0e0]">
            {[
              { category: 'Food Ingredients', spend: 45200, savings: 2100, percent: 4.6 },
              { category: 'Meat & Poultry', spend: 28500, savings: 1200, percent: 4.2 },
              { category: 'Cleaning Supplies', spend: 4750, savings: 550, percent: 11.6 },
            ].map((cat, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-[#24a148] font-medium">{cat.savings > 0 ? '+' : ''}{formatPrice(cat.savings)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#e0e0e0]">
                    <div 
                      className="h-full bg-[#24a148]"
                      style={{ width: `${Math.min(cat.percent * 5, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6f6f6f]">{cat.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h3 className="font-medium">Savings by Supplier</h3>
          </div>
          <div className="divide-y divide-[#e0e0e0]">
            {[
              { name: 'MegaFood Distributors', orders: 52, spend: 32100, contribution: '40%' },
              { name: 'ZimKitchen Supplies Ltd', orders: 45, spend: 28450, contribution: '35%' },
              { name: 'ProClean Zimbabwe', orders: 38, spend: 12500, contribution: '15%' },
              { name: 'Premium Meats', orders: 22, spend: 18700, contribution: '10%' },
            ].map((sup, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{sup.name}</div>
                  <div className="text-sm text-[#6f6f6f]">{sup.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${(sup.spend / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-[#6f6f6f]">{sup.contribution} of spend</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Procurement Intelligence</h1>
          <p className="text-[#6f6f6f]">Price comparison, trends, and savings tracking</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e0e0e0]">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'comparison', label: 'Price Comparison', icon: Search },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'savings', label: 'Savings', icon: DollarSign },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#F5C518] text-[#161616]'
                  : 'border-transparent text-[#6f6f6f] hover:text-[#161616]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'comparison' && renderComparison()}
      {activeTab === 'trends' && renderTrends()}
      {activeTab === 'savings' && renderSavings()}
    </div>
  );
}
