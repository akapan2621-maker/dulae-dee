# DulaeDee (ดูแลดี)

> ระบบดูแลผู้สูงอายุผ่าน LINE — เชื่อมต่อผู้สูงอายุ ครอบครัว และศูนย์ดูแล

**DulaeDee** คือแพลตฟอร์มดูแลผู้สูงอายุบน LINE ที่ช่วยให้ครอบครัวสามารถติดตามสุขภาพ จัดการยา แจ้งเตือนนัดหมาย และรับการแจ้งเหตุฉุกเฉินจากผู้สูงอายุได้แบบเรียลไทม์

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript 5
- **Database:** Supabase (PostgreSQL)
- **LINE Integration:** LIFF SDK + LINE Messaging API
- **Thai Font:** Prompt (`@fontsource/prompt`)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn
- Supabase account (free tier works)
- LINE Developer account

### 1. Install Dependencies

```bash
cd projects/dulae-dee
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# LINE
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
LINE_LIFF_ID_ELDERLY=your-liff-id-for-elderly
LINE_LIFF_ID_FAMILY=your-liff-id-for-family

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
dulae-dee/
├── src/
│   ├── app/
│   │   ├── api/                    # REST API routes
│   │   │   ├── line/               # LINE webhook handler
│   │   │   ├── families/           # Family management
│   │   │   ├── medications/        # Medication tracking
│   │   │   ├── checkin/            # Daily check-in
│   │   │   ├── emergency/          # Emergency SOS
│   │   │   ├── dashboard/          # Family dashboard data
│   │   │   ├── reports/            # Weekly health reports
│   │   │   └── appointments/       # Appointment tracking
│   │   ├── elderly/                # Elderly LIFF pages (Thai-only)
│   │   ├── family/                 # Family dashboard pages
│   │   ├── care-center/            # B2B care center pages
│   │   ├── globals.css             # Global styles + design tokens
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── elderly/                # 3-button elderly UI components
│   │   ├── family/                 # Dashboard components
│   │   ├── care-center/            # B2B admin components
│   │   └── ui/                     # Shared UI primitives
│   ├── lib/                        # Utilities & helpers
│   ├── types/                      # TypeScript types
│   └── styles/                     # Extra styles
├── public/                         # Static assets (LINE icons, SVGs)
├── supabase/                       # Database migrations
├── DESIGN.md                       # Full design document
└── package.json
```

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Elderly Green | `#2E7D32` | Elderly UI primary |
| Emergency Red | `#D32F2F` | SOS button, alerts |
| Family Blue | `#1565C0` | Family dashboard |
| Warning Yellow | `#F57F17` | Warnings, pending states |
| B2B Purple | `#4527A0` | Care center dashboard |

### Elderly UX Rules

- ✅ **2-Tap Rule** — ทุกฟีเจอร์ใช้ taps ไม่เกิน 2 ครั้ง
- ✅ **Thai-Only UI** — ภาษาไทยเท่านั้นสำหรับผู้สูงอายุ
- ✅ **No Scroll** — เนื้อหาทั้งหมดอยู่ในหน้าจอเดียว
- ✅ **Zero Setup** — ไม่ต้องสมัครสมาชิก ใช้ LINE profile อัตโนมัติ
- ✅ **WCAG AAA** — contrast ≥ 7:1, font ≥ 24px, tap target ≥ 64px

## 🔧 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 📖 Documentation

- [DESIGN.md](./DESIGN.md) — Full design document, architecture, and API reference
- [AGENTS.md](./AGENTS.md) — AI agent coding rules

## 📄 License

Private — DulaeDee Project
