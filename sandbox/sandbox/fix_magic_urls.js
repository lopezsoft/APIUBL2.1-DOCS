const fs = require('fs');
const file = 'd:/wamp64/www/APIUBL2.1-DOCS/docs/sandbox/magic-values.md';
let content = fs.readFileSync(file, 'utf8');

// Replace hardcoded URLs with {{SANDBOX_URL}}
content = content.replace(/https:\/\/sandbox-api\.matias-api\.com\/api\/ubl2\.1/g, '{{SANDBOX_URL}}');

fs.writeFileSync(file, content);
console.log('Fixed magic-values urls');
