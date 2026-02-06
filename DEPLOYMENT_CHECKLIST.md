# Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Changes Complete

- [x] Vercel Blob Storage backend implemented (`backend/core/storage.py`)
- [x] Models updated with image fields (`Game.image`, `Player.avatar`)
- [x] Views configured with file upload parsers (`MultiPartParser`, `FormParser`)
- [x] Admin panel configured for file management
- [x] Settings updated with media file configuration
- [x] URLs configured for local media serving (development)
- [x] .gitignore updated to exclude media files
- [x] README updated with deployment instructions

### 📦 Dependencies

- [x] `requirements.txt` includes all necessary packages:
  - Django 6.0.1
  - djangorestframework
  - Pillow (for image handling)
  - requests (for Vercel Blob API)
  - psycopg2-binary (for PostgreSQL)
  - All other dependencies

### 🔧 Configuration Files

- [x] `vercel.json` - Vercel deployment configuration
- [x] `backend/build_files.sh` - Build script for migrations and static files
- [x] `.env.example` - Example environment variables

## Deployment Steps

### 1. Set Up Vercel Blob Storage

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Blob**
3. Click **Create** or select existing blob store
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Save it securely - you'll need it for environment variables

### 2. Set Up Database (if not already done)

Choose one:

- **Vercel Postgres**: Dashboard → Storage → Postgres → Create
- **Neon**: [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)

Copy the `POSTGRES_URL` connection string.

### 3. Configure Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables**

Add these variables for **Production**, **Preview**, and **Development**:

```bash
# Required for production
SECRET_KEY=your-generated-secret-key-here
DEBUG=False
POSTGRES_URL=postgresql://user:pass@host:port/dbname
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

**Generate SECRET_KEY:**

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. Deploy to Vercel

#### Option A: Via GitHub (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Vercel auto-detects configuration from `vercel.json`
6. Click **Deploy**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 5. Post-Deployment Tasks

After first deployment, migrations should run automatically via `build_files.sh`. If not:

```bash
# Using Vercel Dashboard
# Go to Deployments → [Your Deployment] → Terminal

# Or using Vercel CLI
vercel env pull .env.production
python backend/manage.py migrate
```

### 6. Create Superuser (Optional)

For admin panel access:

```bash
# You can't do this via Vercel directly
# Option 1: Create in local environment before pushing data
python backend/manage.py createsuperuser

# Option 2: Create via Django shell in production
# Add a management command or use Vercel Functions
```

### 7. Test the Deployment

1. **Test API endpoints:**

   ```bash
   curl https://your-app.vercel.app/api/games/
   ```

2. **Test file upload:**

   ```bash
   curl -X POST https://your-app.vercel.app/api/games/ \
     -F "name=Chess" \
     -F "image=@/path/to/image.jpg"
   ```

3. **Verify blob storage:**
   - Check that image URL in response is from `blob.vercel-storage.com`
   - Open the URL in browser to verify image loads

4. **Test frontend:**
   - Visit `https://your-app.vercel.app`
   - Test all pages and functionality

## Troubleshooting

### Build Fails

**Check build logs in Vercel Dashboard:**

- Verify all dependencies in `requirements.txt`
- Check Python version matches (`python3.9` in `vercel.json`)
- Ensure `build_files.sh` has execute permissions

### Database Connection Errors

- Verify `POSTGRES_URL` is correctly formatted
- Check database allows connections from `0.0.0.0/0` (or Vercel IPs)
- Ensure database exists

### File Uploads Not Working

- Verify `BLOB_READ_WRITE_TOKEN` is set in environment variables
- Check token has **read-write** permissions (not read-only)
- Verify blob store exists in Vercel Dashboard
- Check request uses `multipart/form-data` content type

### 500 Internal Server Error

- Check Vercel deployment logs
- Verify all environment variables are set
- Check `DEBUG=False` in production
- Ensure migrations have run

### CORS Errors

Currently set to `CORS_ALLOW_ALL_ORIGINS = True` in settings.
For production, you may want to restrict this:

```python
CORS_ALLOWED_ORIGINS = [
    'https://your-app.vercel.app',
    'https://your-custom-domain.com',
]
```

## Monitoring and Maintenance

### Check Blob Storage Usage

1. Go to Vercel Dashboard → Storage → Blob
2. Monitor storage size and bandwidth
3. Vercel Blob pricing:
   - Free tier: 1 GB storage, 1 GB bandwidth/month
   - Pro: $0.15/GB storage, $0.20/GB bandwidth

### Database Maintenance

- Monitor database size
- Set up automated backups
- Consider connection pooling for high traffic

### Check Deployment Logs

```bash
# Using Vercel CLI
vercel logs [deployment-url]
```

## Security Recommendations

### Before Going Live

- [ ] Set `DEBUG=False` in production
- [ ] Use environment variables for all secrets
- [ ] Configure proper CORS origins
- [ ] Add `ALLOWED_HOSTS` restrictions in settings
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up proper database backups
- [ ] Review Django Security Checklist:
  ```bash
  python manage.py check --deploy
  ```

### Recommended Settings for Production

Add to `settings.py`:

```python
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
```

## Rollback Plan

If deployment has issues:

1. **Instant rollback** via Vercel Dashboard:
   - Go to Deployments
   - Find previous working deployment
   - Click **⋯** → **Promote to Production**

2. **Via CLI:**
   ```bash
   vercel rollback
   ```

## Success Criteria

- [ ] Application loads at production URL
- [ ] API endpoints return correct data
- [ ] File uploads work and return Vercel Blob URLs
- [ ] Images display correctly from blob storage
- [ ] Database queries work
- [ ] No errors in deployment logs
- [ ] Frontend displays correctly
- [ ] Admin panel accessible (if created superuser)

## Post-Launch

- [ ] Set up monitoring (e.g., Sentry, LogRocket)
- [ ] Configure custom domain (optional)
- [ ] Set up analytics (optional)
- [ ] Monitor Vercel usage and costs
- [ ] Document any project-specific configurations

---

**Need Help?**

- [Vercel Documentation](https://vercel.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/)
- [Vercel Blob Storage Docs](https://vercel.com/docs/storage/vercel-blob)
