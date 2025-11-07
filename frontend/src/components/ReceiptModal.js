import React from 'react';
import './ReceiptModal.css';

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-header">
          <h2>Order Confirmation</h2>
          <button className="close-modal-btn" onClick={onClose}>×</button>
        </div>

        <div className="receipt-body">
          <div className="receipt-success">
            <div className="success-icon">✓</div>
            <h3>Thank you for your order!</h3>
            <p>Your order has been successfully placed.</p>
          </div>

          <div className="receipt-info">
            <div className="info-row">
              <span className="info-label">Order Date:</span>
              <span className="info-value">{formatDate(receipt.timestamp)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{receipt.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{receipt.email}</span>
            </div>
          </div>

          <div className="receipt-items">
            <h4>Order Items:</h4>
            <div className="items-list">
              {receipt.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <div className="receipt-item-info">
                    <span className="receipt-item-name">{item.name}</span>
                    <span className="receipt-item-details">
                      {item.qty} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="receipt-item-total">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="receipt-total">
            <div className="total-row">
              <span className="total-label">Total Amount:</span>
              <span className="total-amount">${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-note">
            <p>This is a mock checkout. No actual payment was processed.</p>
          </div>
        </div>

        <div className="receipt-footer">
          <button className="close-receipt-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;

