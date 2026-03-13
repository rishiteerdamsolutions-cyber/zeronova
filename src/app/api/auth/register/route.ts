import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { NgoProfile } from "@/models/NgoProfile";
import { VolunteerProfile } from "@/models/VolunteerProfile";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, email, role, name, orgName, description, contactDetails } = body;

    if (!firebaseUid || !email || !role) {
      return NextResponse.json(
        { error: "Missing firebaseUid, email, or role" },
        { status: 400 }
      );
    }

    const validRoles = ["admin", "ngo", "volunteer", "innovator"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ $or: [{ firebaseUid }, { email }] });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const user = await User.create({
      firebaseUid,
      email,
      role,
    });

    if (role === "ngo") {
      const ngo = await NgoProfile.create({
        userId: user._id,
        name: orgName || name || "Untitled NGO",
        description: description || "",
        contactDetails: contactDetails || {},
        verificationStatus: "pending",
      });
      await User.findByIdAndUpdate(user._id, { profileRef: ngo._id });
    } else if (role === "volunteer" || role === "innovator") {
      const vol = await VolunteerProfile.create({
        userId: user._id,
        displayName: name || "",
        skills: [],
        interests: [],
        experience: "",
      });
      await User.findByIdAndUpdate(user._id, { profileRef: vol._id });
    }

    const updatedUser = await User.findById(user._id).lean();
    const profileRef = role === "ngo"
      ? (await NgoProfile.findOne({ userId: user._id }))?._id
      : (role === "volunteer" || role === "innovator")
      ? (await VolunteerProfile.findOne({ userId: user._id }))?._id
      : null;

    return NextResponse.json({
      user: {
        id: updatedUser!._id.toString(),
        email: updatedUser!.email,
        role: updatedUser!.role,
        profileRef: profileRef?.toString(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
