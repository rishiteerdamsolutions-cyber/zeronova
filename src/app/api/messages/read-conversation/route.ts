import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, withUserId } = body;
    if (!firebaseUid || !withUserId) {
      return NextResponse.json({ error: "Missing firebaseUid or withUserId" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await Message.updateMany(
      { senderId: withUserId, receiverId: user._id, read: false },
      { read: true }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
