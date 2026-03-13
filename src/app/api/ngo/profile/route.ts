import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { NgoProfile } from "@/models/NgoProfile";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const ngoId = request.nextUrl.searchParams.get("id");
    if (!userId && !ngoId) {
      return NextResponse.json({ error: "Missing userId or id" }, { status: 400 });
    }
    await dbConnect();
    const query = userId ? { userId } : { _id: ngoId };
    const ngo = await NgoProfile.findOne(query).populate("userId", "email").lean();
    if (!ngo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ngo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, name, description, contactDetails, logoUrl } = body;
    if (!firebaseUid) {
      return NextResponse.json({ error: "Missing firebaseUid" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "ngo" });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (contactDetails !== undefined) update.contactDetails = contactDetails;
    if (logoUrl !== undefined) update.logoUrl = logoUrl;
    const ngo = await NgoProfile.findOneAndUpdate(
      { userId: user._id },
      { $set: update },
      { new: true }
    );
    if (!ngo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ngo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
