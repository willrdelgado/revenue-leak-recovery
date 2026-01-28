

## The Missed Call System Funnel — Implementation Plan

A two-page lead generation funnel designed to convert visitors by showing them their missed call revenue loss and capturing their information for your Revenue Leak Review service.

---

### Page 1: Landing Page (/)

**Purpose:** Pre-frame the problem and drive users to the calculator

**Above the Fold Section**
- Bold headline: "Every missed call costs you money"
- Subheadline explaining the 60-second diagnostic
- Two prominent CTAs:
  - Primary orange button → Navigate to /calculator
  - Secondary button → Scroll to calendar section
- Trust line: "No login. No fluff. Just your numbers."

**Proof and Belief Section**
- Title challenging their assumptions about lead problems
- Three bullet points building the case for speed-to-lead

**How It Works Section**
- Clean 3-step visual: Run diagnostic → See monthly leak → Get full audit

**Calendar Section**
- Title and body text for the Revenue Leak Review booking
- Your GHL calendar embed integration

**Footer**
- Micro trust statement: "No spam. No pressure. Just a clear plan."

---

### Page 2: Calculator Page (/calculator)

**Purpose:** Show monthly loss, then gate the full audit behind opt-in

**Above the Fold Calculator**
- Headline and subheadline about discovering monthly loss
- Calculator card with three inputs:
  - Average customer value (currency input)
  - Missed calls per week (number input with helper text)
  - Closing rate percentage (slider with live display)
- Primary orange button: "Show My Monthly Loss"

**Results Section (revealed after calculation)**
- Large red warning card (#C62828) displaying the monthly revenue leak
- Supporting belief-builder text about what the estimate excludes
- Disclaimer about calculation assumptions

**Gated Content Preview**
- Blurred/locked section teasing what they'll unlock:
  - Annual revenue leak
  - Missed calls and lost jobs estimate
  - 3 fastest fixes to recover revenue

**Opt-In Form**
- Headline about getting the full 12-month audit
- Form fields: First name, Business email, Mobile (optional)
- Conditional SMS consent checkbox (only shows when phone is entered)
- Submit button: "Send My Full Audit"
- On submit → Sends data to your CRM webhook

**Unlocked Results (after opt-in)**
- Full unblurred breakdown showing all metrics
- Two CTAs:
  - Primary: "Schedule My Revenue Leak Review" → Calendar
  - Secondary: "Text Me The Quick Fix Plan" → Triggers SMS webhook

---

### Backend Integration

**Edge Function for Secure Webhooks**
- Handles form submission to your CRM webhook
- Handles SMS trigger to your SMS service webhook
- Keeps your webhook URLs private and secure

---

### Design System

- Background: Pure white (#FFFFFF)
- Primary CTA: Orange (#FF8F00)
- Warning/Danger: Deep red (#C62828)
- Typography: Inter font family
- Layout: Single column, mobile-first, no navigation distractions
- Buttons: Large, rounded, high contrast
- Spacing: Clean, airy, premium feel

---

### Tracking Events

JavaScript events fired at key moments:
- `calculator_started` — When user begins entering data
- `calculator_submitted` — When "Show My Monthly Loss" is clicked
- `monthly_result_shown` — When results display
- `audit_optin_submitted` — When form is submitted
- `calendar_clicked` — When calendar CTA is clicked

