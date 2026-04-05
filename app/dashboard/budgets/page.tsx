'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { DollarSign, AlertCircle, CheckCircle, TrendingUp, Building, X, Plus, Minus } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — BUDGET MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

interface Budget {
  id: string;
  category: string;
  allocated: number;
  committed: number;
  spent: number;
  available: number;
  status: 'healthy' | 'caution' | 'critical';
}

const mockBudgets: Budget[] = [
  { id: 'b1', category: 'Food Ingredients', allocated: 15000, committed: 4200, spent: 8500, available: 2300, status: 'caution' },
  { id: 'b2', category: 'Meat & Poultry', allocated: 12000, committed: 1800, spent: 6500, available: 3700, status: 'healthy' },
  { id: 'b3', category: 'Cleaning Supplies', allocated: 3000, committed: 400, spent: 2100, available: 500, status: 'critical' },
  { id: 'b4', category: 'Equipment', allocated: 8000, committed: 2500, spent: 1200, available: 4300, status: 'healthy' },
  { id: 'b5', category: 'Utilities', allocated: 5000, committed: 800, spent: 3200, available: 1000, status: 'caution' },
  { id: 'b6', category: 'Marketing', allocated: 4000, committed: 0, spent: 1800, available: 2200, status: 'healthy' },
];

