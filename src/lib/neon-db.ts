// Neon Database Integration
import { neon } from '@neondatabase/serverless'

const DATABASE_URL = 'postgresql://neondb_owner:npg_8iVZwHmaxgy7@ep-old-truth-admsvs0a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

// Initialize Neon client
const sql = neon(DATABASE_URL)

// User interface
interface User {
  id: string
  name: string
  email: string
  password: string
  role: string
  organization: string
  phone: string
  address: string
  created_at: string
  is_email_verified: boolean
  last_login?: string
}

// Organization interface
interface Organization {
  id: string
  name: string
  type: 'GCC' | 'DCC' | 'LCC' | 'LC' | 'Prayer House'
  parent_id?: string
  parent_name?: string
  status: 'active' | 'inactive'
  created_at: string
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'Member',
        organization VARCHAR(255) DEFAULT 'ChurchFlow',
        phone VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        is_email_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP
      );
    `

    // Create organizations table
    await sql`
      CREATE TABLE IF NOT EXISTS organizations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        parent_id VARCHAR(255),
        parent_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create income table
    await sql`
      CREATE TABLE IF NOT EXISTS income (
        id VARCHAR(255) PRIMARY KEY,
        source VARCHAR(255) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        date DATE NOT NULL,
        recorded_by VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create expenditures table
    await sql`
      CREATE TABLE IF NOT EXISTS expenditures (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        amount DECIMAL(15,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Create bank_accounts table
    await sql`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        account_number VARCHAR(100) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'NGN',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Insert default admin user if not exists
    const adminExists = await sql`
      SELECT id FROM users WHERE email = 'admin@churchflow.com' LIMIT 1;
    `

    if (adminExists.length === 0) {
      await sql`
        INSERT INTO users (id, name, email, password, role, organization, phone, address, is_email_verified)
        VALUES ('admin_1', 'Admin User', 'admin@churchflow.com', 'admin123', 'Admin', 'ChurchFlow', '+1234567890', '123 Admin Street', true);
      `
    }

    // Insert default organizations if not exists
    const gccExists = await sql`
      SELECT id FROM organizations WHERE type = 'GCC' LIMIT 1;
    `

    if (gccExists.length === 0) {
      await sql`
        INSERT INTO organizations (id, name, type, status) VALUES 
        ('gcc_1', 'ECWA General Church Council', 'GCC', 'active'),
        ('dcc_1', 'Jos DCC', 'DCC', 'active'),
        ('dcc_2', 'Abuja DCC', 'DCC', 'active'),
        ('lcc_1', 'Jos Central LCC', 'LCC', 'active'),
        ('lcc_2', 'Jos North LCC', 'LCC', 'active'),
        ('lcc_3', 'Abuja Central LCC', 'LCC', 'active');
      `
    }

    console.log('Database initialized successfully')
    return true
  } catch (error) {
    console.error('Database initialization error:', error)
    return false
  }
}

// User operations
export async function createUser(userData: Omit<User, 'id' | 'created_at'>) {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const result = await sql`
    INSERT INTO users (id, name, email, password, role, organization, phone, address, is_email_verified)
    VALUES (${id}, ${userData.name}, ${userData.email}, ${userData.password}, ${userData.role}, ${userData.organization}, ${userData.phone}, ${userData.address}, ${userData.is_email_verified})
    RETURNING *;
  `
  
  return result[0]
}

export async function findUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1;
  `
  return result[0] || null
}

export async function findUserById(id: string) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id} LIMIT 1;
  `
  return result[0] || null
}

// Organization operations
export async function getOrganizations(type?: string) {
  if (type) {
    const result = await sql`
      SELECT * FROM organizations WHERE type = ${type} ORDER BY name;
    `
    return result
  } else {
    const result = await sql`
      SELECT * FROM organizations ORDER BY type, name;
    `
    return result
  }
}

export async function createOrganization(orgData: Omit<Organization, 'id' | 'created_at'>) {
  const id = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const result = await sql`
    INSERT INTO organizations (id, name, type, parent_id, parent_name, status)
    VALUES (${id}, ${orgData.name}, ${orgData.type}, ${orgData.parent_id || null}, ${orgData.parent_name || null}, ${orgData.status})
    RETURNING *;
  `
  
  return result[0]
}

// Income operations
export async function createIncome(incomeData: any) {
  const id = `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const result = await sql`
    INSERT INTO income (id, source, amount, date, recorded_by, status)
    VALUES (${id}, ${incomeData.source}, ${incomeData.amount}, ${incomeData.date}, ${incomeData.recorded_by}, ${incomeData.status})
    RETURNING *;
  `
  
  return result[0]
}

export async function getAllIncome() {
  const result = await sql`
    SELECT * FROM income ORDER BY created_at DESC;
  `
  return result
}

// Expenditure operations
export async function createExpenditure(expData: any) {
  const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const result = await sql`
    INSERT INTO expenditures (id, title, description, amount, category, status, created_by)
    VALUES (${id}, ${expData.title}, ${expData.description}, ${expData.amount}, ${expData.category}, ${expData.status}, ${expData.created_by})
    RETURNING *;
  `
  
  return result[0]
}

export async function getAllExpenditures() {
  const result = await sql`
    SELECT * FROM expenditures ORDER BY created_at DESC;
  `
  return result
}

// Bank account operations
export async function createBankAccount(bankData: any) {
  const id = `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const result = await sql`
    INSERT INTO bank_accounts (id, name, account_number, balance, currency, status)
    VALUES (${id}, ${bankData.name}, ${bankData.account_number}, ${bankData.balance}, ${bankData.currency}, ${bankData.status})
    RETURNING *;
  `
  
  return result[0]
}

export async function getAllBankAccounts() {
  const result = await sql`
    SELECT * FROM bank_accounts ORDER BY created_at DESC;
  `
  return result
}
