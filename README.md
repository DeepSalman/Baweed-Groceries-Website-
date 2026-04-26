# Baweed Groceries - E-Commerce Platform

A comprehensive e-commerce platform for online grocery delivery built with Next.js, Supabase, and React.

## Project Overview

Baweed Groceries is a full-featured e-commerce system that manages the buying and selling of groceries and produce. The platform supports three user roles:

- **Customers**: Browse products, add to cart, checkout with payment, track orders
- **Suppliers**: Manage products, track inventory, receive invoices
- **Admins**: Manage products, suppliers, orders, inventory, and generate supplier invoices

## Tech Stack

- **Frontend**: Next.js 16.2.4 with TypeScript
- **UI Framework**: Shadcn/UI components with Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

## Features Implemented

### Customer Portal
- ✅ Product browsing with category filtering and search
- ✅ Shopping cart with add/remove/update quantity
- ✅ Checkout with delivery address and payment card options
- ✅ Simulated payment card system
- ✅ Order history and order tracking
- ✅ User profile management
- ✅ Mock email notifications for orders

### Admin Dashboard
- ✅ Dashboard with key metrics (orders, revenue, products, suppliers)
- ✅ Product management with CRUD operations
- ✅ Supplier management
- ✅ Inventory tracking and low stock alerts
- ✅ Order management with status tracking
- ✅ Supplier invoice generation
- ✅ Email logs for notifications

### Database
- ✅ 10 core tables: profiles, categories, suppliers, products, inventory, payment_cards, orders, order_items, invoices, invoice_items, email_logs
- ✅ Row Level Security (RLS) policies for data protection
- ✅ Automatic profile creation on user signup
- ✅ Comprehensive indexes for performance

### API Routes
- ✅ Orders API (GET, POST with authentication)
- ✅ Products API (GET, POST with supplier/admin authorization)
- ✅ Inventory API (GET, PATCH with admin authorization)

## Project Structure

```
app/
├── page.tsx                 # Home page
├── login/                   # Login page
├── register/               # Registration page
├── shop/                    # Product listing
├── cart/                    # Shopping cart
├── checkout/               # Checkout process
├── profile/                # User profile
├── orders/                 # Order management
│   └── [id]/              # Order details
├── admin/                  # Admin dashboard
│   ├── page.tsx           # Dashboard overview
│   ├── products/          # Product management
│   ├── suppliers/         # Supplier management
│   ├── orders/            # Order management
│   ├── inventory/         # Inventory management
│   ├── invoices/          # Invoice management
│   └── emails/            # Email logs
└── api/                    # API routes
    ├── orders/
    ├── products/
    └── inventory/

components/
├── Header.tsx             # Navigation header
├── ProductCard.tsx        # Product card component
└── ui/                    # Shadcn UI components

lib/
├── supabase.ts           # Supabase client
└── types.ts              # TypeScript types

scripts/
├── setup-database.sql    # Database schema
└── seed-data.js          # Seed data script
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open http://localhost:3000 in your browser

### Database Setup

The database schema has been created and is ready to use. Key tables include:

- **profiles**: Extended user information
- **products**: Grocery items for sale
- **suppliers**: Suppliers providing products
- **orders**: Customer orders
- **inventory**: Stock management
- **payment_cards**: Simulated payment cards
- **invoices**: Monthly supplier invoices
- **email_logs**: Mock email records

## Authentication

The platform uses Supabase Auth with email/password authentication. Users can register as either:
- **Customer**: Standard user for shopping
- **Supplier**: Can manage products and view invoices

Admin users are created directly in the database with role='admin'.

## Payment System

The payment system uses simulated credit/debit cards stored in the database. When checking out, customers can:
- Use a saved card
- Add a new card with option to save it
- The system validates card details before processing

## Invoicing System

Monthly invoices are generated for suppliers based on orders that include their products. Admins can:
- View all invoices
- Track payment status
- Mark invoices as paid
- Download invoice PDFs (functionality to be added)

## Future Enhancements

- Invoice PDF generation and download
- Advanced analytics dashboard
- Real payment gateway integration (Stripe)
- Email service integration (Resend/SendGrid)
- Inventory reorder automation
- Product ratings and reviews
- Wishlist functionality
- Bulk order management
- Multi-language support
- SMS notifications

## Development Notes

### Component Development
- All pages and components follow Next.js 16 app router conventions
- Client components use 'use client' directive for interactivity
- Supabase client is configured in lib/supabase.ts
- UI components use Shadcn/UI for consistency

### Database Access
- All queries go through Supabase client
- RLS policies enforce data access control
- Service role key is only used for server-side operations

### State Management
- Local state with useState for component-level data
- localStorage for cart persistence
- SWR can be integrated for client-side caching

## Support

For issues or questions, please refer to the project documentation or contact the development team.

## License

Proprietary - Baweed Groceries Ltd
