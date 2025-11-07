import React from 'react';
import './ProductsGrid.css';

const ProductsGrid = ({ products, onAddToCart, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      <h2 className="section-title">Products</h2>
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img 
                src={product.image || '/bag.jpeg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/bag.jpeg';
                }}
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(product.id, 1)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;

