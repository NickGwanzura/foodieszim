'use client';

import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, AlertCircle, Star, FileText } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — SUPPLIER MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

interface Supplier {
  id: string;
  name: string;
  tin: string;
  status: 'active' | 'pending_kyc' | 'suspended';
  categories: string[];
  rating: number;
  totalOrders: number;
  totalSpend: number;
  kycStatus: 'verified' | 'pending' | 'expired';
}

const mockSuppliers: Supplier[] = [
  { id: 'sup1', name: 'ZimKitchen Supplies Ltd', tin: '2000123456', status: 'active', categories: ['Food Ingredients', 'Equipment'], rating: 4.5, totalOrders: 45, totalSpend: 28450, kycStatus: 'verified' },
  { id: 'sup2', name: 'MegaFood Distributors', tin: '2000789012', status: 'active', categories: ['Food Ingredients', 'Beverages'], rating: 4.8, totalOrders: 52, totalSpend: 32100, kycStatus: 'verified' },
  { id: 'sup3', name: 'ProClean Zimbabwe', tin: '2000345678', status: 'active', categories: ['Cleaning Supplies'], rating: 4.2, totalOrders: 38, totalSpend: 12500, kycStatus: 'verified' },
  { id: 'sup4', name: 'Zimbabwe Gas Supplies', tin: '2000567890', status: 'active', categories: ['Utilities'], rating: 4.0, totalOrders: 18, totalSpend: 17100, kycStatus: 'verified' },
  { id: 'sup5', name: 'Premium Meats', tin: '2000987654', status: 'active', categories: ['Meat & Poultry'], rating: 3.8, totalOrders: 22, totalSpend: 18700, kycStatus: 'pending' },
  { id: 'sup6', name: 'Harare Packaging Co', tin: '2000432167', status: 'pending_kyc', categories: ['Packaging'], rating: 0, totalOrders: 0, totalSpend: 0, kycStatus: 'pending' },
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || supplier.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockSuppliers.length,
    active: mockSuppliers.filter(s => s.status === 'active').length,
    pendingKyc: mockSuppliers.filter(s => s.status === 'pending_kyc').length,
    totalSpend: mockSuppliers.reduce((sum, s) => sum + s.totalSpend, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Supplier Management</h1>
          <p className="text-[#6f6f6f]">Manage suppliers and KYC verification</p>
        </div>
        <button className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]">
          + Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Suppliers</div>
          <div className="text-2xl font-semibold text-[#161616]">{stats.total}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Active</div>
          <div className="text-2xl font-semibold text-[#24a148]">{stats.active}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Pending KYC</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">{stats.pendingKyc}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Spend</div>
          <div className="text-2xl font-semibold text-[#161616]">${(stats.totalSpend / 1000).toFixed(1)}k</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending_kyc">Pending KYC</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Supplier</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Categories</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">KYC</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Rating</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Orders</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Spend</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3">
                  <div className="font-medium">{supplier.name}</div>
                  <div className="text-xs text-[#6f6f6f]">TIN: {supplier.tin}</div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {supplier.categories.map(cat => (
                      <span key={cat} className="text-xs px-2 py-1 bg-[#f4f4f4]">{cat}</span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center">
                  {supplier.kycStatus === 'verified' ? (
                    <CheckCircle className="w-5 h-5 text-[#24a148] mx-auto" />
                  ) : supplier.kycStatus === 'pending' ? (
                    <AlertCircle className="w-5 h-5 text-[#F5C518] mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#da1e28] mx-auto" />
                  )}
                </td>
                <td className="p-3 text-center">
                  {supplier.rating > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-[#F5C518] fill-current" />
                      <span>{supplier.rating}</span>
                    </div>
                  ) : (
                    <span className="text-[#6f6f6f]">-</span>
                  )}
                </td>
                <td className="p-3 text-right">{supplier.totalOrders}</td>
                <td className="p-3 text-right">${supplier.totalSpend.toLocaleString()}</td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${
                    supplier.status === 'active' ? 'bg-[#24a148]/10 text-[#24a148]' :
                    supplier.status === 'pending_kyc' ? 'bg-[#F5C518]/10 text-[#9e7c0b]' :
                    'bg-[#da1e28]/10 text-[#da1e28]'
                  }`}>
                    {supplier.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button className="text-sm text-[#0f62fe] hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
