const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const User = require("../model/auth.model")
const jwt = require("jsonwebtoken");

router.post("/authsignup", async (req, res) => {
  try {
    let { token } = req.body;
    const instance = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const verify = await instance.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = verify.getPayload();
    console.log("done1");
    if(!payload.email){
       return res.status(400).json({ message: "Email not provided by Google" });
    }
    const checkUser = await User.findOne({ email: payload.email });
    let user;
    if (checkUser) {
      user = checkUser;
    } else {
      user = new User({
        username: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
      await user.save();
      console.log("done");
      
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      maxAge: 5 * 60 * 60 * 1000,
    });
      const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    };
    res.json({ message:"Signup Successfully" ,user:safeUser});
  } catch (error) {
    console.log(error);
    
      res.status(401).json({
      message: "Google authentication failed",
    });
  }
});

router.post("/authlogin", async (req, res) => {
  try {
    let { token } = req.body;
    const instance = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const verify = await instance.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = verify.getPayload();
    const checkUser = await User.findOne({ email: payload.email });
    let user;
    if (checkUser) {
      user = checkUser;
    } else {
      user = new User({
        username: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
      await user.save();
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      maxAge: 5 * 60 * 60 * 1000,
    });
      const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    };
    res.json({ message:"Login Successfully" ,user:safeUser});
  } catch (error) {
      res.status(401).json({
      message: "Google authentication failed",
    });
  }
});
module.exports = router;
