

import React, { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import About from "./components/About";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import AuthModal from "./components/AuthModal";
import ContactPage from "./components/ContactPage";
import LoadingScreen from "./components/LoadingScreen";
import AdminProductForm from "./components/AdminProductForm";
import AdminCategoryForm from "./components/AdminCategoryForm";
import UserOrdersPage from "./components/UserOrdersPage";
import ReviewsSection from "./components/ReviewsSection";
import ReelSection from "./components/ReelSection";
import { useAuth } from "./context/AuthContext";
import CategorySection from "./components/CategorySection";
import { Helmet } from "react-helmet-async";


const ProductGrid = lazy(() => import("./components/ProductGrid"));
const ProductsPage = lazy(() => import("./components/ProductsPage"));
const ProductDetailPage = lazy(() => import("./components/ProductDetailPage"));
const CheckoutPage = lazy(() => import("./components/CheckoutPage"));
const OrderConfirmation = lazy(() => import("./components/OrderConfirmation"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const ReviewsPage = lazy(() => import("./components/ReviewsPage"));
const AdminReviewApproval = lazy(() => import("./components/AdminReviewApproval"));

<Helmet>
  <link rel="icon" type="image/png" href="/Logo2.png" />
  <title>SaïNaman Pearls</title>
  <meta
    name="description"
    content="Welcome to SaïNaman Pearls – premium handcrafted jewelry"
  />
</Helmet>

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  discountedPrice? : number;
  price: number;
  images: string[];
  in_stock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}


function useCart(initialKey = "cartItems") {
  const [items, setItems] = React.useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(initialKey);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

 
  React.useEffect(() => {
    try {
      localStorage.setItem(initialKey, JSON.stringify(items));
    } catch {
     
    }
  }, [items, initialKey]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...product, quantity: 1 ,   price: product.price, discountedPrice: product.discountedPrice}];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity === 0 ? prev.filter((p) => p.id !== productId) : prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(initialKey);
    } catch {}
  }, [initialKey]);

  const totalCount = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

  return {
    items,
    totalCount,
    addToCart,
    updateQuantity,
    removeItem,
    clear,
    setItems, 
  };
}

