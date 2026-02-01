import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    // Lecture completion tracking
    completedLectures: [{
        lecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture"
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        watchTime: {
            type: Number, // In seconds
            default: 0
        }
    }],
    // Quiz scores
    quizScores: [{
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz"
        },
        score: Number, // Percentage
        attemptNumber: Number,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Assignment submissions
    assignmentSubmissions: [{
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment"
        },
        submission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission"
        },
        grade: Number,
        submittedAt: Date
    }],
    // Overall progress metrics
    completionPercentage: {
        type: Number,
        default: 0
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    // Certificate generation
    certificateIssued: {
        type: Boolean,
        default: false
    },
    certificateUrl: {
        type: String
    }
}, { timestamps: true });

// Index for quick lookups
progressSchema.index({ user: 1, course: 1 }, { unique: true });

// Method to calculate completion percentage
progressSchema.methods.calculateCompletion = async function() {
    const Course = mongoose.model("Course");
    const course = await Course.findById(this.course).populate('lectures');
    
    if (!course || !course.lectures || course.lectures.length === 0) {
        this.completionPercentage = 0;
        return 0;
    }
    
    const totalLectures = course.lectures.length;
    const completedCount = this.completedLectures.length;
    
    this.completionPercentage = Math.round((completedCount / totalLectures) * 100);
    await this.save();
    
    return this.completionPercentage;
};

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
