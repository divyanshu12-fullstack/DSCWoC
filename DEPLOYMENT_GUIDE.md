# Deployment Configuration Guide

## Backend (Railway)

Your backend is deployed at: **https://dscwoc-production.up.railway.app**

### Railway Environment Variables

Make sure these environment variables are set in Railway:

```
NODE_ENV=production
PORT=5000
API_VERSION=v1
MONGODB_URI=mongodb+srv://belugakemausaji77_db_user:7563igYjK7PDJDs5@cluster0.ujpzs78.mongodb.net/dscwoc
SUPABASE_URL=https://gcnkrugnklihpsvweuop.supabase.co
SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
SUPABASE_JWT_SECRET=<your-secret>
GITHUB_TOKEN=<your-token>
GITHUB_CLIENT_ID=<your-id>
GITHUB_CLIENT_SECRET=<your-secret>
GITHUB_WEBHOOK_SECRET=<your-secret>
JWT_SECRET=<your-secret>
JWT_EXPIRE=7d
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
PR_SYNC_INTERVAL=*/30 * * * *
```

### Testing Backend

Test your backend deployment:

```bash
# Health check
curl https://dscwoc-production.up.railway.app/health

# Test API endpoint (example)
curl https://dscwoc-production.up.railway.app/api/v1/projects
```

**Note:** The root URL (`/`) will return a 404 error - this is normal since there's no route defined for it.

## Frontend Configuration

### Local Development

The frontend is now configured to use the Railway backend:

```env
VITE_API_URL=https://dscwoc-production.up.railway.app
```

### To Switch Back to Local Backend

Edit `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### Frontend Deployment

When you deploy your frontend (e.g., to Vercel, Netlify, etc.):

1. **Update Backend CORS**: In Railway, update the `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

2. **Set Frontend Environment Variables**:
   ```
   VITE_SUPABASE_URL=https://gcnkrugnklihpsvweuop.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-key>
   VITE_API_URL=https://dscwoc-production.up.railway.app
   ```

## Testing the Integration

1. **Start frontend**:
   ```bash
   cd Frontend
   npm run dev
   ```

2. **Test API connection** - Open browser console and check network requests

3. **Verify authentication flow** works with Railway backend

## Common Issues

### CORS Errors
- Make sure `CORS_ORIGIN=*` is set in Railway (or your frontend URL)
- Check that the frontend is using the correct `VITE_API_URL`

### 404 on Root URL
- This is normal - the root `/` endpoint doesn't exist
- Use `/health` or `/api/v1/...` endpoints instead

### Environment Variables Not Loading
- For Vite, variables must start with `VITE_`
- Restart the dev server after changing `.env` files
- For Railway, redeploy after updating environment variables

## API Endpoints

All API endpoints follow this pattern:
```
https://dscwoc-production.up.railway.app/api/v1/<resource>
```

Examples:
- `/api/v1/auth/login`
- `/api/v1/users/leaderboard`
- `/api/v1/projects`
- `/api/v1/pull-requests`
- `/api/v1/badges`
- `/api/v1/contact`
- `/api/v1/admin/*`
