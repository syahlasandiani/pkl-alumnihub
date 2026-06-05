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
  console.log("Checking enum types in Supabase...");

  // Run a raw SQL query using rpc or query public tables
  // Since we cannot run raw sql via public JS client directly unless we have an RPC,
  // let's try to query public tables or try inserting an invalid status to see the error message.
  
  console.log("Attempting to insert a verification_request with status 'APPROVED'...");
  const testId = "00000000-0000-0000-0000-000000000000"; // Dummy UUID
  
  // We can query a request or check if there is an error
  const { data, error } = await supabase
    .from("verification_requests")
    .select("status")
    .limit(1);

  if (error) {
    console.error("Error querying verification_requests:", error);
  } else {
    console.log("Query sample data:", data);
  }
  
  // Let's do a test insert with 'APPROVED' to see if it works or fails
  const { error: testApproveError } = await supabase
    .from("verification_requests")
    .insert({
      id: "00000000-0000-0000-0000-000000000000",
      user_id: "d1db56b2-fb0f-4ecf-86b2-60a2ed0b2330",
      full_name: "Test Check",
      intake_year: 2023,
      program: "Test",
      institution: "Test",
      status: "APPROVED"
    });
    
  if (testApproveError) {
    console.log("APPROVED insert failed with error:", testApproveError.message);
  } else {
    console.log("APPROVED insert succeeded! Thus, 'APPROVED' is a valid enum value.");
    // Clean up
    await supabase.from("verification_requests").delete().eq("id", "00000000-0000-0000-0000-000000000000");
  }

  // Let's do a test insert with 'VERIFIED' to see if it fails
  const { error: testVerifiedError } = await supabase
    .from("verification_requests")
    .insert({
      id: "00000000-0000-0000-0000-000000000000",
      user_id: "d1db56b2-fb0f-4ecf-86b2-60a2ed0b2330",
      full_name: "Test Check",
      intake_year: 2023,
      program: "Test",
      institution: "Test",
      status: "VERIFIED"
    });
    
  if (testVerifiedError) {
    console.log("VERIFIED insert failed with error:", testVerifiedError.message);
  } else {
    console.log("VERIFIED insert succeeded! Thus, 'VERIFIED' is a valid enum value.");
    // Clean up
    await supabase.from("verification_requests").delete().eq("id", "00000000-0000-0000-0000-000000000000");
  }
}

run();
