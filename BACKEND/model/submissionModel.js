import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    submissionText: {
        type: String
    },
    files: [{
        fileName: String,
        fileUrl: String,
        fileSize: Number, // In bytes
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ["submitted", "late", "graded", "returned"],
        default: "submitted"
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    // Grading information
    grade: {
        type: Number,
        min: 0
    },
    feedback: {
        type: String
    },
    aiGeneratedFeedback: {
        type: String
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    gradedAt: {
        type: Date
    },
    isLate: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for quick lookups
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
