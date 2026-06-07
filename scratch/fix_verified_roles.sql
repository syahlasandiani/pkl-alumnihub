-- Skrip ini menyelaraskan role user yang sudah terlanjur terverifikasi (VERIFIED)
-- tetapi masih memiliki role 'USER', diubah menjadi 'ALUMNI'.
-- Jalankan di SQL Editor pada Supabase Dashboard.

UPDATE public.profiles
SET role = 'ALUMNI'
WHERE verification_status = 'VERIFIED' AND role = 'USER';
