import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { Opportunity } from "@/models/Opportunity";
import { NgoProfile } from "@/models/NgoProfile";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const ngoId = searchParams.get("ngo");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
    const skip = (page - 1) * limit;

    await dbConnect();

    const verifiedNgoIds = await NgoProfile.find({ verificationStatus: "approved" })
      .select("_id")
      .lean();
    const ids = verifiedNgoIds.map((n) => n._id);

    const query: Record<string, unknown> = { ngoId: { $in: ids } };
    if (category && category !== "all") query.category = category;
    if (ngoId) query.ngoId = ngoId;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(query).populate("ngoId", "name logoUrl verificationStatus userId").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Opportunity.countDocuments(query),
    ]);

    return NextResponse.json({ opportunities, total, page, limit });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, title, description, category } = body;
    if (!firebaseUid || !title || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "ngo" });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const ngo = await NgoProfile.findOne({ userId: user._id });
    if (!ngo) return NextResponse.json({ error: "NGO profile not found" }, { status: 404 });
    const opp = await Opportunity.create({
      ngoId: ngo._id,
      title,
      description: description || "",
      category,
    });
    return NextResponse.json({ opportunity: opp });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
