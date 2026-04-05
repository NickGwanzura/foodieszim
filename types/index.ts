// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — COMPLETE TYPE DEFINITIONS v2.0
// Financial Control + Procurement + Inventory + Asset Management Platform
// 6-Role Governance Model with Storesman Validation & Receipt Compliance
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// CORE USER & ROLE MANAGEMENT (6-ROLE MODEL)
// ═════════════════════════════════════════════════════════════════════════════

/** 
 * FOODIES ZIMBABWE 6-ROLE GOVERNANCE MODEL
 * 1. Shop Manager - initiates requests
 * 2. Storesman - validates stock, manages inventory
 * 3. Accountant - validates budget, manages disbursement
 * 4. Director - approves exceptions, threshold breaches
 * 5. Supplier - external portal access
 * 6. Admin - technical configuration only
 */
export type UserRole = 'shopmanager' | 'storesman' | 'accountant' | 'director' | 'supplier' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string;
  branchName?: string;
  supplierId?: string; // For supplier role
  avatarColor: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  
  // Notification preferences
  notificationSettings?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  phoneNumber?: string; // For SMS notifications
}

// ═════════════════════════════════════════════════════════════════════════════
// BRANCH & ORGANIZATION
// ═════════════════════════════════════════════════════════════════════════════

export interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  address?: string;
  managerId: string;
  managerName: string;
  storesmanId?: string;
  storesmanName?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// STOCK & INVENTORY MANAGEMENT (CRITICAL NEW MODULE)
// ═════════════════════════════════════════════════════════════════════════════

export type StockStatus = 'in_stock' | 'low_stock' | 'critical' | 'out_of_stock' | 'on_order';

export interface StockRecord {
  id: string;
  productId: string;
  productName: string;
  branchId: string;
  branchName: string;
  
  // Current stock levels
  quantityOnHand: number;
  quantityReserved: number; // Committed to requests
  quantityIncoming: number; // On order, not yet received
  availableQuantity: number; // On hand - reserved
  
  // Stock thresholds
  reorderLevel: number;
  reorderQuantity: number;
  maxStockLevel: number;
  
  // Coverage metrics
  weeklyUsageRate: number;
  daysOfCover: number;
  twoWeekCover: number;
  
  // Status
  status: StockStatus;
  
  // Tracking
  lastMovementAt?: string;
  lastCountedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type StockMovementType = 
  | 'receipt'      // Stock received from supplier
  | 'issue'        // Stock issued to production/operations
  | 'adjustment'   // Stock count adjustment
  | 'transfer_in'  // Transfer from another branch
  | 'transfer_out' // Transfer to another branch
  | 'return'       // Return to supplier
  | 'waste';       // Spoilage/waste

export interface StockMovement {
  id: string;
  stockRecordId: string;
  productId: string;
  productName: string;
  branchId: string;
  
  type: StockMovementType;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  
  // References
  requestId?: string;
  deliveryId?: string;
  supplierId?: string;
  
  // Metadata
  notes?: string;
  performedById: string;
  performedByName: string;
  createdAt: string;
}

export interface ReorderLevel {
  id: string;
  productId: string;
  branchId: string;
  
  // Calculation parameters
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  
  // Dynamic calculation
  leadTimeDays: number;
  safetyStockDays: number;
  
  // Usage analytics
  avgDailyUsage: number;
  maxDailyUsage: number;
  
  updatedAt: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// BUDGET MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

export interface Budget {
  id: string;
  branchId: string;
  branchName: string;
  categoryId: string;
  categoryName: string;
  period: string; // YYYY-MM format
  allocated: number;
  committed: number; // Pending approval
  spent: number; // Funds released
  available: number;
  utilizationPercent: number;
  status: 'healthy' | 'caution' | 'critical' | 'exhausted';
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

// ═════════════════════════════════════════════════════════════════════════════
// SUPPLIER MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

export type SupplierStatus = 'pending_kyc' | 'active' | 'suspended' | 'blacklisted';
export type SupplierCategory = 'food' | 'beverages' | 'cleaning' | 'equipment' | 'services' | 'utilities';

export interface Supplier {
  id: string;
  name: string;
  tradingName?: string;
  tin: string;
  vatNumber?: string;
  registrationNumber: string;
  status: SupplierStatus;
  
