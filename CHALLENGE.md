
# Senior Angular Developer - Technical Challenge

## Overview

This challenge assesses your ability to work with existing Angular code—debugging, refactoring, and extending a real-world application. You'll work with a **Cultural Event Dashboard** that has some bugs and uses legacy patterns that need modernization.

**Time:** ~5-6 hours  
**Focus:** Quality over quantity. Complete what you can, document trade-offs.

**Please create a repository which can be shared with us.**

---

## Getting Started

```bash
npm install
npm start
```

The app runs at `http://localhost:4200`. Explore it first—create events, navigate around, use the filters, check the console.

---

## The Challenges

### Part 1: Bug Hunt

The application has **3 bugs**. Find and fix them.

Some things you might notice:

- Strange console output when navigating around
- UI elements that don't behave as expected
- Features that seem to work internally but don't reflect in the view

Use your debugging skills to identify what's wrong, understand why, and fix them properly using modern Angular patterns.

---

### Part 2: Refactor

The codebase contains some **legacy patterns** that should be modernized. Look for:

- Old template syntax that could use the new Angular control flow
- State management patterns that could benefit from signals
- Components using decorator-based inputs/outputs

Pick 1-2 areas to refactor and demonstrate your knowledge of modern Angular.

---

### Part 3: Architecture

All code currently lives in `apps/interview/`. This isn't ideal for a scalable monorepo.

**Your task:** Extract reusable code into the `libs/` folder following Nx library principles.

Consider:

- What should be shared vs. app-specific?
- How would you organize the libraries (by feature, by type, or both)?
- How do you enforce boundaries between libraries?

Use `nx generate` to create libraries properly. Document your architectural decisions.

---

### Part 4: Extend

Add a small feature of your choice. Ideas:

- Sorting functionality
- Debounced search
- Recently viewed events
- Accessibility improvements

---

## What We're Looking For

1. **Debugging Skills** — Can you identify and fix Angular-specific issues?
2. **Modern Angular** — Do you know the latest patterns (Signals, control flow, SignalStore)?
3. **Code Quality** — Is your code clean, typed, and maintainable?
4. **Monorepo Architecture** — Do you understand Nx library principles and boundaries?
5. **Problem Solving** — How do you approach unfamiliar code?

---

## Submission

1. Fix/refactor the code
2. Update this section with notes:

### Your Notes

### Part 1: Bug Hunt

   ## Bug 1: ountdown continues after navigating away from Event Detail

    - Issue:
        When navigating to the Event Detail page, a countdown timer starts correctly. However, after navigating back to the Event List page, the countdown continues logging in the console.

    - Root Cause: 
        The countdown was driven by a setInterval started inside the Event Detail component.
        Although ngOnDestroy was implemented, the component continued reacting to state updates because:
        selectedEvent$ was derived using combineLatest with the full events stream.
        When patchState was called elsewhere, selectedEvent$ re-emitted the previous event even after navigation.
        This caused startCountdown() to be triggered again unintentionally.

    - Fix:
         Ensured there is a single source of truth for selectedEvent in the store.
         Explicitly set selectedEventId to null on component destroy.

        Simplified selectedEvent$ so it depends only on selectedEventId, not on unrelated state updates.

        Ensured countdown logic is started only when a valid event is selected.

    - Result:
        Countdown stops immediately when leaving the Event Detail page, and no background console logs remain.

   ### Bug 2: Favorites are lost on page refresh

        - Issue:
                Clicking the favorite icon works during the session, but favorites disappear after a page refresh.

        - Root Cause:
                     Favorite state was stored inside the EventCardComponent as an in-memory Set.
                     Component state is destroyed on refresh, so favorites were never persisted.

        - Fix:
        Introduced a FavoriteService responsible for:
            Persisting favorite event IDs to localStorage
            Reading persisted favorites on app startup

        UI components now delegate favorite logic to this service instead of owning state.

        - Result: 
                Favorites persist across page refreshes and navigation, and state ownership is correctly separated from UI components.


### Part 2 Refactor Code:

    - Modern Template Control Flow

    Replaced legacy structural directives (*ngIf, *ngFor) with Angular’s new control flow syntax:

    @if, @for

    This improved template readability and aligns with Angular’s modern best practices.

    Modern Template Control Flow

Replaced legacy structural directives (*ngIf, *ngFor) with Angular’s new control flow syntax:

@if

@for

This improved template readability and aligns with Angular’s modern best practices.

Part 3: Architecture (Nx Monorepo)

To make the codebase scalable and align with Nx best practices, reusable code was extracted from apps/interview into libraries under libs/.
```
Library Structure
libs/
├─ shared/
│  ├─ components        # Reusable UI components (EventCard, EventFilter)
   |    ├─event-card
   |    ├─event-filter
  └─ data   # Pure utilities (mock data)
  └─ models
   └─ services
  └─ utilities
│
```
### Architectural Decisions

Models and utilities are framework-agnostic and shared across the app.
UI libraries expose presentational components only.
Library boundaries are enforced using Nx project configuration.

Part 4: Extension
Sorting & Debounced Search

Events are now sorted by event date, ensuring upcoming and current events appear first.

Implemented debounced search to reduce unnecessary filter updates and improve performance.

Search input updates filters only after a short delay, providing a smoother UX.

### Trade-offs & Future Improvements

The existing RxJS store was retained to keep the refactor focused and discussable.

 The store could be migrated to NgRx SignalStore for a fully signal-based state model.

```

3. Commit your changes with clear messages
4. Submit via [method TBD]

---

## Hints

- The console is your friend
- Angular DevTools browser extension can help
- Check `@angular/core/rxjs-interop` for useful utilities
- SignalStore docs: https://ngrx.io/guide/signals
- Run `nx list` to see available generators
- Run `nx generate @nx/angular:library --help` for library options

---

Good luck! 🎭



