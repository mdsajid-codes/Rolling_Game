# Transport Management System — Full Gap Analysis
> **Source document**: `Trip Managemnet.docx` — *Transport Management System (TMS) — Forms, Fields & Process Flow*
> **Codebase**: `multi_tanent` Spring Boot backend

**Legend**: ✅ Done | ⚠️ Partial | ❌ Missing

---

## Module 1 — Transport Operations (Trip Creation & Scheduling)

### 1.1 Trip Creation Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Trip ID (auto-generated) | Unique | ✅ Done | `tripNo` — sequential per tenant, PESSIMISTIC_WRITE lock |
| Trip Date | Required | ✅ Done | `tripDate` (LocalDate) |
| Start Time | Required | ❌ Missing | No `startTime` field in `Trip` entity |
| End Time (Estimated) | Optional | ❌ Missing | No `estimatedEndTime` field |
| Origin Location | Required | ✅ Done | `fromLocation` |
| Destination Location | Required | ✅ Done | `toLocation` |
| Customer | Required | ✅ Done | FK → `TripCustomer` |
| Cargo Type | Optional | ❌ Missing | No `cargoType` (General, Hazardous, Perishable) |
| Load Weight (kg) | Optional | ❌ Missing | No `loadWeight` field |
| Vehicle Assigned | Required | ❌ Missing | Trip links to `Employee` (driver) but **no vehicle assignment** on `Trip` entity |
| Driver Assigned | Required | ✅ Done | FK → `Employee` (HRMS) |
| Route | Optional | ❌ Missing | No route/map field |
| Trip Status | Required | ✅ Done | `TripStatus` enum: CREATED/IN_PROGRESS/COMPLETED/INVOICED/PAID/CLOSED/CANCELLED |
| Remarks | Optional | ✅ Done | `remarks` (TEXT) |

> **Additional fields implemented but NOT in the document:**
> `containerNumber`, `customerRefJobNo`, `contactPerson`, `customerType`, `tripMonth`, `charges` (financials), `vendorAssignment`

### 1.2 Process Flow — Status

| Step | Status | Notes |
|---|---|---|
| Create Trip Request | ✅ Done | `POST /api/trips` |
| Check Vehicle Available | ❌ Missing | No vehicle availability check logic |
| Assign Vehicle | ❌ Missing | No vehicle FK on Trip |
| Queue / Reschedule | ❌ Missing | No scheduling queue |
| Check Driver Available | ⚠️ Partial | Driver assigned but no availability check |
| Assign Driver | ✅ Done | `driverId` in `TripRequest` |
| Plan Route | ❌ Missing | Route module exists in fleet but not linked to trip |
| Confirm Trip Scheduling | ✅ Done | Trip created with `CREATED` status |
| Trip In Progress | ✅ Done | `PATCH /api/trips/{id}/status` → `IN_PROGRESS` |
| Track Trip Status | ✅ Done | State machine with valid transitions enforced |
| Trip Completed | ✅ Done | `COMPLETED` status |
| Log Trip Data & Reports | ⚠️ Partial | Report endpoints exist (`/api/trip-reports`) but limited |

---

## Module 2 — Fleet Management

### 2.1 Vehicle Master Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Vehicle ID (auto-generated) | Unique | ✅ Done | `fleet_vehicles.id` |
| Registration Number | Required, Unique | ✅ Done | `plateNumber` (unique per tenant) |
| Vehicle Type | Required | ✅ Done | `vehicleType` |
| Make / Model | Required | ✅ Done | `make`, `model` |
| Year of Manufacture | Required | ✅ Done | `year` |
| Chassis Number | Unique | ⚠️ Partial | `vinNumber` exists (VIN = chassis equivalent) |
| Engine Number | Unique | ❌ Missing | No `engineNumber` field |
| Fuel Type | Required | ✅ Done | `fuelType` |
| Capacity (tons) | Required | ✅ Done | `capacityWeight` + `capacityVolume` |
| Current Odometer (km) | Required | ✅ Done | `odometerReading` |
| Registration Expiry Date | Required | ✅ Done | `registrationExpiry` |
| Insurance Expiry Date | Required | ✅ Done | `insuranceExpiry` |
| Permit Expiry Date | Optional | ❌ Missing | No `permitExpiry` field |
| Assigned Yard / Location | Optional | ❌ Missing | No yard/location assignment on vehicle |
| Status | Required | ⚠️ Partial | `isActive` (boolean only) — doc requires Active/Under Maintenance/Inactive states |
| Documents Upload | Optional | ❌ Missing | No document upload support for vehicles |

