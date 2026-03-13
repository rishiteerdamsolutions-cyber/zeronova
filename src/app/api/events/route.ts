import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { Event } from "@/models/Event";
import { NgoProfile } from "@/models/NgoProfile";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
    const skip = (page - 1) * limit;
    const status = searchParams.get("status") || "approved";

    await dbConnect();

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const [events, total] = await Promise.all([
      Event.find(query).populate("ngoId", "name logoUrl verificationStatus userId").sort({ date: 1 }).skip(skip).limit(limit).lean(),
      Event.countDocuments(query),
    ]);

    return NextResponse.json({ events, total, page, limit });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, title, description, date, location } = body;
    if (!firebaseUid || !title || !date || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "ngo" });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const ngo = await NgoProfile.findOne({ userId: user._id });
    if (!ngo) return NextResponse.json({ error: "NGO profile not found" }, { status: 404 });
    const event = await Event.create({
      ngoId: ngo._id,
      title,
      description: description || "",
      date: new Date(date),
      location,
      status: "pending",
    });
    return NextResponse.json({ event });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