  // Contact
  primaryContact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  
  // Banking
  bankName?: string;
  bankAccount?: string;
  bankBranch?: string;
  
  // Business
  categories: SupplierCategory[];
  branchIds: string[];
  
  // KYC
  kycDocuments: KYCDocument[];
  kycVerifiedAt?: string;
  kycVerifiedBy?: string;
  
  // Performance metrics
  totalSpend: number;
  requestCount: number;
  rating: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  
  // Intelligence
  priceDeviationCount: number;
  urgentRequestsCaused: number;
  avgFulfillmentDays: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface KYCDocument {
  id: string;
  type: 'business_registration' | 'tax_clearance' | 'bank_statement' | 'trade_license' | 'id_document' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  expiryDate?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// PRODUCT & PROCUREMENT CATALOG
// ═════════════════════════════════════════════════════════════════════════════

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  unit: string;
  description?: string;
  sku?: string;
  barcode?: string;
  isActive: boolean;
  createdAt: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  unit: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  minimumOrderQuantity: number;
  leadTimeDays: number;
  isActive: boolean;
  lastUpdated: string;
}

export interface SupplierPrice {
  id: string;
  supplierProductId: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  price: number;
  currency: string;
  effectiveDate: string;
  expiryDate?: string;
  bulkPricing?: BulkPricingTier[];
  isValid: boolean;
  createdAt: string;
  createdBy: string;
}

export interface BulkPricingTier {
  minQuantity: number;
  price: number;
}

export interface PriceComparison {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  comparisons: SupplierPriceQuote[];
  recommended: SupplierPriceQuote | null;
  alternatives: SupplierPriceQuote[];
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
  supplierStatus: SupplierStatus;
  supplierRating: number;
  price: number;
  bulkPrice?: number;
  totalCost: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  leadTimeDays: number;
  isRecommended: boolean;
  isAvailable: boolean;
  priceDeviation: number;
  rank: number;
}

// ═════════════════════════════════════════════════════════════════════════════
// PRICE DEVIATION TRACKING (NEW CRITICAL MODULE)
// ═════════════════════════════════════════════════════════════════════════════

export interface PriceDeviation {
  id: string;
  requestId: string;
  productId: string;
  productName: string;
  
  // Price comparison
  systemPrice: number;
  actualPrice: number;
  varianceAmount: number;
  variancePercent: number;
  
  // Context
  supplierId: string;
  supplierName: string;
  reason: string;
  receiptUrl?: string;
  
  // Impact
  costImpact: number;
  cosImpactPercent?: number;
  
  // Workflow
  status: 'pending_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  
  createdAt: string;
  createdBy: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// DELIVERY & RECEIPT MANAGEMENT (NEW MODULE)
// ═════════════════════════════════════════════════════════════════════════════

export type DeliveryStatus = 
  | 'awaiting_fulfillment' 
  | 'in_transit' 
  | 'partial_delivery'
  | 'delivered' 
  | 'disputed';

export interface Delivery {
  id: string;
  requestId: string;
  requestNumber: string;
  
  supplierId: string;
  supplierName: string;
  
  // Expected
  expectedItems: DeliveryItem[];
  expectedTotal: number;
  
  // Actual
  actualItems?: DeliveryItem[];
  actualTotal?: number;
  
  // Status
  status: DeliveryStatus;
  
  // Tracking
  dispatchedAt?: string;
  deliveredAt?: string;
  receivedById?: string;
  receivedByName?: string;
  
  // Discrepancy
  hasDiscrepancy: boolean;
  discrepancyReason?: string;
  
  createdAt: string;
}

export interface DeliveryItem {
  productId: string;
  productName: string;
  unit: string;
  expectedQuantity: number;
  actualQuantity?: number;
  unitPrice: number;
}

export interface DeliveryReceipt {
  id: string;
  deliveryId: string;
  requestId: string;
  
