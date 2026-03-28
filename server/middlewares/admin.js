const User = require("../models/User.js");
const { ResponseHandler } = require("../utils");

const isAdmin = async (request, response, next) => {
    try {
        const user = request.user;
        
        if (!user) {
            return ResponseHandler.unauthorized(response, "User not authenticated");
        }

        if (user.role !== "admin") {
            return ResponseHandler.unauthorized(response, "Admin access required");
        }

        return next();
    } catch (err) {
        return ResponseHandler.unauthorized(response, "Admin verification failed");
    }
};

module.exports = { isAdmin };

