'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingDown, Package, Search, Save } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — REORDER LEVELS (STORESMAN MODULE)
// Configure minimum stock levels and automatic reorder triggers
// ═════════════════════════════════════════════════════════════════════════════

interface ReorderConfig {
  id: string;
  productName: string;
  category: string;
  unit: string;
  currentStock: number;
  minLevel: number;
  reorderPoint: number;
  reorderQty: number;
  maxLevel: number;
  leadTimeDays: number;
  avgDailyUsage: number;
  status: 'normal' | 'below_reorder' | 'below_minimum' | 'out_of_stock';
}

const initialConfigs: ReorderConfig[] = [
  { id: 'rl1', productName: 'Cooking Oil (2L)', category: 'Food Ingredients', unit: 'bottle', currentStock: 45, minLevel: 15, reorderPoint: 30, reorderQty: 50, maxLevel: 100, leadTimeDays: 2, avgDailyUsage: 2.1, status: 'normal' },
  { id: 'rl2', productName: 'Flour (25kg)', category: 'Food Ingredients', unit: 'bag', currentStock: 12, minLevel: 10, reorderPoint: 15, reorderQty: 20, maxLevel: 50, leadTimeDays: 3, avgDailyUsage: 1.2, status: 'below_reorder' },
  { id: 'rl3', productName: 'Chicken Breast (10kg)', category: 'Meat & Poultry', unit: 'box', currentStock: 8, minLevel: 5, reorderPoint: 10, reorderQty: 15, maxLevel: 30, leadTimeDays: 1, avgDailyUsage: 0.9, status: 'below_reorder' },
  { id: 'rl4', productName: 'Cleaning Detergent (5L)', category: 'Cleaning', unit: 'bottle', currentStock: 0, minLevel: 8, reorderPoint: 12, reorderQty: 24, maxLevel: 40, leadTimeDays: 2, avgDailyUsage: 0.6, status: 'out_of_stock' },
  { id: 'rl5', productName: 'LPG Gas (48kg)', category: 'Utilities', unit: 'cylinder', currentStock: 6, minLevel: 3, reorderPoint: 8, reorderQty: 12, maxLevel: 20, leadTimeDays: 5, avgDailyUsage: 0.4, status: 'below_reorder' },
  { id: 'rl6', productName: 'Sugar (50kg)', category: 'Food Ingredients', unit: 'bag', currentStock: 25, minLevel: 10, reorderPoint: 20, reorderQty: 20, maxLevel: 60, leadTimeDays: 2, avgDailyUsage: 0.7, status: 'normal' },
  { id: 'rl7', productName: 'Rice (25kg)', category: 'Food Ingredients', unit: 'bag', currentStock: 3, minLevel: 5, reorderPoint: 10, reorderQty: 15, maxLevel: 35, leadTimeDays: 2, avgDailyUsage: 1.5, status: 'below_minimum' },
];

const statusConfig: Record<ReorderConfig['status'], { label: string; color: string }> = {
  normal:         { label: 'Normal',        color: 'bg-[#24a148]/10 text-[#24a148]' },
  below_reorder:  { label: 'Below Reorder', color: 'bg-[#F5C518]/10 text-[#9e7c0b]' },
  below_minimum:  { label: 'Below Minimum', color: 'bg-[#da1e28]/10 text-[#da1e28]' },
  out_of_stock:   { label: 'Out of Stock',  color: 'bg-[#da1e28] text-white' },
};

