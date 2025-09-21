import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const DATA_DIR = path.join(process.cwd(), '.data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: string
  organization: string
  phone?: string
  address?: string
  createdAt: string
  lastLogin?: string
  isEmailVerified?: boolean
  emailVerificationCode?: string
  emailVerificationExpires?: string
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating data directory:', error)
  }
}

// Load users from file
export async function loadUsers(): Promise<User[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist, return empty array
    return []
  }
}

// Save users to file
export async function saveUsers(users: User[]): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error saving users:', error)
    throw new Error('Failed to save user data')
  }
}

// Hash password securely with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password securely with bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await loadUsers()
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

// Create new user
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string }): Promise<User> {
  const users = await loadUsers()
  
  // Check if user already exists
  const existingUser = await findUserByEmail(userData.email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    ...userData,
    password: await hashPassword(userData.password),
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  await saveUsers(users)
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword as User
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email)
  if (!user) {
    return null
  }

  if (!(await verifyPassword(password, user.password))) {
    return null
  }

  // Update last login
  const users = await loadUsers()
  const userIndex = users.findIndex(u => u.id === user.id)
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date().toISOString()
    await saveUsers(users)
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

// Generate email verification code
export function generateEmailVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
}

// Generate email verification expiry
export function getEmailVerificationExpiry(): string {
  return new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
}

// Send email verification
export async function sendEmailVerification(user: User): Promise<boolean> {
  try {
    const { sendVerificationEmail, getEmailTemplate } = await import('./email-verification')
    
    const code = generateEmailVerificationCode()
    const expiresAt = getEmailVerificationExpiry()
    
    // Update user with verification code
    const users = await loadUsers()
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].emailVerificationCode = code
      users[userIndex].emailVerificationExpires = expiresAt
      await saveUsers(users)
    }
    
    // Send verification email
    const template = getEmailTemplate('account_verification', {
      userName: user.name,
      organizationName: user.organization,
      code,
      role: user.role
    })
    
    return await sendVerificationEmail(user.email, template)
  } catch (error) {
    console.error('Failed to send email verification:', error)
    return false
  }
}

// Verify email code
export async function verifyEmailCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    const users = await loadUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      return { success: false, message: 'User not found' }
    }
    
    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return { success: false, message: 'No verification code found' }
    }
    
    if (new Date() > new Date(user.emailVerificationExpires)) {
      return { success: false, message: 'Verification code has expired' }
    }
    
    if (user.emailVerificationCode !== code) {
      return { success: false, message: 'Invalid verification code' }
    }
    
    // Mark email as verified
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].isEmailVerified = true
      users[userIndex].emailVerificationCode = undefined
      users[userIndex].emailVerificationExpires = undefined
      await saveUsers(users)
    }
    
    return { success: true, message: 'Email verified successfully' }
  } catch (error) {
    console.error('Email verification failed:', error)
    return { success: false, message: 'Verification failed' }
  }
}

// Initialize with default admin user
export async function initializeDefaultUsers(): Promise<void> {
  const users = await loadUsers()
  
  // Only create default users if no users exist
  if (users.length === 0) {
    const defaultUsers: Omit<User, 'id' | 'createdAt'>[] = [
      {
        name: 'Admin User',
        email: 'admin@churchflow.com',
        password: 'admin123',
        role: 'Admin',
        organization: 'ChurchFlow',
        isEmailVerified: true // Pre-verify admin account
      },
      {
        name: 'Pastor John',
        email: 'pastor@churchflow.com',
        password: 'pastor123',
        role: 'Pastor',
        organization: 'Grace Assembly',
        isEmailVerified: true // Pre-verify pastor account
      }
    ]

    for (const userData of defaultUsers) {
      try {
        await createUser(userData)
        console.log(`Created default user: ${userData.email}`)
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error)
      }
    }
  }
}
