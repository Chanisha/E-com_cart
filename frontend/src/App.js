import React, { useState, useEffect } from 'react';
import './App.css';
import ProductsGrid from './components/ProductsGrid';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import ReceiptModal from './components/ReceiptModal';
import { getProducts, getCart, addToCart, removeFromCart, updateCartItem, checkout } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data.items || []);
      setCartTotal(data.total || 0);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const handleAddToCart = async (productId, qty = 1) => {
    try {
      await addToCart(productId, qty);
      await loadCart();
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      await loadCart();
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const handleUpdateQuantity = async (productId, qty) => {
    try {
      await updateCartItem(productId, qty);
      await loadCart();
    } catch (err) {
      setError('Failed to update cart');
      console.error('Error updating cart:', err);
    }
  };

  const handleCheckout = async (checkoutData) => {
    try {
      const receiptData = await checkout(checkoutData);
      setReceipt(receiptData.receipt);
      setShowCheckout(false);
      setShowCart(false);
    } catch (err) {
      setError('Failed to process checkout');
      console.error('Error during checkout:', err);
    }
  };

  const closeReceipt = () => {
    setReceipt(null);
    setCartItems([]);
    setCartTotal(0);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>Vibe Commerce</h1>
          <button 
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            Cart ({cartItems.length})
            {cartTotal > 0 && <span className="cart-total">${cartTotal.toFixed(2)}</span>}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <div className="container">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        </div>
      )}

      <main className="main-content">
        <div className="container">
          {showCart ? (
            <Cart
              items={cartItems}
              total={cartTotal}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onCheckout={() => {
                setShowCheckout(true);
                setShowCart(false);
              }}
              onClose={() => setShowCart(false)}
            />
          ) : showCheckout ? (
            <CheckoutForm
              cartItems={cartItems}
              total={cartTotal}
              onSubmit={handleCheckout}
              onBack={() => {
                setShowCheckout(false);
                setShowCart(true);
              }}
            />
          ) : (
            <ProductsGrid
              products={products}
              onAddToCart={handleAddToCart}
              loading={loading}
            />
          )}
        </div>
      </main>

      {receipt && (
        <ReceiptModal receipt={receipt} onClose={closeReceipt} />
      )}
    </div>
  );
}

export default App;

