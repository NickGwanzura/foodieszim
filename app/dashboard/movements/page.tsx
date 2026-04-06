'use client';

import { useState } from 'react';
import { Search, ArrowUpCircle, ArrowDownCircle, RefreshCw, Plus, X } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — STOCK MOVEMENTS (STORESMAN MODULE)
// Record and review all inventory movements
// ═════════════════════════════════════════════════════════════════════════════

type MovementType = 'receipt' | 'issue' | 'adjustment' | 'transfer_in' | 'transfer_out' | 'waste';

interface StockMovement {
  id: string;
  productName: string;
  category: string;
  type: MovementType;
  quantity: number;
  reference: string;
  performedBy: string;
  date: string;
  notes?: string;
}

const mockMovements: StockMovement[] = [
  { id: 'mv1', productName: 'Cooking Oil (2L)', category: 'Food Ingredients', type: 'receipt', quantity: 50, reference: 'PO-0045', performedBy: 'John Ncube', date: '2025-04-02', notes: 'Full delivery confirmed' },
  { id: 'mv2', productName: 'Flour (25kg)', category: 'Food Ingredients', type: 'issue', quantity: 8, reference: 'PR-0042', performedBy: 'John Ncube', date: '2025-04-02', notes: 'Issued to kitchen' },
  { id: 'mv3', productName: 'Chicken Breast (10kg)', category: 'Meat & Poultry', type: 'issue', quantity: 3, reference: 'PR-0041', performedBy: 'John Ncube', date: '2025-04-01' },
  { id: 'mv4', productName: 'LPG Gas (48kg)', category: 'Utilities', type: 'receipt', quantity: 6, reference: 'PO-0043', performedBy: 'Peter Dube', date: '2025-04-01' },
  { id: 'mv5', productName: 'Sugar (50kg)', category: 'Food Ingredients', type: 'adjustment', quantity: -2, reference: 'ADJ-0012', performedBy: 'John Ncube', date: '2025-03-31', notes: 'Count discrepancy — damaged bags' },
  { id: 'mv6', productName: 'Cleaning Detergent (5L)', category: 'Cleaning', type: 'receipt', quantity: 24, reference: 'PO-0040', performedBy: 'John Ncube', date: '2025-03-30' },
  { id: 'mv7', productName: 'Cooking Oil (2L)', category: 'Food Ingredients', type: 'waste', quantity: 2, reference: 'WST-0003', performedBy: 'John Ncube', date: '2025-03-29', notes: 'Leaking bottles disposed' },
  { id: 'mv8', productName: 'Flour (25kg)', category: 'Food Ingredients', type: 'transfer_in', quantity: 5, reference: 'TRF-0008', performedBy: 'Peter Dube', date: '2025-03-28', notes: 'Transfer from Eastgate branch' },
];

const typeConfig: Record<MovementType, { label: string; color: string; sign: number }> = {
  receipt:      { label: 'Receipt',     color: 'bg-[#24a148]/10 text-[#24a148]',  sign: 1 },
  issue:        { label: 'Issue',       color: 'bg-[#da1e28]/10 text-[#da1e28]',  sign: -1 },
  adjustment:   { label: 'Adjustment',  color: 'bg-[#0f62fe]/10 text-[#0f62fe]',  sign: 0 },
  transfer_in:  { label: 'Transfer In', color: 'bg-[#6929c4]/10 text-[#6929c4]',  sign: 1 },
  transfer_out: { label: 'Transfer Out',color: 'bg-[#9f1853]/10 text-[#9f1853]',  sign: -1 },
  waste:        { label: 'Waste',       color: 'bg-[#F5C518]/10 text-[#9e7c0b]',  sign: -1 },
};

