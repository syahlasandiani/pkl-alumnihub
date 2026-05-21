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
  const email = "test_1779350739584@gmail.com";
  const password = "password123";

  console.log(`Signing in user: ${email}...`);
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error("SignIn error:", signInError);
    return;
  }

  const user = signInData.user;
  console.log("SignIn successful! User ID:", user.id);
  const signUpData = signInData; // map to existing variable name

  // Simulate the exact supabase calls in src/app/api/verify-alumni/route.ts
  console.log("--- Simulating route.ts ---");
  const userClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  });
  
  await userClient.auth.setSession({
    access_token: signUpData.session?.access_token || '',
    refresh_token: signUpData.session?.refresh_token || ''
  });

  // Step 1: select profiles
  console.log("Step 1: Selecting from profiles...");
  const { data: profile, error: profileError } = await userClient
    .from("profiles")
    .select("role, verification_status, account_status")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.log("Profile query error (expected PGRST116):", profileError);
  } else {
    console.log("Profile query succeeded! Data:", profile);
  }

  // Step 2: insert into verification_requests directly
  console.log("Step 2: Inserting into verification_requests directly to see trigger error...");
  const { data: requestData, error: insertError } = await userClient
    .from("verification_requests")
    .insert({
      user_id: user.id,
      full_name: "Test API User",
      intake_year: 2023,
      program: "Beasiswa Unggulan",
      institution: "Universitas Diponegoro",
      status: "PENDING",
      submission_number: 1,
      admin_note: null,
      reviewed_by: null,
      reviewed_at: null,
    })
    .select("id")
    .single();

  if (insertError) {
    console.log("Insert verification_requests error:", insertError);
  } else {
    console.log("Insert verification_requests succeeded! Data:", requestData);
  }
}

run();
