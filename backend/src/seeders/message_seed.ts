import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import { Room } from "../models/Room.js";
import { Membership } from "../models/Membership.js";
import { Message } from "../models/Message.js";
import mongoose from "mongoose";

export async function seedMessageData() {
    try {
        // Connect to database
        await connectDB();
        console.log("Connected to database");

        // Get or find two existing users
        const users = await User.find().limit(2);
        
        if (users.length < 2) {
            console.error("Error: Need at least 2 users in the database. Please seed users first.");
            await mongoose.disconnect();
            process.exit(1);
        }

        // Store first user after validation - TypeScript now knows it exists
        const firstUser = users[0];
        if (!firstUser) {
            console.error("Error: First user is undefined.");
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log(`Found ${users.length} users: ${users.map(u => u.name).join(", ")}`);

        // Create or find the "General" room
        let room = await Room.findOne({ name: "General" });
        
        if (!room) {
            room = await Room.create({
                name: "General",
                isPrivate: false,
                privateId: null
            });
            console.log("Created room: General");
        } else {
            console.log("Room 'General' already exists");
        }

        // Create memberships for the two users
        const memberships = [];
        for (const user of users) {
            // Check if membership already exists
            const existingMembership = await Membership.findOne({
                userId: user._id,
                roomId: room._id
            });

            if (!existingMembership) {
                const membership = await Membership.create({
                    userId: user._id,
                    roomId: room._id,
                    joinedAt: new Date()
                });
                memberships.push(membership);
                console.log(`Created membership for user: ${user.name}`);
            } else {
                console.log(`Membership already exists for user: ${user.name}`);
                memberships.push(existingMembership);
            }
        }

        // Create a welcome message from the first user
        const existingMessage = await Message.findOne({
            content: "Welcome!",
            roomId: room._id
        });

        if (!existingMessage && room) {
            const message = await Message.create({
                content: "Welcome!",
                senderId: firstUser._id,
                roomId: room._id,
                createdAt: new Date()
            });
            console.log(`Created message: "Welcome!" from ${firstUser.name}`);
        } else if (existingMessage) {
            console.log("Message 'Welcome!' already exists");
        }

        console.log("\n✅ Seed completed successfully!");
        console.log("You can verify the data in MongoDB Compass:");
        console.log("  - db.rooms.find()");
        console.log("  - db.memberships.find()");
        console.log("  - db.messages.find()");

    } catch (error) {
        console.error("Error seeding message data:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed");
    }
}

// Run the seed function if this file is executed directly
seedMessageData();

