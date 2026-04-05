'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, roleLabels } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText,
  Truck,
  Scale,
  AlertCircle,
  Eye
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// DIRECTOR EXECUTIVE DASHBOARD — Strategic KPI Overview
// High-level metrics for board-level decision making
// ═════════════════════════════════════════════════════════════════════════════

const mockExecutiveData = {
  // Financial KPIs
  financial: {
    totalSpend: 245000,
    budget: 300000,
    previousPeriodSpend: 210000,
    committed: 45000,
    pendingApproval: 28000,
    savings: 12500,
    costVariance: 16.7, // % increase from previous
  },
  
  // Procurement KPIs
  procurement: {
    totalRequests: 156,
    approved: 142,
    rejected: 8,
    pending: 6,
    avgProcessingTime: 2.3, // days
    onTimeDelivery: 87, // %
  },
  
  // Supplier KPIs
  suppliers: {
    active: 24,
    newThisMonth: 3,
    performanceIssues: 2,
    avgRating: 4.2,
    contractsExpiring: 4,
  },
  
  // Inventory KPIs
  inventory: {
    totalValue: 89000,
    stockouts: 3,
    critical: 7,
    turnoverRate: 4.2,
    coverageDays: 18,
  },
  
  // Compliance KPIs
  compliance: {
    score: 94,
    violations: 3,
    pendingReceipts: 5,
    thresholdBreaches: 4,
    auditStatus: 'clean',
  },
  
  // Branch Performance
  branches: [
    { name: 'Avondale', spend: 85000, budget: 100000, requests: 52, efficiency: 92 },
    { name: 'Eastgate', spend: 72000, budget: 100000, requests: 48, efficiency: 88 },
    { name: 'Borrowdale', spend: 88000, budget: 100000, requests: 56, efficiency: 85 },
  ],
  
  // Alerts requiring attention
  alerts: [
    { type: 'critical', message: 'Cleaning Supplies budget at 95% utilization', action: '/dashboard/budgets' },
    { type: 'warning', message: '3 items currently out of stock', action: '/dashboard/stock' },
    { type: 'info', message: '2 supplier contracts expiring this month', action: '/dashboard/suppliers' },
  ],
  
  // Recent activity
  recentActivity: [
    { action: 'Budget adjustment approved', item: 'Equipment category +$5,000', time: '2 hours ago', user: 'Director' },
    { action: 'Threshold breach flagged', item: 'PR-0045 ($8,500)', time: '4 hours ago', user: 'System' },
    { action: 'New supplier onboarded', item: 'Fresh Foods Ltd', time: '1 day ago', user: 'Procurement' },
    { action: 'Price deviation approved', item: 'Sugar 2kg (+8.7%)', time: '1 day ago', user: 'Director' },
  ],
};

