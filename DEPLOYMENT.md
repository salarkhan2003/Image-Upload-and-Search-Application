# Deployment Guide

This guide covers deploying the Image Upload and Search application to production.

## Architecture Overview

- **Frontend**: React.js app deployed on Netlify or Vercel
- **Backend**: Node.js API deployed on Railway or Render
- **Storage**: AWS S3 for image storage
- **Database**: In-memory storage (can be extended to MongoDB/PostgreSQL)

## Prerequisites

1. AWS Account with S3 access
2. GitHub repository with your code
3. Accounts on deployment platforms (Netlify/Vercel for frontend, Railway/Render for backend)

## Step 1: AWS S3 Setup

### Create S3 Bucket
1. Log into AWS Console
2. Navigate to S3 service
3. Create a new bucket with a unique name
4. Choose your preferred region
5. Keep default settings for now

### Configure Bucket Permissions
1. Go to bucket Permissions tab
2. Edit CORS configuration:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

### Create IAM User
1. Navigate to IAM service
2. Create new user with programmatic access
3. Attach custom policy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
        }
    ]
}
```
4. Save Access Key ID and Secret Access Key

## Step 2: Backend Deployment

### Option A: Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub account
   - Select your repository
   - Choose the backend folder if using monorepo

2. **Configure Environment Variables**
   ```
   NODE_ENV=production
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   FRONTEND_URL=https://your-frontend-domain.netlify.app
   ```

3. **Deploy**
   - Railway will automatically detect Node.js and deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Connect Repository**
   - Go to [Render](https://render.com)
   - Connect your GitHub account
   - Create new Web Service
   - Select your repository

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   FRONTEND_URL=https://your-frontend-domain.netlify.app
   ```

4. **Deploy**
   - Render will build and deploy automatically
   - Note the generated URL

## Step 3: Frontend Deployment

### Option A: Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub account
   - Select your repository

2. **Configure Build Settings**
   - Base directory: `frontend` (if using monorepo)
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   REACT_APP_NAME=Image Upload & Search
   ```

4. **Configure Redirects**
   - Create `frontend/public/_redirects` file:
   ```
   /*    /index.html   200
   ```

5. **Deploy**
   - Netlify will build and deploy automatically
   - Note the generated URL

### Option B: Vercel

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Connect your GitHub account
   - Import your repository

2. **Configure Project Settings**
   - Framework Preset: Create React App
   - Root Directory: `frontend` (if using monorepo)
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   REACT_APP_NAME=Image Upload & Search
   ```

4. **Deploy**
   - Vercel will build and deploy automatically

## Step 4: Update CORS Configuration

After deploying frontend, update backend environment variables:

1. Update `FRONTEND_URL` in your backend deployment
2. Set it to your actual frontend domain (e.g., `https://your-app.netlify.app`)
3. Redeploy backend if necessary

## Step 5: Testing

1. **Test Upload**
   - Visit your frontend URL
   - Try uploading an image
   - Check if it appears in S3 bucket

2. **Test Search**
   - Search for uploaded images
   - Verify pagination works
   - Test keyword functionality

3. **Test Performance**
   - Check image loading speed
   - Verify responsive design on mobile
   - Test error handling

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name
FRONTEND_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_NAME=Image Upload & Search
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_MULTIPLE_UPLOAD=true
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## Monitoring and Maintenance

### Health Checks
- Backend: `GET /health`
- Monitor response times and error rates

### Logs
- Check deployment platform logs for errors
- Monitor AWS CloudWatch for S3 access logs

### Updates
- Both platforms support automatic deployment on git push
- Test changes in staging environment first

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify FRONTEND_URL matches actual domain
   - Check S3 CORS configuration

2. **File Upload Fails**
   - Verify AWS credentials and permissions
   - Check S3 bucket policy
   - Ensure file size limits are correct

3. **Images Not Loading**
   - Check S3 bucket permissions
   - Verify signed URL generation
   - Test direct S3 access

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check environment variable names

### Performance Optimization

1. **Enable CDN**
   - Use CloudFront for S3 bucket
   - Enable caching on deployment platforms

2. **Image Optimization**
   - Backend already includes Sharp for compression
   - Consider WebP format for better compression

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor performance metrics
   - Set up uptime monitoring

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to git
   - Use platform-specific secret management

2. **S3 Security**
   - Use least-privilege IAM policies
   - Enable S3 access logging
   - Consider bucket encryption

3. **API Security**
   - Rate limiting is already implemented
   - Consider adding authentication for uploads
   - Monitor for abuse

## Cost Optimization

1. **S3 Storage**
   - Use S3 Intelligent Tiering
   - Set up lifecycle policies for old images
   - Monitor storage costs

2. **Deployment Platforms**
   - Most offer generous free tiers
   - Monitor usage to avoid overages
   - Consider upgrading for better performance

This completes the deployment setup for your Image Upload and Search application!