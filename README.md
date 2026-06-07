# Mani Dental Clinic Website

React + TypeScript single-page website for Mani Dental Clinic, Udaipur.

The project was migrated from a plain HTML/CSS/JavaScript page to a Vite-powered React application while preserving the existing visual design, section order, responsive behavior, and user interactions.

## Tech Stack

- React
- TypeScript
- Vite
- Vercel Serverless Functions for appointment submission
- CSS using the existing design system in `css/style.css`
- ESLint
- Prettier
- Vitest + React Testing Library
- Playwright config for future browser checks

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

## Project Structure

```txt
src/
  App.tsx
  main.tsx
  components/
    icons/
    layout/
    sections/
    ui/
  data/
  hooks/
  test/
api/
  submit.js
css/
  style.css
public/
  images/
    gallery/
```

## Appointment Integrations

The appointment form posts to `/api/submit`, which is implemented as a Vercel serverless function.

Set these environment variables in Vercel:

```txt
NOTION_TOKEN
NOTION_DATABASE_ID
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

For local integration testing, create a `.env` file from `.env.example` and run `npm run dev`. Vite serves `/api/submit` locally through a dev-only middleware, while Vercel uses the same `api/submit.js` file in production.

## Notes

- The current UI is intentionally preserved by reusing the existing CSS class names.
- Page content lives in typed data files under `src/data`.
- Interactions are handled with React state and hooks.
