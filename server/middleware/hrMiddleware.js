import jwt from "jsonwebtoken";
import User from "../models/user.js"

export const hrMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    const finduser=await User.findOne({
      _id:req.user.id
    })

    if(finduser.occupation!=='HR'){
      return res.status(401).json({
        message:"Only HR can Post Oppurtunity"
      })
    }else{
      next();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};