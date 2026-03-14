# Admin Login & Messaging Guide

## Admin Login

**Yes, admin login is included in the plan.** Admins use the same Login page as volunteers and NGOs.

### How to create your first admin

1. **Register as a volunteer** (or NGO) via the app:
   - Go to Register → Volunteer
   - Create an account with your email/password

2. **Get your Firebase UID:**
   - Firebase Console → Authentication → Users
   - Find your user and copy the **User UID** (long string like `abc123xyz...`)

3. **Run the seed script** to promote that user to admin:
   ```bash
   node scripts/seed-admin.js YOUR_FIREBASE_UID your@email.com
   ```
   Or with env vars:
   ```bash
   ADMIN_FIREBASE_UID=your_uid ADMIN_EMAIL=your@email.com node scripts/seed-admin.js
   ```

4. **Log in** at `/login` – you will be redirected to `/dashboard/admin`.

### Admin dashboard features

- Manage NGOs (approve/reject verification)
- Approve/reject events
- View inquiries
- Manage NGO documents
- Review Impact Lab ideas

---

## Messaging

**Messaging is in the plan (Plan 3: Complete).** Volunteers message NGOs; NGOs reply from their inbox.

### How volunteers send messages

1. **From an NGO profile** – Click **"Message NGO"** on the NGO’s public profile (`/ngo/[id]`).

2. **From opportunities/events** – Go to an opportunity or event detail page, find the NGO, and use the link to message them (or go to the NGO profile first).

### How to view and reply (NGOs)

1. Log in as an NGO user.
2. Go to **Dashboard → Inbox** (or `/dashboard/ngo/inbox`).
3. Click a conversation to view and reply.

### How to view and reply (Volunteers)

1. Log in as a volunteer.
2. Go to **Dashboard → Messages** (bottom nav or sidebar when logged in).
3. Your conversations with NGOs appear in the list; click one to chat.

### Flow

- **Volunteer** → Message NGO (from NGO profile or opportunity)
- **NGO** → Receives in Inbox, replies
- Messages are stored in MongoDB; no real-time push yet (refresh to see new messages).
