const fs = require('fs');
const file = 'd:/wamp64/www/APIUBL2.1-DOCS/docs/sandbox/quickstart.md';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\{\{SANDBOX_URL\}\}\/api\/ubl2\.1/g, '{{SANDBOX_URL}}');
fs.writeFileSync(file, content);
console.log('Done');
