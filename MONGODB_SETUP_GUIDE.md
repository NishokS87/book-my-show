# MongoDB Atlas Setup Guide

## Current Issue
Your server cannot connect to MongoDB Atlas. This is typically due to IP whitelisting.

## Quick Fix Steps

### 1. Login to MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Login with your credentials

### 2. Whitelist Your IP Address
1. In the left sidebar, click on **"Network Access"**
2. Click **"Add IP Address"** button
3. Choose one of these options:
   - **Option A (Recommended for Development)**: Click **"Allow Access From Anywhere"** (adds `0.0.0.0/0`)
   - **Option B (More Secure)**: Click **"Add Current IP Address"**
4. Click **"Confirm"**

### 3. Verify Database User
1. In the left sidebar, click on **"Database Access"**
2. Verify that user **"Nishok"** exists
3. If not, create a new user:
   - Click **"Add New Database User"**
   - Username: `Nishok`
   - Password: `Nishok123`
   - User Privileges: **Atlas Admin**
   - Click **"Add User"**

### 4. Get Correct Connection String
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster (cluster0)
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with `Nishok123`
6. Update `.env` file with the new connection string

## Your Current Connection String
```
mongodb+srv://Nishok:Nishok123@cluster0.alxajaq.mongodb.net/bookmyshow?retryWrites=true&w=majority&appName=Cluster0
```

## Testing Connection

After making changes, restart your server:
```powershell
npm run dev
```

You should see:
```
✅ MongoDB Connected: <your-cluster-address>
📊 Database: bookmyshow
```

## Alternative: Use Local MongoDB

If MongoDB Atlas continues to have issues, you can use local MongoDB:

1. **Install MongoDB Community Edition**:
   - Download from: https://www.mongodb.com/try/download/community
   - Run installer with default settings

2. **Update .env file**:
   ```
   MONGODB_URI=mongodb://localhost:27017/bookmyshow
   ```

3. **Start MongoDB service** (Windows):
   ```powershell
   net start MongoDB
   ```

4. **Restart your server**:
   ```powershell
   npm run dev
   ```

## Troubleshooting

### Error: "IP not whitelisted"
- Go to MongoDB Atlas → Network Access → Add 0.0.0.0/0

### Error: "Authentication failed"
- Verify username/password in Database Access
- Update .env file with correct credentials

### Error: "Cluster not found"
- Verify cluster name in connection string matches your Atlas cluster

### Connection takes too long
- Check your internet connection
- Try local MongoDB instead

## Need Help?
After following these steps, restart the server and the connection should work!
