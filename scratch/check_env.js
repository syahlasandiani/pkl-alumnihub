console.log('Env variables starting with SUPABASE or NEXT_PUBLIC:');
for (const key of Object.keys(process.env)) {
  if (key.startsWith('SUPABASE') || key.startsWith('NEXT_PUBLIC')) {
    console.log(`${key}=${process.env[key] ? '***' + process.env[key].substring(process.env[key].length - 5) : 'empty'}`);
  }
}
