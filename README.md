# MERN Todo App — QA Assignment (Jest + Cypress)

QA testing assignment for the [MERN Todo App by AtharvaKulkarniIT](https://github.com/AtharvaKulkarniIT/MERN-Todo-List-CRUD-webapp), covering:

- **Jest** — unit tests for utility functions and integration tests for the backend API (with supertest + mongodb-memory-server)
- **Cypress** — end-to-end UI tests for the frontend
- **CI** — GitHub Actions pipeline that runs both suites on every push/PR to `main`

## Project Structure

```
├── .github/workflows/tests.yml     # CI pipeline (Jest + Cypress jobs)
├── todo_backend/
│   ├── app.js                      # Express app (exported for testing)
│   ├── server.js                   # Server entry point (MongoDB + listen)
│   ├── models/Todo.js              # Mongoose model
│   ├── utils/                      # Utility functions under test
│   │   ├── validateEmail.js
│   │   └── calculateTaskCompletionPercentage.js
│   ├── tests/
│   │   ├── unit/                   # Jest unit tests
│   │   └── integration/           # Jest + supertest API tests
│   └── coverage/                   # Jest coverage report (committed as deliverable)
└── todo_frontend/
    ├── src/                        # React app
    └── cypress/e2e/todo.cy.js      # Cypress E2E tests
```

## Prerequisites

- Node.js 20+
- npm
- MongoDB running locally on `mongodb://127.0.0.1:27017` (needed only for running the app / Cypress tests — **not** for Jest tests, which use an in-memory MongoDB)

## Part 1 — Jest Tests (Backend)

```bash
cd todo_backend
npm install
npm test          # runs all unit + integration tests with coverage
npm run test:watch   # watch mode
```

- **Unit tests** (`tests/unit/`): `validateEmail`, `calculateTaskCompletionPercentage`
- **Integration tests** (`tests/integration/Tasks.test.js`): `POST /add`, `GET /get`, `PUT /edit/:id`, `PUT /update/:id`, `DELETE /delete/:id` — including negative cases (empty/whitespace task rejected with 400)
- No local MongoDB required — tests spin up `mongodb-memory-server`

### Coverage

`npm test` generates the coverage report automatically (Jest `--coverage`).

- Terminal summary is printed after the run
- Full HTML report: open `todo_backend/coverage/lcov-report/index.html` in a browser
- Backend coverage is **~90% statements**, above the required 80%

## Part 2 — Cypress Tests (Frontend E2E)

Cypress tests run against the real app, so start MongoDB, the backend, and the frontend first:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd todo_backend
npm install
npm start

# Terminal 2 — frontend (http://localhost:3000)
cd todo_frontend
npm install
npm start

# Terminal 3 — Cypress
cd todo_frontend
npx cypress run                # headless
npx cypress open               # interactive runner
```

Test scenarios (`cypress/e2e/todo.cy.js`):

1. User can add a new task and see it in the list
2. User can mark a task as complete
3. User can delete a task
4. Empty state message ("No tasks found") is shown when no tasks exist
5. **Negative test:** empty task submission is prevented (list count unchanged, backend returns 400)

## CI Pipeline (Bonus)

`.github/workflows/tests.yml` runs on every push / pull request to `main`:

- **Jest job** — installs backend deps, runs `npm test` with coverage, uploads the coverage report as a build artifact
- **Cypress job** — starts a MongoDB service container, boots the backend and frontend, runs the full Cypress suite, and uploads screenshots on failure

Latest runs: see the [Actions tab](https://github.com/sai83090/mern-todo-qa-assignment/actions).
