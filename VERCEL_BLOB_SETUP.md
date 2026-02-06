# Vercel Blob Storage Setup Guide

This guide explains how to use Vercel Blob Storage for file uploads in the BG-Scores backend.

## Overview

The backend now uses Vercel Blob Storage to store:

- Game images (`Game.image`)
- Player avatars (`Player.avatar`)

In development, files are stored locally unless you configure Vercel Blob credentials.

## Setup Steps

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get Your Vercel Blob Token

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Blob
3. Create a new Blob Store (if you haven't already)
4. Copy the `BLOB_READ_WRITE_TOKEN`

### 3. Configure Environment Variables

#### For Local Development (Optional)

Create a `.env` file in the backend directory:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

Load it in your Django settings or use python-dotenv.

#### For Vercel Deployment

Add the environment variable in your Vercel project settings:

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add `BLOB_READ_WRITE_TOKEN` with your token value
4. Save and redeploy

### 4. How It Works

#### Production (with BLOB_READ_WRITE_TOKEN set)

- Files uploaded through the API are stored in Vercel Blob Storage
- Full URLs are saved in the database (e.g., `https://xxxxx.public.blob.vercel-storage.com/games/image.jpg`)
- Files are publicly accessible via these URLs
- No need to configure MEDIA_ROOT or serve media files

#### Development (without BLOB_READ_WRITE_TOKEN)

- Files are stored locally in the `media/` directory
- Files are served by Django at `/media/`
- Useful for local testing without cloud storage costs

### 5. API Usage

#### Uploading Files

When creating or updating a Game or Player with an image:

```bash
# Using multipart/form-data
curl -X POST http://localhost:8000/api/games/ \
  -F "name=Chess" \
  -F "image=@/path/to/image.jpg"
```

#### Response Example

```json
{
  "id": 1,
  "name": "Chess",
  "image": "https://xxxxx.public.blob.vercel-storage.com/games/chess-abc123.jpg",
  "created_at": "2026-02-06T10:30:00Z"
}
```

### 6. Frontend Integration

The image URLs returned by the API are ready to use directly:

```jsx
// React example
<img src={game.image} alt={game.name} />
```

## Storage Backend Details

The custom storage backend is located at `backend/core/storage.py` and:

- Implements Django's Storage interface
- Automatically uploads files to Vercel Blob on save
- Returns public URLs that can be used directly
- Handles file deletion when database records are deleted
- Uses the `vercel-blob-python` SDK

## Troubleshooting

### "BLOB_READ_WRITE_TOKEN environment variable is required"

This error appears when:

- You haven't set the environment variable
- The variable is misspelled or has the wrong value

**Solution**: Set the environment variable correctly or remove it to use local storage.

### Files not uploading

Check:

1. Pillow is installed (`pip install Pillow`)
2. The token has read/write permissions
3. Your Vercel Blob Store is active
4. Check Django logs for detailed error messages

### URLs not working

- Ensure files are set to `public` access (handled automatically by the storage backend)
- Check if the blob store exists in your Vercel dashboard
- Verify the URL format matches: `https://xxxxx.public.blob.vercel-storage.com/...`

## Cost Considerations

Vercel Blob Storage pricing (as of 2026):

- Free tier: 1 GB storage, 1 GB bandwidth/month
- Pro: $0.15/GB storage, $0.20/GB bandwidth

For development, consider:

- Using local storage (no BLOB_READ_WRITE_TOKEN)
- Using a separate Vercel Blob Store for development/staging

## Alternative: Direct Upload from Frontend

For better performance and to avoid backend processing, you can implement direct upload from the frontend:

1. Backend generates a signed upload URL
2. Frontend uploads directly to Vercel Blob
3. Frontend sends the blob URL back to the backend

See [Vercel Blob Client Upload documentation](https://vercel.com/docs/storage/vercel-blob/client-upload) for details.
