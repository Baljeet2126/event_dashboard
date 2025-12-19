# Angular Interview Challenge

A technical challenge for Senior Angular Developer candidates focused on debugging, refactoring, and working with existing code in an Nx monorepo.

## For Candidates

**Start here: [CHALLENGE.md](./CHALLENGE.md)**

This challenge includes:

- A working Cultural Event Dashboard application
- Several intentional bugs to find and fix
- Legacy code patterns to modernize
- Architecture improvements using Nx libraries
- Optional features to extend

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# See available Nx generators
nx list
```

The application will be available at `http://localhost:4200`

## Project Structure

```
apps/
  interview/src/app/     # Main application (to be refactored)
    ├── components/
    ├── data/
    ├── models/
    ├── pages/
    ├── services/
    └── store/
libs/                    # Shared libraries (create these!)
```

## Technology Stack

- **Angular**: 21.0.4
- **TypeScript**: 5.9.x
- **Nx**: 22.2.0
- **RxJS**: 7.8.x
- **Testing**: Vitest + Playwright

---

Good luck! 🎭
