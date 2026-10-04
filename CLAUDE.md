# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

A static, client-side web app (plain HTML/CSS/vanilla JS). There is no package manager, build step or linter, and Node.js is not installed.

- **Run the app:** open `src/index.html` in a browser (double-clicking it works).
- **Run the automated tests:** open `tests/test.html` in a browser. It shows "N / N checks passed". Headless alternative: `msedge --headless --dump-dom file:///<path>/tests/test.html` and look for the summary line.
- **Manual tests:** `tests/test-cases.md` lists the BRD scenarios (TC-xx) to click through.

## Code structure

Scripts are classic `<script>` tags, not ES modules (modules don't load from `file://`). They share globals and must load in this order: `data.js` → `reservation.js` → `app.js`.

- `src/data.js`: the BRD seed data (`GYM_CLASSES`, `MAX_CAPACITY`). The only place where classes, prices and sessions are defined.
- `src/reservation.js`: pure business rules (availability, parsing, validation, total, confirm). No DOM access. This is what `tests/test.html` tests.
- `src/app.js`: holds the in-memory `state`. Event handlers update `state` and then call `render()`, which redraws the page from `state`.
- `src/styles.css`: all styling.

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
