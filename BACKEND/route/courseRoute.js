import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createCourse,  editCourse,  getCourseById,  getCreatorCourses, getPublishedCourses, removeCourse,createLecture,removeLecture,getCourseLecture,editLecture, getCreatorById  } from "../controller/courseController.js"
import upload from "../middleware/multer.js"
import { searchWithAI } from "../controller/searchController.js"

let courseRouter = express.Router()

courseRouter.post("/create",isAuth,createCourse)
courseRouter.get("/getpublishedcourses",getPublishedCourses)
courseRouter.get("/getcreatorcourses",isAuth,getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/removecourse/:courseId",isAuth,removeCourse)
courseRouter.post("/createlecture/:courseId",isAuth,createLecture)
courseRouter.get("/getcourselecture/:courseId",isAuth,getCourseLecture)
courseRouter.post("/editlecture/:lectureId",isAuth,upload.single("videoUrl"),editLecture)
courseRouter.delete("/removelecture/:lectureId",isAuth,removeLecture)
courseRouter.post("/creator",isAuth,getCreatorById)

// for search
courseRouter.post("/search",searchWithAI)




export default courseRouter