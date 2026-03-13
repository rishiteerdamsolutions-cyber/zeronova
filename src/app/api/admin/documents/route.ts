import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { NgoDocument } from "@/models/NgoDocument";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

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
    const documents = await NgoDocument.find(query)
      .populate("ngoId", "name")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ documents });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
