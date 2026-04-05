'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, roleLabels } from '@/lib/auth-context';
import { useModal } from '@/lib/modal-context';
import { useToast } from '@/lib/toast-context';
import { 
  PurchaseRequest, 
  RequestStatus,
  Product,
} from '@/types';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  AlertTriangle,
  X,
  ChevronRight,
  Calendar,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// STORESMAN VALIDATION PAGE — Stock Validation Queue
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
  { id: 'p4', name: 'Rice 5kg', category: 'rice', categoryId: 'cat4', unit: '5kg', unitPrice: 35.00, sku: 'RIC-5KG', supplierId: 's2', isActive: true, createdAt: '2025-01-01' },
  { id: 'p5', name: 'Salt 1kg', category: 'other', categoryId: 'cat5', unit: '1kg', unitPrice: 3.50, sku: 'SAL-1KG', supplierId: 's1', isActive: true, createdAt: '2025-01-01' },
];

// Simplified request for mock
interface MockRequest {
  id: string;
  productId: string;
  quantity: number;
  requestedBy: string;
  branchId: string;
  status: RequestStatus;
  urgency: 'normal' | 'high' | 'urgent';
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  totalCost?: number;
}

const MOCK_REQUESTS: MockRequest[] = [
  {
    id: 'REQ-2025-001',
    productId: 'p1',
    quantity: 10,
    requestedBy: 'John Doe',
    branchId: 'b1',
    status: 'storesman_review',
    urgency: 'normal',
    notes: 'Regular restock',
    createdAt: '2025-01-15T10:30:00Z',
    totalCost: 450.00,
  },
  {
    id: 'REQ-2025-006',
    productId: 'p2',
    quantity: 50,
    requestedBy: 'Jane Smith',
    branchId: 'b2',
    status: 'storesman_review',
    urgency: 'urgent',
    notes: 'Urgent - running low',
    createdAt: '2025-01-15T09:00:00Z',
    totalCost: 625.00,
  },
  {
    id: 'REQ-2025-007',
    productId: 'p3',
    quantity: 5,
    requestedBy: 'Bob Wilson',
    branchId: 'b1',
    status: 'storesman_review',
    urgency: 'high',
    notes: 'Baking supplies needed',
    createdAt: '2025-01-14T16:30:00Z',
    totalCost: 140.00,
  },
];

// Simplified validation interface
interface MockValidation {
  id: string;
  requestId: string;
  productId: string;
  availableQuantity: number;
  requestedQuantity: number;
  daysOfCoverCurrent: number;
  daysOfCoverAfter: number;
  validationStatus: 'pending' | 'approved' | 'rejected' | 'returned';
  validatedAt?: string;
  validatedBy?: string;
  rejectionReason?: string;
}

const MOCK_VALIDATIONS: Record<string, MockValidation> = {
  'REQ-2025-001': {
    id: 'val1',
    requestId: 'REQ-2025-001',
    productId: 'p1',
    availableQuantity: 12,
    requestedQuantity: 10,
    daysOfCoverCurrent: 18,
    daysOfCoverAfter: 14,
    validationStatus: 'pending',
  },
  'REQ-2025-006': {
    id: 'val2',
    requestId: 'REQ-2025-006',
    productId: 'p2',
    availableQuantity: 5,
    requestedQuantity: 50,
    daysOfCoverCurrent: 3,
    daysOfCoverAfter: 28,
    validationStatus: 'pending',
  },
  'REQ-2025-007': {
    id: 'val3',
    requestId: 'REQ-2025-007',
    productId: 'p3',
    availableQuantity: 8,
    requestedQuantity: 5,
    daysOfCoverCurrent: 12,
    daysOfCoverAfter: 9,
    validationStatus: 'pending',
  },
};