  // Receipt details
  receiptNumber?: string;
  receiptImageUrl: string;
  receiptDate: string;
  
  // Financial
  amount: number;
  supplierName: string;
  
  // Validation
  validatedById?: string;
  validatedAt?: string;
  status: 'pending' | 'validated' | 'rejected';
  
  // Price deviation link
  priceDeviationId?: string;
  
  createdAt: string;
  uploadedById: string;
  uploadedByName: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// PURCHASE REQUEST WORKFLOW (7-STEP MODEL)
// ═════════════════════════════════════════════════════════════════════════════

export type RequestStatus = 
  | 'draft'
  | 'submitted'
  | 'storesman_review'      // Step 2: Stock validation
  | 'accountant_review'     // Step 3: Budget validation
  | 'director_review'       // Step 4: Exception approval
  | 'supplier_alerted'      // Step 5: Supplier notified
  | 'awaiting_delivery'     // Step 6: Awaiting fulfilment
  | 'partial_delivery'
  | 'delivered'             // Step 6: Delivery confirmed
  | 'payment_pending'       // Step 7: Ready for payment
  | 'funds_released'        // Step 7: Payment complete
  | 'rejected'
  | 'returned';

export type RequestType = 'standard' | 'emergency' | 'pick_n_pay' | 'adhoc';
export type UrgencyLevel = 'normal' | 'high' | 'urgent';

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  type: RequestType;
  status: RequestStatus;
  
  // Requestor
  requestorId: string;
  requestorName: string;
  branchId: string;
  branchName: string;
  
  // Product selection
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  
  // System allocation
  allocation?: AllocationDecision;
  
  // Supplier (from allocation or manual)
  supplierId?: string;
  supplierName?: string;
  
  // Financial
  amount: number;
  currency: string;
  description: string;
  justification?: string;
  
  // Urgency & timing
  urgency: UrgencyLevel;
  requiredBy?: string;
  
  // Receipt requirement
  receiptRequired: boolean;
  receiptUploaded: boolean;
  receiptId?: string;
  
  // Workflow tracking
  createdAt: string;
  submittedAt?: string;
  
  // Step 2: Storesman validation
  storesmanReviewedAt?: string;
  storesmanReviewerId?: string;
  storesmanReviewerName?: string;
  storesmanDecision?: 'validated' | 'rejected' | 'returned';
  storesmanNotes?: string;
  stockValidation?: StockValidation;
  
  // Step 3: Accountant validation
  accountantReviewedAt?: string;
  accountantReviewerId?: string;
  accountantReviewerName?: string;
  accountantDecision?: 'validated' | 'rejected' | 'returned';
  accountantNotes?: string;
  budgetValidated: boolean;
  
  // Step 4: Director approval
  directorApprovedAt?: string;
  directorApproverId?: string;
  directorApproverName?: string;
  directorDecision?: 'approved' | 'rejected';
  directorNotes?: string;
  
  // Step 5: Supplier
  supplierAlertedAt?: string;
  supplierResponse?: string;
  expectedDeliveryDate?: string;
  
  // Step 6: Delivery
  deliveryId?: string;
  deliveredAt?: string;
  receivedById?: string;
  receivedByName?: string;
  
  // Step 7: Payment
  fundsReleasedAt?: string;
  fundsReleasedById?: string;
  fundsReleasedByName?: string;
  paymentReference?: string;
  paymentMethod?: 'bank_transfer' | 'cash' | 'mobile_money';
  
  // Exception handling
  isException: boolean;
  exceptionType?: 'over_budget' | 'price_deviation' | 'missing_receipt' | 'urgent' | 'threshold_breach';
  exceptionReason?: string;
  exceptionApprovedBy?: string;
  
  // Attachments
  attachments: Attachment[];
  
