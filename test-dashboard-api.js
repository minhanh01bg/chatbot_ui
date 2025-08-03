// Test script để kiểm tra API dashboard
const fetch = require('node-fetch');

async function testDashboardAPI() {
  try {
    console.log('Testing Dashboard API...');
    
    // Test với một token giả (thay thế bằng token thật nếu có)
    const testToken = 'test_token_123';
    
    const response = await fetch('http://localhost:3000/api/dashboard?rangeDays=7', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify({ site_key: 'test_site' }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Error testing dashboard API:', error);
  }
}

testDashboardAPI(); 