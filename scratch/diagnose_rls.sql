-- =====================================================
-- STEP 1: Cek semua policies yang ada di tabel articles
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('articles', 'events', 'resources')
ORDER BY tablename, cmd;

-- =====================================================
-- STEP 2: Cek role & verification_status user saat ini
-- (Jalankan saat sudah login di aplikasi)
-- =====================================================
SELECT 
  id,
  role,
  verification_status,
  account_status,
  display_name
FROM public.profiles
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- STEP 3: Cek apakah RLS enabled di tabel articles
-- =====================================================
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('articles', 'events', 'resources')
AND schemaname = 'public';
