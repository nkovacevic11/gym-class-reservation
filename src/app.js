// UI layer: reacts to user input, updates state, and redraws the page from state.
// Business rules live in reservation.js; seed data lives in data.js.

// All state is kept in memory only (no localStorage), so a page refresh
// recreates it from the seed data and restores the initial availability (§12).
const state = {
  availability: createInitialAvailability(),
  selectedClassId: null,
  selectedSessionId: null,
  participants: "1",
  lastReservation: null,
  view: "form" // "form" or "confirmation"
};

const elements = {
  form: document.getElementById("reservation-form"),
  classList: document.getElementById("class-list"),
  sessionHint: document.getElementById("session-hint"),
  sessionList: document.getElementById("session-list"),
  participantsInput: document.getElementById("participants"),
  participantsHint: document.getElementById("participants-hint"),
  participantsError: document.getElementById("participants-error"),
  summaryDetails: document.getElementById("summary-details"),
  validationMessages: document.getElementById("validation-messages"),
  confirmButton: document.getElementById("confirm-button"),
  confirmation: document.getElementById("confirmation"),
  confirmationHeading: document.getElementById("confirmation-heading"),
  confirmationDetails: document.getElementById("confirmation-details"),
  startAnotherButton: document.getElementById("start-another-button")
};

// --- Event handlers: update state, then redraw ---

function onClassSelected(classId) {
  if (classId !== state.selectedClassId) {
    state.selectedClassId = classId;
    // The previous session belongs to another class, so it is cleared.
    state.selectedSessionId = null;
  }
  render();
}

function onSessionSelected(sessionId) {
  state.selectedSessionId = sessionId;
  render();
}

function onParticipantsChanged(value) {
  state.participants = value;
  render();
}

function onConfirm() {
  const result = confirmReservation(state);
  if (!result.ok) {
    // The button is disabled when invalid, but validation is re-run as a safety check.
    render();
    return;
  }
  state.availability = result.availability;
  state.lastReservation = result.reservation;
  state.view = "confirmation";
  render();
  elements.confirmationHeading.focus();
}

function onStartAnother() {
  // Selections are reset; availability is kept (§13).
  state.selectedClassId = null;
  state.selectedSessionId = null;
  state.participants = "1";
  state.lastReservation = null;
  state.view = "form";
  render();
  window.scrollTo(0, 0);
}

// --- Rendering ---

function render() {
  const showConfirmation = state.view === "confirmation";
  elements.form.hidden = showConfirmation;
  elements.confirmation.hidden = !showConfirmation;

  if (showConfirmation) {
    renderConfirmation();
    return;
  }

  // Rebuilding the radio lists would lose keyboard focus, so remember it.
  const focusedId = document.activeElement ? document.activeElement.id : null;

  renderClasses();
  renderSessions();
  renderParticipants();
  renderSummary();

  if (focusedId) {
    const focused = document.getElementById(focusedId);
    if (focused && focused !== document.activeElement) {
      focused.focus();
    }
  }
}

function renderClasses() {
  elements.classList.innerHTML = "";
  GYM_CLASSES.forEach(function (gymClass) {
    const option = createRadioOption({
      id: "class-" + gymClass.id,
      name: "gym-class",
      checked: gymClass.id === state.selectedClassId,
      disabled: false,
      title: gymClass.name,
      detail: formatPrice(gymClass.pricePerParticipant) + " per participant",
      onSelect: function () {
        onClassSelected(gymClass.id);
      }
    });
    elements.classList.appendChild(option);
  });
}

function renderSessions() {
  elements.sessionList.innerHTML = "";
  const gymClass = findClass(state.selectedClassId);

  if (!gymClass) {
    elements.sessionHint.textContent = "Choose a class first to see its sessions.";
    return;
  }
  elements.sessionHint.textContent = "Sessions for " + gymClass.name + " (maximum " + MAX_CAPACITY + " places each):";

  gymClass.sessions.forEach(function (session) {
    const remaining = getRemaining(state.availability, session.id);
    const full = isFull(state.availability, session.id);
    const option = createRadioOption({
      id: "session-" + session.id,
      name: "session",
      checked: session.id === state.selectedSessionId,
      disabled: full,
      title: session.label,
      detail: full ? "No places left" : remaining + " of " + MAX_CAPACITY + " places left",
      badge: availabilityBadge(remaining),
      onSelect: function () {
        onSessionSelected(session.id);
      }
    });
    elements.sessionList.appendChild(option);
  });
}

