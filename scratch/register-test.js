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

async function run() {
  const email = `test_${Date.now()}@gmail.com`;
  const password = "password123";

  console.log(`Signing up user: ${email}...`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: "Test User From Script"
      }
    }
  });

  if (signUpError) {
    console.error("SignUp error:", signUpError);
    return;
  }

  const user = signUpData.user;
  console.log("SignUp successful! User ID:", user.id);

  // Authenticate as this new user
  const userClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  });
  
  await userClient.auth.setSession({
    access_token: signUpData.session?.access_token || '',
    refresh_token: signUpData.session?.refresh_token || ''
  });

  console.log("Checking if profile row is created for the new user...");
  const { data: profile, error: profileError } = await userClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.log("Profile query returned error:", profileError);
  } else {
    console.log("Profile row exists in DB:", profile);
  }
}

run();