function App() {
 
  

  const { user, logout } = useAuth();
  const navigate = useNavigate();

 
  const {
    items: cartItems,
    totalCount,
    addToCart,
    updateQuantity,
    removeItem,
    clear: clearCart,
  } = useCart();


  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminProductFormOpen, setIsAdminProductFormOpen] = useState(false);
  const [isAdminCategoryFormOpen, setIsAdminCategoryFormOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  const [orderId, setOrderId] = useState<string | null>(null);

  
  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product);
    },
    [addToCart]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const handleRemoveItem = useCallback(
    (productId: string) => {
      removeItem(productId);
    },
    [removeItem]
  );

  const handleCheckout = useCallback(() => {
    if (!user) return setIsAuthModalOpen(true);
    navigate("/checkout");
    setIsCartOpen(false);
  }, [user, navigate]);

  const handleOrderComplete = useCallback(
    (newOrderId: string) => {
      setOrderId(newOrderId);
      clearCart();
      navigate("/order-confirmation");
    },
    [clearCart, navigate]
  );

  const handleViewProduct = useCallback(
    (slug: string) => {
      
      navigate(`/product/${slug}`);
    },
    [navigate]
  );

  // Loading screen as before
  if (showLoading) return <LoadingScreen onComplete={() => setShowLoading(false)} />;

  return (
    <div className="min-h-screen bg-black text-white">
          <Helmet>
        <link rel="icon" type="image/png" href="/Logo2.png" />
        <title>SaïNaman Pearls</title>
        <meta
          name="description"
          content="Welcome to SaïNaman Pearls – premium handcrafted jewelry"
        />
      </Helmet>

       
  
      <Navbar
        cartCount={totalCount}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onContactClick={() => navigate("/contact")}
        onProductsClick={() => navigate("/products")}
        onCollectionsClick={() => navigate("/collections")}
        onAboutClick={() => navigate("/about")}
        onAdminAddProduct={() => setIsAdminProductFormOpen(true)}
        onAdminDashboardClick={() => navigate("/admin-dashboard")}
        onOrdersClick={() => navigate("/orders")}
        onHomeClick={() => navigate("/")}
        onAdminAddCategory={() => setIsAdminCategoryFormOpen(true)}
        onAdminReviewsClick={() => navigate("/admin-reviews")}
        user={user}
        onLogout={() => {
          logout();
          clearCart();
          navigate("/");
        }}
      />

      
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <CategorySection />
                {/* ProductGrid is lazy-loaded */}
                <Suspense fallback={<div className="py-8">Loading products...</div>}>
                  <ProductGrid onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />
                </Suspense>
                <About onReviewsClick={() => navigate("/reviews")} />
                <ReviewsSection onViewAllClick={() => navigate("/reviews")} />
                <ReelSection />
                <Footer onContactClick={() => navigate("/contact")} />
              </>
            }
          />

          <Route path="/contact" element={<ContactPage onBack={() => navigate("/")} />} />

          <Route
            path="/products"
            element={
              <Suspense fallback={<div className="py-8">Loading products...</div>}>
                <ProductsPage
                  onBack={() => navigate("/")}
                  onViewProduct={handleViewProduct}
                  onAddToCart={handleAddToCart}
                  user={user}
                />
              </Suspense>
            }
          />

          <Route path="/collections" />

          <Route path="/about" element={<About onReviewsClick={() => navigate("/reviews")} />} />

         <Route
  path="/product/:slug"
  element={
    <Suspense fallback={<div className="p-8 text-center">Loading product...</div>}>
      <ProductDetailPage
        //productSlug={selectedProductSlug!}
        onBack={() => navigate("/products")}
        onAddToCart={handleAddToCart}
      />
    </Suspense>
  }
/>

          <Route
            path="/checkout"
            element={
              <Suspense fallback={<div className="p-8 text-center">Preparing checkout...</div>}>
                <CheckoutPage
                  items={cartItems.flatMap((item) => Array(item.quantity).fill({ ...item, quantity: 1 }))}
                  onOrderComplete={handleOrderComplete}
                />
              </Suspense>
            }
          />

          <Route
            path="/order-confirmation"
            element={
              <Suspense fallback={<div className="p-8 text-center">Finalizing...</div>}>
                <OrderConfirmation orderId={orderId as string} onBackToHome={() => navigate("/")} />
              </Suspense>
            }
          />

          <Route path="/orders" element={<UserOrdersPage onBack={() => navigate("/")} />} />

          <Route
            path="/admin-dashboard"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading admin...</div>}>
                <AdminDashboard onClose={() => navigate("/")} />
              </Suspense>
            }
          />
          <Route path="/reviews" element={<ReviewsPage onBack={() => navigate("/")} />} />
          <Route
            path="/admin-reviews"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading admin reviews...</div>}>
                <AdminReviewApproval onClose={() => navigate("/")} />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>

     
      <button
        className="fixed bottom-4 right-4 z-50 p-3 md:hidden flex items-center justify-center"
        onClick={() => setIsCartOpen(true)}
      >
        <span className="relative flex">
          <ShoppingCart className="w-6 h-6 text-white" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </span>
      </button>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onCheckout={handleCheckout}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode="login" />
      <AdminProductForm isOpen={isAdminProductFormOpen} onClose={() => setIsAdminProductFormOpen(false)} />
      <AdminCategoryForm
        isOpen={isAdminCategoryFormOpen}
        onClose={() => setIsAdminCategoryFormOpen(false)}
        onSuccess={() => {
          console.log("Category created/updated successfully");
        }}
      />
    </div>
  );
}

export default App;
