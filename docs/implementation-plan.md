# Implementation Plan

## Overview

This document outlines the implementation roadmap for the Old Master Q Comics Admin system. The admin will manage ~11,000 source comic strip images and handle publishing to the website.

## Implementation Phases

### Phase 1: Foundation

#### 1. Install Project Dependencies
- Run `npm install` to set up Next.js and required packages
- Add additional dependencies as needed (Prisma, UI libraries, etc.)

#### 2. Set Up Prisma ORM
- Install Prisma and Prisma Client
- Initialize Prisma configuration
- Configure connection to Vercel Postgres database

#### 3. Define Database Models

**Source Comic Strip Model**
- `id` - Source file id (not editable)
- `date` - Last edited date
- `yearRange` - One of 4 values based on letter prefix (A: 1962-1967, B: 1968-1972, C: 1973-1982, D: 1983-1989)
- `titleChinese` - Chinese title of the primary strip
- `format` - Panel count (4, 6, 8, or 12)
- `topImageFileBase` - Source image file for admin display
- `bottomImageFileBase` - Bottom half source image (if applicable)
- `titleEnglish` - English title
- `tags` - Array of keywords
- `altText` - Accessible text description
- `translation` - Translation notes

**Published Comic Strip Model**
- `id` - Website strip ID number (auto-incrementing)
- `baseFile` - Reference to source image
- `fileRoot` - Website image filename
- `fileExtension` - File extension (.jpg, .png, etc.)
- `is450` - Boolean for 450px width
- `isRTL` - Boolean for RTL content direction
- `hasBuiltInTitle` - Boolean for embedded title in image
- `shopId` - Related product ID
- `description` - Optional description text
- `layout` - Template to use (can be ignored for now)

### Phase 2: Core Features

#### 4. Create API Routes
- List source strips with pagination
- Filter by tags, year range, format, etc.
- Sort by various fields
- Search by title or ID

#### 5. Build Source Strips List View Page
- Display options: table view or thumbnail grid (or both with toggle)
- Sortable columns
- Filter controls
- Show which strips have published versions
- Bulk selection for tag operations

#### 6. Create Source Strip Edit Form Page
- Display source image(s)
- Edit all metadata fields
- Tag management interface
- Save changes to database
- Link to published version (if exists)

#### 7. Implement Tag Management
- Add/remove tags from single strip
- Bulk add/remove tags from multiple strips
- Tag autocomplete/suggestions
- View all existing tags

### Phase 3: Publishing

#### 8. Build Publish Workflow
- Select source strip to publish
- Generate next incremental ID (n+1 of highest)
- Create markdown file with proper frontmatter structure
- Handle ID recycling (if newest is deleted, next takes same ID)
- Output markdown file to be added to website repo

**Markdown Generation:**
- Extract relevant fields from source strip
- Add publish-specific metadata
- Format as frontmatter YAML + markdown body

### Phase 4: Security & Deployment

#### 9. Add Authentication System
- Implement NextAuth.js or similar
- Basic username/password authentication
- Protect all admin routes
- Session management

#### 10. Deploy to Vercel
- Connect GitHub repository to Vercel
- Set up Vercel Postgres database
- Configure environment variables
- Set up automatic deployments from main branch

## Key Questions to Resolve

### 1. Data Migration Strategy
- Build migration script to import existing 11k markdown files into Postgres?
- Or enter data manually over time?
- Hybrid approach: import what exists, add new ones manually?

### 2. List View UI Preference
- **Option A:** Table view (better for sorting/filtering)
- **Option B:** Thumbnail grid (better for visual browsing like Adobe Bridge)
- **Option C:** Both with a toggle switch

### 3. Publishing Workflow Integration
- **Option A:** Admin automatically commits and pushes to website repo via git
- **Option B:** Admin generates file locally for manual git operations
- **Option C:** Admin provides download button for generated markdown file

### 4. Image Storage
- Where are source images currently stored?
- Should admin upload/manage images or just reference external URLs?
- Are images already hosted on Cloudflare/CDN?

### 5. Website Repo Integration
- How should admin access the website repository?
- Git operations (requires credentials/SSH keys)
- API endpoints on website
- Manual file transfer

## Technology Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Database:** Vercel Postgres (Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (or Vercel authentication)
- **Hosting:** Vercel
- **UI Components:** TBD (Tailwind CSS, shadcn/ui, etc.)

## Success Criteria

- Admin can view, filter, and sort all 11,000 source strips
- Metadata can be edited efficiently
- Tags can be managed individually and in bulk
- Publishing workflow generates correct markdown files
- ID system maintains proper incrementing
- System is secure behind authentication
- Deployed and accessible from anywhere on the web
- Free tier hosting maintained (low usage patterns)

## Future Enhancements

- Migrate website from markdown to database-driven
- Advanced search and filtering
- Batch operations beyond tags
- Analytics and usage tracking
- Image upload and management
- Multi-user support with roles/permissions
