# Taskflow Workspace

Taskflow Workspace is a Laravel task-management application with a polished, self-contained static demo. The project now has a clearer product identity, a cleaned package manifest, and an automated GitHub Pages deployment for the demo surface.

> **Live demo:** [Open Taskflow on GitHub Pages](https://mahmoudalmodalal.github.io/taskflow-workspace/)

## What changed

The repository keeps the original Laravel application and its domain models, while adding a modern `demo/` workspace for the public-facing preview. The demo is intentionally client-only: tasks are persisted to `localStorage`, can be filtered and searched, and can be exported as JSON without needing a running PHP server.

| Area | Current setup |
| --- | --- |
| Product name | Taskflow Workspace |
| Core application | Laravel task and category management |
| Public demo | React + Vite under `demo/` |
| Styling direction | Quiet Command Center: warm paper, ink, moss, and Saffron Signal |
| Demo persistence | Browser `localStorage` |
| Deployment | GitHub Pages via `.github/workflows/deploy-pages.yml` |

## Run the public demo locally

```bash
cd demo
npm install
npm run dev
```

To create the same production artifact used by GitHub Actions:

```bash
cd demo
npm ci
npm run build
npm run preview
```

The Pages workflow builds only `demo/`, so the demo remains deployable even when the Laravel backend is not available in the hosting environment.

## Run the Laravel application

The backend continues to use the project’s existing Laravel setup. Follow the environment and database instructions in [`INSTALLATION.md`](INSTALLATION.md), then run the application through the normal Laravel development server. The public demo is not a replacement for authenticated backend routes; it is a lightweight, shareable product surface for evaluation and presentation.

## Repository structure

```text
app/                    Laravel domain and HTTP layers
database/               Migrations, factories, and seeders
resources/              Existing Laravel views and assets
routes/                 Web and API routes
demo/                   Standalone React + Vite Taskflow demo
.github/workflows/      GitHub Pages deployment automation
```

## Deployment notes

GitHub Pages must be configured to use **GitHub Actions** as its build and deployment source. After a push to `main`, the workflow installs the demo dependencies, builds `demo/dist`, uploads that folder as a Pages artifact, and deploys it. The workflow is also available for manual runs from the repository’s Actions tab.

## Brand direction

Taskflow uses a warm editorial workspace rather than a generic dashboard treatment. The interface keeps the open loops central, uses Saffron Signal (`#E7A928`) for momentum, and gives secondary insight cards a quieter visual role. The full rationale is documented in [`ideas.md`](ideas.md).

## License

The repository retains its existing licensing and application conventions. Add a license file if this project is intended for public redistribution.
