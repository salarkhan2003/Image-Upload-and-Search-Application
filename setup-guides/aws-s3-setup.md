# AWS S3 Setup Guide

This guide walks you through setting up AWS S3 for the Image Upload application.

## Step 1: Create AWS Account

1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Sign up for a new account or sign in to existing account
3. Complete the verification process

## Step 2: Create S3 Bucket

1. **Navigate to S3**
   - In AWS Console, search for "S3"
   - Click on "S3" service

2. **Create Bucket**
   - Click "Create bucket"
   - Choose a unique bucket name (e.g., `your-app-images-bucket-2024`)
   - Select your preferred region (e.g., `us-east-1`)
   - Keep default settings for now
   - Click "Create bucket"

## Step 3: Configure Bucket CORS

1. **Open your bucket**
   - Click on your newly created bucket name

2. **Go to Permissions tab**
   - Click on "Permissions" tab
   - Scroll down to "Cross-origin resource sharing (CORS)"

3. **Edit CORS configuration**
   - Click "Edit"
   - Replace with this configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

4. **Save changes**
   - Click "Save changes"

## Step 4: Create IAM User

1. **Navigate to IAM**
   - In AWS Console, search for "IAM"
   - Click on "IAM" service

2. **Create User**
   - Click "Users" in left sidebar
   - Click "Create user"
   - Enter username: `image-upload-app-user`
   - Select "Programmatic access"
   - Click "Next"

3. **Set Permissions**
   - Click "Attach policies directly"
   - Click "Create policy"
   - Click "JSON" tab
   - Replace with this policy (replace `YOUR_BUCKET_NAME`):

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

4. **Complete Policy Creation**
   - Click "Next: Tags" (skip tags)
   - Click "Next: Review"
   - Name: `ImageUploadS3Policy`
   - Description: `Policy for image upload application S3 access`
   - Click "Create policy"

5. **Attach Policy to User**
   - Go back to user creation
   - Refresh and search for `ImageUploadS3Policy`
   - Select the policy
   - Click "Next"
   - Click "Create user"

6. **Save Credentials**
   - **IMPORTANT**: Copy and save the Access Key ID and Secret Access Key
   - You won't be able to see the Secret Access Key again!

## Step 5: Test Configuration

You can test your S3 setup using AWS CLI:

```bash
# Install AWS CLI
npm install -g aws-cli

# Configure credentials
aws configure
# Enter your Access Key ID
# Enter your Secret Access Key
# Enter your region (e.g., us-east-1)
# Enter output format: json

# Test bucket access
aws s3 ls s3://your-bucket-name
```

## Step 6: Update Environment Variables

Add these to your backend `.env` file:

```env
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name-here
```

## Security Best Practices

### 1. Bucket Security
- Never make your bucket publicly readable/writable
- Use IAM policies for access control
- Enable versioning for important data
- Consider enabling encryption at rest

### 2. Access Keys Security
- Never commit access keys to version control
- Use environment variables for credentials
- Rotate access keys regularly
- Use least privilege principle

### 3. CORS Configuration
- In production, replace `"*"` in AllowedOrigins with your actual domain
- Example: `["https://your-app.netlify.app", "https://your-app.com"]`

## Troubleshooting

### Common Issues

1. **Access Denied Errors**
   - Check IAM policy has correct bucket name
   - Verify access keys are correct
   - Ensure user has the policy attached

2. **CORS Errors**
   - Verify CORS configuration is saved
   - Check AllowedOrigins includes your frontend domain
   - Clear browser cache

3. **Bucket Not Found**
   - Verify bucket name in environment variables
   - Check bucket exists in correct region
   - Ensure no typos in bucket name

### Testing Upload

You can test image upload using curl:

```bash
# First, get a presigned URL from your backend
curl -X POST http://localhost:5000/api/upload \
  -F "image=@test-image.jpg" \
  -F 'keywords=["test"]'
```

## Cost Optimization

### S3 Pricing
- First 5GB free per month (12 months)
- $0.023 per GB per month after free tier
- PUT requests: $0.0005 per 1,000 requests
- GET requests: $0.0004 per 10,000 requests

### Cost Saving Tips
1. **Lifecycle Policies**: Move old images to cheaper storage classes
2. **Intelligent Tiering**: Automatically optimize storage costs
3. **Monitor Usage**: Set up billing alerts
4. **Delete Unused Objects**: Clean up test uploads

### Example Lifecycle Policy
```json
{
    "Rules": [
        {
            "ID": "MoveToIA",
            "Status": "Enabled",
            "Transitions": [
                {
                    "Days": 30,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "Days": 90,
                    "StorageClass": "GLACIER"
                }
            ]
        }
    ]
}
```

## Next Steps

After completing S3 setup:
1. ✅ Test backend connection to S3
2. ✅ Upload a test image through your app
3. ✅ Verify images appear in S3 console
4. ✅ Test image retrieval and display
5. ✅ Deploy to production with proper CORS settings

## Support

If you encounter issues:
1. Check AWS CloudTrail for API call logs
2. Review S3 access logs
3. Use AWS Support (if you have a support plan)
4. Check AWS documentation: https://docs.aws.amazon.com/s3/