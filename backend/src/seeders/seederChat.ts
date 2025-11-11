import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Room } from "../models/Room.js";
import { Message } from "../models/Message.js";
import { Membership } from "../models/Membership.js";
import User from "../models/User.js";

export async function seedChat() {
  try {
    await connectDB();

    // 1️⃣ Fetch any two users
    const users = await User.find().limit(2);
    if (users.length < 2) {
      console.error("❌ Need at least 2 users to seed chat data.");
      return;
    }

    const user1 = users[0];
    const user2 = users[1];
    if (!user1 || !user2) {
      throw new Error("❌ Failed to fetch two users for seeding.");
    }
    console.log(`Using users: ${user1.email}, ${user2.email}`);

    // 2️⃣ Create or fetch "General" room
    let room = await Room.findOne({ name: "General" });


    if (!room) {
      room = await Room.create({
        name: "General",
        isPrivate: false,
        privateId: null,
      });
      console.log("✅ Room 'General' created");
    } else {
      console.log("ℹ️ Room 'General' already exists");
    }

    // 3️⃣ Create memberships for both users
    for (const user of [user1, user2]) {
      const existing = await Membership.findOne({
        userId: user._id,
        roomId: room._id,
      });

      if (!existing) {
        await Membership.create({
          userId: user._id,
          roomId: room._id,
        });
        console.log(`✅ Added ${user.email} to 'General'`);
      } else {
        console.log(`ℹ️ ${user.email} already in 'General'`);
      }
    }

    // 4️⃣ Add a welcome message (only if it doesn't exist)
    const messageExists = await Message.findOne({
      roomId: room._id,
      content: "Welcome!",
    });

    if (!messageExists) {
      await Message.create({
        content: "Welcome!",
        senderId: user1._id, // user1 sends the first message
        roomId: room._id,
      });
      console.log("✅ Message 'Welcome!' created");
    } else {
      console.log("ℹ️ 'Welcome!' message already exists");
    }

    console.log("🎉 Chat seed completed successfully!");
  } catch (err) {
    console.error("❌ Error seeding chat data:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

seedChat()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
