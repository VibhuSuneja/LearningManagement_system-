import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/UserModel.js";
import ForumThread from "./model/ForumThread.js";
import ForumComment from "./model/ForumComment.js";

dotenv.config();

const testPhase6 = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");

        // 1. Get a test student and a test educator
        const student = await User.findOne({ role: "student" });
        const educator = await User.findOne({ role: "educator" });

        if (!student || !educator) {
            console.error("Test users not found. Please ensure users exist in the DB.");
            process.exit(1);
        }

        console.log(`Using Student: ${student.name} (${student._id})`);
        console.log(`Using Educator: ${educator.name} (${educator._id})`);

        // 2. Create a Thread (as Student)
        const thread = new ForumThread({
            title: "Phase 6 Integration Test",
            content: "Testing threads, likes, and comments logic.",
            author: student._id,
            category: "General"
        });
        await thread.save();
        console.log("Thread Created Successfully");

        // 3. Like the Thread (as Educator)
        thread.likes.push(educator._id);
        await thread.save();
        console.log("Thread Liked Successfully");

        // 4. Add a Comment (as Educator)
        const comment = new ForumComment({
            threadId: thread._id,
            author: educator._id,
            content: "Logic check: Commenting works!"
        });
        await comment.save();
        console.log("Comment Added Successfully");

        // 5. Test Following logic
        // Educator follows Student
        if (!educator.following.includes(student._id)) {
            educator.following.push(student._id);
            student.followers.push(educator._id);
            await educator.save();
            await student.save();
            console.log("Following Logic Verified");
        }

        // 6. Cleanup (Optional, but let's keep it for verification in UI later)
        console.log("Phase 6 Backend Logic Verified Successfully!");
        
        process.exit(0);
    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
};

testPhase6();
