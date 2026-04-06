'use client';

import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, AlertTriangle, AlertCircle } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — PRICE CHANGES (SHOP MANAGER VIEW)
// View recent product price changes affecting branch procurement
// ═════════════════════════════════════════════════════════════════════════════

interface PriceChange {
  id: string;
  productName: string;
  category: string;
  supplierName: string;
  previousPrice: number;
  newPrice: number;
  changePercent: number;
  effectiveDate: string;
  impact: 'high' | 'medium' | 'low';
}

const mockPriceChanges: PriceChange[] = [
  { id: 'pc1', productName: 'Cooking Oil (2L)', category: 'Food Ingredients', supplierName: 'MegaFood Distributors', previousPrice: 4.50, newPrice: 4.95, changePercent: 10.0, effectiveDate: '2025-04-07', impact: 'high' },
  { id: 'pc2', productName: 'Flour (25kg)', category: 'Food Ingredients', supplierName: 'MegaFood Distributors', previousPrice: 16.50, newPrice: 17.80, changePercent: 7.9, effectiveDate: '2025-04-07', impact: 'high' },
  { id: 'pc3', productName: 'Sugar (50kg)', category: 'Food Ingredients', supplierName: 'ZimKitchen Supplies Ltd', previousPrice: 40.00, newPrice: 42.00, changePercent: 5.0, effectiveDate: '2025-04-07', impact: 'medium' },
  { id: 'pc4', productName: 'Cleaning Detergent (5L)', category: 'Cleaning', supplierName: 'ProClean Zimbabwe', previousPrice: 8.20, newPrice: 7.90, changePercent: -3.7, effectiveDate: '2025-04-07', impact: 'low' },
  { id: 'pc5', productName: 'LPG Gas (48kg)', category: 'Utilities', supplierName: 'Zimbabwe Gas Supplies', previousPrice: 185.00, newPrice: 195.00, changePercent: 5.4, effectiveDate: '2025-04-01', impact: 'medium' },
  { id: 'pc6', productName: 'Chicken Breast (10kg)', category: 'Meat & Poultry', supplierName: 'Premium Meats', previousPrice: 68.00, newPrice: 72.00, changePercent: 5.9, effectiveDate: '2025-04-01', impact: 'high' },
  { id: 'pc7', productName: 'Tomato Sauce (500ml)', category: 'Food Ingredients', supplierName: 'ZimKitchen Supplies Ltd', previousPrice: 2.10, newPrice: 1.95, changePercent: -7.1, effectiveDate: '2025-03-31', impact: 'low' },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function PriceChangesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterImpact, setFilterImpact] = useState('');

  const filtered = mockPriceChanges.filter(pc => {
    const matchesSearch =
      pc.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pc.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImpact = !filterImpact || pc.impact === filterImpact;
    return matchesSearch && matchesImpact;
  });

  const increases = mockPriceChanges.filter(pc => pc.changePercent > 0).length;
  const decreases = mockPriceChanges.filter(pc => pc.changePercent < 0).length;
  const highImpact = mockPriceChanges.filter(pc => pc.impact === 'high').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Price Changes</h1>
        <p className="text-[#6f6f6f]">Recent supplier price updates affecting your branch procurement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Changes</div>
          <div className="text-2xl font-semibold text-[#161616]">{mockPriceChanges.length}</div>
          <div className="text-xs text-[#6f6f6f] mt-1">This week</div>
        </div>
        <div className="bg-white border border-[#da1e28] p-4">
          <div className="text-sm text-[#da1e28]">Price Increases</div>
          <div className="text-2xl font-semibold text-[#da1e28]">{increases}</div>
          <div className="text-xs text-[#da1e28] mt-1">Products up</div>
        </div>
        <div className="bg-white border border-[#24a148] p-4">
          <div className="text-sm text-[#24a148]">Price Decreases</div>
          <div className="text-2xl font-semibold text-[#24a148]">{decreases}</div>
          <div className="text-xs text-[#24a148] mt-1">Products down</div>
        </div>
        <div className="bg-white border border-[#F5C518] p-4">
          <div className="text-sm text-[#9e7c0b]">High Impact</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">{highImpact}</div>
          <div className="text-xs text-[#9e7c0b] mt-1">Need attention</div>
        </div>
      </div>

      {/* Alert Banner */}
      {highImpact > 0 && (
        <div className="bg-[#F5C518]/10 border border-[#F5C518] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#9e7c0b] shrink-0" />
            <div>
              <div className="font-medium text-[#9e7c0b]">Price Alert</div>
              <p className="text-sm text-[#9e7c0b]">
                {highImpact} high-impact price change(s) effective this week. Budget your requests accordingly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search products or suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
        <select
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Impact Levels</option>
          <option value="high">High Impact</option>
          <option value="medium">Medium Impact</option>
          <option value="low">Low Impact</option>
        </select>
      </div>

      {/* Price Changes Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Supplier</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Previous</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">New Price</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Change</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Impact</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Effective</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filtered.map((pc) => {
              const isIncrease = pc.changePercent > 0;
              return (
                <tr key={pc.id} className="hover:bg-[#f4f4f4]">
                  <td className="p-3">
                    <div className="font-medium">{pc.productName}</div>
                    <div className="text-xs text-[#6f6f6f]">{pc.category}</div>
                  </td>
                  <td className="p-3 text-sm">{pc.supplierName}</td>
                  <td className="p-3 text-right text-sm text-[#6f6f6f]">
                    {formatCurrency(pc.previousPrice)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(pc.newPrice)}
                  </td>
                  <td className="p-3 text-right">
                    <div className={`flex items-center justify-end gap-1 font-medium ${
                      isIncrease ? 'text-[#da1e28]' : 'text-[#24a148]'
                    }`}>
                      {isIncrease
                        ? <TrendingUp className="w-4 h-4" />
                        : <TrendingDown className="w-4 h-4" />
                      }
                      {isIncrease ? '+' : ''}{pc.changePercent.toFixed(1)}%
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 ${
                      pc.impact === 'high' ? 'bg-[#da1e28]/10 text-[#da1e28]' :
                      pc.impact === 'medium' ? 'bg-[#F5C518]/10 text-[#9e7c0b]' :
                      'bg-[#24a148]/10 text-[#24a148]'
                    }`}>
                      {pc.impact.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm text-[#6f6f6f]">{pc.effectiveDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Note */}
      <div className="bg-[#f4f4f4] p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#0f62fe] shrink-0" />
          <div>
            <div className="font-medium text-sm">How Price Changes Affect Requests</div>
            <p className="text-sm text-[#6f6f6f] mt-1">
              New prices take effect from the stated date. Any purchase requests submitted after the effective date will use the new price for budget calculations. Contact the accountant if a price change affects an existing request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
