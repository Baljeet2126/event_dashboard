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

_Document what you found, what you fixed, any trade-offs, and what you'd do with more time:_

```
[Your notes here]
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
