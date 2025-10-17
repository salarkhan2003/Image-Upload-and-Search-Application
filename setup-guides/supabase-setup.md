# Supabase Setup Guide

This guide will help you set up Supabase for the Image Upload and Search application.

## 🚀 **Why Supabase?**

Supabase provides:
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: File storage with CDN
- **Authentication**: Built-in user management
- **API**: Auto-generated REST and GraphQL APIs
- **Dashboard**: Easy-to-use web interface

## 📋 **Prerequisites**

- A Supabase account (free tier available)
- Basic understanding of SQL (optional)

## 🔧 **Step 1: Create Supabase Project**

1. **Sign up for Supabase**:
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with GitHub, Google, or email

2. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: `image-upload-search`
   - Enter database password (save this!)
   - Select region closest to your users
   - Click "Create new project"

3. **Wait for setup** (2-3 minutes)

## 🗄️ **Step 2: Set Up Database**

1. **Go to SQL Editor**:
   - In your Supabase dashboard
   - Click "SQL Editor" in the sidebar

2. **Run the setup script**:
   - Copy the contents of `backend/sql/setup.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

3. **Verify tables created**:
   - Go to "Table Editor"
   - You should see the `images` table

## 📁 **Step 3: Configure Storage**

1. **Go to Storage**:
   - Click "Storage" in the sidebar
   - The `images` bucket should already be created

2. **Verify bucket settings**:
   - Click on the `images` bucket
   - Ensure it's set to "Public"
   - Check that policies are applied

## 🔑 **Step 4: Get API Keys**

1. **Go to Settings**:
   - Click "Settings" in the sidebar
   - Click "API" in the settings menu

2. **Copy your credentials**:
   ```
   Project URL: https://your-project-id.supabase.co
   API Key (anon): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   API Key (service_role): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Update environment files**:

   **Backend (.env)**:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_KEY=your_service_key_here
   ```

   **Frontend (.env)**:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 🔒 **Step 5: Configure Security (Optional)**

### **Row Level Security (RLS)**

The setup script enables RLS with public policies. For production, you might want to restrict access:

1. **Update policies in SQL Editor**:
   ```sql
   -- Example: Only authenticated users can upload
   DROP POLICY IF EXISTS "Images can be inserted by everyone" ON images;
   CREATE POLICY "Authenticated users can insert images" ON images
     FOR INSERT WITH CHECK (auth.role() = 'authenticated');
   ```

### **Storage Policies**

Similarly, you can restrict storage access:

```sql
-- Example: Only authenticated users can upload files
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

## 🧪 **Step 6: Test the Setup**

1. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend
   npm install
   ```

2. **Start the servers**:
   ```bash
   # Backend (terminal 1)
   cd backend
   npm run dev

   # Frontend (terminal 2)
   cd frontend
   npm start
   ```

3. **Test functionality**:
   - Upload an image
   - Search for images
   - Check Supabase dashboard for data

## 📊 **Step 7: Monitor Usage**

1. **Database Usage**:
   - Go to "Settings" → "Usage"
   - Monitor database size and requests

2. **Storage Usage**:
   - Go to "Storage" → "Usage"
   - Monitor file storage and bandwidth

3. **API Usage**:
   - Monitor API requests and performance

## 🚀 **Step 8: Production Deployment**

### **Environment Variables for Production**

**Backend (Railway/Render)**:
```env
NODE_ENV=production
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (Netlify/Vercel)**:
```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **"relation 'images' does not exist"**:
   - Run the SQL setup script again
   - Check if the table was created in Table Editor

2. **"RLS policy violation"**:
   - Check your RLS policies
   - Ensure policies allow the operation you're trying

3. **"Storage bucket not found"**:
   - Verify the bucket name in your environment variables
   - Check if the bucket exists in Storage

4. **"Invalid API key"**:
   - Double-check your API keys
   - Ensure you're using the correct key (anon vs service_role)

### **Useful SQL Queries**

```sql
-- Check if images table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'images';

-- View all images
SELECT * FROM images ORDER BY upload_date DESC;

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'images';

-- View table policies
SELECT * FROM pg_policies WHERE tablename = 'images';
```

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

## 💡 **Pro Tips**

1. **Use the Supabase CLI** for local development
2. **Set up database backups** for production
3. **Monitor your usage** to avoid unexpected charges
4. **Use environment-specific projects** (dev, staging, prod)
5. **Enable database webhooks** for real-time features

Your Supabase setup is now complete! 🎉