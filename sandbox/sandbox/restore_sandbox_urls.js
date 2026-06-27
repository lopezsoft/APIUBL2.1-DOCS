const fs = require('fs');
const file = 'd:/wamp64/www/APIUBL2.1-DOCS/docs/sandbox/quickstart.md';
let content = fs.readFileSync(file, 'utf8');

// First replace all instances of {{SANDBOX_URL}}/ with {{SANDBOX_URL}}/api/ubl2.1/
// But wait, the table has `{{SANDBOX_URL}}` alone, so that's fine.
content = content.replace(/\{\{SANDBOX_URL\}\}\//g, '{{SANDBOX_URL}}/api/ubl2.1/');

// Now fix auth/login which doesn't have api/ubl2.1
content = content.replace(/\{\{SANDBOX_URL\}\}\/api\/ubl2\.1\/auth\/login/g, '{{SANDBOX_URL}}/auth/login');

fs.writeFileSync(file, content);
console.log('Restored URLs');
