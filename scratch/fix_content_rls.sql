-- Skrip ini memperbarui RLS policy pada tabel articles, events, dan resources
-- agar mengizinkan pengguna dengan verification_status = 'VERIFIED' (atau role = 'ADMIN')
-- untuk melakukan INSERT tanpa diblokir RLS Supabase.
-- Jalankan di SQL Editor pada Supabase Dashboard.

-- ============================================================
-- Perbaikan RLS Policy untuk tabel: articles
-- ============================================================
DROP POLICY IF EXISTS "Allow verified users to insert articles" ON public.articles;
CREATE POLICY "Allow verified users to insert articles" ON public.articles
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = creator_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
  )
);

-- ============================================================
-- Perbaikan RLS Policy untuk tabel: events
-- ============================================================
DROP POLICY IF EXISTS "Allow verified users to insert events" ON public.events;
CREATE POLICY "Allow verified users to insert events" ON public.events
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = creator_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
  )
);

-- ============================================================
-- Perbaikan RLS Policy untuk tabel: resources
-- ============================================================
DROP POLICY IF EXISTS "Allow verified users to insert resources" ON public.resources;
CREATE POLICY "Allow verified users to insert resources" ON public.resources
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = creator_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
  )
);
