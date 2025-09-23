// In-memory storage for invitation codes (in production, use Redis or database)
const invitationCodes = new Map<string, { email: string, name: string, role: string, organizationName: string, createdAt: Date }>()

export function storeInvitationCode(code: string, email: string, name: string, role: string, organizationName: string) {
  invitationCodes.set(code, {
    email,
    name,
    role,
    organizationName,
    createdAt: new Date()
  })
}

export function getInvitationCode(code: string) {
  return invitationCodes.get(code)
}

export function deleteInvitationCode(code: string) {
  return invitationCodes.delete(code)
}

export function getAllInvitationCodes() {
  return invitationCodes
}

