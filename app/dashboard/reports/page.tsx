'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { useModal } from '@/lib/modal-context';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  FileText,
  Printer,
  Share2,
  Target,
  Activity,
  Scale,
  Truck,
  Receipt,
  X
} from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — DIRECTOR REPORTS & ANALYTICS
// Comprehensive executive reporting dashboard
// ═════════════════════════════════════════════════════════════════════════════

type ReportPeriod = 'week' | 'month' | 'quarter' | 'year';
type ReportCategory = 'financial' | 'procurement' | 'supplier' | 'inventory' | 'compliance' | 'operational';

interface ReportMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
}

const mockData = {
  // Financial Overview
  totalSpend: { current: 245000, previous: 210000, budget: 300000 },
  committedFunds: 45000,
  pendingApproval: 28000,
  savingsAchieved: 12500,
  
  // Procurement Metrics
  totalRequests: 156,
  approvedRequests: 142,
  rejectedRequests: 8,
  avgProcessingTime: 2.3, // days
  
  // Supplier Performance
  activeSuppliers: 24,
  newSuppliers: 3,
  supplierIssues: 2,
  onTimeDelivery: 87, // percentage
  
  // Inventory Health
  stockouts: 3,
  criticalStock: 7,
  inventoryValue: 89000,
  turnoverRate: 4.2,
  
  // Price Deviations
  totalDeviations: 18,
  deviationCost: 8500,
  pendingReceipts: 5,
  
  // Branch Performance
  branchData: [
    { name: 'Avondale', spend: 85000, requests: 52, budgetUtil: 85 },
    { name: 'Eastgate', spend: 72000, requests: 48, budgetUtil: 72 },
    { name: 'Borrowdale', spend: 88000, requests: 56, budgetUtil: 92 },
  ],
  
  // Category Breakdown
  categorySpend: [
    { name: 'Food Ingredients', value: 95000, budget: 100000 },
    { name: 'Equipment', value: 45000, budget: 50000 },
    { name: 'Utilities', value: 32000, budget: 35000 },
    { name: 'Cleaning', value: 18000, budget: 20000 },
    { name: 'Marketing', value: 12000, budget: 15000 },
  ],
  
  // Compliance Metrics
  complianceScore: 94,
  policyViolations: 3,
  receiptCompliance: 91, // percentage
  thresholdBreaches: 4,
};

const reportsList = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    category: 'operational',
    description: 'High-level overview of all key metrics and performance indicators',
    icon: Activity,
    frequency: 'Daily / Weekly',
  },
  {
    id: 'financial-performance',
    title: 'Financial Performance Report',
    category: 'financial',
    description: 'Detailed spend analysis, budget utilization, and cost trends',
    icon: DollarSign,
    frequency: 'Monthly',
  },
  {
    id: 'procurement-efficiency',
    title: 'Procurement Efficiency Analysis',
    category: 'procurement',
    description: 'Request processing times, approval bottlenecks, and workflow metrics',
    icon: TrendingUp,
    frequency: 'Weekly',
  },
  {
    id: 'supplier-scorecard',
    title: 'Supplier Performance Scorecard',
    category: 'supplier',
    description: 'Supplier ratings, delivery performance, and quality metrics',
    icon: Truck,
    frequency: 'Monthly',
  },
  {
    id: 'inventory-health',
    title: 'Inventory Health Report',
    category: 'inventory',
    description: 'Stock levels, turnover rates, and reorder recommendations',
    icon: Package,
    frequency: 'Weekly',
  },
  {
    id: 'price-deviation',
    title: 'Price Deviation Analysis',
    category: 'financial',
    description: 'Variance tracking, cost impact analysis, and trend identification',
    icon: Scale,
    frequency: 'Monthly',
  },
  {
    id: 'compliance-audit',
    title: 'Compliance & Governance Audit',
    category: 'compliance',
    description: 'Policy adherence, approval compliance, and audit trail summary',
    icon: CheckCircle,
    frequency: 'Quarterly',
  },
  {
    id: 'branch-comparison',
    title: 'Branch Performance Comparison',
    category: 'operational',
    description: 'Cross-branch spend analysis and efficiency benchmarking',
    icon: Building2,
    frequency: 'Monthly',
  },
  {
    id: 'cost-of-sales',
    title: 'Cost of Sales Impact Report',
    category: 'financial',
    description: 'COS analysis, margin impact, and cost driver identification',
    icon: PieChart,
    frequency: 'Monthly',
  },
  {
    id: 'exception-report',
    title: 'Exception & Variance Report',
    category: 'compliance',
    description: 'Threshold breaches, policy exceptions, and unusual patterns',
    icon: AlertTriangle,
    frequency: 'Weekly',
  },
];

