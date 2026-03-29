const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User');

const crypto = require("crypto");
const sendEmail = require("../../Helpers/sendEmail");

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
         console.log("LOGIN ERROR:", error);
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

// Check Auth
const checkAuth = (req, res) => {
    const user = req.user; // set by authMiddleware
    
    res.status(200).json({
        success: true,
        message: 'Authenticated user!',
        user,
    });
};

// forgottenPassword
const forgotPassword = async (req, res) => {

  const { email } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetURL =
      `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
Password Reset Link:

${resetURL}

This link will expire in 15 minutes.
`;

    await sendEmail(email, "Password Reset", message);

    res.json({
      success: true,
      message: "Reset link sent to email",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

// Reset Password
const resetPassword = async (req, res) => {

  try {

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

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

module.exports = { registerUser, loginUser, logoutUser, checkAuth, authMiddleware, forgotPassword, resetPassword  };