/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, FileText, Server, Database, Key, CreditCard, Layers, Compass, HelpCircle, Code, ShieldCheck, Zap } from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  category: 'Product' | 'Architecture' | 'Engineering' | 'Operations';
  icon: React.ReactNode;
  content: string;
}

export default function DocHub() {
  const [activeTab, setActiveTab] = useState<string>('prd');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sections: DocSection[] = [
    {
      id: 'prd',
      title: '1. Product Requirements Document (PRD)',
      category: 'Product',
      icon: <FileText className="w-5 h-5" />,
      content: `## 1. Executive Summary & Problem Statement
In Malawi, the real estate market is heavily dominated by informal, unregulated middlemen known as "estate agents" or "brokers." These middlemen introduce severe friction:
- **Viewing Fees:** Charging house-hunters non-refundable fees (typically MWK 5,000 to MWK 15,000) just to view a property.
- **Double Commissions:** Charging both the owner and the tenant up to 10% of the rent value.
- **Inaccurate Listings:** Advertising unavailable, outdated, or fabricated properties to collect viewing fees.

Our platform eliminates these middlemen. By creating a direct, transparent property marketplace, property owners manage their listings directly, and verified customers connect, book, and transact securely.

## 2. Platform Core Value Proposition
- **Direct Owner-to-Customer Channel:** Instant click-to-call and WhatsApp click-to-chat API.
- **Durable Property Status:** A self-correcting status model (e.g. automatically updating a rental to "Rented" once booked/paid).
- **Localized Mobile Money Integration:** Instant checkout using PayChangu, Airtel Money, and TNM Mpamba.
- **Flexible Category Layouts:** Different workflows for long-term rentals/sales vs. nightly hospitality bookings.

## 3. Scope Boundaries
- **In-Scope:** Self-service registration, subscription paywall for owners, real-time booking calculations, mobile money webhooks, reviews system, full admin moderating console.
- **Out-of-Scope:** Complete background checks on tenant history (deferred to legal offline contract), automated physical key handovers (facilitated by owner offline), fractional property ownership trading.`
    },
    {
      id: 'biz',
      title: '2. Business Analysis & Monetization',
      category: 'Product',
      icon: <Compass className="w-5 h-5" />,
      content: `## 1. Malawian Market Dynamics
The Malawian property market is experiencing rapid urbanization, particularly in Lilongwe (Area 43, Area 12, Area 49, Area 25) and Blantyre (Namiwawa, Sunnyside, Nyambadza). There is a massive rise in short-term stays (Airbnbs) and student accommodation near UNIMA (Zomba), MUST (Thyolo), and MUBAS (Blantyre). 

## 2. Subscription Model & Pricing
Instead of charging transactional commissions on long-term residential housing (which drives users offline), we charge owners a flat monthly subscription. 

- **Free Tier (MWK 0 / Month):** 1 listing, standard visibility, manual renew every 14 days.
- **Basic Tier (MWK 15,000 / Month):** Up to 5 listings, WhatsApp direct connect, basic analytics.
- **Premium Tier (MWK 35,000 / Month):** Up to 20 listings, featured tags, auto-invoice generator, comprehensive bookings ledger.
- **Enterprise Tier (MWK 85,000 / Month):** Unlimited listings, dedicated priority support, programmatic sync, high-profile banner placements.

## 3. Financial Projections
Assuming a target of 1,500 active property owners within 12 months:
- 60% Free (900 owners)
- 25% Basic (375 owners @ MWK 15k = MWK 5.6M/mo)
- 12% Premium (180 owners @ MWK 35k = MWK 6.3M/mo)
- 3% Enterprise (45 owners @ MWK 85k = MWK 3.8M/mo)
- **Total Estimated Monthly Recurring Revenue (MRR):** MWK 15.7M`
    },
    {
      id: 'personas',
      title: '3. User Personas',
      category: 'Product',
      icon: <Layers className="w-5 h-5" />,
      content: `## Persona 1: Chisomo Phiri (The Property Owner)
- **Age:** 44
- **Location:** Lilongwe, Area 18
- **Role:** Retired civil servant owning three residential units in Area 25 and a beach chalet in Mangochi.
- **Challenges:** Sick and tired of informal brokers demanding high cuts, failing to report occupancy honestly, and not showing properties professionally. Needs an interface to track payments and manage reservations from his phone.
- **Tech Literacy:** Medium. Relies heavily on WhatsApp.

## Persona 2: Tamara Gondwe (The Customer / Tenant)
- **Age:** 28
- **Location:** Blantyre (originally from Mzuzu)
- **Role:** Junior Accountant at a bank.
- **Challenges:** Trying to relocate to Blantyre. Paid MWK 25,000 in total "viewing fees" to three brokers who showed her run-down or already rented flats. Wants to search from her desk, view authentic pictures, verify water/electricity backups, and talk directly to the owner.
- **Tech Literacy:** High. Uses mobile banking and Instagram.

## Persona 3: Alick Banda (The Platform Administrator)
- **Age:** 35
- **Location:** Lilongwe
- **Role:** Customer operations and listing moderator.
- **Goals:** Prevent fraudulent property listings, moderate disputable reviews, verify land title deeds for high-value sales listings, and run weekly performance reports. Needs a simple visual admin board.`
    },
    {
      id: 'stories',
      title: '4. User Stories & Acceptance Criteria',
      category: 'Product',
      icon: <HelpCircle className="w-5 h-5" />,
      content: `## User Story 1: Listing Creation (Owner)
- **As a** Property Owner,
- **I want to** submit a property listing with categories, amenities, location, photos, and my WhatsApp contact,
- **So that** searchers can find my property directly without agents.
- **Acceptance Criteria:**
  - Owner must specify city, district, area, and at least one landmark.
  - Form must validate price as a positive integer.
  - The WhatsApp field must contain a country code (+265).

## User Story 2: Instant Messaging (Customer)
- **As a** Registered Customer or Visitor,
- **I want to** click a single button to initiate a chat with the owner on WhatsApp with a pre-filled message,
- **So that** I do not have to copy and paste phone numbers.
- **Acceptance Criteria:**
  - Clicking "WhatsApp Owner" must format a URL: \`https://wa.me/{phone}?text={urlencoded_text}\`.
  - The message must include the property name and asking price automatically.`
    },
    {
      id: 'functional',
      title: '5. Functional Requirements',
      category: 'Product',
      icon: <Layers className="w-5 h-5" />,
      content: `## FR-1: Search & Filter Engine
- **Search inputs:** Keyword, property type, location, price range (min/max), and specific amenities (Water, Electricity backups, internet).
- **Sorting:** Price (asc/desc), Date Created (newest), Views count.

## FR-2: Booking Scheduler
- Nightly-stay categories (Hotels, Airbnbs, Lodges) must validate dates to prevent double-booking.
- Real-time calculation of total stay price, local taxes, and refundable security deposit.

## FR-3: Automated Invoicing & Receipts
- Generation of PDF/Web invoices immediately upon booking confirmation.
- Generation of Web receipts instantly when a mobile money payment is completed.

## FR-4: Subscription Paywall
- Prevents owners from publishing listings exceeding their active tier limit.
- Automatic suspension of older listings if an owner's subscription expires.`
    },
    {
      id: 'nonfunctional',
      title: '6. Non-Functional Requirements',
      category: 'Product',
      icon: <ShieldCheck className="w-5 h-5" />,
      content: `## NFR-1: Mobile Responsiveness (Critical)
Over 85% of Malawian web traffic is via smartphones. The UI must be fully responsive, with minimum tap targets of 44x44px and zero horizontal scrolling on mobile viewports.

## NFR-2: Performance & Bandwidth Efficiency
Due to high mobile data costs in Malawi, images must be aggressively optimized. Implement lazy-loading for property grids and image-compressing before uploads.

## NFR-3: Availability & Uptime
The system must target 99.9% uptime, deploying on containerized auto-scaling runners with database clustering.

## NFR-4: Security
- Secure storage of mobile money API merchant credentials.
- Input scrubbing for all forms to prevent XSS (Cross-Site Scripting) and SQL injection.`
    },
    {
      id: 'ia',
      title: '7. Information Architecture & Sitemap',
      category: 'Architecture',
      icon: <Compass className="w-5 h-5" />,
      content: `## Sitemap Hierarchy
\`\`\`
├── Landing Page (Hero Search, Featured Districts, Categories Grid)
├── Search Results Listing (Map Sidebar Split, Advanced Grid)
│   ├── Property Details (Availability Calendar, Reviews, Owner Contact Panel)
│   └── Booking / Checkout Page (Payment Provider Select, Mobile Money Drawer)
├── Owner Dashboard
│   ├── Overview Stats Cards
│   ├── Listing Manager (Form Wizard, Status Toggle)
│   ├── Booking Ledger (Invoice/Receipt generator)
│   ├── WhatsApp / Payment Payout Setup
│   └── Performance Charts (Views, Inquiries, Revenue)
├── Platform Admin Console
│   ├── Moderation Queue (Approve Listings, Verify Owners)
│   ├── Category & Location Configuration
│   ├── Disputes & Review Management
│   └── Global Financial Reports
└── Developer Documentation Hub (The 22 System Deliverables)
\`\`\``
    },
    {
      id: 'system-arch',
      title: '8. Complete System Architecture',
      category: 'Architecture',
      icon: <Server className="w-5 h-5" />,
      content: `## High-Level Cloud Topology
- **Frontend / Client Layer:** Single-Page Application (SPA) built using React, TypeScript, and Tailwind CSS. Static assets served over a low-latency Edge CDN.
- **Backend Service Layer:** Express Node.js REST API layer hosting the core business logic, route handlers, and subscription checkers.
- **Database Layer:** 
  - **PostgreSQL:** Relational primary database storing fully normalized tables.
  - **Redis Cache:** In-memory caching for active property availability grids, session structures, and query parameters.
- **Integration Layer:**
  - **PayChangu API:** Proxies for Airtel Money, TNM Mpamba, and local visa cards.
  - **WhatsApp Business API:** Predefined click-to-chat hooks.
  - **SendGrid SMTP:** Handles transaction-based emails.

\`\`\`
[ Client Browser ] <---> [ CDN Edge ]
       |
       v
[ Express REST API ] <---> [ Redis Cache ]
       |
       +---> [ PostgreSQL Primary DB ]
       +---> [ PayChangu payment gateways ]
       +---> [ WhatsApp Business API ]
\`\`\``
    },
    {
      id: 'database-design',
      title: '9. Database Design (ERD & SQL Schema)',
      category: 'Engineering',
      icon: <Database className="w-5 h-5" />,
      content: `## 1. Normalized Relational Schema DDL
\`\`\`sql
-- Users and Roles
CREATE TABLE roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id VARCHAR(50) REFERENCES roles(id),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Owner Profile Metadata
CREATE TABLE owner_profiles (
  owner_id UUID PRIMARY KEY REFERENCES users(id),
  whatsapp_number VARCHAR(50) NOT NULL,
  bank_name VARCHAR(100),
  bank_account VARCHAR(100),
  mobile_money_provider VARCHAR(50), -- 'Airtel' or 'TNM'
  mobile_money_number VARCHAR(50),
  subscription_plan VARCHAR(50) DEFAULT 'Free',
  subscription_expires TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT TRUE
);

-- Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  listing_type VARCHAR(100) NOT NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'Available',
  description TEXT NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'MWK',
  negotiable BOOLEAN DEFAULT FALSE,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  has_parking BOOLEAN DEFAULT FALSE,
  has_kitchen BOOLEAN DEFAULT FALSE,
  has_internet BOOLEAN DEFAULT FALSE,
  has_water_backup BOOLEAN DEFAULT FALSE,
  has_electricity_backup BOOLEAN DEFAULT FALSE,
  security_type VARCHAR(150),
  district VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  area VARCHAR(100) NOT NULL,
  landmark VARCHAR(255),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  views_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings & Payments
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Paid', 'Completed'
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'Airtel Money', 'Mpamba', 'PayChangu'
  transaction_ref VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  receipt_number VARCHAR(100) UNIQUE,
  completed_at TIMESTAMP WITH TIME ZONE
);
\`\`\``
    },
    {
      id: 'api-design',
      title: '10. API Design (RESTful)',
      category: 'Engineering',
      icon: <Code className="w-5 h-5" />,
      content: `## Core REST Endpoints

### 1. Properties Resource
- **GET /api/properties** - Retrieve filtered listings. Query params: \`category\`, \`city\`, \`minPrice\`, \`maxPrice\`, \`bedrooms\`.
- **POST /api/properties** - Create a listing (Owner only). Body contains full JSON payload.
- **GET /api/properties/:id** - View single listing. Increments views_count in DB.
- **PUT /api/properties/:id** - Update details, pricing, status, rules.
- **DELETE /api/properties/:id** - Archive/Delete listing.

### 2. Booking Resource
- **POST /api/bookings** - Generate booking draft, validates dates, holds reservation.
- **GET /api/bookings/:id/invoice** - Retrieve detailed invoice values.

### 3. Payment Integration (Webhooks)
- **POST /api/payments/paychangu-webhook** - Listens for external transaction state changes. If successful, shifts booking status to 'Paid' and triggers automated WhatsApp notification.

### 4. Admin Operations
- **POST /api/admin/approve-property/:id** - Moderator approvals.`
    },
    {
      id: 'auth-flow',
      title: '11. Authentication Flow',
      category: 'Engineering',
      icon: <Key className="w-5 h-5" />,
      content: `## Secure JWT & Local Session Flow
1. **Client Request:** User registers/logs in using email/phone and password.
2. **Server Verification:** Backend checks credentials against \`users.password_hash\` (using bcrypt with 12 salt rounds).
3. **Token Sign:** If valid, generates a JSON Web Token (JWT) signed with a secret key containing:
   - \`sub\` (User ID)
   - \`role\` (Visitor, Customer, Owner, Admin)
   - \`exp\` (Expiration time, e.g. 7 days)
4. **Cookie Delivery:** Token is returned to the client inside an \`HttpOnly\`, \`Secure\`, and \`SameSite=Strict\` cookie. This blocks access from malicious JavaScript (preventing XSS-based token theft).
5. **Route Guards:** React client parses the non-sensitive payload to toggle dashboard privileges, while Express middleware intercepts every API call to verify cookie signatures.`
    },
    {
      id: 'booking-flow',
      title: '12. Booking Flow Process',
      category: 'Engineering',
      icon: <Layers className="w-5 h-5" />,
      content: `## Sequential States & Event Handlers
1. **Calendar check:** Customer selects check-in and check-out dates on the property detail page.
2. **Availability Check:** System checks existing active records in the \`bookings\` table:
   \`\`\`sql
   SELECT COUNT(*) FROM bookings 
   WHERE property_id = :propId 
     AND status IN ('Confirmed', 'Paid') 
     AND (:checkIn < end_date AND :checkOut > start_date);
   \`\`\`
3. **Pricing calculation:** System returns pricing quote:
   - Subtotal = Price per night * Nights
   - Platform Maintenance Fee = MWK 2,500
   - Total Amount Due
4. **Draft Reservation:** If available, inserts a draft booking with status 'Pending' and sets a 15-minute lock timer.
5. **Invoice generation:** Generates PDF invoice in memory.`
    },
    {
      id: 'payment-flow',
      title: '13. Payment Gateway Webhook Integration',
      category: 'Engineering',
      icon: <CreditCard className="w-5 h-5" />,
      content: `## Mobile Money Webhook Flow
1. **Initiate Transaction:** Customer chooses Airtel Money or TNM Mpamba.
2. **Gateway Call:** Backend calls PayChangu API with amount, currency ("MWK"), callback url, and transaction reference.
3. **Customer Action:** Customer sees USSD push-prompt on their mobile phone, enters their secret PIN.
4. **Merchant Notification (Webhook):** PayChangu servers post payment status to our backend endpoint: \`POST /api/payments/paychangu-webhook\`.
5. **Signature Verification:**
   - Backend reads \`X-PayChangu-Signature\` header.
   - Verifies hashing matching our secret API key to prevent spoofing.
6. **State Transitions:** Updates \`bookings.status\` to 'Paid', generates receipt number, notifies the owner via SMS/WhatsApp gateway, and locks availability.`
    },
    {
      id: 'subscription-flow',
      title: '14. Subscription Billing Lifecycle',
      category: 'Engineering',
      icon: <CreditCard className="w-5 h-5" />,
      content: `## Owner Subscription Engine
- **Billing Cycle:** Every 30 days.
- **Grace Period:** 3 days.
- **Expiry Check Scheduler:** A daily CRON job runs at 00:00:
  \`\`\`sql
  UPDATE owner_profiles 
  SET subscription_plan = 'Free', subscription_expires = NULL 
  WHERE subscription_expires < CURRENT_TIMESTAMP;
  \`\`\`
- **Listing Suppression:** If an owner is downgraded to 'Free':
  - Identify properties ordered by creation date.
  - Keep the single oldest listing as "Available."
  - Shift all other active listings automatically to "Archived" status.
  - Send email/WhatsApp reminder to renew.`
    },
    {
      id: 'wireframes',
      title: '15. UI / UX Wireframe Outlines',
      category: 'Operations',
      icon: <Compass className="w-5 h-5" />,
      content: `## Design Mockup Guide

### 1. Home Search Bar (Centric)
\`\`\`
======================================================
  [ Logo ]       Browse Properties    Owners    Admin  
======================================================
         Find Your Perfect Malawian Property Direct  
                  No Agents. No Viewing Fees.
  
  [ Select District v ] [ Select Category v ] [ SEARCH ]
======================================================
\`\`\`

### 2. Dual-Grid Search Page (Desktop Layout)
- **Left Column (60%):** Property Listings card list displaying district, landmarks, price in MWK, and floating badge for availability.
- **Right Column (40%):** Flat layout Map visualizer showing districts with interactive pricing tags.`
    },
    {
      id: 'component-hierarchy',
      title: '16. Component Tree Hierarchy',
      category: 'Operations',
      icon: <Layers className="w-5 h-5" />,
      content: `## React Component Tree Structure
\`\`\`
App (Global states: ActiveRole, CurrentUser, SearchFilters, CartBookings)
├── NavigationBar (Role Switcher dropdown, notifications bell)
├── SearchHero (District/Price Quick Selector)
├── ActiveView
│   ├── VisitorView
│   │   ├── PropertyFilters (Multi-select toggles)
│   │   ├── PropertyGrid
│   │   │   └── PropertyCard (Icons, Badge status, WhatsApp Launcher)
│   │   ├── PropertyDetailsPanel (Modal: Gallery, Calendar, Booking Box, Reviews)
│   │   └── CheckoutScreen (Mobile Money PIN prompt, Invoice / Receipt download)
│   ├── OwnerDashboard
│   │   ├── StatisticsRow (Mini visual cards)
│   │   ├── PerformanceCharts (Custom SVG graphs)
│   │   ├── ListingWizard (Form, image upload preview)
│   │   └── BookingsLedger (Accept/reject controls, PDF simulator)
│   ├── AdminDashboard
│   │   ├── OverviewStats
│   │   ├── PendingQueue (Approve/Reject buttons)
│   │   ├── SupportDisputes (Moderate comments)
│   │   └── CategoryConfig
│   └── DocHub (The 22 System Deliverables Viewer)
└── Footer (Privacy, Malawi Office locations, Help line)
\`\`\``
    },
    {
      id: 'folder-structure',
      title: '17. Complete Folder Structure',
      category: 'Operations',
      icon: <Layers className="w-5 h-5" />,
      content: `## Recommended Project Directory
\`\`\`
/
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types.ts           <-- Shared type declarations
│   ├── data.ts            <-- Malawi properties & user mock datasets
│   ├── components/
│   │   ├── DocHub.tsx          <-- Deliverables & Specifications viewer
│   │   ├── VisitorView.tsx     <-- Renters & Short-Stay bookings
│   │   ├── OwnerDashboard.tsx  <-- Property management & Analytics
│   │   └── AdminDashboard.tsx  <-- Platform control panel
│   └── lib/
│       ├── utils.ts       <-- Tailwind merge/join tools
│       └── gemini.ts      <-- Server-side AI descriptions helper
└── dist/                  <-- Optimized build outputs
\`\`\``
    },
    {
      id: 'roadmap',
      title: '18. Development Roadmap',
      category: 'Operations',
      icon: <Compass className="w-5 h-5" />,
      content: `## 4-Phase Delivery Timeline

### Phase 1: Foundation (Weeks 1-4)
- Database modeling, migration scripts, base REST API scaffolding.
- Firebase Auth / JWT role configurations.

### Phase 2: Core Platform (Weeks 5-8)
- Listing creator form wizard, uploader integration.
- Search engine with location-district indexes.
- Click-to-chat WhatsApp direct redirection integrations.

### Phase 3: Transactional Engine (Weeks 9-12)
- Booking date locking mechanisms.
- PayChangu, Airtel Money, and TNM Mpamba checkout modules.
- Daily CRON jobs for owner subscriptions.

### Phase 4: Expansion & Analytics (Weeks 13-16)
- Owner visual analytics (recharts, metric sheets).
- System Admin moderating board, automated receipts generation.
- Beta launch across Lilongwe & Blantyre.`
    },
    {
      id: 'sprint',
      title: '19. Sprint Planning (Sprint 1)',
      category: 'Operations',
      icon: <Layers className="w-5 h-5" />,
      content: `## Sprint 1: Bootstrap & Schema Setup (2-Week Cycle)
- **Goal:** Set up building pipelines, build database schemas, and initialize functional page layouts.
- **Backlog Tasks:**
  - **Task 1.1:** Setup PostgreSQL DDL migrations (3 Story Points).
  - **Task 1.2:** Implement JWT role verification middlewares (5 Story Points).
  - **Task 1.3:** Build Property models & search handlers in Express (5 Story Points).
  - **Task 1.4:** Create responsive landing page framework with Tailwind CSS (3 Story Points).
- **Daily Standups:** Discuss blocking issues (e.g., localizing District coordinates).
- **Sprint Review:** Demo functional local listings and mock auth tokens.`
    },
    {
      id: 'testing',
      title: '20. Testing Strategy',
      category: 'Operations',
      icon: <ShieldCheck className="w-5 h-5" />,
      content: `## Comprehensive Quality Assurance Blueprint

### 1. Unit Testing (Jest)
- Validating checkout amount calculations: \`calculateBookingPrice(nights, pricePerNight)\`.
- Validating phone structures (MWK numbers starting with +265).

### 2. Integration Testing (Supertest)
- testing \`POST /api/bookings\` locks date registers.
- testing \`POST /api/payments/paychangu-webhook\` with valid vs invalid SHA signatures.

### 3. End-to-End Testing (Playwright)
- Simulate a customer registering, searching "Area 12", selecting dates, executing mock Airtel Money checkout, and verifying booking change.

### 4. Load & Stress Testing (k6)
- Stress-testing search queries simulating 10,000 concurrent mobile phone visitors during high rental seasons (e.g., college intake months).`
    },
    {
      id: 'deployment',
      title: '21. Deployment & Infrastructure Strategy',
      category: 'Operations',
      icon: <Server className="w-5 h-5" />,
      content: `## High-Availability Cloud Deployment

### 1. Containerization
- Build Docker images for Express API server:
  \`\`\`dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --omit=dev
  COPY . .
  EXPOSE 3000
  CMD ["node", "dist/server.js"]
  \`\`\`

### 2. Orchestration & Hosting
- **Production Host:** Google Cloud Run (Container auto-scaling up to 50 instances, scaling down to 1 when silent to optimize server cost).
- **Database:** Managed Cloud SQL PostgreSQL with automated nightly backups and failover replicates.
- **File Storage:** Cloudinary CDN to resize and lazy-load high-res property images instantly.
- **SSL Certificates:** Managed LetsEncrypt protocols via Cloudflare Proxy.`
    },
    {
      id: 'future',
      title: '22. Future Features & Scalability',
      category: 'Operations',
      icon: <Zap className="w-5 h-5" />,
      content: `## Extended Value Roadmap

### 1. AI-Driven Smart Valuation Tool
Integrating Gemini API to inspect similar listings in specific districts (e.g. Area 43 vs Area 25) and suggest optimal rental or sale prices to owners.

### 2. Automated Utility Checks
Integrate direct links with ESCOM (electricity) and Water Boards (Lilongwe Water Board, Blantyre Water Board) so owners can display utility-cleared badges on their properties.

### 3. Unified Mobile USSD Portal
For owners in rural areas without strong internet, provide a USSD channel (*384#) enabling them to mark their rooms "Booked" or "Available Today" using basic analog phones.`
    }
  ];

  const filteredSections = sections.filter(sec =>
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSectionObj = sections.find(s => s.id === activeTab) || sections[0];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="spec-doc-hub-root">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-10 px-6 sm:px-12 border-b border-slate-800 relative overflow-hidden" id="spec-header-container">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 -mr-16 -mt-16" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="bg-indigo-600/30 text-indigo-300 font-mono text-xs px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">
            System Specifications
          </span>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight mt-3 text-white">
            Developer & Product Specifications
          </h1>
          <p className="text-slate-300 max-w-2xl mt-2 text-sm sm:text-base font-sans">
            Complete high-level architectural drawings, Product Requirements Document (PRD), Database schema models, and development timelines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8" id="spec-grid-layout">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6" id="spec-sidebar-nav">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Search Documentation
            </h3>
            <input
              type="text"
              placeholder="Filter spec sections..."
              className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="spec-search-input"
            />
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4 space-y-1">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
              Deliverables List
            </h3>
            <nav className="space-y-1">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm font-sans transition-all duration-200 ${
                    activeTab === sec.id
                      ? 'bg-indigo-600 text-white shadow-xs font-medium'
                      : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                  id={`spec-btn-${sec.id}`}
                >
                  <span className={`${activeTab === sec.id ? 'text-white' : 'text-slate-400'}`}>
                    {sec.icon}
                  </span>
                  <span className="truncate">{sec.title.split('. ')[1]}</span>
                </button>
              ))}
              {filteredSections.length === 0 && (
                <p className="text-xs text-slate-400 px-2 py-4 italic">No sections match search.</p>
              )}
            </nav>
          </div>

          <div className="bg-indigo-950 text-white rounded-xl shadow-md p-5 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <h4 className="font-sans font-bold text-sm mb-1 text-white">Direct-Owner Guarantee</h4>
            <p className="text-xs text-indigo-200 leading-relaxed font-sans">
              Designed specifically for Malawi. Minimizes middlemen overheads, saves millions in listing & viewing fees, and promotes authentic reviews.
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-10" id="spec-main-content">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8" id="spec-content-header">
            <div>
              <span className="text-xs font-mono text-indigo-600 font-semibold uppercase bg-indigo-50 px-2.5 py-1 rounded-full">
                {activeSectionObj.category} specifications
              </span>
              <h2 className="text-2xl font-sans font-bold text-slate-900 mt-2">
                {activeSectionObj.title}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Platform Draft v1.4 • 2026-07-10
            </span>
          </div>

          {/* Markdown Content Parser */}
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-sans space-y-6" id="spec-markdown-body">
            {activeSectionObj.content.split('\n\n').map((block, i) => {
              if (block.startsWith('## ')) {
                return (
                  <h3 key={i} className="text-lg font-sans font-semibold text-slate-900 mt-8 border-b border-slate-100 pb-2">
                    {block.replace('## ', '')}
                  </h3>
                );
              }
              if (block.startsWith('- **') || block.startsWith('* **')) {
                return (
                  <ul key={i} className="list-disc pl-5 space-y-1.5 my-4">
                    {block.split('\n').map((li, j) => (
                      <li key={j} className="text-sm">
                        {li.replace(/^[\s-*]+/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.startsWith('```')) {
                const codeLines = block.split('\n').filter(line => !line.startsWith('```'));
                return (
                  <pre key={i} className="bg-slate-950 text-emerald-400 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 my-4 shadow-inner">
                    <code>{codeLines.join('\n')}</code>
                  </pre>
                );
              }
              return (
                <p key={i} className="text-sm leading-relaxed whitespace-pre-line text-slate-600">
                  {block}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
