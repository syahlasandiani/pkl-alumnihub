-- ==========================================
-- SQL SCRIPT: MEMPERBAIKI RLS & TRIGGER PROFILES
-- Jalankan seluruh script ini di Supabase Console -> SQL Editor Anda
-- ==========================================

-- ----------------------------------------------------
-- BAGIAN 1: PERBAIKI RLS (ROW LEVEL SECURITY) PADA TABEL "profiles"
-- ----------------------------------------------------

-- Aktifkan RLS pada tabel profiles (jika belum aktif)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada bentrok (opsional)
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;

-- 1. Izinkan siapa saja (termasuk Guest) untuk membaca data profil (butuh untuk direktori/forum)
CREATE POLICY "Allow public read access to profiles"
ON public.profiles
FOR SELECT
USING (true);

-- 2. Izinkan user yang login untuk menginsert profilnya sendiri
CREATE POLICY "Allow users to insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 3. Izinkan user yang login untuk mengupdate profilnya sendiri
CREATE POLICY "Allow users to update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- ----------------------------------------------------
-- BAGIAN 2: BUAT TRIGGER OTOMATIS SAAT PENDAFTARAN (SIGNUP)
-- ----------------------------------------------------

-- 1. Fungsi trigger untuk membuat profil baru ketika user terdaftar di auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role, account_status, verification_status)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'display_name', 
      new.raw_user_meta_data->>'full_name', 
      split_part(new.email, '@', 1), 
      'User'
    ),
    'USER',
    'ACTIVE',
    'NONE'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Pasang trigger ke tabel auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ----------------------------------------------------
-- BAGIAN 3: MIGRASI UNTUK AKUN YANG SUDAH TERLANJUR TERDAFTAR (SEPERTI AKUN ANDA)
-- ----------------------------------------------------

-- Jalankan insert otomatis untuk user yang terdaftar di auth tetapi belum punya profil di public.profiles
INSERT INTO public.profiles (id, display_name, role, account_status, verification_status)
SELECT 
  id, 
  COALESCE(
    raw_user_meta_data->>'display_name', 
    raw_user_meta_data->>'full_name', 
    split_part(email, '@', 1), 
    'User'
  ),
  'USER',
  'ACTIVE',
  'NONE'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
