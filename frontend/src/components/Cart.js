import React from 'react';
import './Cart.css';

const Cart = ({ items, total, onRemove, onUpdateQuantity, onCheckout, onClose }) => {
  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="continue-shopping-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-price">${item.price.toFixed(2)} each</p>
            </div>
            <div className="item-controls">
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => {
                    if (item.qty > 1) {
                      onUpdateQuantity(item.productId, item.qty - 1);
                    }
                  }}
                  disabled={item.qty <= 1}
                >
                  −
                </button>
                <span className="quantity">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.productId, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <div className="item-subtotal">
                ${(item.price * item.qty).toFixed(2)}
              </div>
              <button
                className="remove-btn"
                onClick={() => onRemove(item.productId)}
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total-section">
          <div className="total-row">
            <span className="total-label">Total:</span>
            <span className="total-amount">${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="cart-actions">
          <button className="continue-shopping-btn" onClick={onClose}>
            Continue Shopping
          </button>
          <button className="checkout-btn" onClick={onCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

