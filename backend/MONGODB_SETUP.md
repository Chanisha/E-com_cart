# MongoDB Atlas Setup

## Your MongoDB Atlas Connection

Create a `.env` file in the `backend` folder with the following:

```env
PORT=5001
MONGODB_URI=mongodb+srv://chanishasachdeva83:Q82eGgxm9Kg0KB4m@cluster0.amdwi.mongodb.net/ecomcart?retryWrites=true&w=majority&appName=Cluster0
```

## Steps to Use MongoDB Atlas

1. **Create the .env file:**
   - Navigate to the `backend` folder
   - Create a new file named `.env` (not `.env.example`)
   - Copy the connection string above into the file

2. **Verify MongoDB Atlas Access:**
   - Make sure your IP address is whitelisted in MongoDB Atlas
   - Go to Network Access in MongoDB Atlas dashboard
   - Add your current IP or use `0.0.0.0/0` for all IPs (development only)

3. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Verify Connection:**
   - You should see: `✅ MongoDB connected successfully`
   - If you see an error, check your network access settings in MongoDB Atlas

## Connection String Breakdown

- **Username:** chanishasachdeva83
- **Password:** Q82eGgxm9Kg0KB4m
- **Cluster:** cluster0.amdwi.mongodb.net
- **Database:** ecomcart

The connection string includes:
- `retryWrites=true` - Enables retryable writes
- `w=majority` - Write concern for data consistency
- `appName=Cluster0` - Application identifier

## Security Note

⚠️ **Important:** The `.env` file is gitignored and will not be committed to the repository. This protects your credentials.

If you need to share this project, make sure to:
- Never commit the `.env` file
- Share credentials separately if needed
- Consider using environment variables in your deployment platform

