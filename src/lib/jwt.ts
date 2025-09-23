import crypto from "crypto"

const secret = process.env.JWT_SECRET || "dev-secret-change-me"
const b64u = (b: Buffer) =>
  b.toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")

export function signInviteJwt(payload: Record<string, any>, expSec = 60 * 30) {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + expSec }
  const p1 = b64u(Buffer.from(JSON.stringify(header)))
  const p2 = b64u(Buffer.from(JSON.stringify(body)))
  const sig = b64u(crypto.createHmac("sha256", secret).update(`${p1}.${p2}`).digest())
  return `${p1}.${p2}.${sig}`
}

export function verifyInviteJwt<T = any>(token: string): T | null {
  try {
    const [p1, p2, sig] = token.split(".")
    const expSig = b64u(crypto.createHmac("sha256", secret).update(`${p1}.${p2}`).digest())
    if (sig !== expSig) return null
    const json = JSON.parse(Buffer.from(p2.replace(/-/g,"+").replace(/_/g,"/"), "base64").toString("utf8"))
    if (json.exp && Math.floor(Date.now()/1000) > json.exp) return null
    return json as T
  } catch {
    return null
  }
}

// Legacy functions for backward compatibility
export function sign(payload: Record<string, any>) {
  return signInviteJwt(payload)
}

export function verify(token: string) {
  return verifyInviteJwt(token)
}