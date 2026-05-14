const { sql } = require('@vercel/postgres');

async function seedDatabase() {
  try {
    console.log('🔄 Seeding database with dummy data...');

    // Insert sample products
    await sql`
      INSERT INTO products (seller_id, name, description, base_price, current_price, cost_price, category, inventory, competitor_prices)
      VALUES 
        ('seller-1', 'Wireless Headphones', 'High quality Bluetooth headphones', 500, 450, 250, 'Electronics', 45, '{"competitor_1": 420, "competitor_2": 480}'::jsonb),
        ('seller-1', 'USB-C Cable', 'Fast charging cable', 100, 89, 30, 'Accessories', 120, '{"competitor_1": 85, "competitor_2": 95}'::jsonb),
        ('seller-1', 'Phone Stand', 'Adjustable phone stand', 150, 120, 60, 'Accessories', 3, '{"competitor_1": 150, "competitor_2": 140}'::jsonb),
        ('seller-1', 'Screen Protector', 'Tempered glass protector', 60, 45, 50, 'Accessories', 200, '{"competitor_1": 35, "competitor_2": 55}'::jsonb)
    `;
    console.log('✅ Products inserted');

    // Insert sample financial metrics
    await sql`
      INSERT INTO financial_metrics (seller_id, total_revenue, total_profit, profit_margin, month, year)
      VALUES 
        ('seller-1', 50000, 12500, 25, 5, 2026),
        ('seller-1', 48000, 11520, 24, 4, 2026),
        ('seller-1', 45000, 10800, 24, 3, 2026)
    `;
    console.log('✅ Financial metrics inserted');

    console.log('✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
