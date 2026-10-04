// Business rules for reservations (REQUIREMENTS.md §8, §9, §12, §14).
// Pure functions only: no DOM access, no storage. Depends on data.js.

// Builds a fresh map of sessionId -> remaining places from the seed data.
// Called on every page load, so a refresh restores the initial availability (§12).
function createInitialAvailability() {
  const availability = {};
  GYM_CLASSES.forEach(function (gymClass) {
    gymClass.sessions.forEach(function (session) {
      availability[session.id] = session.initialAvailable;
    });
  });
  return availability;
}

function findClass(classId) {
  return GYM_CLASSES.find(function (gymClass) {
    return gymClass.id === classId;
  }) || null;
}

// Only returns the session if it belongs to the given class.
function findSession(classId, sessionId) {
  const gymClass = findClass(classId);
  if (!gymClass) {
    return null;
  }
  return gymClass.sessions.find(function (session) {
    return session.id === sessionId;
  }) || null;
}

function getRemaining(availability, sessionId) {
  return availability[sessionId] || 0;
}

function isFull(availability, sessionId) {
  return getRemaining(availability, sessionId) <= 0;
}

// Turns the raw participant input into a whole number, or null if it is not one
// (empty text, letters, decimals such as "2.5").
function parseParticipants(raw) {
  const text = String(raw).trim();
  if (!/^-?\d+$/.test(text)) {
    return null;
  }
  return Number(text);
}

function calculateTotal(participants, pricePerParticipant) {
  return participants * pricePerParticipant;
}

function formatPrice(amount) {
  return "€" + amount;
}

// Returns a list of reasons why the reservation cannot be confirmed.
// An empty list means the reservation is valid (§14).
// state: { availability, selectedClassId, selectedSessionId, participants }
function validateReservation(state) {
  const errors = [];
  const gymClass = findClass(state.selectedClassId);
  const session = gymClass ? findSession(state.selectedClassId, state.selectedSessionId) : null;

  if (!gymClass) {
    errors.push("Please choose a class.");
  }
  if (!session) {
    errors.push("Please choose a session.");
  }

  const remaining = session ? getRemaining(state.availability, session.id) : 0;
  if (session && remaining <= 0) {
    errors.push("This session is full. Please choose another session.");
  }

  const participantsError = validateParticipants(state.participants, remaining);
  if (participantsError) {
    errors.push(participantsError);
  }

  return errors;
}

// Checks only the participant count. Returns an error message, or null if it is valid.
// remaining is 0 when no session (or a full session) is selected; the upper limit
// is then not checked here, because the session errors already block confirmation.
function validateParticipants(raw, remaining) {
  const participants = parseParticipants(raw);
  if (participants === null) {
    return "Enter a whole number of participants.";
  }
  if (participants < 1) {
    return "At least 1 participant is required.";
  }
  if (remaining > 0 && participants > remaining) {
    return remaining === 1
      ? "Only 1 place remains in this session."
      : "Only " + remaining + " places remain in this session.";
  }
  return null;
}

// Validates and, if valid, returns the updated availability and a snapshot of
// what was reserved. Does not modify the given state.
function confirmReservation(state) {
  const errors = validateReservation(state);
  if (errors.length > 0) {
    return { ok: false, errors: errors };
  }

  const gymClass = findClass(state.selectedClassId);
  const session = findSession(state.selectedClassId, state.selectedSessionId);
  const participants = parseParticipants(state.participants);

  const availability = Object.assign({}, state.availability);
  availability[session.id] = availability[session.id] - participants;

  return {
    ok: true,
    availability: availability,
    reservation: {
      className: gymClass.name,
      sessionLabel: session.label,
      participants: participants,
      pricePerParticipant: gymClass.pricePerParticipant,
      total: calculateTotal(participants, gymClass.pricePerParticipant),
      remainingAfter: availability[session.id]
    }
  };
}
