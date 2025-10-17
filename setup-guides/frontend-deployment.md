# Frontend Deployment Guide

This guide covers deploying the React frontend to production platforms.

## Platform Comparison

| Platform | Free Tier | Build Time | CDN | Custom Domain | Best For |
|----------|-----------|------------|-----|---------------|----------|
| **Netlify** | 100GB bandwidth | Fast | Global | Yes | Static sites, forms |
| **Vercel** | 100GB bandwidth | Very fast | Global | Yes | React apps, serverless |
| **GitHub Pages** | Unlimited | Medium | Limited | Yes | Open source projects |
| **Firebase Hosting** | 10GB storage | Fast | Global | Yes | Google ecosystem |

## Option 1: Netlify Deployment

### Method 1: Git Integration (Recommended)

1. **Prepare Repository**
   ```bash
   # Ensure your code is pushed to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your repository

3. **Configure Build Settings**
   - Base directory: `frontend` (if monorepo)
   - Build command: `npm run build`
   - Publish directory: `build`

4. **Set Environment Variables**
   In Netlify dashboard, go to Site settings > Environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   REACT_APP_NAME=Image Upload & Search
   ```

5. **Configure Redirects**
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

6. **Deploy**
   - Click "Deploy site"
   - Monitor build process
   - Note your site URL (e.g., `https://amazing-app-123456.netlify.app`)

### Method 2: Manual Deploy

```bash
# Build the project
cd frontend
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

### Netlify Configuration File

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "build"
  base = "frontend"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Option 2: Vercel Deployment

### Method 1: Git Integration

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure Project**
   - Framework Preset: Create React App
   - Root Directory: `frontend` (if monorepo)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   REACT_APP_NAME=Image Upload & Search
   ```

4. **Deploy**
   - Click "Deploy"
   - Monitor build logs
   - Note your deployment URL

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod

# Set environment variables
vercel env add REACT_APP_API_URL production
```

### Vercel Configuration

Create `vercel.json` in frontend directory:

```json
{
  "version": 2,
  "name": "image-upload-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Option 3: GitHub Pages

### Setup

1. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure Repository**
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

## Option 4: Firebase Hosting

### Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   cd frontend
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "build",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "/static/**",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "public, max-age=31536000, immutable"
             }
           ]
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## Post-Deployment Configuration

### 1. Update Backend CORS

Update your backend environment variables:
```env
FRONTEND_URL=https://your-actual-frontend-domain.netlify.app
```

### 2. Test Application

```bash
# Test frontend loads
curl -I https://your-frontend-domain.com

# Test API connection from browser console
fetch('https://your-backend-url.com/health')
  .then(r => r.json())
  .then(console.log)
```

### 3. Configure Custom Domain

#### Netlify
1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

#### Vercel
1. Go to Project settings > Domains
2. Add domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

## Performance Optimization

### 1. Build Optimization

```json
// package.json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build"
  }
}
```

### 2. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
npx react-scripts build
npx webpack-bundle-analyzer build/static/js/*.js
```

### 3. Code Splitting

```javascript
// Lazy load pages
import { lazy, Suspense } from 'react';

const SearchPage = lazy(() => import('./pages/SearchPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 4. Image Optimization

```javascript
// Use WebP format when supported
const ImageComponent = ({ src, alt }) => {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img src={src} alt={alt} loading="lazy" />
    </picture>
  );
};
```

## Environment Variables

### Development (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Image Upload & Search (Dev)
```

### Production
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_NAME=Image Upload & Search
REACT_APP_VERSION=1.0.0
```

## Security Headers

### Netlify (_headers file)
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'

/static/*
  Cache-Control: public, max-age=31536000, immutable
```

### Vercel (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Monitoring and Analytics

### 1. Web Vitals

```bash
npm install web-vitals
```

```javascript
// src/index.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 2. Error Tracking

```bash
npm install @sentry/react
```

```javascript
// src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### 3. Google Analytics

```bash
npm install gtag
```

```javascript
// src/utils/analytics.js
export const gtag = (...args) => {
  window.gtag && window.gtag(...args);
};

export const trackEvent = (action, category, label, value) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**
   - Ensure variables start with `REACT_APP_`
   - Restart development server after changes
   - Check for typos in variable names

3. **Routing Issues (404 on refresh)**
   - Ensure redirects are configured
   - Check `_redirects` file for Netlify
   - Verify SPA routing configuration

4. **CORS Errors**
   - Update backend FRONTEND_URL
   - Check API URL in environment variables
   - Verify backend is deployed and accessible

### Debug Tips

1. **Check Build Logs**
   - Review deployment logs in platform dashboard
   - Look for missing dependencies or build errors

2. **Test Locally**
   ```bash
   # Build and serve locally
   npm run build
   npx serve -s build
   ```

3. **Network Tab**
   - Open browser dev tools
   - Check Network tab for failed requests
   - Verify API calls are going to correct URL

## Performance Checklist

- ✅ Bundle size optimized (< 1MB gzipped)
- ✅ Images are lazy loaded
- ✅ Code splitting implemented
- ✅ Service worker for caching
- ✅ Compression enabled
- ✅ CDN configured
- ✅ Cache headers set
- ✅ Lighthouse score > 90

## SEO Optimization

### 1. Meta Tags

```html
<!-- public/index.html -->
<meta name="description" content="Upload and search images with keywords - A modern image storage application">
<meta name="keywords" content="image upload, search, storage, photos">
<meta property="og:title" content="Image Upload & Search">
<meta property="og:description" content="Upload and search images with keywords">
<meta property="og:image" content="%PUBLIC_URL%/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
```

### 2. Structured Data

```javascript
// Add JSON-LD structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Image Upload & Search",
  "description": "Upload and search images with keywords",
  "url": "https://your-domain.com"
};
```

## Next Steps

After successful deployment:
1. ✅ Test all functionality in production
2. ✅ Set up monitoring and error tracking
3. ✅ Configure custom domain
4. ✅ Optimize performance based on metrics
5. ✅ Set up CI/CD for automatic deployments
6. ✅ Add analytics and user tracking