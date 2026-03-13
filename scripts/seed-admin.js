/**
 * Seed script to create the first admin user.
 * Run: MONGODB_URI=... node scripts/seed-admin.js
 * You must first create the user in Firebase Auth manually, then run this with the firebase UID.
 */
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  profileRef: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seed() {
  const firebaseUid = process.argv[2] || process.env.ADMIN_FIREBASE_UID;
  const email = process.argv[3] || process.env.ADMIN_EMAIL;

  if (!firebaseUid || !email) {
    console.log("Usage: node scripts/seed-admin.js <firebaseUid> <email>");
    console.log("Or set ADMIN_FIREBASE_UID and ADMIN_EMAIL in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await User.findOne({ firebaseUid });
  if (existing) {
    await User.updateOne({ firebaseUid }, { role: "admin" });
    console.log("Updated existing user to admin:", email);
  } else {
    await User.create({ firebaseUid, email, role: "admin" });
    console.log("Created admin user:", email);
  }
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
