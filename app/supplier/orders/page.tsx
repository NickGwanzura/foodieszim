'use client';

import { useState } from 'react';
import { Search, ShoppingCart, CheckCircle, Clock, Truck, X } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — SUPPLIER ORDERS (SUPPLIER PORTAL)
// View and manage incoming purchase orders from Foodies Zimbabwe
// ═════════════════════════════════════════════════════════════════════════════

type OrderStatus = 'pending' | 'accepted' | 'in_preparation' | 'dispatched' | 'delivered' | 'cancelled';

interface OrderItem {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

interface Order {
  id: string;
  requestNumber: string;
  branchName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  requiredByDate: string;
  createdAt: string;
  notes?: string;
}

const mockOrders: Order[] = [
  {
    id: 'o1',
    requestNumber: 'PR-0046',
    branchName: 'Avondale Shop',
    items: [{ productName: 'Flour (25kg)', quantity: 10, unit: 'bag', unitPrice: 17.80 }],
    totalAmount: 178.00,
    status: 'pending',
    requiredByDate: '2025-04-05',
    createdAt: '2025-04-02T09:00:00Z',
  },
  {
    id: 'o2',
    requestNumber: 'PR-0047',
    branchName: 'Eastgate Shop',
    items: [{ productName: 'Sugar (50kg)', quantity: 5, unit: 'bag', unitPrice: 42.00 }],
    totalAmount: 210.00,
    status: 'pending',
    requiredByDate: '2025-04-05',
    createdAt: '2025-04-01T14:00:00Z',
  },
  {
    id: 'o3',
    requestNumber: 'PR-0045',
    branchName: 'Avondale Shop',
    items: [{ productName: 'Cooking Oil (2L)', quantity: 20, unit: 'bottle', unitPrice: 4.95 }],
    totalAmount: 99.00,
    status: 'dispatched',
    requiredByDate: '2025-04-03',
    createdAt: '2025-04-01T10:00:00Z',
    notes: 'Dispatched via Harare Couriers — Tracking: HC0045',
  },
  {
    id: 'o4',
    requestNumber: 'PR-0044',
    branchName: 'Borrowdale Shop',
    items: [
      { productName: 'Flour (25kg)', quantity: 8, unit: 'bag', unitPrice: 17.80 },
      { productName: 'Sugar (50kg)', quantity: 3, unit: 'bag', unitPrice: 42.00 },
    ],
    totalAmount: 268.40,
    status: 'delivered',
    requiredByDate: '2025-04-02',
    createdAt: '2025-03-31T11:00:00Z',
  },
  {
    id: 'o5',
    requestNumber: 'PR-0043',
    branchName: 'Sam Levy Shop',
    items: [{ productName: 'Beef Mince (10kg)', quantity: 4, unit: 'bag', unitPrice: 85.00 }],
    totalAmount: 340.00,
    status: 'delivered',
    requiredByDate: '2025-04-01',
    createdAt: '2025-03-30T09:00:00Z',
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:        { label: 'Pending',        color: 'bg-[#F5C518]/10 text-[#9e7c0b]',  icon: <Clock className="w-4 h-4" /> },
  accepted:       { label: 'Accepted',       color: 'bg-[#0f62fe]/10 text-[#0f62fe]',  icon: <CheckCircle className="w-4 h-4" /> },
  in_preparation: { label: 'In Preparation', color: 'bg-[#6929c4]/10 text-[#6929c4]',  icon: <ShoppingCart className="w-4 h-4" /> },
  dispatched:     { label: 'Dispatched',     color: 'bg-[#005f73]/10 text-[#005f73]',  icon: <Truck className="w-4 h-4" /> },
  delivered:      { label: 'Delivered',      color: 'bg-[#24a148]/10 text-[#24a148]',  icon: <CheckCircle className="w-4 h-4" /> },
  cancelled:      { label: 'Cancelled',      color: 'bg-[#da1e28]/10 text-[#da1e28]',  icon: <X className="w-4 h-4" /> },
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewingId, setViewingId] = useState<string | null>(null);

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => ['accepted', 'in_preparation', 'dispatched'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0),
  };

