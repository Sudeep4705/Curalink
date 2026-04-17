const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../Model/auth.model")
const Authcheck = require("../middleware/verifyUser.middleware")
const zodAuth = require("../middleware/zodval.middleware")
const {Registervalidation,Loginvalidation} = require("../Validation/auth.validation")
router.post("/signup",zodAuth(Registervalidation),async(req,res)=>{
   try{
        let {username,email,password} =  req.body
    if(!username || !email || !password)
        return res.status(400).json({message:"Please fill the all fields"})
    let checkemail =await User.findOne({email})
    if(checkemail)
        return res.status(400).json({message:"Email already exist"})
    const hashed =  await bcrypt.hash(password,10)
    const newUser = new User({
        username:username,
        email:email,
        password:hashed
    })
    await newUser.save()
    const token  = jwt.sign({userId:newUser._id},process.env.SECRET,{expiresIn:"5h"})
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV == "production",
        sameSite:process.env.NODE_ENV == "production" ? "none" : "strict",
        maxAge:5*60*60*1000
    })
    return res.status(201).json({message:"Signup Successfull", user: { 
          id: newUser._id,
    email: newUser.email,
    username:newUser.username
    }})
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"internal server error"})
    }
})

router.post("/login",zodAuth(Loginvalidation),async(req,res)=>{
     try{
     
          let {email,password} = req.body
             console.log(req.body);
    let checkemail = await User.findOne({email})
    if(!checkemail)
        return res.status(401).json({message:"Invalid email or password"})
    let isMatch = await bcrypt.compare(password,checkemail.password)
    if(!isMatch)
        return res.status(401).json({message:"Invalid email or password"})
     const token  = jwt.sign({userId:checkemail._id},process.env.SECRET,{expiresIn:"5h"})
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV == "production",
        sameSite:process.env.NODE_ENV == "production" ? "none" : "strict",
        maxAge:5*60*60*1000
    })
    return res.status(200).json({message:"login Successfull", user: { 
        id: checkemail._id,
        email: checkemail.email,
        username:checkemail.username
    }})
    }  
    catch(error){
        return res.status(500).json({message:"internal server error"})
    } 
})

router.post("/me",Authcheck,(req,res)=>{
      return res.status(200).json({user:req.user})
})

module.exports =router