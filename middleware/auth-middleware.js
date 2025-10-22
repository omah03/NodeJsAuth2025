const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader);
    
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({
            message: "No token, authorization denied. Please login to continue",
            success: false
        })
    }
    // middleware logic to check if user is authenticated
    console.log('auth middleware executed')
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decodedToken);
        req.userInfo = decodedToken
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Token is not valid",
            success: false
        })
    }
}
 
module.exports = authMiddleware