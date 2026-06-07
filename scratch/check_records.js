const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const tables = ['profiles', 'alumni_profiles', 'articles', 'events', 'resources', 'alumni_experiences'];
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Error fetching from ${table}:`, error.message);
    } else {
      console.log(`\n--- ${table} Sample ---`);
      console.log(JSON.stringify(data[0], null, 2));
    }
  }
}

check();
