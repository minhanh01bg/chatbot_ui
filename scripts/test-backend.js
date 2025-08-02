#!/usr/bin/env node

/**
 * Script to test backend connectivity
 */

const urls = [
  'http://localhost:8000',
  'http://127.0.0.1:8000', 
  'http://localhost:8001',
  'http://127.0.0.1:8001'
];

async function testConnection(url) {
  try {
    console.log(`Testing connection to: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${url}/api/v1/subscriptions/create_subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({ plan_id: 'test' }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log(`✅ ${url} - Connected successfully (${response.status})`);
      const data = await response.text();
      console.log(`   Response: ${data.substring(0, 100)}...`);
      return true;
    } else {
      console.log(`⚠️  ${url} - Server responded with ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`❌ ${url} - Connection timeout (5s)`);
    } else if (error.code === 'ECONNREFUSED') {
      console.log(`❌ ${url} - Connection refused (server not running)`);
    } else {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
    return false;
  }
}

async function main() {
  console.log('🔍 Testing backend connectivity...\n');
  
  let foundWorking = false;
  
  for (const url of urls) {
    const isWorking = await testConnection(url);
    if (isWorking && !foundWorking) {
      foundWorking = true;
      console.log(`\n🎯 Recommended backend URL: ${url}\n`);
    }
    console.log(''); // Empty line
  }
  
  if (!foundWorking) {
    console.log('❌ No working backend found. Please ensure your backend server is running.');
    console.log('\nTo start your backend server:');
    console.log('1. Navigate to your backend directory');
    console.log('2. Run: python -m uvicorn main:app --host 0.0.0.0 --port 8000');
    console.log('   or: python -m uvicorn main:app --host 0.0.0.0 --port 8001');
  }
}

main().catch(console.error);
