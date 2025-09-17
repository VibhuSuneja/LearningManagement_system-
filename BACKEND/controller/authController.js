//Here Authentication related controller,will be made for login, signup,logout and route will also be provided
import User from "../model/UserModel.js" //importing the model 
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import sendMail from "../config/sendMail.js"
export const signUp= async(req,res) =>{
    try{ // for signing up we need name,email,password,role  which we will get from req.body
            const{name,email,password,role}=req.body
            let existUser= await User.findOne({email}) //finding existing user using email
            if(existUser){
                return res.status(400).json({message:"User already exits"}) //sending status with code 400 that the user already exists
            }
            if(!validator.isEmail(email)){ //to check syntax of email using validator package we have installed 
                return res.status(400).json({message:"Enter Valid Email"})
            }
            if(password.length < 8){ //making sure length is >8 and strong enough so that it can be difficult to decode 
                return res.status(400).json({message:"enter strong password"})

            }
            //encrypting our password using Bcrypt package 
            let hashPassword= await bcrypt.hash(password,10) //it hashes the plain password with salt rounds = 10.
            const user = await User.create({ //creating model user
                name,
                email,
                password:hashPassword,
                role
            })
            // now whenever a user is generated a token is generated and that token is parsed as cookie , in order to do this we need to generate a token so we use JWT for generation of token 
            // so create a file token.js inside config folder 
            //before creating a token in token.js create JWS_SECRET ="E34234D324RE2R3E" or any random value inside .env file 
            let token = await genToken(user._id) //giving user's id now .genToken is generated using parameter 
            res.cookie("token",token,{  // we want to store token inside cookie
                httpOnly:true,
                secure:false, //as we are running it on local server . When we deploy it will be turn to true 
                sameSite:"Strict", // will set to None when we will deploy it 
                maxAge:7*24*60*60*1000 // 7 days 24 hours 60 minutes 60 seconds 1000 milliseconds so token inside the cookie is stored for 7 days  
            })
            return res.status(201).json(user) //response as user
    } catch(error){
        return res.status(500).json({message:`Signup error${error}`})
        //error 
    }
}


export const login = async(req,res)=>{
    try{
        const{email, password}=req.body //from request body
        let user = await User.findOne({email}) //finding user from email using User model
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        let isMatch = await bcrypt.compare(password, user.password) //comparing the two passwords
        if(!isMatch){
             return res.status(400).json({message:"Incorrect Password"})
        }
          let token = await genToken(user._id) //giving user's id now .genToken is generated using parameter 
            res.cookie("token",token,{  // we want to store token inside cookie
                httpOnly:true,
                secure:false, //as we are running it on local server . When we deploy it will be turn to true 
                sameSite:"Strict", // will set to None when we will deploy it 
                maxAge:7*24*60*60*1000 // 7 days 24 hours 60 minutes 60 seconds 1000 milliseconds so token inside the cookie is stored for 7 days  
            })
             return res.status(200).json(user) //finding the user not finding
    }catch(error){
     return res.status(500).json({message:`Login error${error}`}) //same as above 
    }
}
// now we create a function for logOut 
export const logOut =async(req,res)=>{
    try{
// emptying cookie means loging out 
await res.clearCookie("token") //token inside cookie empties named as token
return res.status(200).json({message:"Logout Successfully"})
    } catch(error){
 return res.status(500).json({message:`LogOut error${error}`})

    }
}
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: `sendOTP error: ${error}` });
  }
};

export const verifyOTP= async (req,res)=>{
    try {
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp !=otp || user.otpExpires < Date.now() ){
            return res.status(404).json({message:"Invalid OTP"})
        }
        user.isOtpVerified= true;
        user.resetOtp= undefined;
        user.otpExpires= undefined

        await user.save();
        return res.status(200).json({message:"Otp verified Successfully"});
    } catch (error) {
             return res.status(500).json({message:`verify Otp error: ${error}`});
    }
}
export const resetPassword = async(req,res)=>{
    try {
        const{email,Password} = req.body
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(404).json({message:"OTP verification required"})
        }
        const hashPassword = await bcrypt.hash(Password,10)
        user.password= hashPassword,
        user.isOtpVerified= false


        await user.save()
        return res.status(200).json({message:"Password reset Successfully"})

    }catch (error) {
        return res.status(500).json({message:`reset Password error: ${error}`});
    }}