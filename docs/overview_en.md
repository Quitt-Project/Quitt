# quitt — Project Overview

Sources: Projekt-Pitch (November 2026), short idea description "Steuer-Sammler", "Funky Mockups".

German terms used in the app UI and in German tax language are kept in German.

## Idea

quitt — "Dein Steuer-Sammelordner für die Ausbildung". A mobile app that collects Belege (receipts), Fahrten (trips) and Fristen (deadlines) throughout the year, so everything is ready when the user does their Steuererklärung (tax return).

- Motto: "quitt sein"
- Four actions: Scannen, Sortieren, Erinnern, Exportieren
- Name: from "Quittung" (receipt) and "wir sind quitt" (we're even); working title during selection was Steuer-Sammler

## Problem

- Belege gehen verloren: receipts get lost, thrown away or fade
- Fristen & ELSTER sind Neuland: hardly anyone explains this during the Ausbildung
- Viele lassen es ganz sein: although a tax return can pay off even during the Ausbildung

## Target group

Azubis (apprentices). Persona from the pitch: Azubi Fachinformatiker, 1st year, 22 years old, commutes 25 km to the Betrieb, buys Fachbücher, has never filed a tax return.
Also: dual students and people starting their first job.

## Use cases

| When | What the user does |
|---|---|
| Nach dem Einkauf (after a purchase) | Takes a photo of the Beleg; it is sorted right away |
| Unterwegs zur Schule (on the way to school) | Logs a trip to the Berufsschule with one tap |
| Vor der Frist (before a deadline) | Gets a push reminder well ahead of the date |
| Bei der Abgabe (when filing) | Opens the overview and enters the data in ELSTER themselves |

## Core principle: Quitt sammelt — Quitt berät nicht

Quitt does:
- Scan and store Belege
- Sort by category
- Remind about Fristen
- Export an overview as PDF

Quitt deliberately does NOT:
- check whether an expense is deductible (absetzbar)
- calculate a refund (Erstattung)
- fill in or submit the tax return
- replace tax advice (Steuerberatung)

Reason: under § 2 StBerG, help in tax matters is only allowed for authorised persons.

How this is shown in the app:
- mandatory confirmation in the onboarding ("Quitt ist keine Steuerberatung")
- notice in the PDF export
- pointer to Lohnsteuerhilfeverein and Steuerberatung

## Scope and constraints

- Team project as part of the Ausbildung
- Team: 3 people, beginners with mixed levels
- Development time: 3 months

## Features by priority

### MUSS (core · project phase)

- Onboarding with notice (Hinweis)
- Scan and store a Beleg (the photo is kept as proof)
- Enter Betrag, Datum, Kategorie (manually)
- Filter and search Belege
- Push reminders for Fristen
- Export as PDF

Login in MUSS: email + password (JWT).

### SOLL (if time allows)

- OCR: recognise Betrag and Datum (the user checks and corrects)
- Fahrten-Schnellerfassung: quick logging of a Strecke (trip without a receipt, in km)
- Dark Mode
- Google login (added after email + password login works; not in the pitch)
- Possibly: export of all Belege as ZIP (shown in the Jahresübersicht mockup; not implemented for now)

### KANN (later extension)

- AI suggestion for the category
- Archive of several years

### Ideas outside the priority levels

- Calendar for other paperwork (Rundfunkbeitrag, contracts, renewing an ID)

## Categories

Fixed list, no user-defined categories in MUSS. German names appear only in the UI; the database stores English keys.

| Category (UI) | Key | What goes here | Unit |
|---|---|---|---|
| Arbeitsmittel | `work_equipment` | Laptop, USB-C hub, tools, safety shoes, stationery | € |
| Fachliteratur | `literature` | Fachbücher, study booklets, exam preparation | € |
| Fortbildung | `training` | Courses, certificates, exam fees | € |
| Fahrten | `trips` | Tickets (€) and, later, Strecken (km) | € / km |
| Sonstiges | `other` | Anything that fits none of the above | € |
| Ohne Kategorie | `uncategorized` | Not sorted yet; default when the user picks no category | € |

Sonstiges is a deliberate choice by the user; Ohne Kategorie means "not sorted yet".

Category names and hints must never promise that an expense is deductible: a category only sorts (Quitt berät nicht).

## Fahrten: two kinds of entries

| Kind | Example | What is stored | Priority |
|---|---|---|---|
| Beleg (`receipt`) | Bahnticket, monthly Deutschlandticket, Parkschein | Betrag (€), Datum, Foto, category Fahrten | MUSS |
| Strecke (`trip`) | 5 days to the Betrieb by own car or bike | distance in km, number of days, Datum, no photo | SOLL |

- A ticket or a receipt for a ticket is a normal Beleg with the category Fahrten. It is created with the camera button like any other Beleg.
- A Strecke is a trip without a receipt. It gets its own entry form (Fahrten-Schnellerfassung).
- The app collects both and does not decide what goes into the tax return.
- Display: in MUSS, Fahrten shows a euro total like the other categories. Once Strecke exists, it shows two numbers, e.g. "588 € Tickets · 612 km".

### Data model

One table for all entries with a `kind` field (`receipt` or `trip`):

- `kind = receipt`: `amount` is filled; `distance_km` and `days` are empty
- `kind = trip`: `distance_km` and `days` are filled; `amount` is empty

`kind` exists from the start with the default `receipt`, so adding Strecke later needs no database rework. The Belegliste shows both kinds in one list.

## The path through the app

1. Onboarding: confirm the notice
2. Collect all year: scan Belege, log Fahrten
3. Sorted automatically: by category and month
4. Reminder before the deadline: 6 weeks and 1 week ahead
5. Export the Jahresübersicht
6. Enter the data in ELSTER yourself: outside Quitt, the user decides

## Screens

| Screen | Content |
|---|---|
| Onboarding | "Bevor es losgeht": three points (sammelt & sortiert, erinnert, berät nicht), confirmation checkbox, "Los geht's" button |
| Übersicht / Start | Total for the year, number of Belege and Fahrten (km), categories, next Frist or reminder |
| Beleg scannen / erfassen | Receipt photo, Betrag and Datum fields, Kategorie selection, Notiz (optional), "Beleg speichern" |
| Belegliste | Search, category filters, year selector, list grouped by month, "Foto fehlt" badge |
| Fristen & Erinnerungen | List of deadlines, reminder toggles (6 Wochen / 1 Woche vor einer Frist, Monatlicher Belege-Check, Fahrten jeden Freitag eintragen), link to ELSTER |
| Jahresübersicht & Export | Totals per category, Fahrten in km, "PDF-Übersicht exportieren", "keine Steuerberatung" notice |

Bottom navigation: Start/Übersicht, Belege, camera button in the centre, Fristen, Profil.

The app does not calculate tax amounts: tickets are shown in euros as paid, Strecken in kilometres.

## Design

Not decided yet. The team builds the functional part first and decides on the visual design afterwards.

- For now, mockups are informational wireframes: they show screens, fields and flows, without visual design.
- Two visual directions exist as candidates for later: "Funky Mockups" (neo-brutal: lilac background, lime green and pink accents, thick black outlines) and the green variant from the pitch.

## Tech stack

| Part | Technologies |
|---|---|
| Frontend (App) | React Native + Expo, TypeScript, Expo Router, camera/scanner, OCR (SOLL), local push reminders (expo-notifications) |
| Backend (API) | Python + FastAPI, Pydantic validation, login via JWT (email + password), Google login (SOLL), PDF export (ReportLab) |
| Storage | PostgreSQL + SQLAlchemy, Docker Compose |

OCR is SOLL and is not touched for now. Where recognition runs (on the phone or on the server, e.g. with Tesseract) is decided when the team gets there.

## Plan B: web app

If the native app turns out to be too much work, only the frontend changes.

| | Native app (Expo) | Web app |
|---|---|---|
| Tech | React Native + Expo | React + Vite |
| Scanning Belege | Native scanner | Photo upload in the browser |
| Reminders | Reliable push notifications | Web push only as a home-screen app |
| Effort | medium | lower |
| Distribution | TestFlight / Expo Go | simply via link |
| Backend | FastAPI + PostgreSQL | same |

## Open questions

None at the moment.

## Deferred (decide later)

- OCR: where recognition runs (decide when starting SOLL)
- ZIP export: whether it becomes SOLL
- Visual design: after the functional part is done
