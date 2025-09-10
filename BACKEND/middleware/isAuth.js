//verifying our token
import jwt from "jsonwebtoken"                         //verify json token
// now we create an async arrow function having request,response and next as parameters . Whenever next function calls only then we can proceed
const isAuth = async(req,res,next) =>{ 
    try{
        let {token} = req.cookies //requesting our token from cookies as it is stored there 
        if(!token){
        // if user doesn't have token it will return an error with code 400
        return res.status(400).json({message:"User doesn't have token"})
    }
         let verifyToken= await jwt.verify(token,process.env.JWT_SECRET) //verifying our token using JWT_SECRET written in .env file which will return a user id and that id is given to req.user id
    if(!verifyToken){
        return res.status(400).json({message:"User doesn't have valid token"}) // this will send a message that our token is invalid
    } 
    // now to check if our token is valid , then 
    req.userId=verifyToken.userId
    next()
}
    catch(error){
 return res.status(500).json({message:`isAuth error${error}`})
        //error 
    }

}

export default isAuth