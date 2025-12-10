# Copilot / AI Agent Instructions — Library Recommendation System

Purpose: Help AI coding agents be immediately productive in this repository by documenting the
project's big-picture architecture, key files, developer workflows, and concrete patterns to follow.

1) Big picture
- **Frontend-only starter**: This repo contains a complete React + TypeScript frontend (Vite + Tailwind).
  The backend is intentionally mocked; students implement an AWS serverless backend later.
- **Data flow**: UI -> `src/services/api.ts` (service layer) -> currently returns data from
  `src/services/mockData.ts`. When real backend exists, `api.ts` will call API Gateway endpoints.
- **Auth**: Auth is surfaced through `src/contexts/AuthContext.tsx` and `src/hooks/useAuth.ts`.
  Authentication is currently simulated; AWS Cognito integration is planned in `IMPLEMENTATION_GUIDE.md`.

2) Where to start (high-value files)
- `src/services/api.ts` — central service layer; contains detailed TODOs and examples for replacing
  mocks with real fetch calls. Typical functions: `getBooks`, `getBook`, `createBook`, `getRecommendations`,
  `getReadingLists`, `createReadingList`, etc.
- `src/services/mockData.ts` — mock dataset used by the app; do not delete until all API calls are ported.
- `src/contexts/AuthContext.tsx` and `src/hooks/useAuth.ts` — identity surface for the app; update these
  when adding Cognito/Amplify.
- `src/components/` and `src/pages/` — UI components and pages. Look at `BookSearch.tsx`, `BookGrid.tsx`, and
  `BookCard.tsx` for how the UI consumes the service layer.

3) Project-specific workflows & commands
- Install: `npm install` (Node 20+, npm 10+ recommended).
- Dev server: `npm run dev` (Vite — default http://localhost:5173).
- Build: `npm run build` (runs `tsc -b` then `vite build`). Note: TypeScript project build step is explicit.
- Tests: `npm test` (Vitest). UI test runner: `npm run test:ui`. Coverage: `npm run test:coverage`.
- Lint/format: `npm run lint`, `npm run format` (Prettier + ESLint configs present).

4) Key conventions & patterns (do not assume defaults)
- Service layer pattern: all backend interactions go through `src/services/api.ts`. Replace the mock
  implementations with fetch/XHR calls and preserve the exported function signatures and return types.
- Environment variable: API base URL should come from `import.meta.env.VITE_API_BASE_URL` (see top of `api.ts`).
- Auth header helper: implement `getAuthHeaders()` in `api.ts` (TODO already documented) and call it for
  authenticated endpoints. The file contains step-by-step instructions for Cognito/Amplify integration.
- Import alias: code uses `@/` alias for `src` imports (e.g. `@/types`). Keep alias imports working —
  update `vite.config.ts` if you change paths.
- Persistence for reading lists: LocalStorage is used by the UI until backend is wired — see usage in pages.
- Do not change public assets (e.g. `public/book-covers/`) naming as UI expects specific filenames.

5) Concrete examples (copy/paste-ready)
- Replace mock `getBooks()` in `src/services/api.ts` with a real call (example):

  // const response = await fetch(`${API_BASE_URL}/books`);
  // if (!response.ok) throw new Error('Failed to fetch books');
  // return response.json();

- Implement `getAuthHeaders()` (example steps are in `api.ts`): fetch Cognito token via Amplify
  and return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }.

6) Tests & safety checks for code changes
- Tests live under `src/tests/` and component tests under `src/tests/components/`.
- Run `npm test` locally; use `npm run test:ui` for interactive debugging.
- Keep TypeScript types in sync — update `src/types/index.ts` when changing service payloads.

7) Integration points & external dependencies
- AWS backend (to be built by students): Lambda + API Gateway + DynamoDB + Cognito + Amazon Bedrock.
  See `IMPLEMENTATION_GUIDE.md` for step-by-step instructions and the TODO checklist inside
  `src/services/api.ts` that maps to those steps.
- When adding AWS clients, prefer `aws-amplify` for frontend integration (week 3 instructions present).

8) When editing this repo as an AI agent — practical constraints
- Preserve the public API of modules: modify `src/services/api.ts` implementations but keep function names/types.
- Avoid changing global build or CI config unless requested. Small edits to `vite.config.ts` only when necessary
  (e.g. adjusting `@/` alias).
- Search for `TODO:` comments — they mark approved change points. `api.ts` is intentionally full of them.

9) Useful searches to run before changes
- `grep -r "TODO:" src/` — find guided implementation points.
- `rg "getBooks|getRecommendations|VITE_API_BASE_URL"` — find where to wire real endpoints.

If anything above is unclear or you want the instructions expanded (for example: a step-by-step
example of converting one mock endpoint to an AWS-backed endpoint with Amplify), tell me which
area to expand and I will iterate.
