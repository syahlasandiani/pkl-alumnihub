-- =====================================================
-- FIX STORAGE BUCKET POLICIES - Supabase
-- Jalankan di Supabase SQL Editor
-- =====================================================

-- Hapus semua policies lama untuk storage objects
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- =====================================================
-- Bucket: articles (gambar cover artikel)
-- =====================================================
CREATE POLICY "articles_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'articles');

CREATE POLICY "articles_storage_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'articles' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND account_status = 'ACTIVE'
        AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
    )
  );

CREATE POLICY "articles_storage_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'articles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "articles_storage_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'articles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- Bucket: events (banner event)
-- =====================================================
CREATE POLICY "events_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'events');

CREATE POLICY "events_storage_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'events' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND account_status = 'ACTIVE'
        AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
    )
  );

CREATE POLICY "events_storage_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'events' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "events_storage_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'events' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- Bucket: resources (file upload alumni)
-- =====================================================
CREATE POLICY "resources_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'resources');

CREATE POLICY "resources_storage_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'resources' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND account_status = 'ACTIVE'
        AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
    )
  );

CREATE POLICY "resources_storage_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'resources' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "resources_storage_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'resources' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- Bucket: avatars (foto profil)
-- =====================================================
CREATE POLICY "avatars_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_storage_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "avatars_storage_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_storage_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- Verifikasi policies yang sudah dibuat
-- =====================================================
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;
