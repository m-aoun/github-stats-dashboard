# GitHub Stats Dashboard

A single-page React app that turns any public GitHub username into a visual
profile: avatar and bio, follower/repo counts, a language-breakdown donut
chart aggregated across their public repos, and a bar chart + ranked list of
their top repos by stars. Data comes straight from the public GitHub REST
API — no backend, no auth token, no API key. Type a username, hit search,
and the dashboard re-renders around that person's public activity.

## Features

- Search any public GitHub username and fetch their live profile + repos
- Profile card: avatar, name, bio, location/company, follower/following
  counts, public repo count, account creation date and computed account age
- Language breakdown donut chart, aggregated from each repo's primary
  `language` field, with a legend and hover tooltips (percent + repo count
  per language); languages beyond the top 7 are folded into "Other" rather
  than generating more colors
- Top-8-by-stars bar chart plus a ranked, linkable list of those repos
  (description, primary language, stars, forks)
- Total stars and total forks received, summed across all public repos
- Graceful **loading**, **user not found (404)**, and **rate-limited (403)**
  states — all handled explicitly, never a blank screen or console crash
- Responsive layout: charts and stat tiles reflow to a single column on
  narrow/mobile widths
- Loads with `octocat` pre-filled and auto-searched on first visit, so the
  page never opens empty

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Charts | Recharts (Pie/donut + Bar) |
| HTTP | Axios |
| Data source | GitHub REST API (`api.github.com`), unauthenticated |
| Styling | Plain CSS (custom properties for theming, no framework) |

## Setup

```bash
git clone https://github.com/m-aoun/github-stats-dashboard.git
cd github-stats-dashboard
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To produce a production build:

```bash
npm run build
npm run preview
```

## About the GitHub API usage

This project calls `https://api.github.com/users/:username` and
`https://api.github.com/users/:username/repos` directly from the browser,
unauthenticated. GitHub caps **unauthenticated** REST API requests at **60
per hour, per IP address**. That's plenty for casually looking up a handful
of profiles, but it means:

- Rapidly searching many different usernames in a short window can trip the
  limit — the app detects this (HTTP 403 with a zeroed
  `X-RateLimit-Remaining` header, or a 429) and shows a clear "rate limit
  reached" message instead of failing silently.
- This is a **client-only demo/portfolio tool**, not something meant to sit
  behind real production traffic. A production version of this idea would
  proxy requests through a small backend using a personal access token
  (7,500 requests/hour) or GitHub App installation token, and/or cache
  responses.
- No API key or secret is required to run or use this project as-is.

## Author

Muhammad Aoun Shabbir — [github.com/m-aoun](https://github.com/m-aoun)
