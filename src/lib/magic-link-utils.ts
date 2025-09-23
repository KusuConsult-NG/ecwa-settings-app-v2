import { signInviteJwt } from "@/lib/jwt"

export function buildMagicLink(params: { email: string; name?: string; teamId?: string; inviteId?: string }) {
  const token = signInviteJwt({
    email: params.email.trim().toLowerCase(),
    name: params.name || "",
    teamId: params.teamId || "",
    inviteId: params.inviteId || ""
  }, 60 * 30) // 30 minutes

  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
  return `${base}/verify-invite?token=${encodeURIComponent(token)}`
}
