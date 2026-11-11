# quitt — Mockups

Informational wireframes for the quitt app: screens, fields and flows, without visual design.

Decision no. 22: function first, design later. These files show *what* is on a screen, not how it will look. The visual design is chosen after the functional part is done (candidates: "Funky", the green variant from the pitch).

## How to open

Each file is a standalone HTML page. Download or clone the repository and open the file in any browser (double-click is enough). No build step, no server, no installation.

## Screens

| File | Screen | Status |
|---|---|---|
| [FILE].html | Onboarding — notice and confirmation | [TO FILL IN] |
| [FILE].html | Übersicht / Start — year total, categories, next Frist | [TO FILL IN] |
| [FILE].html | Beleg erfassen — photo, Betrag, Datum, Kategorie, Notiz | [TO FILL IN] |
| [FILE].html | Belegliste — search, filters, list by month | [TO FILL IN] |
| [FILE].html | Fristen & Erinnerungen — deadlines and reminder toggles | [TO FILL IN] |
| [FILE].html | Jahresübersicht & Export — totals per category, PDF export | [TO FILL IN] |

Screens are described in `../overview.md`.

## Rules for these files

- One file per screen, named after the screen in lowercase English with hyphens (e.g. `beleg-erfassen.html`).
- Each file is self-contained: CSS inside the file, no external scripts, fonts or images, so it opens the same way for everyone.
- German UI terms (Beleg, Betrag, Datum, Frist) stay in German, as in the app.
- Changes go through a pull request like code, on a branch such as `docs/mockups-belegliste`.

## Older versions

- "Funky Mockups" (neo-brutal, lilac/lime/pink): a design candidate, not the current wireframes.
- The green mockups from `../Quitt-Pitch.pdf`: the version shown in the pitch.
