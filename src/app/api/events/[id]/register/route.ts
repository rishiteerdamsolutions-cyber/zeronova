import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { EventRegistration } from "@/models/EventRegistration";
import { Event } from "@/models/Event";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { firebaseUid } = body;
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "volunteer" && user.role !== "innovator") {
      return NextResponse.json({ error: "Only volunteers can register for events" }, { status: 403 });
    }
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    if (event.status !== "approved") {
      return NextResponse.json({ error: "Event is not open for registration" }, { status: 400 });
    }
    const existing = await EventRegistration.findOne({
      eventId: params.id,
      volunteerId: user._id,
    });
    if (existing) {
      return NextResponse.json({ error: "Already registered" }, { status: 409 });
    }
    const reg = await EventRegistration.create({
      eventId: params.id,
      volunteerId: user._id,
      status: "registered",
    });
    return NextResponse.json({ registration: reg });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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

    const reg = await EventRegistration.findOne({
      eventId: params.id,
      volunteerId: user._id,
    }).lean();
    return NextResponse.json({ registered: !!reg });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
