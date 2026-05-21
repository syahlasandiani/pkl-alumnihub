const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
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
  console.log("Testing insert to verification_requests with random UUID...");
  
  const randomUuid = '00000000-0000-0000-0000-000000000000';

  // 1. Insert verification_requests without document_url
  const { data: insertReq, error: reqError } = await supabase.from('verification_requests').insert({
    user_id: randomUuid,
    full_name: 'Test Name',
    intake_year: 2020,
    program: 'Test Program',
    institution: 'Test Institution',
    status: 'PENDING',
    submission_number: 99
  }).select('id').single();

  if (reqError) {
    console.log("Insert verification_requests returned error:", reqError);
  } else {
    console.log("Insert verification_requests succeeded! Request ID:", insertReq.id);
  }
}

test();
