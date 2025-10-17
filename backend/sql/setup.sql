-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  file_size BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_images_upload_date ON images(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_images_keywords ON images USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_images_original_name ON images(original_name);

-- Enable Row Level Security (RLS)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Images are viewable by everyone" ON images
  FOR SELECT USING (true);

CREATE POLICY "Images can be inserted by everyone" ON images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Images can be updated by everyone" ON images
  FOR UPDATE USING (true);

CREATE POLICY "Images can be deleted by everyone" ON images
  FOR DELETE USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Anyone can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can update images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Anyone can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');

-- Create function for table creation (used by the service)
CREATE OR REPLACE FUNCTION create_images_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This function is called by the service to ensure table exists
  -- The actual table creation is handled above
  RETURN;
END;
$$ LANGUAGE plpgsql;