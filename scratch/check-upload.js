const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: files } = await supabase.storage.from('resources').list();
  console.log("Bucket resources files:", files);
  
  const { data: records } = await supabase.from('resources').select('title, file_url').limit(5);
  console.log("Table resources records:", records);
}
run();
