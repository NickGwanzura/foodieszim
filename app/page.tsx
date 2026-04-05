'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, roleLabels, roleDescriptions } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { Store, Calculator, Crown, Package, Truck, Settings } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — LOGIN PAGE (6-Role)
// ═════════════════════════════════════════════════════════════════════════════

const roleConfig: Record<UserRole, { icon: React.ReactNode; color: string }> = {
  shopmanager: { icon: <Store className="w-6 h-6" />, color: '#F5C518' },
  storesman: { icon: <Package className="w-6 h-6" />, color: '#6929c4' },
  accountant: { icon: <Calculator className="w-6 h-6" />, color: '#24a148' },
  director: { icon: <Crown className="w-6 h-6" />, color: '#161616' },
  supplier: { icon: <Truck className="w-6 h-6" />, color: '#005f73' },
  admin: { icon: <Settings className="w-6 h-6" />, color: '#da1e28' },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleLogin = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));
    login(selectedRole);
    
    // Route based on role
    if (selectedRole === 'supplier') {
      router.push('/supplier');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5C518] mb-4">
            <span className="text-2xl font-bold text-[#161616]">F</span>
          </div>
          <h1 className="text-3xl font-light text-[#161616] mb-2">FOODIES ZIMBABWE</h1>
          <p className="text-[#6f6f6f]">Financial Control, Procurement & Inventory Platform</p>
        </div>

        {/* Role Selection Card */}
        <div className="bg-white border border-[#e0e0e0] shadow-sm">
          <div className="p-8">
            <h2 className="text-xl font-medium text-[#161616] mb-2">Select Your Role</h2>
            <p className="text-[#6f6f6f] mb-6">Choose your role to access the platform</p>

            {/* Role Cards - 6 roles */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                const config = roleConfig[role];
                const isSelected = selectedRole === role;
                
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-6 border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-[#F5C518] bg-[#F5C518]/5' 
                        : 'border-[#e0e0e0] hover:border-[#8d8d8d]'
                    }`}
                  >
                    <div 
                      className="w-12 h-12 flex items-center justify-center mb-4"
                      style={{ backgroundColor: isSelected ? config.color : '#f4f4f4', color: isSelected ? 'white' : '#525252' }}
                    >
                      {config.icon}
                    </div>
                    <h3 className="font-medium text-[#161616] mb-1">{roleLabels[role]}</h3>
                    <p className="text-xs text-[#6f6f6f]">{roleDescriptions[role]}</p>
                    
                    {isSelected && (
                      <div className="mt-4 text-xs text-[#F5C518] font-medium">
                        ✓ Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!selectedRole || isLoading}
              className={`w-full py-3 font-medium transition-colors ${
                selectedRole 
                  ? 'bg-[#F5C518] text-[#161616] hover:bg-[#e5b518]' 
                  : 'bg-[#e0e0e0] text-[#a8a8a8] cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                selectedRole ? `Continue as ${roleLabels[selectedRole]}` : 'Select a role to continue'
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-[#f4f4f4] border-t border-[#e0e0e0]">
            <div className="flex items-center justify-between text-sm text-[#6f6f6f]">
              <span>© 2025 Foodies Zimbabwe</span>
              <span>Platform v2.0 — 6-Role Governance</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div className="text-[#6f6f6f]">
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-sm">7-Step Approval</div>
          </div>
          <div className="text-[#6f6f6f]">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-sm">Stock Control</div>
          </div>
          <div className="text-[#6f6f6f]">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm">AI Intelligence</div>
          </div>
        </div>
      </div>
    </div>
  );
}
