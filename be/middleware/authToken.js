const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = (req,res,next) => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).send({message: "Không có token, truy cập bị từ chối!"});
    try{
        const decoded = jwt.verify(token.split(" ")[1], process.env.KEY);
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(403).send({message: "Token không hợp lệ hoặc đã hết hạn!"});
    }
}
exports.verifyTokenAmin = (req, res, next) => {
    if(req.user.role != 3){
        return res.status(403).send({message: "Bạn không có quyền truy cập"});
    }
    next();
}