export default function ValidationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { confirm, openModal } = useModal();
  const { success, error: showError } = useToast();

  const [requests, setRequests] = useState<MockRequest[]>(MOCK_REQUESTS);
  const [validations, setValidations] = useState<Record<string, MockValidation>>(MOCK_VALIDATIONS);
  const [selectedRequest, setSelectedRequest] = useState<MockRequest | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationForm, setValidationForm] = useState({
    availableQuantity: 0,
    daysOfCoverCurrent: 0,
    notes: '',
    action: 'pending' as 'pending' | 'approve' | 'reject' | 'return',
  });

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const getProductName = (productId: string) => {
    return MOCK_PRODUCTS.find(p => p.id === productId)?.name || productId;
  };

  const getProductPrice = (productId: string) => {
    return MOCK_PRODUCTS.find(p => p.id === productId)?.unitPrice || 0;
  };

  // Open validation modal
  const handleValidate = (request: MockRequest) => {
    setSelectedRequest(request);
    const existingValidation = validations[request.id];
    setValidationForm({
      availableQuantity: existingValidation?.availableQuantity || 0,
      daysOfCoverCurrent: existingValidation?.daysOfCoverCurrent || 0,
      notes: '',
      action: 'pending',
    });
    setShowValidationModal(true);
  };

  // Submit validation
  const handleSubmitValidation = () => {
    if (!selectedRequest) return;

    if (validationForm.action === 'pending') {
      showError('Action Required', 'Please select Approve, Reject, or Return');
      return;
    }

    const validation: MockValidation = {
      id: `val_${Date.now()}`,
      requestId: selectedRequest.id,
      productId: selectedRequest.productId,
      availableQuantity: validationForm.availableQuantity,
      requestedQuantity: selectedRequest.quantity,
      daysOfCoverCurrent: validationForm.daysOfCoverCurrent,
      daysOfCoverAfter: Math.round(validationForm.daysOfCoverCurrent - (selectedRequest.quantity * 0.5)),
      validationStatus: validationForm.action === 'approve' ? 'approved' : validationForm.action === 'reject' ? 'rejected' : 'returned',
      validatedAt: new Date().toISOString(),
      validatedBy: user?.name || 'Unknown',
      rejectionReason: validationForm.action !== 'approve' ? validationForm.notes : undefined,
    };

    setValidations(prev => ({ ...prev, [selectedRequest.id]: validation }));
    
    // Update request status
    const newStatus: RequestStatus = validationForm.action === 'approve' 
      ? 'accountant_review' 
      : validationForm.action === 'reject' 
        ? 'rejected' 
        : 'returned';
    
    setRequests(prev => prev.map(r => 
      r.id === selectedRequest.id 
        ? { ...r, status: newStatus, rejectionReason: validationForm.notes }
        : r
    ));

    setShowValidationModal(false);
    setSelectedRequest(null);

    const actionLabels = { approve: 'approved', reject: 'rejected', return: 'returned' };
    success(
      `Request ${actionLabels[validationForm.action]}`,
      `${selectedRequest.id} has been ${actionLabels[validationForm.action]} for stock validation`
    );
  };

  // Quick approve action
  const handleQuickApprove = (request: MockRequest) => {
    confirm({
      title: 'Approve Request?',
      message: `Approve ${request.id} for ${getProductName(request.productId)} (${request.quantity} units)?`,
      confirmLabel: 'Approve',
      onConfirm: () => {
        const validation: MockValidation = {
          id: `val_${Date.now()}`,
          requestId: request.id,
          productId: request.productId,
          availableQuantity: 12,
          requestedQuantity: request.quantity,
          daysOfCoverCurrent: 18,
          daysOfCoverAfter: 14,
          validationStatus: 'approved',
          validatedAt: new Date().toISOString(),
          validatedBy: user?.name || 'Unknown',
        };

        setValidations(prev => ({ ...prev, [request.id]: validation }));
        setRequests(prev => prev.map(r => 
          r.id === request.id ? { ...r, status: 'accountant_review' } : r
        ));

        success('Request Approved', `${request.id} has been approved for stock`);
      },
    });
  };

  // Quick reject action
  const handleQuickReject = (request: MockRequest) => {
    openModal({
      type: 'form',
      title: 'Reject Request',
      size: 'md',
      content: (
        <div className="space-y-4">
          <p className="text-[#6f6f6f]">Please provide a reason for rejecting {request.id}:</p>
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
        if (!reason) {
          showError('Reason Required', 'Please provide a rejection reason');
          return;
        }

        const validation: MockValidation = {
          id: `val_${Date.now()}`,
          requestId: request.id,
          productId: request.productId,
          availableQuantity: 0,
          requestedQuantity: request.quantity,
          daysOfCoverCurrent: 0,
          daysOfCoverAfter: 0,
          validationStatus: 'rejected',
          validatedAt: new Date().toISOString(),
          validatedBy: user?.name || 'Unknown',
          rejectionReason: reason,
        };

        setValidations(prev => ({ ...prev, [request.id]: validation }));
        setRequests(prev => prev.map(r => 
          r.id === request.id ? { ...r, status: 'rejected', rejectionReason: reason } : r
        ));

        success('Request Rejected', `${request.id} has been rejected`);
      },
    });
  };

  const stats = useMemo(() => ({
    pending: requests.filter(r => r.status === 'storesman_review').length,
    validated: Object.values(validations).filter(v => v.validationStatus === 'approved').length,
    rejected: Object.values(validations).filter(v => v.validationStatus === 'rejected').length,
    returned: Object.values(validations).filter(v => v.validationStatus === 'returned').length,
  }), [requests, validations]);

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
              <span className="text-sm text-gray-300">Stock Validation</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-light text-[#161616]">Stock Validation Queue</h1>
          <p className="text-sm text-[#6f6f6f] mt-1">Review and validate purchase requests based on stock availability and coverage</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#0f62fe]">{stats.pending}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Pending Validation</div>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#24a148]">{stats.validated}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Validated Today</div>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#da1e28]">{stats.rejected}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Rejected</div>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="text-2xl font-light text-[#9e6b00]">{stats.returned}</div>
            <div className="text-xs text-[#6f6f6f] uppercase tracking-wide mt-1">Returned to Shop</div>
          </div>
        </div>

        {/* Validation Guidelines */}
        <div className="mb-6 bg-[#edf5ff] border border-[#0f62fe] p-4">
          <h3 className="font-medium text-[#0f62fe] mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Validation Guidelines
          </h3>
          <ul className="text-sm text-[#161616] space-y-1 ml-5 list-disc">
            <li>Ensure minimum <strong>2 weeks (14 days)</strong> of stock cover</li>
            <li>Check current inventory levels against requested quantities</li>
            <li>Critical items should be prioritized</li>
            <li>Return to Shop Manager if stock is adequate</li>
          </ul>
        </div>

        {/* Requests Table */}
        <div className="bg-white border border-[#e0e0e0]">
          <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center justify-between">
            <h3 className="font-medium text-[#161616]">Pending Requests</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-sm text-[#525252] hover:text-[#161616]">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-1 text-sm text-[#525252] hover:text-[#161616]">
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0e0e0] bg-[#f4f4f4]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Urgency</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Stock Est.</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Days Cover</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.filter(r => r.status === 'storesman_review').map((request) => {
                  const validation = validations[request.id];
                  const product = MOCK_PRODUCTS.find(p => p.id === request.productId);
                  
                  return (
                    <tr key={request.id} className="border-b border-[#e0e0e0] hover:bg-[#f4f4f4]">
                      <td className="px-4 py-3 font-medium text-[#161616]">{request.id}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{getProductName(request.productId)}</div>
                          <div className="text-xs text-[#6f6f6f]">{product?.sku}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{request.quantity} units</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs ${
                          request.urgency === 'urgent' ? 'text-[#da1e28] font-medium' :
                          request.urgency === 'high' ? 'text-[#f1c21b]' :
                          'text-[#525252]'
                        }`}>
                          {request.urgency === 'urgent' && <AlertTriangle className="w-3 h-3" />}
                          {request.urgency?.charAt(0).toUpperCase() + request.urgency?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium">{validation?.availableQuantity || 12} units</div>
                          <div className="text-xs text-[#6f6f6f]">
                            After: {(validation?.availableQuantity || 12) - request.quantity} units
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium">{validation?.daysOfCoverCurrent || 18} days</div>
                          <div className={`text-xs ${
                            (validation?.daysOfCoverAfter || 14) < 14 ? 'text-[#da1e28]' : 'text-[#24a148]'
                          }`}>
                            {(validation?.daysOfCoverAfter || 14) < 14 ? '⚠ ' : '✓ '}
                            {(validation?.daysOfCoverAfter || 14)} days after
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleValidate(request)}
                            className="flex items-center gap-1 px-3 py-2 bg-[#F5C518] text-[#161616] text-sm font-medium hover:bg-[#e5b518] active:scale-95 transition-transform"
                          >
                            Validate
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickApprove(request)}
                            className="p-2 bg-[#24a148] text-white hover:bg-[#1e8a3c] active:scale-95 transition-transform rounded-sm"
                            title="Quick Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickReject(request)}
                            className="p-2 bg-[#da1e28] text-white hover:bg-[#b91c1c] active:scale-95 transition-transform rounded-sm"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {requests.filter(r => r.status === 'storesman_review').length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#6f6f6f]">
                      <CheckCircle className="w-12 h-12 text-[#24a148] mx-auto mb-2" />
                      <p>No pending validations - all caught up!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Validations */}
        <div className="mt-8 bg-white border border-[#e0e0e0]">
          <div className="px-4 py-3 border-b border-[#e0e0e0]">
            <h3 className="font-medium text-[#161616]">Recent Validations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0e0e0] bg-[#f4f4f4]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Request ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Validated By</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#525252] uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(validations)
                  .filter(v => v.validationStatus !== 'pending')
                  .sort((a, b) => new Date(b.validatedAt || '').getTime() - new Date(a.validatedAt || '').getTime())
                  .slice(0, 5)
                  .map((validation) => (
                    <tr key={validation.id} className="border-b border-[#e0e0e0]">
                      <td className="px-4 py-3 font-medium">{validation.requestId}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium ${
                          validation.validationStatus === 'approved' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                          validation.validationStatus === 'rejected' ? 'bg-[#ffebee] text-[#c62828]' :
                          'bg-[#fff8e1] text-[#9e6b00]'
                        }`}>
                          {validation.validationStatus.charAt(0).toUpperCase() + validation.validationStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6f6f6f]">{validation.validatedBy}</td>
                      <td className="px-4 py-3 text-sm text-[#6f6f6f]">
                        {validation.validatedAt ? new Date(validation.validatedAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                {Object.values(validations).filter(v => v.validationStatus !== 'pending').length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-[#6f6f6f]">
                      No validations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Validation Modal */}
      {showValidationModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowValidationModal(false)}
          />
          <div className="relative bg-white w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0]">
              <div>
                <h3 className="text-lg font-medium text-[#161616]">Validate Request</h3>
                <p className="text-sm text-[#6f6f6f]">{selectedRequest.id} — {getProductName(selectedRequest.productId)}</p>
              </div>
              <button
                onClick={() => setShowValidationModal(false)}
                className="p-1 hover:bg-[#f4f4f4] rounded"
              >
                <X className="w-5 h-5 text-[#525252]" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#161616] mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={validationForm.availableQuantity}
                    onChange={(e) => setValidationForm(prev => ({ ...prev, availableQuantity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none"
                    placeholder="Enter current quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#161616] mb-1">Days of Cover</label>
                  <input
                    type="number"
                    value={validationForm.daysOfCoverCurrent}
                    onChange={(e) => setValidationForm(prev => ({ ...prev, daysOfCoverCurrent: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none"
                    placeholder="Current days of cover"
                  />
                </div>
              </div>

              <div className="bg-[#f4f4f4] p-3">
                <h4 className="text-sm font-medium text-[#161616] mb-2">Request Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[#6f6f6f]">Product:</span>
                    <p className="font-medium">{getProductName(selectedRequest.productId)}</p>
                  </div>
                  <div>
                    <span className="text-[#6f6f6f]">Quantity:</span>
                    <p className="font-medium">{selectedRequest.quantity} units</p>
                  </div>
                  <div>
                    <span className="text-[#6f6f6f]">Stock After:</span>
                    <p className={`font-medium ${(validationForm.availableQuantity - selectedRequest.quantity) < 0 ? 'text-[#da1e28]' : ''}`}>
                      {validationForm.availableQuantity - selectedRequest.quantity} units
                    </p>
                  </div>
                  <div>
                    <span className="text-[#6f6f6f]">Cover After:</span>
                    <p className={`font-medium ${(validationForm.daysOfCoverCurrent - (selectedRequest.quantity * 0.5)) < 14 ? 'text-[#da1e28]' : 'text-[#24a148]'}`}>
                      {Math.round(validationForm.daysOfCoverCurrent - (selectedRequest.quantity * 0.5))} days
                      {(validationForm.daysOfCoverCurrent - (selectedRequest.quantity * 0.5)) < 14 && ' ⚠'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161616] mb-2">Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setValidationForm(prev => ({ ...prev, action: 'approve' }))}
                    className={`py-3 border-2 font-medium transition-all ${
                      validationForm.action === 'approve'
                        ? 'border-[#24a148] bg-[#24a148] text-white shadow-md'
                        : 'border-[#24a148] text-[#24a148] hover:bg-[#24a148]/10'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Approve
                    {validationForm.action === 'approve' && <span className="ml-1">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setValidationForm(prev => ({ ...prev, action: 'reject' }))}
                    className={`py-3 border-2 font-medium transition-all ${
                      validationForm.action === 'reject'
                        ? 'border-[#da1e28] bg-[#da1e28] text-white shadow-md'
                        : 'border-[#da1e28] text-[#da1e28] hover:bg-[#da1e28]/10'
                    }`}
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Reject
                    {validationForm.action === 'reject' && <span className="ml-1">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setValidationForm(prev => ({ ...prev, action: 'return' }))}
                    className={`py-3 border-2 font-medium transition-all ${
                      validationForm.action === 'return'
                        ? 'border-[#9e6b00] bg-[#9e6b00] text-white shadow-md'
                        : 'border-[#9e6b00] text-[#9e6b00] hover:bg-[#9e6b00]/10'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4 inline mr-1" />
                    Return
                    {validationForm.action === 'return' && <span className="ml-1">✓</span>}
                  </button>
                </div>
              </div>

              {(validationForm.action === 'reject' || validationForm.action === 'return') && (
                <div>
                  <label className="block text-sm font-medium text-[#161616] mb-1">
                    {validationForm.action === 'reject' ? 'Rejection Reason' : 'Return Reason'}
                  </label>
                  <textarea
                    value={validationForm.notes}
                    onChange={(e) => setValidationForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#161616] focus:outline-none resize-none"
                    placeholder={`Enter ${validationForm.action} reason...`}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-[#e0e0e0]">
              <button
                type="button"
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4] active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitValidation}
                disabled={validationForm.action === 'pending'}
                className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518] disabled:bg-[#e0e0e0] disabled:text-[#a8a8a8] active:scale-95 transition-transform"
              >
                {validationForm.action === 'pending' ? 'Select an Action' : `Submit ${validationForm.action.charAt(0).toUpperCase() + validationForm.action.slice(1)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
