import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { EventRegistration } from "@/models/EventRegistration";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const regs = await EventRegistration.find({ volunteerId: user._id })
      .populate({ path: "eventId", populate: { path: "ngoId", select: "name logoUrl" } })
      .sort({ createdAt: -1 })
      .lean();
    const events = regs
      .filter((r) => r.eventId)
      .map((r) => ({
        ...(r.eventId as unknown as Record<string, unknown>),
        registrationId: r._id,
      }));
    return NextResponse.json({ events });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
