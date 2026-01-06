import { useEffect, useState } from "react";
import { CheckCircle, Package, Mail, Home } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface OrderConfirmationProps {
  orderId: string;
  onBackToHome: () => void;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  country: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  discount_price?: number;
  quantity: number;
  subtotal: number;
}

export default function OrderConfirmation({
  orderId,
  onBackToHome,
}: OrderConfirmationProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${encodeURIComponent(orderId)}`);
      if (!res.ok) {
        setOrder(null);
        setOrderItems([]);
        setLoading(false);
        return;
      }
      const json = await res.json();
      setOrder(json.order ?? null);
      setOrderItems(Array.isArray(json.items) ? json.items : []);
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400 text-center">
          <Helmet>
            <title>Loading Order | Noir</title>
            <meta name="description" content="Loading your order details..." />
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Helmet>
          <title>Order Not Found | Noir</title>
          <meta
            name="description"
            content="We couldn’t find the order you’re looking for."
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="text-zinc-400 text-center">
          <p>Order not found</p>
        </div>
      </div>
    );
  }

  if (order.status?.toLowerCase() === "failed") {
    return (
      <div className="min-h-screen bg-black px-4 py-12 pt-32">
        <Helmet>
          <title>Payment Failed | Noir</title>
          <meta
            name="description"
            content={`Payment failed for order #${orderId.slice(0, 8)}. Please try again or contact support.`}
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/20 border border-red-700 mb-6">
            <CheckCircle className="w-10 h-10 text-red-500 rotate-45" />
          </div>

          <h1 className="text-5xl font-light tracking-widest text-white mb-4">
            PAYMENT FAILED
          </h1>

          <p className="text-zinc-400 text-lg tracking-wide mb-2">
            Unfortunately, your payment could not be processed.
          </p>

          <p className="text-zinc-500 mb-10">
            Order ID: {orderId ? orderId.slice(0, 8) : ""}
          </p>

          <div className="space-y-4">
            <button
              onClick={onBackToHome}
              className="bg-white text-black px-12 py-4 tracking-widest hover:bg-zinc-200 transition-colors"
            >
              RETURN TO HOME
            </button>

            <p className="text-zinc-500 text-sm">
              Need help? Contact support at sainamanpearls1@gmail.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-12 pt-32">
      <Helmet>
        <title>Order Confirmed | Noir</title>
        <meta
          name="description"
          content={`Order confirmation for ${order.customer_name}. Order #${orderId.slice(0, 8)} with total ₹${order.total_amount.toLocaleString()}.`}
        />
        <meta
          name="keywords"
          content="Order confirmation, online jewelry store, Noir order details"
        />
        <meta property="og:title" content="Order Confirmed | Noir" />
        <meta
          property="og:description"
          content={`Your order #${orderId.slice(0, 8)} has been confirmed!`}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border border-zinc-700 mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-light tracking-widest text-white mb-4">
            ORDER CONFIRMED
          </h1>
          <p className="text-zinc-400 text-lg tracking-wide">
            Thank you for your purchase, {order.customer_name}
          </p>
          <p className="text-zinc-500 mt-2">
            Order #{orderId ? orderId.slice(0, 8) : ""}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-950 border border-zinc-800 p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <Mail className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-white font-light tracking-wider mb-2">
              CONFIRMATION EMAIL
            </h3>
            <p className="text-zinc-500 text-sm">
              Sent to {order.customer_email}
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <Package className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-white font-light tracking-wider mb-2">
              ESTIMATED DELIVERY
            </h3>
            <p className="text-zinc-500 text-sm">5-7 business days</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 text-center transform hover:scale-105 transition-transform duration-300">
            <CheckCircle className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-white font-light tracking-wider mb-2">
              ORDER STATUS
            </h3>
            <p className="text-zinc-500 text-sm capitalize">{order.status}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-zinc-950 border border-zinc-800 p-8">
            <h2 className="text-2xl font-light tracking-wider text-white mb-6 flex items-center">
              <Package className="w-6 h-6 mr-3" />
              ORDER DETAILS
            </h2>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between pb-4 border-b border-zinc-800"
                >
                  <div>
                    <p className="text-white font-light">{item.product_name}</p>
                    <p className="text-zinc-500 text-sm">Qty: {item.quantity}</p>
                  </div>
               
                </div>
              ))}
              <div className="flex justify-between text-xl pt-4">
                <span className="text-white tracking-wider">TOTAL</span>
                <span className="text-white tracking-wider">
                  ₹ {order.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-8">
            <h2 className="text-2xl font-light tracking-wider text-white mb-6 flex items-center">
              <Home className="w-6 h-6 mr-3" />
              SHIPPING ADDRESS
            </h2>
            <div className="text-zinc-400 space-y-2">
              <p className="text-white font-light">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>
                {order.city}, {order.postal_code}
              </p>
              <p>{order.country}</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={onBackToHome}
            className="bg-white text-black px-12 py-4 tracking-widest hover:bg-zinc-200 transition-colors"
          >
            CONTINUE SHOPPING
          </button>
          <p className="text-zinc-500 text-sm">
            Questions? Contact us at support@noir.com
          </p>
        </div>
      </div>
    </div>
  );
}
