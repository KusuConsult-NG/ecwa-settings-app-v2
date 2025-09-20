#!/usr/bin/env node

// Database Connection Test Script for ChurchFlow
// This script tests the connection to your Neon database

const { Pool } = require('pg')

// Your Neon database connection string
const connectionString = 'postgresql://neondb_owner:npg_8iVZwHmaxgy7@ep-old-truth-admsvs0a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

async function testConnection() {
  console.log('🔗 Testing Neon Database Connection...')
  console.log('=====================================')
  
  try {
    // Test basic connection
    const client = await pool.connect()
    console.log('✅ Database connection established!')
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version')
    console.log('✅ Query executed successfully!')
    console.log('📅 Current time:', result.rows[0].current_time)
    console.log('🐘 PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0])
    
    // Test database info
    const dbInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        inet_server_addr() as server_address,
        inet_server_port() as server_port
    `)
    
    console.log('📊 Database Information:')
    console.log('   Database:', dbInfo.rows[0].database_name)
    console.log('   User:', dbInfo.rows[0].current_user)
    console.log('   Server:', dbInfo.rows[0].server_address)
    console.log('   Port:', dbInfo.rows[0].server_port)
    
    // Test table creation (if not exists)
    console.log('\n🏗️  Testing table creation...')
    
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Member',
        organization VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE
      )
    `
    
    await client.query(createUsersTable)
    console.log('✅ Users table created/verified')
    
    // Test insert
    const testUser = {
      name: 'Test User',
      email: 'test@churchflow.com',
      password: 'hashed_password',
      role: 'Admin',
      organization: 'ChurchFlow Test'
    }
    
    const insertResult = await client.query(`
      INSERT INTO users (name, email, password, role, organization) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (email) DO NOTHING 
      RETURNING id
    `, [testUser.name, testUser.email, testUser.password, testUser.role, testUser.organization])
    
    if (insertResult.rows.length > 0) {
      console.log('✅ Test user inserted successfully')
    } else {
      console.log('ℹ️  Test user already exists (skipped)')
    }
    
    // Test select
    const selectResult = await client.query('SELECT COUNT(*) as user_count FROM users')
    console.log('👥 Total users in database:', selectResult.rows[0].user_count)
    
    client.release()
    console.log('\n🎉 Database connection test completed successfully!')
    console.log('🚀 Your ChurchFlow database is ready to use!')
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error('Error:', error.message)
    console.error('\n🔧 Troubleshooting:')
    console.error('1. Check your connection string')
    console.error('2. Verify your Neon credentials')
    console.error('3. Ensure your IP is not blocked')
    console.error('4. Check if the database is accessible')
    
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the test
testConnection().catch(console.error)
