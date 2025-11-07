const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce Cart API', version: '1.0.0' });
});

// MongoDB Connection (non-blocking)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomcart';
let isMongoConnected = false;

// Connect to MongoDB asynchronously (non-blocking)
if (MONGODB_URI && MONGODB_URI.includes('mongodb')) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 3000, // Timeout after 3s
    socketTimeoutMS: 3000,
  })
  .then(() => {
    isMongoConnected = true;
    console.log('✅ MongoDB connected successfully');
  })
  .catch(err => {
    isMongoConnected = false;
    console.log('⚠️  MongoDB connection error, using in-memory storage');
    console.log('   Error:', err.message);
    console.log('   The app will continue to work with in-memory storage.');
  });
} else {
  console.log('ℹ️  No MongoDB URI provided, using in-memory storage');
}

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }
});

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 }
});

// Checkout Schema
const checkoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cartItems: [cartItemSchema],
  total: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);
const Checkout = mongoose.models.Checkout || mongoose.model('Checkout', checkoutSchema);

// In-memory storage fallback
let inMemoryCart = [];
let inMemoryProducts = [];

// Initialize mock products
const initializeProducts = async () => {
  const mockProducts = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, description: 'Premium noise-cancelling headphones', image: '/bag.jpeg' },
    { id: 2, name: 'Smart Watch', price: 249.99, description: 'Fitness tracking smartwatch', image: '/dragin_bracelet.jpg' },
    { id: 3, name: 'Laptop Stand', price: 39.99, description: 'Ergonomic aluminum laptop stand', image: '/jacket.png' },
    { id: 4, name: 'Mechanical Keyboard', price: 129.99, description: 'RGB mechanical gaming keyboard', image: '/micropave.jpg' },
    { id: 5, name: 'USB-C Hub', price: 49.99, description: 'Multi-port USB-C adapter', image: '/rose_gold_earrings.jpeg' },
    { id: 6, name: 'Wireless Mouse', price: 29.99, description: 'Ergonomic wireless mouse', image: '/solitare_ring.jpeg' },
    { id: 7, name: 'Monitor Stand', price: 59.99, description: 'Dual monitor stand with cable management', image: '/sweater.png' },
    { id: 8, name: 'Webcam HD', price: 89.99, description: '1080p HD webcam with microphone', image: '/tshirt.jpeg' }
  ];

  try {
    if (isMongoConnected) {
      const count = await Product.countDocuments().catch(() => 0);
      if (count === 0) {
        await Product.insertMany(mockProducts).catch(() => {});
        console.log('✅ Mock products initialized in database');
      }
    }
    inMemoryProducts = mockProducts;
    if (inMemoryProducts.length > 0) {
      console.log(`✅ ${inMemoryProducts.length} products loaded (in-memory)`);
    }
  } catch (error) {
    console.log('⚠️  Using in-memory products:', error.message);
    inMemoryProducts = mockProducts;
  }
};

// API Routes

// GET /api/products - Get all products
app.get('/api/products', async (req, res) => {
  try {
    // Always return in-memory products for now to ensure reliability
    if (inMemoryProducts.length > 0) {
      return res.json(inMemoryProducts);
    }
    
    // Try MongoDB if connected
    if (isMongoConnected) {
      try {
        const products = await Product.find().limit(20);
        if (products && products.length > 0) {
          return res.json(products);
        }
      } catch (dbError) {
        console.log('DB query failed, using in-memory:', dbError.message);
      }
    }
    
    res.json(inMemoryProducts);
  } catch (error) {
    console.error('Error in /api/products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products', products: inMemoryProducts });
  }
});

// POST /api/cart - Add item to cart
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId || !qty || qty < 1) {
      return res.status(400).json({ error: 'Invalid productId or qty' });
    }

    // Get product details
    let product;
    try {
      product = await Product.findOne({ id: productId });
      if (!product) {
        product = inMemoryProducts.find(p => p.id === productId);
      }
    } catch (error) {
      product = inMemoryProducts.find(p => p.id === productId);
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingItemIndex = inMemoryCart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      inMemoryCart[existingItemIndex].qty += qty;
    } else {
      inMemoryCart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: qty
      });
    }

    res.json({ message: 'Item added to cart', cart: inMemoryCart });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const index = inMemoryCart.findIndex(item => item.productId === productId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    inMemoryCart.splice(index, 1);
    res.json({ message: 'Item removed from cart', cart: inMemoryCart });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// GET /api/cart - Get cart with total
app.get('/api/cart', (req, res) => {
  try {
    const total = inMemoryCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    res.json({
      items: inMemoryCart,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// POST /api/checkout - Process checkout
app.post('/api/checkout', async (req, res) => {
  try {
    const { name, email, cartItems } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const items = cartItems || inMemoryCart;
    
    if (items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const timestamp = new Date();

    // Save to database if available
    try {
      const checkout = new Checkout({
        name,
        email,
        cartItems: items,
        total,
        timestamp
      });
      await checkout.save();
    } catch (error) {
      console.log('Checkout saved to memory only');
    }

    // Clear cart
    inMemoryCart = [];

    res.json({
      receipt: {
        name,
        email,
        items: items,
        total: parseFloat(total.toFixed(2)),
        timestamp: timestamp.toISOString()
      },
      message: 'Checkout successful'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// PUT /api/cart/:id - Update cart item quantity
app.put('/api/cart/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { qty } = req.body;

    if (!qty || qty < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const index = inMemoryCart.findIndex(item => item.productId === productId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    inMemoryCart[index].qty = qty;
    res.json({ message: 'Cart updated', cart: inMemoryCart });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Initialize products on startup (non-blocking)
initializeProducts().catch(err => {
  console.log('⚠️  Error initializing products:', err.message);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart: http://localhost:${PORT}/api/cart`);
});

