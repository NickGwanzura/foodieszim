'use client';

import { useState } from 'react';
import { Shield, AlertCircle, Save } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — THRESHOLD CONFIGURATION
// ═════════════════════════════════════════════════════════════════════════════

export default function ThresholdsPage() {
  const [directorThreshold, setDirectorThreshold] = useState(5000);
  const [budgetAlert, setBudgetAlert] = useState(80);
  const [autoEscalation, setAutoEscalation] = useState(true);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Threshold Configuration</h1>
        <p className="text-[#6f6f6f]">Configure approval thresholds and budget limits</p>
      </div>

      {/* Configuration Form */}
      <div className="bg-white border border-[#e0e0e0] max-w-2xl">
        <div className="p-4 border-b border-[#e0e0e0] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#F5C518]" />
          <h2 className="font-medium">Approval Thresholds</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Director Approval Threshold */}
          <div>
            <label className="block text-sm font-medium text-[#161616] mb-2">
              Director Approval Threshold (USD)
            </label>
            <input 
              type="number" 
              value={directorThreshold}
              onChange={(e) => setDirectorThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
            />
            <p className="text-xs text-[#6f6f6f] mt-1">
              Requests above this amount require Director approval
            </p>
          </div>

          {/* Budget Alert Threshold */}
          <div>
            <label className="block text-sm font-medium text-[#161616] mb-2">
              Budget Alert Threshold (%)
            </label>
            <input 
              type="number" 
              value={budgetAlert}
              onChange={(e) => setBudgetAlert(Number(e.target.value))}
              min="50"
              max="100"
              className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
            />
            <p className="text-xs text-[#6f6f6f] mt-1">
              Alert when branch budget utilization exceeds this percentage
            </p>
          </div>

          {/* Auto Escalation */}
          <div>
            <label className="block text-sm font-medium text-[#161616] mb-2">
              Exception Auto-Escalation
            </label>
            <select 
              value={autoEscalation ? 'enabled' : 'disabled'}
              onChange={(e) => setAutoEscalation(e.target.value === 'enabled')}
              className="w-full px-3 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
            >
              <option value="enabled">Enabled - All exceptions to Director</option>
              <option value="disabled">Disabled - Manual routing</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-[#e0e0e0]">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]">
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="bg-[#f4f4f4] p-4 max-w-2xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#0f62fe] shrink-0" />
          <div>
            <div className="font-medium text-sm">Current Approval Flow</div>
            <div className="text-sm text-[#6f6f6f] mt-1 space-y-1">
              <p>1. <strong>Shop Manager</strong> creates request</p>
              <p>2. <strong>Accountant</strong> validates budget & compliance</p>
              <p>3. <strong>Director</strong> approves if amount &gt; ${directorThreshold.toLocaleString()}</p>
              <p>4. <strong>Accountant</strong> releases funds after approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
