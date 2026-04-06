'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle, FileText, Eye } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — RECEIPT REVIEW (ACCOUNTANT MODULE)
// Validate delivery receipts and flag price deviations
// ═════════════════════════════════════════════════════════════════════════════

type ReceiptStatus = 'pending' | 'validated' | 'rejected' | 'missing';

interface Receipt {
  id: string;
  requestNumber: string;
  supplierName: string;
  amount: number;
  expectedAmount: number;
  receiptDate: string;
  uploadedBy: string;
  uploadedAt: string;
  status: ReceiptStatus;
  hasDeviation: boolean;
  deviationPercent?: number;
  notes?: string;
}

const mockReceipts: Receipt[] = [
  { id: 'rc1', requestNumber: 'PR-0045', supplierName: 'MegaFood Distributors', amount: 99.00, expectedAmount: 99.00, receiptDate: '2025-04-02', uploadedBy: 'John Ncube', uploadedAt: '2025-04-02T14:30:00Z', status: 'pending', hasDeviation: false },
  { id: 'rc2', requestNumber: 'PR-0044', supplierName: 'ZimKitchen Supplies Ltd', amount: 215.50, expectedAmount: 200.00, receiptDate: '2025-04-02', uploadedBy: 'Peter Dube', uploadedAt: '2025-04-02T10:00:00Z', status: 'pending', hasDeviation: true, deviationPercent: 7.8 },
  { id: 'rc3', requestNumber: 'PR-0043', supplierName: 'Zimbabwe Gas Supplies', amount: 780.00, expectedAmount: 780.00, receiptDate: '2025-04-01', uploadedBy: 'John Ncube', uploadedAt: '2025-04-01T16:00:00Z', status: 'validated', hasDeviation: false },
  { id: 'rc4', requestNumber: 'PR-0042', supplierName: 'ProClean Zimbabwe', amount: 94.80, expectedAmount: 94.80, receiptDate: '2025-04-01', uploadedBy: 'Peter Dube', uploadedAt: '2025-04-01T11:00:00Z', status: 'validated', hasDeviation: false },
  { id: 'rc5', requestNumber: 'PR-0041', supplierName: 'Premium Meats', amount: 360.00, expectedAmount: 340.00, receiptDate: '2025-03-31', uploadedBy: 'John Ncube', uploadedAt: '2025-03-31T14:00:00Z', status: 'pending', hasDeviation: true, deviationPercent: 5.9 },
  { id: 'rc6', requestNumber: 'PR-0040', supplierName: 'ZimKitchen Supplies Ltd', amount: 0, expectedAmount: 450.00, receiptDate: '', uploadedBy: '', uploadedAt: '', status: 'missing', hasDeviation: false },
  { id: 'rc7', requestNumber: 'PR-0039', supplierName: 'ProClean Zimbabwe', amount: 180.00, expectedAmount: 200.00, receiptDate: '2025-03-30', uploadedBy: 'John Ncube', uploadedAt: '2025-03-30T09:00:00Z', status: 'rejected', hasDeviation: true, deviationPercent: -10.0, notes: 'Receipt amount does not match approved amount — partial delivery' },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function ReceiptsPage() {
  const { success, warning } = useToast();
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewingId, setViewingId] = useState<string | null>(null);

  const filtered = receipts.filter(r => {
    const matchesSearch =
      r.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: receipts.filter(r => r.status === 'pending').length,
    validated: receipts.filter(r => r.status === 'validated').length,
    missing: receipts.filter(r => r.status === 'missing').length,
    withDeviation: receipts.filter(r => r.hasDeviation && r.status === 'pending').length,
  };

  const handleValidate = (id: string) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'validated' } : r));
    setViewingId(null);
    success('Receipt Validated', 'Receipt has been approved and request can proceed to payment.');
  };

  const handleReject = (id: string) => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', notes: 'Receipt rejected by accountant — investigation required.' } : r));
    setViewingId(null);
    warning('Receipt Rejected', 'Receipt has been rejected. The storesman will be notified.');
  };

  const getStatusIcon = (status: ReceiptStatus) => {
    switch (status) {
      case 'validated': return <CheckCircle className="w-5 h-5 text-[#24a148] mx-auto" />;
      case 'rejected':  return <XCircle className="w-5 h-5 text-[#da1e28] mx-auto" />;
      case 'missing':   return <AlertCircle className="w-5 h-5 text-[#9e7c0b] mx-auto" />;
      default:          return <FileText className="w-5 h-5 text-[#0f62fe] mx-auto" />;
    }
  };

  const getStatusColor = (status: ReceiptStatus) => {
    switch (status) {
      case 'validated': return 'bg-[#24a148]/10 text-[#24a148]';
      case 'rejected':  return 'bg-[#da1e28]/10 text-[#da1e28]';
      case 'missing':   return 'bg-[#F5C518]/10 text-[#9e7c0b]';
      default:          return 'bg-[#0f62fe]/10 text-[#0f62fe]';
    }
  };

  const viewingReceipt = receipts.find(r => r.id === viewingId);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Receipt Review</h1>
        <p className="text-[#6f6f6f]">Validate delivery receipts and investigate price deviations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#0f62fe] p-4">
          <div className="text-sm text-[#0f62fe]">Pending Review</div>
          <div className="text-2xl font-semibold text-[#0f62fe]">{stats.pending}</div>
        </div>
        <div className="bg-white border border-[#da1e28] p-4">
          <div className="text-sm text-[#da1e28]">With Deviation</div>
          <div className="text-2xl font-semibold text-[#da1e28]">{stats.withDeviation}</div>
        </div>
        <div className="bg-white border border-[#F5C518] p-4">
          <div className="text-sm text-[#9e7c0b]">Missing Receipts</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">{stats.missing}</div>
        </div>
        <div className="bg-white border border-[#24a148] p-4">
          <div className="text-sm text-[#24a148]">Validated</div>
          <div className="text-2xl font-semibold text-[#24a148]">{stats.validated}</div>
        </div>
      </div>

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
          <option value="pending">Pending</option>
          <option value="validated">Validated</option>
          <option value="rejected">Rejected</option>
          <option value="missing">Missing</option>
        </select>
      </div>

      {/* Receipts Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Request</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Supplier</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Expected</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Actual</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Deviation</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Date</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filtered.map((receipt) => (
              <tr key={receipt.id} className={`hover:bg-[#f4f4f4] ${receipt.hasDeviation && receipt.status === 'pending' ? 'bg-[#da1e28]/5' : ''}`}>
                <td className="p-3 font-medium">{receipt.requestNumber}</td>
                <td className="p-3 text-sm">{receipt.supplierName}</td>
                <td className="p-3 text-right text-sm">
                  {receipt.status !== 'missing' ? formatCurrency(receipt.expectedAmount) : '—'}
                </td>
                <td className="p-3 text-right">
                  {receipt.status === 'missing' ? (
                    <span className="text-sm text-[#9e7c0b] font-medium">NOT UPLOADED</span>
                  ) : (
                    <span className="font-medium">{formatCurrency(receipt.amount)}</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {receipt.deviationPercent !== undefined ? (
                    <span className={`text-xs font-medium ${receipt.deviationPercent > 0 ? 'text-[#da1e28]' : 'text-[#24a148]'}`}>
                      {receipt.deviationPercent > 0 ? '+' : ''}{receipt.deviationPercent.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-[#6f6f6f] text-xs">—</span>
                  )}
                </td>
                <td className="p-3 text-center text-sm text-[#6f6f6f]">
                  {receipt.receiptDate || '—'}
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${getStatusColor(receipt.status)}`}>
                    {receipt.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {receipt.status === 'pending' && (
                    <button
                      onClick={() => setViewingId(receipt.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-[#F5C518] text-[#161616] hover:bg-[#e5b518] mx-auto"
                    >
                      <Eye className="w-3 h-3" /> Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Review Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-lg font-medium">Review Receipt — {viewingReceipt.requestNumber}</h2>
              <button onClick={() => setViewingId(null)} className="p-1 hover:bg-[#f4f4f4]">
                <XCircle className="w-5 h-5 text-[#525252]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f4f4f4] p-3">
                  <div className="text-xs text-[#6f6f6f]">Supplier</div>
                  <div className="font-medium">{viewingReceipt.supplierName}</div>
                </div>
                <div className="bg-[#f4f4f4] p-3">
                  <div className="text-xs text-[#6f6f6f]">Receipt Date</div>
                  <div className="font-medium">{viewingReceipt.receiptDate}</div>
                </div>
                <div className="bg-[#f4f4f4] p-3">
                  <div className="text-xs text-[#6f6f6f]">Expected Amount</div>
                  <div className="font-medium">{formatCurrency(viewingReceipt.expectedAmount)}</div>
                </div>
                <div className={`p-3 ${viewingReceipt.hasDeviation ? 'bg-[#da1e28]/10 border border-[#da1e28]' : 'bg-[#f4f4f4]'}`}>
                  <div className="text-xs text-[#6f6f6f]">Actual Amount</div>
                  <div className={`font-medium ${viewingReceipt.hasDeviation ? 'text-[#da1e28]' : ''}`}>
                    {formatCurrency(viewingReceipt.amount)}
                    {viewingReceipt.hasDeviation && viewingReceipt.deviationPercent && (
                      <span className="ml-2 text-xs">({viewingReceipt.deviationPercent > 0 ? '+' : ''}{viewingReceipt.deviationPercent.toFixed(1)}%)</span>
                    )}
                  </div>
                </div>
              </div>

              {viewingReceipt.hasDeviation && (
                <div className="bg-[#da1e28]/10 border border-[#da1e28] p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#da1e28] shrink-0 mt-0.5" />
                    <div className="text-sm text-[#da1e28]">
                      <strong>Price Deviation Detected.</strong> The actual receipt amount differs from the approved amount. Validate only if the deviation is explained and within acceptable limits.
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm text-[#6f6f6f]">
                <span>Uploaded by </span>
                <span className="font-medium">{viewingReceipt.uploadedBy}</span>
                <span> on {new Date(viewingReceipt.uploadedAt).toLocaleDateString()}</span>
              </div>

              {/* Placeholder receipt image */}
              <div className="border-2 border-dashed border-[#e0e0e0] p-8 text-center">
                <FileText className="w-10 h-10 text-[#8d8d8d] mx-auto mb-2" />
                <p className="text-sm text-[#6f6f6f]">Receipt document preview</p>
                <p className="text-xs text-[#8d8d8d] mt-1">{viewingReceipt.requestNumber}_receipt.pdf</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                onClick={() => handleReject(viewingReceipt.id)}
                className="px-4 py-2 border border-[#da1e28] text-[#da1e28] hover:bg-[#da1e28]/5 text-sm"
              >
                Reject Receipt
              </button>
              <button
                onClick={() => handleValidate(viewingReceipt.id)}
                className="px-4 py-2 bg-[#24a148] text-white font-medium hover:bg-[#1e8a3c] text-sm"
              >
                Validate Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
