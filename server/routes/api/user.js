const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const { auth } = require("../../middlewares");
const {
  ResponseHandler,
} = require("../../utils");
const router = express.Router();

router.get("/context",auth.required, auth.user, (request, response) => {
  return ResponseHandler.ok(
    response,
    request.user.toAuthJSON()
  );
});

router.put(
  "/update-profile",
  auth.required,
  auth.user,
  async (request, response) => {
    try {
      const { fullName, phone, location, age } = request.body;
      const userId = request.user._id;

      // Find the user
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return ResponseHandler.badRequest(response, "User not found");
      }

      // Update user data
      user.fullName = fullName || user.fullName;  
      user.phone = phone || user.phone;
      user.location = location || user.location;
      user.age = age || user.age;

      // Save the updated user information
      const updatedUser = await user.save();

      // Respond with the updated user data
      return ResponseHandler.ok(response, updatedUser, "Profile updated successfully!");
    } catch (err) {
      console.log("Error: ", err);
      return ResponseHandler.badRequest(response, err.message || "Error updating user profile");
    }
  }
);

// Update user password
router.put(
  "/update-password",
  auth.required,
  auth.user,
  async (request, response) => {
    try {
      const { currentPassword, newPassword } = request.body;

      if (!currentPassword || !newPassword) {
        return ResponseHandler.badRequest(
          response,
          "Missing required parameters: currentPassword, newPassword"
        );
      }

      if (currentPassword.length <= 0 || newPassword.length <= 0) {
        return ResponseHandler.badRequest(
          response,
          "Passwords cannot be empty"
        );
      }

      if (currentPassword === newPassword) {
        return ResponseHandler.badRequest(
          response,
          "Old password and new password cannot be the same"
        );
      }

      const user = request.user;

      // Check if old password is valid
      if (!user.validPassword(currentPassword)) {
        return ResponseHandler.badRequest(response, "Invalid old password");
      }

      // Set new password
      user.setPassword(newPassword);
      await user.save();

      return ResponseHandler.ok(response, {
        message: "Password has been changed successfully",
      });
    } catch (error) {
      console.log("Error:", error);
      return ResponseHandler.badRequest(
        response,
        error.message || "Error changing password"
      );
    }
  }
);









module.exports = router;
