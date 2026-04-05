'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  products, 
  getPriceComparison, 
  createAllocation, 
  formatPrice,
  productCategories,
  AllocationDecision,
} from '@/lib/price-engine';
import { AlertCircle, Check, ChevronRight, Info, Loader2, Package, TrendingDown, TrendingUp } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — NEW PURCHASE REQUEST (Product-First Flow)
// Shop Manager selects product, system recommends cheapest supplier
// ═════════════════════════════════════════════════════════════════════════════

type Step = 'product' | 'quantity' | 'review' | 'confirm';

export default function NewRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Form State
  const [step, setStep] = useState<Step>('product');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [urgency, setUrgency] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [requiredBy, setRequiredBy] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [overrideSupplierId, setOverrideSupplierId] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed Values
  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId),
    [selectedProductId]
  );

  const filteredProducts = useMemo(() =>
    selectedCategory 
      ? products.filter(p => p.categoryId === selectedCategory && p.isActive)
      : products.filter(p => p.isActive),
    [selectedCategory]
  );

  const priceComparison = useMemo(() => {
    if (!selectedProductId || quantity < 1) return null;
    try {
      return getPriceComparison(selectedProductId, quantity);
    } catch {
      return null;
    }
  }, [selectedProductId, quantity]);

  const allocation = useMemo<AllocationDecision | null>(() => {
    if (!priceComparison) return null;
    try {
      return createAllocation(
        selectedProductId, 
        quantity, 
        overrideSupplierId || undefined,
        overrideReason || undefined
      );
    } catch {
      return null;
    }
  }, [selectedProductId, quantity, overrideSupplierId, overrideReason]);

  // Step Management
  const canProceed = () => {
    switch (step) {
      case 'product':
        return !!selectedProductId;
      case 'quantity':
        return quantity >= 1 && !!allocation;
      case 'review':
        return !!allocation;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const steps: Step[] = ['product', 'quantity', 'review', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['product', 'quantity', 'review', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep('confirm');
  };

  // Render Steps
  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-6">
      {[
        { id: 'product', label: 'Select Product' },
        { id: 'quantity', label: 'Quantity' },
        { id: 'review', label: 'Review' },
      ].map((s, index) => {
        const isActive = step === s.id;
        const isComplete = ['quantity', 'review', 'confirm'].includes(step) && index < ['product', 'quantity', 'review'].indexOf(step);
        
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-2 ${
              isActive ? 'bg-[#F5C518] text-[#161616]' :
              isComplete ? 'bg-[#24a148] text-white' :
              'bg-[#e0e0e0] text-[#6f6f6f]'
            }`}>
              {isComplete ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{index + 1}</span>}
              <span className="text-sm">{s.label}</span>
            </div>
            {index < 2 && <ChevronRight className="w-4 h-4 mx-2 text-[#8d8d8d]" />}
          </div>
        );
      })}
    </div>
  );

  const renderProductSelection = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-[#161616] mb-3">Product Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 text-sm border ${
              !selectedCategory 
                ? 'bg-[#F5C518] border-[#F5C518] text-[#161616]' 
                : 'border-[#8d8d8d] text-[#525252] hover:border-[#161616]'
            }`}
          >
            All Categories
          </button>
          {productCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-sm border ${
                selectedCategory === cat.id 
                  ? 'bg-[#F5C518] border-[#F5C518] text-[#161616]' 
                  : 'border-[#8d8d8d] text-[#525252] hover:border-[#161616]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <label className="block text-sm font-medium text-[#161616] mb-3">Select Product</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              className={`p-4 border text-left transition-all ${
                selectedProductId === product.id
                  ? 'border-[#F5C518] bg-[#F5C518]/5'
                  : 'border-[#e0e0e0] hover:border-[#8d8d8d]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 ${selectedProductId === product.id ? 'bg-[#F5C518]' : 'bg-[#f4f4f4]'}`}>
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#161616]">{product.name}</div>
                  <div className="text-sm text-[#6f6f6f]">{product.category}</div>
                  <div className="text-xs text-[#8d8d8d] mt-1">Unit: {product.unit}</div>
                </div>
                {selectedProductId === product.id && (
                  <Check className="w-5 h-5 text-[#F5C518]" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuantitySelection = () => (
    <div className="space-y-6">
      {/* Selected Product Summary */}
      {selectedProduct && (
        <div className="bg-[#f4f4f4] p-4 flex items-center gap-4">
          <div className="p-2 bg-white">
            <Package className="w-6 h-6 text-[#F5C518]" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{selectedProduct.name}</div>
            <div className="text-sm text-[#6f6f6f]">{selectedProduct.category} • Unit: {selectedProduct.unit}</div>
          </div>
          <button 
            onClick={() => setStep('product')}
            className="text-sm text-[#0f62fe] hover:underline"
          >
            Change
          </button>
        </div>
      )}

      {/* Quantity Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#161616] mb-2">Quantity Required</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="w-full p-3 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
          <p className="text-xs text-[#6f6f6f] mt-1">Enter the quantity in {selectedProduct?.unit}s</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#161616] mb-2">Required By</label>
          <input
            type="date"
            value={requiredBy}
            onChange={(e) => setRequiredBy(e.target.value)}
            className="w-full p-3 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
      </div>

      {/* Urgency Selection */}
      <div>
        <label className="block text-sm font-medium text-[#161616] mb-2">Urgency Level</label>
        <div className="flex gap-3">
          {[
            { id: 'normal', label: 'Normal', color: 'bg-[#e0e0e0] text-[#525252]' },
            { id: 'high', label: 'High', color: 'bg-[#F5C518] text-[#161616]' },
            { id: 'urgent', label: 'Urgent', color: 'bg-[#da1e28] text-white' },
          ].map(u => (
            <button
              key={u.id}
              onClick={() => setUrgency(u.id as any)}
              className={`px-4 py-2 ${urgency === u.id ? u.color : 'bg-white border border-[#8d8d8d] text-[#525252]'}`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Justification */}
      <div>
        <label className="block text-sm font-medium text-[#161616] mb-2">Business Justification</label>
        <textarea
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          rows={3}
          placeholder="Explain why this purchase is needed..."
          className="w-full p-3 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        />
      </div>

      {/* Price Comparison Display */}
      {priceComparison && (
        <div className="border border-[#e0e0e0] mt-6">
          <div className="p-3 bg-[#f4f4f4] border-b border-[#e0e0e0]">
            <h3 className="font-medium">Price Comparison ({quantity} {selectedProduct?.unit}s)</h3>
          </div>
          <div className="divide-y divide-[#e0e0e0]">
            {priceComparison.comparisons.map((quote, index) => (
              <div 
                key={quote.supplierId}
                className={`p-4 flex items-center justify-between ${
                  quote.isRecommended ? 'bg-[#24a148]/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {quote.isRecommended ? (
                    <div className="w-6 h-6 bg-[#24a148] text-white flex items-center justify-center text-xs font-bold">
                      {quote.rank}
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-[#e0e0e0] text-[#525252] flex items-center justify-center text-xs font-bold">
                      {quote.rank}
                    </div>
                  )}
                  <div>
                    <div className={`font-medium ${quote.isRecommended ? 'text-[#24a148]' : ''}`}>
                      {quote.supplierName}
                      {quote.isRecommended && <span className="ml-2 text-xs font-normal">(Recommended)</span>}
                    </div>
                    <div className="text-xs text-[#6f6f6f]">
                      Lead time: {quote.leadTimeDays} day{quote.leadTimeDays !== 1 ? 's' : ''} • 
                      Stock: {quote.availability.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(quote.price)}</div>
                  <div className="text-sm text-[#6f6f6f]">
                    Total: {formatPrice(quote.totalCost)}
                  </div>
                  {quote.bulkPrice && (
                    <div className="text-xs text-[#24a148]">Bulk pricing applied</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {priceComparison.savingsVsHighest > 0 && (
            <div className="p-3 bg-[#24a148]/10 border-t border-[#e0e0e0]">
              <div className="flex items-center gap-2 text-[#24a148]">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Potential savings: {formatPrice(priceComparison.savingsVsHighest)} ({priceComparison.savingsPercentage.toFixed(1)}% vs highest price)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Override Option */}
      {priceComparison && priceComparison.comparisons.length > 1 && (
        <div className="border border-[#e0e0e0] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#0f62fe]" />
            <span className="font-medium">Supplier Override (Optional)</span>
          </div>
          <p className="text-sm text-[#6f6f6f] mb-3">
            The system recommends the cheapest supplier. You may select a different supplier with justification.
          </p>
          <select
            value={overrideSupplierId}
            onChange={(e) => setOverrideSupplierId(e.target.value)}
            className="w-full p-3 border border-[#8d8d8d] mb-3 focus:border-[#F5C518] focus:outline-none"
          >
            <option value="">Use recommended supplier</option>
            {priceComparison.alternatives.map(alt => (
              <option key={alt.supplierId} value={alt.supplierId}>
                {alt.supplierName} - {formatPrice(alt.totalCost)} (+{formatPrice(alt.totalCost - priceComparison.recommended!.totalCost)})
              </option>
            ))}
          </select>
          {overrideSupplierId && (
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="Reason for override (required)..."
              rows={2}
              className="w-full p-3 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
            />
          )}
        </div>
      )}
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      {allocation && (
        <>
          {/* Summary Card */}
          <div className="bg-[#161616] text-white p-6">
            <div className="text-sm text-[#c6c6c6] mb-1">Total Request Amount</div>
            <div className="text-4xl font-light">{formatPrice(allocation.totalCost)}</div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <span className="text-[#c6c6c6]">{allocation.productName}</span>
              <span className="text-[#525252]">•</span>
              <span className="text-[#c6c6c6]">{allocation.quantity} {allocation.unit}s</span>
            </div>
          </div>

          {/* Allocation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#e0e0e0] p-4">
              <div className="text-sm text-[#6f6f6f] mb-1">Allocated Supplier</div>
              <div className="font-medium text-lg">{allocation.selectedSupplierName}</div>
              <div className="text-sm text-[#24a148] mt-1">
                {formatPrice(allocation.selectedPrice)} per {allocation.unit}
              </div>
              {allocation.isOverride && (
                <div className="mt-2 text-xs bg-[#F5C518]/20 text-[#9e7c0b] px-2 py-1 inline-block">
                  ⚠ Override: {allocation.overrideReason}
                </div>
              )}
            </div>

            <div className="border border-[#e0e0e0] p-4">
              <div className="text-sm text-[#6f6f6f] mb-1">Delivery Estimate</div>
              <div className="font-medium text-lg">
                {priceComparison?.recommended?.leadTimeDays} day{priceComparison?.recommended?.leadTimeDays !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-[#6f6f6f] mt-1">
                Required by: {requiredBy || 'Not specified'}
              </div>
            </div>
          </div>

          {/* Flags */}
          {allocation.flags.length > 0 && (
            <div className="space-y-2">
              {allocation.flags.map((flag, index) => (
                <div 
                  key={index}
                  className={`p-3 flex items-start gap-3 ${
                    flag.severity === 'warning' ? 'bg-[#F5C518]/10 border border-[#F5C518]' :
                    flag.severity === 'critical' ? 'bg-[#da1e28]/10 border border-[#da1e28]' :
                    'bg-[#0f62fe]/10 border border-[#0f62fe]'
                  }`}
                >
                  <AlertCircle className={`w-5 h-5 shrink-0 ${
                    flag.severity === 'warning' ? 'text-[#F5C518]' :
                    flag.severity === 'critical' ? 'text-[#da1e28]' :
                    'text-[#0f62fe]'
                  }`} />
                  <div>
                    <div className="font-medium text-sm capitalize">{flag.type.replace('_', ' ')}</div>
                    <div className="text-sm">{flag.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Savings */}
          {allocation.priceComparison.savingsVsHighest > 0 && (
            <div className="bg-[#24a148]/10 border border-[#24a148] p-4">
              <div className="flex items-center gap-2 text-[#24a148]">
                <TrendingDown className="w-5 h-5" />
                <span className="font-medium">Cost Optimization</span>
              </div>
              <p className="text-sm mt-1">
                This allocation saves {formatPrice(allocation.priceComparison.savingsVsHighest)} compared to the highest-priced alternative ({allocation.priceComparison.savingsPercentage.toFixed(1)}%).
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-[#24a148] text-white flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-light mb-2">Request Submitted Successfully</h2>
      <p className="text-[#6f6f6f] mb-6">Your request has been sent for accountant review</p>
      <div className="text-sm bg-[#f4f4f4] p-4 max-w-md mx-auto mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-[#6f6f6f]">Request Number:</span>
          <span className="font-medium">PR-0046</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6f6f6f]">Status:</span>
          <span className="text-[#0f62fe] font-medium">Pending Review</span>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => router.push('/dashboard/requests')}
          className="px-6 py-2 bg-[#161616] text-white hover:bg-[#333]"
        >
          View My Requests
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 border border-[#161616] text-[#161616] hover:bg-[#f4f4f4]"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  // Main Render
  if (step === 'confirm') {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        {renderConfirmation()}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-[#161616]">New Purchase Request</h1>
        <p className="text-[#6f6f6f]">Select product and quantity. System will auto-allocate the best supplier.</p>
      </div>

      {renderStepIndicator()}

      <div className="bg-white border border-[#e0e0e0] p-6">
        {step === 'product' && renderProductSelection()}
        {step === 'quantity' && renderQuantitySelection()}
        {step === 'review' && renderReview()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={step === 'product'}
            className={`px-6 py-2 border border-[#8d8d8d] ${
              step === 'product' ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#161616]'
            }`}
          >
            Back
          </button>
          
          {step === 'review' ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518] flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2 bg-[#161616] text-white flex items-center gap-2 ${
                !canProceed() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'
              }`}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
    </div>
  );
}
