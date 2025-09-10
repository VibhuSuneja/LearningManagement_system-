//generating jwt tokens
import jwt from "jsonwebtoken"
const genToken= async (userId)=>{ //userId as parameter in this async arrow function
try{
    const token = await jwt.sign({userId},process.env. //generating token
        JWT_SECRET,{expiresIn:"7d"}) //expiry of our token is here 7 days 
        return token
} catch(error){
    console.log(error)
}
}
export default genToken //exporting our function so that it can be used inside authController.js