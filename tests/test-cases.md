# Manual test cases

Open `src/index.html` in a browser (double-click is fine) and run each case.
**Refresh the page before each case**, unless the case says otherwise, so you start from the initial availability in REQUIREMENTS.md §4.

| ID | BRD | Steps | Expected result |
|---|---|---|---|
| TC-01 | §3 | Open the app | 4 classes: Yoga €8, Pilates €10, Functional Training €12, Spinning €11 (per participant) |
| TC-02 | §4, §7 | Select each class in turn | Each shows its 3 sessions with day/time and the places left from §4 |
| TC-03 | §4, §7 | Select Pilates | Saturday 11:30 shows "Full" / "No places left" and cannot be selected |
| TC-04 | §14 | Open the app and select nothing | Confirm button disabled; message "Please choose a class." and "Please choose a session." |
| TC-05 | §14 | Select Yoga only | Confirm disabled; message "Please choose a session." |
| TC-06 | §8, §9 | Yoga → Wednesday 19:00 → 1 participant | No errors; total €8; Confirm enabled |
| TC-07 | §8, §9 | Yoga → Wednesday 19:00 → 6 participants | No errors; total €48; Confirm enabled |
| TC-08 | §8, §14 | Yoga → Wednesday 19:00 → 7 participants | Field highlighted; "Only 6 places remain in this session."; Confirm disabled |
| TC-09 | §8, §14 | Yoga → Monday 18:00, then enter 0, -1, empty, 2.5 | Each value shows an error and Confirm stays disabled |
| TC-10 | §11, §12, §13 | Yoga → Wednesday 19:00 → 2 → Confirm | Confirmation shows Yoga, Wednesday 19:00, 2, €8, €16, 4 places left. Click "Start another reservation", select Yoga: Wednesday 19:00 shows 4 of 10 places left |
| TC-11 | §4, §12, §13 | Spinning → Thursday 18:00 → 1 → Confirm → Start another → Spinning | Thursday 18:00 now shows "Full" and cannot be selected |
| TC-12 | §8, §14 | Functional Training → Wednesday 18:00 → 5, then switch to Friday 18:30 | "Only 3 places remain in this session."; Confirm disabled |
| TC-13 | §5, §6 | Yoga → Monday 18:00, then select Pilates | Session selection cleared; Pilates sessions shown; "Please choose a session." |
| TC-14 | §12 | Do TC-10, then refresh the page and select Yoga | Wednesday 19:00 is back to 6 of 10 places left |
| TC-15 | §16 | Look through the whole app | No fields for name, email, phone, address, account or payment |
| TC-16 | §9 | Functional Training → Monday 19:30 → 3 | Total €36 |
| TC-17 | §12, §13 | Yoga → Wednesday 19:00 → 2 → Confirm → Start another → Yoga → Wednesday 19:00 → 4 → Confirm → Start another → Yoga | Wednesday 19:00 shows "Full" (6 − 2 − 4 = 0) |
| TC-18 | §10 | Make a valid selection, then change class, session or participants | Summary updates immediately; nothing is reserved until Confirm is clicked |