### 2.2 Fleet Process Flow — Status

| Step | Status | Notes |
|---|---|---|
| Add Vehicle to Fleet | ✅ Done | `VehicleController` + `VehicleService` |
| Upload Documents | ❌ Missing | No file upload for vehicle docs |
| Set Expiry Alerts | ❌ Missing | No alert/notification system for expiry |
| Vehicle Available for Allocation | ❌ Missing | No availability tracking |
| Monitor Utilization | ❌ Missing | No utilization report |
| Maintenance Due Check | ❌ Missing | No maintenance module |
| Send to Maintenance | ❌ Missing | No maintenance module |
| Update Status after Maintenance | ❌ Missing | Status is only boolean `isActive` |

---

## Module 3 — Dispatch & Scheduling Module

### 3.1 Dispatch Job Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Job ID (auto-generated) | Unique | ❌ Missing | **Entire dispatch module is missing** |
| Job Date | Required | ❌ Missing | |
| Customer | Required | ❌ Missing | |
| Pickup Location | Required | ❌ Missing | |
| Drop Location | Required | ❌ Missing | |
| Cargo Details | Optional | ❌ Missing | |
| Load Weight | Optional | ❌ Missing | |
| Priority | Required | ❌ Missing | Normal/Urgent/Critical |
| Assigned Trip | Required | ❌ Missing | |
| Delivery Status | Required | ❌ Missing | Pending/Dispatched/In Transit/Delivered |
| Proof of Delivery (Upload) | Optional | ❌ Missing | |
| Remarks | Optional | ❌ Missing | |

> **Module Status: ❌ 100% Missing** — No dispatch/scheduling module exists in the codebase.

---

## Module 4 — Fuel Management Module

### 4.1 Fuel Entry Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Entry ID (auto-generated) | Unique | ❌ Missing | **Entire fuel module is missing** |
| Vehicle | Required | ❌ Missing | |
| Driver | Required | ❌ Missing | |
| Fuel Date | Required | ❌ Missing | |
| Fuel Station | Optional | ❌ Missing | |
| Fuel Type | Required | ❌ Missing | |
| Quantity (liters) | Required | ❌ Missing | |
| Amount (AED) | Required | ❌ Missing | |
| Odometer Reading | Required | ❌ Missing | |
| Receipt (Upload) | Optional | ❌ Missing | |

> **Module Status: ❌ 100% Missing** — No fuel logging module exists.

---

## Module 5 — Vehicle Maintenance Module

### 5.1 Maintenance Request Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Maintenance ID (auto-generated) | Unique | ❌ Missing | **Entire maintenance module is missing** |
| Vehicle | Required | ❌ Missing | |
| Maintenance Type | Required | ❌ Missing | Preventive/Corrective/Breakdown |
| Service Category | Required | ❌ Missing | Engine/Tires/Brakes/Electrical |
| Requested Date | Required | ❌ Missing | |
| Scheduled Date | Required | ❌ Missing | |
| Assigned Garage / Technician | Optional | ❌ Missing | |
| Odometer at Service | Required | ❌ Missing | |
| Estimated Cost (AED) | Optional | ❌ Missing | |
| Actual Cost (AED) | Post-completion | ❌ Missing | |
| Spare Parts Used | Optional | ❌ Missing | |
| Status | Required | ❌ Missing | Requested/Scheduled/In Progress/Completed |
| Service Notes | Optional | ❌ Missing | |
| Invoice (Upload) | Optional | ❌ Missing | |

> **Module Status: ❌ 100% Missing** — No vehicle maintenance module exists.

---

## Module 6 — Driver Management Module

