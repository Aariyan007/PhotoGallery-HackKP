// debug-test.js - Run this to test your backend connection
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Debug Test Starting...\n');

// Test 1: Environment Variables
console.log('📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? '✅ Set' : '❌ Missing');
console.log('\n');

// Test 2: MongoDB Connection
const testMongoConnection = async () => {
  console.log('🔌 Testing MongoDB Connection...');
  
  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in environment variables');
    console.log('💡 Create a .env file with your MongoDB connection string');
    return;
  }

  try {
    console.log('⏳ Connecting to:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('DebugTest', TestSchema);
    
    console.log('📝 Testing document creation...');
    const testDoc = new TestModel({ name: 'Debug Test User' });
    await testDoc.save();
    console.log('✅ Test document created successfully!');
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('🧹 Test document cleaned up');
    
  } catch (error) {
    console.log('❌ MongoDB Connection Error:');
    console.log('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 DNS resolution failed - check your connection string');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Authentication failed - check username/password');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Connection refused - check if MongoDB service is running');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
  }
};

// Test 3: HTTP Server Test
const testHTTPServer = async () => {
  console.log('\n🌐 Testing HTTP Server...');
  
  const http = require('http');
  const testPort = process.env.PORT || 3001;
  
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${testPort}/`, (res) => {
      console.log('✅ Backend server is responding');
      console.log('Status:', res.statusCode);
      resolve();
    });
    
    req.on('error', (error) => {
      console.log('❌ Backend server is not running or not accessible');
      console.log('Error:', error.message);
      console.log('💡 Make sure to run: npm run dev');
      resolve();
    });
    
    req.setTimeout(3000, () => {
      console.log('❌ Request timeout - server might be down');
      req.destroy();
      resolve();
    });
  });
};

// Run all tests
const runTests = async () => {
  await testMongoConnection();
  await testHTTPServer();
  
  console.log('\n🏁 Debug test completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. If MongoDB failed: Fix your .env MONGODB_URI');
  console.log('2. If HTTP failed: Start your backend server with "npm run dev"');
  console.log('3. If both passed: Check CORS settings and frontend API calls');
  
  process.exit(0);
};

runTests().catch(console.error);