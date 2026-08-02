const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const resCls = await fetch(`${url}/rest/v1/classes?select=id,name_ur`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const classes = await resCls.json();
  console.log("CLASSES:", JSON.stringify(classes, null, 2));

  const resStd = await fetch(`${url}/rest/v1/students?select=id,first_name,current_class_id`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const stds = await resStd.json();
  console.log("STUDENTS:", JSON.stringify(stds, null, 2));
}

require('dotenv').config({ path: '.env.local' });
run();