### 6.1 Driver Master Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Driver ID (auto-generated) | Unique | ✅ Done | `fleet_drivers.id` |
| Full Name | Required | ✅ Done | `name` |
| Mobile Number | Required | ✅ Done | `phone` |
| Email | Optional | ✅ Done | `email` |
| Emirates ID | Required, Unique | ❌ Missing | No `emiratesId` field in `Driver` entity |
| License Number | Required, Unique | ✅ Done | `licenseNumber` (unique per tenant) |
| License Expiry Date | Required | ✅ Done | `licenseExpiry` |
| License Type | Required | ✅ Done | `licenseType` (Light/Heavy/Hazmat) |
| Date of Joining | Required | ✅ Done | `joiningDate` |
| Assigned Vehicle | Optional | ✅ Done | FK → `Vehicle` (`assignedVehicle`) |
| Status | Required | ⚠️ Partial | `DriverStatus` enum: AVAILABLE/ON_TRIP/INACTIVE — doc says Active/On Leave/Inactive (ON_LEAVE missing) |
| Photo (Upload) | Optional | ✅ Done | `profileImageUrl` |
| Documents (Upload) | Optional | ⚠️ Partial | Upload directory exists (`uploads/documents/1/fleet/driver`) but no API tracked |

### 6.2 Driver Performance & Incentive Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Driver | Required | ❌ Missing | **Performance module is missing** |
| Period (Month/Year) | Required | ❌ Missing | |
| Trips Completed | Auto-calculated | ⚠️ Partial | Report endpoint `/api/trip-reports/driver?month=` gives trip count |
| On-Time Deliveries (%) | Auto-calculated | ❌ Missing | No on-time delivery tracking |
| Incidents / Violations | From Incident Module | ❌ Missing | No incident module |
| Fuel Efficiency Score | From Fuel Module | ❌ Missing | No fuel module |
| Incentive Amount (AED) | Calculated/Manual | ❌ Missing | No incentive/performance entity |
| Penalty Amount (AED) | Calculated/Manual | ❌ Missing | |
| Remarks | Optional | ❌ Missing | |

> **6.2 Status: ❌ Missing** — Only partial trip count data via report API.

---

## Module 7 — (Not numbered in document — Skipped to Module 8)

---

## Module 8 — Financial & Accounts Module

### 8.1 Expense Entry Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Expense ID (auto-generated) | Unique | ❌ Missing | **No expense tracking module** |
| Expense Category | Required | ❌ Missing | Fuel/Maintenance/Salaries/Rent |
| Expense Date | Required | ❌ Missing | |
| Amount (AED) | Required | ❌ Missing | |
| Paid To | Optional | ❌ Missing | |
| Payment Method | Required | ❌ Missing | Cash/Bank Transfer/Card |
| Reference Number | Optional | ❌ Missing | |
| Linked Vehicle / Trip | Optional | ❌ Missing | |
| VAT Amount | Auto-calculated | ❌ Missing | |
| Receipt (Upload) | Optional | ❌ Missing | |
| Remarks | Optional | ❌ Missing | |

### 8.2 Invoice Form (Customer Billing) — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Invoice ID (auto-generated) | Unique | ✅ Done | `TripInvoice.id` |
| Customer | Required | ✅ Done | FK → `TripCustomer` |
| Invoice Date | Required | ✅ Done | `invoiceDate` |
| Due Date | Required | ❌ Missing | No `dueDate` field in `TripInvoice` |
| Trip / Job References (Multi-select) | Required | ✅ Done | `InvoiceCreateRequest.tripIds` (List\<Long\>) |
| Subtotal (AED) | Auto-calculated | ✅ Done | `subTotalAmount` |
| VAT 5% | Auto-calculated | ✅ Done | `totalVatAmount` (5% on amount + otherCharges) |
| Total (AED) | Auto-calculated | ✅ Done | `grandTotal` |
| Payment Status | Required | ⚠️ Partial | `InvoiceStatus`: DRAFT/ISSUED/PAID/CANCELLED — but no API to update status after creation |
| Remarks | Optional | ✅ Done | `notes` |

> **Missing on Invoice**: `dueDate`, invoice payment update API, invoice PDF generation, invoice cancellation API.

### 8.3 Report Types — Status

| Report | Status | Notes |
|---|---|---|
| Profit & Loss Statement | ❌ Missing | No P&L module |
| Balance Sheet | ❌ Missing | |
| Cash Flow Statement | ❌ Missing | |
| VAT Report | ❌ Missing | VAT calculated per trip but no consolidated VAT report |
| Cost Analysis (per vehicle/trip/customer) | ⚠️ Partial | Customer & driver reports by month — no vehicle cost analysis |

