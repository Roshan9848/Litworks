const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local since we are running outside Next.js context
const envPath = path.join(__dirname, '.env.local');
let MONGODB_URI = '';
let MONGODB_DB = 'litworks';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const eqIndex = line.indexOf('=');
    if (eqIndex !== -1) {
      const key = line.slice(0, eqIndex).trim();
      const val = line.slice(eqIndex + 1).trim();
      if (key === 'MONGODB_URI') {
        MONGODB_URI = val;
      } else if (key === 'MONGODB_DB') {
        MONGODB_DB = val;
      }
    }
  }
}

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('Testing connection to MongoDB...');
console.log('URI:', MONGODB_URI.replace(/:([^@]+)@/, ':****@')); // Hide password in logs

async function testConnection() {
  const client = new MongoClient(MONGODB_URI, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas! ✅');
    
    const db = client.db(MONGODB_DB);
    console.log(`Accessing database: "${MONGODB_DB}"...`);
    
    // Check list of collections
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('Connection failed! ❌');
    console.error('Error details:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();
