// Seed data from requirements/REQUIREMENTS.md §3 (prices) and §4 (sessions).
// This is the only place where classes, prices and initial availability are defined.
// It is never modified at runtime; current availability lives in app state.

const MAX_CAPACITY = 10;

const GYM_CLASSES = [
  {
    id: "yoga",
    name: "Yoga",
    pricePerParticipant: 8,
    sessions: [
      { id: "yoga-mon-1800", label: "Monday 18:00", initialAvailable: 10 },
      { id: "yoga-wed-1900", label: "Wednesday 19:00", initialAvailable: 6 },
      { id: "yoga-sat-1000", label: "Saturday 10:00", initialAvailable: 2 }
    ]
  },
  {
    id: "pilates",
    name: "Pilates",
    pricePerParticipant: 10,
    sessions: [
      { id: "pilates-tue-1800", label: "Tuesday 18:00", initialAvailable: 8 },
      { id: "pilates-thu-1900", label: "Thursday 19:00", initialAvailable: 4 },
      { id: "pilates-sat-1130", label: "Saturday 11:30", initialAvailable: 0 }
    ]
  },
  {
    id: "functional",
    name: "Functional Training",
    pricePerParticipant: 12,
    sessions: [
      { id: "functional-mon-1930", label: "Monday 19:30", initialAvailable: 5 },
      { id: "functional-wed-1800", label: "Wednesday 18:00", initialAvailable: 10 },
      { id: "functional-fri-1830", label: "Friday 18:30", initialAvailable: 3 }
    ]
  },
  {
    id: "spinning",
    name: "Spinning",
    pricePerParticipant: 11,
    sessions: [
      { id: "spinning-tue-1930", label: "Tuesday 19:30", initialAvailable: 7 },
      { id: "spinning-thu-1800", label: "Thursday 18:00", initialAvailable: 1 },
      { id: "spinning-sun-1000", label: "Sunday 10:00", initialAvailable: 10 }
    ]
  }
];
