const fs = require('fs');
const path = require('path');

const dir = 'd:/wamp64/www/APIUBL2.1-DOCS/docs/sandbox';
const files = fs.readdirSync(dir);

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.statSync(filePath).isFile() && file.endsWith('.md')) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    content = content.replace(/https:\/\/sandbox-api\.matias-api\.com/g, '{{SANDBOX_URL}}');
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
