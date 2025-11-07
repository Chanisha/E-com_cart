# E-Commerce Shopping Cart - Full Stack Application

A full-stack shopping cart application built with React (frontend), Node.js/Express (backend), and MongoDB for database persistence. This project demonstrates a complete e-commerce flow including product listing, cart management, and mock checkout functionality.

## 🚀 Features

- **Product Catalog**: Browse 8 mock products with images, descriptions, and prices
- **Shopping Cart**: Add, remove, and update quantities of items
- **Checkout Process**: Complete checkout with name and email validation
- **Order Receipt**: View detailed order confirmation after checkout
- **Responsive Design**: Mobile-friendly UI that works on all devices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Database Persistence**: MongoDB integration for storing products and checkout records
- **Fake Store API Fallback**: Automatic fallback to Fake Store API if backend fails

## 📁 Project Structure

```
E-Com_cart/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── .gitignore        # Backend gitignore
├── frontend/
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ProductsGrid.js
│   │   │   ├── Cart.js
│   │   │   ├── CheckoutForm.js
│   │   │   └── ReceiptModal.js
│   │   ├── services/
│   │   │   └── api.js    # API service layer
│   │   ├── App.js        # Main app component
│   │   ├── App.css
│   │   ├── index.js      # React entry point
│   │   └── index.css
│   └── package.json      # Frontend dependencies
└── README.md
```

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend

- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (optional - app works with in-memory storage if MongoDB is unavailable)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd E-Com_cart
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (optional - for MongoDB connection)
# The .env file has been pre-configured with MongoDB Atlas connection
# If you need to update it, see backend/MONGODB_SETUP.md
#
# For MongoDB Atlas (already configured):
# PORT=5001
# MONGODB_URI=mongodb+srv://chanishasachdeva83:Q82eGgxm9Kg0KB4m@cluster0.amdwi.mongodb.net/ecomcart?retryWrites=true&w=majority&appName=Cluster0
#
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/ecomcart

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5001` (default, or port specified in .env)

**Note**: If MongoDB is not installed or unavailable, the app will automatically use in-memory storage. The app is fully functional without MongoDB.

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📡 API Endpoints

### Products

- **GET** `/api/products` - Get all products
  - Returns: Array of product objects with id, name, price, description, image

### Cart

- **GET** `/api/cart` - Get cart items and total

  - Returns: `{ items: [...], total: number }`

- **POST** `/api/cart` - Add item to cart

  - Body: `{ productId: number, qty: number }`
  - Returns: Updated cart

- **PUT** `/api/cart/:id` - Update item quantity

  - Body: `{ qty: number }`
  - Returns: Updated cart

- **DELETE** `/api/cart/:id` - Remove item from cart
  - Returns: Updated cart

### Checkout

- **POST** `/api/checkout` - Process checkout
  - Body: `{ name: string, email: string, cartItems: [...] }`
  - Returns: Receipt object with order details

## 🎨 Features in Detail

### Products Grid

- Displays all available products in a responsive grid layout
- Each product card shows image, name, description, and price
- "Add to Cart" button for each product
- Loading state while fetching products

### Shopping Cart

- View all cart items with quantities and prices
- Increase/decrease item quantities
- Remove items from cart
- Real-time total calculation
- Empty cart state handling

### Checkout Form

- Form validation for name and email
- Order summary sidebar
- Responsive two-column layout (stacks on mobile)
- Error messages for invalid inputs

### Receipt Modal

- Beautiful modal displaying order confirmation
- Shows order date, customer info, items, and total
- Animated success indicator
- Clear indication that this is a mock checkout

## 🎯 Bonus Features Implemented

✅ **Database Persistence**: MongoDB integration with Mongoose

- Products stored in database
- Checkout records saved for history
- Graceful fallback to in-memory storage if DB unavailable

✅ **Error Handling**: Comprehensive error handling

- API error handling with user-friendly messages
- Form validation with inline error messages
- Network error handling with fallback options

✅ **Fake Store API Integration**: Automatic fallback

- If backend fails, frontend automatically fetches from Fake Store API
- Seamless user experience even if backend is down

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop** (1200px+): Full-width grid with 3-4 columns
- **Tablet** (768px - 1199px): 2-3 column grid
- **Mobile** (< 768px): Single column layout, stacked forms

## 🧪 Testing the Application

1. **View Products**: Navigate to the home page to see all products
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the "Cart" button in the header
4. **Update Quantities**: Use +/- buttons to adjust quantities
5. **Remove Items**: Click "Remove" to delete items
6. **Checkout**: Click "Proceed to Checkout" and fill in the form
7. **View Receipt**: See the order confirmation modal

## 🐛 Troubleshooting

### Backend won't start

- Ensure port 5001 (or your configured port) is not in use
- Check that all dependencies are installed (`npm install` in backend folder)
- Verify Node.js version (v14+)

### Frontend won't connect to backend

- Ensure backend is running on port 5001 (default) or the port specified in your .env file
- Check CORS settings if accessing from different origin
- Verify API_BASE_URL in frontend/src/services/api.js

### MongoDB connection issues

- The app works without MongoDB (uses in-memory storage)
- To use MongoDB: Install MongoDB, start the service, and set MONGODB_URI in .env
- Default connection: `mongodb://localhost:27017/ecomcart`

## 📝 Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecomcart
```

### Frontend

The frontend uses a proxy to the backend (configured in package.json). For production, set:

```
REACT_APP_API_URL=http://your-backend-url/api
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (or use MongoDB Atlas)
3. Deploy to platforms like Heroku, Railway, or Render

### Frontend Deployment

1. Build the production bundle: `npm run build`
2. Deploy the `build` folder to platforms like:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

## 📸 Screenshots

### Products Page

![Products Page](./screenshots/homepage.png)

- Responsive grid layout with product cards
- Hover effects and smooth transitions

### Shopping Cart

![Shopping Cart](./screenshots/addtocart.png)

- Clean cart interface with quantity controls
- Real-time total calculation

### Checkout Form

![Checkout Form](./screenshots/checkout.png)

- Two-column layout with order summary
- Form validation

### Receipt Modal

![Receipt Modal](./screenshots/purchasedone.png)

- Animated success confirmation
- Detailed order information

## 🤝 Contributing

This is a screening assignment project. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for Vibe Commerce screening assignment.

## 👤 Author

Created as part of the Vibe Commerce full-stack coding assignment.

---

**Note**: This is a mock e-commerce application. No real payments are processed. All transactions are simulated for demonstration purposes.
