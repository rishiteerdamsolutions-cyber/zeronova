import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Event } from "@/models/Event";
import { User } from "@/models/User";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { firebaseUid, action } = body;
    if (!firebaseUid || !action) {
      return NextResponse.json({ error: "Missing firebaseUid or action" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "admin" });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const status = action === "approve" ? "approved" : "rejected";
    const event = await Event.findByIdAndUpdate(
      params.id,
      { status, approvedAt: new Date(), approvedBy: user._id },
      { new: true }
    );
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ event });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
