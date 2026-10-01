# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Early stage. `src/index.html`, `src/app.js` and `src/styles.css` exist but are empty. The README mentions a `tests/` directory, but it hasn't been created yet. There is no package manager, build step, linter or test runner yet. Once one is added, document its commands here instead of guessing them.

The intended shape is a static, client-side web app (plain HTML/CSS/JS) that you open in a browser via `src/index.html`.

## Project rules (from README)

- `requirements/REQUIREMENTS.md` is the source of truth. Check behavior against it.
- Do not invent undocumented requirements or features.
- Application code belongs in `src/`, tests in `tests/`.

## Requirements that shape the architecture

These points come from REQUIREMENTS.md, and they constrain how the code should be built:

- **Client-side only.** No backend, database, external APIs, accounts, auth or payment (§17).
- **In-memory state only.** Confirmed reservations subtract from a session's remaining places for the life of the page. A refresh or reopen **must restore the initial availability** (§12). So don't persist availability to `localStorage`/`sessionStorage`.
- **Seed data is fixed.** There are 4 classes, each with a fixed price per participant (Yoga €8, Pilates €10, Functional Training €12, Spinning €11). Each class has 3 sessions with the initial availability listed in §4. Max capacity is 10, and Pilates Saturday 11:30 starts at 0 (full). Keep the data in one place so it can be checked against the BRD.
- **Validation rules (§8, §14).** Participants must be ≥ 1 and ≤ the session's remaining places. A full session can't be selected or reserved. Confirmation must be blocked while class, session or participants are missing or invalid, and the user must be shown why.
- **Flow (§5).** Choose class → session → participants → review summary (class, session, participants, price per participant, total = participants × price) → explicit confirm → confirmation view → "start another reservation". The new reservation resets the selections but keeps the reduced availability (§13). Selections stay editable until confirmation.
- **No personal data.** Reservations are anonymous, so never add name, email, phone or other input fields (§16).
- Session times are plain labels such as "Monday 18:00". Don't add date or calendar logic (§17).
