import { sql } from '@vercel/postgres';

async function setupDatabase() {
  try {
    console.log('🔄 Creating tables...');

    // Create products table
    await sql`
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
    `;
    console.log('✅ Products table created');

    // Create financial_metrics table
    await sql`
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
    `;
    console.log('✅ Financial metrics table created');

    // Create action_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS action_logs (
        id SERIAL PRIMARY KEY,
        seller_id VARCHAR(255) NOT NULL,
        action_type VARCHAR(50),
        product_id INT,
        details JSONB,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Action logs table created');

    // Create seller_preferences table
    await sql`
      CREATE TABLE IF NOT EXISTS seller_preferences (
        id SERIAL PRIMARY KEY,
        seller_id VARCHAR(255) UNIQUE NOT NULL,
        min_margin_percentage DECIMAL(5, 2) DEFAULT 15,
        max_price_change DECIMAL(5, 2) DEFAULT 30,
        auto_optimize BOOLEAN DEFAULT true,
        notifications_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Seller preferences table created');

    console.log('\n✨ All tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

setupDatabase();
