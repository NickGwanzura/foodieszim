'use client';

import { useState } from 'react';
import { 
  AlertCircle, 
  XCircle, 
  FileText,
  Clock,
  DollarSign,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — INVALID REQUEST REPORTING
// Forensic tracking of failed, rejected, or non-compliant requests
// ═════════════════════════════════════════════════════════════════════════════

type InvalidReason = 
  | 'missing_fields'
  | 'missing_supplier'
  | 'missing_receipt'
  | 'no_stock_validation'
  | 'budget_breach_unapproved'
  | 'price_deviation_unexplained'
  | 'invalid_product'
  | 'duplicate_request'
  | 'supplier_unavailable'
  | 'governance_denial';

interface InvalidRequest {
  id: string;
  requestNumber?: string;
  branchName: string;
  requestorName: string;
  productName?: string;
  type: 'standard' | 'emergency' | 'pick_n_pay' | 'adhoc';
  reason: InvalidReason;
  reasonDescription: string;
  stageFailed: string;
  failedAt: string;
  amount?: number;
  financialExposure: number;
  status: 'open' | 'under_review' | 'resolved' | 'escalated';
  resolution?: string;
  turnaroundHours?: number;
}

const mockInvalidRequests: InvalidRequest[] = [
  {
    id: 'inv1',
    requestNumber: 'PR-0035',
    branchName: 'Avondale Shop',
    requestorName: 'Sarah Moyo',
    productName: 'Kitchen Equipment',
    type: 'pick_n_pay',
    reason: 'missing_receipt',
    reasonDescription: 'Receipt not uploaded for Pick n Pay purchase exceeding $100',
    stageFailed: 'Accountant Validation',
    failedAt: '2025-04-02T10:00:00Z',
    amount: 250,
    financialExposure: 250,
    status: 'open',
  },
  {
    id: 'inv2',
    requestNumber: 'PR-0034',
    branchName: 'Eastgate Shop',
    requestorName: 'Tendai Mutasa',
    productName: 'Cooking Oil (2L)',
    type: 'standard',
    reason: 'price_deviation_unexplained',
    reasonDescription: 'Price deviation of 18% from system price without receipt or justification',
    stageFailed: 'Accountant Validation',
    failedAt: '2025-04-01T14:30:00Z',
    amount: 120,
    financialExposure: 120,
    status: 'under_review',
    turnaroundHours: 48,
  },
  {
    id: 'inv3',
    requestNumber: 'PR-0032',
    branchName: 'Borrowdale',
    requestorName: 'Linda Zimuto',
    productName: 'Emergency Repairs',
    type: 'emergency',
    reason: 'budget_breach_unapproved',
    reasonDescription: 'Request exceeds branch budget by $3,200 without Director approval',
    stageFailed: 'Accountant Validation',
    failedAt: '2025-03-31T09:15:00Z',
    amount: 8500,
    financialExposure: 8500,
    status: 'escalated',
    resolution: 'Escalated to Director for exception approval',
  },
  {
    id: 'inv4',
    requestNumber: 'PR-0030',
    branchName: 'Avondale Shop',
    requestorName: 'Sarah Moyo',
    productName: 'Cleaning Supplies',
    type: 'standard',
    reason: 'no_stock_validation',
    reasonDescription: 'Request bypassed Storesman validation - stock availability not confirmed',
    stageFailed: 'Storesman Validation',
    failedAt: '2025-03-30T11:00:00Z',
    amount: 85,
    financialExposure: 85,
    status: 'resolved',
    resolution: 'Returned to Storesman for validation',
    turnaroundHours: 24,
  },
  {
    id: 'inv5',
    requestNumber: 'PR-0028',
    branchName: 'Eastgate Shop',
    requestorName: 'Tendai Mutasa',
    productName: 'Flour (25kg)',
    type: 'standard',
    reason: 'duplicate_request',
    reasonDescription: 'Duplicate of PR-0027 submitted within 24 hours',
    stageFailed: 'System Check',
    failedAt: '2025-03-28T16:45:00Z',
    amount: 178,
    financialExposure: 0,
    status: 'resolved',
    resolution: 'Marked as duplicate and cancelled',
    turnaroundHours: 2,
  },
];

const reasonConfig: Record<InvalidReason, { label: string; color: string; icon: React.ReactNode }> = {
  missing_fields: { label: 'Missing Fields', color: 'bg-[#8d8d8d]', icon: <FileText className="w-3 h-3" /> },
  missing_supplier: { label: 'Missing Supplier', color: 'bg-[#8d8d8d]', icon: <XCircle className="w-3 h-3" /> },
  missing_receipt: { label: 'Missing Receipt', color: 'bg-[#F5C518]', icon: <FileText className="w-3 h-3" /> },
  no_stock_validation: { label: 'No Stock Validation', color: 'bg-[#0f62fe]', icon: <AlertCircle className="w-3 h-3" /> },
  budget_breach_unapproved: { label: 'Budget Breach', color: 'bg-[#da1e28]', icon: <DollarSign className="w-3 h-3" /> },
  price_deviation_unexplained: { label: 'Price Deviation', color: 'bg-[#F5C518]', icon: <TrendingUp className="w-3 h-3" /> },
  invalid_product: { label: 'Invalid Product', color: 'bg-[#8d8d8d]', icon: <XCircle className="w-3 h-3" /> },
  duplicate_request: { label: 'Duplicate', color: 'bg-[#6929c4]', icon: <FileText className="w-3 h-3" /> },
  supplier_unavailable: { label: 'Supplier Unavailable', color: 'bg-[#0f62fe]', icon: <XCircle className="w-3 h-3" /> },
  governance_denial: { label: 'Governance Denial', color: 'bg-[#da1e28]', icon: <AlertTriangle className="w-3 h-3" /> },
};

const statusConfig = {
  open: { label: 'Open', color: 'bg-[#da1e28]/10 text-[#da1e28]' },
  under_review: { label: 'Under Review', color: 'bg-[#F5C518]/10 text-[#9e7c0b]' },
  resolved: { label: 'Resolved', color: 'bg-[#24a148]/10 text-[#24a148]' },
  escalated: { label: 'Escalated', color: 'bg-[#6929c4]/10 text-[#6929c4]' },
};

export default function InvalidRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReason, setFilterReason] = useState<InvalidReason | ''>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredRequests = mockInvalidRequests.filter(req => {
    const matchesSearch = 
      req.requestNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReason = !filterReason || req.reason === filterReason;
    const matchesStatus = !filterStatus || req.status === filterStatus;
    return matchesSearch && matchesReason && matchesStatus;
  });

  // Analytics
  const stats = {
    total: mockInvalidRequests.length,
    open: mockInvalidRequests.filter(r => r.status === 'open').length,
    escalated: mockInvalidRequests.filter(r => r.status === 'escalated').length,
    totalExposure: mockInvalidRequests.reduce((sum, r) => sum + r.financialExposure, 0),
    avgTurnaround: Math.round(
      mockInvalidRequests
        .filter(r => r.turnaroundHours)
        .reduce((sum, r) => sum + (r.turnaroundHours || 0), 0) / 
      mockInvalidRequests.filter(r => r.turnaroundHours).length
    ),
  };

  const byReason = mockInvalidRequests.reduce((acc, req) => {
    acc[req.reason] = (acc[req.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Invalid Request Reporting</h1>
          <p className="text-[#6f6f6f]">Forensic tracking of failed, rejected, or non-compliant requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#161616] text-white hover:bg-[#333]">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Invalid</div>
          <div className="text-2xl font-semibold text-[#161616]">{stats.total}</div>
        </div>
        <div className="bg-white border border-[#da1e28] p-4">
          <div className="text-sm text-[#da1e28]">Open</div>
          <div className="text-2xl font-semibold text-[#da1e28]">{stats.open}</div>
        </div>
        <div className="bg-white border border-[#6929c4] p-4">
          <div className="text-sm text-[#6929c4]">Escalated</div>
          <div className="text-2xl font-semibold text-[#6929c4]">{stats.escalated}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Financial Exposure</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">${stats.totalExposure.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Avg Turnaround</div>
          <div className="text-2xl font-semibold text-[#161616]">{stats.avgTurnaround}h</div>
        </div>
      </div>

      {/* Reason Breakdown */}
      <div className="bg-white border border-[#e0e0e0] p-4">
        <h3 className="text-sm font-medium mb-3">Breakdown by Reason</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(byReason).map(([reason, count]) => {
            const config = reasonConfig[reason as InvalidReason];
            return (
              <div key={reason} className="flex items-center gap-2 px-3 py-2 bg-[#f4f4f4]">
                <span className={`w-2 h-2 rounded-full ${config.color}`} />
                <span className="text-sm">{config.label}</span>
                <span className="text-sm font-medium">({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search invalid requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
        <select
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value as InvalidReason | '')}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Reasons</option>
          {Object.entries(reasonConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="escalated">Escalated</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Invalid Requests Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Request</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Reason</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Failed At</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Amount</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Turnaround</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filteredRequests.map((req) => {
              const reasonCfg = reasonConfig[req.reason];
              const statusCfg = statusConfig[req.status];
              return (
                <tr key={req.id} className="hover:bg-[#f4f4f4]">
                  <td className="p-3">
                    <div className="font-medium">{req.requestNumber || 'N/A'}</div>
                    <div className="text-xs text-[#6f6f6f]">{req.productName}</div>
                    <div className="text-xs text-[#8d8d8d]">{req.branchName} • {req.requestorName}</div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 text-white ${reasonCfg.color}`}>
                      {reasonCfg.icon}
                      {reasonCfg.label}
                    </span>
                    <div className="text-xs text-[#6f6f6f] mt-1 max-w-xs">{req.reasonDescription}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">{req.stageFailed}</div>
                    <div className="text-xs text-[#6f6f6f]">{new Date(req.failedAt).toLocaleDateString()}</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-medium">${req.amount?.toLocaleString() || 'N/A'}</div>
                    {req.financialExposure > 0 && (
                      <div className="text-xs text-[#da1e28]">Exposure: ${req.financialExposure}</div>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    {req.resolution && (
                      <div className="text-xs text-[#6f6f6f] mt-1 max-w-xs">{req.resolution}</div>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {req.turnaroundHours ? (
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Clock className="w-3 h-3 text-[#8d8d8d]" />
                        {req.turnaroundHours}h
                      </div>
                    ) : (
                      <span className="text-xs text-[#6f6f6f]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredRequests.length === 0 && (
          <div className="p-12 text-center text-[#6f6f6f]">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[#24a148]" />
            <p>No invalid requests found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
