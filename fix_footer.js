const fs = require('fs');
const file = 'f:/New Projects/elbano/elbano_nextjs/components/footer.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldList = `            <ul className="flex flex-col gap-4">
              {[
                "Spanish Tiles",
                "Flat Tiles",
                "Curved Tiles",
                "Accessories",
                "New Arrivals"
              ].map((item) => (
                <li key={item}>
                  <Link href={\`/products/\${item.toLowerCase().replace(" ", "-")}\`} className="text-white/60 text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>`;

const newList = `            <ul className="flex flex-col gap-4">
              {products.length > 0 ? (
                products.map((item) => (
                  <li key={item.product_id}>
                    <Link href={\`/products/\${slugify(item.product_name)}\`} className="text-white/60 text-sm hover:text-white transition-colors line-clamp-1">
                      {item.product_name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-white/40 text-sm">Loading...</li>
              )}
            </ul>`;

content = content.replace(oldList.replace(/\\n/g, '\\r\\n'), newList);

fs.writeFileSync(file, content);
console.log('Fixed footer');
