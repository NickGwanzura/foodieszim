'use client';

import { useState } from 'react';
import { DollarSign, Plus, Receipt, AlertCircle, CheckCircle, History } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — PETTY CASH MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

interface PettyCashTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'expense' | 'topup';
  receipt?: string;
}

const mockTransactions: PettyCashTransaction[] = [
  { id: 'tx1', date: '2025-04-02', description: 'Stationery supplies', category: 'Office', amount: 25, type: 'expense' },
  { id: 'tx2', date: '2025-04-02', description: 'Transport refund', category: 'Transport', amount: 15, type: 'expense' },
  { id: 'tx3', date: '2025-04-01', description: 'Cleaning supplies', category: 'Maintenance', amount: 45, type: 'expense' },
  { id: 'tx4', date: '2025-03-31', description: 'Monthly float top-up', category: 'Float', amount: 500, type: 'topup' },
  { id: 'tx5', date: '2025-03-30', description: 'Tea and coffee', category: 'Refreshments', amount: 35, type: 'expense' },
];

export default function PettyCashPage() {
  const [showNewTransaction, setShowNewTransaction] = useState(false);

  const floatBalance = 235;
  const monthlyLimit = 500;
  const spentThisMonth = 265;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Petty Cash</h1>
          <p className="text-[#6f6f6f]">Manage small expense reimbursements</p>
        </div>
        <button 
          onClick={() => setShowNewTransaction(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]"
        >
          <Plus className="w-4 h-4" />
          New Transaction
        </button>
      </div>

      {/* Float Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#24a148]/10 border border-[#24a148] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#24a148]">Current Balance</p>
              <p className="text-3xl font-semibold text-[#24a148]">${floatBalance}</p>
            </div>
            <div className="p-2 bg-[#24a148] text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Monthly Limit</p>
              <p className="text-2xl font-semibold text-[#161616]">${monthlyLimit}</p>
            </div>
            <div className="p-2 bg-[#f4f4f4] text-[#525252]">
              <History className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Spent This Month</p>
              <p className="text-2xl font-semibold text-[#161616]">${spentThisMonth}</p>
            </div>
            <div className="p-2 bg-[#f4f4f4] text-[#525252]">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 h-2 bg-[#e0e0e0]">
            <div className="h-full bg-[#F5C518]" style={{ width: '53%' }} />
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
          <h2 className="font-medium">Recent Transactions</h2>
          <button className="text-sm text-[#0f62fe] hover:underline">View All</button>
        </div>
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Date</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Description</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Category</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Type</th>
              <th className="text-right p-3 text-sm font-medium text-[#525252]">Amount</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {mockTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3 text-sm">{tx.date}</td>
                <td className="p-3">{tx.description}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 bg-[#f4f4f4]">{tx.category}</span>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${
                    tx.type === 'topup' ? 'bg-[#24a148]/10 text-[#24a148]' : 'bg-[#da1e28]/10 text-[#da1e28]'
                  }`}>
                    {tx.type.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right font-medium">${tx.amount}</td>
                <td className="p-3 text-center">
                  {tx.receipt ? (
                    <CheckCircle className="w-4 h-4 text-[#24a148] mx-auto" />
                  ) : (
                    <span className="text-xs text-[#6f6f6f]">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Float Alert */}
      {floatBalance < 50 && (
        <div className="bg-[#F5C518]/10 border border-[#F5C518] p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#9e7c0b] shrink-0" />
            <div>
              <div className="font-medium text-[#9e7c0b]">Low Float Balance</div>
              <p className="text-sm text-[#9e7c0b]">
                Current balance is below $50. Request top-up from Accountant.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
