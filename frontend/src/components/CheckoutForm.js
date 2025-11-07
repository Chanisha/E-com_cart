import React, { useState } from 'react';
import './CheckoutForm.css';

const CheckoutForm = ({ cartItems, total, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name,
        email: formData.email,
        cartItems: cartItems
      });
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button className="back-btn" onClick={onBack}>← Back to Cart</button>
        <h2>Checkout</h2>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <h3>Shipping Information</h3>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="John Doe"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="john@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <button
              type="submit"
              className="submit-checkout-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Complete Order'}
            </button>
          </form>
        </div>

        <div className="order-summary-section">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="order-item">
                <div className="order-item-info">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-qty">Qty: {item.qty}</span>
                </div>
                <span className="order-item-price">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <div className="total-row">
              <span>Total:</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;

