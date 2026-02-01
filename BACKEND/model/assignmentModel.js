import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    },
    dueDate: {
        type: Date,
        required: true
    },
    maxPoints: {
        type: Number,
        default: 100
    },
    allowedFileTypes: [{
        type: String, // e.g., "pdf", "docx", "txt"
    }],
    maxFileSize: {
        type: Number, // In MB
        default: 10
    },
    instructions: {
        type: String
    },
    attachments: [{
        fileName: String,
        fileUrl: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
