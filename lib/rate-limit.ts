import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const store = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(
    req: NextRequest
  ): Promise<NextResponse | null> {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();

    const record = store.get(key);

    if (!record || now > record.resetTime) {
      store.set(key, { count: 1, resetTime: now + config.windowMs });
      return null;
    }

    if (record.count >= config.max) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((record.resetTime - now) / 1000)),
          },
        }
      );
    }

    record.count++;
    return null;
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60000);
