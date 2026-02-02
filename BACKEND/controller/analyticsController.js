import Course from "../model/courseModel.js";
import Progress from "../model/progressModel.js";
import User from "../model/UserModel.js";
import Submission from "../model/submissionModel.js";

export const getEducatorAnalytics = async (req, res) => {
    try {
        const educatorId = req.userId;

        // 1. Get all courses created by this educator
        const courses = await Course.find({ creator: educatorId })
            .populate("enrolledStudents", "name email photoUrl")
            .lean();

        if (!courses || courses.length === 0) {
            return res.status(200).json({
                summary: { totalRevenue: 0, totalStudents: 0, averageCompletion: 0 },
                coursePerformance: [],
                recentActivity: []
            });
        }

        const courseIds = courses.map(c => c._id);

        // 2. Aggregate Revenue and Student Counts
        let totalRevenue = 0;
        let totalStudentsSet = new Set();
        
        courses.forEach(course => {
            // Filter out null students (deleted from DB but still in course array)
            const validStudents = course.enrolledStudents?.filter(s => s !== null) || [];
            const studentCount = validStudents.length;
            totalRevenue += (course.price || 0) * studentCount;
            validStudents.forEach(s => totalStudentsSet.add(s._id.toString()));
        });

        // 3. Fetch Progress Data for all students in these courses
        const allProgress = await Progress.find({ course: { $in: courseIds } }).lean();

        // 4. Calculate Course Performance
        const coursePerformance = courses.map(course => {
            const courseProgress = allProgress.filter(p => p.course.toString() === course._id.toString());
            const avgCompletion = courseProgress.length > 0 
                ? Math.round(courseProgress.reduce((sum, p) => sum + (p.completionPercentage || 0), 0) / courseProgress.length)
                : 0;
            
            // Filter null students for accurate count
            const validStudents = course.enrolledStudents?.filter(s => s !== null) || [];
            
            return {
                name: course.title || "Untitled Course",
                id: course._id,
                students: validStudents.length,
                completion: avgCompletion,
                revenue: (course.price || 0) * validStudents.length
            };
        });

        // 5. Total Average Completion Rate
        const totalAvgCompletion = coursePerformance.length > 0
            ? Math.round(coursePerformance.reduce((sum, cp) => sum + cp.completion, 0) / coursePerformance.length)
            : 0;

        // 6. Recent Activity (Newest enrollments or submissions)
        // We'll mimic this with recent progress updates or submissions
        const recentSubmissions = await Submission.find({ 
                assignment: { $in: await getAssignmentIds(courseIds) } 
            })
            .populate("student", "name photoUrl")
            .populate("assignment", "title")
            .sort({ submittedAt: -1 })
            .limit(5)
            .lean();

        // Filter out submissions where student or assignment was deleted
        const recentActivity = recentSubmissions
            .filter(sub => sub.student && sub.assignment) // Only include valid records
            .map(sub => ({
                id: sub._id,
                type: "assignment",
                user: sub.student?.name || "Deleted User",
                photo: sub.student?.photoUrl || null,
                content: `Submitted assignment: ${sub.assignment?.title || "Unknown Assignment"}`,
                time: sub.submittedAt
            }));

        res.status(200).json({
            summary: {
                totalRevenue,
                totalStudents: totalStudentsSet.size,
                averageCompletion: totalAvgCompletion,
                courseCount: courses.length
            },
            coursePerformance,
            recentActivity
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch analytics data" });
    }
};

// Helper to get assignment IDs for courses
async function getAssignmentIds(courseIds) {
    const Assignment = (await import("../model/assignmentModel.js")).default;
    const assignments = await Assignment.find({ course: { $in: courseIds } }).select("_id").lean();
    return assignments.map(a => a._id);
}
