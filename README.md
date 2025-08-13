# Mini Leave Management System (React + Vite + Tailwind, Node + Express, MongoDB)

A simple leave management app with an Express + MongoDB API and a React (Vite) frontend styled with TailwindCSS.

## Setup

### Prerequisites
- Node 18+
- MongoDB running locally or in the cloud

### Backend
```
cd backend
# .env (required)
#   MONGODB_URI=mongodb://127.0.0.1:27017/leave_mgmt
#   PORT=5000               # optional (default 5000)
npm install
npm run dev
```
- Server runs at `http://localhost:5000`
- CORS is configured for `http://localhost:5173` and supports GET/POST/PUT/DELETE/PATCH with preflight (OPTIONS)

### Frontend
```
cd frontend
npm install
# Optional if API URL differs from default:
#   echo VITE_API_URL=http://localhost:5000 > .env
npm run dev
```
- App runs at `http://localhost:5173`

## Assumptions
- Single leave type: "ANNUAL"
- Working days are Monday–Friday (weekends excluded). Public holidays are not modeled
- No authentication/authorization. Approvals are performed as an implicit "HR" role
- Employees must exist before applying for leave; employee email is unique and used for lookup
- Dates are treated as date-only (normalized to midnight) for leave calculations
- Overlap prevention: cannot create overlapping leave when one exists in PENDING/APPROVED
- Approval re-validates overlap and balance at decision time
- Leave balance is stored on the employee document and decremented on approval

## Edge cases handled
- Apply before employee joining date → 400
- End date before start date → 400
- No working days in range (weekends) → 400
- Insufficient leave balance at apply/approval time → 400
- Overlapping requests (pending/approved) → 409
- Employee not found → 404
- Duplicate employee email on creation → 409
- Query filtering for leaves by `status` and `employeeId`

## Potential improvements
- Annual leave reset on April 1 with configurable allocation (manual admin endpoint and/or scheduled job)
- Holiday calendar support; regional calendars; custom non-working days
- Multiple leave types (sick, casual, unpaid) and accrual policies
- Partial-day or hourly leaves; time zone handling enhancements
- Notifications (email/Slack) on apply/approve/reject; reminders and SLAs
- Soft delete / deactivate employees; transfer/department changes