import { sql } from '@vercel/postgres';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Check if products already exist
    const { rows } = await sql`SELECT COUNT(*) as count FROM products`;
    
    if (parseInt(rows[0].count) > 0) {
      console.log('✅ Database already has products, skipping seed');
      return;
    }

    // Insert sample products
    await sql`
      INSERT INTO products (seller_id, name, description, base_price, current_price, cost_price, category, inventory, competitor_prices)
      VALUES
        ('seller-1', 'Wireless Headphones', 'High quality wireless headphones with noise cancellation', 450, 450, 200, 'Electronics', 45, '{"price": 420, "competitor": "TechStore"}'),
        ('seller-1', 'USB-C Cable', 'Durable USB-C charging cable', 89, 89, 30, 'Electronics', 120, '{"price": 85, "competitor": "ElectroMart"}'),
        ('seller-1', 'Phone Stand', 'Adjustable phone stand for desk', 120, 120, 60, 'Accessories', 3, '{"price": 150, "competitor": "AccessoryHub"}'),
        ('seller-1', 'Screen Protector', 'Tempered glass screen protector', 45, 45, 50, 'Accessories', 200, '{"price": 35, "competitor": "ProtectMe"}')
    `;
    console.log('✅ Sample products inserted');

    // Insert sample financial metrics
    await sql`
      INSERT INTO financial_metrics (seller_id, total_revenue, total_profit, profit_margin, month, year)
      VALUES
        ('seller-1', 45000, 15000, 33.33, 1, 2026),
        ('seller-1', 52000, 18500, 35.58, 2, 2026),
        ('seller-1', 48000, 14400, 30.00, 3, 2026)
    `;
    console.log('✅ Sample financial metrics inserted');

    // Insert seller preferences
    await sql`
      INSERT INTO seller_preferences (seller_id, min_margin_percentage, max_price_change, auto_optimize, notifications_enabled)
      VALUES
        ('seller-1', 15, 30, true, true)
    `;
    console.log('✅ Seller preferences inserted');

    console.log('✨ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
