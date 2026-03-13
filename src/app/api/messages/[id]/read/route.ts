import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { firebaseUid } = body;
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const msg = await Message.findOneAndUpdate(
      { _id: params.id, receiverId: user._id },
      { read: true },
      { new: true }
    );
    if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: msg });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
