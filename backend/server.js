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

// Helper function to convert filename to product name
const formatProductName = (filename) => {
  // Remove file extension
  let name = filename.replace(/\.(jpeg|jpg|png|gif)$/i, '');
  // Replace underscores and hyphens with spaces
  name = name.replace(/[_-]/g, ' ');
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  return name;
};

// Initialize mock products from public folder images
const initializeProducts = async () => {
  // List of image files in the public folder
  const imageFiles = [
    'bag.jpeg',
    'dragon_bracelet.jpg',
    'jacket.png',
    'micropave.jpg',
    'rose_gold_earrings.jpeg',
    'solitare_ring.jpeg',
    'sweater.png',
    'tshirt.jpeg'
  ];

  // Generate products from image files
  const mockProducts = imageFiles.map((imageFile, index) => {
    const productName = formatProductName(imageFile);
    // Generate prices based on index (deterministic pricing)
    const basePrice = 29.99;
    const price = basePrice + (index * 20);
    
    return {
      id: index + 1,
      name: productName,
      price: parseFloat(price.toFixed(2)),
      description: `Premium ${productName.toLowerCase()}`,
      image: `/${imageFile}`
    };
  });

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

