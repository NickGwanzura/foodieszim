'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  MapPin,
  User,
  Wrench,
  ArrowRightLeft,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingDown
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — ASSET MANAGEMENT
// Full lifecycle: register → assign → maintain → transfer → dispose
// ═════════════════════════════════════════════════════════════════════════════

type AssetStatus = 'active' | 'maintenance' | 'damaged' | 'disposed' | 'transferred';
type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor';

interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  branch: string;
  custodian?: string;
  purchaseValue: number;
  currentValue: number;
  condition: AssetCondition;
  status: AssetStatus;
  purchaseDate: string;
  nextMaintenance?: string;
  warrantyExpiry?: string;
}

const mockAssets: Asset[] = [
  { id: 'ast1', assetTag: 'EQ-2024-001', name: 'Commercial Blender', category: 'Equipment', branch: 'Avondale Shop', custodian: 'Kitchen Lead', purchaseValue: 1200, currentValue: 950, condition: 'good', status: 'active', purchaseDate: '2024-01-15', nextMaintenance: '2025-05-15', warrantyExpiry: '2026-01-15' },
  { id: 'ast2', assetTag: 'EQ-2024-002', name: 'Gas Stove (6 Burner)', category: 'Equipment', branch: 'Avondale Shop', custodian: 'Head Chef', purchaseValue: 3500, currentValue: 3100, condition: 'excellent', status: 'active', purchaseDate: '2024-02-01', nextMaintenance: '2025-06-01', warrantyExpiry: '2027-02-01' },
  { id: 'ast3', assetTag: 'FR-2024-003', name: 'Display Fridge', category: 'Refrigeration', branch: 'Eastgate Shop', custodian: 'Store Manager', purchaseValue: 2800, currentValue: 2400, condition: 'good', status: 'active', purchaseDate: '2024-01-20', nextMaintenance: '2025-04-20' },
  { id: 'ast4', assetTag: 'IT-2024-004', name: 'POS Terminal', category: 'Electronics', branch: 'Borrowdale', purchaseValue: 1800, currentValue: 1500, condition: 'good', status: 'active', purchaseDate: '2024-03-10' },
  { id: 'ast5', assetTag: 'EQ-2024-005', name: 'Deep Fryer', category: 'Equipment', branch: 'Avondale Shop', purchaseValue: 2200, currentValue: 1800, condition: 'fair', status: 'maintenance', purchaseDate: '2024-01-10', nextMaintenance: '2025-04-05' },
  { id: 'ast6', assetTag: 'FN-2024-006', name: 'Dining Tables (set of 8)', category: 'Furniture', branch: 'Westgate', purchaseValue: 1500, currentValue: 1200, condition: 'good', status: 'active', purchaseDate: '2024-02-20' },
  { id: 'ast7', assetTag: 'IT-2023-001', name: 'Laptop - Dell Latitude', category: 'Electronics', branch: 'HQ', custodian: 'Grace Chikomo', purchaseValue: 1400, currentValue: 800, condition: 'fair', status: 'active', purchaseDate: '2023-06-15' },
  { id: 'ast8', assetTag: 'VH-2023-002', name: 'Toyota Hiace Van', category: 'Vehicle', branch: 'Fleet', custodian: 'Fleet Manager', purchaseValue: 35000, currentValue: 28000, condition: 'good', status: 'active', purchaseDate: '2023-08-01', nextMaintenance: '2025-05-01' },
  { id: 'ast9', assetTag: 'EQ-2023-003', name: 'Ice Maker Machine', category: 'Equipment', branch: 'Eastgate Shop', purchaseValue: 3200, currentValue: 2000, condition: 'poor', status: 'damaged', purchaseDate: '2023-03-15' },
  { id: 'ast10', assetTag: 'FR-2023-004', name: 'Walk-in Freezer', category: 'Refrigeration', branch: 'Borrowdale', purchaseValue: 12000, currentValue: 9000, condition: 'good', status: 'active', purchaseDate: '2023-05-20', nextMaintenance: '2025-04-20' },
];

const statusColors: Record<AssetStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  active: { bg: 'bg-[#24a148]/10', text: 'text-[#24a148]', icon: <CheckCircle className="w-3 h-3" /> },
  maintenance: { bg: 'bg-[#F5C518]/10', text: 'text-[#9e7c0b]', icon: <Wrench className="w-3 h-3" /> },
  damaged: { bg: 'bg-[#da1e28]/10', text: 'text-[#da1e28]', icon: <AlertCircle className="w-3 h-3" /> },
  disposed: { bg: 'bg-[#8d8d8d]/10', text: 'text-[#6f6f6f]', icon: <Trash2 className="w-3 h-3" /> },
  transferred: { bg: 'bg-[#0f62fe]/10', text: 'text-[#0f62fe]', icon: <ArrowRightLeft className="w-3 h-3" /> },
};

