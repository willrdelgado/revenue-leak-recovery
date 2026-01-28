

## Landing Page Redesign — Dan Kennedy Direct Response Style

This plan restructures your landing page following Dan Kennedy's Magnetic Marketing and Renegade Millionaire principles, with the calculator integrated directly on the page for maximum conversions.

---

### Architecture Change

**Current Setup:** Two separate pages (Landing at `/`, Calculator at `/calculator`)

**New Setup:** Single-page funnel at `/` with all sections integrated. The `/calculator` route will redirect to `/` to avoid confusion.

The calculator will be embedded directly below the hero section so it remains above the fold on desktop and near the top on mobile.

---

### Section 1: Hero

**Headline:**
How much money did you lose this week because calls went unanswered

**Subhead:**
Run the 60 second Revenue Leakage Diagnostic to see the monthly dollar leak hiding in your missed calls.

**Pre-button line (smaller text):**
Most owners underestimate missed call losses by 3 to 10 times. This shows the real number.

**Primary Button:**
Run the Revenue Leakage Diagnostic
*Micro line:* See your number instantly

**Secondary Button:**
Book My Revenue Leak Review
*Micro line:* Get a 10 minute plan

**Trust Line:**
No login. No pressure. Just the math.

**Behavior:** Primary button scrolls to calculator section (anchored directly below hero).

---

### Calculator Section (Embedded Below Hero)

The full calculator card with three inputs:
- Average customer value (currency)
- Missed calls per week (number)
- Closing rate slider

Primary CTA: Show My Monthly Loss

After calculation, show:
1. **Teaser Result** — Bold red warning card showing estimated monthly revenue leak
2. **Smaller line** — "This is an estimate. Your exact breakdown is available."
3. **Gated Lead Capture Panel:**
   - Title: Email me the full breakdown
   - Fields: Email (required), First name (optional)
   - Button: Email Me My Results
   - Microcopy: I will send your breakdown and the 3 fastest fixes. No spam.
4. **Post-Submit State (if already submitted in session):**
   - Title: Your Recovery Pack
   - Button: Download the Missed Call Survival Guide
   - Button: Schedule My Revenue Leak Review
5. **After Form Submit:**
   - Show full breakdown on screen immediately
   - Trigger email with survival guide link and results
   - Show final CTA: Schedule My Revenue Leak Review

---

### Section 2: Response Problem

**Headline:**
You do not have a lead problem. You have a response problem.

**Bullets:**
- Missed calls do not wait around. They call the next company.
- Speed to lead beats ad spend every time.
- Fixing missed calls is the fastest way to increase booked jobs without increasing your budget.
- If you are not calling back in minutes, you are donating revenue to competitors.

---

### Section 3: What Happens Next

**Header:**
What happens next

**Step 1:**
Title: Enter 3 numbers
Description: Takes about 60 seconds.

**Step 2:**
Title: See your monthly revenue leak
Description: Instant estimate based on a 7 day week.

**Step 3:**
Title: Get your 12 month recovery plan
Description: I will email the breakdown and the fastest fixes.

---

### Section 4: Calendar Booking

**Headline:**
Schedule your Revenue Leak Review

**Subhead:**
In 10 minutes I will show you where the leak is happening and what to fix first so you stop losing money this week.

**Three bullets above calendar:**
- Where missed calls are coming from
- The fastest fix you can implement first
- How to recover the lost revenue over the next 30 days

**GHL Calendar Embed**

**Qualifier line below calendar:**
Best for service businesses that rely on inbound calls to book jobs.

---

### Section 5: Footer

**Centered microcopy:**
No spam. No pressure. Just a clear plan.

---

### Technical Implementation

**Files to Modify:**

1. **src/pages/Index.tsx** — Complete rewrite to include all sections plus the embedded calculator logic and lead capture

2. **src/pages/Calculator.tsx** — Convert to a redirect to `/` since all functionality moves to the landing page

3. **src/lib/tracking.ts** — No changes needed, existing tracking functions will be reused

**Mobile Optimization:**
- All inputs sized for touch (minimum 44px tap targets)
- Calculator section visible without excessive scrolling
- Primary CTA always above the fold on mobile
- Responsive typography using sm/md breakpoints
- inputMode attributes for proper mobile keyboards

**Session State:**
- Use React useState to track if user has already submitted email in current session
- Skip the gate and show "Your Recovery Pack" state if already submitted

**Form Validation:**
- Email required, validated with type="email"
- First name optional
- Zod schema validation before webhook submission

