import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), '.data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: string
  organization: string
  createdAt: string
  lastLogin?: string
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

// Hash password
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
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
    password: hashPassword(userData.password),
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

  if (!verifyPassword(password, user.password)) {
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
        organization: 'ChurchFlow'
      },
      {
        name: 'Pastor John',
        email: 'pastor@churchflow.com',
        password: 'pastor123',
        role: 'Pastor',
        organization: 'Grace Assembly'
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
