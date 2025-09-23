import { NextResponse } from "next/server"
import crypto from "crypto"

export const runtime = "nodejs"
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const secret = process.env.JWT_SECRET || "dev-secret-change-me"
    
    // Create a simple test token
    const header = { alg: "HS256", typ: "JWT" }
    const now = Math.floor(Date.now() / 1000)
    const body = { 
      email: "test@example.com", 
      name: "Test User",
      iat: now, 
      exp: now + 1800 // 30 minutes
    }
    
    const b64u = (b: Buffer) =>
      b.toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")
    
    const p1 = b64u(Buffer.from(JSON.stringify(header)))
    const p2 = b64u(Buffer.from(JSON.stringify(body)))
    const sig = b64u(crypto.createHmac("sha256", secret).update(`${p1}.${p2}`).digest())
    const token = `${p1}.${p2}.${sig}`

    return NextResponse.json({
      success: true,
      message: "JWT secret test",
      secret: secret.substring(0, 10) + "...", // Only show first 10 chars for security
      token,
      payload: body
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "JWT secret test failed",
      error: error.message
    }, { status: 500 })
  }
}
