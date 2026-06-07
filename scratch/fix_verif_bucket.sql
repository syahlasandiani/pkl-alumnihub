-- =====================================================
-- FIX STORAGE BUCKET POLICIES untuk Verifikasi
-- Jalankan di Supabase SQL Editor
-- =====================================================

-- 1. Pastikan bucket verification-documents sudah ada dan di-set public
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Hapus policy lama (jika ada) agar tidak duplikat
DROP POLICY IF EXISTS "verification_documents_insert" ON storage.objects;
DROP POLICY IF EXISTS "verification_documents_select" ON storage.objects;

-- 3. Izinkan User yang sudah login (authenticated) untuk mengunggah (INSERT)
CREATE POLICY "verification_documents_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'verification-documents');

-- 4. Izinkan Publik (termasuk Admin) untuk melihat/mendownload file (SELECT)
CREATE POLICY "verification_documents_select" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'verification-documents');
