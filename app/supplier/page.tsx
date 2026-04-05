'use client';

import Link from 'next/link';
import { ShoppingCart, DollarSign, Trophy, Package } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — SUPPLIER DASHBOARD
// External supplier portal
// ═════════════════════════════════════════════════════════════════════════════

interface Order {
  id: string;
  requestNumber: string;
  productName: string;
  quantity: number;
  total: number;
  status: 'pending' | 'approved' | 'fulfilled';
  requestedAt: string;
}

const mockSupplierData = {
  name: 'MegaFood Distributors',
  totalOrders: 52,
  totalRevenue: 32100,
  winRate: 0.71,
  activeProducts: 4,
  recentOrders: [
    { id: 'o1', requestNumber: 'PR-0045', productName: 'Cooking Oil (2L)', quantity: 20, total: 99.00, status: 'approved', requestedAt: '2025-04-02' },
    { id: 'o2', requestNumber: 'PR-0046', productName: 'Flour (25kg)', quantity: 10, total: 178.00, status: 'pending', requestedAt: '2025-04-02' },
    { id: 'o3', requestNumber: 'PR-0047', productName: 'Sugar (50kg)', quantity: 5, total: 210.00, status: 'pending', requestedAt: '2025-04-01' },
  ] as Order[],
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function SupplierDashboard() {
  const { name, totalOrders, totalRevenue, winRate, activeProducts, recentOrders } = mockSupplierData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#161616] text-white p-6">
        <h1 className="text-2xl font-light mb-2">{name}</h1>
        <p className="text-[#c6c6c6]">Supplier Portal - Foodies Zimbabwe</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Total Orders</p>
              <p className="text-2xl font-semibold text-[#161616]">{totalOrders}</p>
            </div>
            <div className="p-2 bg-[#0f62fe]/10 text-[#0f62fe]">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Total Revenue</p>
              <p className="text-2xl font-semibold text-[#161616]">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-2 bg-[#24a148]/10 text-[#24a148]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Win Rate</p>
              <p className="text-2xl font-semibold text-[#161616]">{(winRate * 100).toFixed(0)}%</p>
            </div>
            <div className="p-2 bg-[#F5C518]/10 text-[#F5C518]">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Active Products</p>
              <p className="text-2xl font-semibold text-[#161616]">{activeProducts}</p>
            </div>
            <div className="p-2 bg-[#8d8d8d]/10 text-[#525252]">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
            <h2 className="font-medium">Recent Orders</h2>
            <Link href="/supplier/orders" className="text-sm text-[#0f62fe] hover:underline">View All</Link>
          </div>
          <table className="w-full">
            <thead className="bg-[#f4f4f4]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#525252]">Request</th>
                <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Amount</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#f4f4f4]">
                  <td className="p-3 text-sm">{order.requestNumber}</td>
                  <td className="p-3 text-sm">{order.productName}</td>
                  <td className="p-3 text-right text-sm">{formatCurrency(order.total)}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 ${
                      order.status === 'approved' ? 'bg-[#24a148]/10 text-[#24a148]' :
                      order.status === 'pending' ? 'bg-[#F5C518]/10 text-[#9e7c0b]' :
                      'bg-[#e0e0e0] text-[#525252]'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#e0e0e0] p-5">
          <h2 className="font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/supplier/pricing" 
              className="block p-4 border border-[#e0e0e0] hover:border-[#F5C518] hover:bg-[#F5C518]/5 transition-all"
            >
              <div className="font-medium">Update Weekly Prices</div>
              <div className="text-sm text-[#6f6f6f]">Submit prices for Week 15 (Due: April 5)</div>
            </Link>
            <Link 
              href="/supplier/products" 
              className="block p-4 border border-[#e0e0e0] hover:border-[#F5C518] hover:bg-[#F5C518]/5 transition-all"
            >
              <div className="font-medium">Manage Products</div>
              <div className="text-sm text-[#6f6f6f]">Add or update product catalog</div>
            </Link>
            <Link 
              href="/supplier/orders" 
              className="block p-4 border border-[#e0e0e0] hover:border-[#F5C518] hover:bg-[#F5C518]/5 transition-all"
            >
              <div className="font-medium">View Order Queue</div>
              <div className="text-sm text-[#6f6f6f]">Manage pending orders</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
