# Old Master Q Comics Admin

Admin interface for managing Old Master Q comic strips and publishing to the website.

## Purpose

This admin system manages:
- ~11,000 source comic strip images with metadata
- Publishing comic strips to the oldmasterq-comics website
- Bulk tagging and metadata management

## Tech Stack

- Next.js (App Router)
- TypeScript
- Vercel Postgres (database)
- Deployed on Vercel

## Documentation

See `/docs/initial-prompt.md` for the complete system requirements and design.

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

Create a `.env.local` file:

```
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
```

## Deployment

Deployed automatically to Vercel on push to `main` branch.
