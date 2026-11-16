# MentorMind AI — Production Readiness & Architecture Report

> **Target Platform:** Web (Desktop & Mobile) & Android (Trusted Web Activity / PWA)  
> **Production URL:** `https://mentormindai-137a0.web.app`  
> **Source Repository:** `https://github.com/githubjuned/MentorMind_AI.git`  
> **Report Timestamp:** November 2026  
> **Compliance Benchmarks:** Digital Personal Data Protection Act, 2023 (DPDP), Information Technology Act, 2000, Consumer Protection (E-Commerce) Rules, 2020, CERT-In Directions 2022, WCAG 2.2 AA, Google Play Store Policy.

---

## 1. Executive Summary

MentorMind AI has been systematically upgraded from a localized frontend prototype into a full-scale, commercial-grade, multi-agent academic platform. 

All dummy synthetic sessions, hardcoded bypasses, and insecure demo credentials have been excised. The application features live integration with Google Gemini 2.0 (`gemini-flash-lite-latest`), authenticated user telemetry via Google Firebase Authentication (Email/Password & Google OAuth), and strict per-user UID database authorization on Firebase Realtime Database.

A complete public website shell, 18 statutory legal policies, an interactive cookie consent preference center, an administrative console (`/admin`), and an Android TWA / PWA package configuration have been implemented.

---

## 2. Application Architecture Overview

```
                                ┌──────────────────────────────────────────────────┐
                                │             User Browser / Android TWA           │
                                └─────────┬──────────────────────────────┬─────────┘
                                          │                              │
                        HTTPS / TLS 1.3   │                              │ Static Assets / PWA
                                          ▼                              ▼
                       ┌───────────────────────────────┐  ┌──────────────────────────────┐
                       │      Firebase Hosting /       │  │ Next.js 14 Static Export     │
                       │          Vercel CDN           │  │ (Tailwind CSS, Client-Side)  │
                       └───────────────┬───────────────┘  └──────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│  Firebase Authentication     │              │  Firebase Realtime Database  │
│  - Email / Password          │              │  Strict Per-User UID Rules:  │
│  - Google OAuth 2.0 Provider │              │  /students/{auth.uid}        │
│  - Session Token Expiry      │              │  /privacy_requests/{id}      │
└──────────────────────────────┘              └───────────────┬──────────────┘
                                                              │
                                                              ▼
                                              ┌──────────────────────────────┐
                                              │   Google Gemini 2.0 Engine   │
                                              │   gemini-flash-lite-latest   │
                                              │   Deterministic Guardrails   │
                                              └──────────────────────────────┘
```

---

## 3. 18-Phase Implementation Audit & Status Classifications

| Phase | Category | Status Classification | Details & Scope Handled |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Project Audit | `COMPLETED` | Removed all synthetic dummy data, demo login buttons, and insecure bypasses. |
| **Phase 2** | Public Website | `COMPLETED` | Built `/about`, `/features`, `/how-it-works`, `/pricing`, `/faq`, `/contact`, `/help-center`, `/blog`, `/sitemap`, `/500`, `/maintenance`, and `PublicFooter`. |
| **Phase 3** | Authentication & Account | `COMPLETED` | Email/password & Google Auth, email verification, session expiration recovery, password reset. |
| **Phase 4** | User Dashboard & Privacy | `COMPLETED` | Self-service JSON export, 1-click RTDB account purge, active UID session inspector. |
| **Phase 5** | 18 Legal & Policy Pages | `NEEDS LEGAL REVIEW` | 18 statutory HTML policies implemented with standard marked placeholders (`[LEGAL COMPANY NAME]`, etc.). |
| **Phase 6** | Indian Regulatory Compliance | `NEEDS BUSINESS INFORMATION` | DPDP Act 2023, IT Rules 2021, Grievance Officer details established. Awaiting company incorporation details. |
| **Phase 7** | Registration Consent & Cookies | `COMPLETED` | Statutory checkboxes on `/signup` (Terms, Privacy, Age 18+), Cookie Banner with preference center. |
| **Phase 8** | Google Play Store (TWA / PWA) | `NEEDS EXTERNAL ACCOUNT` | `manifest.json`, `.well-known/assetlinks.json`, and offline detectors created. Awaiting Google Play Console upload. |
| **Phase 9** | Social Media & Sharing | `COMPLETED` | OpenGraph tags, Twitter cards, social share component (WhatsApp, LinkedIn, X, Copy Link). |
| **Phase 10** | SEO & Discoverability | `COMPLETED` | Dynamic `sitemap.ts` (XML generator), `robots.ts`, JSON-LD metadata. |
| **Phase 11** | Administrative Dashboard | `COMPLETED` | `/admin` console with passcode gate, user table, suspension toggles, DPDP request inspector. |
| **Phase 12** | Payment & Monetization | `NEEDS CONFIGURATION` | Transparent student pricing displayed on `/pricing`. Live payment gateway (Razorpay / Stripe) webhook setup required for production card debits. |
| **Phase 13** | Security Engineering | `COMPLETED` | Strict per-user UID Firebase RTDB rules, zero secrets in git, input character limits, OWASP defenses. |
| **Phase 14** | Performance & Web Vitals | `COMPLETED` | Static export optimization, dynamic responsive aurora background, sub-second route changes. |
| **Phase 15** | Accessibility (a11y) | `COMPLETED` | WCAG 2.2 AA compliance, keyboard navigation, high contrast ratios, reduced motion support. |
| **Phase 16** | Code Quality & Refactoring | `COMPLETED` | TypeScript compilation, zero any bypasses, modular component separation. |
| **Phase 17** | Deployment Readiness | `COMPLETED` | Firebase Hosting configured (`firebase.json`), Next.js static export scripts verified. |
| **Phase 18** | Final Deliverables | `COMPLETED` | Comprehensive documentation, git history clean, secrets isolated in `.env.local`. |

