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
      const originalPath = req.originalUrl || req.url;
      const newPath = originalPath.replace(/^\/v1\//, "/api/");
      logger.debug(`Proxying: ${originalPath} -> ${serviceUrl}${newPath}`);
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
      logger.error(`Proxy error to ${serviceUrl}: ${err.message}`, {
        error: err,
      });

      if (res.headersSent) {
        return next(err);
      }

      res.status(502).json({
        error: "Bad Gateway",
        message: "Failed to connect to upstream service",
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

    timeout: options.timeout || 60000,

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
