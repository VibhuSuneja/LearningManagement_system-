//Here, we connect our Database :
// DB Connect,model Create, mongoDB related work 
import mongoose from "mongoose";
//create async arrow function . Write inside try and catch block
const connectDb =async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL) //database connection from env where url is there
        console.log("DB Connected");
    } catch(error){
        console.error("DB Connection Failed");
    }
}
export default connectDb // function,we have made has to be exported,as we want to listen it in server...