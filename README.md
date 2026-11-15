# 싱가포르 여행 · 모바일 일정표

A lightweight, Korean, mobile-first itinerary for February 2027. Static HTML/CSS/JavaScript, with no runtime dependencies or third-party analytics.

## Features

- Swipeable date tabs, one-day timeline cards and an optional date × time overview.
- Fold-out alternatives clearly marked as **replacements**, not extra commitments.
- Google Maps search links; rest periods and unconfirmed operational timings have distinct labels.
- Keyboard-operable date tabs, reduced-motion support, sticky navigation and 320px+ responsive layouts.
- A locally exported, sanitized snapshot. The private Google Sheet is **not** published and no Google credentials are sent to the browser.

## Source and updates

The private Google Sheet remains the source of truth. This site is **not a live Sheet integration**. After changing the sheet, use an already-authorized local `gws` account:

```bash
export ITINERARY_SHEET_ID='your-private-sheet-id'
python3 scripts/sync_sheet.py
python3 -m unittest discover -s tests -v
node --check docs/app.js
node --check docs/data.js
git diff -- docs/data.js
# Review the PUBLIC snapshot for personal details before publishing.
git add docs/data.js
git commit -m 'content: refresh public itinerary'
git push
```

The exporter reads only the timetable and alternatives tabs, interprets vertically merged schedule cells, and blocks common payment/booking/email patterns. Always review the exported text: an automated pattern check cannot recognize every kind of personal information.

Never put OAuth credentials, private source snapshots, reservation references, payment details or personal contact information in this repository or GitHub Actions secrets for this static site. The repository and Pages deployment are publicly readable. `noindex` reduces discoverability; it is **not access control**.

## Local preview

```bash
python3 -m http.server 8000 --directory docs
```

Open `http://localhost:8000/` in a bot-owned isolated browser. No attachment to an existing human browser/profile is required.

## Deployment

GitHub Pages source: branch `main`, directory `/docs`. `.nojekyll` keeps the static site unprocessed. No server, build service or external data API is needed.

All itinerary times are in **Asia/Singapore (UTC+8)**. Sightseeing blocks are proposals unless explicitly confirmed. Airline/cruise check-in and boarding times must be checked against the original booking documents.
