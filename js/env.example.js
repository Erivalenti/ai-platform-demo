// env.example.js - example file. Copy to env.js and replace values.
// IMPORTANT: Do NOT commit env.js to git. Add env.js to .gitignore.
//
// For Vercel, set the environment variables in the project settings and use a build step
// or use a small script to inject them in production. For a simple static site, create env.js
// with the real values on the server (not in repository).

window.__env = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-public-anon-key"
};
