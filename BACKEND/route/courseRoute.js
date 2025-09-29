import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import upload from "../middleware/multer.js"
import {
    createCourse,
    editCourse,
    getCourseById,
    getCreatorCourses,
    getPublishedCourses,
    removeCourse
} from "../controller/courseController.js";

let courseRouter = express.Router()

courseRouter.post("/create/:creatorId", isAuth, createCourse);
courseRouter.put("/edit/:courseId", isAuth, editCourse);
courseRouter.get("/:courseId", getCourseById);
courseRouter.get("/creator-courses", isAuth, getCreatorCourses);
courseRouter.get("/published", getPublishedCourses);
courseRouter.delete("/delete/:courseId", isAuth, removeCourse);

// Remove lecture routes entirely
// courseRouter.post("/createlecture/:courseId", isAuth, createLecture);
// courseRouter.get("/lectures/:courseId", getCourseLecture);

export default courseRouter;








