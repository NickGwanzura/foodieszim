'use client';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="bg-white border-b border-[#e0e0e0] px-8 py-6 mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-xs text-[#525252] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#a8a8a8]">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="text-[#0f62fe] hover:underline cursor-pointer">{crumb.label}</a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-[26px] font-semibold text-[#161616] mb-1" style={{ fontFamily: 'var(--font-condensed)' }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-[#525252] font-light">{subtitle}</p>
      )}
    </div>
  );
}
