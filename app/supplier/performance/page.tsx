'use client';

import { Trophy, Star, Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — SUPPLIER PERFORMANCE (SUPPLIER PORTAL)
// View your performance metrics and ratings from Foodies Zimbabwe
// ═════════════════════════════════════════════════════════════════════════════

interface MonthlyMetric {
  month: string;
  ordersReceived: number;
  ordersDelivered: number;
  onTimeRate: number;
  totalRevenue: number;
  avgDeliveryDays: number;
}

const monthlyData: MonthlyMetric[] = [
  { month: 'Jan 2025', ordersReceived: 12, ordersDelivered: 12, onTimeRate: 100, totalRevenue: 4850, avgDeliveryDays: 1.8 },
  { month: 'Feb 2025', ordersReceived: 14, ordersDelivered: 13, onTimeRate: 92.9, totalRevenue: 5420, avgDeliveryDays: 2.1 },
  { month: 'Mar 2025', ordersReceived: 16, ordersDelivered: 15, onTimeRate: 93.8, totalRevenue: 6200, avgDeliveryDays: 2.0 },
  { month: 'Apr 2025', ordersReceived: 10, ordersDelivered: 8, onTimeRate: 87.5, totalRevenue: 3980, avgDeliveryDays: 2.3 },
];

const recentFeedback = [
  { id: 'f1', date: '2025-04-02', rating: 5, comment: 'Excellent delivery — on time and full quantity.', requestRef: 'PR-0045' },
  { id: 'f2', date: '2025-04-01', rating: 4, comment: 'Good quality. Slight delay but communicated well.', requestRef: 'PR-0043' },
  { id: 'f3', date: '2025-03-28', rating: 3, comment: 'Short delivery on flour — 3 bags missing. Please ensure full orders.', requestRef: 'PR-0039' },
  { id: 'f4', date: '2025-03-25', rating: 5, comment: 'Perfect delivery as usual.', requestRef: 'PR-0037' },
];

const performanceSummary = {
  overallRating: 4.8,
  totalOrders: 52,
  deliveryAccuracy: 94.2,
  onTimeDeliveryRate: 91.3,
  avgFulfillmentDays: 2.0,
  priceComplianceRate: 97.8,
  totalRevenue: 32100,
  rank: 2,
  totalSuppliers: 6,
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const ScoreBar = ({ value, max = 100, color = '#24a148' }: { value: number; max?: number; color?: string }) => (
  <div className="w-full bg-[#e0e0e0] h-2 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all"
      style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
    />
  </div>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i <= Math.floor(rating) ? 'text-[#F5C518] fill-current' : 'text-[#e0e0e0]'}`}
      />
    ))}
  </div>
);

export default function SupplierPerformancePage() {
  const { overallRating, totalOrders, deliveryAccuracy, onTimeDeliveryRate, avgFulfillmentDays, priceComplianceRate, totalRevenue, rank, totalSuppliers } = performanceSummary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#161616]">Performance Dashboard</h1>
        <p className="text-[#6f6f6f]">Your performance metrics and ratings from Foodies Zimbabwe</p>
      </div>

      {/* Supplier Rank Banner */}
      <div className="bg-[#161616] text-white p-5 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#c6c6c6] mb-1">Supplier Ranking</div>
          <div className="text-3xl font-bold text-[#F5C518]">#{rank} <span className="text-base font-normal text-[#c6c6c6]">of {totalSuppliers} suppliers</span></div>
          <div className="text-sm text-[#c6c6c6] mt-1">Based on overall performance score</div>
        </div>
        <div className="p-3 bg-[#F5C518]/20">
          <Trophy className="w-10 h-10 text-[#F5C518]" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-[#6f6f6f]">Overall Rating</p>
              <p className="text-2xl font-semibold text-[#161616]">{overallRating}/5.0</p>
            </div>
            <Star className="w-5 h-5 text-[#F5C518] fill-current" />
          </div>
          <StarRating rating={overallRating} />
        </div>

        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-[#6f6f6f]">On-Time Delivery</p>
              <p className="text-2xl font-semibold text-[#24a148]">{onTimeDeliveryRate}%</p>
            </div>
            <Clock className="w-5 h-5 text-[#24a148]" />
          </div>
          <ScoreBar value={onTimeDeliveryRate} color="#24a148" />
        </div>

        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-[#6f6f6f]">Delivery Accuracy</p>
              <p className="text-2xl font-semibold text-[#0f62fe]">{deliveryAccuracy}%</p>
            </div>
            <CheckCircle className="w-5 h-5 text-[#0f62fe]" />
          </div>
          <ScoreBar value={deliveryAccuracy} color="#0f62fe" />
        </div>

        <div className="bg-white border border-[#e0e0e0] p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-[#6f6f6f]">Price Compliance</p>
              <p className="text-2xl font-semibold text-[#6929c4]">{priceComplianceRate}%</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#6929c4]" />
          </div>
          <ScoreBar value={priceComplianceRate} color="#6929c4" />
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Orders</div>
          <div className="text-2xl font-semibold text-[#161616]">{totalOrders}</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Avg Fulfillment</div>
          <div className="text-2xl font-semibold text-[#161616]">{avgFulfillmentDays} days</div>
        </div>
        <div className="bg-white border border-[#e0e0e0] p-4">
          <div className="text-sm text-[#6f6f6f]">Total Revenue</div>
          <div className="text-2xl font-semibold text-[#161616]">{formatCurrency(totalRevenue)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Breakdown */}
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h2 className="font-medium">Monthly Performance</h2>
          </div>
          <table className="w-full">
            <thead className="bg-[#f4f4f4]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#525252]">Month</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">Orders</th>
                <th className="text-center p-3 text-sm font-medium text-[#525252]">On-Time</th>
                <th className="text-right p-3 text-sm font-medium text-[#525252]">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {monthlyData.map((m) => (
                <tr key={m.month} className="hover:bg-[#f4f4f4]">
                  <td className="p-3 font-medium">{m.month}</td>
                  <td className="p-3 text-center text-sm">
                    {m.ordersDelivered}/{m.ordersReceived}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-medium ${m.onTimeRate >= 95 ? 'text-[#24a148]' : m.onTimeRate >= 85 ? 'text-[#9e7c0b]' : 'text-[#da1e28]'}`}>
                      {m.onTimeRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3 text-right text-sm">{formatCurrency(m.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white border border-[#e0e0e0]">
          <div className="p-4 border-b border-[#e0e0e0]">
            <h2 className="font-medium">Recent Feedback</h2>
          </div>
          <div className="divide-y divide-[#e0e0e0]">
            {recentFeedback.map((fb) => (
              <div key={fb.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <StarRating rating={fb.rating} />
                    <span className="text-xs text-[#6f6f6f]">{fb.requestRef}</span>
                  </div>
                  <span className="text-xs text-[#6f6f6f]">{fb.date}</span>
                </div>
                <p className="text-sm text-[#525252]">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-[#f4f4f4] p-5">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#0f62fe]" />
          How to Improve Your Score
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="font-medium text-sm mb-1">On-Time Delivery</div>
            <p className="text-xs text-[#6f6f6f]">Deliver within the agreed lead time. Communicate proactively if delays are expected to avoid score penalties.</p>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="font-medium text-sm mb-1">Price Compliance</div>
            <p className="text-xs text-[#6f6f6f]">Keep prices stable. Large or unexplained deviations from submitted prices lower your compliance score.</p>
          </div>
          <div className="bg-white p-4 border border-[#e0e0e0]">
            <div className="font-medium text-sm mb-1">Delivery Accuracy</div>
            <p className="text-xs text-[#6f6f6f]">Fulfil the exact quantities ordered. Short deliveries or substitutions reduce your accuracy rating.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
