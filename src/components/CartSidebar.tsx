import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
  discountedPrice?: number; // ← added so TS does not complain
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onCheckout: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
}: CartSidebarProps) {

  // Now totals use discounted price if it exists
  const total = items.reduce(
    (sum, item) =>
      sum + (item.discountedPrice ?? item.price) * item.quantity,
    0
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-zinc-950 border-l border-zinc-800 z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-light tracking-wider text-white">
                YOUR BAG
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">Your bag is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-zinc-800"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-24 h-24 object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-white font-light mb-1">{item.name}</h3>

                      {/* PRICE WITH DISCOUNTING LOGIC */}
                      {item.discountedPrice !=null ? (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-zinc-500 line-through text-sm">
                            ₹ {item.price.toLocaleString()}
                          </span>
                          <span className="text-white text-lg">
                            ₹ {item.discountedPrice.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <p className="text-white mb-3">
                          ₹ {item.price.toLocaleString()}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 border border-zinc-800">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                            className="p-2 hover:bg-zinc-900 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-zinc-400" />
                          </button>

                          <span className="text-white w-8 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-zinc-900 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-zinc-400" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-500 hover:text-white text-sm transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-zinc-400 tracking-wider">TOTAL</span>
                  <span className="text-white text-2xl tracking-wider">
                    ₹ {total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full bg-white text-black py-4 tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  PROCEED TO CHECKOUT
                </button>

                <button
                  onClick={onClose}
                  className="w-full border border-zinc-700 text-white py-4 tracking-widest hover:border-white transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
