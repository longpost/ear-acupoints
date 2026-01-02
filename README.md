# Ear Acupoints & Zones (Educational)

One-page interactive auricular app with **three things kept un-messy**:

1) **Points mode** (穴位点): switch between **NADA (5 points)** and **GB/T (common starter set)**
2) **Zones mode** (功能区/区域): click **areas** for educational “functional zone” explanations
3) **Two ears**: left + right (right ear is mirrored)

> Educational demo only — not medical advice.

---

## What’s included

### ✅ Modes
- **Points**: NADA / GB/T toggle (shows only one standard at a time)
- **Zones (Areas)**: a starter set of schematic zones (easy to replace later)

### ✅ Admin coordinate picker (avoids old pitfalls)
Click **“标点模式 / Admin”**:
- Clicking on the map shows the **x/y coordinates** in the top bar
- Use this to quickly **re-mark GB/T coordinates** against your textbook figure

No more guessing + resizing + breaking the SVG.

---

## Files you’ll edit most

- `lib/points.ts`
  - `NADA_POINTS` (5 points)
  - `GBT_COMMON_POINTS` (starter set; expand later)
- `lib/areas.ts`
  - `EAR_AREAS` (starter zone shapes: pathD)

---

## How to expand GB/T (recommended workflow)

1) Pick a single reference figure (your textbook / your chosen GB/T diagram)
2) Turn on **Admin**
3) Click the correct location → read x/y
4) Paste x/y into `lib/points.ts`

Do 20 points first (fast), then gradually add more.

---

## Run locally
```bash
npm install
npm run dev
```

## Deploy on Vercel
Push to GitHub → Import into Vercel → default Next.js settings.

---

## Notes (important)
- Ear maps vary across systems/schools; **coordinates in this repo are schematic starters**.
- This repo avoids “SVG innerHTML injection” and instead uses a stable base outline image + overlays.

---

## Assets
- `public/ear_outline.svg` is used as the base ear outline.