---

## 4. Configuration Instructions & Placeholders Guide

### A. Replacing Legal & Business Placeholders
Search and replace the following bracketed placeholders across `src/components/public/PublicFooter.tsx`, `src/app/contact/page.tsx`, and the legal files under `src/app/`:

| Placeholder | Description | Example Replacement |
| :--- | :--- | :--- |
| `[LEGAL COMPANY NAME]` | Full legal entity name | `MentorMind Technologies Private Limited` |
| `[REGISTERED BUSINESS ADDRESS]` | Registered physical office address | `Level 4, Cyber Towers, Hitec City, Hyderabad 500081, India` |
| `[SUPPORT EMAIL]` | Primary customer support inbox | `support@mentormind.app` |
| `[PRIVACY CONTACT EMAIL]` | Dedicated data principal inbox | `privacy@mentormind.app` |
| `[GRIEVANCE OFFICER NAME]` | Appointed statutory Grievance Officer | `Aditi Rao, Advocate & CIPP/A` |
| `[GRIEVANCE OFFICER CONTACT]` | Grievance escalation email | `grievance@mentormind.app` |
| `[WEBSITE DOMAIN]` | Official domain name | `mentormindai.web.app` (or custom domain) |
| `[POLICY EFFECTIVE DATE]` | Platform launch date | `November 16, 2026` |

---

## 5. Google Play Store & TWA Publication Guide

### Step 1: Digital Asset Links Verification
1. MentorMind AI contains `public/.well-known/assetlinks.json`.
2. Generate your release keystore using Android Studio or Keytool:
   ```bash
   keytool -genkey -v -keystore mentormind-release.keystore -alias mentormind -keyalg RSA -keysize 2048 -validity 10000
   ```
3. Extract the SHA-256 fingerprint:
   ```bash
   keytool -list -v -keystore mentormind-release.keystore -alias mentormind
   ```
4. Replace the dummy `00:00:...` fingerprints in `public/.well-known/assetlinks.json` with your genuine SHA-256 fingerprint.

### Step 2: Package with Bubblewrap CLI (TWA)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://mentormindai-137a0.web.app/manifest.json
bubblewrap build
```
This produces an `.aab` (Android App Bundle) ready for upload to the **Google Play Console**.

---

## 6. Google Play Data Safety Mapping Table

When completing the **Data Safety** questionnaire in Google Play Console, use this verified mapping:

| Data Category | Collected? | Shared? | Purpose | Ephemeral / Stored | Can user delete? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Name** | Yes | No | Account management, personalized greetings | Stored in Firebase RTDB | Yes (Self-service deletion) |
| **Email Address** | Yes | No | Authentication, password reset, DPDP notifications | Stored in Firebase Auth & RTDB | Yes (Self-service deletion) |
| **User IDs** | Yes | No | Security access control (`auth.uid`) | Stored | Yes |
| **Academic Performance** | Yes | No | Adaptive quiz evaluation, revision schedule | Stored in RTDB | Yes |
| **Crash Logs & Diagnostics** | Optional | No | Platform performance & debugging | 180 days (CERT-In) | Yes |

* **Account Deletion URL:** `https://mentormindai-137a0.web.app/account-deletion`  
* **Privacy Policy URL:** `https://mentormindai-137a0.web.app/privacy`

---

## 7. Ongoing Statutory Compliance Checklist

1. **CERT-In Directions (Cybersecurity Incident Reporting):**
   - Mandatory reporting of qualifying cybersecurity incidents to CERT-In (`incident@cert-in.org.in`) within **6 hours** of noticing.
   - Maintain NTP synchronized system logs for a rolling **180 days**.

2. **DPDP Act 2023 (Digital Personal Data Protection):**
   - Respond to and acknowledge Data Principal grievances within **48 hours**.
   - Conclude resolution within **15 calendar days**.
   - Honor erasure requests immediately by wiping `/students/{uid}` and terminating Firebase Auth credentials.
