// ═════════════════════════════════════════════════════════════════════════════
// FOODIES ZIMBABWE — MOCK DATA
// ═════════════════════════════════════════════════════════════════════════════

import {
  User, Branch, PurchaseRequest, Budget, BudgetCategory,
  Supplier, Asset, AssetMovement, PettyCashFloat, PettyCashTransaction,
  Notification
} from '@/types';

// ── USERS ────────────────────────────────────────────────────────────────────
export const users: User[] = [
  {
    id: 'u1',
    name: 'K. Mutasa',
    email: 'k.mutasa@foodies.co.zw',
    role: 'shopmanager',
    branchId: 'b1',
    avatarColor: '#24a148',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 'u2',
    name: 'C. Mutandwa',
    email: 'c.mutandwa@foodies.co.zw',
    role: 'accountant',
    avatarColor: '#6929c4',
    isActive: true,
    createdAt: '2024-01-10'
  },
  {
    id: 'u3',
    name: 'D. Chinhoro',
    email: 'd.chinhoro@foodies.co.zw',
    role: 'director',
    avatarColor: '#161616',
    isActive: true,
    createdAt: '2024-01-01'
  }
];

// ── BRANCHES ─────────────────────────────────────────────────────────────────
export const branches: Branch[] = [
  { id: 'b1', name: 'Avondale Shop', code: 'AVD', location: 'Avondale, Harare', managerId: 'u1', managerName: 'K. Mutasa', isActive: true, createdAt: '2024-01-01' },
  { id: 'b2', name: 'Eastgate Shop', code: 'ETG', location: 'Eastgate Mall, Harare', managerId: 'u1', managerName: 'K. Mutasa', isActive: true, createdAt: '2024-01-01' },
  { id: 'b3', name: 'Sam Levy Shop', code: 'SLV', location: 'Sam Levy Village', managerId: 'u1', managerName: 'K. Mutasa', isActive: true, createdAt: '2024-01-01' },
  { id: 'b4', name: 'Borrowdale Shop', code: 'BRW', location: 'Borrowdale, Harare', managerId: 'u1', managerName: 'K. Mutasa', isActive: true, createdAt: '2024-01-01' }
];

// ── BUDGET CATEGORIES ────────────────────────────────────────────────────────
export const budgetCategories: BudgetCategory[] = [
  { id: 'cat1', name: 'Kitchen Equipment', code: 'KITCHEN', description: 'Ovens, fryers, prep equipment', isActive: true },
  { id: 'cat2', name: 'Cleaning Supplies', code: 'CLEANING', description: 'Detergents, sanitizers, equipment', isActive: true },
  { id: 'cat3', name: 'Maintenance & Repairs', code: 'MAINT', description: 'Equipment repairs, facility maintenance', isActive: true },
  { id: 'cat4', name: 'Stationery & Office', code: 'OFFICE', description: 'Office supplies, printing', isActive: true },
  { id: 'cat5', name: 'Utilities & Gas', code: 'UTILITIES', description: 'Gas refills, utilities', isActive: true },
  { id: 'cat6', name: 'Inventory', code: 'INVENTORY', description: 'Non-food inventory items', isActive: true }
];

