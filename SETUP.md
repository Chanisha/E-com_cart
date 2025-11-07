# Quick Setup Guide

## Quick Start (5 minutes)

### Option 1: Without MongoDB (Easiest)
The app works perfectly without MongoDB using in-memory storage.

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start Frontend (new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Open browser:** http://localhost:3000

### Option 2: With MongoDB

1. **Install MongoDB:**
   - Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Create .env file in backend folder:**
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/ecomcart
   ```
   (For MongoDB Atlas, use your connection string)

3. **Start MongoDB service** (if using local MongoDB)

4. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

5. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Troubleshooting

- **Port already in use?** Change PORT in backend/.env (default is 5001) or kill the process using that port
- **Module not found?** Run `npm install` in both backend and frontend folders
- **Can't connect to backend?** Make sure backend is running on port 5001 (default) or the port you configured

## Testing the App

1. You should see 8 products on the homepage
2. Click "Add to Cart" on any product
3. Click "Cart" button in header to view cart
4. Adjust quantities or remove items
5. Click "Proceed to Checkout"
6. Fill in name and email, submit
7. View the receipt modal

That's it! 🎉

