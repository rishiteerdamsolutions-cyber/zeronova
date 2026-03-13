import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { NgoProfile } from "@/models/NgoProfile";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");
    const status = request.nextUrl.searchParams.get("status");
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "admin" });
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const query: Record<string, unknown> = {};
    if (status) query.verificationStatus = status;
    const ngos = await NgoProfile.find(query).populate("userId", "email").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ngos });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
