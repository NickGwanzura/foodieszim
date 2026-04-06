'use client';

import { useAuth, roleLabels, roleColors } from '@/lib/auth-context';
import { UserRole } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — 6-ROLE NAVIGATION SYSTEM
// Carbon Design System compliant navigation
// ═════════════════════════════════════════════════════════════════════════════

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  badgeType?: 'alert' | 'warning' | 'success' | 'info';
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Carbon Design System icons
const Icons = {
  dashboard: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M24 21h2v5h-2zm-4-5h2v10h-2zm-4 5h2v5h-2zm-4-5h2v10h-2zm-4 5h2v5H8zM4 8v16h24V8H4zm22 14H6V10h20v12z"/></svg>
  ),
  requests: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M25 5h-3V4a2 2 0 00-2-2h-8a2 2 0 00-2 2v1H7a2 2 0 00-2 2v21a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2zM12 4h8v4h-8zm13 24H7V7h3v3h12V7h3z"/><path d="M9 15h14v2H9zm0 5h14v2H9z"/></svg>
  ),
  newRequest: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M17 15V7h-2v8H7v2h8v8h2v-8h8v-2h-8z"/></svg>
  ),
  stock: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M28 10h-6V4H4v18h4v6h20V10zM6 20V6h14v4H10v10zm20 6H12v-4h14v-8h-4v-4h4z"/></svg>
  ),
  stockValidation: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M14 21.4l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L23 12.4zM26 4H6a2 2 0 00-2 2v20a2 2 0 002 2h20a2 2 0 002-2V6a2 2 0 00-2-2zm0 22H6V6h20z"/></svg>
  ),
  delivery: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M29.3 17.4l-3-5.4a2 2 0 00-1.7-1H19V4H8v18H4v2h4.3a3 3 0 005.4 0h8.6a3 3 0 005.4 0H30v-6.6zM10 6h7v5h-7zm3 20a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2zm5-6h-2.3a3 3 0 00-5.4 0h-8.6a3 3 0 00-5.4 0H10V8h7v7h6.6l2.6 4.7V20z"/></svg>
  ),
  receipt: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M22 17h-8v2h8zm0-5H10v2h12zm0 10H10v2h12zm2 7v2H6V6h10V4H6a2 2 0 00-2 2v22a2 2 0 002 2h18a2 2 0 002-2v-7zM24 6v4.2l-1.6-1.7-.4.4L24 12l4-3.1-.4-.4L26 10.2V6h-2z"/></svg>
  ),
  pettyCash: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M21 12V7H7v18h8v-9h-2v7H9V9h10v3zm8 18l-1.5-1.5L30 26H18v-2h12l-3.5-3.5L28 19l6 6z"/></svg>
  ),
  budgets: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M2 7v18h28V7H2zm26 16H4V9h24z"/><path d="M6 12h4v2H6zm0 5h4v2H6zm0 5h4v2H6zm8-10h12v2H14zm0 5h12v2H14zm0 5h12v2H14z"/></svg>
  ),
  procurement: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M8 8h2v4H8zm0 6h2v4H8zm0 6h2v4H8zm6-12h2v4h-2zm0 6h2v4h-2zm0 6h2v4h-2zm6-12h2v4h-2zm0 6h2v4h-2zm0 6h2v4h-2zM30 14h-2V4H4v10H2v14h4v4h20v-4h4V14zM6 6h20v8H6zm20 20H6v-2h20zm4-4H4V16h26z"/></svg>
  ),
  suppliers: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M12 8a4 4 0 11-4 4 4 4 0 014-4m0-2a6 6 0 106 6 6 6 0 00-6-6zm14 24h-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8h-2v-8a4 4 0 014-4h8a4 4 0 014 4z"/></svg>
  ),
  assets: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M28 2H4a2 2 0 00-2 2v24a2 2 0 002 2h24a2 2 0 002-2V4a2 2 0 00-2-2zm0 2v4H4V4zm0 6v16H4V10z"/></svg>
  ),
  approvals: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm0 26a12 12 0 1112-12 12 12 0 01-12 12z"/><path d="M14 21.5l-5-4.96 1.59-1.57L14 18.35l7.41-7.37L23 12.58l-9 8.92z"/></svg>
  ),
  release: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M22 17h-8.17l2.58 2.59L15 21l-5-5 5-5 1.41 1.41L13.83 15H22v-5h2v12h-2z"/><path d="M28 24v2H4V8h2v16h22z"/></svg>
  ),
  review: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M6 6h6v2H6zm0 4h6v2H6zm0 4h6v2H6zm8-8h12v2H14zm0 4h12v2H14zm0 4h12v2H14zM4 4v20h24V4zm22 18H6V6h20z"/></svg>
  ),
  governance: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 2l-12 6v16l12 6 12-6V8zm10 21.3l-10 5-10-5V8.7l10-5 10 5z"/><path d="M15 11h2v6h-2zm0 8h2v2h-2z"/></svg>
  ),
  exceptions: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm0 26a12 12 0 1112-12 12 12 0 01-12 12z"/><path d="M15 9h2v10h-2zm0 12h2v2h-2z"/></svg>
  ),
  invalid: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12-5.4 12-12 12z"/><path d="M21.4 23L16 17.6 10.6 23 9 21.4l5.4-5.4L9 10.6 10.6 9l5.4 5.4L21.4 9l1.6 1.6-5.4 5.4 5.4 5.4z"/></svg>
  ),
  deviation: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M4 24h24v2H4zm22-18h-2v12h-6V8h-2v12h-6V8H8v12H6V6h20z"/></svg>
  ),
  reports: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M4 26h24v2H4zm22-18h-2v10h2zM16 8h-2v18h2zM6 12H4v14h2z"/></svg>
  ),
  users: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M12 8a4 4 0 11-4 4 4 4 0 014-4m0-2a6 6 0 106 6 6 6 0 00-6-6zm14 24h-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8h-2v-8a4 4 0 014-4h8a4 4 0 014 4z"/></svg>
  ),
  settings: (
    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5"><path d="M16 12a4 4 0 11-4 4 4 4 0 014-4m0-2a6 6 0 106 6 6 6 0 00-6-6z"/><path d="M27 16.8v-1.6l-2.6-.4a8.6 8.6 0 00-.8-2l1.6-2.2-1.2-1.2-2.2 1.6a8.6 8.6 0 00-2-.8l-.4-2.6h-1.6l-.4 2.6a8.6 8.6 0 00-2 .8l-2.2-1.6-1.2 1.2 1.6 2.2a8.6 8.6 0 00-.8 2l-2.6.4v1.6l2.6.4a8.6 8.6 0 00.8 2l-1.6 2.2 1.2 1.2 2.2-1.6a8.6 8.6 0 002 .8l.4 2.6h1.6l.4-2.6a8.6 8.6 0 002-.8l2.2 1.6 1.2-1.2-1.6-2.2a8.6 8.6 0 00.8-2zM16 22a6 6 0 116-6 6 6 0 01-6 6z"/></svg>
  ),
};

