const { createClient } = require('@vercel/postgres');

async function check() {
  const client = createClient({
    connectionString: "postgresql://postgres.eqnotglgxgvpchbjyxaz:SupabaseHackathon2024!xyz@db.eqnotglgxgvpchbjyxaz.supabase.co:5432/postgres"
  });
  
  try {
    await client.connect();
    console.log('--- DB CHECK START (DIRECT CLIENT) ---');
    const result = await client.query('SELECT * FROM products LIMIT 5;');
    console.log('Result length:', result.rows.length);
    console.log('Rows:', JSON.stringify(result.rows, null, 2));
    
    if (result.rows.length === 0) {
        console.log('DB is empty, inserting seed data...');
        await client.query("INSERT INTO products (name, base_price, current_price, cost_price, inventory, seller_id) VALUES ('Wireless Headphones', 450, 450, 200, 45, 'default-seller')");
        await client.query("INSERT INTO products (name, base_price, current_price, cost_price, inventory, seller_id) VALUES ('USB-C Cable', 89, 89, 30, 120, 'default-seller')");
        console.log('Seed done.');
    }
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await client.end();
  }
}

check();
