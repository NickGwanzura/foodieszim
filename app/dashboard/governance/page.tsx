'use client';

import { Shield, FileText, Users, AlertCircle, CheckCircle } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — GOVERNANCE DASHBOARD
// Director oversight of policies, thresholds, and compliance
// ═════════════════════════════════════════════════════════════════════════════

export default function GovernancePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#161616] text-white p-6">
        <h1 className="text-2xl font-light mb-2">Governance & Oversight</h1>
        <p className="text-[#c6c6c6]">Policy management, thresholds, and compliance monitoring</p>
      </div>

      {/* Governance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="text-sm text-[#6f6f6f]">Compliance Score</div>
          <div className="text-2xl font-semibold text-[#24a148]">96%</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="text-sm text-[#6f6f6f]">Active Policies</div>
          <div className="text-2xl font-semibold text-[#161616]">12</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="text-sm text-[#6f6f6f]">Pending Reviews</div>
          <div className="text-2xl font-semibold text-[#9e7c0b]">3</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="text-sm text-[#6f6f6f]">Audit Status</div>
          <div className="text-2xl font-semibold text-[#24a148]">Clean</div>
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#F5C518]" />
            <h2 className="font-medium">Approval Thresholds</h2>
          </div>
          <button className="text-sm text-[#0f62fe] hover:underline">Edit Thresholds</button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#e0e0e0] p-4">
              <div className="text-sm text-[#6f6f6f] mb-1">Accountant Review</div>
              <div className="text-xl font-semibold">All Requests</div>
              <div className="text-xs text-[#6f6f6f]">Budget validation required</div>
            </div>
            <div className="border border-[#e0e0e0] p-4">
              <div className="text-sm text-[#6f6f6f] mb-1">Director Approval</div>
              <div className="text-xl font-semibold">&gt; $5,000</div>
              <div className="text-xs text-[#6f6f6f]">Or budget exception</div>
            </div>
            <div className="border border-[#e0e0e0] p-4">
              <div className="text-sm text-[#6f6f6f] mb-1">Emergency Override</div>
              <div className="text-xl font-semibold">$10,000</div>
              <div className="text-xs text-[#6f6f6f]">Chairman approval required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h2 className="font-medium">Policy Compliance</h2>
          </div>
          <div className="divide-y divide-[#e0e0e0]">
            {[
              { policy: '4-Step Approval Process', status: 'active', compliance: '98%' },
              { policy: 'Budget Variance Threshold', status: 'active', compliance: '95%' },
              { policy: 'Supplier KYC Verification', status: 'active', compliance: '92%' },
              { policy: 'Asset Depreciation Schedule', status: 'review', compliance: '100%' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.status === 'active' ? (
                    <CheckCircle className="w-4 h-4 text-[#24a148]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#F5C518]" />
                  )}
                  <span>{item.policy}</span>
                </div>
                <span className={`text-sm ${
                  parseInt(item.compliance) >= 95 ? 'text-[#24a148]' : 'text-[#9e7c0b]'
                }`}>
                  {item.compliance}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h2 className="font-medium">Recent Audit Findings</h2>
          </div>
          <div className="divide-y divide-[#e0e0e0]">
            {[
              { finding: 'Missing receipt for PR-0032', severity: 'low', date: '2025-04-01' },
              { finding: 'Budget variance in Eastgate', severity: 'medium', date: '2025-03-28' },
              { finding: 'Supplier KYC expiring soon', severity: 'low', date: '2025-03-25' },
            ].map((item, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{item.finding}</span>
                  <span className={`text-xs px-2 py-1 ${
                    item.severity === 'high' ? 'bg-[#da1e28]/10 text-[#da1e28]' :
                    item.severity === 'medium' ? 'bg-[#F5C518]/10 text-[#9e7c0b]' :
                    'bg-[#0f62fe]/10 text-[#0f62fe]'
                  }`}>
                    {item.severity.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-[#6f6f6f]">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
