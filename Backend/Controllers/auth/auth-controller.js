const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const dotenv = require('dotenv');
dotenv.config();


// Register User
const registerUser = async (req, res) => {

    const { username, email, password } = req.body;

    try {
        
        const ExistingUser = await User.findOne({email});
        if(ExistingUser){
            return res.status(400).json({
                success: false,
                message: 'User Already Exists with this email'
            })
        }
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        
        console.log("Register body:", req.body);
        console.log("Existing user:", ExistingUser);

        await newUser.save();
        res.status(200).json({
            success: true,
            message: 'User Registered Successfully'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        })
        
    }
}

// Login User
const loginUser = async (req, res) => {

    const {email, password } = req.body;

    try {
        const ExistingUser = await User.findOne({email});
        if(!ExistingUser){
            return res.status(400).json({
                success: false,
                message: 'User does not exist with this email'
            })
        }

        // Match Password
        const isMatch = await bcrypt.compare(password, ExistingUser.password);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: 'Invalid Password'
            })
        }

        // Generate JWT Token
        const token = jwt.sign({
            userId: ExistingUser._id,
            username: ExistingUser.username,
            email: ExistingUser.email,
            role: ExistingUser.role,
        }, process.env.JWT_SECRET, {expiresIn: '1h'});


        res.cookie('token', token, {httpOnly: true,secure:false}).json({
            success: true,
            message: 'User Logged In Successfully',
            user:{
                email: ExistingUser.email,
                username: ExistingUser.username,
                role: ExistingUser.role,
                userId: ExistingUser._id,
                token: token
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        })
        
    }
}

// Logout User
const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: 'User Logged Out Successfully'
    })
}

// auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if(!token)
        return res.status(401).json({   
            success: false,
            message: 'Unauthorized User'
        })
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized User'
        })
    }   

}

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };