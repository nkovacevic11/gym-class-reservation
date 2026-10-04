# Prompts

A chronological record of the prompts given to Claude Code in this session. New prompts are appended at the end.

---

## Prompt 1: Analyze the BRD and propose an implementation plan

```text
I want you to analyze the Business Requirements Document before we start implementing the application.

Read and analyze:

requirements/requirements.md

For this task, do NOT create, modify, or delete any application source files. Do not start implementing the application yet.

The application should be implemented as a small client-side web application using:

HTML
CSS
Vanilla JavaScript
No framework unless you identify a strong reason that one is necessary
No backend
No database
No external APIs

Based on the BRD, provide an implementation plan and proposed solution.

Please analyze the requirements carefully and cover the following:

Requirements understanding
Summarize the main business flow.
Identify the important business rules.
Identify validation rules and edge cases.
Identify what is explicitly in scope and out of scope.
Application structure
Propose a simple project/file structure for the HTML, CSS, and JavaScript application.
Explain the responsibility of each proposed file.
Keep the structure simple and appropriate for a small beginner-friendly project.
Application state
Explain what application state is needed.
Explain how classes, sessions, selected participants, reservation state, and availability should be represented.
Explain how availability should persist while the browser session is open.
Explain how the initial availability should be restored after a page refresh or reopening the application.
User flow
Describe the expected user flow step by step:
selecting a class;
selecting a session;
selecting participants;
reviewing the reservation;
confirming the reservation;
displaying confirmation;
starting another reservation.
Validation
Identify all validations that should be implemented based on the BRD.
Include boundary cases such as:
1 participant;
maximum available participants;
zero available places;
attempting to reserve more places than available;
incomplete selections.

UI proposal
Propose a simple UI structure that allows a reviewer to easily understand and test the reservation flow.

Do not over-design the application. Focus on clarity and usability.

If you suggest UI improvements, follow my instruction from CLAUDE.local.md and provide exactly four suggestions numbered:

UI-1
UI-2
UI-3
UI-4
JavaScript design
Propose the main JavaScript functions/modules that would be useful.
For each important function, explain its responsibility in simple terms.
Testing strategy
Propose representative test cases that a reviewer could use to verify the BRD.
Focus on business behavior rather than implementation details.
Potential ambiguities or risks
Identify anything in the BRD that could be interpreted in more than one way or that we should decide before implementation.
Recommended implementation approach
Give me your recommended solution for implementing this application with HTML, CSS, and Vanilla JavaScript.

At the end, provide:

Recommended project structure
Recommended application architecture
Main implementation steps in order
Any decisions that should be made before coding

Important:

Do not modify any files.
Do not write the application code yet.
Do not install dependencies.
Do not create additional requirements unless you identify a genuine ambiguity.
Base the analysis primarily on requirements/requirements.md.
Treat the BRD as the source of truth for business behavior.
Keep the proposed solution simple and appropriate for a small demonstration application.
Explain your reasoning in a beginner-friendly way because I am using this project to learn how to work with Claude Code.
```

---

## Prompt 2: Start implementation

```text
start with implementation
```

---

## Prompt 3: Create a prompt log

```text
Create a PROMPTS.md file in the project root.

Use it to keep a chronological record of all prompts I give you during this Claude Code session.

For each prompt, add:

prompt number
short title
the complete prompt text

Append new prompts instead of replacing previous ones.

Do not include Claude's responses, system instructions, or hidden context.
```
