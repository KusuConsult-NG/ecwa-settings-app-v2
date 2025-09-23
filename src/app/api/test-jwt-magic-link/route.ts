import { NextResponse } from "next/server"
import { buildMagicLink } from "@/lib/magic-link-utils"

export const runtime = "nodejs"
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Generate a test magic link with proper JWT
    const magicLink = buildMagicLink({
      email: "test@example.com",
      name: "Test User",
      teamId: "test-team",
      inviteId: "test-invite-123"
    })

    return NextResponse.json({
      success: true,
      message: "Test JWT magic link generated",
      magicLink,
      instructions: "Use this magic link to test the verification flow"
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Failed to generate test magic link",
      error: error.message
    }, { status: 500 })
  }
}
