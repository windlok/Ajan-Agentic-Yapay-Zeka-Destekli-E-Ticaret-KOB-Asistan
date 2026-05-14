const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:SupabaseHackathon2024!xyz@db.eqnotglgxgvpchbjyxaz.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  try {
    console.log('🔄 Creating tables...');
    await client.connect();

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        seller_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        base_price DECIMAL(10, 2),
        current_price DECIMAL(10, 2),
        cost_price DECIMAL(10, 2),
        category VARCHAR(100),
        inventory INT DEFAULT 0,
        competitor_prices JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Products table created');

    // Create financial_metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_metrics (
        id SERIAL PRIMARY KEY,
        seller_id VARCHAR(255) NOT NULL,
        total_revenue DECIMAL(15, 2),
        total_profit DECIMAL(15, 2),
        profit_margin DECIMAL(5, 2),
        month INT,
        year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Financial metrics table created');

    console.log('✨ All tables created successfully!');
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTables();
