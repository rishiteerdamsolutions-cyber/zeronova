import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Opportunity } from "@/models/Opportunity";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const opp = await Opportunity.findById(params.id)
      .populate("ngoId", "name description logoUrl verificationStatus contactDetails userId")
      .lean();
    if (!opp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ opportunity: opp });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
