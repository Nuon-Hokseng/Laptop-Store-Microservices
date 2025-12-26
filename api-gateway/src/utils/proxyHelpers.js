import proxy from "express-http-proxy";
import logger from "./logger.js";
import http from "http";
import https from "https";

// Create custom HTTP/HTTPS agents with connection pooling
const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 50,
  maxFreeSockets: 10,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 50,
  maxFreeSockets: 10,
});

// Create proxy middleware for routing requests to backend services
export const createProxy = (serviceUrl, options = {}) => {
  const agent = serviceUrl.startsWith("https") ? httpsAgent : httpAgent;

  return proxy(serviceUrl, {
    preserveHostHdr: false,
    parseReqBody: true,
    httpAgent: agent,
    httpsAgent: agent,

    proxyReqPathResolver: (req) => {
      // When using app.use("/v1/cart", handler), Express strips the prefix from req.path
      // but keeps it in req.baseUrl. So we need to reconstruct the full path.
      // req.baseUrl = "/v1/cart"
      // req.url = "/add" or "/add?query=value"
      // We want to convert "/v1/cart/add" to "/api/cart/add"

      const baseUrl = req.baseUrl || "";
      const pathAndQuery = req.url || "/";
      const fullPath = baseUrl + pathAndQuery;

      // Replace /v1 with /api
      const newPath = fullPath.replace(/^\/v1\//, "/api/");

      logger.debug(
        `Path resolution: baseUrl="${baseUrl}" + url="${pathAndQuery}" = "${fullPath}" -> "${newPath}"`
      );
      logger.debug(`Proxying to: ${serviceUrl}${newPath}`);

      return newPath;
    },

    proxyReqBodyDecorator: (bodyContent, srcReq) => {
      return bodyContent;
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {};

      // Forward Authorization header
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers["Authorization"] = srcReq.headers.authorization;
      }

      // Forward cookies
      if (srcReq.headers.cookie) {
        proxyReqOpts.headers["Cookie"] = srcReq.headers.cookie;
      }

      // Add user context from JWT
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] =
          srcReq.user.id || srcReq.user.userId;
        proxyReqOpts.headers["x-user-role"] = srcReq.user.role || "user";
        proxyReqOpts.headers["x-user-email"] = srcReq.user.email || "";
      }

      // Add forwarding and tracing headers
      proxyReqOpts.headers["X-Forwarded-For"] =
        srcReq.ip || srcReq.connection.remoteAddress;
      proxyReqOpts.headers["X-Forwarded-Proto"] = srcReq.protocol;
      proxyReqOpts.headers["X-Forwarded-Host"] = srcReq.get("host");

      if (srcReq.id) {
        proxyReqOpts.headers["X-Request-ID"] = srcReq.id;
      }

      return proxyReqOpts;
    },

    proxyErrorHandler: (err, res, next) => {
      // Log detailed error information
      logger.error(`Proxy error to ${serviceUrl}:`, {
        message: err.message,
        code: err.code,
        errno: err.errno,
      });

      if (res.headersSent) {
        logger.warn(`Headers already sent, passing to next error handler`);
        return next(err);
      }

      // Determine appropriate status code based on error type
      let statusCode = 502;
      let message = "Failed to connect to upstream service";

      if (err.code === "ECONNREFUSED") {
        statusCode = 503;
        message = "Upstream service is unavailable";
      } else if (err.code === "ETIMEDOUT" || err.code === "ESOCKETTIMEDOUT") {
        statusCode = 504;
        message = "Upstream service did not respond in time";
      } else if (err.code === "ENOTFOUND") {
        statusCode = 502;
        message = "Cannot resolve upstream service host";
      }

      res.status(statusCode).json({
        error:
          statusCode === 503
            ? "Service Unavailable"
            : statusCode === 504
            ? "Gateway Timeout"
            : "Bad Gateway",
        message: message,
        service: serviceUrl,
      });
    },

    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.debug(`Response from ${serviceUrl}: ${proxyRes.statusCode}`);

      // Forward Set-Cookie headers from backend to client
      if (proxyRes.headers["set-cookie"]) {
        userRes.setHeader("Set-Cookie", proxyRes.headers["set-cookie"]);
        logger.debug("Forwarding Set-Cookie headers from backend");
      }

      return proxyResData;
    },

    timeout: options.timeout || 90000, // Increased to 90s for slow Render services
    proxyTimeout: options.proxyTimeout || 90000,

    // Additional options
    ...options,
  });
};

// Generate a unique request ID
export const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Request ID middleware - adds unique ID to each request
export const requestIdMiddleware = (req, res, next) => {
  req.id = req.headers["x-request-id"] || generateRequestId();
  res.setHeader("X-Request-ID", req.id);
  next();
};
