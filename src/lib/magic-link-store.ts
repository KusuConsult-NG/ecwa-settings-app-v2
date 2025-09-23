import crypto from 'crypto'
import { kv } from './kv'
import { signInviteJwt, verifyInviteJwt } from './jwt'

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

export async function createMagicInvite(
  email: string,
  name: string,
  role: string,
  organizationId: string,
  organizationName: string,
  inviterName: string
): Promise<MagicInvite> {
  const id = crypto.randomUUID()
  const authCode = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
  
  // Generate JWT token instead of random hex
  const magicToken = signInviteJwt({
    email: email.toLowerCase(),
    name,
    role,
    organizationId,
    organizationName,
    inviteId: id
  }, 60 * 30) // 30 minutes expiration
  
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
  
  // Store in persistent KV storage
  await kv.set(`magic_invite:${id}`, JSON.stringify(invite))
  await kv.set(`magic_token:${magicToken}`, id) // For quick token lookup
  
  console.log(`Magic invite created for ${email} with token: ${magicToken}`)
  
  return invite
}

export async function getMagicInviteById(id: string): Promise<MagicInvite | undefined> {
  try {
    const data = await kv.get(`magic_invite:${id}`)
    if (!data) return undefined
    
    const invite: MagicInvite = JSON.parse(data)
    
    // Check if expired
    if (Date.now() > invite.expiresAt) {
      await kv.delete(`magic_invite:${id}`)
      await kv.delete(`magic_token:${invite.magicToken}`)
      return undefined
    }
    
    return invite
  } catch (error) {
    console.error('Error getting magic invite by ID:', error)
    return undefined
  }
}

export async function getMagicInviteByToken(token: string): Promise<MagicInvite | undefined> {
  try {
    console.log('Looking up magic token:', token)
    
    // Verify JWT token and extract payload
    const payload = verifyInviteJwt(token)
    if (!payload || !payload.inviteId) {
      console.log('Invalid JWT token or missing inviteId')
      return undefined
    }
    
    const inviteId = payload.inviteId
    console.log('Found invite ID from JWT:', inviteId)
    
    // Get the full invite data from KV store
    const data = await kv.get(`magic_invite:${inviteId}`)
    console.log('Found invite data:', data ? 'Yes' : 'No')
    
    if (!data) {
      console.log('No invite data found for ID:', inviteId)
      return undefined
    }
    
    const invite: MagicInvite = JSON.parse(data)
    console.log('Parsed invite:', { id: invite.id, email: invite.email, consumed: invite.consumed, expiresAt: invite.expiresAt })
    
    // Check if expired (JWT expiration is handled by verifyInviteJwt, but check KV store expiration too)
    if (Date.now() > invite.expiresAt) {
      console.log('Invite expired in KV store, cleaning up')
      await kv.delete(`magic_invite:${inviteId}`)
      await kv.delete(`magic_token:${token}`)
      return undefined
    }
    
    // Check if consumed
    if (invite.consumed) {
      console.log('Invite already consumed')
      return undefined
    }
    
    console.log('Returning valid invite')
    return invite
  } catch (error) {
    console.error('Error getting magic invite by token:', error)
    return undefined
  }
}

export async function getMagicInviteByCode(code: string, email: string): Promise<MagicInvite | undefined> {
  try {
    // This is less efficient but necessary for code lookup
    // In a real app, you'd want to index by code as well
    const keys = await kv.keys('magic_invite:*')
    
    for (const key of keys) {
      const data = await kv.get(key)
      if (!data) continue
      
      const invite: MagicInvite = JSON.parse(data)
      
      if (invite.authCode === code && 
          invite.email.toLowerCase() === email.toLowerCase() && 
          !invite.consumed && 
          Date.now() < invite.expiresAt) {
        return invite
      }
    }
    
    return undefined
  } catch (error) {
    console.error('Error getting magic invite by code:', error)
    return undefined
  }
}

export async function consumeMagicInvite(id: string): Promise<boolean> {
  try {
    const data = await kv.get(`magic_invite:${id}`)
    if (!data) return false
    
    const invite: MagicInvite = JSON.parse(data)
    
    if (!invite.consumed && Date.now() < invite.expiresAt) {
      invite.consumed = true
      await kv.set(`magic_invite:${id}`, JSON.stringify(invite))
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error consuming magic invite:', error)
    return false
  }
}

export async function getAllMagicInvites(): Promise<MagicInvite[]> {
  try {
    const keys = await kv.keys('magic_invite:*')
    const invites: MagicInvite[] = []
    
    for (const key of keys) {
      const data = await kv.get(key)
      if (data) {
        const invite: MagicInvite = JSON.parse(data)
        invites.push(invite)
      }
    }
    
    return invites
  } catch (error) {
    console.error('Error getting all magic invites:', error)
    return []
  }
}

export async function cleanupExpiredInvites(): Promise<void> {
  try {
    const keys = await kv.keys('magic_invite:*')
    const now = Date.now()
    
    for (const key of keys) {
      const data = await kv.get(key)
      if (!data) continue
      
      const invite: MagicInvite = JSON.parse(data)
      
      if (now > invite.expiresAt) {
        await kv.delete(key)
        await kv.delete(`magic_token:${invite.magicToken}`)
        console.log(`Cleaned up expired magic invite: ${invite.id}`)
      }
    }
  } catch (error) {
    console.error('Error cleaning up expired invites:', error)
  }
}

