'use client';

import { AlertCircle, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — EXCEPTIONS HANDLING
// Budget overruns and threshold breaches requiring special approval
// ═════════════════════════════════════════════════════════════════════════════

interface Exception {
  id: string;
  requestNumber: string;
  type: 'over_budget' | 'threshold_breach' | 'emergency';
  description: string;
  amount: number;
  requestedBy: string;
  branch: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockExceptions: Exception[] = [
  { id: 'exc1', requestNumber: 'PR-0040', type: 'threshold_breach', description: 'Kitchen equipment purchase exceeds $5,000 threshold', amount: 5800, requestedBy: 'Sarah Moyo', branch: 'Avondale Shop', status: 'pending', submittedAt: '2025-03-31' },
  { id: 'exc2', requestNumber: 'PR-0038', type: 'over_budget', description: 'Cleaning supplies category over budget by $450', amount: 950, requestedBy: 'Tendai Mutasa', branch: 'Eastgate Shop', status: 'approved', submittedAt: '2025-03-28' },
  { id: 'exc3', requestNumber: 'PR-0035', type: 'emergency', description: 'Emergency refrigeration repair - over budget', amount: 3200, requestedBy: 'Linda Zimuto', branch: 'Borrowdale', status: 'approved', submittedAt: '2025-03-25' },
];

export default function ExceptionsPage() {
  const pendingCount = mockExceptions.filter(e => e.status === 'pending').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'over_budget': return <AlertCircle className="w-5 h-5 text-[#da1e28]" />;
      case 'threshold_breach': return <AlertTriangle className="w-5 h-5 text-[#F5C518]" />;
      case 'emergency': return <Clock className="w-5 h-5 text-[#0f62fe]" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Exception Handling</h1>
        <p className="text-[#6f6f6f]">Budget overruns and threshold breaches requiring special approval</p>
      </div>

      {/* Alert Banner */}
      {pendingCount > 0 && (
        <div className="bg-[#da1e28]/10 border border-[#da1e28] p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#da1e28]" />
            <span className="text-[#da1e28]">
              <strong>{pendingCount}</strong> exception request(s) pending Director approval
            </span>
          </div>
        </div>
      )}

      {/* Exceptions Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0]">
          <h2 className="font-medium">Exception Requests</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Request</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Type</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Description</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Amount</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Requestor</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {mockExceptions.map((exc) => (
              <tr key={exc.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3 font-medium">{exc.requestNumber}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(exc.type)}
                    <span className="text-sm capitalize">{exc.type.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="p-3 text-sm">{exc.description}</td>
                <td className="p-3 text-right font-medium">${exc.amount.toLocaleString()}</td>
                <td className="p-3 text-sm">
                  <div>{exc.requestedBy}</div>
                  <div className="text-[#6f6f6f]">{exc.branch}</div>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${
                    exc.status === 'approved' ? 'bg-[#24a148]/10 text-[#24a148]' :
                    exc.status === 'rejected' ? 'bg-[#da1e28]/10 text-[#da1e28]' :
                    'bg-[#F5C518]/10 text-[#9e7c0b]'
                  }`}>
                    {exc.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
