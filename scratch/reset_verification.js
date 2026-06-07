const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('verification_requests')
    .update({ status: 'PENDING', reviewed_by: null, reviewed_at: null })
    .eq('status', 'APPROVED');
    
  if (error) console.error("Error resetting requests:", error);
  else console.log("Success resetting requests to PENDING.");
  
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ role: 'USER', verification_status: 'PENDING' })
    .neq('role', 'ADMIN');
    
  if (profileErr) console.error("Error resetting profiles:", profileErr);
  else console.log("Success resetting profiles to USER.");
}

run();
