import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { EventRegistration } from "@/models/EventRegistration";
import { Event } from "@/models/Event";
import { User } from "@/models/User";
import { NgoProfile } from "@/models/NgoProfile";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const ngoProfile = await NgoProfile.findOne({ userId: user._id });
    if (!ngoProfile) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    if (event.ngoId.toString() !== ngoProfile._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const regs = await EventRegistration.find({ eventId: params.id })
      .populate("volunteerId", "email")
      .lean();
    const volunteers = regs.map((r) => ({
      id: (r.volunteerId as { _id: unknown; email?: string })?._id,
      email: (r.volunteerId as { email?: string })?.email,
      registeredAt: r.createdAt,
    }));
    return NextResponse.json({ registrations: volunteers });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
