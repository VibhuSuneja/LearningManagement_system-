import Progress from "../model/progressModel.js";
import Course from "../model/courseModel.js";
import User from "../model/UserModel.js";

// PUBLIC endpoint — no auth required (anyone scanning QR should be able to verify)
export const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        // Certificate ID format: LMS-<last4 of courseId>-<last4 of userId>
        // e.g. LMS-5616-FDDB
        if (!certificateId || !certificateId.startsWith("LMS-")) {
            return res.status(400).json({
                success: false,
                message: "Invalid certificate ID format."
            });
        }

        const parts = certificateId.split("-");
        // parts = ["LMS", "5616", "FDDB"]
        if (parts.length !== 3) {
            return res.status(400).json({
                success: false,
                message: "Invalid certificate ID format."
            });
        }

        const courseSuffix = parts[1].toLowerCase();
        const userSuffix = parts[2].toLowerCase();

        // Find all completed progresses (100%) and match by suffix
        const completedProgresses = await Progress.find({
            completionPercentage: 100
        }).populate({
            path: "user",
            select: "name email photoUrl"
        }).populate({
            path: "course",
            select: "title category level creator thumbnail"
        });

        // Find the matching certificate by suffix
        const match = completedProgresses.find(p => {
            const cId = p.course?._id?.toString() || "";
            const uId = p.user?._id?.toString() || "";
            return (
                cId.slice(-4).toLowerCase() === courseSuffix &&
                uId.slice(-4).toLowerCase() === userSuffix
            );
        });

        if (!match) {
            return res.status(404).json({
                success: false,
                verified: false,
                message: "Certificate not found. This certificate ID could not be verified."
            });
        }

        // Certificate is valid!
        return res.status(200).json({
            success: true,
            verified: true,
            certificate: {
                certificateId: certificateId,
                studentName: match.user?.name || "Unknown",
                studentEmail: match.user?.email || "",
                courseTitle: match.course?.title || "Unknown Course",
                courseCategory: match.course?.category || "",
                courseLevel: match.course?.level || "",
                courseThumbnail: match.course?.thumbnail || "",
                completedAt: match.completedAt || match.updatedAt,
                enrolledAt: match.enrolledAt,
                completionPercentage: match.completionPercentage,
                lecturesCompleted: match.completedLectures?.length || 0,
                issuedBy: "Virtual Courses LMS",
                issuer: "Vibhu Suneja, Founder & Director"
            }
        });

    } catch (error) {
        console.error("Certificate verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while verifying certificate."
        });
    }
};
