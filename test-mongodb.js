// MongoDB Connection Test Script
// Run with: node test-mongodb.js

require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...\n');
console.log('📋 Configuration:');
console.log('   URI:', process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//<username>:<password>@'));
console.log('   Database:', process.env.MONGODB_URI?.split('/').pop()?.split('?')[0]);
console.log('\n⏳ Connecting...\n');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ SUCCESS! MongoDB Connected');
        console.log('📊 Connection Details:');
        console.log('   Host:', mongoose.connection.host);
        console.log('   Database:', mongoose.connection.db.databaseName);
        console.log('   State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
        
        // Test a simple query
        return mongoose.connection.db.admin().listDatabases();
    })
    .then(result => {
        console.log('\n📁 Available Databases:');
        result.databases.forEach(db => {
            console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });
        
        console.log('\n✅ All tests passed! MongoDB is working correctly.');
        process.exit(0);
    })
    .catch(error => {
        console.log('❌ CONNECTION FAILED!\n');
        console.log('Error:', error.message);
        console.log('\n📝 Common Solutions:');
        console.log('   1. Whitelist your IP in MongoDB Atlas → Network Access');
        console.log('   2. Verify username/password in .env file');
        console.log('   3. Check if cluster is running in MongoDB Atlas');
        console.log('   4. Try "Allow Access From Anywhere" (0.0.0.0/0)');
        console.log('\n💡 Quick Fix:');
        console.log('   1. Go to https://cloud.mongodb.com/');
        console.log('   2. Navigate to Network Access');
        console.log('   3. Click "Add IP Address"');
        console.log('   4. Choose "Allow Access From Anywhere"');
        console.log('   5. Click "Confirm" and wait 2 minutes');
        console.log('   6. Run this test again: node test-mongodb.js');
        process.exit(1);
    });

// Timeout after 30 seconds
setTimeout(() => {
    console.log('\n⏰ Connection timeout (30 seconds)');
    console.log('This usually means:');
    console.log('   - IP address is not whitelisted');
    console.log('   - Firewall is blocking connection');
    console.log('   - Network connectivity issues');
    process.exit(1);
}, 30000);
