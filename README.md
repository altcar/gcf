# Green Career Fair (Astro)

Visitor flow
- Register on `/index` with university details.
- A visitor QR is generated and shown on `/dashboard` (uses cookie login).
- Present QR at company booths to mark each visit.

Company flow
- Booth scanners live at `/company/mm` and `/company/bedesign` (and other routes under `/company`).
- Each scan posts to `/api/company` to mark a visitor as visited.

Chocolate counter
- Scan a visitor QR at `/chocolate` to verify all company visits.
- If completed, the counter sets `already = 1` to mark redemption.

Routes
- `/index` register (no login required)
- `/dashboard` QR card (cookie login)
- `/company/mm`, `/company/bedesign` company scanners
- `/chocolate` redemption scanner

Local camera access
- Chrome flag for insecure origins: `chrome://flags/#usafely-treat-insecure-origin-as-secure`

Setup (WSL)
- Install deps: `yarn install`
- Run dev server: `yarn dev`

Notes
- API endpoints live in `src/pages/api`
- Database creds are read from `.env`
