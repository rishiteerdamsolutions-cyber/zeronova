import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { ImpactLabIdea } from "@/models/ImpactLabIdea";
import { User } from "@/models/User";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { firebaseUid, action } = body;
    if (!firebaseUid || !action) return NextResponse.json({ error: "Missing params" }, { status: 400 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "admin" });
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const status = action === "approve" ? "approved" : "rejected";
    const idea = await ImpactLabIdea.findByIdAndUpdate(
      params.id,
      { status, reviewedAt: new Date(), reviewedBy: user._id },
      { new: true }
    );
    if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ idea });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