export default function MovementsPage() {
  const { success } = useToast();
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    productName: '',
    type: 'receipt' as MovementType,
    quantity: '',
    reference: '',
    notes: '',
  });

  const filtered = movements.filter(m => {
    const matchesSearch =
      m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || m.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    receipts: movements.filter(m => m.type === 'receipt').length,
    issues: movements.filter(m => m.type === 'issue').length,
    adjustments: movements.filter(m => m.type === 'adjustment').length,
    total: movements.length,
  };

  const handleSubmit = () => {
    if (!form.productName || !form.quantity) return;
    const newMovement: StockMovement = {
      id: `mv${Date.now()}`,
      productName: form.productName,
      category: 'General',
      type: form.type,
      quantity: parseInt(form.quantity) || 0,
      reference: form.reference || `MNL-${Date.now().toString().slice(-4)}`,
      performedBy: 'John Ncube',
      date: new Date().toISOString().split('T')[0],
      notes: form.notes || undefined,
    };
    setMovements(prev => [newMovement, ...prev]);
    setShowModal(false);
    setForm({ productName: '', type: 'receipt', quantity: '', reference: '', notes: '' });
    success('Movement Recorded', `${typeConfig[form.type].label} of ${form.quantity} units recorded.`);
  };

  const getQuantityDisplay = (m: StockMovement) => {
    const cfg = typeConfig[m.type];
    const sign = cfg.sign !== 0 ? cfg.sign : (m.quantity < 0 ? -1 : 1);
    const value = Math.abs(m.quantity);
    const isPositive = sign > 0 || m.quantity > 0;
    return (
      <span className={`font-medium ${isPositive ? 'text-[#24a148]' : 'text-[#da1e28]'}`}>
        {isPositive ? '+' : '-'}{value}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Stock Movements</h1>
          <p className="text-[#6f6f6f]">Complete history of all inventory movements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]"
        >
          <Plus className="w-4 h-4" />
          Record Movement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Movements</div>
          <div className="text-2xl font-semibold text-[#161616]">{stats.total}</div>
          <div className="text-xs text-[#6f6f6f]">This week</div>
        </div>
        <div className="bg-white border border-[#24a148] p-4">
          <div className="text-sm text-[#24a148]">Receipts</div>
          <div className="text-2xl font-semibold text-[#24a148]">{stats.receipts}</div>
        </div>
        <div className="bg-white border border-[#da1e28] p-4">
          <div className="text-sm text-[#da1e28]">Issues</div>
          <div className="text-2xl font-semibold text-[#da1e28]">{stats.issues}</div>
        </div>
        <div className="bg-white border border-[#0f62fe] p-4">
          <div className="text-sm text-[#0f62fe]">Adjustments</div>
          <div className="text-2xl font-semibold text-[#0f62fe]">{stats.adjustments}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search products or references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Types</option>
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {/* Movements Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Date</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Type</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Quantity</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Reference</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Performed By</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3 text-sm">{m.date}</td>
                <td className="p-3">
                  <div className="font-medium">{m.productName}</div>
                  <div className="text-xs text-[#6f6f6f]">{m.category}</div>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${typeConfig[m.type].color}`}>
                    {typeConfig[m.type].label}
                  </span>
                </td>
                <td className="p-3 text-right">{getQuantityDisplay(m)}</td>
                <td className="p-3 text-sm font-mono">{m.reference}</td>
                <td className="p-3 text-sm">{m.performedBy}</td>
                <td className="p-3 text-sm text-[#6f6f6f]">{m.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Movement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-lg font-medium">Record Stock Movement</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-[#f4f4f4]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Product Name</label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm(p => ({ ...p, productName: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="e.g., Cooking Oil (2L)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Movement Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm(p => ({ ...p, type: e.target.value as MovementType }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                >
                  {Object.entries(typeConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm(p => ({ ...p, quantity: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="Enter quantity..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Reference</label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={(e) => setForm(p => ({ ...p, reference: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="e.g., PO-0045, PR-0042..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.productName || !form.quantity}
                className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518] disabled:bg-[#e0e0e0] disabled:text-[#a8a8a8]"
              >
                Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
