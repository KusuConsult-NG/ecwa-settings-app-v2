const crypto = require("crypto")

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

// Test the JWT functions
console.log("Testing JWT functions...")

const testPayload = {
  email: "test@example.com",
  name: "Test User",
  teamId: "test-team",
  inviteId: "test-invite-123"
}

const token = signInviteJwt(testPayload)
console.log("Generated token:", token)

const verified = verifyInviteJwt(token)
console.log("Verified payload:", verified)

const invalidToken = "invalid.token.here"
const invalidVerified = verifyInviteJwt(invalidToken)
console.log("Invalid token result:", invalidVerified)

console.log("JWT test completed successfully!")
