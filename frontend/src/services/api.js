import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    // Fallback to Fake Store API if backend fails or is not available
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_CONNECTION_RESET' || !error.response || error.response?.status >= 500) {
      try {
        console.warn('Backend not available, falling back to Fake Store API');
        const fakeStoreResponse = await axios.get('https://fakestoreapi.com/products?limit=8');
        // Map to local images from public folder
        const localImages = ['/bag.jpeg', '/dragin_bracelet.jpg', '/jacket.png', '/micropave.jpg', '/rose_gold_earrings.jpeg', '/solitare_ring.jpeg', '/sweater.png', '/tshirt.jpeg'];
        return fakeStoreResponse.data.map((product, index) => ({
          id: product.id,
          name: product.title,
          price: product.price,
          description: product.description,
          image: localImages[index % localImages.length] || '/bag.jpeg'
        }));
      } catch (fallbackError) {
        throw error;
      }
    }
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    // Return empty cart if backend is not available
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_CONNECTION_RESET' || !error.response) {
      console.warn('Backend not available, returning empty cart');
      return { items: [], total: 0 };
    }
    throw error;
  }
};

export const addToCart = async (productId, qty) => {
  try {
    const response = await api.post('/cart', { productId, qty });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_CONNECTION_RESET' || !error.response) {
      throw new Error('Backend server is not available. Please ensure the server is running on port 5001.');
    }
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_CONNECTION_RESET' || !error.response) {
      throw new Error('Backend server is not available. Please ensure the server is running on port 5001.');
    }
    throw error;
  }
};

export const updateCartItem = async (productId, qty) => {
  try {
    const response = await api.put(`/cart/${productId}`, { qty });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_CONNECTION_RESET' || !error.response) {
      throw new Error('Backend server is not available. Please ensure the server is running on port 5001.');
    }
    throw error;
  }
};

export const checkout = async (checkoutData) => {
  try {
    const response = await api.post('/checkout', checkoutData);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_CONNECTION_RESET' || !error.response) {
      throw new Error('Backend server is not available. Please ensure the server is running on port 5001.');
    }
    throw error;
  }
};

