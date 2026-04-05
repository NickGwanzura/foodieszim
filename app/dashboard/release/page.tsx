'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Building,
  User,
  FileText,
  Clock,
  ArrowRight,
  Banknote,
  Smartphone
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — FUND RELEASE
// Step 4: Accountant releases funds after full approval chain
// ═════════════════════════════════════════════════════════════════════════════

interface ReleaseRequest {
  id: string;
  requestNumber: string;
  requestorName: string;
  branchName: string;
  supplierName: string;
  amount: number;
  approvedBy: string;
  approvedAt: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'mobile_money';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branch: string;
  };
  mobileDetails?: {
    provider: string;
    phoneNumber: string;
  };
}

const mockReleaseQueue: ReleaseRequest[] = [
  { 
    id: 'rel1', 
    requestNumber: 'PR-0044', 
    requestorName: 'Tendai Mutasa', 
    branchName: 'Eastgate Shop', 
    supplierName: 'MegaFood Distributors', 
    amount: 850, 
    approvedBy: 'Grace Chikomo',
    approvedAt: '2025-04-02T10:00:00Z',
    paymentMethod: 'bank_transfer',
    bankDetails: {
      bankName: 'CBZ Bank',
      accountNumber: '****4567',
      branch: 'Samora Machel'
    }
  },
  { 
    id: 'rel2', 
    requestNumber: 'PR-0042', 
    requestorName: 'Sarah Moyo', 
    branchName: 'Avondale Shop', 
    supplierName: 'ProClean Zimbabwe', 
    amount: 320, 
    approvedBy: 'Grace Chikomo',
    approvedAt: '2025-04-02T09:30:00Z',
    paymentMethod: 'mobile_money',
    mobileDetails: {
      provider: 'EcoCash',
      phoneNumber: '+263 77 *** **45'
    }
  },
  { 
    id: 'rel3', 
    requestNumber: 'PR-0041', 
    requestorName: 'Peter Moyo', 
    branchName: 'Westgate', 
    supplierName: 'Premium Meats', 
    amount: 1800, 
    approvedBy: 'Dr. James Ncube',
    approvedAt: '2025-04-01T17:00:00Z',
    paymentMethod: 'bank_transfer',
    bankDetails: {
      bankName: 'Stanbic Bank',
      accountNumber: '****8901',
      branch: 'First Street'
    }
  },
];

const releasedHistory = [
  { id: 'hist1', requestNumber: 'PR-0038', amount: 4200, releasedAt: '2025-04-01', reference: 'FT25678432' },
  { id: 'hist2', requestNumber: 'PR-0036', amount: 1250, releasedAt: '2025-03-31', reference: 'MM25678412' },
  { id: 'hist3', requestNumber: 'PR-0034', amount: 3200, releasedAt: '2025-03-30', reference: 'FT25678398' },
];

