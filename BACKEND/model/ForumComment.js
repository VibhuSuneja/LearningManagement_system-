import mongoose from "mongoose";

const forumCommentSchema = new mongoose.Schema({
    threadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ForumThread",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ForumComment",
        default: null // for nested/threaded replies
    }
}, { timestamps: true });

const ForumComment = mongoose.models.ForumComment || mongoose.model("ForumComment", forumCommentSchema);
export default ForumComment;