const conditionColors: Record<AssetCondition, string> = {
  excellent: 'bg-[#24a148]',
  good: 'bg-[#F5C518]',
  fair: 'bg-[#ff832b]',
  poor: 'bg-[#da1e28]',
};

export default function AssetsPage() {
  const { user, can } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | ''>('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockAssets.length,
    active: mockAssets.filter(a => a.status === 'active').length,
    maintenance: mockAssets.filter(a => a.status === 'maintenance').length,
    damaged: mockAssets.filter(a => a.status === 'damaged').length,
    totalValue: mockAssets.reduce((sum, a) => sum + a.currentValue, 0),
  };

  const canRegisterAsset = can('asset:register');
  const canTransferAsset = can('asset:transfer');
  const canDisposeAsset = can('asset:dispose');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Asset Management</h1>
          <p className="text-[#6f6f6f]">Track and manage all branch assets</p>
        </div>
        <button 
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]"
        >
          <Plus className="w-4 h-4" />
          Register Asset
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Assets</div>
          <div className="text-2xl font-semibold text-[#161616]">{stats.total}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Active</div>
          <div className="text-2xl font-semibold text-[#24a148]">{stats.active}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">In Maintenance</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">{stats.maintenance}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Damaged</div>
          <div className="text-2xl font-semibold text-[#da1e28]">{stats.damaged}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Value</div>
          <div className="text-2xl font-semibold text-[#161616]">${(stats.totalValue / 1000).toFixed(1)}k</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search assets by name, tag, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as AssetStatus | '')}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="damaged">Damaged</option>
          <option value="transferred">Transferred</option>
          <option value="disposed">Disposed</option>
        </select>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-[#f4f4f4]' : ''}`}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-[#f4f4f4]' : ''}`}
          >
            <Package className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">
                <input type="checkbox" className="w-4 h-4" />
              </th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Asset Tag</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Name & Category</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Location</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Value</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Condition</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3">
                  <input type="checkbox" className="w-4 h-4" />
                </td>
                <td className="p-3">
                  <span className="font-mono text-sm">{asset.assetTag}</span>
                </td>
                <td className="p-3">
                  <div className="font-medium text-[#161616]">{asset.name}</div>
                  <div className="text-xs text-[#6f6f6f]">{asset.category}</div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="w-3 h-3 text-[#8d8d8d]" />
                    {asset.branch}
                  </div>
                  {asset.custodian && (
                    <div className="flex items-center gap-1 text-xs text-[#6f6f6f] mt-1">
                      <User className="w-3 h-3" />
                      {asset.custodian}
                    </div>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium">${asset.currentValue.toLocaleString()}</div>
                  <div className="text-xs text-[#6f6f6f]">purchased ${asset.purchaseValue.toLocaleString()}</div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${conditionColors[asset.condition]}`} />
                    <span className="text-xs capitalize">{asset.condition}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs ${statusColors[asset.status].bg} ${statusColors[asset.status].text}`}>
                    {statusColors[asset.status].icon}
                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1 hover:bg-[#e0e0e0]" title="View">
                      <MoreHorizontal className="w-4 h-4 text-[#525252]" />
                    </button>
                    {asset.status === 'active' && (
                      <button className="p-1 hover:bg-[#e0e0e0]" title="Schedule Maintenance">
                        <Wrench className="w-4 h-4 text-[#525252]" />
                      </button>
                    )}
                    <button className="p-1 hover:bg-[#e0e0e0]" title="Transfer">
                      <ArrowRightLeft className="w-4 h-4 text-[#525252]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAssets.length === 0 && (
          <div className="p-12 text-center text-[#6f6f6f]">
            <Package className="w-12 h-12 mx-auto mb-4 text-[#c6c6c6]" />
            <p>No assets found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Asset Lifecycle Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#f4f4f4] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#F5C518]" />
            <h3 className="font-medium">Maintenance Due</h3>
          </div>
          <div className="space-y-2">
            {mockAssets
              .filter(a => a.nextMaintenance && new Date(a.nextMaintenance) < new Date('2025-05-01'))
              .slice(0, 3)
              .map(a => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span>{a.name}</span>
                  <span className="text-[#da1e28]">{a.nextMaintenance}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[#f4f4f4] p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-[#da1e28]" />
            <h3 className="font-medium">Warranty Expiring</h3>
          </div>
          <div className="space-y-2">
            {mockAssets
              .filter(a => a.warrantyExpiry && new Date(a.warrantyExpiry) < new Date('2026-01-01'))
              .slice(0, 3)
              .map(a => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span>{a.name}</span>
                  <span className="text-[#9e7c0b]">{a.warrantyExpiry}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[#f4f4f4] p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-[#0f62fe]" />
            <h3 className="font-medium">Value Depreciation</h3>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Original Value:</span>
              <span className="font-medium">${(stats.totalValue / 0.75 / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex justify-between">
              <span>Current Value:</span>
              <span className="font-medium">${(stats.totalValue / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex justify-between text-[#da1e28]">
              <span>Depreciation:</span>
              <span>25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
