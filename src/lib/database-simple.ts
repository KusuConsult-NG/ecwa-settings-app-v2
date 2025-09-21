// Simple in-memory database for immediate functionality
interface User {
  id: string
  name: string
  email: string
  password: string
  role: string
  organization: string
  phone: string
  address: string
  createdAt: string
  isEmailVerified: boolean
  lastLogin?: string
}

interface Organization {
  id: string
  name: string
  type: 'GCC' | 'DCC' | 'LCC' | 'LC' | 'Prayer House'
  parentId?: string
  parentName?: string
  status: 'active' | 'inactive'
  createdAt: string
}

interface Expenditure {
  id: string
  title: string
  description: string
  amount: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  createdBy: string
  createdAt: string
}

interface Income {
  id: string
  source: string
  amount: number
  date: string
  recordedBy: string
  status: 'completed'
  createdAt: string
}

interface BankAccount {
  id: string
  name: string
  accountNumber: string
  balance: number
  currency: string
  status: 'active' | 'inactive'
  createdAt: string
}

// In-memory storage
let users: User[] = [
  {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@churchflow.com',
    password: 'admin123', // In production, this should be hashed
    role: 'Admin',
    organization: 'ChurchFlow',
    phone: '+1234567890',
    address: '123 Admin Street',
    createdAt: new Date().toISOString(),
    isEmailVerified: true
  }
]

let organizations: Organization[] = [
  {
    id: 'gcc_1',
    name: 'ECWA General Church Council',
    type: 'GCC',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'dcc_1',
    name: 'Jos DCC',
    type: 'DCC',
    parentId: 'gcc_1',
    parentName: 'ECWA General Church Council',
    status: 'active',
    createdAt: new Date().toISOString()
  }
]

let expenditures: Expenditure[] = []
let income: Income[] = []
let bankAccounts: BankAccount[] = [
  {
    id: 'bank_1',
    name: 'First Bank',
    accountNumber: '1234567890',
    balance: 1500000,
    currency: 'NGN',
    status: 'active',
    createdAt: new Date().toISOString()
  }
]

// User operations
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...userData,
    createdAt: new Date().toISOString()
  }
  users.push(user)
  return user
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: string): User | undefined {
  return users.find(u => u.id === id)
}

export function getAllUsers(): User[] {
  return users
}

// Organization operations
export function createOrganization(orgData: Omit<Organization, 'id' | 'createdAt'>): Organization {
  const org: Organization = {
    id: `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...orgData,
    createdAt: new Date().toISOString()
  }
  organizations.push(org)
  return org
}

export function getOrganizations(type?: string): Organization[] {
  if (type) {
    return organizations.filter(org => org.type === type)
  }
  return organizations
}

// Expenditure operations
export function createExpenditure(expData: Omit<Expenditure, 'id' | 'createdAt'>): Expenditure {
  const expenditure: Expenditure = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...expData,
    createdAt: new Date().toISOString()
  }
  expenditures.push(expenditure)
  return expenditure
}

export function getAllExpenditures(): Expenditure[] {
  return expenditures
}

// Income operations
export function createIncome(incomeData: Omit<Income, 'id' | 'createdAt'>): Income {
  const incomeRecord: Income = {
    id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...incomeData,
    createdAt: new Date().toISOString()
  }
  income.push(incomeRecord)
  return incomeRecord
}

export function getAllIncome(): Income[] {
  return income
}

// Bank operations
export function createBankAccount(bankData: Omit<BankAccount, 'id' | 'createdAt'>): BankAccount {
  const account: BankAccount = {
    id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...bankData,
    createdAt: new Date().toISOString()
  }
  bankAccounts.push(account)
  return account
}

export function getAllBankAccounts(): BankAccount[] {
  return bankAccounts
}

// Simple password hashing (for demo purposes)
export function hashPassword(password: string): string {
  // In production, use bcrypt or similar
  return btoa(password) // Base64 encoding for demo
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return btoa(password) === hashedPassword
}