export default function BudgetsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [adjustForm, setAdjustForm] = useState({
    newAllocated: 0,
    reason: '',
  });

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const isShopManager = user?.role === 'shopmanager';
  const isAccountant = user?.role === 'accountant';

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalCommitted = budgets.reduce((sum, b) => sum + b.committed, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalAvailable = budgets.reduce((sum, b) => sum + b.available, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-[#24a148] text-white';
      case 'caution': return 'bg-[#F5C518] text-[#161616]';
      case 'critical': return 'bg-[#da1e28] text-white';
      default: return 'bg-[#e0e0e0] text-[#525252]';
    }
  };

  const handleOpenAdjust = (budget?: Budget) => {
    setSelectedBudget(budget || null);
    setAdjustForm({
      newAllocated: budget?.allocated || 0,
      reason: '',
    });
    setShowAdjustModal(true);
  };

  const handleSubmitAdjustment = () => {
    if (!adjustForm.reason.trim()) {
      showError('Reason Required', 'Please provide a reason for the budget adjustment');
      return;
    }

    if (selectedBudget) {
      // Update specific budget
      setBudgets(prev => prev.map(b => 
        b.id === selectedBudget.id 
          ? { ...b, allocated: adjustForm.newAllocated, available: adjustForm.newAllocated - b.spent - b.committed }
          : b
      ));
      success('Budget Updated', `${selectedBudget.category} budget adjusted to $${adjustForm.newAllocated.toLocaleString()}`);
    } else {
      // Would create new budget category
      success('Budget Created', 'New budget category would be created');
    }

    setShowAdjustModal(false);
    setSelectedBudget(null);
    setAdjustForm({ newAllocated: 0, reason: '' });
  };

  const handleViewBudgetDetails = (budget: Budget) => {
    const utilization = ((budget.spent + budget.committed) / budget.allocated) * 100;
    showError('Budget Details', 
      `${budget.category}: $${budget.spent.toLocaleString()} spent + $${budget.committed.toLocaleString()} committed = ${utilization.toFixed(1)}% utilized`
    );
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
              <span className="text-sm text-gray-300">Budget Management</span>
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

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-[#161616]">
              {isShopManager ? 'Budget Status' : 'Budget Management'}
            </h1>
            <p className="text-[#6f6f6f]">
              {isShopManager ? 'View your branch budget allocation' : 'Manage budgets across all branches'}
            </p>
          </div>
          {isAccountant && (
            <button 
              type="button"
              onClick={() => handleOpenAdjust()}
              className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518] active:scale-95 transition-all"
            >
              + Adjust Budget
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e0e0e0] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6f6f6f]">Total Allocated</p>
                <p className="text-2xl font-semibold text-[#161616]">${(totalAllocated / 1000).toFixed(1)}k</p>
              </div>
              <div className="p-2 bg-[#0f62fe]/10 text-[#0f62fe]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-[#e0e0e0] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6f6f6f]">Committed</p>
                <p className="text-2xl font-semibold text-[#161616]">${(totalCommitted / 1000).toFixed(1)}k</p>
              </div>
              <div className="p-2 bg-[#F5C518]/10 text-[#F5C518]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-[#e0e0e0] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6f6f6f]">Spent</p>
                <p className="text-2xl font-semibold text-[#161616]">${(totalSpent / 1000).toFixed(1)}k</p>
              </div>
              <div className="p-2 bg-[#da1e28]/10 text-[#da1e28]">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-[#e0e0e0] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6f6f6f]">Available</p>
                <p className="text-2xl font-semibold text-[#24a148]">${(totalAvailable / 1000).toFixed(1)}k</p>
              </div>
              <div className="p-2 bg-[#24a148]/10 text-[#24a148]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Table */}
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h2 className="font-medium">Budget by Category</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#f4f4f4]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#525252]">Category</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Allocated</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Committed</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Spent</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Available</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Utilization</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
                {isAccountant && (
                  <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {budgets.map((budget) => {
                const utilization = ((budget.spent + budget.committed) / budget.allocated) * 100;
                return (
                  <tr key={budget.id} className="hover:bg-[#f4f4f4]">
                    <td className="p-3 font-medium">{budget.category}</td>
                    <td className="p-3 text-right">${budget.allocated.toLocaleString()}</td>
                    <td className="p-3 text-right">${budget.committed.toLocaleString()}</td>
                    <td className="p-3 text-right">${budget.spent.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium">${budget.available.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#e0e0e0]">
                          <div 
                            className={`h-full ${
                              utilization > 90 ? 'bg-[#da1e28]' : 
                              utilization > 75 ? 'bg-[#F5C518]' : 
                              'bg-[#24a148]'
                            }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs w-10">{utilization.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-2 py-1 ${getStatusColor(budget.status)}`}>
                        {budget.status.toUpperCase()}
                      </span>
                    </td>
                    {isAccountant && (
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenAdjust(budget)}
                          className="text-sm text-[#0f62fe] hover:underline"
                        >
                          Adjust
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        {budgets.some(b => b.status === 'critical') && (
          <div className="bg-[#da1e28]/10 border border-[#da1e28] p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#da1e28] shrink-0" />
              <div>
                <div className="font-medium text-[#da1e28]">Budget Alert</div>
                <p className="text-sm text-[#da1e28]">
                  {budgets.filter(b => b.status === 'critical').map(b => b.category).join(', ')} 
                  {' '}(categories) have exceeded 90% utilization. Consider reviewing upcoming requests.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adjust Budget Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
              <h2 className="text-lg font-medium">
                {selectedBudget ? `Adjust ${selectedBudget.category} Budget` : 'Create New Budget'}
              </h2>
              <button 
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="p-1 hover:bg-[#f4f4f4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {selectedBudget && (
                <div className="bg-[#f4f4f4] p-4">
                  <div className="text-sm text-[#6f6f6f]">Current Allocation</div>
                  <div className="text-2xl font-semibold">${selectedBudget.allocated.toLocaleString()}</div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <div className="text-[#6f6f6f]">Spent</div>
                      <div className="font-medium">${selectedBudget.spent.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[#6f6f6f]">Committed</div>
                      <div className="font-medium">${selectedBudget.committed.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[#6f6f6f]">Available</div>
                      <div className="font-medium">${selectedBudget.available.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* New Allocation */}
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">
                  {selectedBudget ? 'New Allocation Amount' : 'Allocation Amount'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f6f6f]">$</span>
                  <input
                    type="number"
                    min={0}
                    value={adjustForm.newAllocated || ''}
                    onChange={(e) => setAdjustForm(prev => ({ ...prev, newAllocated: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
                    placeholder="Enter amount..."
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-[#161616] mb-1">
                  Reason for Adjustment <span className="text-[#da1e28]">*</span>
                </label>
                <textarea
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none resize-none"
                  placeholder="Explain why this budget adjustment is needed..."
                />
              </div>

              {selectedBudget && adjustForm.newAllocated > 0 && (
                <div className="bg-[#edf5ff] p-3 border border-[#0f62fe]">
                  <div className="text-sm text-[#0f62fe]">
                    Change: ${(adjustForm.newAllocated - selectedBudget.allocated).toLocaleString()} 
                    ({adjustForm.newAllocated > selectedBudget.allocated ? '+' : ''}
                    {((adjustForm.newAllocated - selectedBudget.allocated) / selectedBudget.allocated * 100).toFixed(1)}%)
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitAdjustment}
                disabled={!adjustForm.reason.trim() || adjustForm.newAllocated <= 0}
                className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518] disabled:bg-[#e0e0e0] disabled:text-[#a8a8a8]"
              >
                {selectedBudget ? 'Save Adjustment' : 'Create Budget'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
