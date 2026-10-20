# envy-api

Hono Worker that stores ciphertext blobs for [envy](https://github.com/RovierrHQ/envy). The server never sees passphrases or derived keys.

## Stack

Hono, better-auth (GitHub OAuth), Drizzle, Cloudflare D1.

## Layout

```text
src/index.ts          Worker entry
src/auth/             better-auth
src/db/               Drizzle schema
src/routes/           /v1 and HTML pages
src/services/         projects, secrets, pats, invites, device
src/middleware/       PAT bearer auth
drizzle/              D1 migrations
openapi.yaml          frozen HTTP contract
```

## Local

```bash
npm install
npx wrangler d1 migrations apply envy --local
cp .dev.vars.example .dev.vars
npm run dev
```

## Secrets

```bash
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

GitHub OAuth callback: `https://<host>/api/auth/callback/github`

Set `BETTER_AUTH_URL` in `wrangler.jsonc` to the public origin (workers.dev during staging, `https://envy.rovierr.com` before GA).

## Deploy

```bash
npx wrangler d1 migrations apply envy --remote
npm run deploy
```

Custom domain: uncomment the `envy.rovierr.com` route after the zone is on this Cloudflare account, set `BETTER_AUTH_URL`, and redeploy. This account currently has no zones, so v1 staging stays on `workers.dev`.

## HTTP

See `openapi.yaml`. PAT is `Authorization: Bearer envy_pat_…`. Web fallback: `/settings/tokens`. CLI device login: `/device`.
