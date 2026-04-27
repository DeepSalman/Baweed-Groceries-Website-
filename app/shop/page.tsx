'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type Product, type Category } from '@/lib/types';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent } from '@/components/ui/card';

export default function ShopPage() {
  const [products, setProducts] = useState<(Product & { inventory?: any })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('products').select('*, inventory(*), supplier:suppliers(*)').eq('is_active', true),
        ]);

        if (categoriesRes && categoriesRes.data && categoriesRes.data.length > 0) {
          setCategories(categoriesRes.data);
        } else {
          // Demo categories
          setCategories([
            { id: 1, name: 'Vegetables', description: 'Fresh vegetables' },
            { id: 2, name: 'Fruits', description: 'Fresh fruits' },
            { id: 3, name: 'Dairy', description: 'Dairy products' },
            { id: 4, name: 'Grains', description: 'Grains and cereals' },
          ]);
        }

        if (productsRes && productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data);
        } else {
          // Demo products with images
          setProducts([
            { id: 1, name: 'Tomatoes', description: 'Fresh ripe red tomatoes, perfect for salads and cooking', sku: 'TOM001', unit_price: 2.50, unit: 'kg', category_id: 1, supplier_id: 1, is_active: true, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 250 } },
            { id: 2, name: 'Carrots', description: 'Organic fresh carrots, rich in vitamins', sku: 'CAR001', unit_price: 1.80, unit: 'kg', category_id: 1, supplier_id: 1, is_active: true, image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 320 } },
            { id: 3, name: 'Apples', description: 'Crisp and sweet red apples', sku: 'APP001', unit_price: 3.20, unit: 'kg', category_id: 2, supplier_id: 2, is_active: true, image_url: 'https://images.unsplash.com/photo-1560806887-1295cbd16fbb?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 280 } },
            { id: 4, name: 'Bananas', description: 'Ripe yellow bananas, full of potassium', sku: 'BAN001', unit_price: 1.50, unit: 'kg', category_id: 2, supplier_id: 2, is_active: true, image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 400 } },
            { id: 5, name: 'Fresh Milk', description: 'Pure fresh milk, high in calcium', sku: 'MIL001', unit_price: 1.60, unit: 'liter', category_id: 3, supplier_id: 3, is_active: true, image_url: 'https://images.unsplash.com/photo-1600788148090-efc4bb37c21a?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 180 } },
            { id: 6, name: 'Cheddar Cheese', description: 'Aged sharp cheddar cheese, perfect for cooking', sku: 'CHE001', unit_price: 8.50, unit: 'kg', category_id: 3, supplier_id: 3, is_active: true, image_url: 'https://images.unsplash.com/photo-1589985643862-6cc89ababd45?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 120 } },
            { id: 7, name: 'Basmati Rice', description: 'Premium basmati rice, aromatic and fluffy', sku: 'RIC001', unit_price: 4.50, unit: 'kg', category_id: 4, supplier_id: 4, is_active: true, image_url: 'https://images.unsplash.com/photo-1586080872410-c4260b4da897?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 500 } },
            { id: 8, name: 'Wheat Flour', description: 'All-purpose wheat flour, perfect for baking', sku: 'FLO001', unit_price: 2.20, unit: 'kg', category_id: 4, supplier_id: 4, is_active: true, image_url: 'https://images.unsplash.com/photo-1587869066536-e4db3d2e1276?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 600 } },
          ]);
        }
      } catch (error) {
        // Use demo data on error
        setCategories([
          { id: 1, name: 'Vegetables', description: 'Fresh vegetables' },
          { id: 2, name: 'Fruits', description: 'Fresh fruits' },
          { id: 3, name: 'Dairy', description: 'Dairy products' },
          { id: 4, name: 'Grains', description: 'Grains and cereals' },
        ]);
        setProducts([
          { id: 1, name: 'Tomatoes', description: 'Fresh ripe red tomatoes, perfect for salads and cooking', sku: 'TOM001', unit_price: 2.50, unit: 'kg', category_id: 1, supplier_id: 1, is_active: true, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 250 } },
          { id: 2, name: 'Carrots', description: 'Organic fresh carrots, rich in vitamins', sku: 'CAR001', unit_price: 1.80, unit: 'kg', category_id: 1, supplier_id: 1, is_active: true, image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 320 } },
          { id: 3, name: 'Apples', description: 'Crisp and sweet red apples', sku: 'APP001', unit_price: 3.20, unit: 'kg', category_id: 2, supplier_id: 2, is_active: true, image_url: 'https://images.unsplash.com/photo-1560806887-1295cbd16fbb?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 280 } },
          { id: 4, name: 'Bananas', description: 'Ripe yellow bananas, full of potassium', sku: 'BAN001', unit_price: 1.50, unit: 'kg', category_id: 2, supplier_id: 2, is_active: true, image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 400 } },
          { id: 5, name: 'Fresh Milk', description: 'Pure fresh milk, high in calcium', sku: 'MIL001', unit_price: 1.60, unit: 'liter', category_id: 3, supplier_id: 3, is_active: true, image_url: 'https://images.unsplash.com/photo-1600788148090-efc4bb37c21a?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 180 } },
          { id: 6, name: 'Cheddar Cheese', description: 'Aged sharp cheddar cheese, perfect for cooking', sku: 'CHE001', unit_price: 8.50, unit: 'kg', category_id: 3, supplier_id: 3, is_active: true, image_url: 'https://images.unsplash.com/photo-1589985643862-6cc89ababd45?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 120 } },
          { id: 7, name: 'Basmati Rice', description: 'Premium basmati rice, aromatic and fluffy', sku: 'RIC001', unit_price: 4.50, unit: 'kg', category_id: 4, supplier_id: 4, is_active: true, image_url: 'https://images.unsplash.com/photo-1586080872410-c4260b4da897?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 500 } },
          { id: 8, name: 'Wheat Flour', description: 'All-purpose wheat flour, perfect for baking', sku: 'FLO001', unit_price: 2.20, unit: 'kg', category_id: 4, supplier_id: 4, is_active: true, image_url: 'https://images.unsplash.com/photo-1587869066536-e4db3d2e1276?w=400&h=400&fit=crop', inventory: { quantity_on_hand: 600 } },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  let filteredProducts = products;

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter((p) => p.category_id === selectedCategory);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop All Products</h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === null
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === cat.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-12">
            <CardContent className="text-center">
              <p className="text-gray-600 text-lg">No products found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
