'use client';

import { useState } from 'react';
import { Search, Filter, FileText, User, Clock } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — SYSTEM AUDIT LOG
// ═════════════════════════════════════════════════════════════════════════════

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  role: string;
  entity: string;
  details: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: '1', timestamp: '2025-04-02T09:14:00Z', action: 'USER_LOGIN', user: 'Sarah Moyo', role: 'Shop Manager', entity: 'System', details: 'IP: 192.168.1.45' },
  { id: '2', timestamp: '2025-04-02T09:15:00Z', action: 'REQUEST_CREATED', user: 'Sarah Moyo', role: 'Shop Manager', entity: 'PR-0045', details: 'Amount: $99.00, Product: Cooking Oil' },
  { id: '3', timestamp: '2025-04-02T11:30:00Z', action: 'REQUEST_VALIDATED', user: 'Grace Chikomo', role: 'Accountant', entity: 'PR-0044', details: 'Approved for forwarding' },
  { id: '4', timestamp: '2025-04-02T14:00:00Z', action: 'BUDGET_UPDATED', user: 'Grace Chikomo', role: 'Accountant', entity: 'Avondale Shop', details: 'Monthly budget adjusted' },
  { id: '5', timestamp: '2025-04-01T16:30:00Z', action: 'FUNDS_RELEASED', user: 'Grace Chikomo', role: 'Accountant', entity: 'PR-0043', details: 'Payment ref: FT25678412' },
  { id: '6', timestamp: '2025-04-01T10:15:00Z', action: 'REQUEST_APPROVED', user: 'Dr. James Ncube', role: 'Director', entity: 'PR-0040', details: 'Threshold exception approved' },
  { id: '7', timestamp: '2025-03-31T09:30:00Z', action: 'SUPPLIER_KYC', user: 'Grace Chikomo', role: 'Accountant', entity: 'MegaFood Distributors', details: 'KYC documents verified' },
];

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = !filterAction || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">System Audit Log</h1>
        <p className="text-[#6f6f6f]">Track all platform activities and changes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d8d8d]" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border border-[#8d8d8d] focus:border-[#F5C518] focus:outline-none"
        >
          <option value="">All Actions</option>
          <option value="USER_LOGIN">User Login</option>
          <option value="REQUEST_CREATED">Request Created</option>
          <option value="REQUEST_VALIDATED">Request Validated</option>
          <option value="FUNDS_RELEASED">Funds Released</option>
          <option value="BUDGET_UPDATED">Budget Updated</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#8d8d8d] hover:border-[#161616]">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Timestamp</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Action</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">User</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Role</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Entity</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3 text-sm font-mono">{formatDate(log.timestamp)}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 bg-[#0f62fe]/10 text-[#0f62fe]">
                    {log.action}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-[#8d8d8d]" />
                    <span className="text-sm font-medium">{log.user}</span>
                  </div>
                </td>
                <td className="p-3 text-sm">{log.role}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-[#8d8d8d]" />
                    <span className="text-sm">{log.entity}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-[#525252]">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
