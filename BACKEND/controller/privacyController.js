import User from "../model/UserModel.js";
import Course from "../model/courseModel.js";
import Submission from "../model/submissionModel.js";
import Progress from "../model/progressModel.js";
import Notification from "../model/notificationModel.js";
import Review from "../model/reviewModel.js";
import ForumThread from "../model/ForumThread.js";
import ForumComment from "../model/ForumComment.js";
import Quiz from "../model/quizModel.js";
import mongoose from "mongoose";

/**
 * @desc    Export all user data (GDPR Data Portability)
 * @route   GET /api/privacy/export
 * @access  Private
 */
export const exportUserData = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Core Profile Data
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Academic Data
        const enrolledCourses = await Course.find({ enrolledStudents: userId }).select("title category level").lean();
        const submissions = await Submission.find({ student: userId }).populate("assignment", "title").lean();
        const progress = await Progress.find({ user: userId }).populate("course", "title").lean();
        
        // 3. Social Data
        const forumThreads = await ForumThread.find({ author: userId }).lean();
        const forumComments = await ForumComment.find({ author: userId }).lean();
        const reviews = await Review.find({ user: userId }).lean();

        // 4. Notifications
        const notifications = await Notification.find({ 
            $or: [{ recipient: userId }, { sender: userId }] 
        }).limit(100).lean();

        // Compile Everything
        const fullDataDump = {
            profile: {
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                socialLinks: user.socialLinks,
                gamification: {
                    points: user.points,
                    level: user.level,
                    badges: user.badges
                },
                accountCreated: user.createdAt
            },
            academic: {
                enrolledCourses,
                submissions: submissions.map(s => ({
                    assignment: s.assignment?.title,
                    content: s.submissionText,
                    grade: s.grade,
                    submittedAt: s.submittedAt
                })),
                learningProgress: progress.map(p => ({
                    course: p.course?.title,
                    completion: p.completionPercentage,
                    lastAccessed: p.updatedAt
                }))
            },
            social: {
                forumThreads: forumThreads.map(t => ({ title: t.title, content: t.content, date: t.createdAt })),
                forumComments: forumComments.map(c => ({ content: c.content, date: c.createdAt })),
                courseReviews: reviews.map(r => ({ comment: r.comment, rating: r.rating }))
            },
            meta: {
                exportDate: new Date().toISOString(),
                platform: "AI-Powered LMS",
                compliance: "GDPR / DPDP (India) Compliant"
            }
        };

        res.status(200).json(fullDataDump);
    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: "Failed to export user data", error: error.message });
    }
};

/**
 * @desc    Delete account and all PII (Right to be Forgotten - CASCADE)
 * @route   DELETE /api/privacy/delete-account
 * @access  Private
 */
export const deleteAccountHardened = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }

        // --- STEP 1: Handle Educational Relations (CASCADE Logic) ---
        
        // Remove from Course enrolledStudents arrays
        await Course.updateMany(
            { enrolledStudents: userId },
            { $pull: { enrolledStudents: userId } },
            { session }
        );

        // Delete Submissions
        await Submission.deleteMany({ student: userId }, { session });

        // Delete Progress Tracking
        await Progress.deleteMany({ user: userId }, { session });

        // Delete Reviews
        await Review.deleteMany({ user: userId }, { session });

        // --- STEP 2: Handle Social Relations (ANONYMIZE OR DELETE) ---
        
        // For hard delete, we remove notifications
        await Notification.deleteMany(
            { $or: [{ recipient: userId }, { sender: userId }] },
            { session }
        );

        // Forum Threads & Comments: We delete them to ensure all PII is wiped
        await ForumThread.deleteMany({ author: userId }, { session });
        await ForumComment.deleteMany({ author: userId }, { session });

        // --- STEP 3: Specialized Content (Educator Case) ---
        if (user.role === "educator") {
            // Find courses created by this person
            const createdCourses = await Course.find({ creator: userId }).session(session);
            
            for (const course of createdCourses) {
                // We mark courses as orphaned or deleted. 
                // To be safe for students, we just null the creator and unpublish
                course.creator = null;
                course.isPublished = false;
                course.title = `[Archived] ${course.title}`;
                await course.save({ session });
            }
        }

        // --- STEP 4: Remove Following Links ---
        await User.updateMany(
            { followers: userId },
            { $pull: { followers: userId } },
            { session }
        );
        await User.updateMany(
            { following: userId },
            { $pull: { following: userId } },
            { session }
        );

        // --- STEP 5: Delete Core User Document ---
        await User.findByIdAndDelete(userId, { session });

        await session.commitTransaction();
        res.clearCookie("token"); // Assuming cookie-based auth
        res.status(200).json({ message: "Account and all personal data deleted successfully. We're sorry to see you go." });

    } catch (error) {
        await session.abortTransaction();
        console.error("Account Deletion Error:", error);
        res.status(500).json({ message: "Critical error during account deletion", error: error.message });
    } finally {
        session.endSession();
    }
};
