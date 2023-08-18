const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'this_is_my_secret_key');
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    }catch(e){
        res.status(401).json({message: "Auth failed!"})
    }
};