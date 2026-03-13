import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { NgoProfile } from "@/models/NgoProfile";
import { Event } from "@/models/Event";
import { Inquiry } from "@/models/Inquiry";
import { NgoDocument } from "@/models/NgoDocument";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid, role: "admin" });
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [pendingNgos, pendingEvents, totalInquiries, pendingDocuments] = await Promise.all([
      NgoProfile.countDocuments({ verificationStatus: "pending" }),
      Event.countDocuments({ status: "pending" }),
      Inquiry.countDocuments({}),
      NgoDocument.countDocuments({ verificationStatus: "pending" }),
    ]);

    return NextResponse.json({
      pendingNgos,
      pendingEvents,
      totalInquiries,
      pendingDocuments,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
