const { sql } = require('@vercel/postgres');

// Set the database URL from environment or use the one from .env.local
process.env.POSTGRES_URL = process.env.DATABASE_URL || 'postgresql://postgres:SupabaseHackathon2024!xyz@db.eqnotglgxgvpchbjyxaz.supabase.co:5432/postgres';

(async () => {
  try {
    console.log('🌱 Checking database...');
    const {rows} = await sql`SELECT COUNT(*) as count FROM products`;
    
    if (parseInt(rows[0].count) === 0) {
      console.log('Adding sample products...');
      await sql`
        INSERT INTO products (seller_id, name, description, base_price, current_price, cost_price, category, inventory, competitor_prices)
        VALUES
          ('seller-1', 'Wireless Headphones', 'High quality wireless headphones', 450, 450, 200, 'Electronics', 45, '{"price": 420}'),
          ('seller-1', 'USB-C Cable', 'Durable cable', 89, 89, 30, 'Electronics', 120, '{"price": 85}'),
          ('seller-1', 'Phone Stand', 'Adjustable stand', 120, 120, 60, 'Accessories', 3, '{"price": 150}'),
          ('seller-1', 'Screen Protector', 'Tempered glass', 45, 45, 50, 'Accessories', 200, '{"price": 35}')
      `;
      console.log('✅ Sample products inserted');
    } else {
      console.log('✅ Products already exist (' + rows[0].count + ')');
    }
    process.exit(0);
  } catch(e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
