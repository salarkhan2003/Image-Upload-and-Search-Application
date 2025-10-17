# Image Upload Backend

Express.js backend API for the Image Upload and Search application.

## Features

- Image upload to AWS S3 with optimization
- Keyword-based search functionality
- File validation and security
- RESTful API endpoints
- Error handling and logging
- Rate limiting and CORS protection

## Prerequisites

- Node.js 18+ 
- AWS S3 bucket with proper permissions
- AWS credentials (Access Key ID and Secret Access Key)

## Installation

1. Clone the repository and navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## AWS S3 Setup

1. Create an S3 bucket in your AWS console
2. Create an IAM user with programmatic access
3. Attach the following policy to the IAM user:

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
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name"
        }
    ]
}
```

4. Configure CORS for your S3 bucket:
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

## Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Image Upload
- `POST /api/upload` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

### Image Retrieval
- `GET /api/images` - Get all images with pagination
- `GET /api/images/:id` - Get single image by ID
- `GET /api/search` - Search images by keywords

### Statistics
- `GET /api/stats` - Get upload statistics

## Request/Response Examples

### Upload Image
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "image=@/path/to/image.jpg" \
  -F 'keywords=["nature", "sunset", "landscape"]'
```

### Search Images
```bash
curl "http://localhost:5000/api/search?q=nature&page=1&limit=12"
```

## Deployment

### Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Render
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Configure build and start commands:
   - Build Command: `npm install`
   - Start Command: `npm start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment mode | No (default: development) |
| AWS_ACCESS_KEY_ID | AWS access key | Yes |
| AWS_SECRET_ACCESS_KEY | AWS secret key | Yes |
| AWS_REGION | AWS region | Yes |
| S3_BUCKET_NAME | S3 bucket name | Yes |
| FRONTEND_URL | Frontend URL for CORS | No |
| MAX_FILE_SIZE | Max file size in bytes | No (default: 10MB) |
| ALLOWED_FILE_TYPES | Allowed MIME types | No |

## Security Features

- File type validation
- File size limits
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Joi
- Error handling without sensitive data exposure

## Performance Optimizations

- Image compression with Sharp
- Memory-efficient file handling
- Lazy loading support
- Signed URLs for secure access
- Efficient pagination