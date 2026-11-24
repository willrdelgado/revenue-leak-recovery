# Revenue Leak Recovery

PROJECT: The Missed Call System Funnel
DELIVERABLE: Two pages (Landing Page + Calculator Page) built ONLY with HTML, CSS, and JavaScript.
STYLE: Professional, clinical, aggressive. High trust. Direct response.
DESIGN RULES:
- Background: #FFFFFF
- Primary CTA color: #FF8F00
- Danger color: #C62828
- Font: Inter (fallback: system sans)
- Layout: single column, no top nav, no footer nav, no distractions
- Mobile first: CTA above the fold on all pages
- Spacing: clean, airy, modern
- Buttons: large, rounded, strong contrast
- Never use hyphens in any visible copy

GLOBAL CONVERSION GOAL:
Primary conversion is email capture after they see the monthly loss.
Secondary conversion is booking a call.

========================================
PAGE 1: LANDING PAGE
URL: / (homepage)
PURPOSE: Pre frame the problem and push users into the calculator.
ABOVE THE FOLD MUST INCLUDE:
Headline (big, bold):
Every missed call costs you money

Subheadline:
Run a 60 second diagnostic to see how much revenue slips away each month when your phone is ringing.

Two CTAs above the fold:
Primary button label:
Run the Revenue Leakage Diagnostic
Button action:
Navigate to /calculator

Secondary button label:
Book My Revenue Leak Review
Button action:
Scroll to a calendar embed section on this page OR open /book (if separate page exists)

Under the buttons, small trust line:
No login. No fluff. Just your numbers.

SECTION: PROOF AND BELIEF (short)
Title:
Most businesses do not have a lead problem. They have a response problem.

Bullets:
- Missed calls do not wait around. They call the next company.
- Speed to lead beats marketing spend.
- Fixing missed calls is the fastest way to increase booked jobs.

SECTION: HOW IT WORKS (3 steps)
Step 1:
Run the diagnostic
Step 2:
See your monthly revenue leak
Step 3:
Get the full 12 month recovery audit and quick fix plan

SECTION: CALENDAR SECTION
Title:
Schedule your Revenue Leak Review
Body:
In 10 minutes I will show you where the leak is happening and what to fix first.
Embed placeholder:
[CALENDAR EMBED GOES HERE]

FOOTER MICRO TRUST:
No spam. No pressure. Just a clear plan.

========================================
PAGE 2: CALCULATOR PAGE
URL: /calculator
PURPOSE: Calculator first. Show monthly loss. Gate full audit behind opt in.
ABOVE THE FOLD MUST INCLUDE:
Headline:
How much revenue are missed calls costing you every month

Subheadline:
Enter 3 quick numbers. Get your estimated monthly loss instantly. Unlock the full 12 month breakdown after.

Micro trust line:
No login. No fluff. Just math.

CALCULATOR CARD FIELDS:
Field 1 label:
Average value of a new customer
Input:
Currency input with placeholder 1500

Field 2 label:
Number of calls your office misses per week
Input:
Number input with placeholder 5
Helper text:
If you are unsure, start conservative.

Field 3 label:
Your closing rate on answered calls percent
Input:
Slider 0 to 100 with default 35 and a number display box

Primary calculator button label:
Show My Monthly Loss

CALCULATION LOGIC:
- weeksPerMonth = 4.3
- monthlyMissedCalls = missedCallsPerWeek * weeksPerMonth
- expectedWonJobsPerMonth = monthlyMissedCalls * (closingRatePercent / 100)
- monthlyRevenueLeak = expectedWonJobsPerMonth * avgCustomerValue
- Round monthlyRevenueLeak to nearest whole number
- Display as currency

AFTER CLICKING Show My Monthly Loss:
Replace or reveal RESULTS SECTION directly below calculator.

RESULTS SECTION DESIGN:
- Large red warning card using #C62828
- Label:
Warning
- Main line:
You are losing approximately $X every single month.
- Supporting line (belief builder):
This estimate is based only on missed calls. It does not include after hours calls, web leads, or slow follow up.
- Disclaimer line under support:
Estimates assume a 7 day week and 4.3 weeks per month. Actual results vary.

GATED CONTENT BELOW THE MONTHLY NUMBER:
- Show a blurred locked section preview of what they will get.
- The locked section must show a teaser list:
What you will unlock:
1. Your estimated annual revenue leak
2. Missed calls per month and lost jobs estimate
3. The 3 fastest fixes to recover revenue this week

OPT IN FORM CARD (placed immediately after monthly result):
Headline:
Get your full 12 month revenue recovery audit

Subheadline:
I will email your full breakdown plus the 3 step Phone to Profit protocol.

FORM FIELDS:
Required:
- First name
- Business email

Optional:
- Mobile number

SMS CONSENT LOGIC:
- Only show the SMS consent checkbox if the mobile number field is filled in.
SMS consent text:
I agree to receive SMS and email about my audit and related offers. Message frequency varies. Message and data rates may apply. Reply STOP to opt out.

Primary form submit button label:
Send My Full Audit

AFTER OPT IN SUBMIT:
- Reveal the full unblurred breakdown section including:
1. Monthly missed calls estimate
2. Estimated won jobs from missed calls
3. Monthly revenue leak
4. Annual revenue leak
- Then show TWO CTAs above the fold in the revealed section:
Primary button:
Schedule My Revenue Leak Review
Action:
Open calendar modal or scroll to embedded calendar section on this page

Secondary button:
Text Me The Quick Fix Plan
Action:
If phone exists, trigger SMS follow up workflow via webhook
If no phone, show inline message:
Add your mobile number above to get the quick fix plan by text.

POPUP RULES:
Do NOT use an exit intent popup.
Do NOT show any WAIT style popup.
The results gate and opt in form are the conversion mechanism.

TRACKING EVENTS (simple JS events):
- calculator_started
- calculator_submitted
- monthly_result_shown
- audit_optin_submitted
- calendar_clicked

TECH REQUIREMENTS:
- All code must be in a single HTML file per page
- Use embedded CSS and vanilla JS only
- Clean, readable code
- No external frameworks
- Add smooth scroll for on page anchors
- Make it look premium on mobile

END

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c21bde63-4a93-4ef9-a0bd-48e6bb20f724).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
