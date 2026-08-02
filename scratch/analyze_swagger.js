const fs = require('fs');
const file = 'd:/wamp64/www/APIUBL2.1-DOCS/DOCUMENTACION/api-docs.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const suspectTags = ['Admin Companies', 'Coupons Admin', 'Membership Analytics'];

const pathsToRemove = new Set();
Object.entries(data.paths).forEach(([path, pathObj]) => {
  if (path.includes('/admin')) {
    pathsToRemove.add(path);
  }
  Object.values(pathObj).forEach(methodObj => {
    if (methodObj.tags) {
      if (methodObj.tags.some(tag => suspectTags.includes(tag))) {
        pathsToRemove.add(path);
      }
    }
  });
});

console.log('Paths to remove:', Array.from(pathsToRemove));
