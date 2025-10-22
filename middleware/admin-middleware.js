const isAdminUser = (req,res,next) => {
    if (req.userInfo.role !== "admin"){
        return res.status(403).json({
            message: "Access denied. Admins only",
            success: false
        })
    }
    next()
}
module.exports = isAdminUser