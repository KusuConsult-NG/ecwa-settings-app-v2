# Database Setup Guide for ChurchFlow

This guide helps you connect to your Neon database and set up the database schema for ChurchFlow.

## 🔗 **Your Neon Database Connection**

**Connection String:**
```
postgresql://neondb_owner:npg_8iVZwHmaxgy7@ep-old-truth-admsvs0a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Connection Details:**
- **Host:** `ep-old-truth-admsvs0a-pooler.c-2.us-east-1.aws.neon.tech`
- **Database:** `neondb`
- **Username:** `neondb_owner`
- **Password:** `npg_8iVZwHmaxgy7`
- **Port:** `5432` (default)
- **SSL:** Required

## 🚀 **Connection Methods**

### **Method 1: Neon Web Console (Easiest)**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign in to your account
3. Select your project
4. Click on "SQL Editor" or "Query"
5. Run SQL commands directly in the browser

### **Method 2: Install PostgreSQL Client**
```bash
# Run the installation script
./install-postgresql.sh

# Then connect
psql 'postgresql://neondb_owner:npg_8iVZwHmaxgy7@ep-old-truth-admsvs0a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

### **Method 3: Using Node.js (Programmatic)**
```bash
# Install pg client
npm install pg

# Create a connection script
node connect-db.js
```

## 🗄️ **Database Schema Setup**

### **1. Create Users Table**
```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Member',
    organization VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### **2. Create Expenditures Table**
```sql
CREATE TABLE IF NOT EXISTS expenditures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_expenditures_status ON expenditures(status);
CREATE INDEX IF NOT EXISTS idx_expenditures_category ON expenditures(category);
CREATE INDEX IF NOT EXISTS idx_expenditures_created_at ON expenditures(created_at);
```

### **3. Create Income Table**
```sql
CREATE TABLE IF NOT EXISTS income (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'received',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_income_status ON income(status);
CREATE INDEX IF NOT EXISTS idx_income_category ON income(category);
CREATE INDEX IF NOT EXISTS idx_income_created_at ON income(created_at);
```

### **4. Create Organizations Table**
```sql
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- DCC, LCC, Fellowship
    location VARCHAR(255),
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);
CREATE INDEX IF NOT EXISTS idx_organizations_location ON organizations(location);
```

### **5. Create Audit Logs Table**
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
```

## 🔧 **Environment Configuration**

### **1. Create .env.local file**
```bash
# Copy the example file
cp neon-env.example .env.local

# Edit with your actual values
DATABASE_URL=postgresql://neondb_owner:npg_8iVZwHmaxgy7@ep-old-truth-admsvs0a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEON_PROJECT_ID=your-project-id-here
NEON_API_KEY=your-api-key-here
```

### **2. Update your auth.ts to use Neon**
```typescript
// In src/lib/auth.ts, replace file-based storage with Neon
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Update all functions to use pool.query() instead of file operations
```

## 🧪 **Test Database Connection**

### **Using Node.js**
```javascript
// test-connection.js
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ Database connected successfully!')
    console.log('Current time:', result.rows[0].now)
    client.release()
  } catch (err) {
    console.error('❌ Database connection failed:', err)
  } finally {
    await pool.end()
  }
}

testConnection()
```

### **Using psql**
```bash
# Test connection
psql 'postgresql://neondb_owner:npg_8iVZwHmaxgy7@ep-old-truth-admsvs0a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -c "SELECT NOW();"
```

## 🚀 **Next Steps**

1. **Choose a connection method** (web console recommended for beginners)
2. **Run the schema setup** SQL commands
3. **Update environment variables** in `.env.local`
4. **Test the connection** using one of the test methods
5. **Update your application** to use the database instead of file storage

## 🔍 **Troubleshooting**

### **Connection Issues**
- Verify your connection string is correct
- Check that SSL is enabled
- Ensure your IP is not blocked by Neon

### **Permission Issues**
- Make sure you're using the correct username/password
- Check that your user has the necessary permissions

### **Schema Issues**
- Run the CREATE TABLE statements in order
- Check for any syntax errors in your SQL
- Verify that all referenced tables exist

## 📚 **Additional Resources**

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js pg Documentation](https://node-postgres.com/)

Your ChurchFlow database is ready to be set up! 🎉
