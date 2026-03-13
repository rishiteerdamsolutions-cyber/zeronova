import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { Opportunity } from "@/models/Opportunity";
import { Event } from "@/models/Event";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ngoId, type, name, email, message, opportunityId, eventId } = body;
    if (!name || !email || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();
    let targetNgoId = ngoId;
    if (opportunityId && !ngoId) {
      const opp = await Opportunity.findById(opportunityId).lean();
      if (opp) targetNgoId = opp.ngoId;
    }
    if (eventId && !ngoId) {
      const event = await Event.findById(eventId).lean();
      if (event) targetNgoId = event.ngoId;
    }
    if (!targetNgoId) return NextResponse.json({ error: "Could not determine NGO" }, { status: 400 });
    const inquiry = await Inquiry.create({
      ngoId: targetNgoId,
      name,
      email,
      message,
      type: type === "volunteer" ? "volunteer" : "contact",
      opportunityId: opportunityId || undefined,
      eventId: eventId || undefined,
    });
    return NextResponse.json({ inquiry });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
