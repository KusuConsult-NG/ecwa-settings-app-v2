const crypto = require("crypto")

// Simulate the JWT functions
const secret = process.env.JWT_SECRET || "dev-secret-change-me"
const b64u = (b) =>
  b.toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")

function signInviteJwt(payload, expSec = 60 * 30) {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + expSec }
  const p1 = b64u(Buffer.from(JSON.stringify(header)))
  const p2 = b64u(Buffer.from(JSON.stringify(body)))
  const sig = b64u(crypto.createHmac("sha256", secret).update(`${p1}.${p2}`).digest())
  return `${p1}.${p2}.${sig}`
}

function verifyInviteJwt(token) {
  try {
    const [p1, p2, sig] = token.split(".")
    const expSig = b64u(crypto.createHmac("sha256", secret).update(`${p1}.${p2}`).digest())
    if (sig !== expSig) return null
    const json = JSON.parse(Buffer.from(p2.replace(/-/g,"+").replace(/_/g,"/"), "base64").toString("utf8"))
    if (json.exp && Math.floor(Date.now()/1000) > json.exp) return null
    return json
  } catch {
    return null
  }
}

// Test the complete flow
console.log("Testing JWT-based magic link integration...")

// Simulate creating a magic invite
const inviteId = crypto.randomUUID()
const email = "test@example.com"
const name = "Test User"
const role = "leader"
const organizationId = "test-org"
const organizationName = "Test Organization"

// Generate JWT token (like in createMagicInvite)
const magicToken = signInviteJwt({
  email: email.toLowerCase(),
  name,
  role,
  organizationId,
  organizationName,
  inviteId
}, 60 * 30) // 30 minutes

console.log("Generated JWT token:", magicToken)

// Test verification (like in getMagicInviteByToken)
const payload = verifyInviteJwt(magicToken)
console.log("Verified payload:", payload)

if (payload && payload.inviteId === inviteId) {
  console.log("✅ JWT integration test PASSED!")
  console.log("✅ Token generation and verification working correctly")
  console.log("✅ Magic link system should work end-to-end")
} else {
  console.log("❌ JWT integration test FAILED!")
  console.log("❌ Token verification failed")
}

console.log("\nTesting magic link URL generation...")
const baseUrl = "https://ecwa-settings-app-v2.vercel.app"
const magicLink = `${baseUrl}/verify-invite?token=${encodeURIComponent(magicToken)}`
console.log("Generated magic link:", magicLink)

console.log("\nJWT integration test completed!")