// ── BUDGETS ──────────────────────────────────────────────────────────────────
export const budgets = [
  // Avondale
  { id: 'bg1', branchId: 'b1', branchName: 'Avondale Shop', categoryId: 'cat1', categoryName: 'Kitchen Equipment', period: '2025-04', allocated: 5000, committed: 2450, spent: 1250, available: 1300 },
  { id: 'bg2', branchId: 'b1', branchName: 'Avondale Shop', categoryId: 'cat2', categoryName: 'Cleaning Supplies', period: '2025-04', allocated: 3000, committed: 450, spent: 800, available: 1750 },
  { id: 'bg3', branchId: 'b1', branchName: 'Avondale Shop', categoryId: 'cat3', categoryName: 'Maintenance & Repairs', period: '2025-04', allocated: 6000, committed: 180, spent: 3200, available: 2620 },
  { id: 'bg4', branchId: 'b1', branchName: 'Avondale Shop', categoryId: 'cat4', categoryName: 'Stationery & Office', period: '2025-04', allocated: 2000, committed: 85, spent: 450, available: 1465 },
  { id: 'bg5', branchId: 'b1', branchName: 'Avondale Shop', categoryId: 'cat5', categoryName: 'Utilities & Gas', period: '2025-04', allocated: 4500, committed: 0, spent: 2800, available: 1700 },
  { id: 'bg6', branchId: 'b1', branchName: 'Avondale Shop', categoryId: 'cat6', categoryName: 'Inventory', period: '2025-04', allocated: 4500, committed: 0, spent: 1200, available: 3300 },
  
  // Eastgate
  { id: 'bg7', branchId: 'b2', branchName: 'Eastgate Shop', categoryId: 'cat1', categoryName: 'Kitchen Equipment', period: '2025-04', allocated: 6000, committed: 1800, spent: 3200, available: 1000 },
  { id: 'bg8', branchId: 'b2', branchName: 'Eastgate Shop', categoryId: 'cat2', categoryName: 'Cleaning Supplies', period: '2025-04', allocated: 3500, committed: 0, spent: 1200, available: 2300 },
  { id: 'bg9', branchId: 'b2', branchName: 'Eastgate Shop', categoryId: 'cat3', categoryName: 'Maintenance & Repairs', period: '2025-04', allocated: 7000, committed: 0, spent: 4500, available: 2500 },
  { id: 'bg10', branchId: 'b2', branchName: 'Eastgate Shop', categoryId: 'cat4', categoryName: 'Stationery & Office', period: '2025-04', allocated: 2500, committed: 0, spent: 800, available: 1700 },
  { id: 'bg11', branchId: 'b2', branchName: 'Eastgate Shop', categoryId: 'cat5', categoryName: 'Utilities & Gas', period: '2025-04', allocated: 5500, committed: 1200, spent: 3100, available: 1200 },
  { id: 'bg12', branchId: 'b2', branchName: 'Eastgate Shop', categoryId: 'cat6', categoryName: 'Inventory', period: '2025-04', allocated: 5000, committed: 0, spent: 2100, available: 2900 },
  
  // Borrowdale - over budget
  { id: 'bg13', branchId: 'b4', branchName: 'Borrowdale Shop', categoryId: 'cat1', categoryName: 'Kitchen Equipment', period: '2025-04', allocated: 5500, committed: 8500, spent: 3200, available: -6200 },
  { id: 'bg14', branchId: 'b4', branchName: 'Borrowdale Shop', categoryId: 'cat2', categoryName: 'Cleaning Supplies', period: '2025-04', allocated: 3000, committed: 0, spent: 1500, available: 1500 },
  { id: 'bg15', branchId: 'b4', branchName: 'Borrowdale Shop', categoryId: 'cat3', categoryName: 'Maintenance & Repairs', period: '2025-04', allocated: 6500, committed: 0, spent: 4200, available: 2300 },
  { id: 'bg16', branchId: 'b4', branchName: 'Borrowdale Shop', categoryId: 'cat4', categoryName: 'Stationery & Office', period: '2025-04', allocated: 2200, committed: 0, spent: 600, available: 1600 },
  { id: 'bg17', branchId: 'b4', branchName: 'Borrowdale Shop', categoryId: 'cat5', categoryName: 'Utilities & Gas', period: '2025-04', allocated: 5000, committed: 0, spent: 2900, available: 2100 },
  { id: 'bg18', branchId: 'b4', branchName: 'Borrowdale Shop', categoryId: 'cat6', categoryName: 'Inventory', period: '2025-04', allocated: 5800, committed: 0, spent: 1800, available: 4000 }
];

