# Grand Horizon · Master of Composure

A single-file, offline-capable Progressive Web App for **strategic patience and emotional discipline** — a tactical psychological utility inspired by the extreme composure of historical figures like **Sima Yi** and **Gou Jian** (臥薪嘗膽, *"sleep on brushwood, taste the gall"*).

Not a generic self-help tracker. A cold, clinical instrument for mastering the gap between provocation and response.

![Aesthetic: cyber-classicist dark slate with tactical amber](https://img.shields.io/badge/aesthetic-cyber--classicist-f59e0b) ![Stack: single-file](https://img.shields.io/badge/stack-single--file-0f172a) ![No backend](https://img.shields.io/badge/backend-none-0f172a)

---

## Features

| # | Module | What it does |
|---|--------|--------------|
| 1 | **Macro-Timeline Quote Engine** | A daily-rotating strategic quote in the header (tap to advance) — long-game wisdom over immediate reaction. |
| 2 | **Tactical Pause Engine** | A 10-second lockdown countdown with a circular progress ring and a breathing cue. On completion: a subtle chime (Web Audio), a haptic buzz, a visual flash, and **Ego Sovereignty Points**. |
| 3 | **The Alchemy of Ego** | Type a live emotional trigger; a client-side parser strips the emotion and returns cold, data-driven strategy on a typed terminal display — keyword-mapped to *corporate theater*, *interpersonal volatility*, *status exposure*, or *ambient noise*. |
| 4 | **Wo Xin Chang Dan** (Bitter Gall Trials) | A list of high-friction daily challenges. Check them off to build a **streak** and earn XP that drives a **rank/leveling** system. |
| 5 | **Historical Retrospective** | A growing archive of every transmuted trigger, stripped of heat — return to watch how small the old storms have become from the macro-timeline. |

## Stack

- **One file.** `index.html` — semantic HTML5.
- **Tailwind CSS** (Play CDN) for styling.
- **Alpine.js** (+ `persist` and `collapse` plugins) for reactivity and state.
- **`localStorage`** for persistence — all points, levels, streaks, and logs survive a refresh.
- **No backend, no auth, no tracking.** Everything is local and client-side.

## Run it

It's a static file. Any of these work:

```bash
# Option A — just open it
#   double-click index.html in your browser

# Option B — local server (recommended for PWA install)
node serve.js          # → http://localhost:4321
# or
python -m http.server 4321
```

Then, in a Chromium browser, use **Install app** to add it to your home screen — it runs standalone, full-bleed on mobile.

## Design

Cyber-classicist, ultra-clean dark slate. Background `slate-950`, cards `slate-900` with `slate-800` borders, tactical **amber/gold** accents (`amber-500`) for focus and value. The layout is a fixed `max-w-md` mobile frame, centered on desktop and full-bleed on devices.

## Philosophy

> *The patient man waits while the impatient man defeats himself. To do nothing, deliberately, is the rarest discipline of all.*

The composed man is not the one who feels nothing — he is the one who decides, alone, what to do with what he feels.

---

*Built as a tactical utility. Your data never leaves your device.*
