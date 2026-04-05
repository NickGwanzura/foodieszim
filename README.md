# Foodies Zimbabwe — Financial Control Platform

Enterprise financial governance system for multi-branch food retail operations. Built on IBM Carbon Design System.

## Overview

This platform manages:
- **Purchase Control** — Shop-level purchase requests with full approval workflow
- **Petty Cash Control** — Float allocation, top-ups, and reconciliation
- **Budget Enforcement** — Real-time budget tracking with threshold alerts
- **Supplier Governance** — KYC-verified supplier onboarding and management
- **Asset Management** — Fixed asset register, transfers, and maintenance
- **Executive Oversight** — Governance dashboards and exception handling

## Role Structure

The system is built around **4 core roles**:

### 1. Shop Manager
- Creates purchase requests
- Manages petty cash
- Tracks branch budget usage
- Initiates asset requests/transfers
- First-level approval for staff requests

### 2. Accountant (Finance + Accounts Combined)
- **Step 2**: Validates requests against budget
- **Step 4**: Releases funds after full approval chain
- Manages supplier KYC approvals
- Maintains branch/category budgets
- Generates financial reports
- Cannot override executive approval requirements

### 3. Director / Chairman
- Final authority on financial risk
- Approves high-value requests (>$2,000)
- Approves over-budget requests (exceptions)
- Views system-wide governance dashboards
- Monitors compliance and branch performance

### 4. System Admin
- Manages users and roles
- Configures thresholds
- System settings only
- No financial approval involvement

## Approval Workflow

```
Step 1: Shop Manager → Creates request
Step 2: Accountant → Validates budget & compliance
Step 3: Director → Approves (if threshold/exception)
Step 4: Accountant → Releases funds (after full approval)
```

**Key Rules:**
- Accountant appears twice (validator + executor)
- Cannot release funds without full approval chain
- High-value requests auto-route to Director
- Over-budget requests trigger exception workflow

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + IBM Carbon Design System
- **Fonts**: IBM Plex Sans, IBM Plex Mono, IBM Plex Sans Condensed
- **State**: React Context (Auth)
- **Data**: Mock data layer (ready for API integration)
- **Port**: 3001

## Project Structure

```
foodies-platform/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Role-specific overview
│   │   ├── layout.tsx            # Dashboard shell
│   │   ├── requests/
│   │   │   ├── page.tsx          # My Requests list
│   │   │   └── new/
│   │   │       └── page.tsx      # Create Request (3-step wizard)
│   │   ├── petty-cash/
│   │   │   └── page.tsx          # Petty Cash ledger
│   │   ├── budgets/
│   │   │   └── page.tsx          # Budget status by category
│   │   ├── assets/
│   │   │   └── page.tsx          # Asset register
│   │   ├── review/
│   │   │   └── page.tsx          # Accountant validation queue
│   │   ├── release/
│   │   │   └── page.tsx          # Fund disbursement
│   │   ├── suppliers/
│   │   │   └── page.tsx          # Supplier management
│   │   ├── approvals/
│   │   │   └── page.tsx          # Director approval queue
│   │   ├── governance/
│   │   │   └── page.tsx          # Executive dashboard
│   │   ├── exceptions/
│   │   │   └── page.tsx          # Budget exception handling
│   │   ├── reports/
│   │   │   └── page.tsx          # Report downloads
│   │   ├── users/
│   │   │   └── page.tsx          # User management
│   │   ├── branches/
│   │   │   └── page.tsx          # Branch configuration
│   │   ├── thresholds/
│   │   │   └── page.tsx          # Threshold settings
│   │   └── audit/
│   │       └── page.tsx          # System audit log
│   ├── page.tsx                  # Login page ( redesigned )
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Carbon Design System styles
├── components/
│   ├── header.tsx                # App header (yellow branding)
│   ├── sidebar.tsx               # Role-based navigation
│   ├── page-header.tsx           # Page title + breadcrumbs
│   ├── kpi-card.tsx              # KPI metric cards
│   ├── status-badge.tsx          # Status labels
│   └── data-table.tsx            # Data table component
├── data/
│   └── mock.ts                   # Complete mock data
├── lib/
│   ├── auth-context.tsx          # Authentication context
│   └── utils.ts                  # Utilities
├── types/
│   └── index.ts                  # TypeScript definitions
├── public/
│   └── foodies-logo.svg          # Logo
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── next.config.js
```

