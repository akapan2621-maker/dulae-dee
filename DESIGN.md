# DulaeDee (ดูแลดี) — Design Document

> LINE-based Caregiver Coordination SaaS for Thai Elderly Care

## 1. Project Overview

**DulaeDee (ดูแลดี)** is a LINE-based caregiver coordination platform that connects elderly users (via LINE LIFF), family members (via web dashboard), and B2B care centers through a unified system. The platform enables medication reminders, daily check-ins, emergency SOS, appointment tracking, and health reporting.

### Dual (Triple) Persona Architecture

| Persona | Interface | Access |
|---|---|---|
| **ผู้สูงอายุ (Elderly)** | LINE Mini App (LIFF) — 3 big buttons only | LINE Official Account |
| **ครอบครัว (Family)** | LIFF Web Dashboard — full management | Browser / LIFF wrapper |
| **ศูนย์ดูแล (Care Center)** | B2B Dashboard — multi-patient management | Browser |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript 5 |
| Database | Supabase (PostgreSQL + Auth + Realtime) |
| LINE Integration | LINE LIFF SDK, LINE Messaging API, LINE Rich Menu |
| Fonts | Prompt (Thai) — `@fontsource/prompt` |
| Deployment | Vercel |

---

## 3. Design System

### 3.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--elderly-green` | `#2E7D32` | Elderly UI primary, success states, medication taken |
| `--emergency-red` | `#D32F2F` | SOS button, alerts, critical notifications |
| `--family-blue` | `#1565C0` | Family dashboard primary, links, info |
| `--warning-yellow` | `#F57F17` | Warnings, missed medications, pending states |
| `--b2b-purple` | `#4527A0` | Care center dashboard, admin features |
| `--bg-elderly` | `#F1F8E9` | Elderly UI background (light green tint) |
| `--bg-family` | `#E3F2FD` | Family dashboard background (light blue tint) |
| `--bg-b2b` | `#EDE7F6` | Care center background (light purple tint) |

### 3.2 Typography

| Persona | Font Size | Line Height | Weight |
|---|---|---|---|
| **Elderly** | 32–36px | 1.6 | Bold (700) |
| **Family** | 16–20px | 1.5 | Regular (400)–Medium (500) |
| **B2B** | 14–16px | 1.4 | Regular (400) |

- **Font Family:** Prompt (Thai-optimized Google Font)
- **Thai-only UI** for elderly screens — no English text

### 3.3 Elderly UX Rules

| Rule | Description |
|---|---|
| **2-Tap Rule** | Every action achievable in ≤2 taps from the main screen |
| **Thai-Only UI** | All elderly-facing screens use Thai language exclusively |
| **No Scroll** | Single viewport — all content visible without scrolling |
| **Zero Setup** | No login, no registration — LINE profile auto-linked |
| **WCAG AAA** | Contrast ratio ≥ 7:1, font ≥ 24px, tap target ≥ 64×64px |

### 3.4 Component Design Tokens

```css
:root {
  /* Elderly */
  --btn-elderly-width: 90vw;
  --btn-elderly-height: 80px;
  --btn-elderly-radius: 16px;
  --btn-elderly-font: 32px;
  
  /* Emergency SOS */
  --btn-sos-width: 200px;
  --btn-sos-height: 200px;
  --btn-sos-radius: 50%;
  --btn-sos-font: 48px;
  --btn-sos-bg: #D32F2F;
  --btn-sos-text: #FFFFFF;
}
```

---

## 4. Information Architecture

### 4.1 Elderly Interface (LINE LIFF)

```
LINE Rich Menu (3 buttons)
├── 💊 ยา (Medications)
│   ├── วันนี้ต้องกินยาอะไร (Today's medications)
│   ├── กดยืนยันกินแล้ว (Confirm taken) ← 1 tap
│   └── ประวัติการกินยา (History)
├── 📋 เช็คอิน (Check-in)
│   ├── สุขภาพวันนี้ (Daily health check-in)
│   ├── อารมณ์วันนี้ (Mood tracker)
│   └── บันทึกอาการ (Symptoms log)
└── 🆘 ฉุกเฉิน (Emergency)
    ├── โทร SOS (1-tap emergency call)
    ├── แจ้งลูกหลาน (Notify family)
    └── ขอความช่วยเหลือ (Request help)
```

### 4.2 Family Interface (LIFF Web)

