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
          // Demo categories with images
          setCategories([
            { id: 1, name: 'Vegetables', description: 'Fresh vegetables', image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop' },
            { id: 2, name: 'Fruits', description: 'Fresh fruits', image_url: 'https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=400&h=300&fit=crop' },
            { id: 3, name: 'Dairy', description: 'Dairy products', image_url: 'https://images.unsplash.com/photo-1597318351265-e7e4e9a67a6f?w=400&h=300&fit=crop' },
            { id: 4, name: 'Grains', description: 'Grains and cereals', image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd57e4b?w=400&h=300&fit=crop' },
          ]);
        }
        }

        if (productsRes && productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data);
        } else {
          // Demo products with images and stock
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
        // Use demo data on error with images and stock
        setCategories([
          { id: 1, name: 'Vegetables', description: 'Fresh vegetables', image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop' },
          { id: 2, name: 'Fruits', description: 'Fresh fruits', image_url: 'https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=400&h=300&fit=crop' },
          { id: 3, name: 'Dairy', description: 'Dairy products', image_url: 'https://images.unsplash.com/photo-1597318351265-e7e4e9a67a6f?w=400&h=300&fit=crop' },
          { id: 4, name: 'Grains', description: 'Grains and cereals', image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd57e4b?w=400&h=300&fit=crop' },
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`relative h-48 rounded-lg overflow-hidden font-semibold transition ${
                selectedCategory === null
                  ? 'ring-4 ring-green-600'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold text-center px-2">All Products</span>
              </div>
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative h-48 rounded-lg overflow-hidden font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'ring-4 ring-green-600'
                    : 'hover:shadow-lg'
                }`}
              >
                {cat.image_url && (
                  <img 
                    src={cat.image_url} 
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-center px-2">{cat.name}</span>
                </div>
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
