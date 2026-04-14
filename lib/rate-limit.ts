type RateLimitWindow = {
  count: number;
  resetAt: number;
};

const windows = new Map<string, RateLimitWindow>();

export function enforceRateLimit(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    throw new Error(`Rate limit exceeded. Retry in ${retryAfterSeconds}s.`);
  }

  current.count += 1;
  windows.set(key, current);
}
