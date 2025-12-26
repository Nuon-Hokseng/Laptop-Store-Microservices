import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("[Auth Middleware] Checking authentication:", {
    method: req.method,
    path: req.path,
    hasXUserId: !!req.header("x-user-id"),
  });

  // First, check if user context is forwarded from API Gateway
  const userId = req.header("x-user-id");
  const userRole = req.header("x-user-role");
  const userEmail = req.header("x-user-email");

  if (userId) {
    // User context forwarded from API Gateway
    console.log(
      "[Auth Middleware] User authenticated via API Gateway headers:",
      { userId, userRole, userEmail }
    );
    req.user = {
      id: userId,
      role: userRole || "user",
      email: userEmail || "",
    };
    return next();
  }

  // Fallback: Check for JWT token in Authorization header or cookies
  let token = null;

  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Check cookies if no Authorization header
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.warn(
      "[Auth Middleware] Authentication failed: No token provided for",
      req.method,
      req.path
    );
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );
    req.user = {
      id: decoded.id || decoded.userId,
      role: decoded.role || "user",
      email: decoded.email || "",
    };
    console.log("[Auth Middleware] User authenticated via JWT:", req.user.id);
    next();
  } catch (err) {
    console.error("[Auth Middleware] Token validation failed:", err.message);
    res.status(401).json({ error: "Token is not valid" });
  }
};

export default authMiddleware;
