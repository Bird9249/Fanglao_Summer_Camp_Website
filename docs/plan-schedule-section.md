# 📅 Implementation Plan — Interactive Festival Schedule Section

> Section ใหม่: **"Camp Schedule"** (Section 3.5) สำหรับหน้าแรกของเว็บ Summer Dance Camp 2026
> แทรกระหว่าง `CampStylesSection` (5 Camp Styles) กับ `JamEventSection`
> ข้อมูลอ้างอิงจาก `Summer_Dance_Camp_2026_Agenda.xlsx`

---

## 1. Placement Strategy (ตำแหน่งบนหน้าแรก)

แก้ไข `src/routes/_site/index.tsx` — ลำดับ section ใหม่:

```tsx
<HeroSection />
<QuickInfoSection />
<CampStylesSection />      {/* Section 3 เดิม */}
<CampScheduleSection />    {/* ⬅ Section 3.5 ใหม่ */}
<JamEventSection />
```

- ใส่ `id="camp-schedule"` + `scroll-mt-18` เพื่อรองรับ anchor link จาก navbar/CTA (pattern เดียวกับ `id="camp-styles"` ที่มีอยู่)
- เหตุผล UX: ผู้ใช้ดูครบ 5 สไตล์แล้ว → เห็นตารางทันทีว่าเรียนวันไหน/เวลาไหน/ห้องไหน → ตัดสินใจกดลงทะเบียนใน section ถัดไปได้โดยไม่ต้องเปลี่ยนหน้า

---

## 2. Data Model (ข้อมูลจาก Excel → TypeScript)

สร้างไฟล์ใหม่ `src/lib/camp-schedule.ts` เก็บข้อมูลแบบ static (ไม่ต้องดึง DB เพราะตารางคงที่ตลอดแคมป์)

### 2.1 Types

```ts
export type ScheduleTab = {
  id: 'week1' | 'week2' | 'week3' | 'workshop' | 'event-day'
  label: string          // เช่น "Week 1: Explore"
  labelLao: string       // ป้ายภาษาลาว
  dateRange: string      // "29 Jun – 3 Jul"
  isEventDay?: boolean
}

export type ScheduleSlot = {
  time: string               // "13:00 – 14:30"
  className: string          // "Kid Class", "Hiphop Mini Battle", ...
  studio?: 1 | 2             // badge ระบุห้อง (event day ไม่มี)
  styleId?: string           // map ไปหา campStyles เพื่อดึงสี/icon (ใช้ findCampStyleForClassName ที่มีอยู่แล้ว)
  isSpecial?: boolean        // Mini Battle / Random Play / Showcase / Workshop → สีแดง-ส้มทอง + pulse
}

export type ScheduleDay = {
  date: string               // "Mon, 29 Jun"
  isoDate: string            // "2026-06-29" (ใช้กับ live tracker / highlight วันปัจจุบัน)
  slots: ScheduleSlot[]
}
```

### 2.2 ข้อมูลจริงจาก xlsx (สรุป)

| Tab | ช่วงวันที่ | เนื้อหา |
|---|---|---|
| **Week 1: Explore** | 29 Jun – 3 Jul (Mon–Fri) | 13:00 Kid(S1)+Hiphop(S2) · 14:45 K-pop(S1)+Breaking(S2) · 16:30 Street Jazz(S1) — เหมือนกันทุกวัน |
| **Week 2: Develop** | 6 – 10 Jul (Mon–Fri) | Mon–Thu เหมือน Week 1 · **Fri 10 Jul พิเศษ:** Hiphop **Mini Battle** (13:00 S2), **Random Play Dance** (14:45 S1), **Breaking Showcase Planning** (14:45 S2) |
| **Week 3: Production** | 13 – 15 Jul (Mon–Wed เท่านั้น) | ทุกคลาสเป็น **Rehearsal** |
| **Int'l Workshop** | 16 – 17 Jul (Thu–Fri) | Thu: International Hiphop Workshop ×2 + Q&A/Meet Artist · Fri: International Workshop ×2 + Closing Jam & Photo |
| **18 Jul: Event Day** | Sat 18 Jul | 10:00 Registration & Sound Check → 13:00 Opening → 14:30 Student Showcase → 15:30 Int'l Guest Performance → 16:00 Dance Battle/Random Play → 16:30 Awards → 17:00 Photo & Closing |

