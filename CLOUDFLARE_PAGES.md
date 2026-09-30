# Cloudflare Pages Deployment

C-Web is a static HTML website with Cloudflare Pages Functions under `/functions`. It is intended to be deployed as a **Cloudflare Pages project connected to GitHub**, not as a standalone Cloudflare Worker.

## Repository

- Repository: `springnexaa-ops/C-Web`
- Production branch: `main`
- Root directory: `/`
- Framework preset: **None / Custom**
- Build command: `exit 0`
- Build output directory: `.`
- Node/npm build: **not required**
- Standalone Worker deployment: **not used**

Cloudflare documents `exit 0` for no-build static sites when Pages Functions are present, and the output directory is the directory containing the deployable site.

## Pages Functions

The repository intentionally contains:

```
/functions/
```

These are **Pages Functions**, not a separate Worker project. Cloudflare Pages maps files under `/functions` to routes automatically.

Do not replace the `/functions` directory with a root `_worker.js` deployment.

## Required Pages production bindings

Configure these under the **Pages project**, not in Git:

### D1

Add a D1 binding:

- Variable name: `DB`
- Database: the production C-Web D1 database

The source code uses `env.DB`.

### Secrets

Add encrypted Pages secrets:

- `ADMIN_TOKEN`
- `GITHUB_TOKEN`
- `NEXA_AI_API_KEY`
- `AMADEUS_CLIENT_SECRET` (if required by the flight integration)

### Non-secret variables

Configure as required by the deployed integrations:

- `GITHUB_OWNER=springnexaa-ops`
- `GITHUB_REPO=C-Web`
- `NEXA_AI_API_URL=<production gateway URL>`
- `NEXA_AI_MODEL=<production model>`
- `ALLOWED_ORIGIN=<production site origin>`
- `AMADEUS_CLIENT_ID=<production client id>`
- `AMADEUS_BASE_URL=<production Amadeus base URL>`

Do not place secret values in this repository.

## Pages dashboard

Create the project through:

**Workers & Pages → Create application → Pages → Import an existing Git repository**

Then connect:

`springnexaa-ops/C-Web`

Set:

- Production branch: `main`
- Root directory: repository root
- Build command: `exit 0`
- Build output directory: `.`
- Automatic production deployments: **Enabled**
- Preview deployments: **Enabled**

After adding or changing bindings/secrets, redeploy the Pages project.

## Security

The repository already contains a root `_headers` file with security and cache-control policies. Cloudflare Pages reads `_headers` from the deployable static directory.

The repository also contains a GitHub security baseline workflow for secret scanning, filesystem vulnerability scanning, and dependency review.

## Important

Do not create or configure:

- a standalone Worker for C-Web
- a Worker `_worker.js` entrypoint
- a Worker-specific deployment pipeline
- a Worker-only hostname for the site

The `/functions` directory remains because it is the Pages Functions implementation for the site's API routes.
