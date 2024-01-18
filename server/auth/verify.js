import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../passwordSecurity/pass.js";

export const userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.json({ message: "Token is not available" });
    } else {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Error in the Token" });
        } else {
          if (decoded.role === "user") {
            next()
          } else {
            return res.status(403).json({ message: "Not User" });
          }
        }
      })
    }
  } catch (error) {
    return res.status(500).json({ message: "Error in the Verification" });
  }
};

export const restaurantVerification = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.json({ message: "Token is not available" });
    } else {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.json({ message: "Error in the Token" });
        } else {
          if (decoded.role === "admin") {
            next()
          } 
          else {
            return res.json({ message: "Not Admin" });
          }
        }
      })
    }
  } catch (error) {
    return res.json({ message: "Error in the Verification" });
  }
}
