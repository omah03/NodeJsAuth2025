const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// register controller
const registerUser = async(req,res) => {
    try {
        // extract user information from req.body 
        const { username, email, password } = req.body
        
        // check if user is already registered in the database
        const existingUser = await User.findOne({$or: [{ email }, { username }]})
        // if not, create a new user
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            })
        }
        // hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //create a new user and save in your database
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword
            // role will default to 'user' from schema
        })

        await newlyCreatedUser.save()
        res.status(201).json({
            message: "User registered successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error",
            success: false
        })
    }
}


// login controller

const loginUser = async(req,res) => {
    try {
        const {username, password} = req.body
        // check if user exists in the database
        const existingUser = await User.findOne({username})
        if (!existingUser){
            return res.status(400).json({
                message: "User does not exist",
                success: false  
            })
        }
        // compare the password
        // create token and send it to the user

        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
        if (!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid credentials",
                success: false  
            })
        }
        
        const accessToken = jwt.sign({
            userId : existingUser._id,
            role: existingUser.role,
            username: existingUser.username
        }, process.env.JWT_SECRET, {expiresIn: '15m'})
        
        res.status(200).json({
            message: "Login successful",
            success: true,
            token: accessToken
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error",
            success: false
        })
    }
}

const changePassword = async(req,res) => {
    try {
        const userId = req.userInfo.userId // from auth middleware
        const { oldPassword, newPassword } = req.body

        // find user by id

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        // compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            })
        }

        // has new password

        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newPassword, salt)

        // update password in database

        user.password = hashedNewPassword
        await user.save()

        res.status(200).json({
            message: "Password changed successfully",
            success: true
        }) 

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error",
            success: false
        })
        
    }
}

module.exports = { registerUser, loginUser, changePassword }