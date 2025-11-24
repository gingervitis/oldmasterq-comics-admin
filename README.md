# Old Master Q Comics Admin

Admin interface for managing Old Master Q comic strips and publishing to the website.

## Purpose

This admin system manages:
- ~11,000 source comic strip images with metadata
- Publishing comic strips to the oldmasterq-comics website
- Bulk tagging and metadata management

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- React 19
- Prisma ORM
- Vercel Postgres (Neon database)
- Deployed on Vercel

## Documentation

- `/docs/initial-prompt.md` - Complete system requirements and design
- `/docs/implementation-plan.md` - Development roadmap

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables (copy .env.example to .env)
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Database Commands

```bash
# Generate Prisma client (after schema changes)
npm run db:generate

# Push schema changes to database (no migration files)
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (GUI for database)
npm run db:studio
```

## Environment Variables

Create a `.env` file (or `.env.local` for Next.js):

```
# Database connection string
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

For Vercel deployment, these are automatically provided when you connect Vercel Postgres.

## Deployment

Deployed automatically to Vercel on push to `main` branch.
