const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', '74cea301-4f30-4b3b-b9d3-4675237d11a4')
    .single();
  
  if (error) {
    console.error('Error fetching user:', error.message);
  } else {
    console.log('User profile:', JSON.stringify(data, null, 2));
  }
}

check();
