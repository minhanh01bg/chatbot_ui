const fetch = require('node-fetch');

async function testLoginFlow() {
  console.log('Testing login flow...');
  
  try {
    // Test 1: Check session before login
    console.log('\n1. Checking session before login...');
    const sessionBefore = await fetch('http://localhost:3000/api/auth/session');
    const sessionDataBefore = await sessionBefore.json();
    console.log('Session before login:', sessionDataBefore);
    
    // Test 2: Attempt login
    console.log('\n2. Attempting login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'admin',
        password: 'admin123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response data:', {
      hasAccessToken: !!loginData.access_token,
      hasUser: !!loginData.user,
      role: loginData.role,
      user: loginData.user
    });
    
    // Test 3: Check cookies after login
    console.log('\n3. Checking cookies after login...');
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies set:', cookies);
    
    // Test 4: Check session after login
    console.log('\n4. Checking session after login...');
    const sessionAfter = await fetch('http://localhost:3000/api/auth/session', {
      headers: {
        'Cookie': cookies
      }
    });
    const sessionDataAfter = await sessionAfter.json();
    console.log('Session after login:', sessionDataAfter);
    
    // Test 5: Test admin access
    console.log('\n5. Testing admin access...');
    const adminResponse = await fetch('http://localhost:3000/admin', {
      headers: {
        'Cookie': cookies
      }
    });
    console.log('Admin access status:', adminResponse.status);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLoginFlow(); 