# Zeronova Deployment Guide

## Vercel Deployment

### 1. Push to GitHub
```bash
git remote add origin https://github.com/rishiteerdamsolutions-cyber/zeronova.git
git push -u origin main
```

### 2. Import in Vercel
1. Go to [vercel.com](https://vercel.com)
2. **Add New Project** → Import from GitHub
3. Select the `zeronova` repository
4. Framework preset: **Next.js** (auto-detected)

### 3. Environment Variables
Add these in Vercel → Project Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | `mongodb+srv://rishiteerdamsolutions_db_user:feNsr7Pk1a8XKkfq@zeronova.jffw7at.mongodb.net/zeronova?appName=zeronova` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | From Firebase Console |

**Optional** (for server-side Firebase Admin):
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

### 4. Deploy
Click **Deploy**. Vercel will build and deploy automatically.

### 5. Post-Deploy
- **Create Admin User**: Run the seed script locally with your Firebase UID after creating an admin in Firebase Auth, or use a custom script
- **Firebase**: Add your Vercel domain to Firebase Auth authorized domains
- **MongoDB Atlas**: Network access `0.0.0.0/0` is already configured

## PWA
The app is a Progressive Web App. Users can install it from the browser on mobile and desktop.