export default function ReorderLevelsPage() {
  const { success } = useToast();
  const [configs, setConfigs] = useState<ReorderConfig[]>(initialConfigs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ReorderConfig>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = configs.filter(c =>
    c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const alerts = configs.filter(c => c.status !== 'normal');

  const startEdit = (config: ReorderConfig) => {
    setEditingId(config.id);
    setEditValues({
      minLevel: config.minLevel,
      reorderPoint: config.reorderPoint,
      reorderQty: config.reorderQty,
      maxLevel: config.maxLevel,
      leadTimeDays: config.leadTimeDays,
    });
  };

  const saveEdit = (id: string) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, ...editValues } : c));
    setEditingId(null);
    setEditValues({});
    success('Reorder Levels Updated', 'Configuration saved successfully.');
  };

  const NumberCell = ({ field, value }: { field: keyof ReorderConfig; value: number }) => {
    if (editingId && editingId === configs.find(c => c[field] === value)?.id) {
      return (
        <input
          type="number"
          min={0}
          value={(editValues[field] as number) ?? value}
          onChange={(e) => setEditValues(p => ({ ...p, [field]: parseInt(e.target.value) || 0 }))}
          className="w-16 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm"
        />
      );
    }
    return <span>{value}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Reorder Levels</h1>
        <p className="text-[#6f6f6f]">Configure minimum stock levels and reorder trigger points</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Configured Items</div>
          <div className="text-2xl font-semibold text-[#161616]">{configs.length}</div>
        </div>
        <div className="bg-white border border-[#da1e28] p-4">
          <div className="text-sm text-[#da1e28]">Out of Stock</div>
          <div className="text-2xl font-semibold text-[#da1e28]">
            {configs.filter(c => c.status === 'out_of_stock').length}
          </div>
        </div>
        <div className="bg-white border border-[#F5C518] p-4">
          <div className="text-sm text-[#9e7c0b]">Below Reorder</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">
            {configs.filter(c => c.status === 'below_reorder' || c.status === 'below_minimum').length}
          </div>
        </div>
        <div className="bg-white border border-[#24a148] p-4">
          <div className="text-sm text-[#24a148]">Normal</div>
          <div className="text-2xl font-semibold text-[#24a148]">
            {configs.filter(c => c.status === 'normal').length}
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="bg-[#da1e28]/10 border border-[#da1e28] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#da1e28] shrink-0" />
            <div>
              <div className="font-medium text-[#da1e28]">{alerts.length} Item(s) Need Attention</div>
              <ul className="mt-1 space-y-0.5">
                {alerts.map(a => (
                  <li key={a.id} className="text-sm text-[#da1e28]">
                    <strong>{a.productName}</strong> — {statusConfig[a.status].label} (Current: {a.currentStock} {a.unit})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white border border-[#e0e0e0] p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
      </div>

      {/* Reorder Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Current Stock</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Min Level</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Reorder Point</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Reorder Qty</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Max Level</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Lead Time</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filtered.map((config) => {
              const isEditing = editingId === config.id;
              return (
                <tr key={config.id} className="hover:bg-[#f4f4f4]">
                  <td className="p-3">
                    <div className="font-medium">{config.productName}</div>
                    <div className="text-xs text-[#6f6f6f]">{config.category} · {config.unit}</div>
                  </td>
                  <td className="p-3 text-right">
                    <span className={config.currentStock <= config.minLevel ? 'text-[#da1e28] font-medium' : ''}>
                      {config.currentStock}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {isEditing ? (
                      <input
                        type="number" min={0}
                        value={editValues.minLevel ?? config.minLevel}
                        onChange={(e) => setEditValues(p => ({ ...p, minLevel: parseInt(e.target.value) || 0 }))}
                        className="w-16 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm text-right"
                      />
                    ) : config.minLevel}
                  </td>
                  <td className="p-3 text-right">
                    {isEditing ? (
                      <input
                        type="number" min={0}
                        value={editValues.reorderPoint ?? config.reorderPoint}
                        onChange={(e) => setEditValues(p => ({ ...p, reorderPoint: parseInt(e.target.value) || 0 }))}
                        className="w-16 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm text-right"
                      />
                    ) : config.reorderPoint}
                  </td>
                  <td className="p-3 text-right">
                    {isEditing ? (
                      <input
                        type="number" min={0}
                        value={editValues.reorderQty ?? config.reorderQty}
                        onChange={(e) => setEditValues(p => ({ ...p, reorderQty: parseInt(e.target.value) || 0 }))}
                        className="w-16 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm text-right"
                      />
                    ) : config.reorderQty}
                  </td>
                  <td className="p-3 text-right">
                    {isEditing ? (
                      <input
                        type="number" min={0}
                        value={editValues.maxLevel ?? config.maxLevel}
                        onChange={(e) => setEditValues(p => ({ ...p, maxLevel: parseInt(e.target.value) || 0 }))}
                        className="w-16 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm text-right"
                      />
                    ) : config.maxLevel}
                  </td>
                  <td className="p-3 text-center text-sm">
                    {isEditing ? (
                      <input
                        type="number" min={1}
                        value={editValues.leadTimeDays ?? config.leadTimeDays}
                        onChange={(e) => setEditValues(p => ({ ...p, leadTimeDays: parseInt(e.target.value) || 1 }))}
                        className="w-14 px-2 py-1 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none text-sm text-center"
                      />
                    ) : `${config.leadTimeDays}d`}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 ${statusConfig[config.status].color}`}>
                      {statusConfig[config.status].label}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => saveEdit(config.id)}
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
                        onClick={() => startEdit(config)}
                        className="px-3 py-1 text-xs border border-[#F5C518] text-[#161616] hover:bg-[#F5C518]/10"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