// ── SUPPLIERS ─────────────────────────────────────────────────────────────────
export const suppliers = [
  {
    id: 'sup1',
    name: 'ZimKitchen Supplies Ltd',
    tradingName: 'ZimKitchen',
    tin: 'ZW-TIN-20001234',
    registrationNumber: 'CR12345/2020',
    status: 'active',
    primaryContact: 'J. Mupfumi',
    email: 'orders@zimkitchen.co.zw',
    phone: '+263 242 123 456',
    address: '15 Birmingham Road, Southerton, Harare',
    categories: ['cat1', 'cat6'],
    branchIds: ['b1', 'b2', 'b3', 'b4'],
    kycDocuments: [
      { id: 'kyc1', type: 'Tax Clearance', name: 'tax_clearance_2025.pdf', url: '#', uploadedAt: '2025-01-15' },
      { id: 'kyc2', type: 'Bank Confirmation', name: 'bank_letter.pdf', url: '#', uploadedAt: '2025-01-15' }
    ],
    kycVerifiedAt: '2025-01-20',
    kycVerifiedBy: 'C. Mutandwa',
    totalSpend: 45200,
    requestCount: 28,
    rating: 4.5,
    createdAt: '2024-01-10'
  },
  {
    id: 'sup2',
    name: 'ProClean Zimbabwe',
    tradingName: 'ProClean',
    tin: 'ZW-TIN-20005678',
    registrationNumber: 'CR67890/2019',
    status: 'active',
    primaryContact: 'S. Tembo',
    email: 'sales@proclean.co.zw',
    phone: '+263 242 789 012',
    address: '45 Arcturus Road, Eastlea, Harare',
    categories: ['cat2'],
    branchIds: ['b1', 'b2', 'b4'],
    kycDocuments: [
      { id: 'kyc3', type: 'Tax Clearance', name: 'tax_clearance_2025.pdf', url: '#', uploadedAt: '2025-01-10' }
    ],
    kycVerifiedAt: '2025-01-12',
    kycVerifiedBy: 'C. Mutandwa',
    totalSpend: 18500,
    requestCount: 42,
    rating: 4.2,
    createdAt: '2024-02-15'
  },
  {
    id: 'sup3',
    name: 'Swift Maintenance Services',
    tradingName: 'Swift Maint',
    tin: 'ZW-TIN-20009012',
    registrationNumber: 'CR34567/2021',
    status: 'active',
    primaryContact: 'T. Ncube',
    email: 'info@swiftmaint.co.zw',
    phone: '+263 772 345 678',
    address: '12 George Silundika Avenue, Harare',
    categories: ['cat3'],
    branchIds: ['b1', 'b2', 'b3', 'b4'],
    kycDocuments: [
      { id: 'kyc4', type: 'Tax Clearance', name: 'tax_clearance_2025.pdf', url: '#', uploadedAt: '2025-02-01' }
    ],
    kycVerifiedAt: '2025-02-05',
    kycVerifiedBy: 'C. Mutandwa',
    totalSpend: 32100,
    requestCount: 35,
    rating: 4.7,
    createdAt: '2024-03-20'
  },
  {
    id: 'sup4',
    name: 'GasLink Zimbabwe',
    tin: 'ZW-TIN-20003456',
    registrationNumber: 'CR89012/2020',
    status: 'pending_kyc',
    primaryContact: 'R. Chingoka',
    email: 'orders@gaslink.co.zw',
    phone: '+263 242 456 789',
    address: '78 Seke Road, Graniteside, Harare',
    categories: ['cat5'],
    branchIds: ['b1', 'b2', 'b3', 'b4'],
    kycDocuments: [
      { id: 'kyc5', type: 'Trade License', name: 'license.pdf', url: '#', uploadedAt: '2025-04-01' }
    ],
    totalSpend: 0,
    requestCount: 0,
    rating: 0,
    createdAt: '2025-04-01'
  }
];

