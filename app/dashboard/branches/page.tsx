'use client';

import { Building, DollarSign, Users, MapPin } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — BRANCH MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  status: 'active' | 'inactive';
}

const mockBranches: Branch[] = [
  { id: 'br1', name: 'Avondale Shop', code: 'AVD', location: 'Avondale, Harare', manager: 'Sarah Moyo', status: 'active' },
  { id: 'br2', name: 'Eastgate Shop', code: 'ETG', location: 'Eastgate, Harare', manager: 'Tendai Mutasa', status: 'active' },
  { id: 'br3', name: 'Borrowdale', code: 'BRW', location: 'Borrowdale, Harare', manager: 'Linda Zimuto', status: 'active' },
  { id: 'br4', name: 'Westgate', code: 'WTG', location: 'Westgate, Harare', manager: 'Peter Moyo', status: 'active' },
];

export default function BranchesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Branch Management</h1>
          <p className="text-[#6f6f6f]">Manage branches and their configurations</p>
        </div>
        <button className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]">
          + Add Branch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Total Branches</p>
              <p className="text-2xl font-semibold text-[#161616]">{mockBranches.length}</p>
            </div>
            <div className="p-2 bg-[#0f62fe]/10 text-[#0f62fe]">
              <Building className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Active</p>
              <p className="text-2xl font-semibold text-[#24a148]">4</p>
            </div>
            <div className="p-2 bg-[#24a148]/10 text-[#24a148]">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Total Staff</p>
              <p className="text-2xl font-semibold text-[#161616]">24</p>
            </div>
            <div className="p-2 bg-[#F5C518]/10 text-[#F5C518]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Total Budget</p>
              <p className="text-2xl font-semibold text-[#161616]">$120k</p>
            </div>
            <div className="p-2 bg-[#da1e28]/10 text-[#da1e28]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0]">
          <h2 className="font-medium">Branch List</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Code</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Branch Name</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Location</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Manager</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {mockBranches.map((branch) => (
              <tr key={branch.id} className="hover:bg-[#f4f4f4]">
                <td className="p-3 font-mono text-sm">{branch.code}</td>
                <td className="p-3 font-medium">{branch.name}</td>
                <td className="p-3 text-sm">{branch.location}</td>
                <td className="p-3 text-sm">{branch.manager}</td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 ${
                    branch.status === 'active' ? 'bg-[#24a148]/10 text-[#24a148]' : 'bg-[#8d8d8d]/10 text-[#6f6f6f]'
                  }`}>
                    {branch.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button className="text-sm text-[#0f62fe] hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
