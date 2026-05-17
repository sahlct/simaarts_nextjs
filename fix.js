const fs = require('fs');
const file = 'f:/New Projects/elbano/elbano_nextjs/app/(public)/products/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldGallery = `            {Array.isArray(product.other_images) && product.other_images.length > 0 && (
              <div className="grid grid-cols-4 md:flex gap-2 md:gap-4 pb-2">
                {product.other_images.map((img: any, i: number) => {
                  const fullImg = (img?.startsWith('http') ? img : base_url + img);
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(fullImg)}
                      className={\`relative aspect-square md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all \${activeImage === fullImg ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-white/5 bg-white/5 hover:border-white/20"
                        }\`}
                    >
                      <img src={fullImg} alt="" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}`;

const newGallery = `            {Array.isArray(product.other_images) && product.other_images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 md:gap-4 pb-2 w-full">
                {Array.from({ length: 4 }).map((_, i) => {
                  const img = product.other_images[i];
                  if (img) {
                    const fullImg = (img?.startsWith('http') ? img : base_url + img);
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveImage(fullImg)}
                        className={\`relative aspect-square w-full rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all \${activeImage === fullImg ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-white/5 bg-white/5 hover:border-white/20"
                          }\`}
                      >
                        <img src={fullImg} alt="" className="w-full h-full object-cover" />
                      </button>
                    );
                  }
                  return (
                    <div
                      key={\`placeholder-\${i}\`}
                      className="relative aspect-square w-full rounded-xl md:rounded-2xl border-2 border-dashed border-white/10 bg-white/5"
                    />
                  );
                })}
              </div>
            )}`;

// Normalize newlines before replacing
content = content.replace(/\\r\\n/g, '\\n');
content = content.replace(oldGallery.replace(/\\r\\n/g, '\\n'), newGallery);

const oldPriceText = "Price: ₹${product.price}";
const newPriceText = "Subcategory: ${product.SubCategory?.sub_category_name || \\\"-\\\"}";
content = content.replace(oldPriceText, newPriceText);

fs.writeFileSync(file, content);
console.log('Fixed file');
