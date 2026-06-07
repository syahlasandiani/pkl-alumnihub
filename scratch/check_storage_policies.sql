-- =====================================================
-- STORAGE BUCKET POLICIES FIX (Supabase correct syntax)
-- Jalankan di Supabase SQL Editor
-- =====================================================

-- STEP 1: Cek storage policies yang ada
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- STEP 2: Cek bucket mana saja yang ada
SELECT id, name, public FROM storage.buckets;
