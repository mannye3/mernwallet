import jwt from "jsonwebtoken";

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  try {
    // Extract the token from the "Authorization" header
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId and token to the request for further use
    req.userId = decoded.userId;
    req.token = token;

    console.log("Token verified successfully");
    next(); // Continue to the next middleware/controller
  } catch (error) {
    console.error("Error while verifying token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};