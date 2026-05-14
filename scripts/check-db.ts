
import { sql } from '@vercel/postgres';

async function testDb() {
  try {
    const result = await sql`SELECT * FROM products LIMIT 5;`;
    console.log('--- DATABASE STATUS ---');
    console.log('Count:', result.rows.length);
    console.log('Rows:', JSON.stringify(result.rows, null, 2));
    
    if (result.rows.length === 0) {
      console.log('Database is EMPTY. Inserting dummy data...');
      await sql`
        INSERT INTO products (name, base_price, current_price, cost_price, inventory, seller_id)
        VALUES 
        ('Wireless Headphones', 450, 450, 200, 45, 'default-seller'),
        ('USB-C Cable', 89, 89, 30, 120, 'default-seller');
      console.log('Insert complete.');
    }
  } catch (e) {
    console.error('DB Test Error:', e);
  }
}

testDb();
