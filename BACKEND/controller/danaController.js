import Invoice from "../model/InvoiceModel.js";
import Course from "../model/courseModel.js";
import User from "../model/UserModel.js";
import { DateTime } from "luxon";

/**
 * DANA FINANCIAL PROTOCOL - Controller
 * Handles advanced financial analytics, revenue tracking, and GST reporting.
 */

export const getFinancialHighlights = async (req, res) => {
    try {
        const educatorId = req.user._id;

        // 1. Get educator's courses
        const courses = await Course.find({ creator: educatorId }).select("_id title price").lean();
        const courseIds = courses.map(c => c._id);

        if (courses.length === 0) {
            return res.status(200).json({
                overview: { totalRevenue: 0, netEarnings: 0, totalTax: 0, totalSales: 0 },
                monthlyData: [],
                topCourses: []
            });
        }

        // 2. Fetch all invoices for these courses
        const invoices = await Invoice.find({ course: { $in: courseIds } })
            .populate("course", "title price")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .lean();

        // 3. Aggregate Summary
        const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
        const totalTax = invoices.reduce((sum, inv) => sum + (inv.gstAmount || 0), 0);
        const netEarnings = totalRevenue - totalTax; // Simple model: net = total - tax (neglecting platform fees for now)

        // 4. Monthly Trend Data (Last 6 months)
        const sixMonthsAgo = DateTime.now().minus({ months: 6 }).startOf("month");
        const monthlyAggregation = {};

        // Pre-fill last 6 months
        for (let i = 0; i < 6; i++) {
            const monthKey = DateTime.now().minus({ months: i }).toFormat("MMM yyyy");
            monthlyAggregation[monthKey] = { revenue: 0, sales: 0 };
        }

        invoices.forEach(inv => {
            const monthKey = DateTime.fromJSDate(inv.createdAt).toFormat("MMM yyyy");
            if (monthlyAggregation[monthKey]) {
                monthlyAggregation[monthKey].revenue += inv.totalAmount;
                monthlyAggregation[monthKey].sales += 1;
            }
        });

        const monthlyData = Object.keys(monthlyAggregation)
            .map(month => ({
                month,
                revenue: monthlyAggregation[month].revenue,
                sales: monthlyAggregation[month].sales
            }))
            .reverse();

        // 5. Course-wise Performance
        const courseStats = {};
        courses.forEach(c => {
            courseStats[c._id] = { title: c.title, revenue: 0, sales: 0 };
        });

        invoices.forEach(inv => {
            const id = inv.course?._id.toString();
            if (courseStats[id]) {
                courseStats[id].revenue += inv.totalAmount;
                courseStats[id].sales += 1;
            }
        });

        const topCourses = Object.values(courseStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        res.status(200).json({
            overview: {
                totalRevenue,
                netEarnings,
                totalTax,
                totalSales: invoices.length,
                currency: "INR"
            },
            monthlyData,
            topCourses,
            recentTransactions: invoices.slice(0, 10).map(inv => ({
                id: inv._id,
                invoiceNumber: inv.invoiceNumber,
                student: inv.user?.name || "Terminated Connection",
                course: inv.course?.title || "Asset Ref: Null",
                amount: inv.totalAmount,
                date: inv.createdAt
            }))
        });

    } catch (error) {
        console.error("DANA Protocol Analytics Error:", error);
        res.status(500).json({ message: "Failed to establish DANA uplink: " + error.message });
    }
};
