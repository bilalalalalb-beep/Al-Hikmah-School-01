import { createClient } from '@supabase/supabase-js';

const url = 'https://xkrvidmepphwebewetjg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrcnZpZG1lcHBod2ViZXdldGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNTEyNDQsImV4cCI6MjEwMDYyNzI0NH0.AZKkgZjIENnPfGWetrki_i_btCWJLRTE8Sx7tUBP1w4';

const supabase = createClient(url, key);

async function testAuth() {
  const emails = ['admin123456@gmail.com', 'testuser@alhikmah.edu', 'principal@madrasa.pk', 'info@alhikmah.org'];
  for (const email of emails) {
    const res = await supabase.auth.signUp({
      email,
      password: 'Password123!'
    });
    console.log("SignUp for", email, "->", res.error ? res.error.message : "Success! User ID: " + res.data.user?.id);
  }
}

testAuth();
