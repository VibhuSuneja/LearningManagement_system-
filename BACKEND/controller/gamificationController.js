import User from "../model/UserModel.js";
import { io } from "../socket/socket.js";

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
            console.log(`[Gamification] Level up for user ${userId} to Level ${newLevel}`);
            io.to(userId.toString()).emit("levelUp", { userId, level: newLevel, message: `Congratulations! You've reached Level ${newLevel}` });
        }

        await user.save();
        console.log(`[Gamification] Awarded ${amount} XP to user ${userId}. Total: ${user.points}`);
        
        // Emit update to refresh UI for the specific user
        io.to(userId.toString()).emit("userUpdated", { userId });
        
        return user;
    } catch (error) {
        console.error("Error awarding points:", error);
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

        if (badgesToUnlock.length > 0) {
            user.badges.push(...badgesToUnlock);
            await user.save();
            
            console.log(`[Gamification] Unlocked ${badgesToUnlock.length} badges for user ${userId}`);
            
            badgesToUnlock.forEach(badge => {
                io.to(userId.toString()).emit("badgeUnlocked", { 
                    userId, 
                    badgeName: badge.name, 
                    message: `Achievement Unlocked: ${badge.name}! ${badge.icon}` 
                });
            });
            
            io.to(userId.toString()).emit("userUpdated", { userId });
        }
    } catch (error) {
        console.error("Error checking badges:", error);
    }
};

// Get Leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find({ role: "student" })
            .select("name photoUrl points level badges")
            .sort({ points: -1 })
            .limit(10);
            
        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
};
