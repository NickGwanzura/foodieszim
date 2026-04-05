'use client';

import { Users, UserCheck, UserCog, Crown } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — USER MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

interface User {
  id: string;
  name: string;
  email: string;
  role: 'shopmanager' | 'accountant' | 'director';
  branch?: string;
  status: 'active' | 'inactive';
  avatarColor: string;
}

const mockUsers: User[] = [
  { id: 'usr1', name: 'Sarah Moyo', email: 'sarah.moyo@foodies.co.zw', role: 'shopmanager', branch: 'Avondale Shop', status: 'active', avatarColor: '#F5C518' },
  { id: 'usr2', name: 'Tendai Mutasa', email: 'tendai.mutasa@foodies.co.zw', role: 'shopmanager', branch: 'Eastgate Shop', status: 'active', avatarColor: '#0f62fe' },
  { id: 'usr3', name: 'Grace Chikomo', email: 'grace.chikomo@foodies.co.zw', role: 'accountant', status: 'active', avatarColor: '#24a148' },
  { id: 'usr4', name: 'Dr. James Ncube', email: 'james.ncube@foodies.co.zw', role: 'director', status: 'active', avatarColor: '#161616' },
];

const roleIcons = {
  shopmanager: UserCheck,
  accountant: UserCog,
  director: Crown,
};

const roleLabels = {
  shopmanager: 'Shop Manager',
  accountant: 'Accountant',
  director: 'Director',
};

export default function UsersPage() {
  const stats = {
    total: mockUsers.length,
    shopmanager: mockUsers.filter(u => u.role === 'shopmanager').length,
    accountant: mockUsers.filter(u => u.role === 'accountant').length,
    director: mockUsers.filter(u => u.role === 'director').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#161616]">Users & Roles</h1>
          <p className="text-[#6f6f6f]">Manage platform users and permissions</p>
        </div>
        <button className="px-4 py-2 bg-[#F5C518] text-[#161616] font-medium hover:bg-[#e5b518]">
          + Invite User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Total Users</p>
              <p className="text-2xl font-semibold text-[#161616]">{stats.total}</p>
            </div>
            <div className="p-2 bg-[#0f62fe]/10 text-[#0f62fe]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Shop Managers</p>
              <p className="text-2xl font-semibold text-[#F5C518]">{stats.shopmanager}</p>
            </div>
            <div className="p-2 bg-[#F5C518]/10 text-[#F5C518]">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Accountants</p>
              <p className="text-2xl font-semibold text-[#24a148]">{stats.accountant}</p>
            </div>
            <div className="p-2 bg-[#24a148]/10 text-[#24a148]">
              <UserCog className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6f6f6f]">Directors</p>
              <p className="text-2xl font-semibold text-[#161616]">{stats.director}</p>
            </div>
            <div className="p-2 bg-[#161616]/10 text-[#161616]">
              <Crown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#e0e0e0]">
        <div className="p-4 border-b border-[#e0e0e0]">
          <h2 className="font-medium">Platform Users</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#f4f4f4]">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">User</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Role</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Branch/Scope</th>
              <th className="text-left p-3 text-sm font-medium text-[#525252]">Email</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Status</th>
              <th className="text-center p-3 text-sm font-medium text-[#525252]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {mockUsers.map((user) => {
              const RoleIcon = roleIcons[user.role];
              return (
                <tr key={user.id} className="hover:bg-[#f4f4f4]">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: user.avatarColor }}
                      >
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="w-4 h-4 text-[#8d8d8d]" />
                      <span className="text-sm">{roleLabels[user.role]}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm">{user.branch || 'Head Office'}</td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 ${
                      user.status === 'active' ? 'bg-[#24a148]/10 text-[#24a148]' : 'bg-[#8d8d8d]/10 text-[#6f6f6f]'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button className="text-sm text-[#0f62fe] hover:underline">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
