'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { type Product, type Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import { Leaf, ShoppingCart } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<(Product & { inventory?: any })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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
          // Demo products
          setProducts([
            { id: 1, name: 'Tomatoes', description: 'Fresh red tomatoes', sku: 'TOM001', unit_price: 45, unit: 'kg', category_id: 1, supplier_id: 1, is_active: true, inventory: { quantity_on_hand: 100 } },
            { id: 2, name: 'Carrots', description: 'Organic carrots', sku: 'CAR001', unit_price: 35, unit: 'kg', category_id: 1, supplier_id: 1, is_active: true, inventory: { quantity_on_hand: 80 } },
            { id: 3, name: 'Apples', description: 'Fresh apples', sku: 'APP001', unit_price: 80, unit: 'kg', category_id: 2, supplier_id: 2, is_active: true, inventory: { quantity_on_hand: 60 } },
            { id: 4, name: 'Bananas', description: 'Yellow bananas', sku: 'BAN001', unit_price: 40, unit: 'kg', category_id: 2, supplier_id: 2, is_active: true, inventory: { quantity_on_hand: 120 } },
            { id: 5, name: 'Milk', description: 'Fresh milk', sku: 'MIL001', unit_price: 60, unit: 'liter', category_id: 3, supplier_id: 3, is_active: true, inventory: { quantity_on_hand: 50 } },
            { id: 6, name: 'Cheese', description: 'Cheddar cheese', sku: 'CHE001', unit_price: 200, unit: 'kg', category_id: 3, supplier_id: 3, is_active: true, inventory: { quantity_on_hand: 30 } },
            { id: 7, name: 'Rice', description: 'Basmati rice', sku: 'RIC001', unit_price: 90, unit: 'kg', category_id: 4, supplier_id: 4, is_active: true, inventory: { quantity_on_hand: 200 } },
            { id: 8, name: 'Wheat Flour', description: 'All-purpose flour', sku: 'FLO001', unit_price: 50, unit: 'kg', category_id: 4, supplier_id: 4, is_active: true, inventory: { quantity_on_hand: 150 } },
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
          { id: 1, name: 'Tomatoes', description: 'Fresh red tomatoes', sku: 'TOM001', unit_price: 45, unit: 'kg', category_id: 1, supplier_id: 1, is_active: true, inventory: { quantity_on_hand: 100 } },
          { id: 2, name: 'Carrots', description: 'Organic carrots', sku: 'CAR001', unit_price: 35, unit: 'kg', category_id: 1, supplier_id: 1, is_active: true, inventory: { quantity_on_hand: 80 } },
          { id: 3, name: 'Apples', description: 'Fresh apples', sku: 'APP001', unit_price: 80, unit: 'kg', category_id: 2, supplier_id: 2, is_active: true, inventory: { quantity_on_hand: 60 } },
          { id: 4, name: 'Bananas', description: 'Yellow bananas', sku: 'BAN001', unit_price: 40, unit: 'kg', category_id: 2, supplier_id: 2, is_active: true, inventory: { quantity_on_hand: 120 } },
          { id: 5, name: 'Milk', description: 'Fresh milk', sku: 'MIL001', unit_price: 60, unit: 'liter', category_id: 3, supplier_id: 3, is_active: true, inventory: { quantity_on_hand: 50 } },
          { id: 6, name: 'Cheese', description: 'Cheddar cheese', sku: 'CHE001', unit_price: 200, unit: 'kg', category_id: 3, supplier_id: 3, is_active: true, inventory: { quantity_on_hand: 30 } },
          { id: 7, name: 'Rice', description: 'Basmati rice', sku: 'RIC001', unit_price: 90, unit: 'kg', category_id: 4, supplier_id: 4, is_active: true, inventory: { quantity_on_hand: 200 } },
          { id: 8, name: 'Wheat Flour', description: 'All-purpose flour', sku: 'FLO001', unit_price: 50, unit: 'kg', category_id: 4, supplier_id: 4, is_active: true, inventory: { quantity_on_hand: 150 } },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Fresh Groceries, <span className="text-green-600">Delivered Daily</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Order fresh vegetables, fruits, and quality groceries from trusted suppliers. Get fast delivery to your doorstep.
              </p>
              <div className="flex gap-4">
                <Link href="/shop">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex flex-1 justify-end">
              <Leaf className="w-48 h-48 text-green-300 opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-4 rounded-lg font-semibold transition ${
                selectedCategory === null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-lg font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : 'All Products'}
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-12">
              <CardContent className="text-center">
                <p className="text-gray-600 text-lg">No products found in this category.</p>
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
      </section>
    </main>
  );
}