  const handleAccept = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'accepted' } : o));
  };

  const handleDispatch = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id
      ? { ...o, status: 'dispatched', notes: 'Dispatched via Harare Couriers' }
      : o
    ));
    setViewingId(null);
  };

  const viewingOrder = orders.find(o => o.id === viewingId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Orders</h1>
        <p className="text-[#6f6f6f]">Manage incoming purchase orders from Foodies Zimbabwe</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#F5C518] p-4">
          <div className="text-sm text-[#9e7c0b]">Pending Orders</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">{stats.pending}</div>
          <div className="text-xs text-[#9e7c0b]">Needs acceptance</div>
        </div>
        <div className="bg-white border border-[#0f62fe] p-4">
          <div className="text-sm text-[#0f62fe]">Active Orders</div>
          <div className="text-2xl font-semibold text-[#0f62fe]">{stats.active}</div>
        </div>
        <div className="bg-white border border-[#24a148] p-4">
          <div className="text-sm text-[#24a148]">Delivered</div>
          <div className="text-2xl font-semibold text-[#24a148]">{stats.delivered}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Revenue (Delivered)</div>
          <div className="text-2xl font-semibold text-[#161616]">{formatCurrency(stats.totalRevenue)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search by order number or branch..."
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
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Order</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Branch</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Items</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Total</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Required By</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3 font-medium">{order.requestNumber}</td>
                <td className="p-3 text-sm">{order.branchName}</td>
                <td className="p-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="text-sm">
                      {item.productName} <span className="text-[#6f6f6f]">× {item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </td>
                <td className="p-3 text-right font-medium">{formatCurrency(order.totalAmount)}</td>
                <td className="p-3 text-center text-sm">{order.requiredByDate}</td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {order.status === 'pending' && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAccept(order.id)}
                        className="px-2 py-1 text-xs bg-[#24a148] text-white hover:bg-[#1e8a3c]"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setViewingId(order.id)}
                        className="px-2 py-1 text-xs border border-[#8d8d8d] hover:bg-[#f4f4f4]"
                      >
                        View
                      </button>
                    </div>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => handleDispatch(order.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-[#F5C518] text-[#161616] hover:bg-[#e5b518] mx-auto"
                    >
                      <Truck className="w-3 h-3" /> Dispatch
                    </button>
                  )}
                  {['dispatched', 'delivered'].includes(order.status) && (
                    <button
                      onClick={() => setViewingId(order.id)}
                      className="text-xs text-[#0f62fe] hover:underline"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-lg font-medium">Order Details — {viewingOrder.requestNumber}</h2>
              <button onClick={() => setViewingId(null)} className="p-1 hover:bg-[#f4f4f4]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f4f4f4] p-3">
                  <div className="text-xs text-[#6f6f6f]">Branch</div>
                  <div className="font-medium">{viewingOrder.branchName}</div>
                </div>
                <div className="bg-[#f4f4f4] p-3">
                  <div className="text-xs text-[#6f6f6f]">Required By</div>
                  <div className="font-medium">{viewingOrder.requiredByDate}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-[#161616] mb-2">Order Items</div>
                <div className="border border-[#e0e0e0]">
                  <table className="w-full">
                    <thead className="bg-[#f4f4f4]">
                      <tr>
                        <th className="text-left p-2 text-xs font-medium text-[#525252]">Product</th>
                        <th className="text-right p-2 text-xs font-medium text-[#525252]">Qty</th>
                        <th className="text-right p-2 text-xs font-medium text-[#525252]">Unit Price</th>
                        <th className="text-right p-2 text-xs font-medium text-[#525252]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e0e0]">
                      {viewingOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td className="p-2 text-sm">{item.productName}</td>
                          <td className="p-2 text-right text-sm">{item.quantity} {item.unit}</td>
                          <td className="p-2 text-right text-sm">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-2 text-right text-sm font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#f4f4f4]">
                      <tr>
                        <td colSpan={3} className="p-2 text-sm font-medium text-right">Total</td>
                        <td className="p-2 text-right font-semibold">{formatCurrency(viewingOrder.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {viewingOrder.notes && (
                <div className="bg-[#f4f4f4] p-3 text-sm">
                  <div className="text-xs text-[#6f6f6f] mb-1">Notes</div>
                  {viewingOrder.notes}
                </div>
              )}

              <div className={`flex items-center gap-2 px-3 py-2 text-sm ${statusConfig[viewingOrder.status].color}`}>
                {statusConfig[viewingOrder.status].icon}
                Status: <strong>{statusConfig[viewingOrder.status].label}</strong>
              </div>
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                onClick={() => setViewingId(null)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Close
              </button>
              {viewingOrder.status === 'pending' && (
                <button
                  onClick={() => { handleAccept(viewingOrder.id); setViewingId(null); }}
                  className="px-4 py-2 bg-[#24a148] text-white font-medium hover:bg-[#1e8a3c]"
                >
                  Accept Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
