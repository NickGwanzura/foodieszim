'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Building,
  User,
  FileText,
  Clock,
  TrendingUp,
  ArrowRight,
  X
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — DIRECTOR APPROVALS
// Step 4: Approve high-value requests and exceptions
// ═════════════════════════════════════════════════════════════════════════════

interface ApprovalRequest {
  id: string;
  requestNumber: string;
  requestorName: string;
  branchName: string;
  productName: string;
  quantity: number;
  supplierName: string;
  amount: number;
  validatedBy: string;
  validatedAt: string;
  reason: string;
  thresholdReason?: string;
  exceptionDetails?: string;
  documents: string[];
}

const mockApprovals: ApprovalRequest[] = [
  { 
    id: 'app1', 
    requestNumber: 'PR-0045', 
    requestorName: 'Sarah Moyo', 
    branchName: 'Avondale Shop', 
    productName: 'Commercial Kitchen Equipment', 
    quantity: 1, 
    supplierName: 'ZimKitchen Supplies Ltd', 
    amount: 8500, 
    validatedBy: 'Grace Chikomo',
    validatedAt: '2025-04-02T10:30:00Z',
    reason: 'threshold',
    thresholdReason: 'Amount exceeds $5,000 threshold',
    documents: ['Quote.pdf', 'Justification.pdf']
  },
  { 
    id: 'app2', 
    requestNumber: 'PR-0040', 
    requestorName: 'Sarah Moyo', 
    branchName: 'Avondale Shop', 
    productName: 'Walk-in Refrigeration Unit', 
    quantity: 1, 
    supplierName: 'CoolTech Zimbabwe', 
    amount: 5800, 
    validatedBy: 'Grace Chikomo',
    validatedAt: '2025-04-01T16:00:00Z',
    reason: 'exception',
    exceptionDetails: 'Budget overrun - urgent equipment replacement required',
    documents: ['Quote.pdf', 'Incident_Report.pdf']
  },
];

const approvedHistory = [
  { id: 'hist1', requestNumber: 'PR-0038', productName: 'POS System Upgrade', amount: 4200, approvedAt: '2025-03-28', status: 'approved' },
  { id: 'hist2', requestNumber: 'PR-0035', productName: 'Emergency Roof Repair', amount: 6500, approvedAt: '2025-03-25', status: 'approved' },
  { id: 'hist3', requestNumber: 'PR-0032', productName: 'Security System', amount: 7800, approvedAt: '2025-03-20', status: 'rejected' },
];

