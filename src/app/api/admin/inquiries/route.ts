import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "admin" });
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const inquiries = await Inquiry.find({}).populate("ngoId", "name").sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ inquiries });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
