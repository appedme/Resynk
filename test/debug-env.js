require('dotenv').config({ path: '.env.local' });
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('First 20 chars:', process.env.DATABASE_URL?.substring(0, 20));
