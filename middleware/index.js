const { verify } = require("jsonwebtoken");
const { use } = require("../router");
const dotenv = require("dotenv").config();

class middleware {
  static async checkToken(req, res, next) {
    let token = req.get("authorization");
    console.log("Token:", token);
    if (token) {
      token = token.slice(7);
      try {
        const decoded = await verify(token, process.env.SECRET_KEY);
        console.log("Decoded token:", decoded);
        // Extract user information from the decoded token
        const { userId, email, roles } = decoded;

        console.log("user>>>>>", userId);
        console.log("email>>>>>", email);
        console.log("roles>>>>>", roles);
        req.userId = userId;
        req.email = email;
        req.roles = roles;
        next();
      } catch (err) {
        console.error("Error:", err);
        res.json({
          success: 0,
          message: "Invalid token",
        });
      }
    } else {
      res.json({
        success: 0,
        message: "Access denied! Unauthorized user",
      });
    }
  }

  static async adminAuth(req, res, next) {
    let token = req.get("authorization");
    console.log("Token:", token);
    if (token) {
      token = token.slice(7);
      try {
        const decoded = await verify(token, process.env.SECRET_KEY);
        console.log("Decoded token:", decoded);
        // Extract user information from the decoded token
        const { userId, email, roles } = decoded;
        if (roles !== "ADMIN") {
          res.status(403).json({
            success: 0,
            message: "You need to be Admin in order to access this API",
          });
        }
        req.userId = userId;
        req.email = email;
        req.roles = roles;
        next();
      } catch (err) {
        console.error("Error:", err);
        res.json({
          success: 0,
          message: "Invalid token",
        });
      }
    } else {
      res.json({
        success: 0,
        message: "Access denied! Unauthorized user",
      });
    }
  }
}

module.exports = middleware;
