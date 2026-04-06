'use client';

import { useAuth } from '@/lib/auth-context';
import { getInitials } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleLabel = user.role === 'shopmanager' 
    ? 'SHOP MGR' 
    : user.role === 'accountant' 
    ? 'ACCOUNTANT' 
    : user.role === 'director' 
    ? 'DIRECTOR' 
    : 'ADMIN';

  return (
    <header className="h-12 bg-[#161616] border-b border-[#262626] flex items-center px-3 sm:px-4 gap-2 sm:gap-3 shrink-0">
      {/* Mobile Menu Button */}
      {showMenuButton && (
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-[#c6c6c6] hover:text-white hover:bg-[#262626] transition-colors rounded"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
            <path d="M4 6h24v2H4zm0 9h24v2H4zm0 9h24v2H4z"/>
          </svg>
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2 min-w-fit">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#F5C518] flex items-center justify-center font-black text-[#161616] text-xs sm:text-sm rounded shrink-0">
          F
        </div>
        <div className="hidden sm:block">
          <div className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-condensed)' }}>
            FOODIES
          </div>
          <div className="text-[#F5C518] text-[9px] tracking-wider uppercase font-semibold">
            Zimbabwe
          </div>
        </div>
      </div>
      
      {/* Divider - hidden on very small screens */}
      <div className="hidden sm:block w-px h-5 bg-[#393939]" />
      
      {/* Page Title */}
      <div className="flex-1 text-xs sm:text-sm text-[#c6c6c6] truncate">
        <span className="hidden sm:inline">Financial Control Platform</span>
        <span className="sm:hidden">FCP</span>
      </div>
      
      {/* Role Badge - smaller on mobile */}
      <span className="hidden xs:inline-flex px-2 py-0.5 text-[10px] font-bold text-[#161616] tracking-wider uppercase bg-[#F5C518] shrink-0">
        {roleLabel}
      </span>
      
      {/* Actions */}
      <div className="flex items-center shrink-0">
        <button 
          className="w-10 h-12 sm:w-11 flex items-center justify-center text-[#c6c6c6] hover:text-white hover:bg-[#262626] transition-colors" 
          title="Notifications"
        >
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
            <path d="M28.7 19.3L26 16.6V13a10 10 0 00-8-9.8V2h-4v1.2A10 10 0 006 13v3.6l-2.7 2.7A1 1 0 004 21h7a5 5 0 0010 0h7a1 1 0 00.7-1.7zM16 23a3 3 0 01-3-2h6a3 3 0 01-3 2z"/>
          </svg>
        </button>
        
        <button 
          onClick={logout}
          className="hidden sm:flex w-11 h-12 items-center justify-center text-[#c6c6c6] hover:text-white hover:bg-[#262626] transition-colors"
          title="Sign Out"
        >
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
            <path d="M12 4H4v24h8v-2H6V6h6zm8 18l-1.5-1.5L22 17H10v-2h12l-3.5-3.5L20 10l6 6z"/>
          </svg>
        </button>
        
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#161616] bg-[#F5C518] shrink-0 ml-1">
          {getInitials(user.name)}
        </div>
      </div>
    </header>
  );
}
