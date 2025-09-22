// Simple test script to verify signup and login flow
const testUser = {
  name: "Test User Final",
  email: "testfinal@example.com",
  password: "password123",
  confirmPassword: "password123",
  phone: "+1234567890",
  address: "123 Test Street"
}

async function testAuth() {
  console.log('🧪 Starting authentication test...')
  
  // Step 1: Signup
  console.log('📝 Step 1: Creating user...')
  const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testUser),
  })
  
  const signupData = await signupResponse.json()
  console.log('📝 Signup result:', signupData)
  
  if (!signupData.success) {
    console.error('❌ Signup failed:', signupData.message)
    return
  }
  
  // Step 2: Wait a moment
  console.log('⏳ Waiting 2 seconds...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Step 3: Login
  console.log('🔐 Step 2: Logging in...')
  const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    }),
  })
  
  const loginData = await loginResponse.json()
  console.log('🔐 Login result:', loginData)
  
  if (loginData.success) {
    console.log('✅ Authentication test PASSED!')
  } else {
    console.error('❌ Login failed:', loginData.message)
  }
}

testAuth().catch(console.error)

