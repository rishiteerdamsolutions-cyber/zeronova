import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Event } from "@/models/Event";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const event = await Event.findById(params.id)
      .populate("ngoId", "name description logoUrl verificationStatus contactDetails userId")
      .lean();
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ event });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
