// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — PRICE-DRIVEN PROCUREMENT ENGINE TYPES
// ═════════════════════════════════════════════════════════════════════════════

// Product Master Catalog
export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  unit: string; // kg, litre, unit, pack, dozen, etc.
  description?: string;
  sku?: string;
  isActive: boolean;
  createdAt: string;
}

// Supplier's Product Offering
export interface SupplierProduct {
  id: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  unit: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  minimumOrderQuantity: number;
  leadTimeDays?: number;
  isActive: boolean;
  lastUpdated: string;
}

// Price Entry (Weekly pricing)
export interface PriceEntry {
  id: string;
  supplierProductId: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  price: number;
  currency: string;
  effectiveDate: string; // Week start date
  expiryDate?: string;   // Week end date
  bulkPricing?: BulkPricingTier[];
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface BulkPricingTier {
  minQuantity: number;
  price: number;
}

// Price Comparison Result
export interface PriceComparison {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  comparisons: SupplierPriceQuote[];
  recommended: SupplierPriceQuote | null;
  priceRange: {
    lowest: number;
    highest: number;
    average: number;
  };
  savingsVsHighest: number;
  savingsPercentage: number;
}

export interface SupplierPriceQuote {
  supplierId: string;
  supplierName: string;
  supplierStatus: 'active' | 'pending_kyc' | 'suspended';
  supplierRating: number;
  price: number;
  bulkPrice?: number;
  totalCost: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  leadTimeDays?: number;
  isRecommended: boolean;
  priceDeviation: number; // % from average
  rank: number;
}

// Allocation Decision
export interface AllocationDecision {
  productId: string;
  productName: string;
  quantity: number;
  selectedSupplierId: string;
  selectedSupplierName: string;
  selectedPrice: number;
  totalCost: number;
  mode: 'assisted' | 'enforced';
  isOverride: boolean;
  originalRecommendation?: string;
  overrideReason?: string;
  priceComparison: PriceComparison;
  flags: AllocationFlag[];
}

export interface AllocationFlag {
  type: 'price_spike' | 'price_drop' | 'single_supplier' | 'high_deviation' | 'low_stock' | 'no_alternative';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

// Updated Purchase Request with Product Focus
export interface ProductPurchaseRequest {
  id: string;
  requestNumber: string;
  
  // Product selection (NEW)
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  
  // System allocation (NEW)
  allocation?: AllocationDecision;
  
  // Legacy fields maintained for compatibility
  status: string;
  requestorId: string;
  requestorName: string;
  branchId: string;
  branchName: string;
  
  // Supplier info now comes from allocation
  supplierId?: string;
  supplierName?: string;
  amount: number;
  
  description?: string;
  urgency: 'normal' | 'high' | 'urgent';
  createdAt: string;
}

// Supplier Portal Types
export interface SupplierOrder {
  id: string;
  requestNumber: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  branchName: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestedAt: string;
}

export interface SupplierPerformance {
  supplierId: string;
  supplierName: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  winRate: number; // % of quotes that became orders
  priceCompetitiveness: number; // 1-10 scale
  ranking: number;
}

// Price Trend
export interface PriceTrend {
  productId: string;
  productName: string;
  unit: string;
  history: {
    week: string;
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    supplierCount: number;
  }[];
  changePercent: number; // Week over week
  trend: 'up' | 'down' | 'stable';
  priceRange: {
    lowest: number;
    highest: number;
  };
}

// Savings Report
export interface SavingsReport {
  period: string;
  totalSpend: number;
  potentialSpend: number; // If highest price always selected
  actualSavings: number;
  savingsPercentage: number;
  byCategory: {
    category: string;
    spend: number;
    savings: number;
  }[];
  bySupplier: {
    supplierId: string;
    supplierName: string;
    orders: number;
    spend: number;
  }[];
}
