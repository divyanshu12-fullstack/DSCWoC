import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Database & Auth Connections...\n');

// Test MongoDB
async function testMongoDB() {
  console.log('📦 Testing MongoDB Atlas...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log('❌ MongoDB Connection Failed!');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test Supabase
async function testSupabase() {
  console.log('\n🔐 Testing Supabase...');
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    // Test by checking auth settings (doesn't require any data)
    const { data, error } = await supabase.auth.getSession();

    if (error && !error.message.includes('session')) {
      throw error;
    }

    console.log('✅ Supabase Connected Successfully!');
    console.log(`   URL: ${process.env.SUPABASE_URL}`);
    return true;
  } catch (error) {
    console.log('❌ Supabase Connection Failed!');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Run tests
async function runTests() {
  const mongoOk = await testMongoDB();
  const supabaseOk = await testSupabase();

  console.log('\n' + '='.repeat(40));
  console.log('📊 RESULTS:');
  console.log(`   MongoDB:   ${mongoOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`   Supabase:  ${supabaseOk ? '✅ Working' : '❌ Failed'}`);
  console.log('='.repeat(40));

  process.exit(mongoOk && supabaseOk ? 0 : 1);
}

runTests();