## Complete Page List (17 Pages)

### Shop Manager Pages
1. `/dashboard` — Overview with branch KPIs
2. `/dashboard/requests` — My Requests list
3. `/dashboard/requests/new` — Create Request (3-step wizard)
4. `/dashboard/petty-cash` — Petty Cash ledger
5. `/dashboard/budgets` — Budget status by category
6. `/dashboard/assets` — Branch asset register

### Accountant Pages
7. `/dashboard/review` — Finance review queue
8. `/dashboard/release` — Fund disbursement
9. `/dashboard/suppliers` — Supplier management
10. `/dashboard/budgets` — Budget management
11. `/dashboard/reports` — Reports & analytics

### Director Pages
12. `/dashboard/approvals` — Executive approval queue
13. `/dashboard/governance` — Governance dashboard
14. `/dashboard/exceptions` — Budget exception handling
15. `/dashboard/reports` — Executive reports

### Admin Pages
16. `/dashboard/users` — User & role management
17. `/dashboard/branches` — Branch configuration
18. `/dashboard/thresholds` — Approval threshold settings
19. `/dashboard/audit` — System audit log

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001)

4. Select a demo role:
   - **Shop Manager** (K. Mutasa)
   - **Accountant** (C. Mutandwa)
   - **Director** (D. Chinhoro)
   - **System Admin** (A. Moyo)

## Design Principles

1. **Financial Governance First** — Every feature reinforces control
2. **Budget Enforcement** — Real-time tracking prevents overspend
3. **Audit Trail** — All actions logged with user/timestamp
4. **Executive Visibility** — Director has oversight without operational noise
5. **Operational Efficiency** — Shop managers can work without friction
6. **Carbon Compliance** — Strict adherence to IBM Design System
7. **Foodies Brand** — Yellow (#F5C518) primary color throughout

## Key Features

### Dashboard Views by Role

**Shop Manager:**
- Branch budget KPIs
- My requests table
- Pending my review
- Budget status by category

**Accountant:**
- System-wide budget metrics
- Exception alerts
- Finance review queue
- Disbursement queue
- Branch compliance table

**Director:**
- Executive KPIs
- Pending executive approvals
- Budget exception requests
- Branch performance overview

### Data Models

- **PurchaseRequest** — Full request lifecycle with approval timestamps
- **Budget** — Category-level budget tracking (allocated/committed/spent)
- **Supplier** — KYC status, service categories, branch coverage
- **Asset** — Fixed asset register with custody and maintenance
- **PettyCash** — Float management with transaction ledger

## Differentiation from CVS

| Aspect | CVS | Foodies |
|--------|-----|---------|
| **Domain** | Petty cash only | Full procurement + assets |
| **Roles** | 6 fragmented roles | 4 consolidated roles |
| **Approval** | 2-step (Accountant → Manager) | 4-layer with Director |
| **Budget** | Simple monthly limit | Category-level enforcement |
| **Assets** | None | Full asset management |
| **Supplier** | Basic list | KYC governance |
| **Focus** | Cash disbursement | Financial control |
| **Login UI** | Split vertical panels | Centered card with stats |
| **Branding** | Brand-specific colors | Foodies yellow throughout |

## Future Integration Points

- REST/GraphQL API layer
- Email notifications
- SMS alerts for urgent requests
- Mobile app for shop managers
- BI integration for reporting
- Bank payment APIs
- Supplier portal

## License

Internal use only — Foodies Zimbabwe