// ── PURCHASE REQUESTS ────────────────────────────────────────────────────────
export const purchaseRequests = [
  {
    id: 'pr1',
    requestNumber: 'PR-0042',
    type: 'purchase',
    status: 'accountant_review',
    requestorId: 'u1',
    requestorName: 'K. Mutasa',
    branchId: 'b1',
    branchName: 'Avondale Shop',
    category: 'Cleaning Supplies',
    categoryId: 'cat2',
    supplierId: 'sup2',
    supplierName: 'ProClean Zimbabwe',
    amount: 450,
    description: 'Monthly cleaning supplies — detergents, sanitizers, mops',
    urgency: 'normal',
    requiredBy: '2025-04-10',
    createdAt: '2025-04-02T09:14:00Z',
    submittedAt: '2025-04-02T09:14:00Z',
    isException: false,
    comments: [
      { id: 'c1', userId: 'u1', userName: 'K. Mutasa', userRole: 'Shop Manager', message: 'Standard monthly order', createdAt: '2025-04-02T09:14:00Z' }
    ]
  },
  {
    id: 'pr2',
    requestNumber: 'PR-0041',
    type: 'purchase',
    status: 'director_review',
    requestorId: 'u1',
    requestorName: 'K. Mutasa',
    branchId: 'b1',
    branchName: 'Avondale Shop',
    category: 'Kitchen Equipment',
    categoryId: 'cat1',
    supplierId: 'sup1',
    supplierName: 'ZimKitchen Supplies Ltd',
    amount: 2450,
    description: 'Replacement of commercial oven heating element and thermostat control unit',
    urgency: 'high',
    requiredBy: '2025-04-05',
    createdAt: '2025-04-01T11:30:00Z',
    submittedAt: '2025-04-01T11:30:00Z',
    accountantReviewedAt: '2025-04-01T14:20:00Z',
    accountantReviewerId: 'u2',
    accountantReviewerName: 'C. Mutandwa',
    accountantNotes: 'Within budget. Requires Director approval (> $2,000)',
    isException: false,
    comments: [
      { id: 'c2', userId: 'u1', userName: 'K. Mutasa', userRole: 'Shop Manager', message: 'Oven critical for daily operations', createdAt: '2025-04-01T11:32:00Z' }
    ]
  },
  {
    id: 'pr3',
    requestNumber: 'PR-0040',
    type: 'emergency',
    status: 'accountant_review',
    requestorId: 'u1',
    requestorName: 'K. Mutasa',
    branchId: 'b4',
    branchName: 'Borrowdale Shop',
    category: 'Kitchen Equipment',
    categoryId: 'cat1',
    supplierId: 'sup1',
    supplierName: 'ZimKitchen Supplies Ltd',
    amount: 8500,
    description: 'Emergency generator installation — power backup for refrigeration',
    urgency: 'urgent',
    requiredBy: '2025-04-03',
    createdAt: '2025-04-01T08:00:00Z',
    submittedAt: '2025-04-01T08:00:00Z',
    isException: true,
    exceptionReason: 'Branch exceeds monthly budget by $3,500. Critical equipment failure.',
    comments: [
      { id: 'c3', userId: 'u1', userName: 'K. Mutasa', userRole: 'Shop Manager', message: 'Freezer units at risk. Immediate action required.', createdAt: '2025-04-01T08:05:00Z' }
    ]
  },
  {
    id: 'pr4',
    requestNumber: 'PR-0039',
    type: 'purchase',
    status: 'approved',
    requestorId: 'u1',
    requestorName: 'K. Mutasa',
    branchId: 'b2',
    branchName: 'Eastgate Shop',
    category: 'Maintenance & Repairs',
    categoryId: 'cat3',
    supplierId: 'sup3',
    supplierName: 'Swift Maintenance Services',
    amount: 1800,
    description: 'Air conditioning system overhaul — 3 units',
    urgency: 'normal',
    createdAt: '2025-03-28T10:00:00Z',
    submittedAt: '2025-03-28T10:00:00Z',
    accountantReviewedAt: '2025-03-28T13:30:00Z',
    accountantReviewerId: 'u2',
    accountantReviewerName: 'C. Mutandwa',
    directorApprovedAt: '2025-03-29T09:00:00Z',
    directorApproverId: 'u3',
    directorApproverName: 'D. Chinhoro',
    isException: false
  },
  {
    id: 'pr5',
    requestNumber: 'PR-0038',
    type: 'purchase',
    status: 'funds_released',
    requestorId: 'u1',
    requestorName: 'K. Mutasa',
    branchId: 'b1',
    branchName: 'Avondale Shop',
    category: 'Kitchen Equipment',
    categoryId: 'cat1',
    supplierId: 'sup1',
    supplierName: 'ZimKitchen Supplies Ltd',
    amount: 1250,
    description: 'Commercial blender replacement — 2 units',
    urgency: 'normal',
    createdAt: '2025-03-25T14:00:00Z',
    submittedAt: '2025-03-25T14:00:00Z',
    accountantReviewedAt: '2025-03-25T16:00:00Z',
    accountantReviewerId: 'u2',
    accountantReviewerName: 'C. Mutandwa',
    directorApprovedAt: '2025-03-26T10:00:00Z',
    directorApproverId: 'u3',
    directorApproverName: 'D. Chinhoro',
    fundsReleasedAt: '2025-03-26T14:30:00Z',
    fundsReleasedById: 'u2',
    fundsReleasedByName: 'C. Mutandwa',
    paymentReference: 'TXN-2025-0038',
    isException: false
  }
];

