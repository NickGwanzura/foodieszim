'use client';

interface KPICardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: string;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal' | 'yellow';
}

export function KPICard({ label, value, delta, deltaType = 'neutral', icon, color = 'yellow' }: KPICardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'before:bg-[#0f62fe]',
    green: 'before:bg-[#24a148]',
    red: 'before:bg-[#da1e28]',
    purple: 'before:bg-[#6929c4]',
    orange: 'before:bg-[#ff6900]',
    teal: 'before:bg-[#005f73]',
    yellow: 'before:bg-[#F5C518]',
  };

  const deltaClasses: Record<string, string> = {
    positive: 'text-[#24a148]',
    negative: 'text-[#da1e28]',
    warning: 'text-[#D4A910]',
    neutral: 'text-[#525252]',
  };

  return (
    <div className={`bg-white p-4 relative overflow-hidden ${colorClasses[color]}`}>
      <div className="text-xs text-[#525252] uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
        {label}
      </div>
      <div className="text-3xl font-semibold text-[#161616] mb-1" style={{ fontFamily: 'var(--font-condensed)' }}>
        {value}
      </div>
      {delta && <div className={`text-xs ${deltaClasses[deltaType]}`} style={{ fontFamily: 'var(--font-mono)' }}>{delta}</div>}
      <div className="absolute bottom-2 right-3 text-3xl opacity-[0.03]">{icon}</div>
    </div>
  );
}