export default function DirectorDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success } = useToast();

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  // Calculate derived metrics
  const budgetUtilization = (mockExecutiveData.financial.totalSpend / mockExecutiveData.financial.budget) * 100;
  const approvalRate = (mockExecutiveData.procurement.approved / mockExecutiveData.procurement.totalRequests) * 100;
  const spendTrend = ((mockExecutiveData.financial.totalSpend - mockExecutiveData.financial.previousPeriodSpend) / mockExecutiveData.financial.previousPeriodSpend) * 100;

  const getTrendIcon = (value: number, isPositiveGood: boolean = true) => {
    const isPositive = value >= 0;
    const isGood = isPositiveGood ? isPositive : !isPositive;
    
    if (isPositive) {
      return <TrendingUp className={`w-4 h-4 ${isGood ? 'text-[#24a148]' : 'text-[#da1e28]'}`} />;
    }
    return <TrendingDown className={`w-4 h-4 ${isGood ? 'text-[#24a148]' : 'text-[#da1e28]'}`} />;
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <header className="bg-[#161616] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <span className="text-xl font-medium">FOODIES</span>
              <span className="text-[#F5C518]">|</span>
              <span className="text-sm text-gray-300">{roleLabels[user?.role || 'director']}</span>
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
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-light text-[#161616]">Executive Overview</h1>
          <p className="text-sm text-[#6f6f6f] mt-1">Strategic KPIs and performance metrics</p>
        </div>

        {/* Critical Alerts */}
        {mockExecutiveData.alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {mockExecutiveData.alerts.map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-4 border flex items-start gap-3 ${
                  alert.type === 'critical' ? 'bg-[#da1e28]/10 border-[#da1e28]' :
                  alert.type === 'warning' ? 'bg-[#F5C518]/10 border-[#F5C518]' :
                  'bg-[#0f62fe]/10 border-[#0f62fe]'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  alert.type === 'critical' ? 'text-[#da1e28]' :
                  alert.type === 'warning' ? 'text-[#9e6b00]' :
                  'text-[#0f62fe]'
                }`} />
                <div className="flex-1">
                  <p className={`font-medium ${
                    alert.type === 'critical' ? 'text-[#da1e28]' :
                    alert.type === 'warning' ? 'text-[#9e6b00]' :
                    'text-[#0f62fe]'
                  }`}>
                    {alert.message}
                  </p>
                </div>
                <button
                  onClick={() => router.push(alert.action)}
                  className="text-sm text-[#0f62fe] hover:underline flex items-center gap-1"
                >
                  View <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PRIMARY KPI ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Spend */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6f6f6f] uppercase tracking-wide">Total Spend</span>
              <DollarSign className="w-4 h-4 text-[#0f62fe]" />
            </div>
            <div className="text-2xl font-semibold text-[#161616]">
              ${(mockExecutiveData.financial.totalSpend / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(spendTrend, false)}
              <span className={`text-xs ${spendTrend > 0 ? 'text-[#da1e28]' : 'text-[#24a148]'}`}>
                {spendTrend > 0 ? '+' : ''}{spendTrend.toFixed(1)}%
              </span>
              <span className="text-xs text-[#6f6f6f]">vs last period</span>
            </div>
          </div>

          {/* Budget Utilization */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6f6f6f] uppercase tracking-wide">Budget Used</span>
              <Target className="w-4 h-4 text-[#F5C518]" />
            </div>
            <div className="text-2xl font-semibold text-[#161616]">{budgetUtilization.toFixed(0)}%</div>
            <div className="w-full h-1.5 bg-[#e0e0e0] mt-2">
              <div 
                className={`h-full ${budgetUtilization > 90 ? 'bg-[#da1e28]' : budgetUtilization > 75 ? 'bg-[#F5C518]' : 'bg-[#24a148]'}`}
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>
            <div className="text-xs text-[#6f6f6f] mt-1">
              ${((mockExecutiveData.financial.budget - mockExecutiveData.financial.totalSpend) / 1000).toFixed(0)}k remaining
            </div>
          </div>

          {/* Approval Rate */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6f6f6f] uppercase tracking-wide">Approval Rate</span>
              <CheckCircle className="w-4 h-4 text-[#24a148]" />
            </div>
            <div className="text-2xl font-semibold text-[#161616]">{approvalRate.toFixed(0)}%</div>
            <div className="text-xs text-[#24a148] mt-1">
              {mockExecutiveData.procurement.approved} of {mockExecutiveData.procurement.totalRequests} approved
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6f6f6f] uppercase tracking-wide">Avg Processing</span>
              <Clock className="w-4 h-4 text-[#6929c4]" />
            </div>
            <div className="text-2xl font-semibold text-[#161616]">{mockExecutiveData.procurement.avgProcessingTime}d</div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3 text-[#24a148]" />
              <span className="text-xs text-[#24a148]">On target</span>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6f6f6f] uppercase tracking-wide">Compliance</span>
              <Scale className="w-4 h-4 text-[#005f73]" />
            </div>
            <div className="text-2xl font-semibold text-[#161616]">{mockExecutiveData.compliance.score}%</div>
            <div className="text-xs text-[#da1e28] mt-1">
              {mockExecutiveData.compliance.violations} violations need attention
            </div>
          </div>

          {/* Cost Savings */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6f6f6f] uppercase tracking-wide">Cost Savings</span>
              <TrendingDown className="w-4 h-4 text-[#24a148]" />
            </div>
            <div className="text-2xl font-semibold text-[#24a148]">
              ${(mockExecutiveData.financial.savings / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-[#6f6f6f] mt-1">
              Below budget forecast
            </div>
          </div>
        </div>

        {/* SECONDARY METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Procurement Pipeline */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <h3 className="font-medium text-[#161616] mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0f62fe]" />
              Procurement Pipeline
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Pending Approval</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{mockExecutiveData.procurement.pending}</span>
                  <button 
                    onClick={() => router.push('/dashboard/approvals')}
                    className="text-xs text-[#0f62fe] hover:underline"
                  >
                    Review →
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Awaiting Delivery</span>
                <span className="text-lg font-semibold">{mockExecutiveData.procurement.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">On-Time Delivery</span>
                <span className="text-lg font-semibold text-[#24a148]">{mockExecutiveData.procurement.onTimeDelivery}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Committed Funds</span>
                <span className="text-lg font-semibold">${(mockExecutiveData.financial.committed / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>

          {/* Supplier Health */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <h3 className="font-medium text-[#161616] mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#6929c4]" />
              Supplier Health
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Active Suppliers</span>
                <span className="text-lg font-semibold">{mockExecutiveData.suppliers.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Average Rating</span>
                <span className="text-lg font-semibold text-[#F5C518]">{mockExecutiveData.suppliers.avgRating}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Performance Issues</span>
                <span className={`text-lg font-semibold ${mockExecutiveData.suppliers.performanceIssues > 0 ? 'text-[#da1e28]' : 'text-[#24a148]'}`}>
                  {mockExecutiveData.suppliers.performanceIssues}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Contracts Expiring</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-[#F5C518]">{mockExecutiveData.suppliers.contractsExpiring}</span>
                  <button 
                    onClick={() => router.push('/dashboard/suppliers')}
                    className="text-xs text-[#0f62fe] hover:underline"
                  >
                    View →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <h3 className="font-medium text-[#161616] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#da1e28]" />
              Inventory Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Total Value</span>
                <span className="text-lg font-semibold">${(mockExecutiveData.inventory.totalValue / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Stockouts</span>
                <span className={`text-lg font-semibold ${mockExecutiveData.inventory.stockouts > 0 ? 'text-[#da1e28]' : 'text-[#24a148]'}`}>
                  {mockExecutiveData.inventory.stockouts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Critical Stock</span>
                <span className={`text-lg font-semibold ${mockExecutiveData.inventory.critical > 5 ? 'text-[#F5C518]' : 'text-[#24a148]'}`}>
                  {mockExecutiveData.inventory.critical}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6f6f6f]">Turnover Rate</span>
                <span className="text-lg font-semibold">{mockExecutiveData.inventory.turnoverRate}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* BRANCH PERFORMANCE */}
        <div className="bg-white border border-[#e0e0e0] mb-6">
          <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center justify-between">
            <h3 className="font-medium text-[#161616] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0f62fe]" />
              Branch Performance
            </h3>
            <button 
              onClick={() => router.push('/dashboard/reports')}
              className="text-sm text-[#0f62fe] hover:underline"
            >
              Full Report →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f4f4]">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-[#525252]">Branch</th>
                  <th className="text-right p-3 text-sm font-medium text-[#525252]">Spend</th>
                  <th className="text-center p-3 text-sm font-medium text-[#525252]">Budget Util</th>
                  <th className="text-center p-3 text-sm font-medium text-[#525252]">Requests</th>
                  <th className="text-center p-3 text-sm font-medium text-[#525252]">Efficiency</th>
                  <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]">
                {mockExecutiveData.branches.map((branch) => {
                  const utilization = (branch.spend / branch.budget) * 100;
                  return (
                    <tr key={branch.name} className="hover:bg-[#f4f4f4]">
                      <td className="p-3 font-medium">{branch.name}</td>
                      <td className="p-3 text-right">${(branch.spend / 1000).toFixed(1)}k</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-[#e0e0e0]">
                            <div 
                              className={`h-full ${utilization > 90 ? 'bg-[#da1e28]' : utilization > 75 ? 'bg-[#F5C518]' : 'bg-[#24a148]'}`}
                              style={{ width: `${utilization}%` }}
                            />
                          </div>
                          <span className="text-xs w-10">{utilization.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">{branch.requests}</td>
                      <td className="p-3 text-center">{branch.efficiency}%</td>
                      <td className="p-3 text-center">
                        <span className={`text-xs px-2 py-1 ${
                          utilization > 90 ? 'bg-[#da1e28]/10 text-[#da1e28]' :
                          utilization > 75 ? 'bg-[#F5C518]/10 text-[#9e6b00]' :
                          'bg-[#24a148]/10 text-[#24a148]'
                        }`}>
                          {utilization > 90 ? 'Over Budget' : utilization > 75 ? 'Caution' : 'Healthy'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM ROW: Recent Activity & Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <h3 className="font-medium text-[#161616] mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6f6f6f]" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {mockExecutiveData.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-[#e0e0e0] last:border-0">
                  <div className="w-2 h-2 rounded-full bg-[#F5C518] mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#161616]">{activity.action}</p>
                    <p className="text-xs text-[#6f6f6f]">{activity.item}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#8d8d8d]">{activity.time}</span>
                      <span className="text-xs text-[#8d8d8d]">•</span>
                      <span className="text-xs text-[#8d8d8d]">{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Quick View */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <h3 className="font-medium text-[#161616] mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#005f73]" />
              Compliance Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-[#f4f4f4]">
                <span className="text-sm">Receipt Compliance</span>
                <span className="text-sm font-semibold">{mockExecutiveData.compliance.score}%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#f4f4f4]">
                <span className="text-sm">Pending Receipts</span>
                <span className="text-sm font-semibold text-[#da1e28]">{mockExecutiveData.compliance.pendingReceipts}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#f4f4f4]">
                <span className="text-sm">Threshold Breaches</span>
                <span className="text-sm font-semibold text-[#F5C518]">{mockExecutiveData.compliance.thresholdBreaches}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#e8f5e9]">
                <span className="text-sm">Audit Status</span>
                <span className="text-sm font-semibold text-[#24a148] capitalize">{mockExecutiveData.compliance.auditStatus}</span>
              </div>
            </div>
            <button 
              onClick={() => router.push('/dashboard/audit')}
              className="w-full mt-4 py-2 text-sm text-[#0f62fe] hover:bg-[#f4f4f4] border border-[#e0e0e0]"
            >
              View Audit Log
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => router.push('/dashboard/approvals')}
            className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]"
          >
            <CheckCircle className="w-4 h-4" />
            Pending Approvals ({mockExecutiveData.procurement.pending})
          </button>
          <button
            onClick={() => router.push('/dashboard/reports')}
            className="flex items-center gap-2 px-4 py-2 border border-[#161616] text-[#161616] hover:bg-[#f4f4f4]"
          >
            <FileText className="w-4 h-4" />
            Executive Reports
          </button>
          <button
            onClick={() => router.push('/dashboard/deviations')}
            className="flex items-center gap-2 px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
          >
            <Scale className="w-4 h-4" />
            Price Deviations
          </button>
          <button
            onClick={() => router.push('/dashboard/validation')}
            className="flex items-center gap-2 px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
          >
            <Package className="w-4 h-4" />
            Stock Validation
          </button>
        </div>
      </div>
    </div>
  );
}
