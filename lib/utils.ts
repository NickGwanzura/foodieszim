// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — UTILITY FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Request states
    draft: 'bg-gray-100 text-gray-600',
    submitted: 'bg-blue-100 text-blue-700',
    accountant_review: 'bg-purple-100 text-purple-700',
    director_review: 'bg-orange-100 text-orange-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    returned: 'bg-yellow-100 text-yellow-700',
    funds_released: 'bg-green-200 text-green-800',
    closed: 'bg-gray-200 text-gray-600',
    
    // Priority
    urgent: 'bg-red-100 text-red-700 animate-pulse',
    high: 'bg-yellow-100 text-yellow-700',
    normal: 'bg-gray-100 text-gray-600',
    low: 'bg-gray-100 text-gray-400',
    
    // Financial
    on_track: 'bg-green-100 text-green-700',
    at_risk: 'bg-yellow-100 text-yellow-700',
    over_budget: 'bg-red-100 text-red-700',
    within_budget: 'bg-green-100 text-green-700',
    exception: 'bg-red-100 text-red-700',
    
    // Assets
    active: 'bg-green-100 text-green-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
    damaged: 'bg-red-100 text-red-700',
    disposed: 'bg-gray-200 text-gray-600',
    transferred: 'bg-blue-100 text-blue-700'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-600';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    accountant_review: 'Accountant Review',
    director_review: 'Director Review',
    approved: 'Approved',
    rejected: 'Rejected',
    returned: 'Returned',
    funds_released: 'Funds Released',
    closed: 'Closed',
    on_track: 'On Track',
    at_risk: 'At Risk',
    over_budget: 'Over Budget',
    within_budget: 'Within Budget',
    exception: 'Exception'
  };
  
  return labels[status] || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function calculateUtilization(allocated: number, committed: number, spent: number): number {
  if (allocated === 0) return 0;
  return Math.round(((committed + spent) / allocated) * 100);
}

export function getUtilizationColor(percent: number): string {
  if (percent >= 100) return 'bg-red-500';
  if (percent >= 85) return 'bg-yellow-500';
  if (percent >= 70) return 'bg-blue-500';
  return 'bg-green-500';
}
