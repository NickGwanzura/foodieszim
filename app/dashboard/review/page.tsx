'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  User,
  Building,
  ArrowRight
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — ACCOUNTANT REVIEW QUEUE
// Step 2: Validate requests (budget + compliance) before approval chain
// ═════════════════════════════════════════════════════════════════════════════

interface ReviewRequest {
  id: string;
  requestNumber: string;
  requestorName: string;
  branchName: string;
  productName: string;
  quantity: number;
  supplierName: string;
  amount: number;
  budgetStatus: 'within' | 'at_limit' | 'over';
  urgency: 'normal' | 'high' | 'urgent';
  submittedAt: string;
  daysPending: number;
  hasAttachments: boolean;
  exception?: string;
}

const mockReviewQueue: ReviewRequest[] = [
  { id: 'req1', requestNumber: 'PR-0045', requestorName: 'Sarah Moyo', branchName: 'Avondale Shop', productName: 'Cooking Oil (2L)', quantity: 20, supplierName: 'MegaFood Distributors', amount: 2500, budgetStatus: 'at_limit', urgency: 'high', submittedAt: '2025-04-02T09:00:00Z', daysPending: 1, hasAttachments: true },
  { id: 'req2', requestNumber: 'PR-0044', requestorName: 'Tendai Mutasa', branchName: 'Eastgate Shop', productName: 'Flour (25kg)', quantity: 10, supplierName: 'MegaFood Distributors', amount: 850, budgetStatus: 'within', urgency: 'normal', submittedAt: '2025-04-01T14:30:00Z', daysPending: 2, hasAttachments: true },
  { id: 'req3', requestNumber: 'PR-0043', requestorName: 'Linda Zimuto', branchName: 'Borrowdale', productName: 'Emergency Generator Repair', quantity: 1, supplierName: 'PowerTech Services', amount: 3200, budgetStatus: 'over', urgency: 'urgent', submittedAt: '2025-04-02T07:15:00Z', daysPending: 1, hasAttachments: false, exception: 'Emergency repair - budget overrun approved' },
  { id: 'req4', requestNumber: 'PR-0042', requestorName: 'Sarah Moyo', branchName: 'Avondale Shop', productName: 'Paper Towels', quantity: 10, supplierName: 'ProClean Zimbabwe', amount: 320, budgetStatus: 'within', urgency: 'normal', submittedAt: '2025-04-01T10:00:00Z', daysPending: 2, hasAttachments: true },
  { id: 'req5', requestNumber: 'PR-0041', requestorName: 'Peter Moyo', branchName: 'Westgate', productName: 'Chicken Breast (10kg)', quantity: 15, supplierName: 'Premium Meats', amount: 1800, budgetStatus: 'within', urgency: 'high', submittedAt: '2025-04-01T16:45:00Z', daysPending: 2, hasAttachments: true },
  { id: 'req6', requestNumber: 'PR-0040', requestorName: 'Sarah Moyo', branchName: 'Avondale Shop', productName: 'Kitchen Equipment', quantity: 1, supplierName: 'ZimKitchen Supplies', amount: 5800, budgetStatus: 'over', urgency: 'normal', submittedAt: '2025-03-31T11:30:00Z', daysPending: 3, hasAttachments: true, exception: 'Equipment replacement - pending Director approval' },
  { id: 'req7', requestNumber: 'PR-0039', requestorName: 'Tendai Mutasa', branchName: 'Eastgate Shop', productName: 'LPG Gas (48kg)', quantity: 3, supplierName: 'Zimbabwe Gas Supplies', amount: 2100, budgetStatus: 'within', urgency: 'high', submittedAt: '2025-03-31T09:00:00Z', daysPending: 3, hasAttachments: false },
];

