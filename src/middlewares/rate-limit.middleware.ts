import rateLimit from "express-rate-limit";
import { success } from "zod";


// Strict limiter for auth endpoints — brute-force / spam protection.
// 10 attempts per 15 minutes per IP.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15min
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many attempts. Please try again in a few minutes.",
    }
});

// Looser general limiter for the rest of the API, to blunt abuse/scraping.
// 100 requests per minute per IP.

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
});