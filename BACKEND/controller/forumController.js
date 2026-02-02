import ForumThread from "../model/ForumThread.js";
import ForumComment from "../model/ForumComment.js";
import { createNotification } from "./notificationController.js";
import User from "../model/UserModel.js";
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const DOMPurify = createDOMPurify(new JSDOM('').window);

// -- Thread Controllers --

export const createThread = async (req, res) => {
    try {
        const { title, content, courseId, category, tags } = req.body;
        const author = req.user._id;

        const cleanTitle = DOMPurify.sanitize(title);
        const cleanContent = DOMPurify.sanitize(content);

        const newThread = new ForumThread({
            title: cleanTitle,
            content: cleanContent,
            author,
            courseId: courseId || null,
            category,
            tags
        });

        await newThread.save();
        res.status(201).json(newThread);
    } catch (error) {
        res.status(500).json({ message: "Error creating thread", error: error.message });
    }
};

export const getAllThreads = async (req, res) => {
    try {
        const { courseId, category } = req.query;
        console.log(`[Forum] Fetching threads. Category: ${category}, Course: ${courseId}`);
        let query = {};
        if (courseId) query.courseId = courseId;
        if (category) query.category = category;

        const threads = await ForumThread.find(query)
            .populate("author", "name photoUrl")
            .sort({ isPinned: -1, createdAt: -1 });

        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: "Error fetching threads", error: error.message });
    }
};

export const getThreadById = async (req, res) => {
    try {
        const thread = await ForumThread.findById(req.params.id)
            .populate("author", "name photoUrl role");
        
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        const comments = await ForumComment.find({ threadId: req.params.id })
            .populate("author", "name photoUrl role")
            .sort({ createdAt: 1 });

        res.status(200).json({ thread, comments });
    } catch (error) {
        res.status(500).json({ message: "Error fetching thread", error: error.message });
    }
};

export const toggleLikeThread = async (req, res) => {
    try {
        const thread = await ForumThread.findById(req.params.id);
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        const userId = req.user._id;
        const index = thread.likes.indexOf(userId);

        if (index === -1) {
            thread.likes.push(userId);
            // Notify author
            if (thread.author.toString() !== userId.toString()) {
                await createNotification(
                    thread.author,
                    userId,
                    "like",
                    `${req.user.name} liked your thread: "${thread.title}"`,
                    thread._id
                );
            }
        } else {
            thread.likes.splice(index, 1);
        }

        await thread.save();
        res.status(200).json(thread);
    } catch (error) {
        res.status(500).json({ message: "Error liking thread", error: error.message });
    }
};

// -- Comment Controllers --

export const addComment = async (req, res) => {
    try {
        const { content, parentCommentId } = req.body;
        const { threadId } = req.params;
        const author = req.user._id;

        const thread = await ForumThread.findById(threadId);
        if (!thread) return res.status(404).json({ message: "Thread not found" });
        if (thread.isLocked) return res.status(403).json({ message: "Thread is locked" });

        const cleanContent = DOMPurify.sanitize(content);

        const newComment = new ForumComment({
            threadId,
            author,
            content: cleanContent,
            parentCommentId: parentCommentId || null
        });

        await newComment.save();

        // Notify thread author
        if (thread.author.toString() !== author.toString()) {
            await createNotification(
                thread.author,
                author,
                "comment",
                `${req.user.name} replied to your thread: "${thread.title}"`,
                threadId
            );
        }

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

// -- Moderation --

export const deleteThread = async (req, res) => {
    try {
        const thread = await ForumThread.findById(req.params.id);
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        // Only author or educator/admin can delete
        if (thread.author.toString() !== req.user._id.toString() && req.user.role !== "educator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await ForumThread.findByIdAndDelete(req.params.id);
        await ForumComment.deleteMany({ threadId: req.params.id });

        res.status(200).json({ message: "Thread deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting thread", error: error.message });
    }
};

export const toggleFollowUser = async (req, res) => {
    try {
        const userToFollowId = req.params.userId;
        const myId = req.user._id;

        if (userToFollowId === myId.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await User.findById(userToFollowId);
        const me = await User.findById(myId);

        const isFollowing = me.following.includes(userToFollowId);

        if (isFollowing) {
            me.following = me.following.filter(id => id.toString() !== userToFollowId);
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== myId.toString());
        } else {
            me.following.push(userToFollowId);
            userToFollow.followers.push(myId);
            // Notify user
            await createNotification(
                userToFollowId,
                myId,
                "follow",
                `${me.name} started following you!`,
                null
            );
        }

        await me.save();
        await userToFollow.save();

        res.status(200).json({ isFollowing: !isFollowing });
    } catch (error) {
        res.status(500).json({ message: "Error toggling follow", error: error.message });
    }
};

export const togglePinThread = async (req, res) => {
    try {
        if (req.user.role !== "educator") return res.status(403).json({ message: "Only educators can pin threads" });
        const thread = await ForumThread.findById(req.params.id);
        thread.isPinned = !thread.isPinned;
        await thread.save();
        res.status(200).json(thread);
    } catch (error) {
        res.status(500).json({ message: "Error pinning thread", error: error.message });
    }
};

export const toggleLockThread = async (req, res) => {
    try {
        if (req.user.role !== "educator") return res.status(403).json({ message: "Only educators can lock threads" });
        const thread = await ForumThread.findById(req.params.id);
        thread.isLocked = !thread.isLocked;
        await thread.save();
        res.status(200).json(thread);
    } catch (error) {
        res.status(500).json({ message: "Error locking thread", error: error.message });
    }
};