  // Comments thread
  comments: Comment[];
}

export interface StockValidation {
  stockOnHand: number;
  stockIncoming: number;
  reorderLevel: number;
  twoWeekCover: number;
  usageTrend: 'increasing' | 'stable' | 'decreasing';
  recommendation: 'approve' | 'reject' | 'substitute';
  substituteProductId?: string;
  substituteProductName?: string;
}

export interface AllocationDecision {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  selectedSupplierId: string;
  selectedSupplierName: string;
  selectedPrice: number;
  totalCost: number;
  mode: 'auto' | 'assisted' | 'manual';
  isOverride: boolean;
  originalRecommendation?: string;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  priceComparison: PriceComparison;
  flags: AllocationFlag[];
  createdAt: string;
}

export interface AllocationFlag {
  type: 'price_spike' | 'price_drop' | 'single_supplier' | 'high_deviation' | 'low_stock' | 'no_alternative' | 'expired_price';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  attachments?: Attachment[];
  createdAt: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// INVALID REQUEST REPORTING (NEW MODULE)
// ═════════════════════════════════════════════════════════════════════════════

export type InvalidRequestReason = 
  | 'missing_fields'
  | 'missing_supplier'
  | 'missing_receipt'
  | 'no_stock_validation'
  | 'budget_breach_unapproved'
  | 'price_deviation_unexplained'
  | 'invalid_product'
  | 'duplicate_request'
  | 'supplier_unavailable'
  | 'governance_denial'
  | 'rejected_at_validation';

export interface InvalidRequest {
  id: string;
  requestId?: string;
  requestNumber?: string;
  
  // Identifiers
  branchId: string;
  branchName: string;
  requestorId: string;
  requestorName: string;
  productId?: string;
  productName?: string;
  
  // Classification
  type: RequestType;
  reason: InvalidRequestReason;
  description: string;
  
  // Workflow context
  stageFailed: string;
  failedAt: string;
  
  // Financial exposure
  amount?: number;
  financialExposure: number;
  
  // Resolution
  status: 'open' | 'under_review' | 'resolved' | 'escalated';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  
  // Metrics
  turnaroundHours?: number;
  
  createdAt: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// DISBURSEMENT & PAYMENT
// ═════════════════════════════════════════════════════════════════════════════

export interface Disbursement {
  id: string;
  requestId: string;
  requestNumber: string;
  deliveryId?: string;
  
  // Payee
  supplierId?: string;
  supplierName?: string;
  payeeName: string;
  
  // Payment details
  amount: number;
  currency: string;
  method: 'bank_transfer' | 'cash' | 'mobile_money';
  
  // Banking
  bankName?: string;
  bankAccount?: string;
  bankBranch?: string;
  swiftCode?: string;
  
  // Mobile money
  mobileProvider?: 'ecocash' | 'onemoney' | 'telecash';
  mobileNumber?: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Execution
  processedBy: string;
  processedAt: string;
  reference: string;
  receiptUrl?: string;
  
  createdAt: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// PETTY CASH
// ═════════════════════════════════════════════════════════════════════════════

export interface PettyCashFloat {
  id: string;
  branchId: string;
  branchName: string;
  cashierId: string;
  cashierName: string;
  period: string;
  allocatedAmount: number;
  currentBalance: number;
  totalExpenses: number;
  status: 'active' | 'pending_reconciliation' | 'reconciled' | 'closed';
  createdAt: string;
  closedAt?: string;
}

export interface PettyCashTransaction {
  id: string;
  floatId: string;
  type: 'topup' | 'expense' | 'reconciliation' | 'refund';
  amount: number;
  description: string;
  category?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  balanceAfter: number;
  createdById: string;
  createdByName: string;
  createdAt: string;
  approvedBy?: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// ASSET MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════════

export type AssetStatus = 'active' | 'maintenance' | 'damaged' | 'disposed' | 'transferred' | 'storage';
export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'unserviceable';
export type AssetCategory = 'equipment' | 'furniture' | 'electronics' | 'vehicle' | 'tools' | 'inventory';

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: AssetCategory;
  categoryId: string;
  
  // Location
  branchId: string;
  branchName: string;
  custodianId?: string;
  custodianName?: string;
  location?: string;
  
