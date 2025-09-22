import crypto from 'crypto'

export interface Invite {
  id: string
  email: string
  name: string
  role: string
  orgId: string
  orgName: string
  code: string
  consumed: boolean
  expiresAt: number
  createdAt: number
}

// In-memory storage for invites (in production, use Redis or database)
const invites = new Map<string, Invite>()

export function createInvite(email: string, name: string, role: string, orgId: string, orgName: string): Invite {
  const id = 'inv_' + crypto.randomUUID()
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  
  const invite: Invite = {
    id,
    email: email.toLowerCase(),
    name,
    role,
    orgId,
    orgName,
    code,
    consumed: false,
    expiresAt,
    createdAt: Date.now()
  }
  
  invites.set(id, invite)
  return invite
}

export function getInviteById(id: string): Invite | undefined {
  return invites.get(id)
}

export function getInviteByCode(code: string): Invite | undefined {
  for (const invite of invites.values()) {
    if (invite.code === code && !invite.consumed && Date.now() < invite.expiresAt) {
      return invite
    }
  }
  return undefined
}

export function consumeInvite(id: string): boolean {
  const invite = invites.get(id)
  if (invite && !invite.consumed) {
    invite.consumed = true
    return true
  }
  return false
}

export function getAllInvites(): Invite[] {
  return Array.from(invites.values())
}

export function deleteInvite(id: string): boolean {
  return invites.delete(id)
}
