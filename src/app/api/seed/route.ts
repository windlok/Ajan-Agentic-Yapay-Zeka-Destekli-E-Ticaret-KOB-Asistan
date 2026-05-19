import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';

export async function GET(req: NextRequest) {
  return POST(req);
}

/**
 * POST /api/seed
 * Seed the database with sample data
 */
export async function POST(req: NextRequest) {
  let client;
  try {
    console.log('🌱 Starting database seed...');

    // Use createClient for pooled connections
    client = createClient();
    await client.connect();

    // Check if products already exist
    const { rows: checkRows } = await client.query('SELECT COUNT(*) as count FROM products');
    const productCount = parseInt(checkRows[0].count);

    if (productCount > 0) {
      await client.end();
      return NextResponse.json({
        success: true,
        message: `Database already has ${productCount} products`,
        timestamp: new Date().toISOString(),
      });
    }

    // Insert sample products
    await client.query(`
      INSERT INTO products (seller_id, name, description, base_price, current_price, cost_price, category, inventory, competitor_prices)
      VALUES
        ('seller-1', 'Wireless Headphones', 'High quality wireless headphones with noise cancellation', 450, 450, 200, 'Electronics', 45, '{"price": 420, "competitor": "TechStore"}'),
        ('seller-1', 'USB-C Cable', 'Durable USB-C charging cable', 89, 89, 30, 'Electronics', 120, '{"price": 85, "competitor": "ElectroMart"}'),
        ('seller-1', 'Phone Stand', 'Adjustable phone stand for desk', 120, 120, 60, 'Accessories', 3, '{"price": 150, "competitor": "AccessoryHub"}'),
        ('seller-1', 'Screen Protector', 'Tempered glass screen protector', 45, 45, 50, 'Accessories', 200, '{"price": 35, "competitor": "ProtectMe"}')
    `);
    console.log('✅ Sample products inserted');

    // Insert sample financial metrics
    await client.query(`
      INSERT INTO financial_metrics (seller_id, total_revenue, total_profit, profit_margin, month, year)
      VALUES
        ('seller-1', 45000, 15000, 33.33, 1, 2026),
        ('seller-1', 52000, 18500, 35.58, 2, 2026),
        ('seller-1', 48000, 14400, 30.00, 3, 2026)
    `);
    console.log('✅ Sample financial metrics inserted');

    // Insert seller preferences
    await client.query(`
      INSERT INTO seller_preferences (seller_id, min_margin_percentage, max_price_change, auto_optimize, notifications_enabled)
      VALUES
        ('seller-1', 15, 30, true, true)
    `);
    console.log('✅ Seller preferences inserted');

    await client.end();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      inserted: {
        products: 4,
        metrics: 3,
        preferences: 1,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (client) {
      try {
        await client.end();
      } catch (e) {}
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
