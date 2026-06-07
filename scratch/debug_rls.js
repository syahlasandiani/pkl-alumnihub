/**
 * Debug script - jalankan di browser console saat di halaman /alumni/create-post
 * Paste ke browser console untuk test RLS policy
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qhqgueqizbbwzimknihe.supabase.co',
  'sb_publishable_eAMl1NIP376zeVOWtR23eQ_SjSuDDsN'
);

async function testRLS() {
  // 1. Cek apakah user sudah login
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log('User:', user?.id, 'Auth Error:', authError);

  if (!user) {
    console.error('❌ User tidak login!');
    return;
  }

  // 2. Cek profile user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, verification_status, account_status')
    .eq('id', user.id)
    .single();
  
  console.log('Profile:', profile, 'Profile Error:', profileError);

  if (profile?.verification_status !== 'VERIFIED') {
    console.error('❌ User belum VERIFIED, status:', profile?.verification_status);
    return;
  }

  // 3. Test insert artikel
  const { data: testInsert, error: insertError } = await supabase
    .from('articles')
    .insert({
      creator_id: user.id,
      author_name: 'Test',
      title: 'RLS Test - Delete Me',
      content: 'Test content',
      status: 'PUBLISHED',
      published_at: new Date().toISOString(),
    })
    .select();
  
  console.log('Insert Result:', testInsert);
  console.log('Insert Error:', insertError);

  if (insertError) {
    console.error('❌ RLS BLOCKING INSERT:', insertError.code, insertError.message);
    console.error('Hint:', insertError.hint);
  } else {
    console.log('✅ RLS OK - Insert berhasil!');
    // Cleanup
    if (testInsert?.[0]?.id) {
      await supabase.from('articles').delete().eq('id', testInsert[0].id);
    }
  }
}

testRLS();