---

## Module 9 — Management Dashboard

### 9.1 Dashboard KPIs / Widgets — Status

| Widget | Data Source | Status | Notes |
|---|---|---|---|
| Total Revenue (MTD/YTD) | Invoices | ❌ Missing | No dashboard aggregation API |
| Total Expenses (MTD/YTD) | Expense Entries | ❌ Missing | No expense module |
| Active Vehicles | Fleet Master | ⚠️ Partial | Vehicle list exists, no active count API |
| Vehicles Under Maintenance | Maintenance Module | ❌ Missing | No maintenance module |
| Active Drivers | Driver Master | ⚠️ Partial | Driver list exists, no active count API |
| Trips Today | Trip Module | ❌ Missing | No date-filtered trip count API |
| On-Time Delivery % | Dispatch Module | ❌ Missing | No dispatch or on-time tracking |
| Fleet Utilization % | Trips vs. Vehicles | ❌ Missing | |
| Fuel Efficiency (km/L) | Fuel Module | ❌ Missing | No fuel module |
| Pending Complaints | Complaint Module | ❌ Missing | No complaint module |
| Expiring Documents (Next 30 Days) | Document Expiry | ❌ Missing | No document expiry tracking |

> **Module Status: ❌ No dashboard module exists.**

---

## Module 10 — Complaint & Incident Management Module

### 10.1 Complaint / Incident Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Complaint ID (auto-generated) | Unique | ❌ Missing | **Entire complaint module is missing** |
| Date & Time | Required | ❌ Missing | |
| Reported By | Required | ❌ Missing | Customer/Driver/Staff |
| Type | Required | ❌ Missing | Complaint/Incident/Accident |
| Category | Required | ❌ Missing | Delay/Damage/Behavior/Accident |
| Linked Trip / Vehicle / Driver | Optional | ❌ Missing | |
| Description | Required | ❌ Missing | |
| Risk Level | Required | ❌ Missing | Low/Medium/High/Critical |
| Status | Required | ❌ Missing | Open/In Progress/Resolved/Escalated |
| Assigned To | Optional | ❌ Missing | |
| Resolution Notes | Post-resolution | ❌ Missing | |
| Attachments (Upload) | Optional | ❌ Missing | |

> **Module Status: ❌ 100% Missing.**

---

## Module 11 — Customer Management Module

### 11.1 Customer Master Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Customer ID (auto-generated) | Unique | ✅ Done | `trip_customers.id` |
| Company Name | Required | ✅ Done | `companyName` (unique per tenant) |
| Contact Person | Required | ✅ Done | `contactPerson` |
| Mobile Number | Required | ✅ Done | `phone` |
| Email | Required | ✅ Done | `email` |
| Address | Required | ✅ Done | `address` |
| TRN (Tax Registration Number) | For VAT | ✅ Done | `trnNumber` |
| Contract Start Date | Optional | ❌ Missing | No contract fields |
| Contract End Date | Optional | ❌ Missing | |
| Contract Document (Upload) | Optional | ❌ Missing | No file upload for customers |
| Credit Limit (AED) | Optional | ❌ Missing | No `creditLimit` field |
| Payment Terms (Days) | Optional | ❌ Missing | No `paymentTerms` field |
| Status | Required | ✅ Done | `active` (boolean soft-delete) |

> **Missing**: Contract management fields, credit limit, payment terms, file upload.

### 11.2 Customer Follow-Up Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Follow-Up ID | Unique | ❌ Missing | **No follow-up module** |
| Customer | Required | ❌ Missing | |
| Follow-Up Date | Required | ❌ Missing | |
| Purpose | Required | ❌ Missing | Payment/Renewal/Feedback/Issue |
| Notes | Required | ❌ Missing | |
| Next Follow-Up Date | Optional | ❌ Missing | |
| Assigned To | Optional | ❌ Missing | |

> **Customer Follow-Up: ❌ 100% Missing.**

### 11.3 Customer Process Flow

| Step | Status |
|---|---|
| Add Customer | ✅ Done |
| Enter Contract Details | ❌ Missing |
| Trips & Jobs Linked | ✅ Done (trips have customer FK) |
| Invoice & Payment Tracking | ⚠️ Partial (invoice exists, no payment update API) |
| Schedule Follow-Ups | ❌ Missing |
| Renew / Close Contract | ❌ Missing |

