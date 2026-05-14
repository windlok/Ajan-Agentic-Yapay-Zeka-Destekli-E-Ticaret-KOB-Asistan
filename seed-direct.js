const pg = require('pg');

const connectionString = 'postgresql://postgres.eqnotglgxgvpchbjyxaz:SupabaseHackathon2024!xyz@db.pooling.eqnotglgxgvpchbjyxaz.supabase.co:6543/postgres';

const client = new pg.Client({ connectionString });

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if products exist
    const checkResult = await client.query('SELECT COUNT(*) as count FROM products');
    const count = parseInt(checkResult.rows[0].count);

    if (count > 0) {
      console.log(`✅ Database already has ${count} products`);
      await client.end();
      process.exit(0);
    }

    // Insert products
    await client.query(`
      INSERT INTO products (seller_id, name, description, base_price, current_price, cost_price, category, inventory, competitor_prices)
      VALUES
        ('seller-1', 'Wireless Headphones', 'High quality wireless headphones', 450, 450, 200, 'Electronics', 45, '{"price": 420}'),
        ('seller-1', 'USB-C Cable', 'Durable cable', 89, 89, 30, 'Electronics', 120, '{"price": 85}'),
        ('seller-1', 'Phone Stand', 'Adjustable stand', 120, 120, 60, 'Accessories', 3, '{"price": 150}'),
        ('seller-1', 'Screen Protector', 'Tempered glass', 45, 45, 50, 'Accessories', 200, '{"price": 35}')
    `);
    console.log('✅ Sample products inserted');

    // Insert financial metrics
    await client.query(`
      INSERT INTO financial_metrics (seller_id, total_revenue, total_profit, profit_margin, month, year)
      VALUES
        ('seller-1', 45000, 15000, 33.33, 1, 2026),
        ('seller-1', 52000, 18500, 35.58, 2, 2026),
        ('seller-1', 48000, 14400, 30.00, 3, 2026)
    `);
    console.log('✅ Financial metrics inserted');

    // Insert preferences
    await client.query(`
      INSERT INTO seller_preferences (seller_id, min_margin_percentage, max_price_change, auto_optimize, notifications_enabled)
      VALUES
        ('seller-1', 15, 30, true, true)
    `);
    console.log('✅ Seller preferences inserted');

    console.log('✨ Database seeding completed!');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    try {
      await client.end();
    } catch (e) {}
    process.exit(1);
  }
})();
