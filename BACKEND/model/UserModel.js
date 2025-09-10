import mongoose from "mongoose";
// creating schema for our model and timestamp to know at which time our user was created
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
// mandatory
    },
    description:{
        type:String
//not necessary 
    },
    email:{
        type:String,
        required:true,
        unique:true
        //email must be unique and mandatory 
    },
    password:{
        type:String
    },
    role:{
        // role must be there compulsory either student or educator
        type:String,
        enum:["student","educator"],
        required:true
    },
    photoUrl:{
        //as we want photo of the person 
        type:String,
        default:""
    },
    //courses enrolled by user 
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId, //here we have id of our individual course
        ref:"Course" //it will take reference from Course Model

    }]
},{timestamps:true})
//creating model for User schema is userSchema 
const User= mongoose.model("User", userSchema)
export default(User) //exporting our User
//Authentication controller will be made for login, signup,logout ...later we will make for authentication also.

