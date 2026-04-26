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

        if (categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (productsRes.data) {
          setProducts(productsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
