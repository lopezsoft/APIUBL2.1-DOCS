const fs = require('fs');
const file = 'd:/wamp64/www/APIUBL2.1-DOCS/DOCUMENTACION/api-docs.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const endpointsByTag = {};
Object.entries(data.paths).forEach(([path, pathObj]) => {
  Object.entries(pathObj).forEach(([method, methodObj]) => {
    if (methodObj.tags) {
      methodObj.tags.forEach(tag => {
        if (!endpointsByTag[tag]) endpointsByTag[tag] = [];
        endpointsByTag[tag].push(`${method.toUpperCase()} ${path}`);
      });
    }
  });
});

console.log(JSON.stringify(endpointsByTag, null, 2));
