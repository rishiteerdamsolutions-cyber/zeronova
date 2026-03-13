import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { Event } from "@/models/Event";

export async function GET(request: NextRequest) {
  try {
    const ngoId = request.nextUrl.searchParams.get("ngoId");
    if (!ngoId) return NextResponse.json({ error: "Missing ngoId" }, { status: 400 });
    await dbConnect();
    const events = await Event.find({ ngoId }).sort({ date: 1 }).lean();
    return NextResponse.json({ events });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
