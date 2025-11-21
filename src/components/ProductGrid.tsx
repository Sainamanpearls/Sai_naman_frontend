import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  in_stock: boolean;
  featured?: boolean;
}

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onViewProduct: (productSlug: string) => void;
  newProduct?: Product;
}

export default function ProductGrid({ onAddToCart, onViewProduct, newProduct }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products?featured=true`);
      let backendProducts: Product[] = [];

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) backendProducts = data;
        else if (data.products && Array.isArray(data.products)) backendProducts = data.products;

        backendProducts = backendProducts.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          price: p.price,
          discountedPrice: p.discountedPrice,
          images: p.images || [],
          in_stock: p.in_stock !== undefined ? p.in_stock : true,
          featured: p.featured || false,
        }));
      }

      setProducts(backendProducts.filter((p) => p.featured));
      setProducts(backendProducts);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newProduct) {
      setProducts((prev) => {
        if (!prev.find((p) => p.slug === newProduct.slug)) {
          return [newProduct, ...prev];
        }
        return prev;
      });
    }
  }, [newProduct]);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    toast.success(`${product.name} added to your bag!`, {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });
  };

  const visibleCount = isMobile ? 4 : 6;
  const visibleProducts = showAll ? products : products.slice(0, visibleCount);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${window.location.origin}/product/${p.slug}`,
      "name": p.name,
      "image": p.images?.[0] || '',
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": p.discountedPrice ?? p.price,
        "availability": p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    })),
  };

  if (loading) {
    return (
      <section className="py-24 bg-zinc-950">
        <div className="text-center text-zinc-400">Loading products...</div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-black via-slate-900 to-black py-20 text-white overflow-hidden">
      <Helmet>
        <title>Featured Pieces | Shop Our Best Sellers</title>
        <meta name="description" content="Explore our best-selling products. Premium quality pieces curated for you." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none z-10" />
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light tracking-widest text-white mb-4">FEATURED PIECES</h2>
          <p className="text-zinc-400 tracking-wide">Check Out Our Customer Favorites — Best Sellers!</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-black border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-all duration-500"
              style={{ animation: `fade-in-up 0.8s ease-out ${index * 0.1}s both` }}
            >
              <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => onViewProduct(product.slug)}>
                <img
                  src={
                    product.images[0]
                      ? product.images[0].replace(
                        "/upload/",
                        "/upload/f_auto,q_auto,w_600,c_fill/"
                      )
                      : ""
                  }
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <button
                  onClick={(e) => handleAdd(product, e)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm flex items-center space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-500"
                >
                  <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="tracking-wider">ADD TO BAG</span>
                </button>
              </div>

              <div className="p-4 sm:p-6 cursor-pointer" onClick={() => onViewProduct(product.slug)}>
                <h3 className="text-base sm:text-xl font-light tracking-wide text-white mb-1 sm:mb-2">{product.name}</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mb-2 line-clamp-2">{product.description}</p>

                {/* Price + Discount */}
                <div className="flex flex-col">
                  {product.discountedPrice && product.discountedPrice < product.price ? (
                    <>
                      <span className="text-lg sm:text-2xl text-white tracking-wider line-through opacity-50">
                        ₹ {product.price.toLocaleString()}
                      </span>
                      <span className="text-lg sm:text-2xl text-white font-semibold tracking-wider">
                        ₹ {product.discountedPrice.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg sm:text-2xl text-white tracking-wider">
                      ₹ {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length > visibleCount && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-block px-10 py-3 border border-zinc-700 text-white tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300"
            >
              {showAll ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
