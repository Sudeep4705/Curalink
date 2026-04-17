const User = require("../Model/auth.model")
const jwt = require("jsonwebtoken")


const validateAuth = async(req,res,next)=>{
    try{
         const token  =  req.cookies.token
     if(!token)
        return res.status(401).json({message:"no token"})
    const decoded = jwt.verify(token,process.env.SECRET)
    let check_user = await User.findById(decoded.userId)
    if(!check_user)
        return res.status(401).json({message:"User not in database"})
    const safeUser = {
        _id:check_user._id,
        username:check_user.username,
        email:check_user.email
    }
    req.user = safeUser
    next()
    }
    catch(error){
       return res.status(401).json({message:"Unauthorized Access"})
    }
}




module.exports = validateAuth