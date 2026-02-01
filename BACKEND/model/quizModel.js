import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ["multiple-choice", "true-false", "short-answer"],
        default: "multiple-choice"
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    correctAnswer: {
        type: String, // For short-answer questions
    },
    points: {
        type: Number,
        default: 1
    },
    explanation: {
        type: String // Optional explanation for correct answer
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
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
    questions: [questionSchema],
    duration: {
        type: Number, // Duration in minutes
        default: 30
    },
    passingScore: {
        type: Number, // Percentage required to pass
        default: 60
    },
    attempts: {
        type: Number, // Max attempts allowed (0 = unlimited)
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Quiz attempts by students
    studentAttempts: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        answers: [{
            questionId: mongoose.Schema.Types.ObjectId,
            selectedAnswer: String, // Index of selected option or text answer
            isCorrect: Boolean,
            pointsEarned: Number
        }],
        score: Number, // Percentage score
        totalPoints: Number,
        earnedPoints: Number,
        passed: Boolean,
        attemptNumber: Number,
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