```
/dashboard/[familyId]
├── 📊 สรุปภาพรวม (Overview Dashboard)
│   ├── สถานะผู้สูงอายุ (Elderly status cards)
│   ├── ยาที่กินแล้ว/ยังไม่กิน (Medication progress)
│   └── การเช็คอินล่าสุด (Latest check-in)
├── 💊 จัดการยา (Medication Management)
│   ├── เพิ่ม/แก้ไข/ลบยา (CRUD medications)
│   ├── ตั้งเวลาเตือน (Reminder schedule)
│   └── ประวัติการกินยา (Medication history)
├── 📅 นัดหมาย (Appointments)
│   ├── ดูนัดทั้งหมด (All appointments)
│   ├── เพิ่มนัดใหม่ (Add appointment)
│   └── แจ้งเตือนก่อนนัด (Pre-appointment reminders)
├── 📄 รายงาน (Reports)
│   ├── รายงานรายสัปดาห์ (Weekly PDF report)
│   └── แนวโน้มสุขภาพ (Health trends)
├── 👥 สมาชิก (Members)
│   ├── จัดการสมาชิกครอบครัว (Family member management)
│   └── บทบาทและสิทธิ์ (Roles & permissions)
└── 📱 ข้อมูลผู้สูงอายุ (Elderly Profile)
    ├── ข้อมูลส่วนตัว (Personal info)
    ├── โรคประจำตัว (Chronic conditions)
    └── ข้อมูลติดต่อฉุกเฉิน (Emergency contacts)
```

### 4.3 Care Center Interface (B2B)

```
/care-center
├── 📊 แดชบอร์ด (Dashboard)
│   ├── สรุปผู้ป่วยทั้งหมด (All patients overview)
│   ├── สถิติการดูแล (Care statistics)
│   └── แจ้งเตือนที่ต้องดูแล (Action items)
├── 👥 รายชื่อผู้ป่วย (Patient List)
│   ├── ค้นหาและกรอง (Search & filter)
│   └── รายละเอียดผู้ป่วย (Patient detail)
├── 📋 แผนการดูแล (Care Plans)
│   ├── จัดการแผนการดูแล (Care plan management)
│   └── บันทึกการดูแล (Care logs)
└── 📄 รายงาน (Reports)
    ├── รายงานสำหรับหน่วยงาน (Regulatory reports)
    └── สถิติการให้บริการ (Service analytics)
```

---

## 5. Database Schema (Supabase)

### Core Tables

```sql
-- Families & Members
families          (id, name, created_at)
family_members    (id, family_id, line_user_id, name, role, phone)

-- Elderly Profile
elderly_profiles  (id, family_id, name, nickname, dob, conditions[], 
                   emergency_contacts[], photo_url)

-- Medications
medications       (id, elderly_id, name, dosage, frequency, 
                   times[], start_date, end_date, notes)
medication_logs   (id, medication_id, scheduled_time, confirmed_at, status)

-- Daily Check-in
checkins          (id, elderly_id, date, mood, pain_level, 
                   symptoms[], notes, recorded_at)

-- Emergency
emergencies       (id, elderly_id, type, status, triggered_at, 
                   resolved_at, notified_members[])

-- Appointments
appointments      (id, elderly_id, family_id, title, doctor, 
                   hospital, datetime, notes, reminder_sent)

-- Reports
weekly_reports    (id, family_id, elderly_id, week_start, 
                   medication_adherence, checkin_summary, generated_at)

-- Care Center (B2B)
care_centers      (id, name, license_number, contact)
care_center_members (id, care_center_id, user_id, role)
care_plans        (id, elderly_id, care_center_id, plan, 
                   start_date, end_date, notes)
```

### Row-Level Security (RLS)

- Family members can only access data for their `family_id`
- Care center members can only access assigned patients
- Elderly users can only read their own data
- API routes enforce auth via Supabase session tokens

---

## 6. API Endpoints

