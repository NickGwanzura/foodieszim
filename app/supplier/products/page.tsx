'use client';

import { useState } from 'react';
import { Package, Plus, Search, Edit2, X, Save, CheckCircle, AlertCircle } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — SUPPLIER PRODUCTS (SUPPLIER PORTAL)
// Manage your product catalog and availability
// ═════════════════════════════════════════════════════════════════════════════

type Availability = 'in_stock' | 'low_stock' | 'out_of_stock';

interface SupplierProduct {
  id: string;
  productName: string;
  category: string;
  sku: string;
  unit: string;
  currentPrice: number;
  minOrderQty: number;
  leadTimeDays: number;
  availability: Availability;
  isActive: boolean;
  lastUpdated: string;
}

const initialProducts: SupplierProduct[] = [
  { id: 'sp1', productName: 'Cooking Oil (2L)', category: 'Food Ingredients', sku: 'MFD-OIL-2L', unit: 'bottle', currentPrice: 4.95, minOrderQty: 12, leadTimeDays: 2, availability: 'in_stock', isActive: true, lastUpdated: '2025-04-01' },
  { id: 'sp2', productName: 'Flour (25kg)', category: 'Food Ingredients', sku: 'MFD-FLR-25K', unit: 'bag', currentPrice: 17.80, minOrderQty: 5, leadTimeDays: 2, availability: 'in_stock', isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp3', productName: 'Sugar (50kg)', category: 'Food Ingredients', sku: 'MFD-SUG-50K', unit: 'bag', currentPrice: 42.00, minOrderQty: 3, leadTimeDays: 2, availability: 'low_stock', isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp4', productName: 'Beef Mince (10kg)', category: 'Meat & Poultry', sku: 'MFD-BEF-10K', unit: 'bag', currentPrice: 85.00, minOrderQty: 2, leadTimeDays: 1, availability: 'in_stock', isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp5', productName: 'Sunflower Oil (5L)', category: 'Food Ingredients', sku: 'MFD-SFO-5L', unit: 'bottle', currentPrice: 9.50, minOrderQty: 6, leadTimeDays: 2, availability: 'out_of_stock', isActive: false, lastUpdated: '2025-03-28' },
];

const availabilityConfig: Record<Availability, { label: string; color: string }> = {
  in_stock:     { label: 'In Stock',    color: 'bg-[#24a148]/10 text-[#24a148]' },
  low_stock:    { label: 'Low Stock',   color: 'bg-[#F5C518]/10 text-[#9e7c0b]' },
  out_of_stock: { label: 'Out of Stock', color: 'bg-[#da1e28]/10 text-[#da1e28]' },
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<SupplierProduct[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<SupplierProduct>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '', category: '', sku: '', unit: '', currentPrice: '', minOrderQty: '', leadTimeDays: '',
  });
  const [savedId, setSavedId] = useState<string | null>(null);

  const filtered = products.filter(p =>
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inStock: products.filter(p => p.availability === 'in_stock').length,
    lowStock: products.filter(p => p.availability === 'low_stock').length,
  };

  const startEdit = (product: SupplierProduct) => {
    setEditingId(product.id);
    setEditValues({
      currentPrice: product.currentPrice,
      minOrderQty: product.minOrderQty,
      leadTimeDays: product.leadTimeDays,
      availability: product.availability,
    });
  };

  const saveEdit = (id: string) => {
    setProducts(prev => prev.map(p =>
      p.id === id
        ? { ...p, ...editValues, lastUpdated: new Date().toISOString().split('T')[0] }
        : p
    ));
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
    setEditingId(null);
    setEditValues({});
  };

  const toggleActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleAddProduct = () => {
    if (!newProduct.productName || !newProduct.currentPrice) return;
    const product: SupplierProduct = {
      id: `sp${Date.now()}`,
      productName: newProduct.productName,
      category: newProduct.category || 'General',
      sku: newProduct.sku || `MFD-${Date.now().toString().slice(-4)}`,
      unit: newProduct.unit || 'unit',
      currentPrice: parseFloat(newProduct.currentPrice) || 0,
      minOrderQty: parseInt(newProduct.minOrderQty) || 1,
      leadTimeDays: parseInt(newProduct.leadTimeDays) || 2,
      availability: 'in_stock',
      isActive: true,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [...prev, product]);
    setShowAddModal(false);
    setNewProduct({ productName: '', category: '', sku: '', unit: '', currentPrice: '', minOrderQty: '', leadTimeDays: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">My Products</h1>
          <p className="text-[#6f6f6f]">Manage your product catalog and availability</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Products</div>
          <div className="text-2xl font-semibold text-[#161616]">{stats.total}</div>
        </div>
        <div className="bg-white border border-[#24a148] p-4">
          <div className="text-sm text-[#24a148]">Active</div>
          <div className="text-2xl font-semibold text-[#24a148]">{stats.active}</div>
        </div>
        <div className="bg-white border border-[#0f62fe] p-4">
          <div className="text-sm text-[#0f62fe]">In Stock</div>
          <div className="text-2xl font-semibold text-[#0f62fe]">{stats.inStock}</div>
        </div>
        <div className="bg-white border border-[#F5C518] p-4">
          <div className="text-sm text-[#9e7c0b]">Low Stock</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">{stats.lowStock}</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#e0e0e0] p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search products, categories, or SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">SKU</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Current Price</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Min Order</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Lead Time</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Availability</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Active</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filtered.map((product) => {
              const isEditing = editingId === product.id;
              return (
                <tr key={product.id} className="hover:bg-[#f4f4f4]">
                  <td className="p-3">
                    <div className="font-medium">{product.productName}</div>
                    <div className="text-xs text-[#6f6f6f]">{product.category} · {product.unit}</div>
                  </td>
                  <td className="p-3 font-mono text-sm text-[#6f6f6f]">{product.sku}</td>
                  <td className="p-3 text-right">
                    {isEditing ? (
                      <input
                        type="number" step="0.01" min={0}
                        value={editValues.currentPrice ?? product.currentPrice}
                        onChange={(e) => setEditValues(p => ({ ...p, currentPrice: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm text-right"
                      />
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        {savedId === product.id && <CheckCircle className="w-3 h-3 text-[#24a148]" />}
                        {formatCurrency(product.currentPrice)}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center text-sm">
                    {isEditing ? (
                      <input
                        type="number" min={1}
                        value={editValues.minOrderQty ?? product.minOrderQty}
                        onChange={(e) => setEditValues(p => ({ ...p, minOrderQty: parseInt(e.target.value) || 1 }))}
                        className="w-14 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm text-center"
                      />
                    ) : `${product.minOrderQty} ${product.unit}`}
                  </td>
                  <td className="p-3 text-center text-sm">
                    {isEditing ? (
                      <input
                        type="number" min={1}
                        value={editValues.leadTimeDays ?? product.leadTimeDays}
                        onChange={(e) => setEditValues(p => ({ ...p, leadTimeDays: parseInt(e.target.value) || 1 }))}
                        className="w-14 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm text-center"
                      />
                    ) : `${product.leadTimeDays}d`}
                  </td>
                  <td className="p-3 text-center">
                    {isEditing ? (
                      <select
                        value={editValues.availability ?? product.availability}
                        onChange={(e) => setEditValues(p => ({ ...p, availability: e.target.value as Availability }))}
                        className="px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-xs"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-1 ${availabilityConfig[product.availability].color}`}>
                        {availabilityConfig[product.availability].label}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleActive(product.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${product.isActive ? 'bg-[#24a148]' : 'bg-[#8d8d8d]'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${product.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => saveEdit(product.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-[#24a148] text-white hover:bg-[#1e8a3c]"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 text-xs border border-[#8d8d8d] hover:bg-[#f4f4f4]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(product)}
                        className="flex items-center gap-1 px-3 py-1 text-xs border border-[#F5C518] text-[#161616] hover:bg-[#F5C518]/10 mx-auto"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-lg font-medium">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[#f4f4f4]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#161616] mb-1">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct(p => ({ ...p, productName: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="e.g., Cooking Oil (2L)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="Food Ingredients"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">SKU</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct(p => ({ ...p, sku: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="MFD-XXX-XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Unit</label>
                <input
                  type="text"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct(p => ({ ...p, unit: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="bottle, bag, kg..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Price (USD) *</label>
                <input
                  type="number" step="0.01" min={0}
                  value={newProduct.currentPrice}
                  onChange={(e) => setNewProduct(p => ({ ...p, currentPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Min Order Qty</label>
                <input
                  type="number" min={1}
                  value={newProduct.minOrderQty}
                  onChange={(e) => setNewProduct(p => ({ ...p, minOrderQty: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Lead Time (days)</label>
                <input
                  type="number" min={1}
                  value={newProduct.leadTimeDays}
                  onChange={(e) => setNewProduct(p => ({ ...p, leadTimeDays: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newProduct.productName || !newProduct.currentPrice}
                className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518] disabled:bg-[#e0e0e0] disabled:text-[#a8a8a8]"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
