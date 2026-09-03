# Taloop App

## Project overview

- React 19 + TypeScript single-page application built with Vite.
- The UI explores datasets served by the backend at `http://127.0.0.1:8000/api/v1`.
- Keep the existing Spanish user-facing copy unless the task explicitly requests a language change.

## Common commands

- Install dependencies: `npm ci`
- Start local development: `npm run dev`
- Lint: `npm run lint`
- Type-check: `npm run type-check`
- Production build: `npm run build`

Run the relevant lint and type-check commands after changing TypeScript or CSS. Run the production build for changes that affect application integration or configuration.

## Code conventions

- Use TypeScript and preserve the repository's existing quote, semicolon, and import style in files you edit.
- Place reusable UI in `src/components/`, routes in `src/routes/`, page compositions in `src/pages/`, domain types in `src/types/`, and API access in `src/services/`.
- Keep a component's stylesheet beside its component. Reuse the existing `index.ts` barrel exports when adding components to an established component folder.
- Prefer existing design tokens and shared styles in `src/styles/` over introducing one-off visual values.
- Do not add dependencies or change the API base URL without explicit approval.

## Working safely

- Preserve existing user changes and avoid unrelated refactors.
- Do not commit, push, or alter lockfiles unless the task requires it.

## Specialized Codex agents

Use a specialized agent only when its work is independently useful; do not launch agents merely because a task mentions the relevant area. Keep write-capable work to one agent at a time.

- `dataset_flow_explorer`: map an unfamiliar dataset, route, state, or component flow before proposing a change.
- `dataset_api_auditor`: investigate API payloads, identifiers, domain types, and loading or error handling.
- `ui_accessibility_reviewer`: review component markup and CSS for UI or accessibility risks; use `browser_flow_tester` for runtime evidence.
- `browser_flow_tester`: reproduce UI flows only when the frontend, browser tooling, and relevant backend are available.
- `quality_gate`: run lint, type-check, and build without changing source files.
- `frontend_implementer`: make the smallest implementation after requirements and evidence are clear.
