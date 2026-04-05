'use client';

interface StatusBadgeProps {
  status: string;
  type?: 'request' | 'budget' | 'asset' | 'priority';
}

const styles: Record<string, Record<string, string>> = {
  request: {
    draft: 'bg-gray-100 text-gray-600',
    submitted: 'bg-blue-50 text-blue-700',
    accountant_review: 'bg-purple-50 text-purple-700',
    director_review: 'bg-orange-50 text-orange-700',
    approved: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    returned: 'bg-yellow-50 text-yellow-700',
    funds_released: 'bg-green-100 text-green-800',
    closed: 'bg-gray-200 text-gray-600',
  },
  budget: {
    on_track: 'bg-green-50 text-green-700',
    at_risk: 'bg-yellow-50 text-yellow-700',
    over_budget: 'bg-red-50 text-red-700',
    within_budget: 'bg-green-50 text-green-700',
    exception: 'bg-red-50 text-red-700',
  },
  asset: {
    active: 'bg-green-50 text-green-700',
    maintenance: 'bg-yellow-50 text-yellow-700',
    damaged: 'bg-red-50 text-red-700',
    disposed: 'bg-gray-200 text-gray-600',
    transferred: 'bg-blue-50 text-blue-700',
  },
  priority: {
    urgent: 'bg-red-50 text-red-700 animate-pulse',
    high: 'bg-yellow-50 text-yellow-700',
    normal: 'bg-gray-100 text-gray-600',
    low: 'bg-gray-100 text-gray-400',
  },
};

const labels: Record<string, Record<string, string>> = {
  request: {
    draft: 'Draft',
    submitted: 'Submitted',
    accountant_review: 'Accountant Review',
    director_review: 'Director Review',
    approved: 'Approved',
    rejected: 'Rejected',
    returned: 'Returned',
    funds_released: 'Funds Released',
    closed: 'Closed',
  },
  budget: {
    on_track: 'On Track',
    at_risk: 'At Risk',
    over_budget: 'Over Budget',
    within_budget: 'Within Budget',
    exception: 'Exception',
  },
  asset: {
    active: 'Active',
    maintenance: 'Maintenance',
    damaged: 'Damaged',
    disposed: 'Disposed',
    transferred: 'Transferred',
  },
  priority: {
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  },
};

export function StatusBadge({ status, type = 'request' }: StatusBadgeProps) {
  const style = styles[type]?.[status] || styles.request.draft;
  const label = labels[type]?.[status] || status.replace(/_/g, ' ');

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold tracking-wide ${style}`} style={{ fontFamily: 'var(--font-mono)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
