import User from "../model/UserModel.js";
import { getIO } from "../socket/socket.js";

export const testRoute = (req, res) => {
    res.status(200).json({ status: "active", message: "Gamification controller reachable" });
};

// Utility to calculate level based on points
const calculateLevel = (points) => {
    return Math.floor(points / 500) + 1; // Level up every 500 points
};

// Award points and check for level ups/badges
export const awardPoints = async (userId, amount, reason) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        user.points += amount;
        
        const newLevel = calculateLevel(user.points);
        if (newLevel > user.level) {
            user.level = newLevel;
            // Emit socket event for level up to the specific user
            getIO().to(userId.toString()).emit("levelUp", { userId, level: newLevel, message: `Congratulations! You've reached Level ${newLevel}` });
        }

        await user.save();
        
        // Emit events to refresh UI and show feedback to the specific user
        const io = getIO();
        io.to(userId.toString()).emit("userUpdated", { userId });
        io.to(userId.toString()).emit("pointsAwarded", { 
            points: user.points, 
            amount, 
            reason,
            message: `+${amount} XP: ${reason}` 
        });
        
        return user;
    } catch (error) {
    }
};

// Update and maintain learning streaks
export const updateStreak = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // If no last activity, start the streak at 1
        if (!user.lastActivityDate) {
            user.streak = 1;
            user.maxStreak = 1;
            user.lastActivityDate = today;
            await user.save();
            
            // Emit events for first activity
            const io = getIO();
            const targetRoom = userId.toString();
            io.to(targetRoom).emit("streakUpdated", { 
                streak: 1, 
                message: `Current Streak: 1 Day! 🔥 Keep it going!` 
            });
            io.to(targetRoom).emit("userUpdated", { userId: targetRoom });
            return;
        }

        const lastActivity = new Date(user.lastActivityDate);
        const lastActivityDay = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
        
        const diffTime = today - lastActivityDay;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Already active today - emit event so user gets feedback, but don't increment
            const io = getIO();
            const targetRoom = userId.toString();
            io.to(targetRoom).emit("streakUpdated", { 
                streak: user.streak, 
                message: `Current Streak: ${user.streak} Days! 🔥` 
            });
            io.to(targetRoom).emit("userUpdated", { userId: targetRoom });
            return;
        } else if (diffDays === 1) {
            // Consecutive day!
            user.streak += 1;
            if (user.streak > user.maxStreak) {
                user.maxStreak = user.streak;
            }
            // Award bonus points for maintaining streak
            const streakBonus = Math.min(user.streak * 10, 100); // 10 XP per streak day, max 100
            await awardPoints(userId, streakBonus, `Streak Maintenance (${user.streak} days)`);
        } else {
            // Break in streak
            user.streak = 1;
        }

        user.lastActivityDate = today;
        await user.save();

        const io = getIO();
        const targetRoom = userId.toString();
        
        io.to(targetRoom).emit("streakUpdated", { 
            streak: user.streak, 
            message: `Current Streak: ${user.streak} Days! 🔥` 
        });
        
        // CRITICAL: Emit userUpdated so the frontend refetches user data (Nav Bar, etc.)
        io.to(targetRoom).emit("userUpdated", { userId: targetRoom });

        // Check for streak-related badges
        await checkBadges(userId, "streak_update");
        
    } catch (error) {
    }
};

// Check and unlock badges
export const checkBadges = async (userId, actionType) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const badgesToUnlock = [];
        const existingBadges = user.badges.map(b => b.name);

        if (actionType === "first_enrollment" && !existingBadges.includes("Fast Learner")) {
            badgesToUnlock.push({
                name: "Fast Learner",
                description: "Enrolled in your first course!",
                icon: "🚀"
            });
        }

        if (actionType === "live_session_join" && !existingBadges.includes("Live Scholar")) {
            badgesToUnlock.push({
                name: "Live Scholar",
                description: "Joined a real-time classroom session.",
                icon: "🎓"
            });
        }

        if (actionType === "streak_update") {
            if (user.streak >= 7 && !existingBadges.includes("Week Warrior")) {
                badgesToUnlock.push({
                    name: "Week Warrior",
                    description: "Maintained a 7-day learning streak!",
                    icon: "🛡️"
                });
            }
            if (user.streak >= 30 && !existingBadges.includes("Consistency King")) {
                badgesToUnlock.push({
                    name: "Consistency King",
                    description: "Unstoppable! 30-day streak achieved.",
                    icon: "👑"
                });
            }
        }

        if (badgesToUnlock.length > 0) {
            user.badges.push(...badgesToUnlock);
            await user.save();
            
            badgesToUnlock.forEach(badge => {
                getIO().to(userId.toString()).emit("badgeUnlocked", { 
                    userId, 
                    badgeName: badge.name, 
                    message: `Achievement Unlocked: ${badge.name}! ${badge.icon}` 
                });
            });
            
            getIO().to(userId.toString()).emit("userUpdated", { userId });
        }
    } catch (error) {
    }
};

// Get Leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find({ role: "student" })
            .select("name photoUrl points level badges streak maxStreak")
            .sort({ points: -1 })
            .limit(20); // Show more users to find those with streaks
            
        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
};
