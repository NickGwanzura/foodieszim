// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — PRICE-DRIVEN PROCUREMENT ENGINE
// Core algorithm for supplier auto-allocation based on weekly pricing
// ═════════════════════════════════════════════════════════════════════════════

import { 
  Product, 
  SupplierProduct, 
  SupplierPrice, 
  PriceComparison, 
  SupplierPriceQuote,
  AllocationDecision,
  AllocationFlag,
  BulkPricingTier,
} from '@/types';

// Alias for backward compatibility
type PriceEntry = SupplierPrice;

// Re-export types for convenience
export type { AllocationDecision, PriceComparison, SupplierPriceQuote };

// ═════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Price deviation thresholds
  PRICE_SPIKE_THRESHOLD: 15,     // Flag if price >15% above average
  PRICE_DROP_THRESHOLD: -20,     // Flag if price >20% below average (suspicious)
  
  // Allocation modes
  AUTO_ALLOCATION_MIN_SUPPLIERS: 2,
  ASSISTED_ALLOCATION_MAX_DEVIATION: 10,
  
  // Currency
  DEFAULT_CURRENCY: 'USD',
  
  // Time windows
  PRICE_VALIDITY_DAYS: 7,
};

// ═════════════════════════════════════════════════════════════════════════════
// DATA STORE (In-memory for demo - would be database in production)
// ═════════════════════════════════════════════════════════════════════════════

// Product Master Catalog
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

