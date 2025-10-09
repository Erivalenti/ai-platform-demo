// supabaseClient.js - initializes Supabase client for the browser.
// Expects window.__env to be defined (see js/env.example.js). Does not contain secrets.
(function(global){
  if(!global.__env){
    console.warn("window.__env not found. Create js/env.js from js/env.example.js with real values.");
    global.__env = { SUPABASE_URL: "", SUPABASE_ANON_KEY: "" };
  }
  // Expose client as window.supabase
  try {
    const supabaseUrl = global.__env.SUPABASE_URL;
    const supabaseKey = global.__env.SUPABASE_ANON_KEY;
    if(!supabaseUrl || !supabaseKey){
      console.warn("Supabase URL or ANON KEY missing in window.__env.");
    }
    // The Supabase library must be loaded before this file (cdn link in HTML)
    global.supabase = supabase.createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
})(window);
