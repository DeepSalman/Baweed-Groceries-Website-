export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'customer' | 'admin' | 'supplier';
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Supplier {
  id: number;
  user_id: string | null;
  company_name: string;
  contact_person: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  payment_terms: string | null;
  tax_id: string | null;
  bank_name: string | null;
  bank_account: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  supplier_id: number;
  category_id: number;
  name: string;
  description: string | null;
  sku: string;
  unit_price: number;
  unit: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: number;
  product_id: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  reorder_level: number;
  reorder_quantity: number;
  last_restocked: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentCard {
  id: number;
  user_id: string;
  card_number: string;
  card_holder_name: string;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_postal_code: string;
  delivery_country: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  payment_card_id: number | null;
  notes: string | null;
  ordered_at: string;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  supplier_id: number;
  month_year: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paid_on: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface EmailLog {
  id: number;
  recipient_email: string;
  recipient_name: string | null;
  subject: string;
  email_type: string;
  body: string | null;
  related_order_id: number | null;
  related_invoice_id: number | null;
  status: 'sent' | 'failed' | 'bounced';
  sent_at: string;
  created_at: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  product?: Product & { inventory?: Inventory; supplier?: Supplier };
}
