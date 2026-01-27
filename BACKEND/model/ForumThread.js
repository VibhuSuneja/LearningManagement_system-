import mongoose from "mongoose";

const forumThreadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: null // null means general discussion
    },
    category: {
        type: String,
        enum: ["General", "Question", "Announcement", "Feedback", "Resources"],
        default: "General"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    tags: [String],
    isPinned: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ForumThread = mongoose.models.ForumThread || mongoose.model("ForumThread", forumThreadSchema);
export default ForumThread;
