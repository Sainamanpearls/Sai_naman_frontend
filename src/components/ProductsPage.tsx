import { useEffect, useState } from 'react';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { localProducts } from '../data/products';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface CategoryRef {
  id?: string;
  _id?: string;
  name?: string;
  slug?: string;
  image_url?: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number; // <-- added
  images: string[];
  in_stock: boolean;
  category?: string;
  category_id?: CategoryRef | null;
}

interface ProductsPageProps {
  onBack: () => void;
  onViewProduct: (productSlug: string) => void;
  onAddToCart: (product: Product) => void;
  initialCategory?: string | null;
  user?: any;
}

export default function ProductsPage({
  onBack,
  onViewProduct,
  onAddToCart,
  initialCategory = null,
  user,
}: ProductsPageProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'product' | 'category'; id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'none' | 'low-high' | 'high-low'>('none');
  const [searchParams] = useSearchParams();

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  const ADMIN_EMAIL = 'sainamanpearls1@gmail.com';
  const isAdmin = user && user.email === ADMIN_EMAIL;

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl.toLowerCase());
    else if (initialCategory) setSelectedCategory(initialCategory);

    fetchProducts();
    fetchCategories();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applyCategoryFilter();
  }, [selectedCategory, allProducts, searchQuery, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      let backendProducts: Product[] = [];

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) backendProducts = data;
        else if (data.products) backendProducts = data.products;

        backendProducts = backendProducts.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          price: p.price,
          discountedPrice: p.discountedPrice, // <-- mapped
          images: p.images || [],
          in_stock: p.in_stock !== undefined ? p.in_stock : true,
          category: (p.category || p.category_id?.name || p.category_id?.slug || '').toLowerCase(),
          category_id: p.category_id,
        }));
      }

      const combined = [...backendProducts, ...localProducts];
      const deduped = Array.from(new Map(combined.map((p) => [p.slug, p])).values());
      setAllProducts(deduped);
    } catch {
      setAllProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        const transformed = [
          { id: 'all', name: 'All Products' },
          ...data.map((c: any) => ({
            id: c._id || c.id,
            name: c.name,
            slug: c.slug,
            image_url: c.image_url,
            description: c.description,
          })),
        ];
        setCategories(transformed);
      }
    } catch {
      setCategories([{ id: 'all', name: 'All Products' }]);
    }
  };

  const applyCategoryFilter = () => {
    let filtered =
      selectedCategory === 'all'
        ? allProducts
        : allProducts.filter(
            (p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
          );

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'low-high') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === 'high-low') filtered = [...filtered].sort((a, b) => b.price - a.price);

    setProducts(filtered);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const confirmDelete = (type: 'product' | 'category', id: string, name: string) => {
    if (!isAdmin) return;
    setDeleteConfirm({ type, id, name });
  };

  const cancelDelete = () => setDeleteConfirm(null);

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    const token = localStorage.getItem('token');

    try {
      if (type === 'product') {
        const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) fetchProducts();
      } else if (type === 'category') {
        const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          fetchCategories();
          fetchProducts();
        }
      }
      setDeleteConfirm(null);
    } catch {
      alert('Delete failed');
      setDeleteConfirm(null);
    }
  };

  const getCategoryDisplayName = () => {
    const category = categories.find((c) => c.id === selectedCategory);
    return category ? category.name : 'All Products';
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://example.com/products" }
    ]
  };

  return (
    <div id="products-page" className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black px-4 py-12 pt-32">
      <Helmet>
        <title>{`Products | Sai Naman Pearls`}</title>
        <meta name="description" content="Browse Sai Naman Pearls' elegant collection of fine jewelry." />
        <meta property="og:title" content="Products - Sai Naman Pearls" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <center className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-light tracking-widest text-gray-100 mb-4 drop-shadow-lg">
            {getCategoryDisplayName()?.toUpperCase() ?? ""}
          </h1>
          <p className="text-gray-400 text-lg tracking-wide">
            {selectedCategory !== 'all'
              ? `Browse our ${getCategoryDisplayName()?.toLowerCase()} collection`
              : 'Explore our complete collection of fine jewelry'}
          </p>
        </center>

        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-300 transition-colors mb-6 tracking-wider font-light"
        >
          ← BACK TO HOME
        </button>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/50 p-6 rounded-lg shadow-2xl sticky top-24">
              <h2 className="text-xl font-light tracking-wider text-gray-100 mb-6">CATEGORIES</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="relative flex items-center">
                    <button
                      onClick={() => handleCategoryClick(category.slug || category.id!)}
                      className={`flex-1 text-left px-4 py-3 rounded-md transition-all duration-300 font-light ${
                        selectedCategory === category.slug || selectedCategory === category.id
                          ? 'bg-gray-700 text-white shadow-lg border border-gray-600'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-gray-800/30'
                      }`}
                    >
                      {category.name}
                    </button>
                    {isAdmin && category.id !== 'all' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); confirmDelete('category', category.id!, category.name || ''); }}
                        className={`ml-2 p-2 rounded-md transition-all ${
                          deleteConfirm?.id === category.id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-900/80 text-gray-400 hover:bg-red-600 hover:text-white'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-gray-400 font-light tracking-wide">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-900/60 backdrop-blur-md border border-gray-800/50 text-gray-200 px-3 py-2 rounded-md focus:border-gray-600 focus:ring-2 focus:ring-gray-700/30 tracking-wide outline-none"
                >
                  <option value="none">Sort by Price</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>

                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-72 bg-gray-900/60 backdrop-blur-md border border-gray-800/50 focus:border-gray-600 focus:ring-2 focus:ring-gray-700/30 text-gray-100 px-4 py-2 rounded-md tracking-wide placeholder:text-gray-600 transition-all outline-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-20 font-light">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4 font-light">No products found</p>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="text-gray-400 hover:text-gray-200 hover:underline transition"
                >
                  View all products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative bg-gray-900/40 backdrop-blur-md border border-gray-800/50 hover:border-gray-700 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-900/50"
                    style={{ animation: `fade-in-up 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <div
                      className="relative aspect-square overflow-hidden cursor-pointer"
                      onClick={() => onViewProduct(product.slug)}
                    >
                      <img
                        src={product.images[0] || ''}
                        alt={product.name}
                        loading='lazy'
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-lg font-light tracking-wide border border-gray-600"
                      >
                        <ShoppingBag className="w-4 h-4 inline mr-2" /> ADD TO BAG
                      </button>

                      {isAdmin && (
                        <button
                          onClick={(e) => { e.stopPropagation(); confirmDelete('product', product.id, product.name); }}
                          className={`absolute top-4 left-4 p-2 rounded-md transition-all ${
                            deleteConfirm?.id === product.id
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-900/80 text-gray-400 hover:bg-red-600 hover:text-white'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="p-6 cursor-pointer" onClick={() => onViewProduct(product.slug)}>
                      <h3 className="text-lg text-gray-100 mb-2 font-light tracking-wide">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        {/* Price with discount */}
                        {product.discountedPrice && product.discountedPrice < product.price ? (
                          <div className="flex flex-col">
                            <span className="text-gray-400 line-through text-lg">
                              ₹ {product.price.toLocaleString()}
                            </span>
                            <span className="text-white text-lg font-semibold">
                              ₹ {product.discountedPrice.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl text-gray-200 font-light">
                            ₹ {product.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs text-gray-600 uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-gray-100 p-4 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <span>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</span>
          <button onClick={executeDelete} className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition">Yes</button>
          <button onClick={cancelDelete} className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition">No</button>
          <X onClick={cancelDelete} className="w-5 h-5 cursor-pointer" />
        </div>
      )}
    </div>
  );
}
