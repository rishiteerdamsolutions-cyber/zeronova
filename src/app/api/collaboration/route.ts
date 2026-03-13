import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CollaborationPost } from "@/models/CollaborationPost";
import { NgoProfile } from "@/models/NgoProfile";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "20", 10), 50);
    const skip = (page - 1) * limit;

    await dbConnect();
    const verifiedNgoIds = await NgoProfile.find({ verificationStatus: "approved" })
      .select("_id")
      .lean();
    const ids = verifiedNgoIds.map((n) => n._id);

    const [posts, total] = await Promise.all([
      CollaborationPost.find({ ngoId: { $in: ids } })
        .populate("ngoId", "name logoUrl verificationStatus")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CollaborationPost.countDocuments({ ngoId: { $in: ids } }),
    ]);

    return NextResponse.json({ posts, total, page, limit });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, title, content, type } = body;
    if (!firebaseUid || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const ngo = await NgoProfile.findOne({ userId: user._id });
    if (!ngo) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (ngo.verificationStatus !== "approved") {
      return NextResponse.json({ error: "NGO must be verified to post" }, { status: 403 });
    }
    const post = await CollaborationPost.create({
      ngoId: ngo._id,
      title,
      content,
      type: type || "partnership",
    });
    return NextResponse.json({ post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
