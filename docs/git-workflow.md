# quitt — Git Workflow

Rules for branches, commits and pull requests in https://github.com/Quitt-Project/Quitt.

## Core rules

1. `main` always works. Nobody pushes to `main` directly.
2. Every change gets its own branch, created from the latest `main`.
3. A branch gets into `main` only through a pull request (PR) with one approval.
4. One branch = one task. Keep branches small and short-lived (a few days at most).

## Branch names

Format: `type/area-short-description`

- lowercase, English, words separated by hyphens
- no spaces, no umlauts, no personal names
- 2 to 4 words in the description
- if there is a GitHub issue, put its number first: `feat/12-api-login`

### Types

| Type | Use for | Example |
|---|---|---|
| `feat` | new functionality | `feat/app-receipt-form` |
| `fix` | bug fix | `fix/api-login-token-expiry` |
| `docs` | documentation only | `docs/update-overview` |
| `chore` | setup, config, dependencies, Docker | `chore/docker-compose-postgres` |
| `refactor` | restructuring code without changing behaviour | `refactor/api-entry-models` |
| `test` | adding or fixing tests | `test/api-entries` |

### Areas

| Area | Meaning |
|---|---|
| `app` | mobile client (`app/`, React Native + Expo) |
| `api` | backend (`api/`, FastAPI) |
| `db` | database models and migrations |

Leave the area out when a change does not belong to one of them (for example `docs/...` or `chore/...`).

## Creating a branch

```bash
git checkout main
git pull
git checkout -b feat/app-receipt-form
```

Always pull `main` first, so the branch starts from the current state.

## Working on a branch

```bash
git add .
git commit -m "feat(app): add receipt form with amount and date"
git push -u origin feat/app-receipt-form
```

- Commit often, in small steps.
- Push at least once a day, so work is not only on one laptop.
- Never commit secrets: `.env` files, passwords and keys stay out of the repository.

### Commit messages

Format: `type(area): what changed`, in English, present tense, no full stop.

- `feat(api): add login endpoint`
- `fix(app): keep photo after rotating the phone`
- `docs: add git workflow`

## Keeping a branch up to date

If `main` has changed while you were working:

```bash
git checkout main
git pull
git checkout feat/app-receipt-form
git merge main
```

Resolve conflicts on your branch, test, then push. Ask a teammate if a conflict is unclear; do not guess.

## Pull requests

1. Push the branch and open a PR to `main` on GitHub.
2. Title in the same format as a commit message: `feat(app): add receipt form`.
3. Describe in 2 to 3 sentences what changed and how to test it. Add a screenshot for UI changes.
4. Ask one teammate for a review.
5. After approval, merge with "Squash and merge".
6. Delete the branch after the merge.

Not ready yet but want feedback? Open the PR as a draft.

### Review

- The reviewer runs the code or at least reads every changed file.
- Comments are about the code, not the person. Questions are welcome.
- Aim to review within one working day, so nobody is blocked.

## Do not

- push directly to `main`
- use `git push --force` on `main` or on someone else's branch
- mix several tasks in one branch
- leave a branch open for weeks
- work on a teammate's branch without asking

## Recommended GitHub settings for `main`

Set once under Settings → Branches (or Rules) in the repository:

- require a pull request before merging
- require 1 approval
- block force pushes
- automatically delete head branches after merge
