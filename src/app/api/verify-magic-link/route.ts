import { NextResponse } from "next/server"
import { verifyInviteJwt } from "@/lib/jwt"

export const runtime = "nodejs"
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { token } = await req.json() as { token?: string }
    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 })
    }

    // Token must include at least: email (lowercased), name (optional), inviteId/teamId (optional)
    const payload = verifyInviteJwt<{ email: string; name?: string; inviteId?: string; teamId?: string }>(token)
    if (!payload?.email) {
      return NextResponse.json({ success: false, message: "Invalid or expired magic link" }, { status: 401 })
    }

    // (Optional) You could check DB here that inviteId is still active/not consumed

    return NextResponse.json({
      success: true,
      message: "Magic link verified successfully!",
      invite: {
        id: payload.inviteId || 'jwt-invite-' + Date.now(),
        email: payload.email,
        name: payload.name || "User",
        role: "Member",
        organizationId: payload.teamId || "default-org",
        organizationName: "Test Organization",
        inviterName: "System Administrator"
      }
    })
  } catch (e) {
    return NextResponse.json({ success: false, message: "Invalid or expired magic link" }, { status: 401 })
  }
}

