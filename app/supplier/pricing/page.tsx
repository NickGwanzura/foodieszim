'use client';

import { useState } from 'react';
import { Upload, Download, AlertCircle, Save, X } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — SUPPLIER PRICING MANAGEMENT
// Weekly price updates portal
// ═════════════════════════════════════════════════════════════════════════════

interface SupplierProduct {
  id: string;
  productName: string;
  category: string;
  unit: string;
  currentPrice: number;
  lastUpdated: string;
}

const mockProducts: SupplierProduct[] = [
  { id: 'sp1', productName: 'Cooking Oil (2L)', category: 'Food Ingredients', unit: 'bottle', currentPrice: 4.95, lastUpdated: '2025-04-01' },
  { id: 'sp2', productName: 'Flour (25kg)', category: 'Food Ingredients', unit: 'bag', currentPrice: 17.80, lastUpdated: '2025-04-02' },
  { id: 'sp3', productName: 'Sugar (50kg)', category: 'Food Ingredients', unit: 'bag', currentPrice: 42.00, lastUpdated: '2025-04-02' },
  { id: 'sp4', productName: 'Beef Mince (10kg)', category: 'Meat & Poultry', unit: 'bag', currentPrice: 85.00, lastUpdated: '2025-04-02' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function SupplierPricingPage() {
  const [editing, setEditing] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [products, setProducts] = useState(mockProducts);

  const handleSave = (productId: string) => {
    const price = parseFloat(newPrice);
    if (!isNaN(price) && price > 0) {
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, currentPrice: price, lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      ));
    }
    setEditing(null);
    setNewPrice('');
  };

  const startEditing = (product: SupplierProduct) => {
    setEditing(product.id);
    setNewPrice(product.currentPrice.toString());
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Weekly Pricing</h1>
          <p className="text-[#6f6f6f]">Manage your product prices for the current week</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-[#8d8d8d] text-sm hover:bg-[#f4f4f4]">
            <Download className="w-4 h-4" />
            Download Template
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-[#8d8d8d] text-sm hover:bg-[#f4f4f4]">
            <Upload className="w-4 h-4" />
            Bulk Upload CSV
          </button>
        </div>
      </div>

      {/* Deadline Alert */}
      <div className="bg-[#F5C518]/10 border border-[#F5C518] p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#9e7c0b]" />
          <div>
            <div className="font-medium text-[#9e7c0b]">Week 15 Pricing Deadline</div>
            <p className="text-sm text-[#9e7c0b]">
              Submit your prices by Friday, April 11th at 5:00 PM. Prices take effect on Monday.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Category</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Unit</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Current Price</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Last Updated</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3 font-medium">{product.productName}</td>
                <td className="p-3 text-sm">{product.category}</td>
                <td className="p-3 text-sm">{product.unit}</td>
                <td className="p-3 text-right">
                  {editing === product.id ? (
                    <input 
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-24 px-2 py-1 border border-[#8d8d8d] text-sm focus:border-[#F5C518] focus:outline-none"
                      placeholder={product.currentPrice.toString()}
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium">{formatCurrency(product.currentPrice)}</span>
                  )}
                </td>
                <td className="p-3 text-center text-sm text-[#6f6f6f]">{product.lastUpdated}</td>
                <td className="p-3">
                  {editing === product.id ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSave(product.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-[#24a148] text-white hover:bg-[#1e8a3c]"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button 
                        onClick={() => setEditing(null)}
                        className="flex items-center gap-1 px-2 py-1 text-xs border border-[#8d8d8d] hover:bg-[#f4f4f4]"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => startEditing(product)}
                      className="px-3 py-1 text-xs border border-[#F5C518] text-[#161616] hover:bg-[#F5C518]/10"
                    >
                      Update Price
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Price History Note */}
      <div className="bg-[#f4f4f4] p-4">
        <h3 className="font-medium mb-2">Pricing Guidelines</h3>
        <ul className="text-sm text-[#6f6f6f] space-y-1 list-disc list-inside">
          <li>Prices must be updated weekly by Friday 5:00 PM</li>
          <li>New prices take effect on the following Monday</li>
          <li>Bulk pricing discounts are automatically applied for qualifying quantities</li>
          <li>Contact procurement@foodies.co.zw for pricing disputes</li>
        </ul>
      </div>
    </div>
  );
}
