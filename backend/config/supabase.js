const { createClient } = require('@supabase/supabase-js');

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client with anon key for public operations
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

const SUPABASE_CONFIG = {
  url: supabaseUrl,
  bucketName: process.env.SUPABASE_STORAGE_BUCKET || 'images',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
};

module.exports = {
  supabaseAdmin,
  supabasePublic,
  SUPABASE_CONFIG,
};