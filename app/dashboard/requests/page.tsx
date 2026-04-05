'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — MY REQUESTS
// Shop Manager view of their purchase requests
// ═════════════════════════════════════════════════════════════════════════════

interface Request {
  id: string;
  requestNumber: string;
  createdAt: string;
  productName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'funds_released';
  supplierName: string;
}

const mockRequests: Request[] = [
  { id: 'req1', requestNumber: 'PR-0045', createdAt: '2025-04-02', productName: 'Cooking Oil (2L)', amount: 99, status: 'pending', supplierName: 'MegaFood Distributors' },
  { id: 'req2', requestNumber: 'PR-0044', createdAt: '2025-04-01', productName: 'Flour (25kg)', amount: 178, status: 'approved', supplierName: 'MegaFood Distributors' },
  { id: 'req3', requestNumber: 'PR-0043', createdAt: '2025-03-31', productName: 'Cleaning Detergent', amount: 42.50, status: 'funds_released', supplierName: 'ProClean Zimbabwe' },
  { id: 'req4', requestNumber: 'PR-0042', createdAt: '2025-03-28', productName: 'Paper Towels', amount: 120, status: 'funds_released', supplierName: 'ProClean Zimbabwe' },
  { id: 'req5', requestNumber: 'PR-0041', createdAt: '2025-03-25', productName: 'LPG Gas (48kg)', amount: 285, status: 'funds_released', supplierName: 'Zimbabwe Gas Supplies' },
];

const statusConfig = {
  pending: { icon: Clock, color: 'text-[#0f62fe]', bg: 'bg-[#0f62fe]/10', label: 'Pending Review' },
  approved: { icon: CheckCircle, color: 'text-[#F5C518]', bg: 'bg-[#F5C518]/20', label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-[#da1e28]', bg: 'bg-[#da1e28]/10', label: 'Rejected' },
  funds_released: { icon: CheckCircle, color: 'text-[#24a148]', bg: 'bg-[#24a148]/10', label: 'Completed' },
};

export default function RequestsPage() {
  const { user } = useAuth();

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved' || r.status === 'funds_released').length,
    rejected: mockRequests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">My Requests</h1>
          <p className="text-[#6f6f6f]">Track and manage your purchase requests</p>
        </div>
        <Link 
          href="/dashboard/requests/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Total Requests</p>
              <p className="text-2xl font-semibold text-[#161616]">{stats.total}</p>
            </div>
            <div className="p-2 bg-[#F5C518]/10 text-[#F5C518]">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Pending</p>
              <p className="text-2xl font-semibold text-[#0f62fe]">{stats.pending}</p>
            </div>
            <div className="p-2 bg-[#0f62fe]/10 text-[#0f62fe]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Approved</p>
              <p className="text-2xl font-semibold text-[#24a148]">{stats.approved}</p>
            </div>
            <div className="p-2 bg-[#24a148]/10 text-[#24a148]">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Rejected</p>
              <p className="text-2xl font-semibold text-[#da1e28]">{stats.rejected}</p>
            </div>
            <div className="p-2 bg-[#da1e28]/10 text-[#da1e28]">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0]">
          <h2 className="font-medium">All Requests</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Request ID</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Date</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Supplier</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Amount</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {mockRequests.map((request) => {
              const status = statusConfig[request.status];
              const StatusIcon = status.icon;
              return (
                <tr key={request.id} className="hover:bg-[#f4f4f4]">
                  <td className="p-3">
                    <code className="text-xs text-[#0f62fe]">{request.requestNumber}</code>
                  </td>
                  <td className="p-3 text-sm">{request.createdAt}</td>
                  <td className="p-3 text-sm">{request.productName}</td>
                  <td className="p-3 text-sm">{request.supplierName}</td>
                  <td className="p-3 text-right font-medium">${request.amount.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button className="text-sm text-[#0f62fe] hover:underline">View</button>
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
