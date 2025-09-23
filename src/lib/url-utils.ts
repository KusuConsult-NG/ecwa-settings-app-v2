/**
 * Utility functions for URL generation
 */

/**
 * Get the base URL for the application
 * Handles different environments (local, Vercel, custom domain)
 */
export function getBaseUrl(): string {
  // If NEXT_PUBLIC_APP_URL is set, use it
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // If running on Vercel, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Default fallback for production
  if (process.env.NODE_ENV === 'production') {
    return 'https://ecwa-settings-app-v2.vercel.app'
  }
  
  // Development fallback
  return 'http://localhost:3000'
}

/**
 * Generate a magic link URL
 */
export function generateMagicLink(token: string): string {
  return `${getBaseUrl()}/verify-invite?token=${token}`
}

/**
 * Generate a verification link URL
 */
export function generateVerificationLink(email: string, code: string): string {
  return `${getBaseUrl()}/accept?email=${encodeURIComponent(email)}&code=${code}`
}

/**
 * Generate a password reset link URL
 */
export function generateResetLink(token: string): string {
  return `${getBaseUrl()}/reset-password?token=${token}`
}

/**
 * Generate a login verification URL
 */
export function generateLoginVerificationUrl(): string {
  return `${getBaseUrl()}/verify-login`
}
