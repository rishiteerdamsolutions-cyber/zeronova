import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { NgoDocument } from "@/models/NgoDocument";
import { NgoProfile } from "@/models/NgoProfile";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ngoId = request.nextUrl.searchParams.get("ngoId");
    if (!ngoId) return NextResponse.json({ error: "Missing ngoId" }, { status: 400 });
    await dbConnect();
    const docs = await NgoDocument.find({ ngoId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ documents: docs });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, docType, fileUrl } = body;
    if (!firebaseUid || !docType || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const ngo = await NgoProfile.findOne({ userId: user._id });
    if (!ngo) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const doc = await NgoDocument.create({
      ngoId: ngo._id,
      docType: String(docType),
      fileUrl: String(fileUrl),
      verificationStatus: "pending",
    });
    return NextResponse.json({ document: doc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