// ── ASSETS ───────────────────────────────────────────────────────────────────
export const assets = [
  {
    id: 'ast1',
    assetTag: 'FZ-OVN-2024-012',
    name: 'Commercial Convection Oven',
    category: 'Kitchen Equipment',
    categoryId: 'cat1',
    branchId: 'b1',
    branchName: 'Avondale Shop',
    custodianId: 'u1',
    custodianName: 'K. Mutasa',
    description: 'Hobart HGC-40 Commercial Convection Oven — 4 rack capacity, gas/electric hybrid',
    serialNumber: 'HGC40-2024-88921',
    model: 'HGC-40',
    manufacturer: 'Hobart',
    purchaseValue: 4200,
    purchaseDate: '2024-03-15',
    supplierId: 'sup1',
    supplierName: 'ZimKitchen Supplies Ltd',
    warrantyExpiry: '2026-03-15',
    condition: 'good',
    status: 'active',
    lastMaintenanceDate: '2025-01-12',
    nextMaintenanceDate: '2025-07-12',
    createdAt: '2024-03-15'
  },
  {
    id: 'ast2',
    assetTag: 'FZ-REF-2024-008',
    name: 'Walk-in Cold Room',
    category: 'Refrigeration',
    categoryId: 'cat1',
    branchId: 'b1',
    branchName: 'Avondale Shop',
    custodianId: 'u1',
    custodianName: 'K. Mutasa',
    description: 'Polar Walk-in Cold Room — 3m x 2m x 2.2m',
    purchaseValue: 8500,
    purchaseDate: '2024-02-10',
    supplierId: 'sup1',
    supplierName: 'ZimKitchen Supplies Ltd',
    warrantyExpiry: '2026-02-10',
    condition: 'excellent',
    status: 'active',
    lastMaintenanceDate: '2025-02-28',
    nextMaintenanceDate: '2025-05-28',
    createdAt: '2024-02-10'
  },
  {
    id: 'ast3',
    assetTag: 'FZ-POS-2024-015',
    name: 'POS Terminal',
    category: 'POS Devices',
    categoryId: 'cat4',
    branchId: 'b2',
    branchName: 'Eastgate Shop',
    custodianId: 'u1',
    custodianName: 'K. Mutasa',
    description: 'Samsung Kiosk POS Terminal — 15" touchscreen',
    serialNumber: 'POS-SAM-2024-88934',
    purchaseValue: 1200,
    purchaseDate: '2024-04-20',
    warrantyExpiry: '2026-04-20',
    condition: 'excellent',
    status: 'active',
    createdAt: '2024-04-20'
  },
  {
    id: 'ast4',
    assetTag: 'FZ-GEN-2023-005',
    name: 'Backup Generator',
    category: 'Generator',
    categoryId: 'cat3',
    branchId: 'b4',
    branchName: 'Borrowdale Shop',
    custodianId: 'u1',
    custodianName: 'K. Mutasa',
    description: 'Cummins 50kVA Diesel Generator',
    purchaseValue: 15000,
    purchaseDate: '2023-08-15',
    warrantyExpiry: '2025-08-15',
    condition: 'fair',
    status: 'maintenance',
    nextMaintenanceDate: '2025-04-05',
    createdAt: '2023-08-15'
  }
];

// ── ASSET TRANSFERS ──────────────────────────────────────────────────────────
export const assetTransfers = [
  {
    id: 'tr1',
    assetId: 'ast3',
    assetTag: 'FZ-POS-2024-015',
    assetName: 'POS Terminal',
    fromBranchId: 'b2',
    fromBranchName: 'Eastgate Shop',
    toBranchId: 'b3',
    toBranchName: 'Sam Levy Shop',
    initiatedById: 'u1',
    initiatedByName: 'K. Mutasa',
    initiatedAt: '2025-04-01T10:00:00Z',
    status: 'pending',
    notes: 'Temporary transfer for weekend promotion'
  }
];

// ── PETTY CASH ───────────────────────────────────────────────────────────────
export const pettyCashFloats = [
  {
    id: 'pcf1',
    branchId: 'b1',
    branchName: 'Avondale Shop',
    cashierId: 'u1',
    cashierName: 'K. Mutasa',
    period: '2025-04',
    allocatedAmount: 500,
    currentBalance: 287.50,
    status: 'active',
    createdAt: '2025-04-01'
  }
];

