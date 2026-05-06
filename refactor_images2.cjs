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

  // Pattern 1: base_url + something.something
  // Avoid replacing if it's already inside our ternary!
  content = content.replace(/base_url\s*\+\s*([a-zA-Z0-9_.[\]]+)/g, (match, p1) => {
    if (originalContent.includes(`?.startsWith('http') ? ${p1}`)) return match; // already fixed
    return `(${p1}?.startsWith('http') ? ${p1} : base_url + ${p1})`;
  });

  // Pattern 2: `${base_url}${something}`
  content = content.replace(/\`\$\{base_url\}\$\{([a-zA-Z0-9_.[\]]+)\}\`/g, (match, p1) => {
    if (originalContent.includes(`?.startsWith('http') ? ${p1}`)) return match;
    return `(${p1}?.startsWith('http') ? ${p1} : \`\${base_url}\${${p1}}\`)`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});
console.log('Frontend image URLs updated extensively');
