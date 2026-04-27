'use client';

import Link from 'next/link';
import { type Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

interface ProductCardProps {
  product: Product & { inventory?: any; supplier?: any };
}

export default function ProductCard({ product }: ProductCardProps) {
  const availableQuantity = product.inventory?.[0]?.quantity_on_hand || 0;
  const isOutOfStock = availableQuantity <= 0;

  const handleAddToCart = () => {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Find if product already in cart
    const existingItem = cart.find((item: any) => item.product_id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ product_id: product.id, quantity: 1, product });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show toast notification
    console.log('Added to cart:', product.name);
  };

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0 bg-gray-100 h-48 flex items-center justify-center relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center">
            <p className="text-sm">No image</p>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
      </CardContent>

      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2">{product.supplier?.company_name}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description || 'No description available'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.unit_price)}
            </span>
            <span className="text-sm text-gray-500">per {product.unit}</span>
          </div>

          {availableQuantity > 0 && availableQuantity <= 10 && (
            <p className="text-xs text-amber-600 font-semibold">
              Only {availableQuantity.toFixed(0)} left
            </p>
          )}
        </div>
      </div>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
