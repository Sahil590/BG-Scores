# Board Game Score Recorder

This is a web application to record board game scores, built with Django (Backend) and React (Frontend).

## Features

- Add Games with images
- Add Players with avatars
- Record Scores for a Game and Player
- View Recent Scores
- File storage using Vercel Blob Storage (production) or local filesystem (development)

## Tech Stack

- **Backend**: Django 6.0, Django REST Framework
- **Frontend**: React, Vite
- **Database**: PostgreSQL (production) / SQLite (development)
- **File Storage**: Vercel Blob Storage (production) / Local filesystem (development)
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 16+
- pip and npm

### Backend Setup

1. Create a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:

   ```bash
   cd backend
   python manage.py migrate
   ```

4. Create a superuser (optional, for admin access):

   ```bash
   python manage.py createsuperuser
   ```

5. Start the server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://127.0.0.1:8000/api/`.
   Admin panel: `http://127.0.0.1:8000/admin/`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Deployment to Vercel

### 1. Prerequisites

- Vercel account
- GitHub repository with your code
- PostgreSQL database (e.g., Vercel Postgres, Neon, Supabase)
- Vercel Blob Storage configured

### 2. Configure Vercel Blob Storage

1. Go to your Vercel Dashboard
2. Navigate to **Storage** → **Blob**
3. Create a new Blob Store
4. Copy the `BLOB_READ_WRITE_TOKEN`

### 3. Set Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

```bash
# Database (required)
POSTGRES_URL=postgresql://user:pass@host:port/dbname

# Security (required for production)
SECRET_KEY=your-secret-key-here
DEBUG=False

# File Storage (required for uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 4. Deploy

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration from `vercel.json`
3. Click **Deploy**

The `vercel.json` configuration handles:

- Django backend deployment
- React frontend build
- Routing between API and frontend

### 5. Initial Setup After Deployment

Run migrations in Vercel's deployment terminal or using Vercel CLI:

```bash
# Using Vercel CLI
vercel env pull .env.local
python backend/manage.py migrate
```

## API Endpoints

- `GET /api/games/` - List all games
- `POST /api/games/` - Create a new game (supports file upload)
- `GET /api/games/{id}/` - Get game details
- `PUT/PATCH /api/games/{id}/` - Update a game (supports file upload)
- `DELETE /api/games/{id}/` - Delete a game

- `GET /api/players/` - List all players
- `POST /api/players/` - Create a new player (supports file upload)
- `GET /api/players/{id}/` - Get player details
- `PUT/PATCH /api/players/{id}/` - Update a player (supports file upload)
- `DELETE /api/players/{id}/` - Delete a player

- `GET /api/scores/` - List all scores
- `POST /api/scores/` - Create a new score
- `GET /api/scores/{id}/` - Get score details
- `PUT/PATCH /api/scores/{id}/` - Update a score
- `DELETE /api/scores/{id}/` - Delete a score

### File Upload Example

```bash
# Create a game with an image
curl -X POST http://localhost:8000/api/games/ \
  -H "Content-Type: multipart/form-data" \
  -F "name=Chess" \
  -F "image=@/path/to/chess.jpg"

# Response:
{
  "id": 1,
  "name": "Chess",
  "image": "https://xxxxx.public.blob.vercel-storage.com/games/chess-abc123.jpg",
  "created_at": "2026-02-06T10:30:00Z"
}
```

## File Storage Details

### Production (Vercel)

- Files are stored in Vercel Blob Storage
- Automatic CDN distribution
- Public URLs returned in API responses
- No server storage needed

### Development (Local)

- Files stored in `backend/media/` directory
- Served by Django at `/media/` URL
- Not committed to git (in .gitignore)

For more details, see [VERCEL_BLOB_SETUP.md](VERCEL_BLOB_SETUP.md).

## Project Structure

```
BG-Scores/
├── backend/
│   ├── core/              # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── storage.py     # Vercel Blob Storage backend
│   │   └── wsgi.py
│   ├── games/             # Main app
│   │   ├── models.py      # Game, Player, Score models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── manage.py
│   └── build_files.sh     # Vercel build script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── requirements.txt
├── vercel.json           # Vercel configuration
└── README.md
```

## Troubleshooting

### File Uploads Not Working

1. Check that `BLOB_READ_WRITE_TOKEN` is set in production
2. Verify the token has read/write permissions
3. Ensure `Pillow` is installed: `pip install Pillow`
4. Check request uses `multipart/form-data` content type

### Database Connection Issues

1. Verify `POSTGRES_URL` environment variable is set
2. Check database allows connections from Vercel IPs
3. Ensure database exists and migrations are run

### Local Development Issues

1. Make sure virtual environment is activated
2. Check all dependencies are installed: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`
4. For file uploads locally, don't set `BLOB_READ_WRITE_TOKEN`

## License

MIT License