  // Details
  description?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  
  // Purchase
  purchaseValue: number;
  currentValue: number;
  depreciationRate: number;
  purchaseDate: string;
  supplierId?: string;
  supplierName?: string;
  
  // Warranty
  warrantyExpiry?: string;
  
  // Status
  condition: AssetCondition;
  status: AssetStatus;
  
  // Maintenance
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface AssetMovement {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  type: 'assignment' | 'transfer' | 'maintenance' | 'disposal';
  
  fromBranchId?: string;
  fromBranchName?: string;
  toBranchId?: string;
  toBranchName?: string;
  
  initiatedById: string;
  initiatedByName: string;
  initiatedAt: string;
  
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string;
  
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  notes?: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// NOTIFICATION SYSTEM
// ═════════════════════════════════════════════════════════════════════════════

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';
export type NotificationType = 
  | 'request_submitted'
  | 'stock_validation_required'
  | 'accountant_validation_required'
  | 'director_approval_required'
  | 'supplier_alerted'
  | 'price_deviation_flagged'
  | 'receipt_missing'
  | 'request_denied'
  | 'delivery_overdue'
  | 'stock_critical'
  | 'reorder_breached'
  | 'supplier_price_updated'
  | 'order_received'
  | 'payment_completed'
  | 'delivery_confirmed';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  
  // Channel tracking
  channels: NotificationChannel[];
  emailSent: boolean;
  smsSent: boolean;
  pushSent: boolean;
  
  // Content
  entityType: 'request' | 'stock' | 'delivery' | 'budget' | 'supplier';
  entityId: string;
  
  // Status
  read: boolean;
  readAt?: string;
  
  // Retry tracking for external channels
  emailAttempts: number;
  smsAttempts: number;
  lastAttemptAt?: string;
  
  createdAt: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// AUDIT LOG
// ═════════════════════════════════════════════════════════════════════════════

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  details: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// COST OF SALES IMPACT (NEW MODULE)
// ═════════════════════════════════════════════════════════════════════════════

export interface CostImpact {
  id: string;
  period: string; // YYYY-MM
  
  // Category breakdown
  categoryId: string;
  categoryName: string;
  branchId: string;
  
  // Baseline
  baselineCost: number;
  actualCost: number;
  variance: number;
  variancePercent: number;
  
  // Drivers
  priceChangeImpact: number;
  volumeChangeImpact: number;
  deviationImpact: number;
  
  // Reporting
  createdAt: string;
  reportedBy: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD METRICS
// ═════════════════════════════════════════════════════════════════════════════

export interface DashboardMetrics {
  // Financial
  totalBudget: number;
  committed: number;
  spent: number;
  available: number;
  
  // Workflow queues
  pendingReview: number;
  pendingApproval: number;
  pendingRelease: number;
  
  // Exceptions
  exceptions: number;
  overBudgetRequests: number;
  thresholdBreaches: number;
  priceDeviations: number;
  missingReceipts: number;
  
  // Performance
  complianceScore: number;
  averageProcessingTime: number;
  requestToFulfilmentDays: number;
  invalidRequestRate: number;
  
  // Stock
  stockoutRiskCount: number;
  criticalStockCount: number;
  lowStockCount: number;
  
  // Trends
  spendTrend: 'up' | 'down' | 'stable';
  spendTrendPercent: number;
  savingsPercentage: number;
}

// ═════════════════════════════════════════════════════════════════════════════
// GROQ API INTEGRATION
// ═════════════════════════════════════════════════════════════════════════════

export interface GroqAnalysis {
  id: string;
  type: 'request_summary' | 'deviation_explanation' | 'supplier_assessment' | 'executive_brief' | 'invalid_analysis';
  entityType: string;
  entityId: string;
  
  // Input data
  inputData: Record<string, unknown>;
  
  // Generated content
  summary?: string;
  insights?: string[];
  recommendations?: string[];
  riskFlags?: string[];
  
  // Metadata
  model: string;
  tokensUsed: number;
  processingTimeMs: number;
  createdAt: string;
}
