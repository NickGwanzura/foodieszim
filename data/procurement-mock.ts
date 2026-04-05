// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — PRICE-DRIVEN PROCUREMENT ENGINE MOCK DATA
// ═════════════════════════════════════════════════════════════════════════════

import { 
  Product, 
  SupplierProduct, 
  PriceEntry, 
  PriceComparison, 
  AllocationDecision,
  SupplierPerformance,
  PriceTrend,
  SavingsReport,
  SupplierOrder
} from '@/types/procurement';

// ══ PRODUCT MASTER CATALOG ═══════════════════════════════════════════════════

export const products: Product[] = [
  { id: 'prod1', name: 'Cooking Oil (2L)', category: 'Food Ingredients', categoryId: 'cat_food', unit: 'bottle', description: 'Vegetable cooking oil, 2 liter bottles', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod2', name: 'Cooking Oil (5L)', category: 'Food Ingredients', categoryId: 'cat_food', unit: 'bottle', description: 'Vegetable cooking oil, 5 liter bottles', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod3', name: 'Flour (25kg)', category: 'Food Ingredients', categoryId: 'cat_food', unit: 'bag', description: 'All-purpose wheat flour', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod4', name: 'Sugar (50kg)', category: 'Food Ingredients', categoryId: 'cat_food', unit: 'bag', description: 'White granulated sugar', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod5', name: 'Chicken Breast (10kg)', category: 'Meat & Poultry', categoryId: 'cat_meat', unit: 'box', description: 'Frozen chicken breast fillets', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod6', name: 'Beef Mince (10kg)', category: 'Meat & Poultry', categoryId: 'cat_meat', unit: 'bag', description: 'Premium beef mince', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod7', name: 'Cleaning Detergent (5L)', category: 'Cleaning Supplies', categoryId: 'cat_clean', unit: 'bottle', description: 'Multi-purpose floor detergent', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod8', name: 'Dishwashing Liquid (2L)', category: 'Cleaning Supplies', categoryId: 'cat_clean', unit: 'bottle', description: 'Commercial dishwashing liquid', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod9', name: 'Paper Towels (12 rolls)', category: 'Cleaning Supplies', categoryId: 'cat_clean', unit: 'pack', description: 'Industrial paper towels', isActive: true, createdAt: '2024-01-15' },
  { id: 'prod10', name: 'LPG Gas (48kg)', category: 'Utilities', categoryId: 'cat_gas', unit: 'cylinder', description: 'LPG cooking gas cylinder', isActive: true, createdAt: '2024-01-15' },
];

// ══ SUPPLIER PRODUCT CATALOGS ════════════════════════════════════════════════

