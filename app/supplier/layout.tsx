'use client';

import Link from 'next/link';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Supplier Header */}
      <header className="h-14 bg-[#161616] flex items-center px-6 gap-4">
        <div className="w-8 h-8 bg-[#F5C518] flex items-center justify-center font-black text-[#161616]">
          F
        </div>
        <div>
          <div className="text-white font-bold text-sm">Foodies Supplier Portal</div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span className="text-[#c6c6c6] text-sm">MegaFood Distributors</span>
          <button className="text-[#c6c6c6] text-sm hover:text-white">Logout</button>
        </div>
      </header>

      <div className="flex">
        {/* Supplier Sidebar */}
        <nav className="w-56 bg-white border-r border-[#e0e0e0] min-h-[calc(100vh-56px)]">
          <div className="px-4 py-3 text-xs text-[#525252] uppercase font-semibold">Menu</div>
          
          <Link href="/supplier" className="flex items-center gap-3 px-4 py-3 text-sm text-[#161616] hover:bg-[#f4f4f4] border-l-[3px] border-[#F5C518] bg-[#F5C518]/10">
            <span>📊</span> Dashboard
          </Link>
          
          <Link href="/supplier/products" className="flex items-center gap-3 px-4 py-3 text-sm text-[#525252] hover:bg-[#f4f4f4] border-l-[3px] border-transparent">
            <span>📦</span> My Products
          </Link>
          
          <Link href="/supplier/pricing" className="flex items-center gap-3 px-4 py-3 text-sm text-[#525252] hover:bg-[#f4f4f4] border-l-[3px] border-transparent">
            <span>💵</span> Weekly Pricing
          </Link>
          
          <Link href="/supplier/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-[#525252] hover:bg-[#f4f4f4] border-l-[3px] border-transparent">
            <span>🛒</span> Orders
          </Link>
          
          <Link href="/supplier/performance" className="flex items-center gap-3 px-4 py-3 text-sm text-[#525252] hover:bg-[#f4f4f4] border-l-[3px] border-transparent">
            <span>📈</span> Performance
          </Link>
        </nav>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