---

## Module 12 — Document Expiry Management Module

### 12.1 Document Tracker Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Document ID | Unique | ❌ Missing | **No document expiry module** |
| Document Type | Required | ❌ Missing | Vehicle Reg/Insurance/Permit/Driver License |
| Linked Entity | Required | ❌ Missing | Vehicle or Driver |
| Issue Date | Required | ❌ Missing | |
| Expiry Date | Required | ⚠️ Partial | `insuranceExpiry`, `registrationExpiry`, `licenseExpiry` stored but no unified tracker |
| Document (Upload) | Required | ❌ Missing | |
| Alert Days Before Expiry | Required | ❌ Missing | No alert scheduler |
| Status | Required | ❌ Missing | Valid/Expiring Soon/Expired |

> **Module Status: ❌ Expiry dates are stored on entities but no unified document expiry tracker, no scheduler, no alerts.**

---

## Module 13 — WhatsApp Integration

### 13.1 Alert Configuration — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Alert Type | Required | ❌ Missing | **Entire WhatsApp integration is missing** |
| Recipient Type | Required | ❌ Missing | Customer/Driver/Staff |
| Recipient Number | Required | ❌ Missing | |
| Message Template | Required | ❌ Missing | |
| Trigger Event | Required | ❌ Missing | |
| Status (Toggle) | Required | ❌ Missing | |

> **Module Status: ❌ 100% Missing.** No notification/WhatsApp module exists.

---

## Module 14 — Accounts & Compliance Module

### 14.1 VAT Report Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Report Period (Month/Year) | Required | ❌ Missing | No VAT report API |
| Total Sales (AED) | Auto-calculated | ❌ Missing | |
| Output VAT 5% | Auto-calculated | ❌ Missing | VAT calculated per trip but no consolidated output |
| Total Purchases (AED) | Auto-calculated | ❌ Missing | |
| Input VAT 5% | Auto-calculated | ❌ Missing | |
| Net VAT Payable | Auto-calculated | ❌ Missing | |
| Report Status | Required | ❌ Missing | Draft/Submitted/Filed |

### 14.2 Compliance Checklist — Status

| Check | Status | Notes |
|---|---|---|
| Vehicle Registrations Valid | ⚠️ Partial | `registrationExpiry` stored but no checker |
| Insurance Policies Active | ⚠️ Partial | `insuranceExpiry` stored but no checker |
| Driver Licenses Valid | ⚠️ Partial | `licenseExpiry` stored but no checker |
| Permits Up-to-Date | ❌ Missing | No permit tracking |
| VAT Filed on Time | ❌ Missing | No VAT filing module |

---

## Module 15 — Operational Enhancements

### 15.1 Yard Allocation Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Yard ID | Unique | ❌ Missing | **No yard module** |
| Yard Name | Required | ❌ Missing | |
| Location (GPS) | Required | ❌ Missing | |
| Capacity (Vehicles) | Required | ❌ Missing | |
| Current Occupancy | Auto-updated | ❌ Missing | |
| Status | Required | ❌ Missing | Active/Inactive |

### 15.2 Driver Duty Allocation Form — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Allocation ID | Unique | ❌ Missing | **No duty allocation module** |
| Driver | Required | ❌ Missing | |
| Duty Date | Required | ❌ Missing | |
| Shift | Required | ❌ Missing | Morning/Evening/Night |
| Assigned Vehicle | Required | ❌ Missing | |
| Status | Required | ❌ Missing | Scheduled/On Duty/Off Duty |

### 15.3 Vehicle Availability Status — Field-by-Field

| Field | Required? | Status | Notes |
|---|---|---|---|
| Vehicle | Required | ❌ Missing | **No availability status tracker** |
| Date | Required | ❌ Missing | |
| Status | Required | ❌ Missing | Available/Allocated/Under Maintenance/Out of Service |
| Notes | Optional | ❌ Missing | |

---

## Summary: Overall Module Status

