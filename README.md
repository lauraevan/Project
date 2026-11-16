# Lumen

A streaming-app front end with a Liquid Glass look: Vite + React + TypeScript, TanStack Router/Query, Motion.
Catalog, artwork and trailer links come from [TMDB](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.

## Run locally

```bash
cp .env.example .env   # then set TMDB_TOKEN (TMDB "API Read Access Token")
npm install
npm run dev
```

`/api/tmdb` proxies to TMDB and adds the token server-side (Vite proxy in dev, `api/tmdb.ts` on Vercel), so the token is never shipped to the browser.

## Deploy

Import the repo in Vercel and set the `TMDB_TOKEN` environment variable. `vercel.json` handles SPA routing.
