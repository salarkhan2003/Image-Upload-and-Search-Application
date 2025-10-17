const { S3Client } = require('@aws-sdk/client-s3');

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const S3_CONFIG = {
  bucketName: process.env.S3_BUCKET_NAME,
  region: process.env.AWS_REGION || 'us-east-1',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
};

module.exports = {
  s3Client,
  S3_CONFIG,
};