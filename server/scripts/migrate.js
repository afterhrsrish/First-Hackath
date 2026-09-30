import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const migrationPath = path.join(__dirname, '../../supabase/migrations/001_initial_schema.sql');

async function runMigration() {
  console.log('🌾 ========================================');
  console.log('🚀 Supabase Migration Runner for Agro-Chaos');
  console.log('🌾 ========================================');

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found at:', migrationPath);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(migrationPath, 'utf-8');
  console.log(`📄 Read migration file: ${migrationPath} (${sqlContent.length} bytes)`);

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  // 1. If DATABASE_URL is provided, run direct PostgreSQL queries via pg
  if (databaseUrl && !databaseUrl.includes('[YOUR-PASSWORD]')) {
    console.log('🔌 Connecting directly to PostgreSQL via DATABASE_URL...');
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    try {
      const client = await pool.connect();
      console.log(' Connected to PostgreSQL database. Executing SQL...');
      await client.query(sqlContent);
      client.release();
      await pool.end();
      console.log('🎉 Migration applied successfully via PostgreSQL direct connection!');
      process.exit(0);
    } catch (err) {
      console.error('❌ Direct PostgreSQL migration error:', err.message);
      // Fall through to next check
    }
  }

  // 2. Check if Supabase client can connect and if tables already exist
  if (supabaseUrl && serviceKey && !supabaseUrl.includes('your-supabase-project')) {
    console.log('🔍 Testing Supabase client connectivity with Service Role Key...');
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabase.from('farms').select('count', { count: 'exact', head: true });

    if (!error) {
      console.log('✅ Supabase "farms" table already exists and is accessible via Service Role Key!');
      console.log('🎉 Database is ready to receive and store farm data.');
      process.exit(0);
    } else if (error.code === '42P01' || error.message.includes('relation "public.farms" does not exist')) {
      console.log('⚠️ Tables do not exist yet in Supabase.');
      console.log('📌 Instructions to apply the migration in 1 click:');
      console.log('   1. Open your Supabase Dashboard: https://supabase.com/dashboard');
      console.log('   2. Go to "SQL Editor" -> "New Query"');
      console.log(`   3. Paste the contents of supabase/migrations/001_initial_schema.sql and click "RUN"`);
      console.log('   (Alternatively, set DATABASE_URL in server/.env with your Supabase DB connection string and run "npm run migrate")');
      process.exit(0);
    } else {
      console.log('ℹ️ Supabase responded:', error.message);
    }
  } else {
    console.log('⚠️ Supabase credentials not found in server/.env.');
    console.log('   Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env first.');
  }
}

runMigration().catch((err) => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
