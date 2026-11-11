# quitt — Arbeiten mit GitHub Project und Issues

Nov 11, 2026 · @Daryna

## Überblick

Jede Aufgabe ist ein Issue, und jedes Issue liegt als Karte auf dem Board. So sieht das ganze Team, wer gerade woran arbeitet.

| Was | Wofür | Wo |
| --- | --- | --- |
| Issue | eine Aufgabe oder ein Fehler | [Quitt → Issues](https://github.com/Quitt-Project/Quitt/issues) |
| Label | Priorität und Bereich eines Issues | am Issue, rechte Seitenleiste |
| Board (Project) | Stand aller Aufgaben in Spalten | [Quitt-Project → Projects → quitt](https://github.com/orgs/Quitt-Project/projects) |
| Pull Request (PR) | bringt den Code einer Aufgabe nach `main` | [Quitt → Pull requests](https://github.com/Quitt-Project/Quitt/pulls) |

Regeln für Branches, Commits und PRs stehen in `git-workflow.md`.

## Spalten des Boards

Eine Karte wandert von links nach rechts. Die Spalte zeigt, was gerade mit der Aufgabe passiert.

| Spalte | Bedeutung |
| --- | --- |
| Todo | geplant, noch nicht begonnen |
| In progress | jemand arbeitet daran und ist als Assignee eingetragen |
| In review | PR ist offen und wartet auf ein Review |
| Done | PR ist gemergt, Issue ist geschlossen |

## Labels

Jedes Issue bekommt genau ein Prioritäts-Label und mindestens ein Bereichs-Label.

| Label | Art | Bedeutung |
| --- | --- | --- |
| `muss` | Priorität | Kernfunktion, muss in der Projektphase fertig werden |
| `soll` | Priorität | geplant, wenn nach MUSS noch Zeit bleibt |
| `kann` | Priorität | spätere Erweiterung, aktuell nicht geplant |
| `app` | Bereich | Mobile Client (React Native + Expo) |
| `api` | Bereich | Backend (FastAPI) |
| `db` | Bereich | Datenbankmodelle und Migrationen |
| `docs` | Bereich | nur Dokumentation |

## Issue anlegen

Ein Issue beschreibt genau eine Aufgabe, die in wenigen Tagen fertig wird. Größere Aufgaben werden in mehrere Issues geteilt.

1. Im Repository **Issues → New issue** öffnen.
2. Titel auf Englisch, kurz und konkret: `Add login endpoint`, nicht `Login`.
3. Beschreibung in 2 bis 4 Sätzen: was gebaut wird und woran man erkennt, dass es fertig ist.
4. Rechts **Labels** setzen: eine Priorität und ein Bereich.
5. Rechts **Assignees** setzen, sobald klar ist, wer die Aufgabe übernimmt.
6. **Create** klicken. Das Issue erscheint automatisch auf dem Board in **Todo**.

Vorlage für die Beschreibung:

```markdown
## What
Short description of the task.

## Done when
- [ ] first condition
- [ ] second condition
```

Fehler bekommen ebenfalls ein Issue. In die Beschreibung gehören die Schritte zum Nachstellen und, was stattdessen erwartet wurde.

## Ablauf einer Aufgabe

Beispiel: Issue #12 „Add login endpoint“.

1. **Aufgabe nehmen.** Issue öffnen, sich selbst als Assignee eintragen und die Karte nach **In progress** ziehen.
2. **Branch anlegen.** Vom aktuellen `main`, mit der Issue-Nummer im Namen:

   ```bash
   git checkout main
   git pull
   git checkout -b feat/12-api-login
   ```
3. **Arbeiten.** In kleinen Schritten committen und mindestens einmal am Tag pushen.
4. **PR öffnen.** Titel wie eine Commit-Nachricht: `feat(api): add login endpoint`. In die Beschreibung gehört die Zeile `Closes #12`, damit PR und Issue verknüpft sind.
5. **Review anfragen.** Rechts unter **Reviewers** eine Person auswählen und die Karte nach **In review** ziehen.
6. **Mergen.** Nach der Freigabe **Squash and merge** klicken. Das Issue schließt sich von selbst und die Karte wandert nach **Done**.

Noch nicht fertig, aber Feedback gewünscht? Den PR als **Draft** öffnen; die Karte bleibt in **In progress**.

## Was automatisch passiert

Vier Schritte erledigt das Board selbst; nur **In progress** und **In review** werden von Hand gesetzt.

| Auslöser | Ergebnis |
| --- | --- |
| neues Issue oder neuer PR im Repository | Karte erscheint auf dem Board |
| Karte kommt neu aufs Board | Status **Todo** |
| Issue wird geschlossen | Status **Done** |
| PR wird gemergt | Status **Done** |

Diese Regeln stehen im Board unter **Workflows** (oben rechts).

## Kurzregeln

- Keine Arbeit ohne Issue: erst das Issue, dann der Branch.
- Ein Issue = ein Branch = ein PR.
- Jedes Issue in **In progress** hat genau eine verantwortliche Person.
- Höchstens ein bis zwei eigene Karten gleichzeitig in **In progress**.
- Erst `muss`, dann `soll`, dann `kann`.
- Karten in **In review** haben Vorrang: Review innerhalb eines Arbeitstags.
- Wer nicht weiterkommt, schreibt einen Kommentar ins Issue und sagt im Team Bescheid.
