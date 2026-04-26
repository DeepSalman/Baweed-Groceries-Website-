import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // 1. Create categories
    console.log('Creating categories...');
    const categories = [
      { name: 'Fresh Vegetables', description: 'Organic and fresh vegetables' },
      { name: 'Fresh Fruits', description: 'Seasonal fresh fruits' },
      { name: 'Dairy Products', description: 'Milk, cheese, and dairy items' },
      { name: 'Grains & Cereals', description: 'Rice, wheat, and cereals' },
      { name: 'Spices & Seasonings', description: 'Cooking spices and seasonings' },
      { name: 'Oils & Condiments', description: 'Cooking oils and condiments' },
    ];

    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (categoryError) {
      console.error('Error creating categories:', categoryError);
      return;
    }
    console.log(`Created ${categoryData.length} categories`);

    // 2. Create admin user
    console.log('Creating admin user...');
    const adminEmail = 'admin@baweed.com';
    const adminPassword = 'Admin@123456';

    const { data: adminAuthData, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (adminAuthError) {
      console.error('Error creating admin user:', adminAuthError);
    } else {
      console.log('Admin user created:', adminEmail);

      // Update admin profile with admin role
      const { error: adminProfileError } = await supabase
        .from('profiles')
        .update({ role: 'admin', full_name: 'Admin User' })
        .eq('id', adminAuthData.user.id);

      if (adminProfileError) {
        console.error('Error updating admin profile:', adminProfileError);
      }
    }

    // 3. Create suppliers with auth users
    console.log('Creating suppliers...');
    const suppliersData = [
      {
        name: 'Fresh Valley Farms',
        contact: 'Ahmed Al-Mansouri',
        email: 'supplier1@freshvalley.com',
        phone: '+971501234567',
        address: '123 Farm Road',
        city: 'Al Ain',
        state: 'Abu Dhabi',
        country: 'UAE',
      },
      {
        name: 'Green Harvest Company',
        contact: 'Fatima Al-Zaabi',
        email: 'supplier2@greenharvest.com',
        phone: '+971502345678',
        address: '456 Market Street',
        city: 'Dubai',
        state: 'Dubai',
        country: 'UAE',
      },
      {
        name: 'Spice Trail Traders',
        contact: 'Mohammed Al-Ketbi',
        email: 'supplier3@spicetrail.com',
        phone: '+971503456789',
        address: '789 Trade Center',
        city: 'Sharjah',
        state: 'Sharjah',
        country: 'UAE',
      },
    ];

    const suppliers = [];
    for (const supplierInfo of suppliersData) {
      const { data: supplierAuthData, error: supplierAuthError } = await supabase.auth.admin.createUser({
        email: supplierInfo.email,
        password: 'Supplier@123456',
        email_confirm: true,
      });

      if (supplierAuthError) {
        console.error(`Error creating supplier user ${supplierInfo.email}:`, supplierAuthError);
        continue;
      }

      // Update supplier profile with supplier role
      await supabase
        .from('profiles')
        .update({ role: 'supplier', full_name: supplierInfo.contact })
        .eq('id', supplierAuthData.user.id);

      // Create supplier record
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .insert({
          user_id: supplierAuthData.user.id,
          company_name: supplierInfo.name,
          contact_person: supplierInfo.contact,
          email: supplierInfo.email,
          phone: supplierInfo.phone,
          address: supplierInfo.address,
          city: supplierInfo.city,
          state: supplierInfo.state,
          country: supplierInfo.country,
          payment_terms: 'Net 30',
          tax_id: `TAX${Date.now()}`,
          bank_name: 'Emirates Bank',
          bank_account: `ACC${Date.now()}`,
        })
        .select();

      if (supplierError) {
        console.error(`Error creating supplier ${supplierInfo.name}:`, supplierError);
        continue;
      }

      suppliers.push(supplierData[0]);
      console.log(`Created supplier: ${supplierInfo.name}`);
    }

    // 4. Create products
    console.log('Creating products...');
    const productsToCreate = [
      // Fresh Vegetables
      {
        supplier_id: suppliers[0]?.id,
        category_id: categoryData[0].id,
        name: 'Organic Tomatoes',
        description: 'Fresh organic tomatoes from local farms',
        sku: 'VEG-001',
        unit_price: 12.50,
        unit: 'kg',
      },
      {
        supplier_id: suppliers[0]?.id,
        category_id: categoryData[0].id,
        name: 'Green Bell Peppers',
        description: 'Crisp green bell peppers',
        sku: 'VEG-002',
        unit_price: 8.99,
        unit: 'kg',
      },
      {
        supplier_id: suppliers[1]?.id,
        category_id: categoryData[0].id,
        name: 'Cucumber',
        description: 'Fresh cucumbers',
        sku: 'VEG-003',
        unit_price: 5.50,
        unit: 'kg',
      },
      // Fresh Fruits
      {
        supplier_id: suppliers[1]?.id,
        category_id: categoryData[1].id,
        name: 'Fresh Apples',
        description: 'Crisp and sweet apples',
        sku: 'FRUIT-001',
        unit_price: 15.00,
        unit: 'kg',
      },
      {
        supplier_id: suppliers[1]?.id,
        category_id: categoryData[1].id,
        name: 'Bananas',
        description: 'Yellow ripe bananas',
        sku: 'FRUIT-002',
        unit_price: 6.50,
        unit: 'kg',
      },
      {
        supplier_id: suppliers[0]?.id,
        category_id: categoryData[1].id,
        name: 'Oranges',
        description: 'Juicy oranges',
        sku: 'FRUIT-003',
        unit_price: 9.99,
        unit: 'kg',
      },
      // Dairy Products
      {
        supplier_id: suppliers[0]?.id,
        category_id: categoryData[2].id,
        name: 'Fresh Milk 1L',
        description: 'Fresh pasteurized milk',
        sku: 'DAIRY-001',
        unit_price: 7.50,
        unit: 'bottle',
      },
      {
        supplier_id: suppliers[0]?.id,
        category_id: categoryData[2].id,
        name: 'Yogurt Plain 500g',
        description: 'Natural plain yogurt',
        sku: 'DAIRY-002',
        unit_price: 5.99,
        unit: 'pack',
      },
      // Grains & Cereals
      {
        supplier_id: suppliers[1]?.id,
        category_id: categoryData[3].id,
        name: 'Basmati Rice 1kg',
        description: 'Premium basmati rice',
        sku: 'GRAIN-001',
        unit_price: 18.50,
        unit: 'kg',
      },
      // Spices
      {
        supplier_id: suppliers[2]?.id,
        category_id: categoryData[4].id,
        name: 'Cumin Seeds 100g',
        description: 'Aromatic cumin seeds',
        sku: 'SPICE-001',
        unit_price: 12.00,
        unit: 'pack',
      },
      {
        supplier_id: suppliers[2]?.id,
        category_id: categoryData[4].id,
        name: 'Black Pepper 100g',
        description: 'Premium black pepper',
        sku: 'SPICE-002',
        unit_price: 15.50,
        unit: 'pack',
      },
      // Oils
      {
        supplier_id: suppliers[2]?.id,
        category_id: categoryData[5].id,
        name: 'Extra Virgin Olive Oil 500ml',
        description: 'Premium olive oil',
        sku: 'OIL-001',
        unit_price: 35.00,
        unit: 'bottle',
      },
    ];

    const validProducts = productsToCreate.filter(p => p.supplier_id && p.category_id);
    if (validProducts.length === 0) {
      console.error('No valid suppliers or categories found for products');
      return;
    }

    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert(validProducts)
      .select();

    if (productError) {
      console.error('Error creating products:', productError);
      return;
    }
    console.log(`Created ${productData.length} products`);

    // 5. Create inventory for each product
    console.log('Creating inventory records...');
    const inventoryData = productData.map(product => ({
      product_id: product.id,
      quantity_on_hand: Math.floor(Math.random() * 100) + 20,
      quantity_reserved: Math.floor(Math.random() * 10),
      reorder_level: 10,
      reorder_quantity: 50,
    }));

    const { data: inventoryInsertData, error: inventoryError } = await supabase
      .from('inventory')
      .insert(inventoryData)
      .select();

    if (inventoryError) {
      console.error('Error creating inventory:', inventoryError);
      return;
    }
    console.log(`Created ${inventoryInsertData.length} inventory records`);

    console.log('Database seeding completed successfully!');
    console.log('\n--- Test Credentials ---');
    console.log('Admin Email: admin@baweed.com');
    console.log('Admin Password: Admin@123456');
    console.log('\nSupplier Accounts:');
    suppliersData.forEach(supplier => {
      console.log(`${supplier.name}: ${supplier.email} / Supplier@123456`);
    });

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