> ⚠️ **ข้อสังเกตจาก spec เดิม:** โจทย์ระบุ 4 ปุ่ม แต่ใน xlsx มี **International Workshop (16–17 Jul)** เพิ่มมาอีกช่วง
> **แนะนำ: ใช้ 5 ปุ่ม** `[Week 1: Explore] [Week 2: Develop] [Week 3: Production] [16–17: Workshop] [18 Jul: Event Day]`
> (ทางเลือกสำรอง: ยุบ Workshop เข้า tab Week 3 เป็น "Production & Workshop" ถ้าอยากคงไว้ 4 ปุ่มตาม spec)

> 📌 หมายเหตุ: เวลาใน `camp-styles.ts` เดิม (เช่น K-pop 15:00–16:30) **ไม่ตรง** กับ xlsx (14:45–16:15) — ควรอัปเดต `timeSlots` ใน `camp-styles.ts` ให้ตรงกับ agenda จริงด้วยในงานนี้

---

## 3. Component Structure

สร้างโฟลเดอร์ใหม่ `src/components/home/schedule/`

```
schedule/
├── CampScheduleSection.tsx    # Section หลัก: heading + tabs + panel, จัดการ state สัปดาห์ที่เลือก
├── WeekTabs.tsx               # แถบปุ่ม 5 ปุ่มแนวนอน (scrollable บนมือถือ) + แถบไฮไลท์เลื่อนตาม active tab
├── WeekGrid.tsx               # Layout รายวัน Mon–Fri (grid 5 คอลัมน์ desktop / stack มือถือ) + slide animation ตอนสลับ
├── DayColumn.tsx              # คอลัมน์ 1 วัน: header วันที่ + Time Slot cards ซ้อนแนวตั้ง
├── TimeSlotCard.tsx           # การ์ดคลาส: เวลา + ชื่อคลาส + Studio badge + hover glow ตามสีสไตล์
└── EventDayTimeline.tsx       # Timeline แนวตั้งของ 18 Jul + Live Time Indicator
```

### หน้าที่หลักแต่ละตัว

- **`CampScheduleSection`** — state `activeTab` + ทิศทางสไลด์ (`direction: 1 | -1` คำนวณจาก index เก่า/ใหม่), render `WeekTabs` ด้านบน, render `WeekGrid` หรือ `EventDayTimeline` ตาม tab
- **`WeekTabs`** — ปุ่มใหญ่ font-heading uppercase; ปุ่ม Event Day ใช้สีแดง/ส้มทองตัดกับปุ่มอื่นที่เป็นม่วงนีออน; บนมือถือเป็น `overflow-x-auto` + `scroll-snap`; ใช้ `role="tablist"` / `role="tab"` + arrow-key navigation
- **`WeekGrid`** — รับ `days: ScheduleDay[]` + `direction`; ใช้ `key={tabId}` เพื่อ remount แล้วเล่น CSS slide-in animation
- **`TimeSlotCard`** — แสดง `time`, `className`, Studio badge เรืองแสง; map `styleId` → สี glow ประจำสไตล์; ถ้า `isSpecial` ใช้สีแดง/ทอง + pulse animation
- **`EventDayTimeline`** — list กิจกรรม 7 ช่วงเรียงแนวตั้ง มีเส้นแกนกลาง + จุด marker; ฝัง Live Tracker (ดูข้อ 5.4)

---

## 4. UI Design (Theme Concordance)

ใช้ design token ที่มีอยู่แล้วใน `app.css` — **ไม่ต้องเพิ่มสีใหม่ส่วนใหญ่**:

| องค์ประกอบ | Token / ค่า |
|---|---|
| พื้นหลัง section | `oklch(0.1 0.055 295)` (โทนเดียวกับ `.jam-event-section`) + radial gradient ม่วงจางๆ |
| คลาสปกติ — ขอบ/glow | `--chart-5` (ม่วงนีออน `oklch(0.65 0.15 300)`) ผสมด้วย `color-mix` |
| คลาสพิเศษ / Event Day | `--destructive` (แดง) ไล่เฉดเข้า `--primary` (ทอง) |
| Breaking hover glow | `--primary` (Electric Gold) ตาม spec "เรืองแสงสีทอง" |
| Studio badge | `Studio 1` = ขอบม่วงนีออน, `Studio 2` = ขอบทอง — ตัวอักษรเล็ก uppercase + `box-shadow` เรืองแสง |
| การ์ด | `bg-card/60` + `backdrop-blur` + `border` 1px + `rounded-lg` (radius 0.5rem ตาม theme) |

**สี glow ต่อสไตล์** (เพิ่ม CSS classes ใน `app.css` ชุด `.schedule-glow-*`):