export default function DirectorReportsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const { openModal } = useModal();
  
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const filteredReports = selectedCategory === 'all' 
    ? reportsList 
    : reportsList.filter(r => r.category === selectedCategory);

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReport(reportId);
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(null);
      setShowGenerateModal(false);
      success('Report Generated', `${reportsList.find(r => r.id === reportId)?.title} has been generated successfully`);
    }, 2000);
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    success('Export Started', `Report is being exported as ${format.toUpperCase()}`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      financial: 'bg-[#24a148]',
      procurement: 'bg-[#0f62fe]',
      supplier: 'bg-[#6929c4]',
      inventory: 'bg-[#F5C518]',
      compliance: 'bg-[#da1e28]',
      operational: 'bg-[#161616]',
    };
    return colors[category] || 'bg-[#8d8d8d]';
  };

  // Calculate key metrics
  const budgetUtilization = (mockData.totalSpend.current / mockData.totalSpend.budget) * 100;
  const approvalRate = (mockData.approvedRequests / mockData.totalRequests) * 100;
  const spendVariance = ((mockData.totalSpend.current - mockData.totalSpend.previous) / mockData.totalSpend.previous) * 100;

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
              <span className="text-sm text-gray-300">Director Reports</span>
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
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-light text-[#161616]">Executive Reports & Analytics</h1>
          <p className="text-sm text-[#6f6f6f] mt-1">Comprehensive reporting for strategic decision making</p>
        </div>

        {/* Period Selector */}
        <div className="bg-white border border-[#e0e0e0] p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#6f6f6f]" />
              <span className="text-sm font-medium text-[#161616]">Reporting Period:</span>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'quarter', 'year'] as ReportPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 text-sm font-medium border-2 transition-all ${
                    selectedPeriod === period
                      ? 'border-[#F5C518] bg-[#F5C518] text-[#161616]'
                      : 'border-[#e0e0e0] text-[#525252] hover:border-[#8d8d8d]'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => handleExportReport('pdf')}
                className="flex items-center gap-2 px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                type="button"
                onClick={handlePrintReport}
                className="flex items-center gap-2 px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="text-sm text-[#6f6f6f]">Total Spend</div>
            <div className="text-xl font-semibold text-[#161616]">${(mockData.totalSpend.current / 1000).toFixed(1)}k</div>
            <div className={`text-xs ${spendVariance > 0 ? 'text-[#da1e28]' : 'text-[#24a148]'}`}>
              {spendVariance > 0 ? '↑' : '↓'} {Math.abs(spendVariance).toFixed(1)}% vs last period
            </div>
          </div>
          
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="text-sm text-[#6f6f6f]">Budget Utilization</div>
            <div className="text-xl font-semibold text-[#161616]">{budgetUtilization.toFixed(0)}%</div>
            <div className="w-full h-1 bg-[#e0e0e0] mt-1">
              <div 
                className={`h-full ${budgetUtilization > 90 ? 'bg-[#da1e28]' : budgetUtilization > 75 ? 'bg-[#F5C518]' : 'bg-[#24a148]'}`}
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="text-sm text-[#6f6f6f]">Approval Rate</div>
            <div className="text-xl font-semibold text-[#161616]">{approvalRate.toFixed(0)}%</div>
            <div className="text-xs text-[#24a148]">{mockData.approvedRequests} approved</div>
          </div>
          
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="text-sm text-[#6f6f6f]">Avg Processing</div>
            <div className="text-xl font-semibold text-[#161616]">{mockData.avgProcessingTime}d</div>
            <div className="text-xs text-[#6f6f6f]">Target: 2.0d</div>
          </div>
          
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="text-sm text-[#6f6f6f]">Compliance Score</div>
            <div className="text-xl font-semibold text-[#161616]">{mockData.complianceScore}%</div>
            <div className="text-xs text-[#24a148]">{mockData.policyViolations} violations</div>
          </div>
          
          <div className="bg-white border border-[#e0e0e0] p-4">
            <div className="text-sm text-[#6f6f6f]">Cost Savings</div>
            <div className="text-xl font-semibold text-[#24a148]">${(mockData.savingsAchieved / 1000).toFixed(1)}k</div>
            <div className="text-xs text-[#24a148]">vs budget forecast</div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Financial Summary */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#24a148]" />
              Financial Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Total Committed</span>
                <span className="font-medium">${mockData.committedFunds.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Pending Approval</span>
                <span className="font-medium">${mockData.pendingApproval.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Budget Remaining</span>
                <span className="font-medium text-[#24a148]">${(mockData.totalSpend.budget - mockData.totalSpend.current).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Procurement Status */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0f62fe]" />
              Procurement Status
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Total Requests</span>
                <span className="font-medium">{mockData.totalRequests}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Price Deviations</span>
                <span className="font-medium text-[#F5C518]">{mockData.totalDeviations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Pending Receipts</span>
                <span className="font-medium text-[#da1e28]">{mockData.pendingReceipts}</span>
              </div>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white border border-[#e0e0e0] p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#da1e28]" />
              Inventory Alerts
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Stockouts</span>
                <span className="font-medium text-[#da1e28]">{mockData.stockouts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Critical Stock</span>
                <span className="font-medium text-[#F5C518]">{mockData.criticalStock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6f6f6f]">Inventory Value</span>
                <span className="font-medium">${mockData.inventoryValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#6f6f6f]" />
          <span className="text-sm font-medium text-[#161616]">Filter by Category:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-sm ${
                selectedCategory === 'all' 
                  ? 'bg-[#161616] text-white' 
                  : 'bg-white border border-[#e0e0e0] text-[#525252] hover:border-[#8d8d8d]'
              }`}
            >
              All
            </button>
            {(['financial', 'procurement', 'supplier', 'inventory', 'compliance', 'operational'] as ReportCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-sm capitalize ${
                  selectedCategory === cat 
                    ? 'bg-[#161616] text-white' 
                    : 'bg-white border border-[#e0e0e0] text-[#525252] hover:border-[#8d8d8d]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const Icon = report.icon;
            const isGenerating = generatingReport === report.id;
            
            return (
              <div 
                key={report.id} 
                className="bg-white border border-[#e0e0e0] p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 ${getCategoryColor(report.category)}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-[#6f6f6f] bg-[#f4f4f4] px-2 py-1">
                    {report.frequency}
                  </span>
                </div>
                
                <h3 className="font-medium text-[#161616] mb-2">{report.title}</h3>
                <p className="text-sm text-[#6f6f6f] mb-4">{report.description}</p>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={isGenerating}
                    className="flex-1 py-2 bg-[#F5C518] text-[#161616] text-sm font-medium hover:bg-[#e5b518] disabled:bg-[#e0e0e0] disabled:text-[#a8a8a8] transition-colors"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate Report'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => showError('Schedule Report', 'Report scheduling would be configured here')}
                    className="px-3 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Branch Comparison Chart */}
        <div className="mt-8 bg-white border border-[#e0e0e0] p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0f62fe]" />
            Branch Performance Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f4f4]">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-[#525252]">Branch</th>
                  <th className="text-right p-3 text-sm font-medium text-[#525252]">Total Spend</th>
                  <th className="text-center p-3 text-sm font-medium text-[#525252]">Requests</th>
                  <th className="text-center p-3 text-sm font-medium text-[#525252]">Budget Utilization</th>
                  <th className="text-center p-3 text-sm font-medium text-[#525252]">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]">
                {mockData.branchData.map((branch) => (
                  <tr key={branch.name} className="hover:bg-[#f4f4f4]">
                    <td className="p-3 font-medium">{branch.name}</td>
                    <td className="p-3 text-right">${branch.spend.toLocaleString()}</td>
                    <td className="p-3 text-center">{branch.requests}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#e0e0e0]">
                          <div 
                            className={`h-full ${branch.budgetUtil > 90 ? 'bg-[#da1e28]' : branch.budgetUtil > 75 ? 'bg-[#F5C518]' : 'bg-[#24a148]'}`}
                            style={{ width: `${branch.budgetUtil}%` }}
                          />
                        </div>
                        <span className="text-xs w-10">{branch.budgetUtil}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-2 py-1 ${
                        branch.budgetUtil > 90 ? 'bg-[#da1e28]/10 text-[#da1e28]' : 
                        branch.budgetUtil > 75 ? 'bg-[#F5C518]/10 text-[#9e7c0b]' : 
                        'bg-[#24a148]/10 text-[#24a148]'
                      }`}>
                        {branch.budgetUtil > 90 ? 'Over Budget' : branch.budgetUtil > 75 ? 'Caution' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Spend Breakdown */}
        <div className="mt-6 bg-white border border-[#e0e0e0] p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#6929c4]" />
            Spend by Category
          </h3>
          <div className="space-y-3">
            {mockData.categorySpend.map((cat) => {
              const utilization = (cat.value / cat.budget) * 100;
              return (
                <div key={cat.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium">{cat.name}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-[#e0e0e0]">
                        <div 
                          className={`h-full ${utilization > 90 ? 'bg-[#da1e28]' : utilization > 75 ? 'bg-[#F5C518]' : 'bg-[#24a148]'}`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs w-24 text-right">
                        ${cat.value.toLocaleString()} / ${cat.budget.toLocaleString()}
                      </span>
                      <span className={`text-xs w-12 ${utilization > 90 ? 'text-[#da1e28]' : utilization > 75 ? 'text-[#F5C518]' : 'text-[#24a148]'}`}>
                        {utilization.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#e0e0e0]">
          <div className="text-sm text-[#6f6f6f]">
            Last updated: {new Date().toLocaleString()}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => showError('Share Reports', 'Report sharing options would appear here')}
              className="flex items-center gap-2 px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
            >
              <Share2 className="w-4 h-4" />
              Share with Board
            </button>
            <button
              type="button"
              onClick={() => success('Reports Archived', 'All reports have been archived successfully')}
              className="flex items-center gap-2 px-4 py-2 bg-[#161616] text-white hover:bg-[#333]"
            >
              <FileText className="w-4 h-4" />
              Archive Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