| Module | Status | % Complete |
|---|---|---|
| 1. Transport Operations (Trip CRUD) | ⚠️ Partial | ~60% |
| 2. Fleet Management (Vehicle) | ⚠️ Partial | ~55% |
| 3. Dispatch & Scheduling | ❌ Missing | 0% |
| 4. Fuel Management | ❌ Missing | 0% |
| 5. Vehicle Maintenance | ❌ Missing | 0% |
| 6a. Driver Master | ⚠️ Partial | ~70% |
| 6b. Driver Performance & Incentives | ❌ Missing | ~10% |
| 8a. Financial — Expense Tracking | ❌ Missing | 0% |
| 8b. Financial — Invoice Billing | ⚠️ Partial | ~65% |
| 8c. Financial — Reports (P&L, Balance, VAT) | ❌ Missing | 0% |
| 9. Management Dashboard | ❌ Missing | 0% |
| 10. Complaint & Incident Management | ❌ Missing | 0% |
| 11a. Customer Master | ⚠️ Partial | ~65% |
| 11b. Customer Follow-Up | ❌ Missing | 0% |
| 12. Document Expiry Management | ❌ Missing | ~10% |
| 13. WhatsApp Integration | ❌ Missing | 0% |
| 14. VAT & Compliance | ❌ Missing | ~5% |
| 15. Operational Enhancements (Yard/Duty) | ❌ Missing | 0% |

---

## What IS Built (Summary)

### ✅ Fully Implemented
- Trip CRUD (create, read, update, cancel)
- Trip lifecycle state machine (CREATED → IN_PROGRESS → COMPLETED → INVOICED → PAID → CLOSED)
- UAE VAT 5% auto-calculation on trips (server-side only)
- Driver commission auto-calculation (10% of base amount)
- Token amount at 0% VAT correctly implemented
- Multi-trip invoice generation (aggregates totals from selected trips)
- Invoice number auto-generation (`NKT-000001` format)
- Trip customer master (CRUD partial)
- Trip vendor master (outsourcing support)
- Vendor payment assignment per trip
- Monthly reports: driver/customer/vendor summaries
- Race-condition-safe trip numbering (PESSIMISTIC_WRITE)
- Multi-tenancy on all entities

### ⚠️ Partially Implemented
- Driver master (missing Emirates ID, ON_LEAVE status)
- Vehicle master (missing engine number, permit expiry, yard, document upload)
- Invoice (missing due date, payment update API, PDF, cancellation)
- Customer master (missing contract, credit limit, payment terms)
- Route planning (entity + service exists but not linked to trips)
- Document expiry dates stored on vehicle/driver but no tracker/alerts

---

## Priority Build Roadmap

### Phase 1 — Complete Core Trip Module (Immediate)
1. Add `startTime`, `endTime`, `cargoType`, `loadWeight` to `Trip` entity
2. Link `Vehicle` FK to `Trip`
3. Add `dueDate` to `TripInvoice`
4. Add invoice payment update API (`PATCH /api/trip-invoices/{id}/payment`)
5. Add invoice cancellation API
6. Add vendor payment update API (`PATCH /api/trips/{id}/vendor-payment`)
7. Add trip filtering (by date range, status, driver, customer)
8. Add pagination to all list APIs
9. Generate invoice PDF (using lowagie/iText — pattern already in Bills module)
10. Add DB Liquibase migrations (trip module has schema file but needs seeding)

### Phase 2 — Fleet Completions
11. Add `emiratesId`, `ON_LEAVE` status to Driver
12. Add `engineNumber`, `permitExpiry`, `yardLocation` to Vehicle
13. Add vehicle status enum (Active/Under Maintenance/Inactive)
14. Add vehicle document upload API

### Phase 3 — Missing Modules (New Development)
15. Fuel Management Module (entity + CRUD + reports)
16. Vehicle Maintenance Module (entity + CRUD + status tracking)
17. Dispatch & Scheduling Module (jobs, POD upload, delivery status)
18. Complaint & Incident Module (with risk levels + escalation)
19. Customer Follow-Up Module
20. Document Expiry Tracker (unified tracker + scheduler)
21. Driver Performance & Incentives Module

### Phase 4 — Analytics & Integrations
22. Management Dashboard API (KPI aggregations)
23. VAT Report Module (consolidated output/input VAT)
24. P&L, Balance Sheet, Cash Flow reports
25. WhatsApp Alert Integration
26. Yard & Driver Duty Allocation
27. Vehicle Availability Status Tracker
