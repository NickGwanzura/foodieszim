'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { useModal } from '@/lib/modal-context';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  AlertCircle,
  X,
  Plus,
  Minus,
  Eye
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — STOCK MANAGEMENT (STORESMAN MODULE)
// Comprehensive inventory visibility and control
// ═════════════════════════════════════════════════════════════════════════════

interface StockItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  unit: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityIncoming: number;
  availableQuantity: number;
  reorderLevel: number;
  maxStockLevel: number;
  weeklyUsageRate: number;
  daysOfCover: number;
  twoWeekCover: number;
  status: 'in_stock' | 'low_stock' | 'critical' | 'out_of_stock' | 'on_order';
  lastMovementAt?: string;
}

const mockStock: StockItem[] = [
  { id: 'st1', productId: 'prod1', productName: 'Cooking Oil (2L)', category: 'Food Ingredients', unit: 'bottle', quantityOnHand: 45, quantityReserved: 20, quantityIncoming: 50, availableQuantity: 25, reorderLevel: 30, maxStockLevel: 100, weeklyUsageRate: 15, daysOfCover: 21, twoWeekCover: 30, status: 'in_stock', lastMovementAt: '2025-04-02' },
  { id: 'st2', productId: 'prod3', productName: 'Flour (25kg)', category: 'Food Ingredients', unit: 'bag', quantityOnHand: 12, quantityReserved: 10, quantityIncoming: 20, availableQuantity: 2, reorderLevel: 15, maxStockLevel: 50, weeklyUsageRate: 8, daysOfCover: 2, twoWeekCover: 16, status: 'critical', lastMovementAt: '2025-04-01' },
  { id: 'st3', productId: 'prod5', productName: 'Chicken Breast (10kg)', category: 'Meat & Poultry', unit: 'box', quantityOnHand: 8, quantityReserved: 5, quantityIncoming: 0, availableQuantity: 3, reorderLevel: 10, maxStockLevel: 30, weeklyUsageRate: 6, daysOfCover: 4, twoWeekCover: 12, status: 'low_stock', lastMovementAt: '2025-04-02' },
  { id: 'st4', productId: 'prod7', productName: 'Cleaning Detergent (5L)', category: 'Cleaning', unit: 'bottle', quantityOnHand: 0, quantityReserved: 0, quantityIncoming: 24, availableQuantity: 0, reorderLevel: 12, maxStockLevel: 40, weeklyUsageRate: 4, daysOfCover: 0, twoWeekCover: 0, status: 'out_of_stock', lastMovementAt: '2025-03-28' },
  { id: 'st5', productId: 'prod10', productName: 'LPG Gas (48kg)', category: 'Utilities', unit: 'cylinder', quantityOnHand: 6, quantityReserved: 4, quantityIncoming: 12, availableQuantity: 2, reorderLevel: 8, maxStockLevel: 20, weeklyUsageRate: 3, daysOfCover: 5, twoWeekCover: 9, status: 'low_stock', lastMovementAt: '2025-04-01' },
  { id: 'st6', productId: 'prod4', productName: 'Sugar (50kg)', category: 'Food Ingredients', unit: 'bag', quantityOnHand: 25, quantityReserved: 5, quantityIncoming: 0, availableQuantity: 20, reorderLevel: 20, maxStockLevel: 60, weeklyUsageRate: 5, daysOfCover: 28, twoWeekCover: 35, status: 'in_stock', lastMovementAt: '2025-04-02' },
];

const stockMovements = [
  { id: 'mv1', type: 'receipt', product: 'Cooking Oil (2L)', quantity: 50, date: '2025-04-02', reference: 'PO-0045' },
  { id: 'mv2', type: 'issue', product: 'Flour (25kg)', quantity: -8, date: '2025-04-02', reference: 'PR-0042' },
  { id: 'mv3', type: 'issue', product: 'Chicken Breast (10kg)', quantity: -3, date: '2025-04-01', reference: 'PR-0041' },
  { id: 'mv4', type: 'receipt', product: 'LPG Gas (48kg)', quantity: 6, date: '2025-04-01', reference: 'PO-0043' },
];