export default function ApprovalsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>(mockApprovals);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [decisionType, setDecisionType] = useState<'approve' | 'reject' | null>(null);

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleOpenDecision = (request: ApprovalRequest, decision: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setDecisionType(decision);
    setApprovalNotes('');
    setShowApprovalModal(true);
  };

  const handleSubmitDecision = () => {
    if (!selectedRequest || !decisionType) return;

    // Update the pending approvals list
    setPendingApprovals(prev => prev.filter(r => r.id !== selectedRequest.id));
    
    setShowApprovalModal(false);
    setSelectedRequest(null);
    setDecisionType(null);
    setApprovalNotes('');

    if (decisionType === 'approve') {
      success('Request Approved', `${selectedRequest.requestNumber} has been approved and sent to supplier`);
    } else {
      success('Request Rejected', `${selectedRequest.requestNumber} has been rejected and returned`);
    }
  };

  const handleViewDocument = (docName: string) => {
    showError('Document View', `Viewing ${docName} - this would open the document viewer`);
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
              <span className="text-sm text-gray-300">Director Approvals</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{user?.name}</span>
              <div className="w-8 h-8 bg-[#161616] border border-[#F5C518] flex items-center justify-center text-[#F5C518] font-medium">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-light text-[#161616]">Pending Approvals</h1>
          <p className="text-sm text-[#6f6f6f] mt-1">High-value requests and exceptions requiring your approval</p>
        </div>

        {/* Alert Banner */}
        {pendingApprovals.length > 0 && (
          <div className="mb-6 bg-[#F5C518]/10 border border-[#F5C518] p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#9e7c0b]" />
            <span className="text-[#9e7c0b]">
              You have <strong>{pendingApprovals.length}</strong> requests requiring approval
            </span>
          </div>
        )}

        {/* Approval Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {pendingApprovals.map((req) => (
            <div key={req.id} className="bg-white border border-[#e0e0e0] p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-[#6f6f6f]">Request</div>
                  <div className="text-xl font-medium">{req.requestNumber}</div>
                </div>
                <div className={`px-3 py-1 text-xs font-medium ${
                  req.reason === 'threshold' 
                    ? 'bg-[#0f62fe]/10 text-[#0f62fe]' 
                    : 'bg-[#da1e28]/10 text-[#da1e28]'
                }`}>
                  {req.reason === 'threshold' ? 'THRESHOLD BREACH' : 'BUDGET EXCEPTION'}
                </div>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <div className="text-sm text-[#6f6f6f]">Amount</div>
                <div className="text-3xl font-light">${req.amount.toLocaleString()}</div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-[#8d8d8d]" />
                  <span>{req.branchName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-[#8d8d8d]" />
                  <span>Requestor: {req.requestorName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-[#8d8d8d]" />
                  <span>{req.productName} (Qty: {req.quantity})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#8d8d8d]" />
                  <span>Validated by: {req.validatedBy}</span>
                </div>
              </div>

              {/* Reason */}
              <div className={`p-3 mb-4 ${
                req.reason === 'threshold' 
                  ? 'bg-[#0f62fe]/5 border border-[#0f62fe]' 
                  : 'bg-[#da1e28]/5 border border-[#da1e28]'
              }`}>
                <div className="font-medium text-sm mb-1">
                  {req.reason === 'threshold' ? 'Threshold Breach' : 'Budget Exception'}
                </div>
                <p className="text-sm">
                  {req.thresholdReason || req.exceptionDetails}
                </p>
              </div>

              {/* Documents */}
              <div className="mb-4">
                <div className="text-sm text-[#6f6f6f] mb-2">Supporting Documents</div>
                <div className="flex flex-wrap gap-2">
                  {req.documents.map((doc, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleViewDocument(doc)}
                      className="text-xs px-3 py-1 border border-[#e0e0e0] hover:border-[#F5C518] flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      {doc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenDecision(req, 'approve')}
                  className="flex-1 py-2 bg-[#24a148] text-white font-medium hover:bg-[#1e8a3c] active:scale-95 transition-all"
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDecision(req, 'reject')}
                  className="flex-1 py-2 border-2 border-[#da1e28] text-[#da1e28] font-medium hover:bg-[#da1e28]/5 active:scale-95 transition-all"
                >
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
              </div>
            </div>
          ))}
          
          {pendingApprovals.length === 0 && (
            <div className="col-span-2 bg-white border border-[#e0e0e0] p-12 text-center">
              <CheckCircle className="w-16 h-16 text-[#24a148] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#161616]">All Caught Up!</h3>
              <p className="text-[#6f6f6f]">No pending approvals requiring your attention</p>
            </div>
          )}
        </div>

        {/* Approval History */}
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h2 className="text-lg font-medium">Recent Approval Decisions</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#f4f4f4]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#525252]">Request</th>
                <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Amount</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Date</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {approvedHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[#f4f4f4]">
                  <td className="p-3 font-medium">{item.requestNumber}</td>
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3 text-right">${item.amount.toLocaleString()}</td>
                  <td className="p-3 text-center text-sm">{item.approvedAt}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 ${
                      item.status === 'approved' 
                        ? 'bg-[#24a148]/10 text-[#24a148]' 
                        : 'bg-[#da1e28]/10 text-[#da1e28]'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval/Reject Modal */}
      {showApprovalModal && selectedRequest && decisionType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-lg font-medium">
                {decisionType === 'approve' ? 'Approve' : 'Reject'} Request {selectedRequest.requestNumber}
              </h2>
              <button 
                onClick={() => setShowApprovalModal(false)}
                className="p-1 hover:bg-[#f4f4f4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className={`p-4 ${decisionType === 'approve' ? 'bg-[#24a148]/5' : 'bg-[#da1e28]/5'}`}>
                <div className="text-sm text-[#6f6f6f]">Request Amount</div>
                <div className="text-2xl font-semibold">${selectedRequest.amount.toLocaleString()}</div>
                <div className="text-sm text-[#6f6f6f] mt-1">{selectedRequest.productName}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161616] mb-2">
                  {decisionType === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                  placeholder={decisionType === 'approve' ? "Add any notes for the record..." : "Explain why this request is being rejected..."}
                  className="w-full p-3 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitDecision}
                disabled={decisionType === 'reject' && !approvalNotes.trim()}
                className={`px-4 py-2 font-medium ${
                  decisionType === 'approve'
                    ? 'bg-[#24a148] text-white hover:bg-[#1e8a3c]'
                    : 'bg-[#da1e28] text-white hover:bg-[#b91c1c]'
                } disabled:bg-[#e0e0e0] disabled:text-[#a8a8a8]`}
              >
                {decisionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