export const supplierProducts: SupplierProduct[] = [
  // ZimKitchen Supplies
  { id: 'sp1', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod1', productName: 'Cooking Oil (2L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 10, leadTimeDays: 2, isActive: true, lastUpdated: '2025-04-01' },
  { id: 'sp2', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod2', productName: 'Cooking Oil (5L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 5, leadTimeDays: 2, isActive: true, lastUpdated: '2025-04-01' },
  { id: 'sp3', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod3', productName: 'Flour (25kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 5, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-01' },
  { id: 'sp4', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod5', productName: 'Chicken Breast (10kg)', unit: 'box', availability: 'low_stock', minimumOrderQuantity: 2, leadTimeDays: 3, isActive: true, lastUpdated: '2025-04-01' },
  
  // MegaFood Distributors
  { id: 'sp5', supplierId: 'sup5', supplierName: 'MegaFood Distributors', productId: 'prod1', productName: 'Cooking Oil (2L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 20, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp6', supplierId: 'sup5', supplierName: 'MegaFood Distributors', productId: 'prod3', productName: 'Flour (25kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 10, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp7', supplierId: 'sup5', supplierName: 'MegaFood Distributors', productId: 'prod4', productName: 'Sugar (50kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 5, leadTimeDays: 2, isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp8', supplierId: 'sup5', supplierName: 'MegaFood Distributors', productId: 'prod6', productName: 'Beef Mince (10kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 2, leadTimeDays: 2, isActive: true, lastUpdated: '2025-04-02' },
  
  // ProClean Zimbabwe
  { id: 'sp9', supplierId: 'sup2', supplierName: 'ProClean Zimbabwe', productId: 'prod7', productName: 'Cleaning Detergent (5L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 4, leadTimeDays: 1, isActive: true, lastUpdated: '2025-03-28' },
  { id: 'sp10', supplierId: 'sup2', supplierName: 'ProClean Zimbabwe', productId: 'prod8', productName: 'Dishwashing Liquid (2L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 6, leadTimeDays: 1, isActive: true, lastUpdated: '2025-03-28' },
  { id: 'sp11', supplierId: 'sup2', supplierName: 'ProClean Zimbabwe', productId: 'prod9', productName: 'Paper Towels (12 rolls)', unit: 'pack', availability: 'in_stock', minimumOrderQuantity: 5, leadTimeDays: 1, isActive: true, lastUpdated: '2025-03-28' },
  
  // Zimbabwe Gas Supplies
  { id: 'sp12', supplierId: 'sup6', supplierName: 'Zimbabwe Gas Supplies', productId: 'prod10', productName: 'LPG Gas (48kg)', unit: 'cylinder', availability: 'in_stock', minimumOrderQuantity: 2, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-01' },
  
  // Premium Meats
  { id: 'sp13', supplierId: 'sup7', supplierName: 'Premium Meats', productId: 'prod5', productName: 'Chicken Breast (10kg)', unit: 'box', availability: 'in_stock', minimumOrderQuantity: 1, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp14', supplierId: 'sup7', supplierName: 'Premium Meats', productId: 'prod6', productName: 'Beef Mince (10kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 1, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-02' },
];

// ══ WEEKLY PRICE DATA ════════════════════════════════════════════════════════

const currentWeek = '2025-W14'; // Week 14 of 2025

export const priceEntries: PriceEntry[] = [
  // Week 14 - Current Week
  // Cooking Oil 2L
  { id: 'p1', supplierProductId: 'sp1', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod1', productName: 'Cooking Oil (2L)', price: 5.20, currency: 'USD', effectiveDate: '2025-04-01', createdAt: '2025-04-01', createdBy: 'supplier' },
  { id: 'p2', supplierProductId: 'sp5', supplierId: 'sup5', supplierName: 'MegaFood Distributors', productId: 'prod1', productName: 'Cooking Oil (2L)', price: 4.95, currency: 'USD', effectiveDate: '2025-04-01', bulkPricing: [{ minQuantity: 50, price: 4.65 }], createdAt: '2025-04-01', createdBy: 'supplier' },
  
  // Cooking Oil 5L
  { id: 'p3', supplierProductId: 'sp2', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod2', productName: 'Cooking Oil (5L)', price: 11.50, currency: 'USD', effectiveDate: '2025-04-01', createdAt: '2025-04-01', createdBy: 'supplier' },
  
  // Flour 25kg
  { id: 'p4', supplierProductId: 'sp3', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod3', productName: 'Flour (25kg)', price: 18.50, currency: 'USD', effectiveDate: '2025-04-01', createdAt: '2025-04-01', createdBy: 'supplier' },
  { id: 'p5', supplierProductId: 'sp6', supplierId: 'sup5', supplierName: 'MegaFood Distributors', productId: 'prod3', productName: 'Flour (25kg)', price: 17.80, currency: 'USD', effectiveDate: '2025-04-02', bulkPricing: [{ minQuantity: 20, price: 16.50 }], createdAt: '2025-04-02', createdBy: 'supplier' },
  
  // Sugar 50kg
  { id: 'p6', supplierProductId: 'sp7', supplierId: 'sup5', supplierName: 'MegaFood Distributors', productId: 'prod4', productName: 'Sugar (50kg)', price: 42.00, currency: 'USD', effectiveDate: '2025-04-02', createdAt: '2025-04-02', createdBy: 'supplier' },
  
  // Chicken Breast
  { id: 'p7', supplierProductId: 'sp4', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod5', productName: 'Chicken Breast (10kg)', price: 68.00, currency: 'USD', effectiveDate: '2025-04-01', createdAt: '2025-04-01', createdBy: 'supplier' },
  { id: 'p8', supplierProductId: 'sp13', supplierId: 'sup7', supplierName: 'Premium Meats', productId: 'prod5', productName: 'Chicken Breast (10kg)', price: 72.50, currency: 'USD', effectiveDate: '2025-04-02', createdAt: '2025-04-02', createdBy: 'supplier' },
  
  // Beef Mince
  { id: 'p9', supplierProductId: 'sp8', supplierId: 'sup5', supplierName: 'MegaFood Distributors', productId: 'prod6', productName: 'Beef Mince (10kg)', price: 85.00, currency: 'USD', effectiveDate: '2025-04-02', createdAt: '2025-04-02', createdBy: 'supplier' },
  { id: 'p10', supplierProductId: 'sp14', supplierId: 'sup7', supplierName: 'Premium Meats', productId: 'prod6', productName: 'Beef Mince (10kg)', price: 92.00, currency: 'USD', effectiveDate: '2025-04-02', createdAt: '2025-04-02', createdBy: 'supplier' },
  
  // Cleaning Products
  { id: 'p11', supplierProductId: 'sp9', supplierId: 'sup2', supplierName: 'ProClean Zimbabwe', productId: 'prod7', productName: 'Cleaning Detergent (5L)', price: 8.50, currency: 'USD', effectiveDate: '2025-03-28', createdAt: '2025-03-28', createdBy: 'supplier' },
  { id: 'p12', supplierProductId: 'sp10', supplierId: 'sup2', supplierName: 'ProClean Zimbabwe', productId: 'prod8', productName: 'Dishwashing Liquid (2L)', price: 4.25, currency: 'USD', effectiveDate: '2025-03-28', bulkPricing: [{ minQuantity: 12, price: 3.85 }], createdAt: '2025-03-28', createdBy: 'supplier' },
  { id: 'p13', supplierProductId: 'sp11', supplierId: 'sup2', supplierName: 'ProClean Zimbabwe', productId: 'prod9', productName: 'Paper Towels (12 rolls)', price: 12.00, currency: 'USD', effectiveDate: '2025-03-28', createdAt: '2025-03-28', createdBy: 'supplier' },
  
  // Gas
  { id: 'p14', supplierProductId: 'sp12', supplierId: 'sup6', supplierName: 'Zimbabwe Gas Supplies', productId: 'prod10', productName: 'LPG Gas (48kg)', price: 95.00, currency: 'USD', effectiveDate: '2025-04-01', createdAt: '2025-04-01', createdBy: 'supplier' },
];

// ══ PRICE COMPARISON ENGINE ══════════════════════════════════════════════════

export function getPriceComparison(productId: string, quantity: number): PriceComparison {
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error('Product not found');

  const relevantPrices = priceEntries.filter(p => p.productId === productId);
  const supplierProductsForItem = supplierProducts.filter(sp => sp.productId === productId);
  
  const comparisons = relevantPrices.map((price, index) => {
    const sp = supplierProductsForItem.find(s => s.supplierId === price.supplierId);
    const totalCost = price.price * quantity;
    const bulkPrice = price.bulkPricing?.find(bp => quantity >= bp.minQuantity)?.price;
    const finalPrice = bulkPrice || price.price;
    const finalTotal = finalPrice * quantity;
    
    return {
      supplierId: price.supplierId,
      supplierName: price.supplierName,
      supplierStatus: 'active' as const,
      supplierRating: 4.5,
      price: finalPrice,
      bulkPrice: bulkPrice,
      totalCost: finalTotal,
      availability: sp?.availability || 'in_stock',
      leadTimeDays: sp?.leadTimeDays || 1,
      isRecommended: false,
      isAvailable: true,
      priceDeviation: 0,
      rank: index + 1,
    };
  }).sort((a, b) => a.totalCost - b.totalCost);

  // Calculate average and deviations
  const prices = comparisons.map(c => c.price);
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);

  comparisons.forEach((c, i) => {
    c.priceDeviation = ((c.price - average) / average) * 100;
    c.rank = i + 1;
    c.isRecommended = i === 0; // Lowest price is recommended
  });

  const recommended = comparisons.find(c => c.isRecommended) || null;
  const savingsVsHighest = highest * quantity - (recommended?.totalCost || 0);
  const savingsPercentage = ((savingsVsHighest / (highest * quantity)) * 100);

  return {
    productId,
    productName: product.name,
    unit: product.unit,
    quantity,
    comparisons,
    recommended,
    priceRange: { lowest, highest, average },
    savingsVsHighest,
    savingsPercentage,
  };
}

// ══ ALLOCATION ENGINE ════════════════════════════════════════════════════════

export function createAllocation(productId: string, quantity: number, overrideSupplierId?: string, overrideReason?: string): AllocationDecision {
  const comparison = getPriceComparison(productId, quantity);
  const recommended = comparison.recommended;
  
  if (!recommended) {
    throw new Error('No suppliers available for this product');
  }

  const flags: AllocationDecision['flags'] = [];
  
  // Check for price spike (more than 15% above average)
  if (recommended.priceDeviation > 15) {
    flags.push({
      type: 'price_spike',
      severity: 'warning',
      message: `Price is ${recommended.priceDeviation.toFixed(1)}% above average`,
    });
  }
  
  // Check for single supplier
  if (comparison.comparisons.length === 1) {
    flags.push({
      type: 'single_supplier',
      severity: 'info',
      message: 'Only one supplier available for this product',
    });
  }
  
  // Check for low stock
  if (recommended.availability === 'low_stock') {
    flags.push({
      type: 'low_stock',
      severity: 'warning',
      message: 'Supplier has low stock levels',
    });
  }

  const selectedSupplier = overrideSupplierId 
    ? comparison.comparisons.find(c => c.supplierId === overrideSupplierId) || recommended
    : recommended;

  return {
    productId,
    productName: comparison.productName,
    quantity,
    selectedSupplierId: selectedSupplier.supplierId,
    selectedSupplierName: selectedSupplier.supplierName,
    selectedPrice: selectedSupplier.price,
    totalCost: selectedSupplier.totalCost,
    mode: 'assisted',
    isOverride: !!overrideSupplierId,
    originalRecommendation: overrideSupplierId ? recommended.supplierId : undefined,
    overrideReason,
    priceComparison: comparison,
    flags,
  };
}

// ══ SUPPLIER PERFORMANCE DATA ════════════════════════════════════════════════

export const supplierPerformances: SupplierPerformance[] = [
  { supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', totalOrders: 45, totalRevenue: 28450, averageOrderValue: 632, winRate: 0.65, priceCompetitiveness: 8.5, ranking: 1 },
  { supplierId: 'sup2', supplierName: 'ProClean Zimbabwe', totalOrders: 38, totalRevenue: 12500, averageOrderValue: 329, winRate: 0.92, priceCompetitiveness: 9.0, ranking: 1 },
  { supplierId: 'sup5', supplierName: 'MegaFood Distributors', totalOrders: 52, totalRevenue: 32100, averageOrderValue: 617, winRate: 0.71, priceCompetitiveness: 9.5, ranking: 1 },
  { supplierId: 'sup6', supplierName: 'Zimbabwe Gas Supplies', totalOrders: 18, totalRevenue: 17100, averageOrderValue: 950, winRate: 1.0, priceCompetitiveness: 7.0, ranking: 1 },
  { supplierId: 'sup7', supplierName: 'Premium Meats', totalOrders: 22, totalRevenue: 18700, averageOrderValue: 850, winRate: 0.35, priceCompetitiveness: 6.0, ranking: 2 },
];

// ══ PRICE RANGE FOR CHARTS ═══════════════════════════════════════════════════

export const priceRange = {
  lowest: 17.80,
  highest: 19.00,
};

// ══ PRICE TRENDS ═════════════════════════════════════════════════════════════

export const priceTrends: PriceTrend[] = [
  {
    productId: 'prod1',
    productName: 'Cooking Oil (2L)',
    unit: 'bottle',
    history: [
      { week: '2025-W11', averagePrice: 5.35, lowestPrice: 5.10, highestPrice: 5.50, supplierCount: 3 },
      { week: '2025-W12', averagePrice: 5.25, lowestPrice: 5.05, highestPrice: 5.40, supplierCount: 3 },
      { week: '2025-W13', averagePrice: 5.15, lowestPrice: 4.95, highestPrice: 5.30, supplierCount: 3 },
      { week: '2025-W14', averagePrice: 5.08, lowestPrice: 4.95, highestPrice: 5.20, supplierCount: 2 },
    ],
    changePercent: -1.4,
    trend: 'down',
    priceRange: { lowest: 4.95, highest: 5.50 },
  },
  {
    productId: 'prod3',
    productName: 'Flour (25kg)',
    unit: 'bag',
    history: [
      { week: '2025-W11', averagePrice: 19.00, lowestPrice: 18.50, highestPrice: 19.50, supplierCount: 2 },
      { week: '2025-W12', averagePrice: 18.80, lowestPrice: 18.20, highestPrice: 19.40, supplierCount: 2 },
      { week: '2025-W13', averagePrice: 18.50, lowestPrice: 17.90, highestPrice: 19.10, supplierCount: 2 },
      { week: '2025-W14', averagePrice: 18.15, lowestPrice: 17.80, highestPrice: 18.50, supplierCount: 2 },
    ],
    changePercent: -1.9,
    trend: 'down',
    priceRange: { lowest: 17.80, highest: 19.50 },
  },
];

// ══ SAVINGS REPORT ═══════════════════════════════════════════════════════════

export const savingsReport: SavingsReport = {
  period: '2025-Q1',
  totalSpend: 78450,
  potentialSpend: 82300,
  actualSavings: 3850,
  savingsPercentage: 4.7,
  byCategory: [
    { category: 'Food Ingredients', spend: 45200, savings: 2100 },
    { category: 'Meat & Poultry', spend: 28500, savings: 1200 },
    { category: 'Cleaning Supplies', spend: 4750, savings: 550 },
  ],
  bySupplier: [
    { supplierId: 'sup5', supplierName: 'MegaFood Distributors', orders: 52, spend: 32100 },
    { supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', orders: 45, spend: 28450 },
    { supplierId: 'sup2', supplierName: 'ProClean Zimbabwe', orders: 38, spend: 12500 },
    { supplierId: 'sup7', supplierName: 'Premium Meats', orders: 22, spend: 18700 },
    { supplierId: 'sup6', supplierName: 'Zimbabwe Gas Supplies', orders: 18, spend: 17100 },
  ],
};

// ══ SUPPLIER ORDERS (FOR SUPPLIER PORTAL) ════════════════════════════════════

export const supplierOrders: SupplierOrder[] = [
  { id: 'so1', requestNumber: 'PR-0045', productName: 'Cooking Oil (2L)', quantity: 20, unit: 'bottle', price: 4.95, total: 99.00, branchName: 'Avondale Shop', status: 'approved', requestedAt: '2025-04-02T09:00:00Z' },
  { id: 'so2', requestNumber: 'PR-0046', productName: 'Flour (25kg)', quantity: 10, unit: 'bag', price: 17.80, total: 178.00, branchName: 'Eastgate Shop', status: 'pending', requestedAt: '2025-04-02T10:30:00Z' },
  { id: 'so3', requestNumber: 'PR-0047', productName: 'Cooking Oil (2L)', quantity: 30, unit: 'bottle', price: 5.20, total: 156.00, branchName: 'Borrowdale Shop', status: 'pending', requestedAt: '2025-04-02T11:15:00Z' },
];
