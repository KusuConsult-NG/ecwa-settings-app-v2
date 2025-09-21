// Simple in-memory rate limiting implementation
interface RateLimitEntry {
  count: number
  resetTime: number
}

class SimpleRateLimit {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor(
    private maxRequests: number,
    private windowMs: number,
    private prefix: string
  ) {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }

  async limit(identifier: string): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
  }> {
    const key = `${this.prefix}:${identifier}`
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      })
      
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: now + this.windowMs
      }
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: entry.resetTime
      }
    }

    // Increment count
    entry.count++
    this.store.set(key, entry)

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - entry.count,
      reset: entry.resetTime
    }
  }

  destroy() {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}

// Rate limiters for different endpoints
export const authRateLimit = new SimpleRateLimit(5, 15 * 60 * 1000, 'auth') // 5 attempts per 15 minutes
export const signupRateLimit = new SimpleRateLimit(3, 60 * 60 * 1000, 'signup') // 3 signups per hour
export const verificationRateLimit = new SimpleRateLimit(10, 60 * 60 * 1000, 'verification') // 10 verification attempts per hour
export const generalRateLimit = new SimpleRateLimit(100, 60 * 1000, 'general') // 100 requests per minute

// Rate limiting helper function
export async function checkRateLimit(
  rateLimiter: SimpleRateLimit,
  identifier: string,
  endpoint: string
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
  error?: string
}> {
  try {
    const { success, limit, remaining, reset } = await rateLimiter.limit(identifier)
    
    if (!success) {
      return {
        success: false,
        limit,
        remaining,
        reset,
        error: `Rate limit exceeded for ${endpoint}. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`
      }
    }
    
    return {
      success: true,
      limit,
      remaining,
      reset
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Allow request to proceed if rate limiting fails
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0
    }
  }
}

// Get client identifier for rate limiting
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  // In development, use a fallback
  if (ip === 'unknown' && process.env.NODE_ENV === 'development') {
    return 'dev-client'
  }
  
  return ip
}

// Rate limiting middleware for API routes
export async function withRateLimit(
  rateLimiter: SimpleRateLimit,
  endpoint: string,
  request: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  const identifier = getClientIdentifier(request)
  const rateLimitResult = await checkRateLimit(rateLimiter, identifier, endpoint)
  
  if (!rateLimitResult.success) {
    return new Response(
      JSON.stringify({
        success: false,
        message: rateLimitResult.error,
        rateLimit: {
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset
        }
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString()
        }
      }
    )
  }
  
  // Add rate limit headers to successful responses
  const response = await handler()
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString())
  
  return response
}
