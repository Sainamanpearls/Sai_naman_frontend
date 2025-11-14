/*
  # Orders and Order Items Schema

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer's full name
      - `customer_email` (text) - Customer's email address
      - `customer_phone` (text) - Customer's phone number
      - `shipping_address` (text) - Full shipping address
      - `city` (text) - City
      - `postal_code` (text) - Postal/ZIP code
      - `country` (text) - Country
      - `total_amount` (numeric) - Total order amount
      - `status` (text) - Order status (pending, processing, shipped, delivered)
      - `created_at` (timestamptz) - Order creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - Reference to orders table
      - `product_id` (uuid, foreign key) - Reference to products table
      - `product_name` (text) - Product name snapshot
      - `product_price` (numeric) - Product price snapshot
      - `quantity` (integer) - Quantity ordered
      - `subtotal` (numeric) - Item subtotal
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public can insert orders (for guest checkout)
    - Public can view their own orders (future: by email or order ID)
    - Order items are linked to orders

  3. Important Notes
    - Store product details as snapshots to preserve order history
    - Status tracking for order fulfillment
    - Timestamps for order tracking
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT '',
  shipping_address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  country text DEFAULT 'United States',
  total_amount numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_price numeric NOT NULL,
  quantity integer DEFAULT 1,
  subtotal numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster order lookups
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public can insert orders (guest checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Public can view all orders (for demo purposes)
-- In production, you'd restrict this to authenticated users or by order lookup
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- Public can insert order items
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Public can view order items
CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);