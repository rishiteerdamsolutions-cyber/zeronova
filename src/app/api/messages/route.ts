import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");
    const withUserId = request.nextUrl.searchParams.get("with");
    if (!firebaseUid || !withUserId) {
      return NextResponse.json({ error: "Missing firebaseUid or with" }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const messages = await Message.find({
      $or: [
        { senderId: user._id, receiverId: withUserId },
        { senderId: withUserId, receiverId: user._id },
      ],
    })
      .populate("senderId", "email")
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json({ messages });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, receiverUserId, content } = body;
    if (!firebaseUid || !receiverUserId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();
    const sender = await User.findOne({ firebaseUid });
    if (!sender) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const receiver = await User.findById(receiverUserId);
    if (!receiver) return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    const msg = await Message.create({
      senderId: sender._id,
      receiverId: receiver._id,
      content: String(content).trim(),
      read: false,
    });
    return NextResponse.json({ message: msg });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