All endpoints are Next.js App Router API routes under `src/app/api/`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/families` | GET/POST | List/create families |
| `/api/families/[id]` | GET/PUT/DELETE | Family CRUD |
| `/api/families/[id]/members` | GET/POST | Family member management |
| `/api/medications` | GET/POST | List/create medications |
| `/api/medications/[id]` | GET/PUT/DELETE | Medication CRUD |
| `/api/medications/[id]/confirm` | POST | Confirm medication taken |
| `/api/checkin` | GET/POST | Daily check-in records |
| `/api/emergency` | POST | Trigger SOS alert |
| `/api/dashboard/[familyId]` | GET | Family dashboard data |
| `/api/reports/[familyId]/weekly` | GET | Generate weekly PDF report |
| `/api/appointments/[familyId]` | GET/POST | Appointment management |
| `/api/line` | POST | LINE webhook handler |

---

## 7. LINE Integration

### 7.1 Rich Menu Design

```
┌─────────────────────────────────┐
│                                 │
│   💊 ยา           📋 เช็คอิน     │
│   กินยา           รายงานตัว      │
│                                 │
│        🆘 ฉุกเฉิน              │
│        SOS                     │
│                                 │
└─────────────────────────────────┘
```

- **Button size:** Full-width, 80px height
- **Font:** 32px bold, Thai text
- **Icons:** Custom SVG, 64×64px minimum
- **Tap target:** ≥ 64×64px (WCAG AAA)

### 7.2 LINE Webhook Events

| Event | Handler | Action |
|---|---|---|
| `message` (text) | `/api/line` | Route to check-in or help |
| `postback` | `/api/line` | Handle Rich Menu actions |
| `follow` | `/api/line` | Auto-link to family account |
| `unfollow` | `/api/line` | Soft-delete user data |

### 7.3 LIFF Integration

- **LIFF App URL:** Configured per environment
- **Elderly LIFF:** Opened via Rich Menu postback
- **Family LIFF:** Shared as link, opens in LINE browser
- **Token exchange:** Supabase auth via LINE user ID

---

## 8. MVP Phases

### Phase 1 — Core (90 days)

| Feature | Persona | Priority |
|---|---|---|
| LINE Rich Menu (3 buttons) | Elderly | P0 |
| Medication Reminder System | Elderly + Family | P0 |
| Daily Check-in Flow | Elderly | P0 |
| Emergency SOS | Elderly | P0 |
| Family Dashboard | Family | P0 |
| Medication Setup (Family) | Family | P0 |
| Supabase Schema + RLS | All | P0 |

### Phase 2 — Enhanced (60 days)

| Feature | Persona | Priority |
|---|---|---|
| Appointment Tracking | Family | P1 |
| Weekly Report PDF Generation | Family | P1 |
| OCR for Medication Labels | Family | P1 |
| Health Trend Charts | Family | P1 |
| Push Notification System | All | P1 |

### Phase 3 — Scale (90 days)

| Feature | Persona | Priority |
|---|---|---|
| AI Health Q&A | Elderly | P2 |
| B2B Care Center Dashboard | Care Center | P2 |
| Wearable Integration (Fitbit, etc.) | Elderly | P2 |
| Multi-language Support | All | P2 |
| Billing & Subscription System | B2B | P2 |

---

## 9. Accessibility & Compliance

- **WCAG 2.1 AAA** for elderly interface
- **Contrast ratio** ≥ 7:1 for all text
- **Minimum tap target** 64×64px
- **Font size** ≥ 24px on all elderly screens
- **Thai PDPA** compliance for personal health data
- **LINE Platform Guidelines** adherence

---

## 10. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# LINE
LINE_CHANNEL_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=
LINE_LIFF_ID_ELDERLY=
LINE_LIFF_ID_FAMILY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_ENV=development
```

---

## 11. Project Structure

```
dulae-dee/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── line/               # LINE webhook
│   │   │   ├── families/           # Family CRUD
│   │   │   ├── medications/        # Medication CRUD
│   │   │   ├── checkin/            # Daily check-in
│   │   │   ├── emergency/          # SOS trigger
│   │   │   ├── dashboard/          # Dashboard data
│   │   │   ├── reports/            # Weekly reports
│   │   │   └── appointments/       # Appointments
│   │   ├── elderly/                # Elderly LIFF pages
│   │   ├── family/                 # Family dashboard pages
│   │   │   ├── medications/
│   │   │   ├── appointments/
│   │   │   └── members/
│   │   ├── care-center/            # B2B pages
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Global styles + design tokens
│   ├── components/
│   │   ├── elderly/                # Elderly-specific components
│   │   ├── family/                 # Family-specific components
│   │   ├── care-center/            # B2B components
│   │   └── ui/                     # Shared UI components
│   ├── lib/
│   │   ├── supabase/               # Supabase client helpers
│   │   ├── line/                   # LINE API helpers
│   │   └── utils/                  # Shared utilities
│   ├── types/                      # TypeScript type definitions
│   └── styles/                     # Additional style files
├── public/
│   ├── line/                       # LINE Rich Menu assets
│   └── *.svg                       # Default icons
├── supabase/                       # Supabase migrations
├── DESIGN.md                       # This document
├── README.md                       # Project README
└── package.json
```