- `kids` → ม่วงอ่อน/ชมพูนีออน · `kpop` → ม่วงนีออน · `street-jazz` → ทอง-ม่วง · `hip-hop` → ม่วงเข้ม · `breaking` → **ทอง** · `special/event` → **แดง-ส้มทอง**

**Responsive:**

- **Desktop (≥1024px):** grid 5 คอลัมน์ (Mon–Fri) เห็นทั้งสัปดาห์พร้อมกัน — Week 3 มี 3 วันก็จัด 3 คอลัมน์กึ่งกลาง, Workshop 2 คอลัมน์
- **Tablet (640–1024px):** grid 2–3 คอลัมน์ wrap ลงมา
- **Mobile (<640px):** stack วันละบล็อกแนวตั้ง; วันปัจจุบัน (เทียบ `isoDate`) เปิด highlight + auto-scroll มาที่วันนั้น

---

## 5. Interactive Animations

> ⚠️ **โปรเจกต์นี้ไม่มี framer-motion / GSAP** — โค้ดเดิมทั้งหมดใช้ CSS transitions + keyframes + rAF (เช่น `CampStylesSection`, `hero-neon-flicker`)
> **แนะนำ: ทำทุก animation ด้วย CSS ล้วน** เพื่อคงน้ำหนัก bundle และ pattern เดิม (ผลลัพธ์เหมือน framer motion ได้ครบสำหรับ use case นี้) — ถ้าทีมยืนยันอยาก framer-motion ค่อยเพิ่ม dependency ทีหลัง

### 5.1 Weekly Switch Animation (slide-out ซ้าย / slide-in ขวา)

- เก็บ `direction` ใน state: กดไป tab ขวา → เนื้อหาใหม่ slide เข้าจากขวา, กด tab ซ้าย → เข้าจากซ้าย
- เทคนิค: ใส่ `key={activeTab}` ให้ panel → React remount → เล่น keyframe `schedule-panel-in-right` / `schedule-panel-in-left` (translateX 40px→0 + opacity 0→1, ~450ms `cubic-bezier(0.22, 1, 0.36, 1)` — easing เดียวกับ accordion เดิม)
- การ์ดข้างในใส่ `animation-delay` ไล่ทีละ ~40ms (stagger) ให้ดูมีจังหวะดนตรี
- ปุ่ม tab มี active indicator (แถบเรืองแสงใต้ปุ่ม) เลื่อนตามด้วย `transition: transform`

### 5.2 Hover Glow & Expand

```css
.schedule-slot-card {
  transition: transform 250ms, box-shadow 250ms, border-color 250ms;
}
.schedule-slot-card:hover {
  transform: scale(1.02);
  /* box-shadow + border-color ตามสีสไตล์ ผ่าน CSS variable --slot-glow */
}
```

- กำหนด `--slot-glow` ต่อการ์ดจาก `styleId` (เช่น Breaking = `var(--primary)`) แล้ว hover ใช้ `box-shadow: 0 0 20px color-mix(in oklch, var(--slot-glow) 45%, transparent)`
- มือถือ (ไม่มี hover) → ใช้ `:active` แทน + glow แบบ static จางๆ ตลอดเวลา

### 5.3 Special Event Pulse

- การ์ด `isSpecial` (Hiphop Mini Battle ศุกร์ 10 Jul, Random Play Dance, Breaking Showcase Planning, Workshop, Q&A, Closing Jam):

```css
@keyframes schedule-pulse {
  0%, 100% { box-shadow: 0 0 8px color-mix(in oklch, var(--destructive) 35%, transparent); }
  50%      { box-shadow: 0 0 22px color-mix(in oklch, var(--destructive) 60%, transparent); }
}
/* animation: schedule-pulse 2.2s ease-in-out infinite; */
```

- เพิ่ม badge "🔥 SPECIAL" / "HIGHLIGHT" มุมการ์ด สีแดงตัด
- **`prefers-reduced-motion: reduce` → ปิด pulse/slide ทั้งหมด** (มี media query block อยู่แล้วใน `app.css` ราว line 886 — เพิ่ม selector เข้าไป)

### 5.4 Live Time Indicator (Event Day 18 Jul)

