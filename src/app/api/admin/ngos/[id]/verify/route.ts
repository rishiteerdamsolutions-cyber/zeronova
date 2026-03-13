import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { NgoProfile } from "@/models/NgoProfile";
import { User } from "@/models/User";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { firebaseUid, action } = body;
    if (!firebaseUid || !action) return NextResponse.json({ error: "Missing params" }, { status: 400 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "admin" });
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const status = action === "approve" ? "approved" : "rejected";
    const ngo = await NgoProfile.findByIdAndUpdate(
      params.id,
      { verificationStatus: status, verifiedAt: new Date(), verifiedBy: user._id },
      { new: true }
    );
    if (!ngo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ngo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
