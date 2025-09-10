// We will create routes with the help of express
import express from "express"

import { signUp,login,logOut } from "../controller/authController.js"
// making a variable named as authRouter , which we take from express.router
const authRouter = express.Router()
// if we want to update or change data we use post request . we give route of signup . we made controller of signup in controller folder 
authRouter.post("/signup",signUp)
authRouter.post("/login",login)
authRouter.get("/logout",logOut) //here we are not taking any value so we use get request 
export default authRouter