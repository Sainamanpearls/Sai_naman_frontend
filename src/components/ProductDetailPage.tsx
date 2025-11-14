import { useEffect, useState } from 'react';
import { ShoppingBag, Share2, Check, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { localProducts } from '../data/products';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category_id?: string;
  collection_id?: string;
  images: string[];
  in_stock: boolean;
  featured?: boolean;
}

interface ProductDetailPageProps {
  productSlug: string;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailPage({
  productSlug,
  onBack,
  onAddToCart,
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(0);
  const API_URL = import.meta.env.VITE_API_BASE_URL  || 'http://localhost:5001';
  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [productSlug]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isFullscreen || !product) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      else if (e.key === 'ArrowLeft') handlePrevImage();
      else if (e.key === 'ArrowRight') handleNextImage();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, fullscreenImage, product]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(productSlug)}`);
      if (!res.ok) {
        const local = localProducts.find((p) => p.slug === productSlug);
        setProduct(local || null);
        return;
      }
      const data = await res.json();
      setProduct(data || localProducts.find((p) => p.slug === productSlug) || null);
    } catch (err) {
      console.error('Failed to load product', err);
      const local = localProducts.find((p) => p.slug === productSlug);
      setProduct(local || null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    if (!product) return;
    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const shareText = `Check out this ${product.name} — ${productUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description || 'Check out this product!',
          url: productUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareMessage('🔗 Link copied!');
        setTimeout(() => setShareMessage(null), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setShareMessage('❌ Failed to share');
      setTimeout(() => setShareMessage(null), 2000);
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenImage(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNextImage = () => {
    if (!product) return;
    setFullscreenImage((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    if (!product) return;
    setFullscreenImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400 text-center">
          <p className="text-xl mb-4">Product not found</p>
          <button onClick={onBack} className="text-white hover:underline">
            Return to shop
          </button>
        </div>
      </div>
    );
  }

  const productUrl = `${window.location.origin}/product/${product.slug}`;
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Noir Store',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.discountedPrice && product.discountedPrice < product.price ? product.discountedPrice : product.price,
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      {/*  SEO Meta + JSON-LD */}
      <Helmet>
        <title>{`${product.name} | Noir Store`}</title>
        <meta name="description" content={product.description.slice(0, 150)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:url" content={productUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main className="min-h-screen bg-black px-4 py-12 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end">
            <button
              onClick={onBack}
              className="text-zinc-400 hover:text-white transition-colors mb-6 tracking-wider"
            >
              ← BACK TO HOME
            </button>
          </div>

          {/*  Product layout */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-zinc-950 border border-zinc-800 overflow-hidden relative group">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  loading='lazy'
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
                <button
                  onClick={() => openFullscreen(selectedImage)}
                  className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/90"
                  title="View fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      onDoubleClick={() => openFullscreen(index)}
                      className={`aspect-square border-2 overflow-hidden ${
                        selectedImage === index
                          ? 'border-white'
                          : 'border-zinc-800 hover:border-zinc-600'
                      } transition-all`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-light tracking-wider text-white mb-4">{product.name}</h1>

                {/* Price with discount */}
                <div className="flex items-center space-x-4 mb-6">
                  {product.discountedPrice && product.discountedPrice < product.price ? (
                    <>
                      <span className="text-4xl text-white tracking-wider font-semibold">
                        ₹ {product.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-zinc-500 text-2xl line-through">
                        ₹ {product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl text-white tracking-wider">
                      ₹ {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-zinc-400 text-lg leading-relaxed">{product.description}</p>
              </div>

          
              <div>
                <h3 className="text-zinc-400 text-sm tracking-wider mb-3">QUANTITY</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-zinc-950 border border-zinc-800 text-white hover:border-white transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white text-xl w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-zinc-950 border border-zinc-800 text-white hover:border-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.in_stock || addedToCart}
                    className="w-full bg-white text-black py-4 tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>{product.in_stock ? 'ADD TO BAG' : 'OUT OF STOCK'}</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleShare}
                      className="border border-zinc-800 text-white py-4 tracking-widest hover:border-white transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>SHARE</span>
                    </button>

                    <button
                      onClick={() => openFullscreen(selectedImage)}
                      className="border border-zinc-800 text-white py-4 tracking-widest hover:border-white transition-colors flex items-center justify-center space-x-2"
                    >
                      <Maximize2 className="w-5 h-5" />
                      <span>VIEW</span>
                    </button>
                  </div>

                  {shareMessage && (
                    <p className="text-center text-zinc-400 text-sm mt-2">{shareMessage}</p>
                  )}
                </div>

                {/* Benefits */}
                <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
                  {[
                    { title: 'Complimentary Gift Packaging', desc: 'Each piece arrives in our signature box' },
                    { title: 'Lifetime Warranty', desc: 'Guaranteed craftsmanship and quality' },
                    { title: 'Free Shipping', desc: 'Complimentary delivery on all orders' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-white mt-0.5" />
                      <div>
                        <p className="text-white font-light mb-1">{item.title}</p>
                        <p className="text-zinc-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

     
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute top-6 left-6 bg-black/50 text-white px-4 py-2 rounded-full">
            {fullscreenImage + 1} / {product.images.length}
          </div>

          {product.images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-6 bg-black/50 text-white p-4 rounded-full hover:bg-black/70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={product.images[fullscreenImage]}
            alt={`${product.name} - Image ${fullscreenImage + 1}`}
            className="max-w-full max-h-full object-contain animate-fade-in"
          />

          {product.images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-6 bg-black/50 text-white p-4 rounded-full hover:bg-black/70"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </>
  );
}
