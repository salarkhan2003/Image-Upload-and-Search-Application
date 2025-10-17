# Backend Deployment Guide

This guide covers deploying the Node.js backend to production platforms.

## Platform Options

| Platform | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| **Railway** | 500 hours/month | Easy setup, GitHub integration | Limited free hours |
| **Render** | 750 hours/month | More free hours, good performance | Slower cold starts |
| **Heroku** | Discontinued free tier | Mature platform | Paid only |
| **Vercel** | Serverless functions | Great for APIs | Function timeout limits |

## Option 1: Railway Deployment

### Prerequisites
- GitHub account with your code
- Railway account (free)

### Steps

1. **Prepare Repository**
   ```bash
   # Ensure your code is pushed to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Build Settings**
   Railway auto-detects Node.js projects, but you can customize:
   - Build Command: `npm install` (automatic)
   - Start Command: `npm start` (automatic)
   - Root Directory: `backend` (if using monorepo)

4. **Set Environment Variables**
   In Railway dashboard, go to Variables tab:
   ```
   NODE_ENV=production
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   FRONTEND_URL=https://your-frontend-domain.netlify.app
   ```

5. **Deploy**
   - Railway automatically deploys on push to main branch
   - Monitor deployment in the dashboard
   - Note your app URL (e.g., `https://your-app.railway.app`)

6. **Custom Domain (Optional)**
   - Go to Settings > Domains
   - Add your custom domain
   - Configure DNS records as shown

### Railway Configuration File

Create `railway.toml` in your backend directory:

```toml
[build]
buildCommand = "npm install"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

## Option 2: Render Deployment

### Steps

1. **Connect Repository**
   - Go to [Render](https://render.com)
   - Sign up with GitHub
   - Click "New +" > "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `image-upload-backend`
   - Environment: `Node`
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: `backend` (if monorepo)

3. **Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables**
   Add in Render dashboard:
   ```
   NODE_ENV=production
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   FRONTEND_URL=https://your-frontend-domain.netlify.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Monitor build logs
   - Note your service URL

### Render Configuration File

Create `render.yaml`:

```yaml
services:
  - type: web
    name: image-upload-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
```

## Option 3: Vercel Deployment (Serverless)

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure for Serverless**
   Create `vercel.json` in backend directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```

3. **Modify server.js**
   Add export for Vercel:
   ```javascript
   // At the end of server.js
   module.exports = app;
   ```

4. **Deploy**
   ```bash
   cd backend
   vercel --prod
   ```

5. **Set Environment Variables**
   ```bash
   vercel env add NODE_ENV production
   vercel env add AWS_ACCESS_KEY_ID your_key
   vercel env add AWS_SECRET_ACCESS_KEY your_secret
   # ... add other variables
   ```

## Post-Deployment Steps

### 1. Test API Endpoints

```bash
# Health check
curl https://your-backend-url.com/health

# Test upload (with a test image)
curl -X POST https://your-backend-url.com/api/upload \
  -F "image=@test.jpg" \
  -F 'keywords=["test"]'

# Test search
curl "https://your-backend-url.com/api/search?q=test"
```

### 2. Monitor Performance

- **Railway**: Built-in metrics dashboard
- **Render**: Performance metrics in dashboard
- **Vercel**: Analytics and function logs

### 3. Set Up Monitoring

Add health check monitoring:

```javascript
// In server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});
```

### 4. Configure Logging

Add structured logging:

```bash
npm install winston
```

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

## Environment Variables Reference

### Required Variables
```env
NODE_ENV=production
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name
```

### Optional Variables
```env
PORT=5000                    # Auto-set by platforms
FRONTEND_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=10485760      # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version in package.json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

2. **Environment Variable Issues**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure no spaces around values

3. **CORS Errors**
   - Update FRONTEND_URL to match actual frontend domain
   - Redeploy after changing environment variables

4. **S3 Connection Issues**
   - Test AWS credentials locally first
   - Verify S3 bucket exists and is accessible
   - Check IAM permissions

### Debugging Tips

1. **Check Logs**
   ```bash
   # Railway
   railway logs

   # Render
   # View logs in dashboard

   # Vercel
   vercel logs
   ```

2. **Test Locally with Production Config**
   ```bash
   NODE_ENV=production npm start
   ```

3. **Use Health Check Endpoint**
   ```bash
   curl https://your-api.com/health
   ```

## Performance Optimization

### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching Headers
```javascript
app.use('/api/images', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

### 3. Database Connection Pooling
If you add a database later:
```javascript
// For PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Security Checklist

- ✅ Environment variables are secure
- ✅ CORS is configured for specific origins
- ✅ Rate limiting is enabled
- ✅ Input validation is implemented
- ✅ Error messages don't expose sensitive data
- ✅ HTTPS is enforced (automatic on platforms)
- ✅ Security headers are set (Helmet.js)

## Scaling Considerations

### Horizontal Scaling
- Most platforms auto-scale based on traffic
- Configure scaling rules in platform dashboard

### Database Migration
When you outgrow in-memory storage:
1. Add PostgreSQL or MongoDB
2. Update image service to use database
3. Migrate existing data

### CDN Integration
For better performance:
1. Set up CloudFront for S3 bucket
2. Update image URLs to use CDN
3. Configure cache headers

## Next Steps

After successful deployment:
1. ✅ Update frontend environment variables with backend URL
2. ✅ Test full application flow
3. ✅ Set up monitoring and alerts
4. ✅ Configure custom domain (optional)
5. ✅ Set up CI/CD pipeline for automatic deployments