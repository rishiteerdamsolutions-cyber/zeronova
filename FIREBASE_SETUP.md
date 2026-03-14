# Firebase Configuration Guide for Zeronova

Follow these steps to configure Firebase for auth and file uploads.

---

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** (or use an existing project)
3. Enter project name (e.g. "zeronova")
4. Disable Google Analytics if you don't need it
5. Click **Create project**

---

## 2. Enable Authentication (Email/Password)

1. In Firebase Console → **Build** → **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click **Email/Password** → Enable it → Save

---

## 3. Storage (Optional – requires Blaze plan)

Firebase Storage requires the **Blaze (pay-as-you-go)** plan. If you don't want to use it:

- Leave `NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED` unset or `false` in `.env.local`
- File uploads (logos, documents) will show "Upload unavailable" – Auth and the rest of the app work normally

If you enable Storage:

1. Upgrade to Blaze in Firebase Console (billing)
2. In Firebase Console → **Build** → **Storage** → **Get started**
3. Choose **Start in production mode** (we'll add rules next)
4. Pick a region and create
5. Add `NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED=true` to `.env.local`

**Storage rules** (Storage → Rules tab) – allow authenticated uploads:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /ngos/{ngoId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 4. Get Your Config Values

1. In Firebase Console → **Project settings** (gear icon)
2. Under **Your apps**, click **Web** (</> icon) if not done
3. Register app with nickname (e.g. "zeronova-web")
4. Copy the `firebaseConfig` values

---

## 5. Add to `.env.local`

Create or update `.env.local` in the project root:

```env
# MongoDB (you already have this)
MONGODB_URI=mongodb+srv://...

# Firebase - paste your values here
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: enable Storage (requires Blaze plan)
# NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED=true
```

---

## 6. Create Your First Admin User

After Firebase is configured:

1. **Register** a user via the app (Register → Volunteer or NGO)
2. In Firebase Console → **Authentication** → **Users** – copy the new user's **UID**
3. Run the seed script to promote them to admin:

```bash
node scripts/seed-admin.js YOUR_FIREBASE_UID
```

Or manually add an admin in MongoDB:

- Open `users` collection
- Find the user by `firebaseUid`
- Set `role` to `"admin"`

---

## 7. Deploy (Vercel)

Add the same env vars in **Vercel** → Project → **Settings** → **Environment Variables**.

**Authorized domains:**

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add:
   - `localhost` (for dev)
   - Your Vercel domain (e.g. `zeronova.vercel.app`)

---

## Summary Checklist

- [ ] Firebase project created
- [ ] Email/Password auth enabled
- [ ] (Optional) Storage bucket created + rules set + `NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED=true`
- [ ] Web app registered, config copied
- [ ] `.env.local` updated with all 6 `NEXT_PUBLIC_FIREBASE_*` vars
- [ ] First user registered
- [ ] Admin user created (seed script or MongoDB)
- [ ] Vercel env vars added
- [ ] Authorized domains updated