// Supplier Product Offerings
export const supplierProducts: SupplierProduct[] = [
  // ZimKitchen Supplies - Broad food range
  { id: 'sp1', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod1', productName: 'Cooking Oil (2L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 10, leadTimeDays: 2, isActive: true, lastUpdated: '2025-04-01' },
  { id: 'sp2', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod2', productName: 'Cooking Oil (5L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 5, leadTimeDays: 2, isActive: true, lastUpdated: '2025-04-01' },
  { id: 'sp3', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod3', productName: 'Flour (25kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 5, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-01' },
  { id: 'sp4', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod5', productName: 'Chicken Breast (10kg)', unit: 'box', availability: 'low_stock', minimumOrderQuantity: 2, leadTimeDays: 3, isActive: true, lastUpdated: '2025-04-01' },
  
  // MegaFood Distributors - Wholesale focus
  { id: 'sp5', supplierId: 'sup2', supplierName: 'MegaFood Distributors', productId: 'prod1', productName: 'Cooking Oil (2L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 20, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp6', supplierId: 'sup2', supplierName: 'MegaFood Distributors', productId: 'prod3', productName: 'Flour (25kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 10, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp7', supplierId: 'sup2', supplierName: 'MegaFood Distributors', productId: 'prod4', productName: 'Sugar (50kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 5, leadTimeDays: 2, isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp8', supplierId: 'sup2', supplierName: 'MegaFood Distributors', productId: 'prod6', productName: 'Beef Mince (10kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 2, leadTimeDays: 2, isActive: true, lastUpdated: '2025-04-02' },
  
  // ProClean Zimbabwe - Cleaning specialist
  { id: 'sp9', supplierId: 'sup3', supplierName: 'ProClean Zimbabwe', productId: 'prod7', productName: 'Cleaning Detergent (5L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 4, leadTimeDays: 1, isActive: true, lastUpdated: '2025-03-28' },
  { id: 'sp10', supplierId: 'sup3', supplierName: 'ProClean Zimbabwe', productId: 'prod8', productName: 'Dishwashing Liquid (2L)', unit: 'bottle', availability: 'in_stock', minimumOrderQuantity: 6, leadTimeDays: 1, isActive: true, lastUpdated: '2025-03-28' },
  { id: 'sp11', supplierId: 'sup3', supplierName: 'ProClean Zimbabwe', productId: 'prod9', productName: 'Paper Towels (12 rolls)', unit: 'pack', availability: 'in_stock', minimumOrderQuantity: 5, leadTimeDays: 1, isActive: true, lastUpdated: '2025-03-28' },
  
  // Zimbabwe Gas Supplies - Gas specialist
  { id: 'sp12', supplierId: 'sup4', supplierName: 'Zimbabwe Gas Supplies', productId: 'prod10', productName: 'LPG Gas (48kg)', unit: 'cylinder', availability: 'in_stock', minimumOrderQuantity: 2, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-01' },
  
  // Premium Meats - Meat specialist
  { id: 'sp13', supplierId: 'sup5', supplierName: 'Premium Meats', productId: 'prod5', productName: 'Chicken Breast (10kg)', unit: 'box', availability: 'in_stock', minimumOrderQuantity: 1, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-02' },
  { id: 'sp14', supplierId: 'sup5', supplierName: 'Premium Meats', productId: 'prod6', productName: 'Beef Mince (10kg)', unit: 'bag', availability: 'in_stock', minimumOrderQuantity: 1, leadTimeDays: 1, isActive: true, lastUpdated: '2025-04-02' },
];

// Weekly Price Entries
export const priceEntries: PriceEntry[] = [
  // Week of April 1, 2025
  // Cooking Oil 2L
  { id: 'pe1', supplierProductId: 'sp1', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod1', productName: 'Cooking Oil (2L)', price: 5.20, currency: 'USD', effectiveDate: '2025-04-01', isValid: true, createdAt: '2025-04-01', createdBy: 'sup1' },
  { id: 'pe2', supplierProductId: 'sp5', supplierId: 'sup2', supplierName: 'MegaFood Distributors', productId: 'prod1', productName: 'Cooking Oil (2L)', price: 4.95, currency: 'USD', effectiveDate: '2025-04-01', bulkPricing: [{ minQuantity: 50, price: 4.65 }], isValid: true, createdAt: '2025-04-01', createdBy: 'sup2' },
  
  // Cooking Oil 5L
  { id: 'pe3', supplierProductId: 'sp2', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod2', productName: 'Cooking Oil (5L)', price: 11.50, currency: 'USD', effectiveDate: '2025-04-01', isValid: true, createdAt: '2025-04-01', createdBy: 'sup1' },
  
  // Flour 25kg
  { id: 'pe4', supplierProductId: 'sp3', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod3', productName: 'Flour (25kg)', price: 18.50, currency: 'USD', effectiveDate: '2025-04-01', isValid: true, createdAt: '2025-04-01', createdBy: 'sup1' },
  { id: 'pe5', supplierProductId: 'sp6', supplierId: 'sup2', supplierName: 'MegaFood Distributors', productId: 'prod3', productName: 'Flour (25kg)', price: 17.80, currency: 'USD', effectiveDate: '2025-04-02', bulkPricing: [{ minQuantity: 20, price: 16.50 }], isValid: true, createdAt: '2025-04-02', createdBy: 'sup2' },
  
  // Sugar 50kg
  { id: 'pe6', supplierProductId: 'sp7', supplierId: 'sup2', supplierName: 'MegaFood Distributors', productId: 'prod4', productName: 'Sugar (50kg)', price: 42.00, currency: 'USD', effectiveDate: '2025-04-02', isValid: true, createdAt: '2025-04-02', createdBy: 'sup2' },
  
  // Chicken Breast
  { id: 'pe7', supplierProductId: 'sp4', supplierId: 'sup1', supplierName: 'ZimKitchen Supplies Ltd', productId: 'prod5', productName: 'Chicken Breast (10kg)', price: 68.00, currency: 'USD', effectiveDate: '2025-04-01', isValid: true, createdAt: '2025-04-01', createdBy: 'sup1' },
  { id: 'pe8', supplierProductId: 'sp13', supplierId: 'sup5', supplierName: 'Premium Meats', productId: 'prod5', productName: 'Chicken Breast (10kg)', price: 72.50, currency: 'USD', effectiveDate: '2025-04-02', isValid: true, createdAt: '2025-04-02', createdBy: 'sup5' },
  
  // Beef Mince
  { id: 'pe9', supplierProductId: 'sp8', supplierId: 'sup2', supplierName: 'MegaFood Distributors', productId: 'prod6', productName: 'Beef Mince (10kg)', price: 85.00, currency: 'USD', effectiveDate: '2025-04-02', isValid: true, createdAt: '2025-04-02', createdBy: 'sup2' },
  { id: 'pe10', supplierProductId: 'sp14', supplierId: 'sup5', supplierName: 'Premium Meats', productId: 'prod6', productName: 'Beef Mince (10kg)', price: 92.00, currency: 'USD', effectiveDate: '2025-04-02', isValid: true, createdAt: '2025-04-02', createdBy: 'sup5' },
  
  // Cleaning Products
  { id: 'pe11', supplierProductId: 'sp9', supplierId: 'sup3', supplierName: 'ProClean Zimbabwe', productId: 'prod7', productName: 'Cleaning Detergent (5L)', price: 8.50, currency: 'USD', effectiveDate: '2025-03-28', isValid: true, createdAt: '2025-03-28', createdBy: 'sup3' },
  { id: 'pe12', supplierProductId: 'sp10', supplierId: 'sup3', supplierName: 'ProClean Zimbabwe', productId: 'prod8', productName: 'Dishwashing Liquid (2L)', price: 4.25, currency: 'USD', effectiveDate: '2025-03-28', bulkPricing: [{ minQuantity: 12, price: 3.85 }], isValid: true, createdAt: '2025-03-28', createdBy: 'sup3' },
  { id: 'pe13', supplierProductId: 'sp11', supplierId: 'sup3', supplierName: 'ProClean Zimbabwe', productId: 'prod9', productName: 'Paper Towels (12 rolls)', price: 12.00, currency: 'USD', effectiveDate: '2025-03-28', isValid: true, createdAt: '2025-03-28', createdBy: 'sup3' },
  
  // Gas
  { id: 'pe14', supplierProductId: 'sp12', supplierId: 'sup4', supplierName: 'Zimbabwe Gas Supplies', productId: 'prod10', productName: 'LPG Gas (48kg)', price: 95.00, currency: 'USD', effectiveDate: '2025-04-01', isValid: true, createdAt: '2025-04-01', createdBy: 'sup4' },
];

// ═════════════════════════════════════════════════════════════════════════════
// CORE PRICE ENGINE FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Get current price for a supplier-product combination
 * Returns null if no valid price exists
 */
export function getCurrentPrice(supplierId: string, productId: string): PriceEntry | null {
  const entry = priceEntries
    .filter(p => p.supplierId === supplierId && p.productId === productId && p.isValid)
    .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())[0];
  return entry || null;
}

/**
 * Calculate effective price including bulk discounts
 */
export function calculateEffectivePrice(price: number, quantity: number, bulkPricing?: BulkPricingTier[]): number {
  if (!bulkPricing || bulkPricing.length === 0) return price;
  
  // Sort by minQuantity descending to find highest applicable tier
  const applicableTier = bulkPricing
    .filter(tier => quantity >= tier.minQuantity)
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];
  
  return applicableTier ? applicableTier.price : price;
}

/**
 * Get all available suppliers for a product with current pricing
 */
export function getPriceComparison(productId: string, quantity: number): PriceComparison {
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  // Get all supplier products for this item
  const relevantSupplierProducts = supplierProducts.filter(sp => 
    sp.productId === productId && sp.isActive
  );

  // Build price quotes for each supplier
  const comparisons: SupplierPriceQuote[] = relevantSupplierProducts.map(sp => {
    const priceEntry = getCurrentPrice(sp.supplierId, productId);
    const basePrice = priceEntry?.price || 0;
    const effectivePrice = priceEntry 
      ? calculateEffectivePrice(basePrice, quantity, priceEntry.bulkPricing)
      : 0;
    const totalCost = effectivePrice * quantity;
    
    // Check if meets minimum order quantity
    const isAvailable = quantity >= sp.minimumOrderQuantity && priceEntry !== null;
    
    return {
      supplierId: sp.supplierId,
      supplierName: sp.supplierName,
      supplierStatus: 'active', // Simplified for demo
      supplierRating: 4.5,
      price: effectivePrice,
      bulkPrice: effectivePrice < basePrice ? effectivePrice : undefined,
      totalCost,
      availability: sp.availability,
      leadTimeDays: sp.leadTimeDays,
      isRecommended: false, // Set after sorting
      isAvailable,
      priceDeviation: 0, // Calculated after we have all prices
      rank: 0, // Set after sorting
    };
  });

  // Sort by total cost (ascending)
  const sorted = comparisons
    .filter(c => c.isAvailable)
    .sort((a, b) => a.totalCost - b.totalCost);

  // Calculate statistics
  const availablePrices = sorted.map(c => c.price);
  const average = availablePrices.length > 0 
    ? availablePrices.reduce((a, b) => a + b, 0) / availablePrices.length 
    : 0;
  const lowest = availablePrices.length > 0 ? Math.min(...availablePrices) : 0;
  const highest = availablePrices.length > 0 ? Math.max(...availablePrices) : 0;

  // Set ranks and deviations
  sorted.forEach((c, index) => {
    c.rank = index + 1;
    c.isRecommended = index === 0;
    c.priceDeviation = average > 0 ? ((c.price - average) / average) * 100 : 0;
  });

  const recommended = sorted.find(c => c.isRecommended) || null;
  const alternatives = sorted.slice(1, 3); // Next 2 best options
  
  // Calculate savings vs highest price alternative
  const highestCost = highest * quantity;
  const savingsVsHighest = recommended ? highestCost - recommended.totalCost : 0;
  const savingsPercentage = highestCost > 0 ? (savingsVsHighest / highestCost) * 100 : 0;

  return {
    productId,
    productName: product.name,
    unit: product.unit,
    quantity,
    comparisons: sorted,
    recommended,
    alternatives,
    priceRange: { lowest, highest, average },
    savingsVsHighest,
    savingsPercentage,
  };
}

/**
 * Create an allocation decision for a purchase request
 * This is the CORE function that determines which supplier to use
 */
export function createAllocation(
  productId: string, 
  quantity: number,
  overrideSupplierId?: string,
  overrideReason?: string,
  userId?: string
): AllocationDecision {
  const comparison = getPriceComparison(productId, quantity);
  
  if (comparison.comparisons.length === 0) {
    throw new Error('No suppliers available for this product');
  }

  const recommended = comparison.recommended;
  if (!recommended) {
    throw new Error('No valid pricing available for this product');
  }

  // Generate allocation flags
  const flags: AllocationFlag[] = [];

  // Check for single supplier situation
  if (comparison.comparisons.length === 1) {
    flags.push({
      type: 'single_supplier',
      severity: 'info',
      message: 'Only one supplier available - no alternatives to compare',
    });
  }

  // Check for price spike (recommended price is high)
  if (recommended.priceDeviation > CONFIG.PRICE_SPIKE_THRESHOLD) {
    flags.push({
      type: 'price_spike',
      severity: 'warning',
      message: `Price is ${recommended.priceDeviation.toFixed(1)}% above market average`,
    });
  }

  // Check for significant price drop (suspicious)
  if (recommended.priceDeviation < CONFIG.PRICE_DROP_THRESHOLD) {
    flags.push({
      type: 'price_drop',
      severity: 'warning',
      message: `Price is ${Math.abs(recommended.priceDeviation).toFixed(1)}% below market average - verify quality`,
    });
  }

  // Check availability
  if (recommended.availability === 'low_stock') {
    flags.push({
      type: 'low_stock',
      severity: 'warning',
      message: 'Supplier has low stock levels - confirm availability before ordering',
    });
  }

  // Check for no alternatives (if recommended is not suitable)
  if (comparison.alternatives.length === 0 && comparison.comparisons.length > 1) {
    flags.push({
      type: 'no_alternative',
      severity: 'info',
      message: 'No viable alternatives - current supplier is the only option',
    });
  }

  // Determine allocation mode
  let mode: 'auto' | 'assisted' | 'manual' = 'auto';
  
  if (overrideSupplierId) {
    mode = 'manual';
  } else if (flags.some(f => f.severity === 'warning') || comparison.comparisons.length < CONFIG.AUTO_ALLOCATION_MIN_SUPPLIERS) {
    mode = 'assisted';
  }

  // Select final supplier
  const selectedSupplier = overrideSupplierId
    ? comparison.comparisons.find(c => c.supplierId === overrideSupplierId) || recommended
    : recommended;

  return {
    productId,
    productName: comparison.productName,
    quantity,
    unit: comparison.unit,
    selectedSupplierId: selectedSupplier.supplierId,
    selectedSupplierName: selectedSupplier.supplierName,
    selectedPrice: selectedSupplier.price,
    totalCost: selectedSupplier.totalCost,
    mode,
    isOverride: !!overrideSupplierId && overrideSupplierId !== recommended.supplierId,
    originalRecommendation: overrideSupplierId && overrideSupplierId !== recommended.supplierId 
      ? recommended.supplierId 
      : undefined,
    overrideReason,
    overriddenBy: overrideSupplierId ? userId : undefined,
    overriddenAt: overrideSupplierId ? new Date().toISOString() : undefined,
    priceComparison: comparison,
    flags,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Validate if an allocation override is allowed
 */
export function validateOverride(
  allocation: AllocationDecision,
  overrideSupplierId: string,
  reason: string
): { valid: boolean; error?: string } {
  if (!reason || reason.trim().length < 10) {
    return { valid: false, error: 'Override reason must be at least 10 characters' };
  }

  const alternative = allocation.priceComparison.comparisons.find(
    c => c.supplierId === overrideSupplierId
  );
  
  if (!alternative) {
    return { valid: false, error: 'Selected supplier is not available for this product' };
  }

  if (!alternative.isAvailable) {
    return { valid: false, error: 'Selected supplier does not meet minimum order requirements' };
  }

  // Check if override increases cost significantly (>20%)
  const costIncrease = alternative.totalCost - allocation.priceComparison.recommended!.totalCost;
  const increasePercent = (costIncrease / allocation.priceComparison.recommended!.totalCost) * 100;
  
  if (increasePercent > 20) {
    return { 
      valid: false, 
      error: `Override increases cost by ${increasePercent.toFixed(1)}%. Director approval required.` 
    };
  }

  return { valid: true };
}

// ═════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Get products by category
 */
export function getProductsByCategory(categoryId?: string): Product[] {
  if (!categoryId) return products.filter(p => p.isActive);
  return products.filter(p => p.categoryId === categoryId && p.isActive);
}

/**
 * Get all product categories
 */
export const productCategories = [
  { id: 'cat_food', name: 'Food Ingredients', icon: 'food' },
  { id: 'cat_meat', name: 'Meat & Poultry', icon: 'meat' },
  { id: 'cat_clean', name: 'Cleaning Supplies', icon: 'clean' },
  { id: 'cat_gas', name: 'Utilities', icon: 'gas' },
];

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get savings summary across multiple items
 */
export function calculateTotalSavings(allocations: AllocationDecision[]): {
  totalSpend: number;
  potentialSpend: number;
  totalSavings: number;
  savingsPercentage: number;
} {
  const totalSpend = allocations.reduce((sum, a) => sum + a.totalCost, 0);
  const potentialSpend = allocations.reduce((sum, a) => {
    const highest = a.priceComparison.priceRange.highest * a.quantity;
    return sum + highest;
  }, 0);
  const totalSavings = potentialSpend - totalSpend;
  const savingsPercentage = potentialSpend > 0 ? (totalSavings / potentialSpend) * 100 : 0;

  return {
    totalSpend,
    potentialSpend,
    totalSavings,
    savingsPercentage,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// MOCK PRICE HISTORY FOR ANALYTICS
// ═════════════════════════════════════════════════════════════════════════════

export interface PriceHistoryPoint {
  week: string;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  supplierCount: number;
}

export const priceHistory: Record<string, PriceHistoryPoint[]> = {
  prod1: [
    { week: '2025-W11', averagePrice: 5.35, lowestPrice: 5.10, highestPrice: 5.50, supplierCount: 3 },
    { week: '2025-W12', averagePrice: 5.25, lowestPrice: 5.05, highestPrice: 5.40, supplierCount: 3 },
    { week: '2025-W13', averagePrice: 5.15, lowestPrice: 4.95, highestPrice: 5.30, supplierCount: 2 },
    { week: '2025-W14', averagePrice: 5.08, lowestPrice: 4.95, highestPrice: 5.20, supplierCount: 2 },
  ],
  prod3: [
    { week: '2025-W11', averagePrice: 19.00, lowestPrice: 18.50, highestPrice: 19.50, supplierCount: 2 },
    { week: '2025-W12', averagePrice: 18.80, lowestPrice: 18.20, highestPrice: 19.40, supplierCount: 2 },
    { week: '2025-W13', averagePrice: 18.50, lowestPrice: 17.90, highestPrice: 19.10, supplierCount: 2 },
    { week: '2025-W14', averagePrice: 18.15, lowestPrice: 17.80, highestPrice: 18.50, supplierCount: 2 },
  ],
  prod5: [
    { week: '2025-W11', averagePrice: 70.00, lowestPrice: 68.00, highestPrice: 72.00, supplierCount: 2 },
    { week: '2025-W12', averagePrice: 70.25, lowestPrice: 68.00, highestPrice: 72.50, supplierCount: 2 },
    { week: '2025-W13', averagePrice: 70.25, lowestPrice: 68.00, highestPrice: 72.50, supplierCount: 2 },
    { week: '2025-W14', averagePrice: 70.25, lowestPrice: 68.00, highestPrice: 72.50, supplierCount: 2 },
  ],
};

export function getPriceHistory(productId: string): PriceHistoryPoint[] {
  return priceHistory[productId] || [];
}
