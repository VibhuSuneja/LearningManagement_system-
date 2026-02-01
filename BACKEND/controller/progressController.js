import Progress from "../model/progressModel.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";

// Get or create student progress for a course
export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;

        let progress = await Progress.findOne({ 
            user: req.userId, 
            course: courseId 
        })
        .populate("completedLectures.lecture", "lectureTitle videoUrl")
        .populate("quizScores.quiz", "title passingScore")
        .populate("assignmentSubmissions.assignment", "title maxPoints dueDate")
        .populate("assignmentSubmissions.submission");

        if (!progress) {
            // Create new progress record
            progress = await Progress.create({
                user: req.userId,
                course: courseId
            });
        }

        // Calculate and update completion percentage
        await progress.calculateCompletion();

        return res.status(200).json({ progress });
    } catch (error) {
        console.error("Error fetching progress:", error);
        return res.status(500).json({ message: `Failed to fetch progress: ${error.message}` });
    }
};

// Mark a lecture as complete
export const markLectureComplete = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { watchTime } = req.body; // Optional: track watch time in seconds

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        let progress = await Progress.findOne({ 
            user: req.userId, 
            course: courseId 
        });

        if (!progress) {
            progress = await Progress.create({
                user: req.userId,
                course: courseId
            });
        }

        // Check if lecture is already marked complete
        const existingIndex = progress.completedLectures.findIndex(
            cl => cl.lecture.toString() === lectureId
        );

        if (existingIndex >= 0) {
            // Update watch time if provided
            if (watchTime) {
                progress.completedLectures[existingIndex].watchTime = watchTime;
            }
        } else {
            // Add new completed lecture
            progress.completedLectures.push({
                lecture: lectureId,
                watchTime: watchTime || 0
            });
        }

        // Update last accessed
        progress.lastAccessedAt = Date.now();

        await progress.save();

        // Calculate completion percentage
        const completionPercentage = await progress.calculateCompletion();

        // Check if course is complete (100%)
        if (completionPercentage === 100 && !progress.completedAt) {
            progress.completedAt = Date.now();
            // TODO: Trigger certificate generation in Phase 2
            await progress.save();
        }

        return res.status(200).json({ 
            message: "Lecture marked as complete",
            progress,
            completionPercentage
        });
    } catch (error) {
        console.error("Error marking lecture complete:", error);
        return res.status(500).json({ message: `Failed to mark lecture complete: ${error.message}` });
    }
};

// Unmark a lecture as complete
export const unmarkLectureComplete = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;

        const progress = await Progress.findOne({ 
            user: req.userId, 
            course: courseId 
        });

        if (!progress) {
            return res.status(404).json({ message: "Progress not found" });
        }

        // Remove lecture from completed list
        progress.completedLectures = progress.completedLectures.filter(
            cl => cl.lecture.toString() !== lectureId
        );

        // Reset completion date if it was marked complete
        if (progress.completedAt) {
            progress.completedAt = null;
        }

        await progress.save();

        // Recalculate completion percentage
        await progress.calculateCompletion();

        return res.status(200).json({ 
            message: "Lecture unmarked",
            progress
        });
    } catch (error) {
        console.error("Error unmarking lecture:", error);
        return res.status(500).json({ message: `Failed to unmark lecture: ${error.message}` });
    }
};

// Get all enrolled students' progress for a course (for educators)
export const getCourseStudentsProgress = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check authorization
        if (course.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to view student progress" });
        }

        const progressRecords = await Progress.find({ course: courseId })
            .populate("user", "name email photoUrl")
            .sort({ completionPercentage: -1 });

        return res.status(200).json({ 
            progressRecords,
            totalStudents: progressRecords.length
        });
    } catch (error) {
        console.error("Error fetching students progress:", error);
        return res.status(500).json({ message: `Failed to fetch students progress: ${error.message}` });
    }
};

// Get detailed progress for a specific student (for educators)
export const getStudentProgress = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check authorization
        if (course.creator.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to view student progress" });
        }

        const progress = await Progress.findOne({ 
            user: studentId, 
            course: courseId 
        })
        .populate("user", "name email photoUrl")
        .populate("completedLectures.lecture", "lectureTitle")
        .populate("quizScores.quiz", "title passingScore")
        .populate("assignmentSubmissions.assignment", "title maxPoints")
        .populate("assignmentSubmissions.submission");

        if (!progress) {
            return res.status(404).json({ message: "Progress not found for this student" });
        }

        return res.status(200).json({ progress });
    } catch (error) {
        console.error("Error fetching student progress:", error);
        return res.status(500).json({ message: `Failed to fetch student progress: ${error.message}` });
    }
};

// Get my overall progress across all courses
export const getMyOverallProgress = async (req, res) => {
    try {
        const progressRecords = await Progress.find({ user: req.userId })
            .populate("course", "title thumbnail category")
            .sort({ lastAccessedAt: -1 });

        const stats = {
            totalCourses: progressRecords.length,
            completedCourses: progressRecords.filter(p => p.completionPercentage === 100).length,
            inProgressCourses: progressRecords.filter(p => p.completionPercentage > 0 && p.completionPercentage < 100).length,
            averageCompletion: progressRecords.length > 0 
                ? Math.round(progressRecords.reduce((sum, p) => sum + p.completionPercentage, 0) / progressRecords.length)
                : 0
        };

        return res.status(200).json({ 
            progressRecords,
            stats
        });
    } catch (error) {
        console.error("Error fetching overall progress:", error);
        return res.status(500).json({ message: `Failed to fetch overall progress: ${error.message}` });
    }
};
