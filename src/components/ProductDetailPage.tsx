import { useEffect, useState } from 'react';
import { ShoppingBag, Share2, Check, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useParams } from "react-router-dom";

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
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailPage({
  onBack,
  onAddToCart,
}: ProductDetailPageProps) {

  // ✅ Get slug from URL instead of props
  const { slug } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(0);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]); // ✅ changed productSlug → slug

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

  // ✅ updated fetcher
  const fetchProduct = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(slug)}`);

      if (!res.ok) {
        setProduct(null);
        return;
      }

      const data = await res.json();
      setProduct(data || null);
    } catch (err) {
      console.error('Failed to load product', err);
      setProduct(null);
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

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Noir Store`}</title>
        <meta name="description" content={product.description.slice(0, 150)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:url" content={productUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            image: product.images,
            description: product.description,
            sku: product.id,
            brand: { '@type': 'Brand', name: 'Noir Store' },
            offers: {
              '@type': 'Offer',
              url: productUrl,
              priceCurrency: 'INR',
              price:
                product.discountedPrice && product.discountedPrice < product.price
                  ? product.discountedPrice
                  : product.price,
              availability: product.in_stock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          })}
        </script>
      </Helmet>
      <main className="min-h-screen bg-black px-4 py-12 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-6">
            <button
              onClick={onBack}
              className="text-zinc-400 hover:text-white transition-colors tracking-wider"
            >
              ← BACK TO HOME
            </button>
          </div>

          {/* Product layout - responsive */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left - Images */}
            <div className="flex flex-col space-y-4 lg:w-1/2">
              <div className="w-full aspect-[1/1] bg-zinc-950 border border-zinc-800 overflow-hidden relative group">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => openFullscreen(selectedImage)}
                  className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/90"
                  title="View fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      onDoubleClick={() => openFullscreen(index)}
                      className={`flex-shrink-0 w-20 sm:w-24 aspect-square border-2 overflow-hidden ${
                        selectedImage === index ? 'border-white' : 'border-zinc-800 hover:border-zinc-600'
                      } transition-all`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Info */}
            <div className="flex flex-col space-y-6 lg:w-1/2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wider text-white">{product.name}</h1>

              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 mb-4">
                {product.discountedPrice && product.discountedPrice < product.price ? (
                  <>
                    <span className="text-2xl sm:text-3xl text-white tracking-wider font-semibold">
                      ₹ {product.discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-zinc-500 text-lg sm:text-2xl line-through">
                      ₹ {product.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl text-white tracking-wider">
                    ₹ {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">{product.description}</p>

              {/* Quantity */}
              <div>
                <h3 className="text-zinc-400 text-sm tracking-wider mb-2">QUANTITY</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-950 border border-zinc-800 text-white hover:border-white transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white text-lg sm:text-xl w-10 sm:w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-950 border border-zinc-800 text-white hover:border-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || addedToCart}
                  className="w-full bg-white text-black py-3 sm:py-4 tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 mb-4"
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

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 border border-zinc-800 text-white py-3 tracking-widest hover:border-white transition-colors flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>SHARE</span>
                  </button>

                  <button
                    onClick={() => openFullscreen(selectedImage)}
                    className="flex-1 border border-zinc-800 text-white py-3 tracking-widest hover:border-white transition-colors flex items-center justify-center space-x-2"
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
              <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-6 space-y-3">
                {[
                  { title: 'Complimentary Gift Packaging', desc: 'Each piece arrives in our signature box' },
                  { title: 'Lifetime Warranty', desc: 'Guaranteed craftsmanship and quality' },
                  { title: 'Free Shipping', desc: 'Complimentary delivery on all orders' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-2 sm:space-x-3">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-1" />
                    <div>
                      <p className="text-white font-light text-sm sm:text-base">{item.title}</p>
                      <p className="text-zinc-500 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 sm:p-6">
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {product.images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 sm:left-6 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
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
              className="absolute right-4 sm:right-6 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
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
