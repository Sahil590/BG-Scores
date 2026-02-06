# BG Scores - Board Game Score Tracker

A modern, full-stack web application for tracking board game scores, built with Next.js 14, TypeScript, Prisma, and Vercel Blob Storage.

## ✨ Features

- 🎮 **Game Management** - Add and manage your board game collection with images
- 👥 **Player Profiles** - Track players with custom avatars
- 📊 **Score Tracking** - Record and view game scores with winner tracking
- 🖼️ **Image Storage** - Automatic image uploads to Vercel Blob Storage
- 🌙 **Dark Mode** - Built-in dark mode support
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js App Router
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) with [Prisma ORM](https://www.prisma.io/)
- **File Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Vercel account (for deployment and storage)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sahil590/BG-Scores.git
   cd BG-Scores
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   You'll need to set up Vercel Postgres and Blob Storage:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Create a new project (if needed)
   - Add **Vercel Postgres** storage (Storage tab → Create → Postgres)
   - Add **Vercel Blob** storage (Storage tab → Create → Blob)
   - Copy the environment variables from each to your `.env.local`

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
BG-Scores/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── games/           # Games CRUD endpoints
│   │   ├── players/         # Players CRUD endpoints
│   │   └── scores/          # Scores CRUD endpoints
│   ├── games/               # Games page
│   ├── players/             # Players page
│   ├── scores/              # Scores page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   └── Navbar.tsx          # Navigation component
├── lib/                     # Utility libraries
│   ├── prisma.ts           # Prisma client
│   └── blob.ts             # Blob storage utilities
├── prisma/                 # Database schema
│   └── schema.prisma       # Prisma schema file
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── vercel.json            # Vercel deployment config
```

## 🎮 Usage

### Adding Games

1. Navigate to the **Games** page
2. Click **+ Add Game**
3. Enter game name and optionally upload an image
4. Click **Create Game**

### Adding Players

1. Navigate to the **Players** page
2. Click **+ Add Player**
3. Enter player name and optionally upload an avatar
4. Click **Add Player**

### Recording Scores

1. Navigate to the **Scores** page
2. Click **+ Add Score**
3. Select a game and player from the dropdowns
4. Enter the score
5. Check **Winner** if this player won
6. Click **Record Score**

## 🔌 API Endpoints

### Games
- `GET /api/games` - List all games
- `POST /api/games` - Create a game (multipart/form-data)
- `GET /api/games/[id]` - Get game details
- `PATCH /api/games/[id]` - Update a game (multipart/form-data)
- `DELETE /api/games/[id]` - Delete a game

### Players
- `GET /api/players` - List all players
- `POST /api/players` - Create a player (multipart/form-data)
- `GET /api/players/[id]` - Get player details
- `PATCH /api/players/[id]` - Update a player (multipart/form-data)
- `DELETE /api/players/[id]` - Delete a player

### Scores
- `GET /api/scores` - List all scores
- `POST /api/scores` - Create a score (JSON)
- `GET /api/scores/[id]` - Get score details
- `PATCH /api/scores/[id]` - Update a score (JSON)
- `DELETE /api/scores/[id]` - Delete a score

## 🚢 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sahil590/BG-Scores)

### Manual Deployment

1. **Push to GitHub** (if not already done)

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New** → **Project**
   - Import your GitHub repository

3. **Configure Storage**
   - Vercel will auto-detect Next.js
   - Add storage when prompted:
     - **Vercel Postgres** (for database)
     - **Vercel Blob** (for file storage)
   - Environment variables will be automatically configured

4. **Deploy**
   - Click **Deploy**
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 🐛 Troubleshooting

### Database Connection Issues

If you see database errors:
1. Check that all `POSTGRES_*` variables are set correctly in `.env.local`
2. Run `npx prisma db push` to sync the schema
3. Check Vercel Postgres dashboard for connection status

### Blob Storage Upload Fails

If image uploads fail:
1. Verify `BLOB_READ_WRITE_TOKEN` is set
2. Check file size is under 10MB
3. Ensure file type is an image (jpg, png, gif, webp)

### Build Errors on Vercel

If deployment fails:
1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify `prisma generate` runs successfully

## 📄 License

MIT License - feel free to use this project for your own purposes!

---

**Built with ❤️ using Next.js and Vercel**