export default function ReviewQueuePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('');
  const [filterBudget, setFilterBudget] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showValidationModal, setShowValidationModal] = useState(false);

  const filteredRequests = mockReviewQueue.filter(req => {
    const matchesSearch = 
      req.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = !filterUrgency || req.urgency === filterUrgency;
    const matchesBudget = !filterBudget || req.budgetStatus === filterBudget;
    return matchesSearch && matchesUrgency && matchesBudget;
  });

  const stats = {
    total: mockReviewQueue.length,
    urgent: mockReviewQueue.filter(r => r.urgency === 'urgent').length,
    overBudget: mockReviewQueue.filter(r => r.budgetStatus === 'over').length,
    pendingDays: mockReviewQueue.reduce((sum, r) => sum + r.daysPending, 0) / mockReviewQueue.length,
  };

  const handleValidate = (request: ReviewRequest) => {
    setSelectedRequest(request);
    setShowValidationModal(true);
  };

  const handleSubmitValidation = (decision: 'validate' | 'return' | 'reject') => {
    // In real app, would submit to API
    setShowValidationModal(false);
    setSelectedRequest(null);
    setReviewNotes('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Review Queue</h1>
        <p className="text-[#6f6f6f]">Validate requests for budget compliance before approval</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Pending Review</div>
          <div className="text-2xl font-semibold text-[#161616]">{stats.total}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Urgent</div>
          <div className="text-2xl font-semibold text-[#da1e28]">{stats.urgent}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Over Budget</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">{stats.overBudget}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Avg Days Pending</div>
          <div className="text-2xl font-semibold text-[#0f62fe]">{stats.pendingDays.toFixed(1)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
        
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Urgency</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <select
          value={filterBudget}
          onChange={(e) => setFilterBudget(e.target.value)}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Budget Status</option>
          <option value="within">Within Budget</option>
          <option value="at_limit">At Limit</option>
          <option value="over">Over Budget</option>
        </select>
      </div>

      {/* Review Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Request</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Requestor</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Product</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Amount</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Budget</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Urgency</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Pending</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3">
                  <div className="font-medium">{req.requestNumber}</div>
                  <div className="text-xs text-[#6f6f6f]">{req.supplierName}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{req.requestorName}</div>
                  <div className="text-xs text-[#6f6f6f]">{req.branchName}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{req.productName}</div>
                  <div className="text-xs text-[#6f6f6f]">Qty: {req.quantity}</div>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium">${req.amount.toLocaleString()}</div>
                  {req.exception && (
                    <div className="text-xs text-[#9e7c0b]">Exception noted</div>
                  )}
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${
                    req.budgetStatus === 'within' ? 'bg-[#24a148]/10 text-[#24a148]' :
                    req.budgetStatus === 'at_limit' ? 'bg-[#F5C518]/10 text-[#9e7c0b]' :
                    'bg-[#da1e28]/10 text-[#da1e28]'
                  }`}>
                    {req.budgetStatus === 'within' ? '✓ Within' :
                     req.budgetStatus === 'at_limit' ? '⚠ Limit' :
                     '✗ Over'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${
                    req.urgency === 'urgent' ? 'bg-[#da1e28] text-white' :
                    req.urgency === 'high' ? 'bg-[#F5C518] text-[#161616]' :
                    'bg-[#e0e0e0] text-[#525252]'
                  }`}>
                    {req.urgency.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Clock className="w-3 h-3 text-[#8d8d8d]" />
                    {req.daysPending}d
                  </div>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleValidate(req)}
                    className="text-sm bg-[#161616] text-white px-3 py-1.5 hover:bg-[#333]"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Validation Modal */}
      {showValidationModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-lg font-medium">Review Request {selectedRequest.requestNumber}</h2>
              <button 
                onClick={() => setShowValidationModal(false)}
                className="text-[#525252] hover:text-[#161616]"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Request Summary */}
              <div className="bg-[#f4f4f4] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[#6f6f6f]">Requestor</div>
                    <div className="font-medium">{selectedRequest.requestorName}</div>
                    <div className="text-sm text-[#6f6f6f]">{selectedRequest.branchName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6f6f6f]">Product</div>
                    <div className="font-medium">{selectedRequest.productName}</div>
                    <div className="text-sm text-[#6f6f6f]">Qty: {selectedRequest.quantity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6f6f6f]">Supplier</div>
                    <div className="font-medium">{selectedRequest.supplierName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6f6f6f]">Amount</div>
                    <div className="text-xl font-semibold">${selectedRequest.amount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Budget Check */}
              <div className={`p-4 border ${
                selectedRequest.budgetStatus === 'within' ? 'border-[#24a148] bg-[#24a148]/5' :
                selectedRequest.budgetStatus === 'at_limit' ? 'border-[#F5C518] bg-[#F5C518]/5' :
                'border-[#da1e28] bg-[#da1e28]/5'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedRequest.budgetStatus === 'within' ? <CheckCircle className="w-5 h-5 text-[#24a148]" /> :
                   selectedRequest.budgetStatus === 'at_limit' ? <AlertCircle className="w-5 h-5 text-[#F5C518]" /> :
                   <XCircle className="w-5 h-5 text-[#da1e28]" />}
                  <span className="font-medium">
                    Budget Check: {selectedRequest.budgetStatus === 'within' ? 'Within Budget' : 
                                   selectedRequest.budgetStatus === 'at_limit' ? 'At Budget Limit' : 
                                   'Over Budget'}
                  </span>
                </div>
                <p className="text-sm text-[#6f6f6f]">
                  {selectedRequest.budgetStatus === 'within' 
                    ? 'This request is within the allocated budget for the selected category.' :
                    selectedRequest.budgetStatus === 'at_limit' 
                    ? 'This request will utilize the remaining budget allocation.' :
                    'This request exceeds the allocated budget and requires Director approval.'}
                </p>
              </div>

              {/* Exception Note */}
              {selectedRequest.exception && (
                <div className="p-4 border border-[#F5C518] bg-[#F5C518]/5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-[#9e7c0b]" />
                    <span className="font-medium text-[#9e7c0b]">Exception Noted</span>
                  </div>
                  <p className="text-sm">{selectedRequest.exception}</p>
                </div>
              )}

              {/* Review Notes */}
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-2">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  placeholder="Add your validation notes..."
                  className="w-full p-3 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                onClick={() => handleSubmitValidation('reject')}
                className="px-4 py-2 border border-[#da1e28] text-[#da1e28] hover:bg-[#da1e28]/5"
              >
                Reject
              </button>
              <button
                onClick={() => handleSubmitValidation('return')}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Return for Info
              </button>
              <button
                onClick={() => handleSubmitValidation('validate')}
                className="px-4 py-2 bg-[#24a148] text-white hover:bg-[#1e8a3c]"
              >
                Validate & Forward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
