import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { VolunteerProfile } from "@/models/VolunteerProfile";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const id = request.nextUrl.searchParams.get("id");
    if (!userId && !id) {
      return NextResponse.json({ error: "Missing userId or id" }, { status: 400 });
    }
    await dbConnect();
    const query = userId ? { userId } : { _id: id };
    const profile = await VolunteerProfile.findOne(query)
      .populate("userId", "email")
      .lean();
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ profile });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, displayName, skills, interests, experience } = body;
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "volunteer" && user.role !== "innovator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const profile = await VolunteerProfile.findOneAndUpdate(
      { userId: user._id },
      {
        ...(displayName !== undefined && { displayName }),
        ...(skills !== undefined && { skills: Array.isArray(skills) ? skills : [] }),
        ...(interests !== undefined && { interests: Array.isArray(interests) ? interests : [] }),
        ...(experience !== undefined && { experience: String(experience) }),
      },
      { new: true }
    ).lean();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json({ profile });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