function renderParticipants() {
  const input = elements.participantsInput;
  // Only overwrite the field when it differs, so typing is not interrupted.
  if (input.value !== state.participants) {
    input.value = state.participants;
  }

  const session = findSession(state.selectedClassId, state.selectedSessionId);
  const remaining = session ? getRemaining(state.availability, session.id) : 0;

  if (!session) {
    input.removeAttribute("max");
    elements.participantsHint.textContent = "Choose a session to see how many places you can reserve.";
  } else if (remaining <= 0) {
    input.removeAttribute("max");
    elements.participantsHint.textContent = "This session is full.";
  } else {
    input.max = remaining;
    elements.participantsHint.textContent = remaining === 1
      ? "You can reserve 1 place."
      : "You can reserve 1–" + remaining + " places.";
  }

  const error = validateParticipants(state.participants, remaining);
  elements.participantsError.textContent = error || "";
  elements.participantsError.hidden = !error;
  input.classList.toggle("is-invalid", Boolean(error));
  input.setAttribute("aria-invalid", error ? "true" : "false");
}

function renderSummary() {
  const gymClass = findClass(state.selectedClassId);
  const session = findSession(state.selectedClassId, state.selectedSessionId);
  const remaining = session ? getRemaining(state.availability, session.id) : 0;
  const participantsValid = validateParticipants(state.participants, remaining) === null;
  const participants = parseParticipants(state.participants);

  renderDetails(elements.summaryDetails, [
    ["Class", gymClass ? gymClass.name : "—"],
    ["Session", session ? session.label : "—"],
    ["Participants", participantsValid ? String(participants) : "—"],
    ["Price per participant", gymClass ? formatPrice(gymClass.pricePerParticipant) : "—"],
    ["Total price", gymClass && participantsValid
      ? formatPrice(calculateTotal(participants, gymClass.pricePerParticipant))
      : "—"]
  ]);

  const errors = validateReservation(state);
  elements.validationMessages.innerHTML = "";

  if (errors.length === 0) {
    const ready = document.createElement("p");
    ready.className = "ready";
    ready.textContent = "Everything looks good. Check the details above and confirm.";
    elements.validationMessages.appendChild(ready);
  } else {
    const heading = document.createElement("p");
    heading.className = "validation-title";
    heading.textContent = "You can't confirm yet:";
    const list = document.createElement("ul");
    errors.forEach(function (message) {
      const item = document.createElement("li");
      item.textContent = message;
      list.appendChild(item);
    });
    elements.validationMessages.appendChild(heading);
    elements.validationMessages.appendChild(list);
  }

  elements.confirmButton.disabled = errors.length > 0;
}

function renderConfirmation() {
  const reservation = state.lastReservation;
  renderDetails(elements.confirmationDetails, [
    ["Class", reservation.className],
    ["Session", reservation.sessionLabel],
    ["Participants", String(reservation.participants)],
    ["Price per participant", formatPrice(reservation.pricePerParticipant)],
    ["Total price", formatPrice(reservation.total)],
    ["Places left in this session", String(reservation.remainingAfter)]
  ]);
}

// --- Small DOM helpers ---

// Builds one selectable option: a native radio input wrapped in a label.
function createRadioOption(options) {
  const label = document.createElement("label");
  label.className = "option";
  if (options.checked) {
    label.classList.add("is-selected");
  }
  if (options.disabled) {
    label.classList.add("is-disabled");
  }

  const input = document.createElement("input");
  input.type = "radio";
  input.id = options.id;
  input.name = options.name;
  input.checked = options.checked;
  input.disabled = options.disabled;
  input.addEventListener("change", options.onSelect);

  const text = document.createElement("span");
  text.className = "option-text";
  const title = document.createElement("span");
  title.className = "option-title";
  title.textContent = options.title;
  const detail = document.createElement("span");
  detail.className = "option-detail";
  detail.textContent = options.detail;
  text.appendChild(title);
  text.appendChild(detail);

  label.appendChild(input);
  label.appendChild(text);

  if (options.badge) {
    const badge = document.createElement("span");
    badge.className = "badge " + options.badge.className;
    badge.textContent = options.badge.text;
    label.appendChild(badge);
  }
  return label;
}

function availabilityBadge(remaining) {
  if (remaining <= 0) {
    return { text: "Full", className: "badge-full" };
  }
  if (remaining <= 2) {
    return { text: "Few left", className: "badge-few" };
  }
  return { text: "Available", className: "badge-available" };
}

// Fills a <dl> with label/value rows.
function renderDetails(container, rows) {
  container.innerHTML = "";
  rows.forEach(function (row) {
    const term = document.createElement("dt");
    term.textContent = row[0];
    const value = document.createElement("dd");
    value.textContent = row[1];
    container.appendChild(term);
    container.appendChild(value);
  });
}

// --- Start ---

function init() {
  elements.participantsInput.addEventListener("input", function (event) {
    onParticipantsChanged(event.target.value);
  });
  elements.confirmButton.addEventListener("click", onConfirm);
  elements.startAnotherButton.addEventListener("click", onStartAnother);
  render();
}

init();