- ใน `EventDayTimeline`: เส้นแนวนอนเรืองแสงสีทอง+จุด pulse ที่ตำแหน่ง interpolate ตามเวลาจริง
- Logic (client-only hook `useLiveEventPosition`):
  1. แสดงเฉพาะเมื่อ "ตอนนี้" อยู่ในวันที่ **18 Jul 2026 ช่วง 10:00–18:00 เวลาลาว (UTC+7)** — คำนวณ offset ตรงๆ ไม่พึ่ง timezone เครื่องผู้ใช้
  2. หา slot ปัจจุบัน → ตำแหน่ง = top ของ slot + สัดส่วนเวลาที่ผ่านไปใน slot นั้น (วัดจาก `offsetTop`/`offsetHeight` ของ DOM จริง เพื่อรองรับการ์ดสูงไม่เท่ากัน)
  3. อัปเดตทุก 30–60 วินาทีด้วย `setInterval` (ไม่ต้อง rAF — เวลาเดินช้า)
  4. Slot ที่กำลังดำเนินอยู่ → ใส่ป้าย "● LIVE NOW" สีแดง pulse; slot ที่จบแล้ว → ลด opacity
  5. **SSR-safe:** render indicator หลัง mount เท่านั้น (`useEffect` + state) กัน hydration mismatch
- ก่อนถึงวันงาน → ไม่แสดงเส้น แต่แสดง countdown chip เล็กๆ ("อีก X วัน") ได้ — reuse logic จาก `CampCountdown.tsx` ถ้ามี

---

## 6. Accessibility & Edge Cases

- Tabs: `role="tablist"`, `aria-selected`, `tabIndex` roving, ลูกศรซ้าย/ขวาสลับ tab
- ทุก animation เคารพ `prefers-reduced-motion`
- ภาษา: heading หลัก EN (font-heading uppercase ตาม pattern เดิม) + คำอธิบายรองภาษาลาว (เหมือน section อื่นที่ใช้ลาวเป็นหลัก)
- Slot ว่าง (เช่น 16:30 ไม่มีคลาสใน Studio 2) → ไม่ render การ์ดเปล่า, layout การ์ดซ้อนแนวตั้งจึงไม่ต้องมีช่องว่าง
- Week 3 มีแค่ Mon–Wed และ Workshop มีแค่ Thu–Fri → `WeekGrid` ต้อง render ตามจำนวนวันจริง ไม่ fix 5 คอลัมน์

---

## 7. ลำดับงาน Implement (Checklist)

1. [ ] `src/lib/camp-schedule.ts` — types + ข้อมูลตารางทั้ง 5 tabs จาก xlsx (+ unit map `styleId` ผ่าน `findCampStyleForClassName`)
2. [ ] อัปเดต `timeSlots` ใน `src/lib/camp-styles.ts` ให้ตรง agenda จริง (14:45–16:15 ฯลฯ)
3. [ ] CSS ใน `app.css`: section bg, `.schedule-slot-card`, glow per style, `schedule-pulse`, slide keyframes, reduced-motion overrides
4. [ ] `WeekTabs.tsx` — tablist + active indicator + mobile scroll
5. [ ] `TimeSlotCard.tsx` + `DayColumn.tsx` + `WeekGrid.tsx` — layout + hover + stagger + slide direction
6. [ ] `EventDayTimeline.tsx` + `useLiveEventPosition` hook — timeline + live tracker (SSR-safe)
7. [ ] `CampScheduleSection.tsx` — ประกอบทุกอย่าง + heading สองภาษา
8. [ ] แทรกเข้า `src/routes/_site/index.tsx` ระหว่าง `CampStylesSection` กับ `JamEventSection`
9. [ ] (ถ้ามี navbar anchor) เพิ่มลิงก์ "Schedule" → `#camp-schedule`
10. [ ] ทดสอบ: desktop/tablet/mobile, สลับ tab ทุกทิศ, reduced-motion, mock เวลาเป็น 18 Jul 14:00 (UTC+7) เช็ค live tracker, `bun run build` ผ่าน (`tsc --noEmit` รวมอยู่แล้ว)

---

## 8. คำถามที่ต้องเคาะก่อนเริ่ม

1. **จำนวนปุ่ม tab:** 5 ปุ่ม (แยก Int'l Workshop) ตามข้อมูลจริง หรือ 4 ปุ่มตาม spec (ยุบ Workshop รวม Week 3)? → *แนะนำ 5 ปุ่ม*
2. **Animation lib:** CSS ล้วนตาม pattern โค้ดเดิม หรือเพิ่ม framer-motion? → *แนะนำ CSS ล้วน*
3. ปุ่ม CTA ท้าย section ("ลงทะเบียนเลย" → `/register`) ต้องการไหม? → *แนะนำใส่ เพื่อปิด loop การตัดสินใจตาม UX strategy ข้อ 1*