export default function ReleaseFundsPage() {
  const [selectedRequest, setSelectedRequest] = useState<ReleaseRequest | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [showReleaseModal, setShowReleaseModal] = useState(false);

  const totalPending = mockReleaseQueue.reduce((sum, r) => sum + r.amount, 0);

  const handleRelease = (request: ReleaseRequest) => {
    setSelectedRequest(request);
    setPaymentReference(`FT${Date.now().toString().slice(-8)}`);
    setShowReleaseModal(true);
  };

  const handleConfirmRelease = () => {
    // Submit to API
    setShowReleaseModal(false);
    setSelectedRequest(null);
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Banknote className="w-4 h-4" />;
      case 'mobile_money':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#24a148] text-white p-6">
        <h1 className="text-2xl font-light mb-2">Release Funds</h1>
        <p className="text-white/80">Execute payments for approved requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Pending Release</p>
              <p className="text-2xl font-semibold text-[#161616]">{mockReleaseQueue.length}</p>
            </div>
            <div className="p-2 bg-[#0f62fe]/10 text-[#0f62fe]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Total Amount</p>
              <p className="text-2xl font-semibold text-[#161616]">${totalPending.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-[#F5C518]/10 text-[#F5C518]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Released Today</p>
              <p className="text-2xl font-semibold text-[#24a148]">$5,450</p>
            </div>
            <div className="p-2 bg-[#24a148]/10 text-[#24a148]">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Release Queue */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0]">
          <h2 className="text-lg font-medium">Ready for Release</h2>
          <p className="text-sm text-[#6f6f6f]">These requests have completed the full approval chain</p>
        </div>
        
        <div className="divide-y divide-[#e0e0e0]">
          {mockReleaseQueue.map((req) => (
            <div key={req.id} className="p-6 hover:bg-[#f4f4f4]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Request Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-medium">{req.requestNumber}</span>
                    <span className="text-xs px-2 py-1 bg-[#24a148]/10 text-[#24a148]">
                      FULLY APPROVED
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-[#6f6f6f]">Amount</div>
                      <div className="font-semibold text-lg">${req.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[#6f6f6f]">Supplier</div>
                      <div>{req.supplierName}</div>
                    </div>
                    <div>
                      <div className="text-[#6f6f6f]">Branch</div>
                      <div>{req.branchName}</div>
                    </div>
                    <div>
                      <div className="text-[#6f6f6f]">Approved By</div>
                      <div>{req.approvedBy}</div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-[#6f6f6f]">
                    {getPaymentIcon(req.paymentMethod)}
                    <span className="capitalize">{req.paymentMethod.replace('_', ' ')}</span>
                    {req.bankDetails && (
                      <span className="text-xs bg-[#f4f4f4] px-2 py-1">
                        {req.bankDetails.bankName} • {req.bankDetails.accountNumber}
                      </span>
                    )}
                    {req.mobileDetails && (
                      <span className="text-xs bg-[#f4f4f4] px-2 py-1">
                        {req.mobileDetails.provider} • {req.mobileDetails.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div>
                  <button
                    onClick={() => handleRelease(req)}
                    className="flex items-center gap-2 px-6 py-2 bg-[#24a148] text-white font-medium hover:bg-[#1e8a3c]"
                  >
                    Release
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockReleaseQueue.length === 0 && (
          <div className="p-12 text-center text-[#6f6f6f]">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[#24a148]" />
            <p>All approved funds have been released</p>
          </div>
        )}
      </div>

      {/* Release History */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0]">
          <h2 className="text-lg font-medium">Recent Releases</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Request</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Amount</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Reference</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Date</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {releasedHistory.map((item) => (
              <tr key={item.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3 font-medium">{item.requestNumber}</td>
                <td className="p-3 text-right">${item.amount.toLocaleString()}</td>
                <td className="p-3 text-center font-mono text-sm">{item.reference}</td>
                <td className="p-3 text-center text-sm">{item.releasedAt}</td>
                <td className="p-3 text-center">
                  <span className="text-xs px-2 py-1 bg-[#24a148]/10 text-[#24a148]">
                    COMPLETED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Release Modal */}
      {showReleaseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg">
            <div className="p-4 border-b border-[#e0e0e0]">
              <h2 className="text-lg font-medium">Confirm Fund Release</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-[#f4f4f4] p-4">
                <div className="text-sm text-[#6f6f6f]">Payment Amount</div>
                <div className="text-2xl font-semibold">${selectedRequest.amount.toLocaleString()}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6f6f6f]">Payee:</span>
                  <span className="font-medium">{selectedRequest.supplierName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6f6f6f]">Method:</span>
                  <span className="font-medium capitalize">{selectedRequest.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161616] mb-2">
                  Payment Reference
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full p-3 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                />
                <p className="text-xs text-[#6f6f6f] mt-1">
                  Reference number from your banking platform
                </p>
              </div>

              <div className="p-4 border border-[#F5C518] bg-[#F5C518]/5">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-[#9e7c0b] shrink-0" />
                  <p className="text-sm text-[#9e7c0b]">
                    By confirming, you certify that payment has been executed through the banking platform. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                onClick={() => setShowReleaseModal(false)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRelease}
                className="px-4 py-2 bg-[#24a148] text-white hover:bg-[#1e8a3c]"
              >
                Confirm Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
