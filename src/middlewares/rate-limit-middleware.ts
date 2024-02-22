import env from "../utils/env";
import rateLimit from "express-rate-limit";

/**
 * Creates a rate limit middleware for limiting the rate of incoming requests to an Express application.
 * @returns The rate limit middleware.
 */
function rateLimitMiddleware() {
  const windowMs = Number(env.RATE_LIMIT_WINDOW_MS);
  const max = Number(env.RATE_LIMIT_MAX);

  return rateLimit({
    windowMs,
    max,
  });
}

export default rateLimitMiddleware;
