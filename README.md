# Learner Progress MVP

A React and Express application for viewing in-progress courses.

## Run locally

Requires **Node.js 20+**, **npm**, and available ports **3001** (API) and **5173** (frontend).

Open two terminals at the repository root.

**Terminal 1:** install dependencies and start the API.

```sh
npm --prefix backend ci
npm --prefix frontend-react ci
npm --prefix backend run dev
```

**Terminal 2:** start the frontend.

```sh
npm --prefix frontend-react run dev
```

Open [http://localhost:5173](http://localhost:5173). Keep both terminals running; stop each with `Ctrl+C`.

## Run backend tests

From the repository root:

```sh
npm --prefix backend test -- --runInBand
```

## Supporting documentation

- [PRODUCT.md](PRODUCT.md): problem, scope, business rules, cuts, success metric, and assumptions.
- [AI_USAGE.md](AI_USAGE.md): AI assistance and candidate review decisions.
