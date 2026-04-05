'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useModal } from '@/lib/modal-context';
import { useToast } from '@/lib/toast-context';
import { 
  PurchaseRequest,
  PriceDeviation,
  Product,
  DeliveryReceipt,
} from '@/types';
import { 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Upload,
  X,
  Search,
  Filter,
  Download,
  Eye,
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// PRICE DEVIATIONS PAGE — Accountant Review
// ═════════════════════════════════════════════════════════════════════════════

interface MockProduct extends Product {
  unitPrice: number;
  sku: string;
  supplierId: string;
}

const MOCK_PRODUCTS: MockProduct[] = [
  { id: 'p1', name: 'Cooking Oil 5L', category: 'oil', categoryId: 'cat1', unit: '5L', unitPrice: 45.00, sku: 'OIL-5L', supplierId: 's1', isActive: true, createdAt: '2025-01-01' },
  { id: 'p2', name: 'Sugar 2kg', category: 'sugar', categoryId: 'cat2', unit: '2kg', unitPrice: 12.50, sku: 'SUG-2KG', supplierId: 's1', isActive: true, createdAt: '2025-01-01' },
  { id: 'p3', name: 'Flour 10kg', category: 'flour', categoryId: 'cat3', unit: '10kg', unitPrice: 28.00, sku: 'FLO-10KG', supplierId: 's2', isActive: true, createdAt: '2025-01-01' },
];

const MOCK_DEVIATIONS: PriceDeviation[] = [
  {
    id: 'dev1',
    requestId: 'REQ-2025-002',
    productId: 'p2',
    productName: 'Sugar 2kg',
    systemPrice: 11.50,
    actualPrice: 12.50,
    variancePercent: 8.7,
    varianceAmount: 1.00,
    costImpact: 20.00,
    supplierId: 's1',
    supplierName: 'Supplier A',
    reason: 'Market price increase due to supply shortage',
    status: 'pending_review',
    createdAt: '2025-01-14T14:20:00Z',
    createdBy: 'system',
  },
  {
    id: 'dev2',
    requestId: 'REQ-2025-008',
    productId: 'p1',
    productName: 'Cooking Oil 5L',
    systemPrice: 42.00,
    actualPrice: 48.00,
    variancePercent: 14.3,
    varianceAmount: 6.00,
    costImpact: 60.00,
    supplierId: 's2',
    supplierName: 'Pick n Pay',
    reason: 'Supplier price adjustment - Pick n Pay purchase',
    receiptUrl: '#',
    status: 'pending_review',
    createdAt: '2025-01-15T10:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'dev3',
    requestId: 'REQ-2025-009',
    productId: 'p3',
    productName: 'Flour 10kg',
    systemPrice: 28.00,
    actualPrice: 29.50,
    variancePercent: 5.4,
    varianceAmount: 1.50,
    costImpact: 7.50,
    supplierId: 's1',
    supplierName: 'Supplier A',
    reason: 'Standard price adjustment',
    status: 'approved',
    reviewedBy: 'Jane Smith',
    reviewedAt: '2025-01-13T16:30:00Z',
    createdAt: '2025-01-13T14:00:00Z',
    createdBy: 'system',
  },
];

// Mock receipts for display
interface MockReceipt {
  id: string;
  requestId: string;
  filename: string;
  storeName: string;
  totalAmount: number;
  uploadedAt: string;
  uploadedBy: string;
}

const MOCK_RECEIPTS: Record<string, MockReceipt> = {
  'rec1': {
    id: 'rec1',
    requestId: 'REQ-2025-008',
    filename: 'pick_n_pay_receipt_001.pdf',
    storeName: 'Pick n Pay',
    totalAmount: 48.00,
    uploadedAt: '2025-01-15T10:00:00Z',
    uploadedBy: 'Accountant',
  },
};

export default function DeviationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { confirm, openModal } = useModal();
  const { success, error: showError, info } = useToast();

  const [deviations, setDeviations] = useState<PriceDeviation[]>(MOCK_DEVIATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDeviation, setSelectedDeviation] = useState<PriceDeviation | null>(null);

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const getProductName = (productId: string) => {
    return MOCK_PRODUCTS.find(p => p.id === productId)?.name || productId;
  };

  // Check if receipt is required for a deviation
  const isReceiptRequired = (deviation: PriceDeviation): boolean => {
    // Receipt required if: Pick n Pay purchase OR variance > 5%
    const isPicknPay = deviation.supplierName?.toLowerCase().includes('pick n pay');
    const isHighVariance = deviation.variancePercent > 5;
    return isPicknPay || isHighVariance;
  };

  // Check if receipt is uploaded
  const hasReceipt = (deviation: PriceDeviation): boolean => {
    return !!deviation.receiptUrl;
  };

  // Filter deviations
  const filteredDeviations = useMemo(() => {
    return deviations.filter(dev => {
      const matchesSearch = 
        dev.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getProductName(dev.productId).toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.supplierName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || dev.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [deviations, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: deviations.length,
    pending: deviations.filter(d => d.status === 'pending_review').length,
    approved: deviations.filter(d => d.status === 'approved').length,
    rejected: deviations.filter(d => d.status === 'rejected').length,
    totalCostImpact: deviations.reduce((sum, d) => sum + d.costImpact, 0),
    pendingReceipts: deviations.filter(d => isReceiptRequired(d) && !hasReceipt(d)).length,
  }), [deviations]);

  // Handle approve deviation
  const handleApproveDeviation = (deviation: PriceDeviation) => {
    if (isReceiptRequired(deviation) && !hasReceipt(deviation)) {
      showError('Receipt Required', 'This deviation requires a receipt before approval');
      return;
    }

    confirm({
      title: 'Approve Deviation?',
      message: `Approve ${deviation.variancePercent.toFixed(1)}% variance for ${getProductName(deviation.productId)}? This will notify the Director.`,
      confirmLabel: 'Approve',
      onConfirm: () => {
        setDeviations(prev => prev.map(d => 
          d.id === deviation.id 
            ? { ...d, status: 'approved', reviewedBy: user?.name, reviewedAt: new Date().toISOString() }
            : d
        ));
        success('Deviation Approved', `Variance for ${getProductName(deviation.productId)} has been approved`);
      },
    });
  };

  // Handle reject deviation
  const handleRejectDeviation = (deviation: PriceDeviation) => {
    openModal({
      type: 'form',
      title: 'Reject Deviation',
      size: 'md',
      content: (
        <div className="space-y-4">
          <p className="text-[#6f6f6f]">
            Rejecting variance of <strong>{deviation.variancePercent.toFixed(1)}%</strong> for{' '}
            <strong>{getProductName(deviation.productId)}</strong>
          </p>
          <textarea
            id="rejection-reason"
            rows={3}
            className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none resize-none"
            placeholder="Enter rejection reason..."
          />
        </div>
      ),
      confirmLabel: 'Reject',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        const reason = (document.getElementById('rejection-reason') as HTMLTextAreaElement)?.value;
        setDeviations(prev => prev.map(d => 
          d.id === deviation.id 
            ? { ...d, status: 'rejected', reason: reason || d.reason, reviewedBy: user?.name, reviewedAt: new Date().toISOString() }
            : d
        ));
        success('Deviation Rejected', `Variance for ${getProductName(deviation.productId)} has been rejected`);
      },
    });
  };

  // Handle upload receipt
  const handleUploadReceipt = (deviation: PriceDeviation) => {
    setSelectedDeviation(deviation);
    setShowUploadModal(true);
  };

  const handleSubmitReceipt = () => {
    if (!selectedDeviation) return;

    const fileInput = document.getElementById('receipt-file') as HTMLInputElement;
    const storeName = (document.getElementById('store-name') as HTMLInputElement)?.value;
    const totalAmount = parseFloat((document.getElementById('receipt-amount') as HTMLInputElement)?.value || '0');

    if (!fileInput?.files?.length) {
      showError('File Required', 'Please select a receipt file to upload');
      return;
    }

    setDeviations(prev => prev.map(d => 
      d.id === selectedDeviation.id 
        ? { ...d, receiptUrl: '#uploaded' }
        : d
    ));

    setShowUploadModal(false);
    setSelectedDeviation(null);
    success('Receipt Uploaded', 'Receipt has been uploaded and is pending verification');
  };

  // View receipt details
  const handleViewReceipt = (deviation: PriceDeviation) => {
    const receipt = MOCK_RECEIPTS['rec1']; // In real app, fetch by deviation id
    if (!receipt) return;

    openModal({
      type: 'form',
      title: 'Receipt Details',
      size: 'md',
      content: (
        <div className="space-y-4">
          <div className="bg-[#f4f4f4] p-4 border border-[#e0e0e0]">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#6f6f6f]">Store:</span>
                <p className="font-medium">{receipt.storeName}</p>
              </div>
              <div>
                <span className="text-[#6f6f6f]">Amount:</span>
                <p className="font-medium">${receipt.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-[#6f6f6f]">Uploaded By:</span>
                <p className="font-medium">{receipt.uploadedBy}</p>
              </div>
              <div>
                <span className="text-[#6f6f6f]">Date:</span>
                <p className="font-medium">{new Date(receipt.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#e8f5e9] border border-[#4caf50]">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#4caf50]" />
              <span className="font-medium text-[#2e7d32]">{receipt.filename}</span>
            </div>
            <button
              onClick={() => info('Download', 'Downloading receipt...')}
              className="flex items-center gap-1 text-sm text-[#0f62fe] hover:underline"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      ),
      confirmLabel: 'Close',
    });
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
              <span className="text-sm text-gray-300">Price Deviations</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{user?.name}</span>
              <div className="w-8 h-8 bg-[#24a148] flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-light text-[#161616]">Price Deviation Tracking</h1>
          <p className="text-sm text-[#6f6f6f] mt-1">Monitor and approve price variances exceeding 5% threshold</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#161616]">{stats.total}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Total Deviations</div>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#9e6b00]">{stats.pending}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Pending Review</div>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#24a148]">{stats.approved}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Approved</div>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#da1e28]">{stats.rejected}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Rejected</div>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#da1e28]">${stats.totalCostImpact.toFixed(2)}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Total Cost Impact</div>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#0f62fe]">{stats.pendingReceipts}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Receipts Pending</div>
          </div>
        </div>

        {/* Receipt Rules Alert */}
        <div className="mb-6 bg-[#fff8e1] border border-[#F5C518] p-4">
          <h3 className="font-medium text-[#9e6b00] mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Receipt Rules
          </h3>
          <ul className="text-sm text-[#161616] space-y-1 ml-5 list-disc">
            <li><strong>Pick n Pay purchases:</strong> Receipt always required</li>
            <li><strong>Ad-hoc purchases:</strong> Receipt required</li>
            <li><strong>Variance &gt;5%:</strong> Receipt required for Director approval</li>
            <li><strong>Missing receipt:</strong> Will trigger Director escalation</li>
          </ul>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#e0e0e0] p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, product, or supplier..."
                  className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending_review">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Deviations Table */}
        <div className="bg-white border border-[#e0e0e0]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0e0e0] bg-[#f4f4f4]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Request</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">System → Actual</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Variance</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Cost Impact</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Receipt</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeviations.map((deviation) => (
                  <tr key={deviation.id} className="border-b border-[#e0e0e0] hover:bg-[#f4f4f4]">
                    <td className="px-4 py-3 font-medium">{deviation.requestId}</td>
                    <td className="px-4 py-3">{getProductName(deviation.productId)}</td>
                    <td className="px-4 py-3">{deviation.supplierName}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <span className="text-[#6f6f6f]">${deviation.systemPrice.toFixed(2)}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">${deviation.actualPrice.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`font-medium ${
                        deviation.variancePercent > 10 ? 'text-[#da1e28]' : 'text-[#9e6b00]'
                      }`}>
                        +{deviation.variancePercent.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">${deviation.costImpact.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {isReceiptRequired(deviation) ? (
                        hasReceipt(deviation) ? (
                          <button
                            onClick={() => handleViewReceipt(deviation)}
                            className="inline-flex items-center gap-1 text-xs text-[#24a148] hover:underline"
                          >
                            <CheckCircle className="w-3 h-3" />
                            View Receipt
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#da1e28]">
                            <AlertTriangle className="w-3 h-3" />
                            Required
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-[#525252]">Not Required</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium ${
                        deviation.status === 'approved' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                        deviation.status === 'rejected' ? 'bg-[#ffebee] text-[#c62828]' :
                        'bg-[#fff8e1] text-[#9e6b00]'
                      }`}>
                        {deviation.status === 'pending_review' ? 'Pending' : 
                          deviation.status.charAt(0).toUpperCase() + deviation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {deviation.status === 'pending_review' && (
                          <>
                            {isReceiptRequired(deviation) && !hasReceipt(deviation) && (
                              <button
                                onClick={() => handleUploadReceipt(deviation)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#0f62fe] text-white text-sm hover:bg-[#0043ce]"
                              >
                                <Upload className="w-3 h-3" />
                                Upload
                              </button>
                            )}
                            {(!isReceiptRequired(deviation) || hasReceipt(deviation)) && (
                              <>
                                <button
                                  onClick={() => handleApproveDeviation(deviation)}
                                  className="p-1.5 bg-[#24a148] text-white hover:bg-[#1e8a3c]"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectDeviation(deviation)}
                                  className="p-1.5 bg-[#da1e28] text-white hover:bg-[#b91c1c]"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </>
                        )}
                        {deviation.status !== 'pending_review' && hasReceipt(deviation) && (
                          <button
                            onClick={() => handleViewReceipt(deviation)}
                            className="p-1.5 bg-[#f4f4f4] hover:bg-[#e0e0e0]"
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4 text-[#525252]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDeviations.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-[#6f6f6f]">
                      No deviations found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Receipt Modal */}
      {showUploadModal && selectedDeviation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative bg-white w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0]">
              <h3 className="text-lg font-medium text-[#161616]">Upload Receipt</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-[#f4f4f4] rounded"
              >
                <X className="w-5 h-5 text-[#525252]" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-[#f4f4f4] p-3">
                <p className="text-sm text-[#6f6f6f]">
                  Uploading receipt for <strong>{getProductName(selectedDeviation.productId)}</strong>
                  <br />
                  Expected amount: <strong>${selectedDeviation.actualPrice.toFixed(2)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Store Name</label>
                <input
                  id="store-name"
                  type="text"
                  defaultValue={selectedDeviation.supplierName}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none"
                  placeholder="Enter store name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Receipt Amount</label>
                <input
                  id="receipt-amount"
                  type="number"
                  step="0.01"
                  defaultValue={selectedDeviation.actualPrice}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">Receipt File</label>
                <input
                  id="receipt-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none"
                />
                <p className="text-xs text-[#6f6f6f] mt-1">
                  Supported formats: PDF, JPG, PNG (max 5MB)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-[#e0e0e0]">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReceipt}
                className="px-4 py-2 bg-[#F5C518] text-[#161616] hover:bg-[#e5b518]"
              >
                Upload Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
