const passport = require("passport");
const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");

const { auth } = require("../../middlewares");
const {
  ResponseHandler,
  sendEmail,
} = require("../../utils");

const router = express.Router();

router.use(passport.initialize());

// Generate a verification token and expiration time
const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 30 * 60 * 1000; // Expires in 30 minutes
  return {
    token,
    expiresAt,
  };
};


router.get("/context", auth.required, auth.user, async (request, response) => {
  try {
    if (request.user.status === "inactive")
      return ResponseHandler.badRequest(
        response,
        "You've been blocked by the admin! Contact support to unblock."
      );
    return ResponseHandler.ok(response, request.user.toAuthJSON());
  } catch (error) {
    console.log(error, "error");
    return ResponseHandler.badRequest(response, error);
  }
});

router.post("/signup", async (request, response) => {

  
  const { name, email, password } = request.body; // received the data from frontend and destructured the data comes in the body
  try {
   if(!name ||  !email || !password ) {
    return ResponseHandler.badRequest(response, "All fields are required"); // if any of field is missing it will through error
   }
      // finding the coming email from the database as unique 
    const exsUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (exsUser)
      return ResponseHandler.badRequest(response, "User already exists"); // if email found means that user is already in the database so it will throw an error

    // if user is not in the database then create a new user
    let user = new User({
      fullName: name,
      email: email.trim().toLowerCase(),
      status: "active",
    });

    // set their password through the set password method which i have written in schema
    user.setPassword(password);
        
    await user.save();// now in this step it will register the user  will all information which we have created
    return ResponseHandler.ok(
      response,
      "User registered successfully!"
    );
  } catch (err) {
    console.log(err, "err");
    return ResponseHandler.badRequest(response, err);
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    if(!email || !password) { 
      return ResponseHandler.badRequest(response, "Email and password is required");
    
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user)
      return ResponseHandler.badRequest(
        response,
        "User not found"
      );


    if (!user.validPassword(password))
      return ResponseHandler.badRequest(response, "Invalid credentials");

    return ResponseHandler.ok(response,   user.toAuthJSON() );
  } catch (err) {
    console.log(err, "error");
    return ResponseHandler.badRequest(response, err);
  }
});



// 📌 Send Verification Link
router.post("/send/verify-link/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return ResponseHandler.badRequest(res, "User not found");

    // Generate new verification token
    const { token, expiresAt } = generateVerificationToken();
    user.verifyToken = token;
    
    // Set resetPasswordToken for password reset template
    if (!user.resetPasswordToken) {
      user.resetPasswordToken = {};
    }
    user.resetPasswordToken.value = token;
    user.resetPasswordToken.expiresAt = expiresAt;
    
    await user.save();

    // Send password reset email using passwordResetTemplate
    sendEmail(user, "Reset Your Password", {
      resetPassword: true,
    });

    return ResponseHandler.ok(res, "Verification link sent successfully");
  } catch (error) {
    return ResponseHandler.badRequest(res, error.message);
  }
});



// 📌 Verify Email Link / Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const {password} = req.body;

  try {
    // Check both verifyToken and resetPasswordToken
    const user = await User.findOne({
      $or: [
        { verifyToken: token },
        { "resetPasswordToken.value": token }
      ]
    });

    if (!user) return ResponseHandler.badRequest(res, "Invalid or expired token");

    // Check if token has expired (if using resetPasswordToken)
    if (user.resetPasswordToken && user.resetPasswordToken.value === token) {
      if (user.resetPasswordToken.expiresAt && Date.now() > user.resetPasswordToken.expiresAt) {
        return ResponseHandler.badRequest(res, "Token has expired. Please request a new password reset link.");
      }
    }

    // Clear tokens
    user.verifyToken = null;
    if (user.resetPasswordToken) {
      user.resetPasswordToken = null;
    }

    user.setPassword(password);
    await user.save();

    return ResponseHandler.ok(res, "Password reset successfully");
  } catch (error) {
    return ResponseHandler.badRequest(res, error.message);
  }
});

router.post("/set-new-password", async (request, response) => {
  try {
    const { email,  password } = request.body;
   
    if (!password || !email?.trim())
      return ResponseHandler.badRequest(
        response,
        "Missing required parameters"
      );

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) return ResponseHandler.badRequest(response, "User not found!");

   
      user.setPassword(password);
      
      await user.save();
      return ResponseHandler.ok(response, "Password reset successfully!");
    
  } catch (err) {
    console.log(err, "err");
    return ResponseHandler.badRequest(response, err);
  }
});

module.exports = router;
