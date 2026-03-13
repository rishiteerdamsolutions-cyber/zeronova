import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";
import { User } from "@/models/User";
import { NgoProfile } from "@/models/NgoProfile";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");
    if (!firebaseUid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const user = await User.findOne({ firebaseUid });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const messages = await Message.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    })
      .populate("senderId", "email")
      .populate("receiverId", "email")
      .sort({ createdAt: -1 })
      .lean();

    const seen = new Set<string>();
    const conversations: Array<{
      userId: string;
      email: string;
      name?: string;
      lastMessage: string;
      lastAt: Date;
      unread: number;
    }> = [];

    for (const m of messages) {
      const otherId = (m.senderId as { _id: { toString: () => string } })?._id?.toString() === user._id.toString()
        ? (m.receiverId as { _id: { toString: () => string }; email?: string })
        : (m.senderId as { _id: { toString: () => string }; email?: string });
      const otherIdStr = (otherId as { _id: { toString: () => string } })?._id?.toString();
      if (!otherIdStr || seen.has(otherIdStr)) continue;
      seen.add(otherIdStr);

      const convMessages = messages.filter((x) => {
        const s = (x.senderId as { _id?: { toString: () => string } })?._id?.toString();
        const r = (x.receiverId as { _id?: { toString: () => string } })?._id?.toString();
        return (s === user._id.toString() && r === otherIdStr) || (r === user._id.toString() && s === otherIdStr);
      });
      const last = convMessages[0];
      const unread = convMessages.filter(
        (x) =>
          (x.receiverId as { _id?: { toString: () => string } })?._id?.toString() === user._id.toString() &&
          !(x as { read?: boolean }).read
      ).length;

      const ngo = await NgoProfile.findOne({ userId: otherIdStr }).lean();
      conversations.push({
        userId: otherIdStr,
        email: (otherId as { email?: string })?.email || "",
        name: ngo?.name,
        lastMessage: (last as { content?: string })?.content || "",
        lastAt: (last as { createdAt?: Date })?.createdAt || new Date(),
        unread,
      });
    }

    return NextResponse.json({ conversations });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