// ═════════════════════════════════════════════════════════════════════════════
// ROLE-BASED NAVIGATION CONFIGURATION
// ═════════════════════════════════════════════════════════════════════════════

const navigationConfig: Record<UserRole, NavItem[]> = {
  shopmanager: [
    { id: 'overview', label: 'Overview', href: '/dashboard', icon: Icons.dashboard },
    { id: 'requests', label: 'My Requests', href: '/dashboard/requests', icon: Icons.requests },
    { id: 'new-request', label: 'New Request', href: '/dashboard/requests/new', icon: Icons.newRequest },
    { id: 'stock', label: 'Stock Status', href: '/dashboard/stock', icon: Icons.stock },
    { id: 'petty-cash', label: 'Petty Cash', href: '/dashboard/petty-cash', icon: Icons.pettyCash },
    { id: 'budgets', label: 'Budget Status', href: '/dashboard/budgets', icon: Icons.budgets },
    { id: 'price-changes', label: 'Price Changes', href: '/dashboard/price-changes', icon: Icons.deviation },
  ],
  
  storesman: [
    { id: 'overview', label: 'Overview', href: '/dashboard', icon: Icons.dashboard },
    { id: 'stock', label: 'Stock Management', href: '/dashboard/stock', icon: Icons.stock },
    { id: 'validation', label: 'Request Validation', href: '/dashboard/validation', icon: Icons.stockValidation, badge: 5, badgeType: 'alert' },
    { id: 'deliveries', label: 'Deliveries', href: '/dashboard/deliveries', icon: Icons.delivery, badge: 3, badgeType: 'warning' },
    { id: 'movements', label: 'Stock Movements', href: '/dashboard/movements', icon: Icons.review },
    { id: 'reorder', label: 'Reorder Levels', href: '/dashboard/reorder', icon: Icons.deviation },
  ],
  
  accountant: [
    { id: 'overview', label: 'Overview', href: '/dashboard', icon: Icons.dashboard },
    { id: 'review', label: 'Validation Queue', href: '/dashboard/review', icon: Icons.review, badge: 7, badgeType: 'alert' },
    { id: 'receipts', label: 'Receipt Review', href: '/dashboard/receipts', icon: Icons.receipt, badge: 4, badgeType: 'warning' },
    { id: 'deviations', label: 'Price Deviations', href: '/dashboard/deviations', icon: Icons.deviation, badge: 2, badgeType: 'warning' },
    { id: 'release', label: 'Payment Queue', href: '/dashboard/release', icon: Icons.release, badge: 3, badgeType: 'success' },
    { id: 'invalid', label: 'Invalid Requests', href: '/dashboard/invalid', icon: Icons.invalid, badge: 5, badgeType: 'alert' },
    { id: 'procurement', label: 'Price Intelligence', href: '/dashboard/procurement', icon: Icons.procurement },
    { id: 'suppliers', label: 'Suppliers', href: '/dashboard/suppliers', icon: Icons.suppliers },
    { id: 'budgets', label: 'Budget Control', href: '/dashboard/budgets', icon: Icons.budgets },
    { id: 'reports', label: 'Reports', href: '/dashboard/reports', icon: Icons.reports },
  ],
  
  director: [
    { id: 'overview', label: 'Executive Overview', href: '/dashboard', icon: Icons.dashboard },
    { id: 'approvals', label: 'Pending Approvals', href: '/dashboard/approvals', icon: Icons.approvals, badge: 2, badgeType: 'alert' },
    { id: 'exceptions', label: 'Exceptions', href: '/dashboard/exceptions', icon: Icons.exceptions, badge: 3, badgeType: 'warning' },
    { id: 'deviations', label: 'Price Deviations', href: '/dashboard/deviations', icon: Icons.deviation },
    { id: 'governance', label: 'Governance', href: '/dashboard/governance', icon: Icons.governance },
    { id: 'procurement', label: 'Procurement Intel', href: '/dashboard/procurement', icon: Icons.procurement },
    { id: 'invalid', label: 'Invalid Requests', href: '/dashboard/invalid', icon: Icons.invalid },
    { id: 'reports', label: 'Executive Reports', href: '/dashboard/reports', icon: Icons.reports },
  ],
  
  supplier: [
    { id: 'overview', label: 'Dashboard', href: '/supplier', icon: Icons.dashboard },
    { id: 'products', label: 'My Products', href: '/supplier/products', icon: Icons.suppliers },
    { id: 'pricing', label: 'Weekly Pricing', href: '/supplier/pricing', icon: Icons.deviation },
    { id: 'orders', label: 'Orders', href: '/supplier/orders', icon: Icons.requests },
    { id: 'performance', label: 'Performance', href: '/supplier/performance', icon: Icons.reports },
  ],
  
  admin: [
    { id: 'overview', label: 'System Overview', href: '/dashboard', icon: Icons.dashboard },
    { id: 'users', label: 'Users & Roles', href: '/dashboard/users', icon: Icons.users },
    { id: 'branches', label: 'Branch Management', href: '/dashboard/branches', icon: Icons.stock },
    { id: 'thresholds', label: 'Threshold Config', href: '/dashboard/thresholds', icon: Icons.settings },
    { id: 'integrations', label: 'Integrations', href: '/dashboard/integrations', icon: Icons.governance },
    { id: 'audit', label: 'System Audit', href: '/dashboard/audit', icon: Icons.review },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = navigationConfig[user.role];
  const roleStyle = roleColors[user.role];

  const getBadgeStyles = (type?: string) => {
    switch (type) {
      case 'alert': return 'bg-[#da1e28] text-white';
      case 'warning': return 'bg-[#F5C518] text-[#161616]';
      case 'success': return 'bg-[#24a148] text-white';
      case 'info': return 'bg-[#0f62fe] text-white';
      default: return 'bg-[#525252] text-white';
    }
  };

  const handleLinkClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e0e0e0] overflow-y-auto shrink-0 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-[#525252] hover:text-[#161616] hover:bg-[#f4f4f4] rounded"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
            <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6L24 9.4z"/>
          </svg>
        </button>

        {/* Role Header */}
        <div className={cn("p-4 border-b border-[#e0e0e0] pr-12 lg:pr-4", roleStyle.bg)}>
          <div className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-70">
            Logged in as
          </div>
          <div className="font-medium text-[#161616]">{user.name}</div>
          <div className={cn("inline-flex items-center px-2 py-0.5 mt-2 text-xs font-medium", roleStyle.text)}>
            {roleLabels[user.role]}
          </div>
          {user.branchName && (
            <div className="text-xs text-[#6f6f6f] mt-1">{user.branchName}</div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-[3px]',
                  isActive
                    ? cn('bg-[#F5C518]/10 text-[#161616] border-l-[#F5C518] font-medium')
                    : 'text-[#525252] border-l-transparent hover:bg-[#f4f4f4] hover:text-[#161616]'
                )}
              >
                <span className={cn(isActive ? 'text-[#F5C518]' : 'text-[#8d8d8d]', 'shrink-0')}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full shrink-0', getBadgeStyles(item.badgeType))}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[#e0e0e0] bg-[#f4f4f4]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#525252] hover:bg-[#e0e0e0] hover:text-[#161616] transition-colors"
          >
            <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5 shrink-0">
              <path d="M12 4H4v24h8v-2H6V6h6zm8 18l-1.5-1.5L22 17H10v-2h12l-3.5-3.5L20 10l6 6z"/>
            </svg>
            <span>Sign Out</span>
          </button>
          <div className="px-4 pb-3 text-xs text-[#6f6f6f] text-center">
            Foodies Zimbabwe · FCP v2.0
          </div>
        </div>
      </nav>
    </>
  );
}
