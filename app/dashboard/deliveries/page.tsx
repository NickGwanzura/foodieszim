'use client';

import { useState } from 'react';
import { Truck, CheckCircle, AlertTriangle, Clock, Search, X } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — DELIVERY MANAGEMENT (STORESMAN MODULE)
// Confirm incoming deliveries and record discrepancies
// ═════════════════════════════════════════════════════════════════════════════

type DeliveryStatus = 'in_transit' | 'awaiting_confirmation' | 'delivered' | 'disputed';

interface DeliveryItem {
  productName: string;
  expectedQty: number;
  actualQty?: number;
  unit: string;
  unitPrice: number;
}

interface Delivery {
  id: string;
  requestNumber: string;
  supplierName: string;
  expectedDate: string;
  status: DeliveryStatus;
  items: DeliveryItem[];
  hasDiscrepancy: boolean;
  dispatchedAt?: string;
  deliveredAt?: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: 'del1',
    requestNumber: 'PR-0045',
    supplierName: 'MegaFood Distributors',
    expectedDate: '2025-04-03',
    status: 'awaiting_confirmation',
    hasDiscrepancy: false,
    dispatchedAt: '2025-04-02T14:00:00Z',
    items: [
      { productName: 'Cooking Oil (2L)', expectedQty: 20, actualQty: 20, unit: 'bottle', unitPrice: 4.95 },
    ],
  },
  {
    id: 'del2',
    requestNumber: 'PR-0043',
    supplierName: 'Zimbabwe Gas Supplies',
    expectedDate: '2025-04-03',
    status: 'awaiting_confirmation',
    hasDiscrepancy: true,
    dispatchedAt: '2025-04-02T10:00:00Z',
    items: [
      { productName: 'LPG Gas (48kg)', expectedQty: 6, actualQty: 4, unit: 'cylinder', unitPrice: 195.00 },
    ],
  },
  {
    id: 'del3',
    requestNumber: 'PR-0041',
    supplierName: 'Premium Meats',
    expectedDate: '2025-04-04',
    status: 'in_transit',
    hasDiscrepancy: false,
    items: [
      { productName: 'Chicken Breast (10kg)', expectedQty: 5, unit: 'box', unitPrice: 72.00 },
    ],
  },
  {
    id: 'del4',
    requestNumber: 'PR-0039',
    supplierName: 'ProClean Zimbabwe',
    expectedDate: '2025-04-01',
    status: 'delivered',
    hasDiscrepancy: false,
    deliveredAt: '2025-04-01T11:30:00Z',
    items: [
      { productName: 'Cleaning Detergent (5L)', expectedQty: 12, actualQty: 12, unit: 'bottle', unitPrice: 7.90 },
    ],
  },
  {
    id: 'del5',
    requestNumber: 'PR-0038',
    supplierName: 'ZimKitchen Supplies Ltd',
    expectedDate: '2025-03-30',
    status: 'disputed',
    hasDiscrepancy: true,
    items: [
      { productName: 'Sugar (50kg)', expectedQty: 10, actualQty: 7, unit: 'bag', unitPrice: 42.00 },
    ],
  },
];

