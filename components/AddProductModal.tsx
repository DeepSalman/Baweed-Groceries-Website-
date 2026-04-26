'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { type Category, type Supplier } from '@/lib/types';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    unit_price: '',
    unit: 'kg',
    category_id: '',
    supplier_id: '',
    image_url: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // Fetch categories and suppliers
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, suppliersRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('suppliers').select('*').eq('is_active', true),
        ]);

        if (categoriesRes.data) {
          setCategories(categoriesRes.data);
        } else {
          // Demo data
          setCategories([
            { id: 1, name: 'Vegetables', description: 'Fresh vegetables', created_at: new Date().toISOString() },
            { id: 2, name: 'Fruits', description: 'Fresh fruits', created_at: new Date().toISOString() },
            { id: 3, name: 'Dairy', description: 'Dairy products', created_at: new Date().toISOString() },
          ]);
        }

        if (suppliersRes.data) {
          setSuppliers(suppliersRes.data);
        } else {
          // Demo data
          setSuppliers([
            {
              id: 1,
              user_id: null,
              company_name: 'Fresh Farms Co.',
              contact_person: 'Ahmed',
              email: 'farms@example.com',
              phone: null,
              address: null,
              city: null,
              state: null,
              postal_code: null,
              country: null,
              payment_terms: null,
              tax_id: null,
              bank_name: null,
              bank_account: null,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use demo data on error
        setCategories([
          { id: 1, name: 'Vegetables', description: 'Fresh vegetables', created_at: new Date().toISOString() },
          { id: 2, name: 'Fruits', description: 'Fresh fruits', created_at: new Date().toISOString() },
          { id: 3, name: 'Dairy', description: 'Dairy products', created_at: new Date().toISOString() },
        ]);
        setSuppliers([
          {
            id: 1,
            user_id: null,
            company_name: 'Fresh Farms Co.',
            contact_person: 'Ahmed',
            email: 'farms@example.com',
            phone: null,
            address: null,
            city: null,
            state: null,
            postal_code: null,
            country: null,
            payment_terms: null,
            tax_id: null,
            bank_name: null,
            bank_account: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setFetchingData(false);
      }
    }

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }
    if (!formData.sku.trim()) {
      toast.error('SKU is required');
      return false;
    }
    if (!formData.unit_price || parseFloat(formData.unit_price) <= 0) {
      toast.error('Price must be greater than 0');
      return false;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return false;
    }
    if (!formData.supplier_id) {
      toast.error('Please select a supplier');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Insert product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            description: formData.description || null,
            sku: formData.sku,
            unit_price: parseFloat(formData.unit_price),
            unit: formData.unit,
            category_id: parseInt(formData.category_id),
            supplier_id: parseInt(formData.supplier_id),
            image_url: formData.image_url || null,
            is_active: true,
          },
        ])
        .select();

      if (productError) {
        toast.error(`Error creating product: ${productError.message}`);
        return;
      }

      // Create inventory record for the new product
      if (productData && productData.length > 0) {
        const productId = productData[0].id;

        const { error: inventoryError } = await supabase
          .from('inventory')
          .insert([
            {
              product_id: productId,
              quantity_on_hand: 0,
              quantity_reserved: 0,
              reorder_level: 10,
              reorder_quantity: 50,
            },
          ]);

        if (inventoryError) {
          console.error('Error creating inventory:', inventoryError);
        }
      }

      toast.success('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        sku: '',
        unit_price: '',
        unit: 'kg',
        category_id: '',
        supplier_id: '',
        image_url: '',
      });
      onProductAdded();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while creating the product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Fresh Tomatoes"
              required
              disabled={loading || fetchingData}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product description (optional)"
              disabled={loading || fetchingData}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              rows={3}
            />
          </div>

          {/* SKU and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Stock Keeping Unit) *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="e.g., TOM-001"
                required
                disabled={loading || fetchingData}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price (AED) *</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                disabled={loading || fetchingData}
              />
            </div>
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unit of Measurement *</Label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              disabled={loading || fetchingData}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="liter">Liter (L)</option>
              <option value="ml">Milliliter (ml)</option>
              <option value="unit">Unit</option>
              <option value="dozen">Dozen</option>
              <option value="box">Box</option>
            </select>
          </div>

          {/* Category and Supplier */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                disabled={loading || fetchingData}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier_id">Supplier *</Label>
              <select
                id="supplier_id"
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleInputChange}
                required
                disabled={loading || fetchingData}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select a supplier</option>
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.company_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg (optional)"
              type="url"
              disabled={loading || fetchingData}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || fetchingData}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={loading || fetchingData}
            >
              {loading ? 'Creating...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
