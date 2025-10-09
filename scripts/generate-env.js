
// scripts/generate-env.js
// Usage: node scripts/generate-env.js > ../ai-platform-demo-main/js/env.js
const fs = require('fs');
const out = `window.__env = {
  SUPABASE_URL: "${process.env.SUPABASE_URL || ''}",
  SUPABASE_ANON_KEY: "${process.env.SUPABASE_ANON_KEY || ''}"
};`;
fs.writeFileSync(process.argv[2] || '../js/env.js', out);
console.log('env written');