export default function DeliveriesPage() {
  const { success, warning } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [discrepancyNote, setDiscrepancyNote] = useState('');

  const filtered = deliveries.filter(d => {
    const matchesSearch =
      d.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    awaiting: deliveries.filter(d => d.status === 'awaiting_confirmation').length,
    inTransit: deliveries.filter(d => d.status === 'in_transit').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    disputed: deliveries.filter(d => d.status === 'disputed').length,
  };

  const handleConfirm = (id: string) => {
    setDeliveries(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: 'delivered', deliveredAt: new Date().toISOString() }
        : d
    ));
    setConfirmingId(null);
    success('Delivery Confirmed', 'Stock has been updated. Receipt uploaded to system.');
  };

  const handleFlagDiscrepancy = (id: string) => {
    setDeliveries(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'disputed', hasDiscrepancy: true } : d
    ));
    setConfirmingId(null);
    warning('Discrepancy Flagged', 'The accountant has been notified of the delivery discrepancy.');
  };

  const getStatusStyles = (status: DeliveryStatus) => {
    switch (status) {
      case 'awaiting_confirmation': return 'bg-[#0f62fe]/10 text-[#0f62fe]';
      case 'in_transit': return 'bg-[#F5C518]/10 text-[#9e7c0b]';
      case 'delivered': return 'bg-[#24a148]/10 text-[#24a148]';
      case 'disputed': return 'bg-[#da1e28]/10 text-[#da1e28]';
      default: return 'bg-[#e0e0e0] text-[#525252]';
    }
  };

  const formatStatus = (status: DeliveryStatus) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Deliveries</h1>
        <p className="text-[#6f6f6f]">Confirm incoming deliveries and record discrepancies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#0f62fe] p-4">
          <div className="text-sm text-[#0f62fe]">Awaiting Confirmation</div>
          <div className="text-2xl font-semibold text-[#0f62fe]">{stats.awaiting}</div>
        </div>
        <div className="bg-white border border-[#F5C518] p-4">
          <div className="text-sm text-[#9e7c0b]">In Transit</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">{stats.inTransit}</div>
        </div>
        <div className="bg-white border border-[#24a148] p-4">
          <div className="text-sm text-[#24a148]">Delivered</div>
          <div className="text-2xl font-semibold text-[#24a148]">{stats.delivered}</div>
        </div>
        <div className="bg-white border border-[#da1e28] p-4">
          <div className="text-sm text-[#da1e28]">Disputed</div>
          <div className="text-2xl font-semibold text-[#da1e28]">{stats.disputed}</div>
        </div>
      </div>

      {/* Alert */}
      {stats.awaiting > 0 && (
        <div className="bg-[#0f62fe]/10 border border-[#0f62fe] p-4">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#0f62fe] shrink-0" />
            <p className="text-sm text-[#0f62fe]">
              <strong>{stats.awaiting} delivery(ies)</strong> are waiting for your confirmation. Please verify quantities and condition before confirming.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search by request or supplier..."
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
          <option value="awaiting_confirmation">Awaiting Confirmation</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="disputed">Disputed</option>
        </select>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Request</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Supplier</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Items</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Expected Date</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filtered.map((delivery) => (
              <tr key={delivery.id} className={`hover:bg-[#f4f4f4] ${delivery.hasDiscrepancy && delivery.status !== 'delivered' ? 'bg-[#da1e28]/5' : ''}`}>
                <td className="p-3">
                  <div className="font-medium">{delivery.requestNumber}</div>
                  {delivery.hasDiscrepancy && (
                    <div className="flex items-center gap-1 text-xs text-[#da1e28]">
                      <AlertTriangle className="w-3 h-3" /> Discrepancy
                    </div>
                  )}
                </td>
                <td className="p-3 text-sm">{delivery.supplierName}</td>
                <td className="p-3">
                  {delivery.items.map((item, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-[#6f6f6f] ml-2">
                        {item.actualQty !== undefined ? `${item.actualQty}/${item.expectedQty}` : `${item.expectedQty}`} {item.unit}
                      </span>
                    </div>
                  ))}
                </td>
                <td className="p-3 text-center text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-[#8d8d8d]" />
                    {delivery.expectedDate}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${getStatusStyles(delivery.status)}`}>
                    {formatStatus(delivery.status)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {delivery.status === 'awaiting_confirmation' && (
                    <button
                      onClick={() => setConfirmingId(delivery.id)}
                      className="px-3 py-1 text-xs bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]"
                    >
                      Confirm
                    </button>
                  )}
                  {delivery.status === 'delivered' && (
                    <CheckCircle className="w-5 h-5 text-[#24a148] mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delivery Modal */}
      {confirmingId && (() => {
        const delivery = deliveries.find(d => d.id === confirmingId);
        if (!delivery) return null;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg shadow-xl">
              <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
                <h2 className="text-lg font-medium">Confirm Delivery — {delivery.requestNumber}</h2>
                <button onClick={() => setConfirmingId(null)} className="p-1 hover:bg-[#f4f4f4]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-[#f4f4f4] p-4 space-y-2">
                  <div className="font-medium text-sm">Delivery Items</div>
                  {delivery.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.productName}</span>
                      <span className="text-[#6f6f6f]">{item.expectedQty} {item.unit} @ ${item.unitPrice}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#161616] mb-1">Discrepancy Notes (optional)</label>
                  <textarea
                    value={discrepancyNote}
                    onChange={(e) => setDiscrepancyNote(e.target.value)}
                    rows={3}
                    placeholder="Note any quantity shortfalls, damaged items, or quality issues..."
                    className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none resize-none text-sm"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
                <button
                  onClick={() => handleFlagDiscrepancy(delivery.id)}
                  className="px-4 py-2 border border-[#da1e28] text-[#da1e28] hover:bg-[#da1e28]/5 text-sm"
                >
                  Flag Discrepancy
                </button>
                <button
                  onClick={() => handleConfirm(delivery.id)}
                  className="px-4 py-2 bg-[#24a148] text-white font-medium hover:bg-[#1e8a3c] text-sm"
                >
                  Confirm Full Delivery
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
