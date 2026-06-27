const fs = require('fs');

const filesToUpdate = [
  'd:/wamp64/www/APIUBL2.1-DOCS/blog/2026-05-30-Version-3-0-7-Lanzamiento-Ambiente-Sandbox.md',
  'd:/wamp64/www/APIUBL2.1-DOCS/sandbox/sandbox/MAGIC-VALUES.md',
  'd:/wamp64/www/APIUBL2.1-DOCS/sandbox/sandbox/QUICKSTART.md',
  'd:/wamp64/www/APIUBL2.1-DOCS/sandbox/sandbox/TEST-CERT.md'
];

filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    content = content.replace(/https:\/\/sandbox-api\.matias-api\.com/g, '{{SANDBOX_URL}}');
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
