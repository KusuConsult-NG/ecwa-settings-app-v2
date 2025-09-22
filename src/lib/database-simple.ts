// Simple in-memory database for immediate functionality
interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user' | 'leader' | 'treasurer' | 'auditor'
  organization: string
  phone: string
  address: string
  createdAt: string
  isEmailVerified: boolean
  lastLogin?: string
  status: 'active' | 'inactive' | 'suspended'
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
  approvedBy?: string
  approvedAt?: string
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

interface Executive {
  id: string
  title1: string
  title2: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  address: string
  startDate: string
  salary: number
  status: 'active' | 'inactive' | 'elected' | 'appointed'
  createdAt: string
}

// In-memory storage
let users: User[] = [
  {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@churchflow.com',
    password: btoa('admin123'), // Base64 encoded for demo
    role: 'admin',
    organization: 'ChurchFlow',
    phone: '+1234567890',
    address: '123 Admin Street',
    createdAt: new Date().toISOString(),
    isEmailVerified: true,
    status: 'active'
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
let executives: Executive[] = []
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
export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'isEmailVerified' | 'lastLogin' | 'status'>): User {
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...userData,
    createdAt: new Date().toISOString(),
    isEmailVerified: false,
    status: 'active'
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

export function updateExpenditureStatus(id: string, status: 'pending' | 'approved' | 'rejected', approvedBy?: string): Expenditure | null {
  const expenditure = expenditures.find(exp => exp.id === id)
  if (expenditure) {
    expenditure.status = status
    if (approvedBy) {
      expenditure.approvedBy = approvedBy
      expenditure.approvedAt = new Date().toISOString()
    }
    return expenditure
  }
  return null
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

// Executive operations
export function createExecutive(execData: Omit<Executive, 'id' | 'createdAt'>): Executive {
  const executive: Executive = {
    id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...execData,
    createdAt: new Date().toISOString()
  }
  executives.push(executive)
  return executive
}

export function getAllExecutives(): Executive[] {
  return executives
}

export function updateExecutive(id: string, execData: Partial<Omit<Executive, 'id' | 'createdAt'>>): Executive | null {
  const executive = executives.find(exec => exec.id === id)
  if (executive) {
    Object.assign(executive, execData)
    return executive
  }
  return null
}

export function deleteExecutive(id: string): boolean {
  const index = executives.findIndex(exec => exec.id === id)
  if (index !== -1) {
    executives.splice(index, 1)
    return true
  }
  return false
}

// User update function
export function updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
  const user = users.find(u => u.id === id)
  if (user) {
    Object.assign(user, userData)
    return user
  }
  return null
}
