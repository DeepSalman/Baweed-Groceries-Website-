import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, quantity_on_hand, reorder_level, reorder_quantity } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if inventory record exists
    const { data: existingInventory } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', product_id)
      .single();

    if (existingInventory) {
      // Update existing inventory
      const { error } = await supabase
        .from('inventory')
        .update({
          quantity_on_hand: quantity_on_hand !== undefined ? quantity_on_hand : existingInventory.quantity_on_hand,
          reorder_level: reorder_level !== undefined ? reorder_level : existingInventory.reorder_level,
          reorder_quantity: reorder_quantity !== undefined ? reorder_quantity : existingInventory.reorder_quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('product_id', product_id);

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update inventory' },
          { status: 500 }
        );
      }
    } else {
      // Create new inventory record
      const { error } = await supabase
        .from('inventory')
        .insert({
          product_id,
          quantity_on_hand: quantity_on_hand || 100,
          quantity_reserved: 0,
          reorder_level: reorder_level || 10,
          reorder_quantity: reorder_quantity || 50,
          last_restocked: new Date().toISOString(),
        });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to create inventory record' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Inventory updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Inventory update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      // Get all inventory
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('product_id');

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch inventory' },
          { status: 500 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Get specific inventory
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', product_id)
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Inventory not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
