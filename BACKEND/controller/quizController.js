import Quiz from "../model/quizModel.js";
import Course from "../model/courseModel.js";
import Progress from "../model/progressModel.js";
import { createNotification } from "./notificationController.js";

// Create a new quiz
export const createQuiz = async (req, res) => {
    try {
        let { title, description, courseId, lectureId, questions, duration, passingScore, attempts } = req.body;

        if (!title || !courseId || !questions || questions.length === 0) {
            return res.status(400).json({ message: "Title, course, and questions are required" });
        }

        // Handle empty lectureId string from frontend
        if (lectureId === "" || lectureId === "undefined") {
            lectureId = undefined;
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if user is the creator of the course
        // Handle both populated (creator._id) and non-populated (creator) cases
        const creatorId = course.creator._id ? course.creator._id.toString() : course.creator.toString();
        if (creatorId !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to create quiz for this course" });
        }

        const quiz = await Quiz.create({
            title,
            description,
            course: courseId,
            lecture: lectureId,
            questions,
            duration,
            passingScore,
            attempts,
            creator: req.userId
        });

        // Notify enrolled students about new quiz
        const enrolledStudents = course.enrolledStudents || [];
        for (const studentId of enrolledStudents) {
            await createNotification(
                studentId,
                req.userId,
                "quiz_created",
                `A new quiz "${title}" has been added to "${course.title}".`,
                courseId
            );
        }

        return res.status(201).json({ 
            message: "Quiz created successfully", 
            quiz 
        });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return res.status(500).json({ message: `Failed to create quiz: ${error.message}` });
    }
};

// Get all quizzes for a course
export const getCourseQuizzes = async (req, res) => {
    try {
        const { courseId } = req.params;

        let quizzes = await Quiz.find({ course: courseId })
            .populate("creator", "name email")
            .populate("lecture", "lectureTitle");

        // If not an educator, remove studentAttempts for privacy
        if (req.user.role !== "educator") {
            quizzes = quizzes.map(quiz => {
                const quizObj = quiz.toObject();
                delete quizObj.studentAttempts;
                return quizObj;
            });
        }

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return res.status(500).json({ message: `Failed to fetch quizzes: ${error.message}` });
    }
};

// Get a specific quiz (for students taking the quiz)
export const getQuizById = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findById(quizId)
            .populate("creator", "name email")
            .populate("lecture", "lectureTitle")
            .select("-studentAttempts -questions.correctAnswer -questions.options.isCorrect");

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Check student's previous attempts
        const fullQuiz = await Quiz.findById(quizId);
        const studentAttempts = fullQuiz.studentAttempts.filter(
            attempt => attempt.student.toString() === req.userId
        );

        return res.status(200).json({ 
            quiz,
            attemptCount: studentAttempts.length,
            maxAttempts: quiz.attempts,
            canAttempt: quiz.attempts === 0 || studentAttempts.length < quiz.attempts
        });
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return res.status(500).json({ message: `Failed to fetch quiz: ${error.message}` });
    }
};

// Submit quiz attempt
export const submitQuizAttempt = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // Array of { questionId, selectedAnswer }

        if (!answers || answers.length === 0) {
            return res.status(400).json({ message: "Answers are required" });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Check if student has attempts remaining
        const studentAttempts = quiz.studentAttempts.filter(
            attempt => attempt.student.toString() === req.userId
        );

        if (quiz.attempts > 0 && studentAttempts.length >= quiz.attempts) {
            return res.status(403).json({ message: "Maximum attempts reached" });
        }

        // Grade the quiz
        let totalPoints = 0;
        let earnedPoints = 0;
        const gradedAnswers = [];

        for (const answer of answers) {
            const question = quiz.questions.id(answer.questionId);
            if (!question) continue;

            totalPoints += question.points;
            let isCorrect = false;

            if (question.questionType === "multiple-choice" || question.questionType === "true-false") {
                const selectedOption = question.options[parseInt(answer.selectedAnswer)];
                isCorrect = selectedOption && selectedOption.isCorrect;
            } else if (question.questionType === "short-answer") {
                // Simple text matching (case-insensitive)
                isCorrect = answer.selectedAnswer.trim().toLowerCase() === 
                           question.correctAnswer.trim().toLowerCase();
            }

            const pointsEarned = isCorrect ? question.points : 0;
            earnedPoints += pointsEarned;

            gradedAnswers.push({
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                pointsEarned
            });
        }

        const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const passed = score >= quiz.passingScore;

        // Add attempt to quiz
        quiz.studentAttempts.push({
            student: req.userId,
            answers: gradedAnswers,
            score,
            totalPoints,
            earnedPoints,
            passed,
            attemptNumber: studentAttempts.length + 1
        });

        await quiz.save();

        // Update student progress
        let progress = await Progress.findOne({ user: req.userId, course: quiz.course });
        if (!progress) {
            progress = await Progress.create({
                user: req.userId,
                course: quiz.course
            });
        }

        // Update quiz scores in progress
        const existingQuizIndex = progress.quizScores.findIndex(
            qs => qs.quiz.toString() === quizId
        );

        if (existingQuizIndex >= 0) {
            // Update if better score
            if (score > progress.quizScores[existingQuizIndex].score) {
                progress.quizScores[existingQuizIndex].score = score;
                progress.quizScores[existingQuizIndex].attemptNumber = studentAttempts.length + 1;
            }
        } else {
            progress.quizScores.push({
                quiz: quizId,
                score,
                attemptNumber: studentAttempts.length + 1
            });
        }

        await progress.save();

        // Trigger streak update on activity
        const { updateStreak } = await import("./gamificationController.js");
        await updateStreak(req.userId);

        return res.status(200).json({
            message: "Quiz submitted successfully",
            score,
            passed,
            earnedPoints,
            totalPoints,
            gradedAnswers
        });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        return res.status(500).json({ message: `Failed to submit quiz: ${error.message}` });
    }
};

// Get student's quiz results
export const getStudentQuizResults = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const studentAttempts = quiz.studentAttempts.filter(
            attempt => attempt.student.toString() === req.userId
        );

        return res.status(200).json({ 
            attempts: studentAttempts,
            quizTitle: quiz.title,
            passingScore: quiz.passingScore
        });
    } catch (error) {
        console.error("Error fetching quiz results:", error);
        return res.status(500).json({ message: `Failed to fetch quiz results: ${error.message}` });
    }
};

// Update quiz (for educators)
export const updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const updateData = req.body;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Check authorization
        if (quiz.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to update this quiz" });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json({ 
            message: "Quiz updated successfully", 
            quiz: updatedQuiz 
        });
    } catch (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ message: `Failed to update quiz: ${error.message}` });
    }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Check authorization
        if (quiz.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to delete this quiz" });
        }

        await quiz.deleteOne();

        return res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return res.status(500).json({ message: `Failed to delete quiz: ${error.message}` });
    }
};

// Get all quiz attempts for a course (for educators)
export const getCourseQuizAttempts = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if user is the creator
        const creatorId = course.creator._id ? course.creator._id.toString() : course.creator.toString();
        if (creatorId !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to view quiz attempts" });
        }

        const quizzes = await Quiz.find({ course: courseId })
            .populate("studentAttempts.student", "name email photoUrl")
            .select("title studentAttempts passingScore");

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error fetching quiz attempts:", error);
        return res.status(500).json({ message: `Failed to fetch quiz attempts: ${error.message}` });
    }
};
