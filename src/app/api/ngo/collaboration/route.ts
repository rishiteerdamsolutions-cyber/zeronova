import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CollaborationPost } from "@/models/CollaborationPost";
import { NgoProfile } from "@/models/NgoProfile";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const ngoId = request.nextUrl.searchParams.get("ngoId");
    if (!ngoId) return NextResponse.json({ error: "Missing ngoId" }, { status: 400 });
    await dbConnect();
    const posts = await CollaborationPost.find({ ngoId })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ posts });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
