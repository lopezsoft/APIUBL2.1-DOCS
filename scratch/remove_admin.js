const fs = require('fs');
const file = 'd:/wamp64/www/APIUBL2.1-DOCS/DOCUMENTACION/api-docs.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const suspectTags = ['Admin Companies', 'Coupons Admin', 'Membership Analytics'];
let removedCount = 0;

Object.entries(data.paths).forEach(([path, pathObj]) => {
  let remove = false;
  if (path.includes('/admin')) {
    remove = true;
  }
  Object.values(pathObj).forEach(methodObj => {
    if (methodObj.tags && methodObj.tags.some(tag => suspectTags.includes(tag))) {
      remove = true;
    }
  });
  
  if (remove) {
    delete data.paths[path];
    removedCount++;
  }
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log(`Removed ${removedCount} admin paths.`);
