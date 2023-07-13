const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config({path: path.join(__dirname, "../.env")});

function generateToken(username,isAdmin){
    return jwt.sign({username,isAdmin},process.env.SECRET_KEY,{expiresIn: "1h"});
}

function verifyToken(req, res,next){
    const authorizationHeader = req.get("authorization");
    const token = authorizationHeader && authorizationHeader.split(" ")[1]; 
    
    if(!token) return res.status(400).send("Empty token");

    jwt.verify(token,process.env.SECRET_KEY,(error,decoded)=>{
        if(error) return res.status(401).send(error.message);
        console.log(decoded);

        req.username = decoded.username;
        req.isAdmin = decoded.isAdmin;

    });
    next();
}

function checkRole(req,res,next){
    if(!req.isAdmin){
        return res.status(403).send("No estas autorizado");
    }
    next();
}

module.exports = {generateToken,verifyToken,checkRole};