import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createReview ,getReviews} from "../controller/reviewController.js"



let reviewRouter = express.Router()

reviewRouter.post("/createreview",isAuth,createReview)
reviewRouter.get("/getReview",getReviews)


export default reviewRouter