import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { ImpactLabIdea } from "@/models/ImpactLabIdea";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status") || "approved";
    await dbConnect();
    const query = status ? { status } : {};
    const ideas = await ImpactLabIdea.find(query).populate("submitterId", "email").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ideas });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, title, description, category, submitterRole } = body;
    if (!firebaseUid || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const idea = await ImpactLabIdea.create({
      submitterId: user._id,
      submitterRole: submitterRole || user.role,
      title,
      description,
      category: category || undefined,
    });
    return NextResponse.json({ idea });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
