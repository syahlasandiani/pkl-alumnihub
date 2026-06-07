-- =====================================================
-- FIX KOMPREHENSIF - HAPUS SEMUA POLICY LAMA & BUAT ULANG
-- Jalankan ini di Supabase SQL Editor
-- =====================================================

-- =====================================================
-- TABEL: articles
-- =====================================================

-- Hapus SEMUA policy yang ada untuk articles
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'articles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.articles', pol.policyname);
  END LOOP;
END $$;

-- Buat ulang semua policy articles
CREATE POLICY "articles_select_all" ON public.articles
  FOR SELECT USING (true);

CREATE POLICY "articles_insert_verified" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = creator_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
        AND account_status = 'ACTIVE'
        AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
    )
  );

CREATE POLICY "articles_update_own" ON public.articles
  FOR UPDATE TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "articles_delete_own" ON public.articles
  FOR DELETE TO authenticated
  USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =====================================================
-- TABEL: events
-- =====================================================

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'events' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.events', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "events_select_all" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "events_insert_verified" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = creator_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
        AND account_status = 'ACTIVE'
        AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
    )
  );

CREATE POLICY "events_update_own" ON public.events
  FOR UPDATE TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "events_delete_own" ON public.events
  FOR DELETE TO authenticated
  USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =====================================================
-- TABEL: resources
-- =====================================================

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'resources' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.resources', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "resources_select_all" ON public.resources
  FOR SELECT USING (true);

CREATE POLICY "resources_insert_verified" ON public.resources
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = creator_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
        AND account_status = 'ACTIVE'
        AND (role = 'ADMIN' OR verification_status = 'VERIFIED')
    )
  );

CREATE POLICY "resources_update_own" ON public.resources
  FOR UPDATE TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "resources_delete_own" ON public.resources
  FOR DELETE TO authenticated
  USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- =====================================================
-- VERIFIKASI - cek policies yang sudah dibuat
-- =====================================================
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('articles', 'events', 'resources')
  AND schemaname = 'public'
ORDER BY tablename, cmd;
