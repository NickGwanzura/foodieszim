'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — 6-ROLE AUTHENTICATION SYSTEM
// Shop Manager | Storesman | Accountant | Director | Supplier | Admin
// ═════════════════════════════════════════════════════════════════════════════

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, branchId?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  can: (action: string) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ═════════════════════════════════════════════════════════════════════════════
// ROLE PERMISSIONS MATRIX
// ═════════════════════════════════════════════════════════════════════════════

const rolePermissions: Record<UserRole, string[]> = {
  shopmanager: [
    // Request management
    'request:create',
    'request:view_own',
    'request:cancel',
    'request:respond_to_storesman',
    
    // Product & pricing visibility
    'product:view',
    'price:view_changes',
    
    // Petty cash
    'pettycash:view',
    'pettycash:request',
    
    // Budget visibility
    'budget:view_own',
    
    // Asset visibility
    'asset:view_branch',
    'asset:request',
    
    // Stock visibility (read-only)
    'stock:view',
    'stock:view_cover',
    
    // Notifications
    'notification:receive',
  ],
  
  storesman: [
    // Stock management
    'stock:view',
    'stock:manage',
    'stock:validate_requests',
    'stock:record_movement',
    'stock:count',
    
    // Request validation (Step 2)
    'request:validate_stock',
    'request:reject',
    'request:return',
    'request:view_branch',
    
    // Delivery management
    'delivery:confirm',
    'delivery:record_discrepancy',
    
    // Product visibility
    'product:view',
    'usage_trend:view',
    
    // Notifications
    'notification:receive_stock',
    'notification:alert_manager',
  ],
  
  accountant: [
    // Financial validation (Step 3)
    'request:validate_budget',
    'request:validate_receipt',
    'request:validate_price',
    'request:return',
    'request:track_invalid',
    
    // Disbursement (Step 7)
    'funds:release',
    'disbursement:manage',
    
    // Budget management
    'budget:manage',
    'budget:allocate',
    'budget:view_all',
    
    // Supplier management
    'supplier:view',
    'supplier:kyc',
    'supplier:track_performance',
    
    // Price intelligence
    'price:view_all',
    'deviation:review',
    'deviation:approve',
    
    // Receipt validation
    'receipt:validate',
    'receipt:flag_missing',
    
    // Cost tracking
    'cos:view_impact',
    'financial:reports',
    
    // Petty cash
    'pettycash:manage',
    
    // Invalid requests
    'invalid:view',
    'invalid:resolve',
    
    // All views
    'stock:view',
    'request:view_all',
    'audit:view',
  ],
  
  director: [
    // Exception approval (Step 4)
    'request:approve',
    'request:reject',
    'exception:approve',
    
    // Governance
    'governance:view',
    'threshold:set',
    'policy:configure',
    
    // Executive visibility
    'all:view',
    'executive:reports',
    'kpi:view',
    
    // Deviation approval
    'deviation:approve_exception',
    'receipt:waive_requirement',
    
    // Budget oversight
    'budget:approve_overrun',
    
    // Audit
    'audit:view',
    'audit:investigate',
  ],
  
  supplier: [
    // Portal access
    'portal:access',
    'product:manage_own',
    'price:update',
    'price:upload_bulk',
    
    // Order visibility
    'order:view_own',
    'order:fulfil',
    'order:update_status',
    
    // Performance
    'performance:view_own',
    'invoice:submit',
  ],
  
  admin: [
    // System configuration
    'config:manage',
    'user:manage',
    'role:assign',
    'integration:configure',
    'threshold:configure',
    
    // Technical only - no financial approval
    'system:audit',
    'backup:manage',
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// MOCK USERS FOR 6-ROLE MODEL
// ═════════════════════════════════════════════════════════════════════════════

const mockUsers: User[] = [
  {
    id: 'usr_001',
    name: 'Sarah Moyo',
    email: 'sarah.moyo@foodies.co.zw',
    role: 'shopmanager',
    branchId: 'br_001',
    branchName: 'Avondale Shop',
    avatarColor: '#F5C518',
    isActive: true,
    lastLoginAt: '2025-04-02T08:30:00Z',
    createdAt: '2024-01-15',
    notificationSettings: { email: true, sms: true, push: true },
    phoneNumber: '+263 77 123 4567',
  },
  {
    id: 'usr_002',
    name: 'Tendai Mutasa',
    email: 'tendai.mutasa@foodies.co.zw',
    role: 'shopmanager',
    branchId: 'br_002',
    branchName: 'Eastgate Shop',
    avatarColor: '#0f62fe',
    isActive: true,
    lastLoginAt: '2025-04-02T07:45:00Z',
    createdAt: '2024-01-15',
    notificationSettings: { email: true, sms: false, push: true },
    phoneNumber: '+263 77 234 5678',
  },
  {
    id: 'usr_003',
    name: 'John Ncube',
    email: 'john.ncube@foodies.co.zw',
    role: 'storesman',
    branchId: 'br_001',
    branchName: 'Avondale Shop',
    avatarColor: '#6929c4',
    isActive: true,
    lastLoginAt: '2025-04-02T06:00:00Z',
    createdAt: '2024-01-10',
    notificationSettings: { email: true, sms: true, push: true },
    phoneNumber: '+263 77 345 6789',
  },
  {
    id: 'usr_004',
    name: 'Grace Chikomo',
    email: 'grace.chikomo@foodies.co.zw',
    role: 'accountant',
    avatarColor: '#24a148',
    isActive: true,
    lastLoginAt: '2025-04-02T08:00:00Z',
    createdAt: '2024-01-10',
    notificationSettings: { email: true, sms: true, push: true },
    phoneNumber: '+263 77 456 7890',
  },
  {
    id: 'usr_005',
    name: 'Dr. James Ncube',
    email: 'james.ncube@foodies.co.zw',
    role: 'director',
    avatarColor: '#161616',
    isActive: true,
    lastLoginAt: '2025-04-01T17:30:00Z',
    createdAt: '2024-01-01',
    notificationSettings: { email: true, sms: true, push: false },
    phoneNumber: '+263 77 567 8901',
  },
  {
    id: 'usr_006',
    name: 'Peter Dube',
    email: 'peter.dube@foodies.co.zw',
    role: 'storesman',
    branchId: 'br_002',
    branchName: 'Eastgate Shop',
    avatarColor: '#9f1853',
    isActive: true,
    lastLoginAt: '2025-04-02T05:30:00Z',
    createdAt: '2024-02-01',
    notificationSettings: { email: true, sms: true, push: true },
    phoneNumber: '+263 77 678 9012',
  },
  {
    id: 'usr_sup1',
    name: 'MegaFood Distributors',
    email: 'orders@megafood.co.zw',
    role: 'supplier',
    supplierId: 'sup2',
    avatarColor: '#005f73',
    isActive: true,
    lastLoginAt: '2025-04-02T09:00:00Z',
    createdAt: '2024-01-01',
    notificationSettings: { email: true, sms: false, push: false },
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// AUTH PROVIDER
// ═════════════════════════════════════════════════════════════════════════════

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((role: UserRole, branchId?: string) => {
    // Find user by role (and optionally branch for demo)
    let foundUser = mockUsers.find(u => 
      u.role === role && 
      u.isActive &&
      (branchId ? u.branchId === branchId : true)
    );
    
    // Fallback to first user with that role
    if (!foundUser) {
      foundUser = mockUsers.find(u => u.role === role && u.isActive);
    }
    
    if (foundUser) {
      setUser({
        ...foundUser,
        lastLoginAt: new Date().toISOString(),
      });
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const can = useCallback((action: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role].includes(action) || 
           rolePermissions[user.role].includes('all:view');
  }, [user]);

  const hasRole = useCallback((roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      can,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ═════════════════════════════════════════════════════════════════════════════
// ROLE DISPLAY HELPERS
// ═════════════════════════════════════════════════════════════════════════════

export const roleLabels: Record<UserRole, string> = {
  shopmanager: 'Shop Manager',
  storesman: 'Storesman',
  accountant: 'Accountant',
  director: 'Director',
  supplier: 'Supplier',
  admin: 'System Admin',
};

export const roleDescriptions: Record<UserRole, string> = {
  shopmanager: 'Creates purchase requests, manages branch operations, views price changes',
  storesman: 'Validates stock levels, manages inventory, confirms deliveries',
  accountant: 'Validates budget & receipts, manages disbursements, tracks cost impact',
  director: 'Approves exceptions & threshold breaches, executive oversight',
  supplier: 'Manages products & pricing, fulfils orders',
  admin: 'System configuration & technical management',
};

export const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
  shopmanager: { bg: 'bg-[#F5C518]/10', text: 'text-[#9e7c0b]', border: 'border-[#F5C518]' },
  storesman: { bg: 'bg-[#6929c4]/10', text: 'text-[#6929c4]', border: 'border-[#6929c4]' },
  accountant: { bg: 'bg-[#24a148]/10', text: 'text-[#24a148]', border: 'border-[#24a148]' },
  director: { bg: 'bg-[#161616]/10', text: 'text-[#161616]', border: 'border-[#161616]' },
  supplier: { bg: 'bg-[#005f73]/10', text: 'text-[#005f73]', border: 'border-[#005f73]' },
  admin: { bg: 'bg-[#da1e28]/10', text: 'text-[#da1e28]', border: 'border-[#da1e28]' },
};
