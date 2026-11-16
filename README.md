# 싱가포르 여행 · 모바일 일정표

A lightweight, Korean, mobile-first itinerary for February 2027. Static HTML/CSS/JavaScript, with no runtime dependencies or third-party analytics.

## Features

- Swipeable date tabs, one-day timeline cards and an optional date × time overview.
- Fold-out alternatives clearly marked as **replacements**, not extra commitments.
- Google Maps search links; rest periods and unconfirmed operational timings have distinct labels.
- Keyboard-operable date tabs, reduced-motion support, sticky navigation and 320px+ responsive layouts.
- A locally exported, sanitized snapshot. The private Google Sheet is **not** published and no Google credentials are sent to the browser.

## Design and photographs

The interface was rebuilt with Humanizer for concise copy, Unslop for visual cleanup and Impeccable for layout, contrast, responsive review and design documentation. Unslop is by Damir Sokolovsky (@heydamir), CC BY 4.0. Design tokens live in `DESIGN.md`; the itinerary remains separate in `docs/data.js`.

The header uses a real Disney Adventure photograph. `docs/photos.js` selects eight date-specific photographs, served locally as WebP. Image origins, authors, licenses and changes are recorded in `PHOTOS.md`, `PHOTO_SOURCES.json`, embedded image metadata and provenance sidecars. Those records are not shown as captions in the itinerary. Photographs illustrate the day's theme; they are not evidence of future attendance or bookings. SUIT is self-hosted under its SIL Open Font License, bundled in `docs/assets/SUIT-LICENSE.txt`.

The later Disney-character pass adds six existing character illustrations, a navy/gold voyage header, Singapore-date countdown and clickable journey stages. Dates switch the companion together with the real daily photograph. Stitch appears by alternatives and Goofy in the footer. `CHARACTER_SOURCES.json` and per-asset sidecars retain provenance; WebP files also contain source metadata. These decorations do not confirm a character appearance or meeting. Character generation was attempted but blocked, so no generated character artwork is claimed or shipped. No runtime image hotlinks are used.

Additional checks: `node tests/countdown.test.js` checks Singapore midnight and trip-end boundaries. `tests/browser_checks.js`, `tests/photo_checks.js` and `tests/character_checks.js` run inside the isolated browser; character checks cover asset decoding, all eight date mappings, route controls, tap targets, decorative accessibility, overlap and reduced motion.

A further activity pass uses 28 reviewed, existing film scenes across all 30 event IDs, with 36 distinct normalized character names (generic unnamed friends and age variants are not counted separately). Flight, food preparation, rowing, underwater travel, painting, plants, clock checks and rest are matched explicitly. Where literal sleeping or suitcase-packing was not found, captions honestly describe bedtime family time, sitting/resting, transport preparation or walking with a bag. `ACTION_SOURCES.json` keeps origins, copyright context, source hashes, visual notes and the relationship to each itinerary event. Public availability is not asserted to be a free license or official permission. Scenes are locally encoded WebP, never generated artwork or hotlinked runtime requests.

`python3 scripts/build_actions.py /path/to/reviewed-local-curation.json` rebuilds the action assets after human visual review. `node tests/actions.test.js` verifies complete event coverage, scene diversity and activity bindings; `tests/action_checks.js` verifies decoding, responsive containment, preservation and error recovery in the isolated browser. Local source paths remain in the private curation input, not the public provenance export.

## Cruise plan evidence

The cruise update distinguishes verified ship offerings, the specific itinerary's official search index, dated secondary port-day mapping and our proposed family flow. The DA0137 index names a February 18–22, 2027 Langkawi cruise; dated secondary material places Langkawi on February 20, explicitly pending booking reconfirmation. The site no longer presents all three middle days as sea days. Ashore 11:00 and Aboard 21:00 are indexed port-access/deadline fields, not docking/departure or a family Port Arrival Time. See `CRUISE_SOURCES.json` for evidence levels and limitations.

The daypart plans for February 19–21 are **proposals**, not confirmed show slots. Family dining/theatre assignments, onboard reservations, safety/height conditions and any shore entry requirements remain to be checked in the booking and Navigator. No purchase or reservation was made. Only cruise cells/related notes were changed in the source sheet; unrelated itinerary days, alternatives and reservation records were read-back compared. The exporter now preserves the PAT label rather than inventing a boarding clock time and adds a content-hash cache version to `data.js` in `index.html`.

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
git add docs/data.js docs/index.html
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
