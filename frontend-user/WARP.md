# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This repo is a minimal React + Vite frontend (`hotel-booking-user-fe`) using the standard Vite React template with flat ESLint configuration and rolldown-based Vite (`rolldown-vite`). The current app entry point is `src/main.jsx`, which renders `App` from `src/App.jsx` into `index.html#root`.

There are no custom CLAUDE, Cursor, or Copilot rules in this project yet.

## Common Commands

All commands are intended to be run from the repo root.

- Start dev server (HMR):
  - `npm run dev`
- Production build:
  - `npm run build`
- Preview production build locally:
  - `npm run preview`
- Lint the whole project (flat ESLint):
  - `npm run lint`

### Notes

- Vite is resolved via `rolldown-vite` using the `overrides` field in `package.json`; treat it like standard Vite unless you are changing bundler-level behavior.

## Code Architecture

### Entry points and rendering

- `index.html`
  - Contains the root `<div id="root">` where the React tree is mounted.
- `src/main.jsx`
  - Imports global styles from `src/index.css`.
  - Uses `ReactDOM.createRoot` to mount `<App />` inside `StrictMode` into `document.getElementById('root')`.

### Application shell

- `src/App.jsx`
  - Currently the entire UI lives here; it is the logical place to start evolving the hotel booking user experience (routing, layout, top-level providers, etc.).
  - Uses a simple `useState` counter sample; this will likely be replaced as real features are added.
  - Imports component-scoped styles from `src/App.css`.

### Styling

- `src/index.css`
  - Global styles, base typography, color scheme (light/dark handling) and app-level layout.
- `src/App.css`
  - Component-specific styles for the current demo `App` (logo animations, card layout, etc.).
- `src/assets/`
  - Static assets for the frontend (e.g., logo SVGs). Vite will handle importing these directly in components.

### Tooling configuration

- `vite.config.js`
  - Standard Vite React config using `@vitejs/plugin-react`.
  - Extend this file when you need aliases, custom dev server behavior, or additional plugins.
- `eslint.config.js`
  - Flat ESLint config using:
    - `@eslint/js` recommended rules.
    - `eslint-plugin-react-hooks` (React Hooks rules).
    - `eslint-plugin-react-refresh` (Vite React fast-refresh rules).
  - Applies to all `*.js`/`*.jsx` files.
  - Custom rule:
    - `'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]` — allows unused variables whose names are ALL CAPS or start with an underscore-like constant pattern (useful for constants/config placeholders).

## How Future Changes Should Integrate

When adding real hotel-booking features, prefer the following structure (adjust as the project evolves):

- Organize feature-level code under `src/` by concern, for example:
  - `src/pages/` for route-level components (e.g., search, booking details, profile).
  - `src/components/` for reusable UI components.
  - `src/hooks/` for shared logic using React hooks.
  - `src/lib/` or `src/utils/` for non-React utilities.
- Keep `App.jsx` focused on global layout, routing, and high-level providers (state management, query clients, theming) rather than detailed business logic.

These are guidelines for agents when evolving the architecture; they are not yet enforced by code.

## Testing

There is no testing setup in this template yet (no Jest, Vitest, or React Testing Library). If a future change requires tests, first introduce an appropriate testing stack (e.g., Vitest + React Testing Library) and document the chosen commands here (e.g., `npm test`, `npm run test:watch`).
