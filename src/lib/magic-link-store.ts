import crypto from 'crypto'

export interface MagicInvite {
  id: string
  email: string
  name: string
  role: string
  organizationId: string
  organizationName: string
  inviterName: string
  authCode: string // 6-digit code
  magicToken: string // For magic link
  expiresAt: number // timestamp
  consumed: boolean
  createdAt: number
}

// In-memory store for magic invites
const magicInvites = new Map<string, MagicInvite>()

export function createMagicInvite(
  email: string,
  name: string,
  role: string,
  organizationId: string,
  organizationName: string,
  inviterName: string
): MagicInvite {
  const id = crypto.randomUUID()
  const authCode = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
  const magicToken = crypto.randomBytes(32).toString('hex') // 64-character token
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  
  const invite: MagicInvite = {
    id,
    email: email.toLowerCase(),
    name,
    role,
    organizationId,
    organizationName,
    inviterName,
    authCode,
    magicToken,
    expiresAt,
    consumed: false,
    createdAt: Date.now()
  }
  
  magicInvites.set(id, invite)
  
  // Auto-cleanup after 24 hours
  setTimeout(() => {
    if (magicInvites.has(id)) {
      console.log(`Magic invite ${id} for ${email} expired and removed.`)
      magicInvites.delete(id)
    }
  }, 24 * 60 * 60 * 1000)
  
  return invite
}

export function getMagicInviteById(id: string): MagicInvite | undefined {
  return magicInvites.get(id)
}

export function getMagicInviteByToken(token: string): MagicInvite | undefined {
  for (const invite of magicInvites.values()) {
    if (invite.magicToken === token && !invite.consumed && Date.now() < invite.expiresAt) {
      return invite
    }
  }
  return undefined
}

export function getMagicInviteByCode(code: string, email: string): MagicInvite | undefined {
  for (const invite of magicInvites.values()) {
    if (invite.authCode === code && 
        invite.email.toLowerCase() === email.toLowerCase() && 
        !invite.consumed && 
        Date.now() < invite.expiresAt) {
      return invite
    }
  }
  return undefined
}

export function consumeMagicInvite(id: string): boolean {
  const invite = magicInvites.get(id)
  if (invite && !invite.consumed && Date.now() < invite.expiresAt) {
    invite.consumed = true
    return true
  }
  return false
}

export function getAllMagicInvites(): MagicInvite[] {
  return Array.from(magicInvites.values())
}

export function cleanupExpiredInvites(): void {
  const now = Date.now()
  for (const [id, invite] of magicInvites.entries()) {
    if (now > invite.expiresAt) {
      magicInvites.delete(id)
    }
  }
}

