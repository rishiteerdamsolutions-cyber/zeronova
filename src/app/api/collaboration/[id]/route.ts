import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CollaborationPost } from "@/models/CollaborationPost";
import { NgoProfile } from "@/models/NgoProfile";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const post = await CollaborationPost.findById(params.id)
      .populate("ngoId", "name logoUrl verificationStatus contactDetails")
      .lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const ngo = post.ngoId as { verificationStatus?: string };
    if (ngo?.verificationStatus !== "approved") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
