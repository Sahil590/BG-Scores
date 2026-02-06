# Migration Guide: Django → Next.js

## Overview

This project has been completely rewritten from a Django (backend) + React/Vite (frontend) architecture to a modern Next.js 14 full-stack application. This guide explains what changed and how to complete the migration.

## What Changed

### Architecture
- **Before**: Separate Django REST API backend + React Vite frontend
- **After**: Single Next.js 14 application with API Routes + React Server Components

### Technology Stack

| Component | Before | After |
|-----------|--------|-------|
| Backend Framework | Django 6.0 | Next.js 14 API Routes |
| Frontend Framework | React + Vite | Next.js 14 (App Router) |
| Language | Python + JavaScript | TypeScript |
| Database ORM | Django ORM | Prisma |
| Database | PostgreSQL/SQLite | Vercel Postgres (PostgreSQL) |
| File Storage | Custom Django Storage | Vercel Blob (@vercel/blob) |
| Styling | CSS | Tailwind CSS |
| Deployment | Vercel (multi-build) | Vercel (single build) |

## Files to Remove

The following legacy files/folders can be safely removed after confirming the Next.js app works:

### Django Backend (entire folder)
```bash
rm -rf backend/
```

Contains:
- `backend/core/` - Django settings
- `backend/games/` - Django app (models, views, serializers)
- `backend/manage.py`
- `backend/build_files.sh`
- `backend/db.sqlite3`

### React Frontend (entire folder)
```bash
rm -rf frontend/
```

Contains:
- `frontend/src/` - React components
- `frontend/public/`
- `frontend/package.json`
- `frontend/vite.config.js`

### Python Dependencies
```bash
rm requirements.txt
```

###Legacy Documentation (optional)
```bash
rm VERCEL_BLOB_SETUP.md
rm DEPLOYMENT_CHECKLIST.md
rm README.md.backup
```

## Data Migration

### Option 1: Fresh Start (Recommended)
If you're just starting out or don't have important data:
1. Deploy the Next.js app
2. Set up Vercel Postgres and Blob Storage
3. Start adding games, players, and scores fresh

### Option 2: Migrate Existing Data
If you have existing data in Django that you want to preserve:

1. **Export from Django**
   ```bash
   # Activate your Django environment
   cd backend
   python manage.py dumpdata games.Game games.Player games.Score --indent 2 > data_export.json
   ```

2. **Transform the data**
   - Django IDs are integers, Prisma uses CUIDs
   - File URLs need to be migrated to Vercel Blob
   - Date formats may need adjustment

3. **Import to Prisma**
   - Create a script to import the transformed data
   - Use Prisma Client to insert records

Example import script:
```typescript
// scripts/import-data.ts
import { prisma } from '@/lib/prisma';
import oldData from './data_export.json';

async function importData() {
  // Transform and import games
  for (const game of oldData.games) {
    await prisma.game.create({
      data: {
        name: game.fields.name,
        imageUrl: game.fields.image_url,
        createdAt: new Date(game.fields.created_at),
      },
    });
  }
  // ... repeat for players and scores
}

importData();
```

## Environment Variables Migration

### Before (.env for Django)
```bash
SECRET_KEY=...
DEBUG=True
POSTGRES_URL=...
BLOB_READ_WRITE_TOKEN=...
```

### After (.env.local for Next.js)
```bash
# Vercel Postgres (multiple variables)
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...

# Vercel Blob (same)
BLOB_READ_WRITE_TOKEN=...
```

**Note**: When using Vercel Storage, these are automatically configured!

## API Endpoints Mapping

### Games
| Django | Next.js |
|--------|---------|
| `GET /api/games/` | `GET /api/games` |
| `POST /api/games/` | `POST /api/games` |
| `GET /api/games/:id/` | `GET /api/games/[id]` |
| `PATCH /api/games/:id/` | `PATCH /api/games/[id]` |
| `DELETE /api/games/:id/` | `DELETE /api/games/[id]` |

Response formats are similar, but IDs are now CUIDs instead of integers.

### Players
| Django | Next.js |
|--------|---------|
| `GET /api/players/` | `GET /api/players` |
| `POST /api/players/` | `POST /api/players` |
| `GET /api/players/:id/` | `GET /api/players/[id]` |
| `PATCH /api/players/:id/` | `PATCH /api/players/[id]` |
| `DELETE /api/players/:id/` | `DELETE /api/players/[id]` |

### Scores
| Django | Next.js |
|--------|---------|
| `GET /api/scores/` | `GET /api/scores` |
| `POST /api/scores/` | `POST /api/scores` |
| `GET /api/scores/:id/` | `GET /api/scores/[id]` |
| `PATCH /api/scores/:id/` | `PATCH /api/scores/[id]` |
| `DELETE /api/scores/:id/` | `DELETE /api/scores/[id]` |

## Key Differences

### 1. File Uploads

**Django** (required Django admin/DRF UI or custom form)
```python
# Django view handled multipart automatically
# Files saved via custom storage backend
```

**Next.js** (same multipart/form-data, cleaner code)
```typescript
// API route explicitly handles FormData
const formData = await request.formData();
const file = formData.get('image') as File;
const url = await uploadToBlob(file, `games/${file.name}`);
```

### 2. Database Queries

**Django ORM**
```python
games = Game.objects.all().order_by('-created_at')
game = Game.objects.get(id=game_id)
```

**Prisma**
```typescript
const games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } });
const game = await prisma.game.findUnique({ where: { id: gameId } });
```

### 3. Routing

**Django** (manual URL configuration)
```python
# urls.py
path('api/games/', GameViewSet.as_view({'get': 'list', 'post': 'create'}))
```

**Next.js** (file-based routing)
```
app/api/games/route.ts         # GET /api/games, POST /api/games
app/api/games/[id]/route.ts    # GET, PATCH, DELETE /api/games/[id]
```

## Testing the Migration

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Add your Vercel Postgres and Blob credentials
   ```

3. **Initialize database**
   ```bash
   npx prisma db push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Test all features**
   - ✅ Add a game with image
   - ✅ Add a player with avatar
   - ✅ Record a score
   - ✅ View all data
   - ✅ Delete items

## Deployment

### Before (Complex)
- Separate build processes for Django and React
- Multiple Vercel builds configured in `vercel.json`
- Python runtime + Node runtime
- Manual Nginx/routing configuration

### After (Simple)
- Single Next.js build
- Auto-detected by Vercel
- Just `npm run build`
- Built-in routing

**Deploy command:**
```bash
git push origin main
# Vercel auto-deploys on push
```

## Benefits of the Migration

1. **Simpler Architecture** - One codebase, one language (TypeScript)
2. **Better Performance** - Server-side rendering, automatic code splitting
3. **Type Safety** - End-to-end TypeScript
4. **Modern DX** - Hot reload, better errors, Prisma Studio
5. **Easier Deployment** - One-click deploys, automatic previews
6. **Better SEO** - Server-side rendering out of the box
7. **Smaller Bundle** - No need for separate API calls overhead
8. **More Maintainable** - Less context switching, unified stack

## Rollback Plan

If you need to revert to Django:

1. The old code is preserved in git history
2. Checkout the commit before migration:
   ```bash
   git log --oneline  # Find the commit hash
   git checkout <hash-before-migration>
   ```

3. Or keep the `backend/` and `frontend/` folders until confirmed working

## Need Help?

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: https://github.com/Sahil590/BG-Scores/issues

---

**Migration completed on**: February 6, 2026  
**Previous stack**: Django + React  
**New stack**: Next.js 14 + TypeScript + Prisma
