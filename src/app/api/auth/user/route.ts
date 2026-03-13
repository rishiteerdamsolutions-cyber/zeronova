import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid: uid }).lean();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        profileRef: user.profileRef?.toString(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
