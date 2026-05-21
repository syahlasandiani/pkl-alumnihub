const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Listing profiles in DB...");
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error("Error fetching profiles:", error);
  } else {
    console.log("Profiles in DB:", JSON.stringify(profiles, null, 2));
  }

  console.log("Listing verification requests in DB...");
  const { data: reqs, error: reqError } = await supabase.from('verification_requests').select('*');
  if (reqError) {
    console.error("Error fetching verification requests:", reqError);
  } else {
    console.log("Verification requests in DB:", JSON.stringify(reqs, null, 2));
  }
}

test();
