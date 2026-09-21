# Dew

**Dew** is a cheerful, toddler-friendly 3D web app that teaches ~3-year-olds how rain forms. Dew the dewdrop guides kids through seven soft, colorful stages of the rain cycle.

> Design plan: see [DESIGN.md](./DESIGN.md)

## Stack

- **Next.js** (App Router)
- **React Three Fiber** + **@react-three/drei** + **three**
- Client-only — no backend, no API keys, no env vars

## Local run

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Deploy (Vercel)

1. Push this repo to GitHub (`cldev1/how-rain-forms`).
2. Import on Vercel (Hobby team) with the **Next.js** preset.
3. **No environment variables** required.
4. Deploy from `main`.

Primary host is **Vercel** (not GitHub Pages — Next.js needs Node).

## Stages

1. Clouds — vapor rises into a fluffy cloud  
2. Warm & Cool — thermometer / rising warm air  
3. Tiny Drops — condensation on dust  
4. Drizzle — light slow rain  
5. Rain — steady rain  
6. Lots of Rain — heavy downpour  
7. Storm Fun — friendly flash + soft rumble + rain  

Huge stage buttons, optional Web Speech narrator, soft Web Audio thunder on stage 7 (starts on tap).