export const pettyCashTransactions = [
  {
    id: 'pct1',
    floatId: 'pcf1',
    type: 'topup',
    amount: 500,
    description: 'Weekly float allocation',
    balance: 500,
    createdById: 'u2',
    createdByName: 'C. Mutandwa',
    createdAt: '2025-04-01T08:00:00Z'
  },
  {
    id: 'pct2',
    floatId: 'pcf1',
    type: 'expense',
    amount: -25,
    description: 'Courier delivery',
    category: 'Transport',
    receiptNumber: 'RC-042',
    balance: 475,
    createdById: 'u1',
    createdByName: 'K. Mutasa',
    createdAt: '2025-04-02T10:30:00Z'
  },
  {
    id: 'pct3',
    floatId: 'pcf1',
    type: 'expense',
    amount: -87.50,
    description: 'Stationery — emergency',
    category: 'Office',
    receiptNumber: 'RC-041',
    balance: 387.50,
    createdById: 'u1',
    createdByName: 'K. Mutasa',
    createdAt: '2025-04-02T14:00:00Z'
  },
  {
    id: 'pct4',
    floatId: 'pcf1',
    type: 'expense',
    amount: -100,
    description: 'Staff transport',
    category: 'Transport',
    receiptNumber: 'RC-040',
    balance: 287.50,
    createdById: 'u1',
    createdByName: 'K. Mutasa',
    createdAt: '2025-04-02T16:00:00Z'
  }
];

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const notifications = [
  {
    id: 'n1',
    userId: 'u2',
    type: 'warning',
    title: 'Budget Threshold Exceeded',
    message: 'Borrowdale Shop has exceeded monthly budget by $3,500',
    read: false,
    entityType: 'budget',
    entityId: 'bg13',
    createdAt: '2025-04-02T08:00:00Z'
  },
  {
    id: 'n2',
    userId: 'u3',
    type: 'info',
    title: 'Request Awaiting Approval',
    message: 'PR-0041 ($2,450) requires your approval',
    read: false,
    entityType: 'request',
    entityId: 'pr2',
    createdAt: '2025-04-01T14:30:00Z'
  },
  {
    id: 'n3',
    userId: 'u2',
    type: 'success',
    title: 'Funds Released',
    message: 'PR-0038 ($1,250) has been released',
    read: true,
    entityType: 'request',
    entityId: 'pr5',
    createdAt: '2025-03-26T14:30:00Z'
  }
];

// ── DASHBOARD METRICS ─────────────────────────────────────────────────────────
export function getDashboardMetrics(role: string, branchId?: string) {
  if (role === 'director') {
    return {
      totalBudget: 105000,
      committed: 30820,
      spent: 54600,
      available: 19780,
      pendingApproval: 5,
      pendingRelease: 3,
      exceptions: 3,
      complianceScore: 94
    };
  }
  
  if (role === 'accountant') {
    return {
      totalBudget: 105000,
      committed: 30820,
      spent: 54600,
      available: 19780,
      pendingApproval: 7,
      pendingRelease: 3,
      exceptions: 3,
      complianceScore: 94
    };
  }
  
  // Shop manager — branch specific
  const branch = branches.find(b => b.id === branchId) || branches[0];
  const branchBudgets = budgets.filter(b => b.branchId === branch.id);
  const allocated = branchBudgets.reduce((sum, b) => sum + b.allocated, 0);
  const committed = branchBudgets.reduce((sum, b) => sum + b.committed, 0);
  const spent = branchBudgets.reduce((sum, b) => sum + b.spent, 0);
  
  return {
    totalBudget: allocated,
    committed,
    spent,
    available: allocated - committed - spent,
    pendingApproval: 2,
    pendingRelease: 1,
    exceptions: 0,
    complianceScore: 96
  };
}

export function getBranchSummaries() {
  return branches.map(branch => {
    const branchBudgets = budgets.filter(b => b.branchId === branch.id);
    const budget = branchBudgets.reduce((sum, b) => sum + b.allocated, 0);
    const committed = branchBudgets.reduce((sum, b) => sum + b.committed, 0);
    const spent = branchBudgets.reduce((sum, b) => sum + b.spent, 0);
    const available = budget - committed - spent;
    const utilizationPercent = Math.round(((committed + spent) / budget) * 100);
    
    let status: 'on_track' | 'at_risk' | 'over_budget' = 'on_track';
    if (available < 0) status = 'over_budget';
    else if (utilizationPercent > 85) status = 'at_risk';
    
    const requestCount = purchaseRequests.filter(r => r.branchId === branch.id).length;
    
    return {
      branchId: branch.id,
      branchName: branch.name,
      budget,
      committed,
      spent,
      available,
      utilizationPercent,
      status,
      requestCount
    };
  });
}