export default function StockManagementPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const { openModal } = useModal();
  
  const [stock, setStock] = useState<StockItem[]>(mockStock);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'analysis'>('overview');
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [movementForm, setMovementForm] = useState({
    type: 'receipt' as 'receipt' | 'issue' | 'adjustment',
    quantity: 0,
    reference: '',
    notes: '',
  });

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const stats = {
    totalItems: stock.length,
    criticalStock: stock.filter(s => s.status === 'critical').length,
    outOfStock: stock.filter(s => s.status === 'out_of_stock').length,
    lowStock: stock.filter(s => s.status === 'low_stock').length,
    incomingDeliveries: stock.filter(s => s.quantityIncoming > 0).length,
    avgCover: Math.round(stock.reduce((sum, s) => sum + s.daysOfCover, 0) / stock.length),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-[#24a148]/10 text-[#24a148]';
      case 'low_stock': return 'bg-[#F5C518]/10 text-[#9e7c0b]';
      case 'critical': return 'bg-[#da1e28]/10 text-[#da1e28]';
      case 'out_of_stock': return 'bg-[#da1e28] text-white';
      case 'on_order': return 'bg-[#0f62fe]/10 text-[#0f62fe]';
      default: return 'bg-[#e0e0e0] text-[#525252]';
    }
  };

  const handleRecordMovement = (item?: StockItem) => {
    setSelectedItem(item || null);
    setMovementForm({
      type: 'receipt',
      quantity: 0,
      reference: '',
      notes: '',
    });
    setShowMovementModal(true);
  };

  const handleSubmitMovement = () => {
    if (movementForm.quantity <= 0) {
      showError('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    const multiplier = movementForm.type === 'issue' ? -1 : 1;
    const actualChange = movementForm.quantity * multiplier;

    if (selectedItem) {
      // Update specific item
      setStock(prev => prev.map(item => {
        if (item.id === selectedItem.id) {
          const newOnHand = Math.max(0, item.quantityOnHand + actualChange);
          const newAvailable = newOnHand - item.quantityReserved;
          return {
            ...item,
            quantityOnHand: newOnHand,
            availableQuantity: newAvailable,
            lastMovementAt: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      }));
    }

    setShowMovementModal(false);
    setSelectedItem(null);
    success('Movement Recorded', `${movementForm.type === 'receipt' ? 'Receipt' : 'Issue'} of ${movementForm.quantity} units recorded successfully`);
  };

  const handleViewItem = (item: StockItem) => {
    openModal({
      type: 'form',
      title: item.productName,
      size: 'md',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f4f4f4] p-3">
              <div className="text-xs text-[#6f6f6f]">On Hand</div>
              <div className="text-xl font-medium">{item.quantityOnHand}</div>
            </div>
            <div className="bg-[#f4f4f4] p-3">
              <div className="text-xs text-[#6f6f6f]">Reserved</div>
              <div className="text-xl font-medium">{item.quantityReserved}</div>
            </div>
            <div className="bg-[#f4f4f4] p-3">
              <div className="text-xs text-[#6f6f6f]">Available</div>
              <div className="text-xl font-medium">{item.availableQuantity}</div>
            </div>
            <div className="bg-[#f4f4f4] p-3">
              <div className="text-xs text-[#6f6f6f]">Incoming</div>
              <div className="text-xl font-medium">{item.quantityIncoming}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6f6f6f]">Category:</span>
              <span>{item.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6f6f6f]">Unit:</span>
              <span>{item.unit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6f6f6f]">Reorder Level:</span>
              <span>{item.reorderLevel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6f6f6f]">Days of Cover:</span>
              <span className={item.daysOfCover < 7 ? 'text-[#da1e28] font-medium' : ''}>{item.daysOfCover} days</span>
            </div>
          </div>
        </div>
      ),
      confirmLabel: 'Record Movement',
      onConfirm: () => {
        handleRecordMovement(item);
      },
    });
  };

  const handleAlertManager = (item: StockItem) => {
    success('Alert Sent', `Stock alert for ${item.productName} has been sent to the manager`);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <header className="bg-[#161616] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard')} className="text-white hover:text-[#F5C518]">
                ← Back
              </button>
              <span className="text-xl font-medium">FOODIES</span>
              <span className="text-[#F5C518]">|</span>
              <span className="text-sm text-gray-300">Stock Management</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{user?.name}</span>
              <div className="w-8 h-8 bg-[#6929c4] flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-[#161616]">Stock Management</h1>
            <p className="text-[#6f6f6f]">Inventory visibility, reorder intelligence, and stock control</p>
          </div>
          <button 
            type="button"
            onClick={() => handleRecordMovement()}
            className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518] active:scale-95 transition-all"
          >
            <Package className="w-4 h-4" />
            Record Movement
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="text-sm text-[#6f6f6f]">Total Items</div>
            <div className="text-2xl font-semibold text-[#161616]">{stats.totalItems}</div>
          </div>
          <div className="bg-white border border-[#da1e28] p-4">
            <div className="text-sm text-[#da1e28]">Critical Stock</div>
            <div className="text-2xl font-semibold text-[#da1e28]">{stats.criticalStock}</div>
          </div>
          <div className="bg-white border border-[#da1e28] p-4">
            <div className="text-sm text-[#da1e28]">Out of Stock</div>
            <div className="text-2xl font-semibold text-[#da1e28]">{stats.outOfStock}</div>
          </div>
          <div className="bg-white border border-[#F5C518] p-4">
            <div className="text-sm text-[#9e7c0b]">Low Stock</div>
            <div className="text-2xl font-semibold text-[#9e7c0b]">{stats.lowStock}</div>
          </div>
          <div className="bg-white border border-[#0f62fe] p-4">
            <div className="text-sm text-[#0f62fe]">Incoming</div>
            <div className="text-2xl font-semibold text-[#0f62fe]">{stats.incomingDeliveries}</div>
          </div>
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="text-sm text-[#6f6f6f]">Avg Days Cover</div>
            <div className="text-2xl font-semibold text-[#161616]">{stats.avgCover}</div>
          </div>
        </div>

        {/* Alerts */}
        {(stats.criticalStock > 0 || stats.outOfStock > 0) && (
          <div className="bg-[#da1e28]/10 border border-[#da1e28] p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#da1e28] shrink-0" />
              <div>
                <div className="font-medium text-[#da1e28]">Stock Alerts</div>
                <p className="text-sm text-[#da1e28]">
                  {stats.criticalStock > 0 && `${stats.criticalStock} item(s) at critical levels. `}
                  {stats.outOfStock > 0 && `${stats.outOfStock} item(s) out of stock. `}
                  Immediate action required.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-[#e0e0e0]">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Stock Overview', icon: Package },
              { id: 'movements', label: 'Recent Movements', icon: Truck },
              { id: 'analysis', label: 'Usage Analysis', icon: TrendingUp },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
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

        {/* Stock Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
                <input
                  type="text"
                  placeholder="Search stock items..."
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
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="critical">Critical</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Stock Table */}
            <div className="bg-white border border-[#e0e0e0]">
              <table className="w-full">
                <thead className="bg-[#f4f4f4]">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
                    <th className="text-right p-3 text-sm font-medium text-[#525252]">On Hand</th>
                    <th className="text-right p-3 text-sm font-medium text-[#525252]">Reserved</th>
                    <th className="text-right p-3 text-sm font-medium text-[#525252]">Available</th>
                    <th className="text-right p-3 text-sm font-medium text-[#525252]">Incoming</th>
                    <th className="text-center p-3 text-sm font-medium text-[#525252]">Days Cover</th>
                    <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
                    <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {filteredStock.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f4f4f4]">
                      <td className="p-3">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-[#6f6f6f]">{item.category}</div>
                      </td>
                      <td className="p-3 text-right">{item.quantityOnHand}</td>
                      <td className="p-3 text-right text-[#6f6f6f]">{item.quantityReserved}</td>
                      <td className="p-3 text-right font-medium">{item.availableQuantity}</td>
                      <td className="p-3 text-right">
                        {item.quantityIncoming > 0 ? (
                          <span className="text-[#0f62fe]">+{item.quantityIncoming}</span>
                        ) : (
                          <span className="text-[#6f6f6f]">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-3 h-3 text-[#8d8d8d]" />
                          {item.daysOfCover} days
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-xs px-2 py-1 ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewItem(item)}
                            className="p-1.5 bg-[#f4f4f4] hover:bg-[#e0e0e0] text-[#525252]"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRecordMovement(item)}
                            className="p-1.5 bg-[#F5C518] hover:bg-[#e5b518] text-[#161616]"
                            title="Record Movement"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Movements Tab */}
        {activeTab === 'movements' && (
          <div className="bg-white border border-[#e0e0e0]">
            <table className="w-full">
              <thead className="bg-[#f4f4f4]">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-[#525252]">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-[#525252]">Type</th>
                  <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
                  <th className="text-right p-3 text-sm font-medium text-[#525252]">Quantity</th>
                  <th className="text-left p-3 text-sm font-medium text-[#525252]">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]">
                {stockMovements.map((mv) => (
                  <tr key={mv.id} className="hover:bg-[#f4f4f4]">
                    <td className="p-3 text-sm">{mv.date}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 ${
                        mv.type === 'receipt' ? 'bg-[#24a148]/10 text-[#24a148]' : 'bg-[#da1e28]/10 text-[#da1e28]'
                      }`}>
                        {mv.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">{mv.product}</td>
                    <td className={`p-3 text-right font-medium ${mv.quantity > 0 ? 'text-[#24a148]' : 'text-[#da1e28]'}`}>
                      {mv.quantity > 0 ? '+' : ''}{mv.quantity}
                    </td>
                    <td className="p-3 text-sm font-mono">{mv.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e0e0e0] p-5">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#24a148]" />
                Fast Moving Items
              </h3>
              <div className="space-y-3">
                {stock
                  .sort((a, b) => b.weeklyUsageRate - a.weeklyUsageRate)
                  .slice(0, 3)
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#f4f4f4]">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-sm">{item.weeklyUsageRate} / week</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white border border-[#e0e0e0] p-5">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#da1e28]" />
                Reorder Urgency
              </h3>
              <div className="space-y-3">
                {stock
                  .filter(s => s.status === 'critical' || s.status === 'out_of_stock')
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#da1e28]/5 border border-[#da1e28]">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-[#6f6f6f]">Reorder level: {item.reorderLevel}</div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleAlertManager(item)}
                        className="text-xs bg-[#da1e28] text-white px-3 py-1 hover:bg-[#b91c1c]"
                      >
                        Alert Manager
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Record Movement Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-lg font-medium">
                Record {movementForm.type === 'receipt' ? 'Receipt' : 'Issue'}
                {selectedItem && ` - ${selectedItem.productName}`}
              </h2>
              <button 
                type="button"
                onClick={() => setShowMovementModal(false)}
                className="p-1 hover:bg-[#f4f4f4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Movement Type */}
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-2">Movement Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['receipt', 'issue', 'adjustment'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMovementForm(prev => ({ ...prev, type }))}
                      className={`py-2 border-2 font-medium capitalize ${
                        movementForm.type === type
                          ? 'border-[#F5C518] bg-[#F5C518] text-[#161616]'
                          : 'border-[#e0e0e0] text-[#525252] hover:border-[#8d8d8d]'
                      }`}
                    >
                      {type === 'receipt' && <Plus className="w-4 h-4 inline mr-1" />}
                      {type === 'issue' && <Minus className="w-4 h-4 inline mr-1" />}
                      {type === 'adjustment' && <TrendingUp className="w-4 h-4 inline mr-1" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={movementForm.quantity || ''}
                  onChange={(e) => setMovementForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="Enter quantity..."
                />
              </div>

              {/* Reference */}
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Reference</label>
                <input
                  type="text"
                  value={movementForm.reference}
                  onChange={(e) => setMovementForm(prev => ({ ...prev, reference: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                  placeholder="e.g., PO-0045, PR-0042..."
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Notes (Optional)</label>
                <textarea
                  value={movementForm.notes}
                  onChange={(e) => setMovementForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none resize-none"
                  placeholder="Any additional notes..."
                />
              </div>

              {selectedItem && (
                <div className="bg-[#f4f4f4] p-3">
                  <div className="text-sm text-[#6f6f6f]">Current Stock</div>
                  <div className="font-medium">{selectedItem.quantityOnHand} {selectedItem.unit}</div>
                  <div className="text-sm text-[#6f6f6f] mt-1">
                    After this movement: {Math.max(0, selectedItem.quantityOnHand + (movementForm.type === 'issue' ? -movementForm.quantity : movementForm.quantity))} {selectedItem.unit}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowMovementModal(false)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitMovement}
                disabled={movementForm.quantity <= 0}
                className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518] disabled:bg-[#e0e0e0] disabled:text-[#a8a8a8]"
              >
                Record Movement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
