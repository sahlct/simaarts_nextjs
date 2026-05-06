const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const dirsToSearch = ['app', 'components', 'apps/admin'];
let allFiles = [];
dirsToSearch.forEach(d => {
  const p = path.join(__dirname, d);
  if (fs.existsSync(p)) {
    allFiles = allFiles.concat(walkDir(p));
  }
});

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We want to replace standard template literals like `${base_url}${item.image}` 
  // with a small helper logic: `item.image?.startsWith('http') ? item.image : \`${base_url}${item.image}\``
  // This is tricky with regex, but we can do a targeted regex for the most common patterns:
  
  // Pattern 1: src={`${base_url}${variable}`}
  content = content.replace(/src=\{\`\$\{base_url\}\$\{([^}]+)\}\`\}/g, "src={$1?.startsWith('http') ? $1 : `${base_url}${$1}`}");
  
  // Pattern 2: src={base_url + variable}
  content = content.replace(/src=\{base_url\s*\+\s*([a-zA-Z0-9_.]+)\}/g, "src={$1?.startsWith('http') ? $1 : base_url + $1}");

  // Pattern 3: URL inside url() like style={{ backgroundImage: `url(${base_url}${item.image})` }}
  // We can just replace `${base_url}${variable}` when it's inside `url(...)`
  content = content.replace(/url\(\`\$\{base_url\}\$\{([^}]+)\}\`\)/g, "url(`${$1?.startsWith('http') ? $1 : `${base_url}${$1}`}`)");

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});
console.log('Frontend image URLs updated');
