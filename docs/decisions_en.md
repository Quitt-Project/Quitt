# quitt — Decision Log

Rule: one decision per row. New decisions are added at the bottom. If a decision changes, the old one is not deleted but marked "replaced by no. …".

Dates below are approximate (November 2026); correct them if you know the exact ones.

| No. | Date | Decision | Why | Status |
|---|---|---|---|---|
| 1 | 11.2026 | Project topic: Steuer-Sammler (receipts for Werbungskosten) | Useful for Azubis, related to the Ausbildung; chosen over Prüfungs-Trainer, Zeitfinder, Berichtsheft, Spritpreis-Dashboard | active |
| 2 | 11.2026 | Name: quitt | "Quittung" + "wir sind quitt" | active (informal) |
| 3 | 11.2026 | Native mobile app with React Native + Expo (TypeScript, Expo Router) | The app photographs receipts, so the phone camera is the main scenario | active |
| 4 | 11.2026 | Backend: Python + FastAPI + Pydantic | [TO FILL IN] | active |
| 5 | 11.2026 | Database: PostgreSQL / SQLite via SQLAlchemy | [TO FILL IN] | replaced by no. 19 |
| 6 | 11.2026 | Authentication: JWT (email + password); Google login as an option | [TO FILL IN] | replaced by no. 23 |
| 7 | 11.2026 | Run everything with Docker Compose | [TO FILL IN] | active |
| 8 | 11.2026 | Features are split into MUSS / SOLL / KANN; the core version works without OCR | Each level automates a step that was manual on the previous one; MUSS is realistic within 3 months | active |
| 9 | 11.2026 | MUSS: onboarding with notice, scan and store a Beleg, enter Betrag/Datum/Kategorie, filter and search Belege, push reminders for Fristen, export as PDF | Fixed in the Projekt-Pitch | active |
| 10 | 11.2026 | SOLL: OCR, Fahrten-Schnellerfassung, Dark Mode (Google login added to SOLL by no. 23). KANN: AI category suggestion, archive of several years | The app works without them | active |
| 11 | 11.2026 | Quitt sammelt, berät nicht: it does not check deductibility, calculate a refund, or fill in the tax return | § 2 StBerG: help in tax matters is only allowed for authorised persons | active |
| 12 | 11.2026 | The "keine Steuerberatung" notice is shown in the onboarding (mandatory confirmation) and in the PDF export; we point to Lohnsteuerhilfeverein and Steuerberatung | So the limitation is visible to the user | replaced by no. 24 |
| 13 | 11.2026 | Reminders: local push via expo-notifications | [TO FILL IN] | active |
| 14 | 11.2026 | PDF export is done by the backend (ReportLab) | [TO FILL IN] | active |
| 15 | 11.2026 | Plan B: web app with React + Vite, backend unchanged (FastAPI + PostgreSQL) | If the native app turns out to be too much work; easier to develop and to share via link | fallback |
| 16 | 10.11.2026 | Six fixed categories: Arbeitsmittel, Fachliteratur, Fortbildung, Fahrten, Sonstiges, Ohne Kategorie. English keys in the database: `work_equipment`, `literature`, `training`, `trips`, `other`, `uncategorized` | Fachliteratur (books) and Fortbildung (courses, exams) mean different things, so both stay; Ohne Kategorie is the default for entries not sorted yet | active |
| 17 | 10.11.2026 | Fahrten has two kinds of entries: a ticket or its receipt is a normal Beleg with the category Fahrten (MUSS); a Strecke in km without a receipt is the Fahrten-Schnellerfassung (SOLL) | Tickets have an amount and a photo like any Beleg; MUSS needs no extra form | active |
| 18 | 10.11.2026 | One table for all entries with a `kind` field (`receipt` or `trip`): `amount` is filled for receipts, `distance_km` and `days` for trips. `kind` exists from the start, default `receipt` | Simpler for beginners than two tables; the Belegliste shows everything in one list; no rework when Strecke is added | active |
| 19 | 10.11.2026 | Database: PostgreSQL with SQLAlchemy, run via Docker Compose. SQLite is dropped | [TO FILL IN] | active |
| 20 | 10.11.2026 | OCR stays SOLL and is not touched for now; where recognition runs is decided when SOLL starts | Focus on MUSS first | active |
| 21 | 10.11.2026 | ZIP export is not implemented for now; possibly SOLL later | Not part of MUSS | active |
| 22 | 10.11.2026 | Function first, design later. Until then, mockups are informational wireframes without visual design | The functional part has priority; the visual design is chosen afterwards | active |
| 23 | 10.11.2026 | Authentication: email + password with JWT is MUSS; Google login is SOLL and is added after email + password login works | Google login needs extra setup (Google Cloud, token check on the backend); the rest of the app should not wait for it | active |
| 24 | 11.11.2026 | The "keine Steuerberatung" notice is shown in the onboarding (mandatory confirmation) and in the exported PDF file. It is not repeated on other app screens (Jahresübersicht & Export, Profil). The pointer to Lohnsteuerhilfeverein and Steuerberatung is part of the notice in the PDF; the app screens have no separate links | The user confirms the notice before using the app, and the PDF carries it wherever the file ends up; the other screens stay simple | active |

## Not decided yet

- Final visual design (after the functional part; candidates: Funky, green from the pitch)
- Reasons for decisions 4, 7, 13, 14 and 19 ([TO FILL IN])
